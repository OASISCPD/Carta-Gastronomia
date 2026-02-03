import React from 'react';
/* import { Plus } from 'lucide-react'; */
import type { MenuItem } from '../types';

interface MenuItemProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem, size: 'individual' | 'complete') => void;
}

export const MenuComponent: React.FC<MenuItemProps> = ({ item/* , onAddToCart */ }) => {
  const getItemImage = (itemName: string, category: string) => {
    const name = itemName.toLowerCase();

    if (category === 'pizzas') {
      if (name.includes('napolitana')) return 'https://images.pexels.com/photos/1653877/pexels-photo-1653877.jpeg?auto=compress&cs=tinysrgb&w=400';
      if (name.includes('calabresa')) return 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=400';
      return 'https://images.pexels.com/photos/1146760/pexels-photo-1146760.jpeg?auto=compress&cs=tinysrgb&w=400';
    }

    if (category === 'platos principales') {
      if (name.includes('salmon')) return 'https://images.pexels.com/photos/1516415/pexels-photo-1516415.jpeg?auto=compress&cs=tinysrgb&w=400';
      if (name.includes('lomo')) return 'https://images.pexels.com/photos/361184/asparagus-steak-veal-steak-veal-361184.jpeg?auto=compress&cs=tinysrgb&w=400';
      if (name.includes('pollo') || name.includes('suprema')) return 'https://images.pexels.com/photos/106343/pexels-photo-106343.jpeg?auto=compress&cs=tinysrgb&w=400';
      if (name.includes('milanesa')) return 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=400';
      return 'https://images.pexels.com/photos/769289/pexels-photo-769289.jpeg?auto=compress&cs=tinysrgb&w=400';
    }

    if (category.includes('ENSALADAS')) {
      return 'https://images.pexels.com/photos/1059905/pexels-photo-1059905.jpeg?auto=compress&cs=tinysrgb&w=400';
    }

    if (category === 'PASTAS') {
      if (name.includes('ravioles')) return 'https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg?auto=compress&cs=tinysrgb&w=400';
      if (name.includes('sorrentinos')) return 'https://images.pexels.com/photos/4518841/pexels-photo-4518841.jpeg?auto=compress&cs=tinysrgb&w=400';
      return 'https://images.pexels.com/photos/1438672/pexels-photo-1438672.jpeg?auto=compress&cs=tinysrgb&w=400';
    }

    if (category === 'POSTRES') {
      if (name.includes('flan')) return 'https://images.pexels.com/photos/2067396/pexels-photo-2067396.jpeg?auto=compress&cs=tinysrgb&w=400';
      if (name.includes('helado')) return 'https://images.pexels.com/photos/1362534/pexels-photo-1362534.jpeg?auto=compress&cs=tinysrgb&w=400';
      if (name.includes('brownie')) return 'https://images.pexels.com/photos/45202/brownie-dessert-cake-sweet-45202.jpeg?auto=compress&cs=tinysrgb&w=400';
      return 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400';
    }

    return 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400';
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatName = (name: string) => {
    return name.split('(')[0].trim();
  };

  const getDescription = (name: string) => {
    const match = name.match(/\(([^)]+)\)/);
    return match ? match[1] : '';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative">
        <img
          src={getItemImage(item["nombre largo"], item.clasificacion)}
          alt={item["nombre largo"]}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 left-3">
          <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-2 py-1 rounded-full text-xs font-medium">
            {item.clasificacion.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-gray-800 text-lg mb-2 leading-tight">
          {formatName(item["nombre largo"])}
        </h3>

        {getDescription(item["nombre largo"]) && (
          <p className="text-gray-600 text-sm mb-3 leading-relaxed">
            {getDescription(item["nombre largo"])}
          </p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-gray-800">
              {formatPrice(item.monto)}
            </span>
            {item["monto individual"] && (
              <span className="text-sm text-gray-500">
                Individual: {formatPrice(item["monto individual"])}
              </span>
            )}
          </div>
        </div>

        <button className="mt-3 text-orange-500 text-sm font-medium hover:text-orange-600 transition-colors">
          + info
        </button>
      </div>
    </div>
  );
};
