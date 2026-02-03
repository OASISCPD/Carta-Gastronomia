import React from 'react';
import { Star, Plus } from 'lucide-react';
import type { MenuItem } from '../types';
/* import { MenuItem as MenuItemType } from '../types/menu'; */

interface ChefSuggestionProps {
  suggestion: MenuItem;
  onAddToCart: (item: MenuItem, size: 'individual' | 'complete') => void;
}

const ChefSuggestion: React.FC<ChefSuggestionProps> = ({ suggestion, onAddToCart }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-6 mx-4 rounded-xl shadow-2xl">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center mb-4">
          <Star className="text-yellow-400 mr-2" size={24} />
          <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            SUGERENCIA DEL CHEF
          </h2>
          <Star className="text-yellow-400 ml-2" size={24} />
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img
              src="https://images.pexels.com/photos/1516415/pexels-photo-1516415.jpeg?auto=compress&cs=tinysrgb&w=200"
              alt={suggestion["nombre largo"]}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div>
              <h3 className="font-bold text-lg">{suggestion["nombre largo"]}</h3>
              <p className="text-gray-300 text-sm">Recomendación especial del chef</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-3xl font-bold text-yellow-400">
              {formatPrice(suggestion.monto)}
            </span>
            <button
              onClick={() => onAddToCart(suggestion, 'complete')}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black p-3 rounded-full transition-all transform hover:scale-105"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>

        <button className="mt-4 text-orange-400 text-sm font-medium hover:text-orange-300 transition-colors block mx-auto">
          + info
        </button>
      </div>
    </div>
  );
};

export default ChefSuggestion;