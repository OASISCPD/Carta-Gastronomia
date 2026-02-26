import React, { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  src: string;
  alt: string;
}

export const ImageModal: React.FC<ImageModalProps> = ({
  isOpen,
  onClose,
  src,
  alt,
}) => {
  const [stage, setStage] = useState<"primary" | "fallback" | "failed">(
    "primary",
  );

  const fallbackSrc = useMemo(() => {
    const idMatch =
      src.match(/[?&]id=([^&]+)/) ||
      src.match(/\/d\/([^/]+)/) ||
      src.match(/googleusercontent\.com\/d\/([^=/?]+)/);
    const id = idMatch?.[1];
    return id ? `https://drive.google.com/thumbnail?id=${id}&sz=w1600` : null;
  }, [src]);

  const currentSrc = stage === "primary" ? src : fallbackSrc;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-white/90 backdrop-blur-xl transition-all duration-300"
      onClick={onClose}
    >
      <div className="absolute top-6 right-6 z-[110]">
        <button
          onClick={onClose}
          className="p-3 bg-slate-900 text-white rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all"
        >
          <X size={24} />
        </button>
      </div>

      <div
        className="relative max-w-5xl w-full max-h-[85vh] p-4 flex items-center justify-center animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative group overflow-hidden rounded-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-slate-200 bg-white">
          {stage === "failed" || !currentSrc ? (
            <div className="w-[80vw] max-w-4xl h-[60vh] max-h-[80vh] bg-slate-50 flex items-center justify-center text-slate-400 text-sm uppercase tracking-wider">
              Sin imagen disponible
            </div>
          ) : (
            <img
              src={currentSrc}
              alt={alt}
              className="w-full h-full object-contain max-h-[80vh] bg-slate-50"
              onError={() => {
                if (stage === "primary" && fallbackSrc && fallbackSrc !== src) {
                  setStage("fallback");
                  return;
                }
                setStage("failed");
              }}
            />
          )}
          <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-slate-900/40 to-transparent">
            <h3 className="text-white font-bold text-xl drop-shadow-md">
              {alt}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};
