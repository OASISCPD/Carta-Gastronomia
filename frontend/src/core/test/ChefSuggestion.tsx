import React from "react";
import { Sparkles } from "lucide-react";
import type { MenuItem } from "../types";

interface ChefSuggestionProps {
  suggestion: MenuItem;
}

const ChefSuggestion: React.FC<ChefSuggestionProps> = ({ suggestion }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="relative mx-4 mb-10 group">
      <div className="absolute -inset-[1px] bg-gradient-to-r from-transparent via-[var(--gold-primary)]/20 to-transparent rounded-2xl blur-[1px]" />

      <div className="relative bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xl shadow-amber-900/5">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] opacity-10 pointer-events-none" />

        <div className="p-0.5">
          <div className="border border-[var(--gold-primary)]/10 rounded-[14px] p-4 sm:p-6">
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-4 text-center">
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
                      <span className="w-4 h-[1px] bg-slate-200" />
                      <span className="animate-gold-breathing">
                        Recomendacion
                      </span>
                      <span className="w-4 h-[1px] bg-slate-200" />
                    </p>
                  </div>
                </div>

                <div className="relative px-2">
                  <div className="absolute -inset-4 bg-amber-100/50 rounded-full blur-xl" />
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-gradient-to-tr from-[var(--gold-dark)] via-[var(--gold-light)] to-[var(--gold-dark)]">
                    <div className="w-full h-full rounded-full overflow-hidden border border-white/50">
                      <img
                        src="https://images.pexels.com/photos/1516415/pexels-photo-1516415.jpeg?auto=compress&cs=tinysrgb&w=400"
                        alt={suggestion["nombre largo"]}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[9px] text-slate-400 tracking-[0.3em] font-bold uppercase">
                    Precio en salon
                  </span>
                  <div className="flex flex-col items-center">
                    <span
                      className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tighter"
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                    >
                      {formatPrice(suggestion.monto)}
                    </span>
                    <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[var(--gold-primary)]/20 to-transparent" />
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
