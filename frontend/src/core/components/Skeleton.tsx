import React from "react";

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = "" }) => (
  <div className={`animate-pulse bg-slate-200 rounded ${className}`} />
);

export const MenuItemSkeleton = () => (
  <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm flex flex-col h-full">
    {/* Image placeholder */}
    <Skeleton className="w-full h-44 sm:h-48" />

    <div className="p-4 sm:p-5 flex flex-col space-y-3">
      {/* Title placeholder */}
      <Skeleton className="h-6 w-3/4" />

      {/* Description lines */}
      <div className="space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
      </div>

      {/* Footer / Price placeholder */}
      <div className="pt-3 mt-auto border-t border-slate-50 flex justify-between items-center">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-12" />
      </div>
    </div>
  </div>
);

export const ChefSuggestionSkeleton = () => (
  <div className="relative mx-4 mb-10 px-6 py-8 bg-white border border-slate-100 rounded-2xl shadow-md overflow-hidden">
    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="flex-1 flex flex-col items-center gap-4">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-3 w-40" />
      </div>

      <div className="relative">
        <Skeleton className="w-28 h-28 rounded-full" />
      </div>

      <div className="flex-1 flex flex-col items-center gap-2">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  </div>
);
