import React from "react";
import {
  Menu,
  Pizza,
  HandMetal,
  UtensilsCrossed,
  Tag,
  Wine,
  Grape,
  GlassWater,
  IceCream,
  Coffee,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const categoryIcons: Record<string, LucideIcon> = {
  all: Menu,
  "PIZZA Y EMPANADA": Pizza,
  PIZZAYEMPANADA: Pizza,
  SANDWICHERIA: HandMetal,
  SNACK: UtensilsCrossed,
  "PROMO LUNES": Tag,
  "PROMO MARTES": Tag,
  "PROMO MIERCOLES": Tag,
  "PROMO JUEVES Y DOMINGO": Tag,
  PROMOCIONES: Tag,
  COCTELERIA: Wine,
  VINOS: Grape,
  ESPUMANTES: GlassWater,
  WISHKY: GlassWater,
  POSTRE: IceCream,
  CAFETERIA: Coffee,
};

const normalizeCategoryKey = (value: string): string => {
  return value
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "");
};

const formatCategoryLabel = (value: string): string => {
  if (normalizeCategoryKey(value) === "PIZZAYEMPANADA") {
    return "Pizza y Empanada";
  }
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
};

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
}) => {
  const getIcon = (category: string) => {
    return (
      categoryIcons[category] ||
      categoryIcons[normalizeCategoryKey(category)] ||
      Sparkles
    );
  };

  return (
    <div className="py-3 sm:py-4 relative">
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-2.5 sm:gap-3 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => onCategoryChange("all")}
            className={`flex-shrink-0 flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 border ${
              selectedCategory === "all"
                ? "bg-gradient-to-r from-[var(--gold-light)] via-[var(--gold-primary)] to-[var(--gold-dark)] text-black border-transparent shadow-lg shadow-amber-300/40 ring-1 ring-amber-200/60"
                : "bg-white/90 text-slate-600 border-slate-200 hover:bg-white hover:border-[var(--gold-primary)]/50 hover:text-[var(--gold-primary)] hover:shadow-md hover:shadow-slate-200/80"
            }`}
          >
            {React.createElement(getIcon("all"), { size: 16 })}
            <span>Todos</span>
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`flex-shrink-0 flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 border whitespace-nowrap ${
                selectedCategory === category
                  ? "bg-gradient-to-r from-[var(--gold-light)] via-[var(--gold-primary)] to-[var(--gold-dark)] text-black border-transparent shadow-lg shadow-amber-300/40 ring-1 ring-amber-200/60"
                  : "bg-white/90 text-slate-600 border-slate-200 hover:bg-white hover:border-[var(--gold-primary)]/50 hover:text-[var(--gold-primary)] hover:shadow-md hover:shadow-slate-200/80"
              }`}
            >
              {React.createElement(getIcon(category), { size: 16 })}
              <span>{formatCategoryLabel(category)}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;
