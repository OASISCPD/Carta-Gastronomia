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
  SANDWICHERIA: HandMetal, // Using HandMetal as a proxy for sandwich if no sandwich icon
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

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
}) => {
  const getIcon = (category: string) => {
    return categoryIcons[category] || Sparkles;
  };

  return (
    <div className="py-2 sm:py-3 relative">
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => onCategoryChange("all")}
            className={`flex-shrink-0 flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 border ${
              selectedCategory === "all"
                ? "bg-gradient-to-r from-[var(--gold-light)] via-[var(--gold-primary)] to-[var(--gold-dark)] text-black border-transparent shadow-lg shadow-amber-200/50"
                : "bg-slate-100 text-slate-500 border-slate-200 hover:bg-white hover:border-[var(--gold-primary)]/50 hover:text-[var(--gold-primary)]"
            }`}
          >
            {React.createElement(getIcon("all"), { size: 16 })}
            <span>Todos</span>
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`flex-shrink-0 flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 border whitespace-nowrap ${
                selectedCategory === category
                  ? "bg-gradient-to-r from-[var(--gold-light)] via-[var(--gold-primary)] to-[var(--gold-dark)] text-black border-transparent shadow-lg shadow-amber-200/50"
                  : "bg-slate-100 text-slate-500 border-slate-200 hover:bg-white hover:border-[var(--gold-primary)]/50 hover:text-[var(--gold-primary)]"
              }`}
            >
              {React.createElement(getIcon(category), { size: 16 })}
              <span>
                {category.charAt(0).toUpperCase() +
                  category.slice(1).toLowerCase()}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;
