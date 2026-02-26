import React, { useMemo, useState } from "react";

interface ProgressiveImageProps {
  src: string;
  alt: string;
  className?: string;
}

type LoadStage = "primary" | "fallback" | "failed";

const extractDriveId = (url: string): string | null => {
  const idMatch =
    url.match(/[?&]id=([^&]+)/) ||
    url.match(/\/d\/([^/]+)/) ||
    url.match(/googleusercontent\.com\/d\/([^=/?]+)/);

  return idMatch?.[1] ?? null;
};

const getAlternativeDriveUrl = (url: string): string | null => {
  const id = extractDriveId(url);
  if (!id) return null;
  return `https://drive.google.com/thumbnail?id=${id}&sz=w1200`;
};

export const ProgressiveImage: React.FC<ProgressiveImageProps> = ({
  src,
  alt,
  className = "",
}) => {
  const [stage, setStage] = useState<LoadStage>("primary");
  const fallbackSrc = useMemo(() => getAlternativeDriveUrl(src), [src]);

  const currentSrc = stage === "primary" ? src : fallbackSrc;

  const handleError = () => {
    if (stage === "primary" && fallbackSrc && fallbackSrc !== src) {
      setStage("fallback");
      return;
    }
    setStage("failed");
  };

  if (stage === "failed" || !currentSrc) {
    return (
      <div className={`w-full h-full bg-slate-100 ${className}`} aria-label={alt}>
        <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs uppercase tracking-wider">
          Sin imagen
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        src={currentSrc}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-700"
        onError={handleError}
      />
    </div>
  );
};
