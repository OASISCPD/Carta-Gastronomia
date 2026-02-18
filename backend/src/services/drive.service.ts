import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';
import { google } from 'googleapis';

const defaultKeyPath = path.resolve(__dirname, '../../credentials/service-account.json');

async function getDriveClient() {
  const keyFile = process.env.GOOGLE_APPLICATION_CREDENTIALS || defaultKeyPath;
  const auth = new google.auth.GoogleAuth({
    keyFilename: fs.existsSync(keyFile) ? keyFile : undefined,
    scopes: ['https://www.googleapis.com/auth/drive'],
  });
  const authClient = await auth.getClient();
  return google.drive({ version: 'v3', auth: authClient as any });
}

export interface UploadResult {
  fileId: string;
  fileName: string;
  webViewLink: string | null;
  webContentLink: string | null;
  /** Link directo para usar como src en <img> */
  directLink: string;
}

/**
 * Sube una imagen a Google Drive en la carpeta DRIVE_FOLDER_ID
 * y devuelve los links de acceso.
 */
export async function uploadImageToDrive(
  buffer: Buffer,
  filename: string,
  mimeType: string
): Promise<UploadResult> {
  const drive = await getDriveClient();
  const folderId = process.env.DRIVE_FOLDER_ID || undefined;

  // Convertir buffer a stream (la API de Drive lo requiere)
  const bufferStream = new Readable();
  bufferStream.push(buffer);
  bufferStream.push(null);

  // Subir archivo
  const createRes = await drive.files.create({
    requestBody: {
      name: filename,
      mimeType,
      parents: folderId ? [folderId] : undefined,
    },
    media: {
      mimeType,
      body: bufferStream,
    },
    fields: 'id, name, webViewLink, webContentLink',
  });

  const fileId = createRes.data.id!;

  // Hacer el archivo públicamente legible (para usar el link como src de imagen)
  await drive.permissions.create({
    fileId,
    requestBody: { role: 'reader', type: 'anyone' },
  });

  return {
    fileId,
    fileName: createRes.data.name || filename,
    webViewLink: createRes.data.webViewLink || null,
    webContentLink: createRes.data.webContentLink || null,
    // Link directo optimizado para embeber en <img src="...">
    directLink: `https://drive.google.com/uc?export=view&id=${fileId}`,
  };
}

/**
 * Elimina un archivo de Google Drive por su fileId
 */
export async function deleteImageFromDrive(fileId: string): Promise<void> {
  const drive = await getDriveClient();
  await drive.files.delete({ fileId });
  console.log(`🗑️ Archivo ${fileId} eliminado de Google Drive`);
}
