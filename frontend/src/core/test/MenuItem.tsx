import React from "react";
import type { MenuItem } from "../types";

interface MenuItemProps {
  item: MenuItem;
  highlightQuery?: string;
}

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

const escapeRegex = (value: string): string => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const normalizeForMatch = (value: string): string => {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
};

const getHighlightedNameNodes = (
  name: string,
  highlightQuery: string,
): React.ReactNode => {
  const cleanedName = formatName(name);
  const query = highlightQuery.trim();

  if (!query) return cleanedName;
  const normalizedQuery = normalizeForMatch(query);
  if (!normalizedQuery) return cleanedName;

  // Build normalized text and a map from normalized index -> original index.
  const normalizedChars: string[] = [];
  const indexMap: number[] = [];
  const originalChars = Array.from(cleanedName);

  originalChars.forEach((char, originalIndex) => {
    const normalizedChunk = char
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

    for (const normalizedChar of normalizedChunk) {
      normalizedChars.push(normalizedChar);
      indexMap.push(originalIndex);
    }
  });

  const normalizedName = normalizedChars.join("");
  const escapedQuery = escapeRegex(normalizedQuery);
  const regex = new RegExp(escapedQuery, "g");

  const ranges: Array<{ start: number; end: number }> = [];
  let match = regex.exec(normalizedName);
  while (match) {
    const normalizedStart = match.index;
    const normalizedEnd = normalizedStart + match[0].length - 1;
    const originalStart = indexMap[normalizedStart];
    const originalEnd = (indexMap[normalizedEnd] ?? originalStart) + 1;

    if (originalStart !== undefined) {
      ranges.push({ start: originalStart, end: originalEnd });
    }
    match = regex.exec(normalizedName);
  }

  if (ranges.length === 0) return cleanedName;

  const nodes: React.ReactNode[] = [];
  let cursor = 0;

  for (const range of ranges) {
    if (range.start > cursor) {
      nodes.push(
        <React.Fragment key={`text-${cursor}-${range.start}`}>
          {originalChars.slice(cursor, range.start).join("")}
        </React.Fragment>,
      );
    }

    nodes.push(
      <mark
        key={`mark-${range.start}-${range.end}`}
        className="bg-[var(--gold-primary)]/20 text-[var(--gold-primary)] px-0.5 rounded-sm"
      >
        {originalChars.slice(range.start, range.end).join("")}
      </mark>,
    );
    cursor = range.end;
  }

  if (cursor < originalChars.length) {
    nodes.push(
      <React.Fragment key={`text-tail-${cursor}`}>
        {originalChars.slice(cursor).join("")}
      </React.Fragment>,
    );
  }

  return nodes;
};

interface HighlightedNameProps {
  name: string;
  query: string;
}

const HighlightedName: React.FC<HighlightedNameProps> = ({ name, query }) => {
  return <>{getHighlightedNameNodes(name, query)}</>;
};

export const MenuComponent: React.FC<MenuItemProps> = ({
  item,
  highlightQuery = "",
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <article className="group h-full rounded-2xl border border-[var(--line-subtle)] bg-[var(--surface-2)] p-4 sm:p-5 shadow-sm shadow-black/35 hover:shadow-md hover:border-[var(--line-accent)]/80 transition-all duration-300 flex flex-col">
      <div className="flex items-start justify-end mb-3">
        <span className="inline-flex items-center rounded-lg bg-[var(--surface-1)] text-[var(--gold-primary)] border border-[var(--line-accent)]/70 px-3 py-1.5 text-sm sm:text-base font-semibold shadow-sm">
          {formatPrice(item.monto)}
        </span>
      </div>

      <h3
        className="text-lg sm:text-xl text-[var(--text-primary)] leading-tight mb-2 min-h-12 group-hover:text-[var(--gold-primary)] transition-colors"
      >
        <HighlightedName name={item["nombre largo"]} query={highlightQuery} />
      </h3>

      {getDescription(item["nombre largo"]) && (
        <p className="text-[var(--text-muted)] text-sm mb-4 leading-relaxed min-h-10">
          {getDescription(item["nombre largo"])}
        </p>
      )}

      <div className="mt-auto pt-3 border-t border-[var(--line-subtle)]/80 flex items-center justify-between gap-2">
        <span className="text-[11px] sm:text-xs text-[var(--text-muted)] uppercase tracking-wide">
          {formatCategoryLabel(item.clasificacion)}
        </span>
        {item["monto individual"] && (
          <span className="text-xs text-[var(--text-muted)] whitespace-nowrap">
            Individual: {" "}
            <span className="text-[var(--gold-primary)]">
              {formatPrice(item["monto individual"])}
            </span>
          </span>
        )}
      </div>
    </article>
  );
};
