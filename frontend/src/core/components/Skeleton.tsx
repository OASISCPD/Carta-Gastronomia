import React from "react";

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = "" }) => (
  <div
    className={`animate-pulse rounded-xl bg-[linear-gradient(90deg,rgba(255,255,255,0.06),rgba(204,172,51,0.14),rgba(255,255,255,0.06))] bg-[length:200%_100%] ${className}`}
  />
);

export const MenuItemSkeleton = () => (
  <div className="h-full rounded-2xl border border-[var(--line-subtle)] bg-[var(--surface-2)] p-4 sm:p-5 shadow-sm shadow-black/35">
    <div className="mb-5 flex items-start justify-end">
      <Skeleton className="h-9 w-24 rounded-lg" />
    </div>

    <div className="space-y-3">
      <Skeleton className="h-6 w-4/5" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>

    <div className="mt-8 flex items-center justify-between gap-3 border-t border-[var(--line-subtle)]/80 pt-3">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-4 w-20" />
    </div>
  </div>
);

const SKELETON_SLOTS = [
  "alpha",
  "bravo",
  "charlie",
  "delta",
  "echo",
  "foxtrot",
  "golf",
  "hotel",
  "india",
  "juliet",
  "kilo",
  "lima",
] as const;

export const MenuGridSkeleton: React.FC<{ items?: number }> = ({ items = 8 }) => (
  <>
    {SKELETON_SLOTS.slice(0, items).map((slot) => (
      <MenuItemSkeleton key={`menu-skeleton-${slot}`} />
    ))}
  </>
);

export const ChefSuggestionSkeleton = () => (
  <div className="relative mx-4 mb-10 overflow-hidden rounded-2xl border border-[var(--line-subtle)] bg-[var(--surface-2)] px-6 py-8 shadow-md shadow-black/30">
    <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
      <div className="flex flex-1 flex-col items-center gap-4">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-3 w-40" />
      </div>

      <div className="relative">
        <Skeleton className="h-28 w-28 rounded-full" />
      </div>

      <div className="flex flex-1 flex-col items-center gap-2">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  </div>
);
