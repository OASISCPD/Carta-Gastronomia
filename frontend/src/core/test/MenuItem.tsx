import React from "react";
import type { MenuItem } from "../types";
import { ProgressiveImage } from "../components/ProgressiveImage";

interface MenuItemProps {
  item: MenuItem;
  onImageClick?: (src: string, alt: string) => void;
}

export const MenuComponent: React.FC<MenuItemProps> = ({
  item,
  onImageClick,
}) => {
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

  const formatPrice = (price: number | null) => {
    if (price === null) return "$ 0";
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatName = (name: string) => {
    return name.split("(")[0].trim();
  };

  return (
    <div className="group glass rounded-2xl overflow-hidden hover-gold-glow transition-all duration-500 flex flex-col h-full border border-slate-100 shadow-sm hover:shadow-md bg-white">
      {/* Image Container with Progressive Loading */}
      <div
        className="relative h-44 sm:h-48 overflow-hidden cursor-zoom-in"
        onClick={() =>
          onImageClick?.(
            getItemImage(item["nombre largo"], item.clasificacion),
            item["nombre largo"],
          )
        }
      >
        <ProgressiveImage
          src={getItemImage(item["nombre largo"], item.clasificacion)}
          alt={item["nombre largo"]}
          className="w-full h-full group-hover:scale-110 transition-transform duration-700"
        />

        {/* Price Badge */}
        <div className="absolute bottom-3 right-3">
          <span className="px-3 py-1.5 rounded-lg text-sm sm:text-base font-bold bg-white/90 backdrop-blur-md text-slate-900 border border-slate-200 shadow-xl">
            {formatPrice(item.monto)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-base sm:text-lg font-bold text-slate-800 leading-tight group-hover:text-[var(--gold-primary)] transition-colors">
            {formatName(item["nombre largo"])}
          </h3>
        </div>

        <div className="flex items-center justify-between pt-3 mt-auto border-t border-slate-100">
          {item["monto individual"] && (
            <span className="text-xs text-slate-400">
              Individual:{" "}
              <span className="text-[var(--gold-primary)] font-semibold">
                {formatPrice(item["monto individual"])}
              </span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
