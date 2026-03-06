import React from "react";
import {
  FaBowlFood,
  FaBreadSlice,
  FaChampagneGlasses,
  FaIceCream,
  FaMartiniGlassCitrus,
  FaMugHot,
  FaPizzaSlice,
  FaStar,
  FaListUl,
  FaTag,
  FaWineGlass,
  FaWhiskeyGlass,
  FaBottleWater,
  FaBeerMugEmpty,
} from "react-icons/fa6";
import type { IconType } from "react-icons";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const categoryIcons: Record<string, IconType> = {
  all: FaListUl,
  "PIZZA Y EMPANADA": FaPizzaSlice,
  PIZZAYEMPANADA: FaPizzaSlice,
  SANDWICHERIA: FaBreadSlice,
  SNACK: FaBowlFood,
  "BEBIDAS SIN ALCOHOL": FaBottleWater,
  CERVEZA: FaBeerMugEmpty,
  "PROMO LUNES": FaTag,
  "PROMO MARTES": FaTag,
  "PROMO MIERCOLES": FaTag,
  "PROMO JUEVES Y DOMINGO": FaTag,
  PROMOCIONES: FaTag,
  COCTELERIA: FaMartiniGlassCitrus,
  GIN: FaMartiniGlassCitrus,
  VINOS: FaWineGlass,
  ESPUMANTES: FaChampagneGlasses,
  WISHKY: FaWhiskeyGlass,
  WHISKY: FaWhiskeyGlass,
  POSTRE: FaIceCream,
  CAFETERIA: FaMugHot,
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
      FaStar
    );
  };

  return (
    <div className="py-3 sm:py-4 relative">
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-2.5 sm:gap-3 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => onCategoryChange("all")}
            aria-pressed={selectedCategory === "all"}
            className={`flex-shrink-0 flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm transition-all duration-300 border active:scale-[0.99] ${
              selectedCategory === "all"
                ? "bg-[var(--surface-3)] text-[var(--gold-primary)] border-[var(--line-accent)] shadow-lg shadow-black/30"
                : "bg-[var(--surface-2)] text-[var(--text-muted)] border-[var(--line-subtle)] hover:bg-[var(--surface-3)] hover:border-[var(--line-accent)] hover:text-[var(--gold-primary)] hover:shadow-md hover:shadow-black/30"
            }`}
          >
            {React.createElement(getIcon("all"), { size: 16 })}
            <span>Todos</span>
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              aria-pressed={selectedCategory === category}
              className={`flex-shrink-0 flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm transition-all duration-300 border whitespace-nowrap active:scale-[0.99] ${
                selectedCategory === category
                  ? "bg-[var(--surface-3)] text-[var(--gold-primary)] border-[var(--line-accent)] shadow-lg shadow-black/30"
                  : "bg-[var(--surface-2)] text-[var(--text-muted)] border-[var(--line-subtle)] hover:bg-[var(--surface-3)] hover:border-[var(--line-accent)] hover:text-[var(--gold-primary)] hover:shadow-md hover:shadow-black/30"
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
