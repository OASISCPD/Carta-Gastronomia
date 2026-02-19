/**
 * Simple in-memory queue for Google Sheets write operations.
 * Retries up to 3 times with exponential backoff on failure.
 */

type SheetsJob = {
  id: string;
  fn: () => Promise<any>;
  retries: number;
  maxRetries: number;
};

const queue: SheetsJob[] = [];
let processing = false;

async function processQueue() {
  if (processing || queue.length === 0) return;
  processing = true;

  while (queue.length > 0) {
    const job = queue.shift()!;
    try {
      await job.fn();
      console.log(`[SHEETS QUEUE] ✅ Job ${job.id} completed`);
    } catch (err: any) {
      if (job.retries < job.maxRetries) {
        job.retries++;
        const delay = Math.pow(2, job.retries) * 1000; // 2s, 4s, 8s
        console.warn(
          `[SHEETS QUEUE] ⚠️ Job ${job.id} failed (attempt ${job.retries}/${job.maxRetries}), retrying in ${delay}ms:`,
          err?.message,
        );
        await new Promise((r) => setTimeout(r, delay));
        queue.unshift(job); // Re-add to front of queue
      } else {
        console.error(
          `[SHEETS QUEUE] ❌ Job ${job.id} failed after ${job.maxRetries} attempts:`,
          err?.message,
        );
      }
    }
  }

  processing = false;
}

/**
 * Enqueue a Sheets write operation.
 * @param jobId - Human-readable ID for logging (e.g. "update-prod-abc123")
 * @param fn - The async function to execute (e.g. updateProductoInSheet call)
 */
export function enqueueSheetsWrite(jobId: string, fn: () => Promise<any>) {
  queue.push({ id: jobId, fn, retries: 0, maxRetries: 3 });
  // Kick off processing on next tick
  setImmediate(() => processQueue());
}

export function getQueueLength(): number {
  return queue.length;
}
