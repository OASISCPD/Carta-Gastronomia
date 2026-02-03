import React from "react";
import type { MenuItem } from "../types";

interface MenuItemProps {
  item: MenuItem;
}

export const MenuComponent: React.FC<MenuItemProps> = ({ item }) => {
  const getItemImage = (itemName: string, category: string) => {
    const name = itemName.toLowerCase();

    if (category === "PIZZA Y EMPANADA" || category.includes("PIZZA")) {
      if (name.includes("napolitana"))
        return "https://images.pexels.com/photos/1653877/pexels-photo-1653877.jpeg?auto=compress&cs=tinysrgb&w=400";
      if (name.includes("calabresa"))
        return "https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=400";
      return "https://images.pexels.com/photos/1146760/pexels-photo-1146760.jpeg?auto=compress&cs=tinysrgb&w=400";
    }

    if (category === "SANDWICHERIA" || category.includes("HAMBURGUESA")) {
      return "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=400";
    }

    if (category === "SNACK") {
      return "https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg?auto=compress&cs=tinysrgb&w=400";
    }

    if (category.includes("BEBIDAS") || category === "CERVEZA") {
      return "https://images.pexels.com/photos/3008509/pexels-photo-3008509.jpeg?auto=compress&cs=tinysrgb&w=400";
    }

    if (
      category === "COCTELERIA" ||
      category === "WISHKY" ||
      category === "GIN"
    ) {
      return "https://images.pexels.com/photos/1189257/pexels-photo-1189257.jpeg?auto=compress&cs=tinysrgb&w=400";
    }

    if (category === "POSTRE") {
      return "https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400";
    }

    if (category === "CAFETERIA") {
      return "https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=400";
    }

    return "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400";
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatName = (name: string) => {
    return name.split("(")[0].trim();
  };

  const getDescription = (name: string) => {
    const match = name.match(/\(([^)]+)\)/);
    return match ? match[1] : "";
  };

  return (
    <div className="group glass rounded-2xl overflow-hidden hover-gold-glow transition-all duration-500">
      {/* Image Container */}
      <div className="relative overflow-hidden">
        <img
          src={getItemImage(item["nombre largo"], item.clasificacion)}
          alt={item["nombre largo"]}
          className="w-full h-44 sm:h-48 object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Darker Gradient Overlay for better contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-semibold tracking-wide bg-[var(--red-accent)] text-white shadow-lg">
            {item.clasificacion.toUpperCase()}
          </span>
        </div>

        {/* Price Badge on Image */}
        <div className="absolute bottom-3 right-3">
          <span className="px-3 py-1.5 rounded-lg text-sm sm:text-base font-bold bg-black/80 backdrop-blur-sm text-[var(--gold-primary)] border border-[var(--gold-primary)]/40 shadow-lg">
            {formatPrice(item.monto)}
          </span>
        </div>
      </div>

      {/* Content - Enhanced background for better text readability */}
      <div className="p-4 sm:p-5 bg-black/30 backdrop-blur-sm">
        <h3
          className="font-semibold text-white text-base sm:text-lg mb-2 leading-tight line-clamp-2 group-hover:text-[var(--gold-light)] transition-colors duration-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
          style={{ fontFamily: "Montserrat, sans-serif" }}
        >
          {formatName(item["nombre largo"])}
        </h3>

        {getDescription(item["nombre largo"]) && (
          <p className="text-white/80 text-xs sm:text-sm mb-4 leading-relaxed line-clamp-2 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
            {getDescription(item["nombre largo"])}
          </p>
        )}

        <div className="flex items-center justify-between pt-3">
          {item["monto individual"] && (
            <span className="text-xs text-white/70 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              Individual:{" "}
              <span className="text-[var(--gold-light)] font-semibold">
                {formatPrice(item["monto individual"])}
              </span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
