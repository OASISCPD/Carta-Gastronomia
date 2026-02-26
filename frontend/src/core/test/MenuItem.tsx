import React from "react";
import type { MenuItem } from "../types";
import { ProgressiveImage } from "../components/ProgressiveImage";
import { ImageOff } from "lucide-react";

interface MenuItemProps {
  item: MenuItem;
  onImageClick?: (src: string, alt: string) => void;
}

export const MenuComponent: React.FC<MenuItemProps> = ({
  item,
  onImageClick,
}) => {
  const imageUrl = item.url_image || null;

  const formatPrice = (price: number | null) => {
    if (price === null) return "$ 0";
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatName = (name: string) => {
    return name.split("(")[0].trim();
  };

  return (
    <article className="group relative rounded-2xl p-[1px] bg-gradient-to-br from-amber-200/70 via-white to-slate-200/70 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-amber-200/30">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-amber-300/25 to-transparent opacity-0 -translate-x-8 group-hover:opacity-100 group-hover:translate-x-8 transition-all duration-700 pointer-events-none" />
      <div className="glass rounded-2xl overflow-hidden transition-all duration-500 flex flex-col h-full border border-slate-100 bg-white/95 backdrop-blur-sm">
      {/* Image Container — always same height */}
      <button
        className="relative h-44 sm:h-48 overflow-hidden cursor-zoom-in"
        onClick={() =>
          imageUrl && onImageClick?.(imageUrl, item["nombre largo"])
        }
        type="button"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/25 via-transparent to-transparent opacity-70 z-10 pointer-events-none" />
        {imageUrl ? (
          <ProgressiveImage
            key={imageUrl}
            src={imageUrl}
            alt={item["nombre largo"]}
            className="w-full h-full group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          /* 404-style placeholder — same as backoffice no-image pattern */
          <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex flex-col items-center justify-center gap-2">
            <ImageOff className="w-10 h-10 text-slate-300" strokeWidth={1.5} />
            <span className="text-[11px] text-slate-400 font-medium tracking-wider uppercase">
              Sin imagen
            </span>
          </div>
        )}

        {/* Price Badge — always in the same position */}
        <div className="absolute bottom-3 right-3 z-20">
          <span className="px-3 py-1.5 rounded-lg text-sm sm:text-base font-bold bg-white/90 backdrop-blur-md text-slate-900 border border-amber-200/70 shadow-xl shadow-slate-900/10">
            {formatPrice(item.monto)}
          </span>
        </div>
      </button>

      {/* Content */}
      <div className="p-4 sm:p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-base sm:text-lg font-bold text-slate-800 leading-tight group-hover:text-[var(--gold-primary)] transition-colors">
            {formatName(item["nombre largo"])}
          </h3>
        </div>

        {/* Footer — reserved for future description */}
        <div className="flex items-center justify-between pt-3 mt-auto border-t border-slate-100">
          {item["monto individual"] && (
            <span className="text-xs text-slate-400">
              Individual:{" "}
              <span className="text-[var(--gold-primary)] font-semibold">
                {formatPrice(item["monto individual"])}
              </span>
            </span>
          )}
        </div>
      </div>
      </div>
    </article>
  );
};
