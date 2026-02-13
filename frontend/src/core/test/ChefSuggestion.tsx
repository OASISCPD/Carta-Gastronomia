import React from "react";
import { Sparkles } from "lucide-react";
import type { MenuItem } from "../types";
import { ProgressiveImage } from "../components/ProgressiveImage";

interface ChefSuggestionProps {
  suggestion: MenuItem;
  onImageClick?: (src: string, alt: string) => void;
}

const ChefSuggestion: React.FC<ChefSuggestionProps> = ({
  suggestion,
  onImageClick,
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="relative mx-4 mb-10 group">
      {/* Premium Outer Frame */}
      <div className="absolute -inset-[1px] bg-gradient-to-r from-transparent via-[var(--gold-primary)]/20 to-transparent rounded-2xl blur-[1px]"></div>

      <div className="relative bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xl shadow-amber-900/5">
        <div className="p-0.5">
          {/* Inner Golden Border */}
          <div className="border border-[var(--gold-primary)]/10 rounded-[14px] p-4 sm:p-6">
            <div className="max-w-6xl mx-auto">
              {/* Horizontal Layout for Space Efficiency */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-4 text-center">
                {/* Left: Branding & Info (Centered internally) */}
                <div className="flex-1 flex flex-col items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Sparkles
                      className="text-[var(--gold-primary)]"
                      size={16}
                    />
                    <h2
                      className="text-sm sm:text-base font-bold tracking-[0.25em] text-[var(--gold-primary)] uppercase"
                      style={{ fontFamily: "'Cinzel', serif" }}
                    >
                      Sugerencia
                    </h2>
                    <Sparkles
                      className="text-[var(--gold-primary)]"
                      size={16}
                    />
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-tight">
                      {suggestion["nombre largo"]}
                    </h3>
                    <p className="text-slate-400 text-[10px] sm:text-xs font-semibold tracking-[0.15em] uppercase flex items-center justify-center gap-2">
                      <span className="w-4 h-[1px] bg-slate-200"></span>
                      <span className="animate-gold-breathing text-[var(--gold-primary)]">
                        Recomendación
                      </span>
                      <span className="w-4 h-[1px] bg-slate-200"></span>
                    </p>
                  </div>
                </div>

                {/* Center: Image (Compact Frame) */}
                <div className="relative px-2">
                  <div className="absolute -inset-4 bg-amber-100/50 rounded-full blur-xl"></div>
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-gradient-to-tr from-[var(--gold-dark)] via-[var(--gold-light)] to-[var(--gold-dark)]">
                    <div
                      className="w-full h-full rounded-full overflow-hidden border border-white/50 cursor-zoom-in"
                      onClick={() =>
                        onImageClick?.(
                          "https://images.pexels.com/photos/1516415/pexels-photo-1516415.jpeg?auto=compress&cs=tinysrgb&w=1200",
                          suggestion["nombre largo"],
                        )
                      }
                    >
                      <ProgressiveImage
                        src="https://images.pexels.com/photos/1516415/pexels-photo-1516415.jpeg?auto=compress&cs=tinysrgb&w=400"
                        alt={suggestion["nombre largo"]}
                        className="w-full h-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Right: Price Showcase (Centered internally) */}
                <div className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[9px] text-slate-400 tracking-[0.3em] font-bold uppercase">
                    Precio en Salón
                  </span>
                  <div className="flex flex-col items-center">
                    <span
                      className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tighter"
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                    >
                      {formatPrice(suggestion.monto)}
                    </span>
                    <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[var(--gold-primary)]/20 to-transparent"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChefSuggestion;
