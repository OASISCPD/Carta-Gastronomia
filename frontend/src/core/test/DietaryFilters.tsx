import { Leaf, Star, Baby, Wheat, Flame, Milk } from "lucide-react";

interface DietaryFiltersProps {
  filters: {
    vegetarian: boolean;
    new: boolean;
    vegan: boolean;
    kids: boolean;
    celiac: boolean;
    spicy: boolean;
    lactose: boolean;
  };
  onFilterChange: (filter: string) => void;
}

const DietaryFilters: React.FC<DietaryFiltersProps> = ({
  filters,
  onFilterChange,
}) => {
  const filterButtons = [
    { key: "new", label: "Nuevo", icon: Star, active: filters.new },
    { key: "spicy", label: "Picante", icon: Flame, active: filters.spicy },
    {
      key: "vegetarian",
      label: "Vegetariano",
      icon: Leaf,
      active: filters.vegetarian,
    },
    { key: "vegan", label: "Vegano", icon: Leaf, active: filters.vegan },
    {
      key: "lactose",
      label: "Sin Lactosa",
      icon: Milk,
      active: filters.lactose,
    },
    { key: "celiac", label: "Celíaco", icon: Wheat, active: filters.celiac },
    { key: "kids", label: "Kids", icon: Baby, active: filters.kids },
  ];

  return (
    <div className="glass py-4 px-4 sm:px-6 sticky top-[68px] sm:top-[76px] z-40">
      <div className="max-w-7xl mx-auto">
        <h3 className="text-slate-500 text-[10px] sm:text-xs font-bold mb-3 tracking-widest uppercase">
          Filtrar por Dieta
        </h3>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {filterButtons.map((filter) => (
            <button
              key={filter.key}
              onClick={() => onFilterChange(filter.key)}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 border ${
                filter.active
                  ? "bg-[var(--gold-primary)] text-white border-[var(--gold-primary)] shadow-lg shadow-amber-900/10"
                  : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-white hover:border-[var(--gold-primary)]/50 hover:text-[var(--gold-primary)]"
              }`}
            >
              <filter.icon
                size={14}
                className={
                  filter.active ? "text-white" : "text-[var(--gold-primary)]"
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
