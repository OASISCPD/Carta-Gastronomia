import React from "react";
import { Leaf, Star, Baby, Wheat } from "lucide-react";

interface DietaryFiltersProps {
  filters: {
    vegetarian: boolean;
    new: boolean;
    vegan: boolean;
    kids: boolean;
    celiac: boolean;
  };
  onFilterChange: (filter: string) => void;
}

const DietaryFilters: React.FC<DietaryFiltersProps> = ({
  filters,
  onFilterChange,
}) => {
  const filterButtons = [
    { key: "new", label: "Nuevo", icon: Star, active: filters.new },
    {
      key: "vegetarian",
      label: "Vegetariano",
      icon: Leaf,
      active: filters.vegetarian,
    },

    { key: "vegan", label: "Vegano", icon: Leaf, active: filters.vegan },
    { key: "celiac", label: "Celíaco", icon: Wheat, active: filters.celiac },
    { key: "kids", label: "Kids", icon: Baby, active: filters.kids },
  ];

  return (
    <div className="glass-dark py-4 px-4 sm:px-6 sticky top-[68px] sm:top-[76px] z-40">
      <div className="max-w-7xl mx-auto">
        <h3 className="text-white/70 text-xs sm:text-sm font-medium mb-3 tracking-wide uppercase">
          Categorías & Tags
        </h3>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {filterButtons.map((filter) => (
            <button
              key={filter.key}
              onClick={() => onFilterChange(filter.key)}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 border ${
                filter.active
                  ? "bg-[var(--gold-primary)] text-black border-[var(--gold-primary)] shadow-[0_0_16px_rgba(212,175,55,0.4)]"
                  : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:border-[var(--gold-primary)]/50 hover:text-white"
              }`}
            >
              <filter.icon
                size={14}
                className={
                  filter.active ? "text-black" : "text-[var(--gold-primary)]"
                }
              />
              <span>{filter.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DietaryFilters;
