import React from "react";
import type { MenuItem } from "../types";

interface MenuItemProps {
  item: MenuItem;
}

export const MenuComponent: React.FC<MenuItemProps> = ({ item }) => {
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

  const formatCategoryLabel = (value: string) => {
    const compact = value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "");
    if (compact === "pizzayempanada") return "Pizza y Empanada";
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  };

  return (
    <article className="group rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm hover:shadow-lg hover:border-amber-200 transition-all duration-300">
      <div className="flex items-start justify-between gap-3 mb-4">
        <span className="inline-flex items-center rounded-full bg-red-600 text-white px-3 py-1 text-[10px] sm:text-xs font-semibold tracking-wide uppercase">
          {formatCategoryLabel(item.clasificacion)}
        </span>
        <span className="inline-flex items-center rounded-lg bg-slate-900 text-amber-300 px-3 py-1.5 text-sm sm:text-base font-bold shadow-sm">
          {formatPrice(item.monto)}
        </span>
      </div>

      <h3
        className="text-lg sm:text-xl font-bold text-slate-900 leading-tight mb-2 group-hover:text-[var(--gold-primary)] transition-colors"
        style={{ fontFamily: "'Montserrat', sans-serif" }}
      >
        {formatName(item["nombre largo"])}
      </h3>

      {getDescription(item["nombre largo"]) && (
        <p className="text-slate-500 text-sm mb-4 leading-relaxed">
          {getDescription(item["nombre largo"])}
        </p>
      )}

      <div className="mt-auto pt-3 min-h-8 flex items-center">
        {item["monto individual"] && (
          <span className="text-xs text-slate-500">
            Individual: {" "}
            <span className="text-[var(--gold-primary)] font-semibold">
              {formatPrice(item["monto individual"])}
            </span>
          </span>
        )}
      </div>
    </article>
  );
};
