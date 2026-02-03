import React from 'react';
import { Leaf, Star, Baby, Wheat } from 'lucide-react';

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

const DietaryFilters: React.FC<DietaryFiltersProps> = ({ filters, onFilterChange }) => {
  const filterButtons = [
    { key: 'vegetarian', label: 'VEGETARIANO', icon: Leaf, active: filters.vegetarian },
    { key: 'new', label: 'NEW', icon: Star, active: filters.new },
    { key: 'vegan', label: 'VEGANO', icon: Leaf, active: filters.vegan },
    { key: 'kids', label: 'MENÚ KIDS', icon: Baby, active: filters.kids },
    { key: 'celiac', label: 'CELÍACO', icon: Wheat, active: filters.celiac },
  ];

  return (
    <div className="bg-gray-700 p-4">
      <div className="max-w-7xl mx-auto">
        <h3 className="text-white text-lg font-medium mb-3">Categorías & tags</h3>
        <div className="flex flex-wrap gap-2">
          {filterButtons.map((filter) => (
            <button
              key={filter.key}
              onClick={() => onFilterChange(filter.key)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-full text-xs font-medium transition-all ${
                filter.active
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
              }`}
            >
              <filter.icon size={14} />
              <span>{filter.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DietaryFilters;