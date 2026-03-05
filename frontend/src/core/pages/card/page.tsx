import { useParams, type Params } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import Header from "../../test/Header.tsx";
import CategoryFilter from "../../test/CategoryFilter.tsx";
import { MenuComponent } from "../../test/MenuItem.tsx";
import { BackToTop } from "../../components/BackToTop.tsx";
import { Search, X } from "lucide-react";
import type { MenuItem } from "../../types";

interface BackendArticulo {
  id: number | string;
  categoria: string;
  articulo: string;
  precio: number | string;
  disponibilidad: "HABILITADO" | "DESHABILITADO";
  tipo_carta?: string | null;
}

interface BackendArticulosResponse {
  success: boolean;
  data: BackendArticulo[];
}

const CARTA_MAPPING: Record<string, string> = {
  "PIZZA Y EMPANADA": "RESTAURANT",
  SANDWICHERIA: "RESTAURANT",
  SNACK: "RESTAURANT",
  "BEBIDAS SIN ALCOHOL": "RESTAURANT",
  CERVEZA: "RESTAURANT",
  COCTELERIA: "BEBIDAS PREMIUM",
  ESPUMANTES: "BEBIDAS PREMIUM",
  GIN: "BEBIDAS PREMIUM",
  VINOS: "BEBIDAS PREMIUM",
  WISHKY: "BEBIDAS PREMIUM",
  CAFETERIA: "POSTRES & CAFE",
  POSTRE: "POSTRES & CAFE",
  PROMO: "PROMOCIONES",
  PROMOCIONES: "PROMOCIONES",
  "PROMO LUNES": "PROMOCIONES",
  "PROMO MARTES": "PROMOCIONES",
  "PROMO MIERCOLES": "PROMOCIONES",
  "PROMO JUEVES Y DOMINGO": "PROMOCIONES",
};

const toNumber = (value: string | number): number => {
  if (typeof value === "number") return value;
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const normalizeText = (value: string): string => {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
};

const formatCategoryLabel = (value: string): string => {
  const compact = normalizeText(value).replace(/\s+/g, "");
  if (compact === "pizzayempanada") return "Pizza y Empanada";
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
};

const PageCard = () => {
  const { value } = useParams<Params>();
  const decoded = value ? decodeURIComponent(value) : undefined;

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchArticulos = async () => {
      try {
        setError(null);
        const baseUrl =
          import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3200/api/v1";
        const response = await fetch(`${baseUrl}/articulos`);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status} al consultar /articulos`);
        }

        const payload = (await response.json()) as BackendArticulosResponse;
        if (!payload || !Array.isArray(payload.data)) {
          throw new Error("Respuesta invalida de /api/v1/articulos");
        }

        const mapped: MenuItem[] = payload.data
          .filter((item) => item.disponibilidad === "HABILITADO")
          .map((item) => {
            const clasificacion = item.categoria || "Sin categoria";
            return {
              carta:
                item.tipo_carta || CARTA_MAPPING[clasificacion] || "RESTAURANT",
              clasificacion,
              "nombre largo": item.articulo,
              monto: toNumber(item.precio),
              "monto individual": null,
              "apto vegano": null,
              "info producto": null,
            };
          });

        if (!cancelled) {
          setMenuItems(mapped);
        }
      } catch (err) {
        if (!cancelled) {
          const message =
            err instanceof Error ? err.message : "Error al cargar articulos";
          setError(message);
          setMenuItems([]);
        }
      }
    };

    fetchArticulos();

    return () => {
      cancelled = true;
    };
  }, []);

  // Get unique categories from the current carta
  const categories = useMemo(() => {
    const itemsInCarta = menuItems.filter((item) => item.carta === decoded);
    return Array.from(
      new Set(itemsInCarta.map((item) => item.clasificacion)),
    ).filter((c) => c !== "PROMO");
  }, [decoded, menuItems]);

  // Filter items based on carta from URL and selected sub-category
  const filteredItems = useMemo(() => {
    const normalizedQuery = normalizeText(searchQuery.trim());
    return menuItems.filter(
      (item) =>
        item.carta === decoded &&
        (selectedCategory === "all" || item.clasificacion === selectedCategory) &&
        (normalizedQuery === "" ||
          normalizeText(item["nombre largo"]).includes(normalizedQuery)),
    );
  }, [selectedCategory, decoded, menuItems, searchQuery]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />

      <div className="sticky top-[73px] z-40 w-full bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />
        </div>
      </div>

      {/* Menu Section */}
      <section className="py-8 sm:py-12">
        {error && (
          <p className="text-center text-red-600 bg-red-100 border border-red-200 rounded-xl max-w-2xl mx-auto px-4 py-3 mb-6">
            Error cargando articulos: {error}
          </p>
        )}

        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-14 px-4">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-12 sm:w-20 h-[1px] bg-gradient-to-r from-transparent to-[var(--gold-primary)]"></div>
            <div className="w-2 h-2 rounded-full bg-[var(--red-accent)]"></div>
            <div className="w-12 sm:w-20 h-[1px] bg-gradient-to-l from-transparent to-[var(--gold-primary)]"></div>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-2 uppercase tracking-[0.18em]">
            {decoded}
          </h2>
          <p className="text-slate-500 text-sm sm:text-base">
            {selectedCategory === "all"
              ? "Descubrí nuestra selección gastronómica"
              : formatCategoryLabel(selectedCategory)}
          </p>
        </div>

        <div className="max-w-md mx-auto mb-10 px-4 relative group">
          <div className="absolute inset-y-0 left-8 sm:left-8 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-slate-400 group-focus-within:text-[var(--gold-primary)] transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Buscar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-full py-3 pl-12 pr-12 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-200/60 focus:border-[var(--gold-primary)] transition-all shadow-sm"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-8 sm:right-8 flex items-center text-slate-400 hover:text-slate-700 transition-colors"
              aria-label="Limpiar busqueda"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Menu Grid - Responsive */}
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredItems.map((item, index) => (
            <MenuComponent
              key={`${item["nombre largo"]}-${index}`}
              item={item}
            />
          ))}
        </div>
        {!error && filteredItems.length === 0 && (
          <p className="text-center text-slate-500 mt-10 px-4">
            No se encontraron productos para tu busqueda.
          </p>
        )}
      </section>
      <BackToTop />
    </div>
  );
};

export default PageCard;
