import { useParams, type Params } from "react-router-dom";
import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import Header from "../../test/Header.tsx";
import CategoryFilter from "../../test/CategoryFilter.tsx";
import { MenuComponent } from "../../test/MenuItem.tsx";
import { BackToTop } from "../../components/BackToTop.tsx";
import { Search, X } from "lucide-react";
import type { MenuItem } from "../../types";
import { getArticulos } from "../../../services/articulos.service";
import {
  sortCategoriesForCarta,
  sortItemsForCarta,
} from "../../utils/categoryOrder";

const normalizeText = (value: string): string => {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
};

interface PageCardState {
  menuItems: MenuItem[];
  error: string | null;
}

type PageCardAction =
  | { type: "load_success"; payload: MenuItem[] }
  | { type: "load_error"; payload: string };

const initialState: PageCardState = {
  menuItems: [],
  error: null,
};

const pageCardReducer = (
  state: PageCardState,
  action: PageCardAction,
): PageCardState => {
  switch (action.type) {
    case "load_success":
      return { menuItems: action.payload, error: null };
    case "load_error":
      return { menuItems: [], error: action.payload };
    default:
      return state;
  }
};

const getMenuItemKey = (item: MenuItem): string => {
  return [
    item.carta,
    item.clasificacion,
    item["nombre largo"],
    item.monto,
    item["monto individual"] ?? "null",
  ].join("|");
};

const getScrollableParent = (element: HTMLElement | null): HTMLElement | null => {
  let current = element?.parentElement ?? null;

  while (current) {
    const style = window.getComputedStyle(current);
    const hasScrollableY =
      /(auto|scroll)/.test(style.overflowY) && current.scrollHeight > current.clientHeight;

    if (hasScrollableY) return current;
    current = current.parentElement;
  }

  return null;
};

const scrollToTop = (origin: HTMLElement | null) => {
  const behavior: ScrollBehavior = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches
    ? "auto"
    : "smooth";
  const scrollableParent = getScrollableParent(origin);

  if (scrollableParent) {
    scrollableParent.scrollTo({ top: 0, behavior });
  }

  window.scrollTo({ top: 0, behavior });
  document.scrollingElement?.scrollTo({ top: 0, behavior });
};

const PageCard = () => {
  const { value } = useParams<Params>();
  const decoded = value ? decodeURIComponent(value) : undefined;

  const filterBarRef = useRef<HTMLDivElement | null>(null);
  const menuSectionRef = useRef<HTMLElement | null>(null);
  const unlockHeightTimeoutRef = useRef<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [lockedSectionHeight, setLockedSectionHeight] = useState<number | null>(null);
  const [{ menuItems, error }, dispatch] = useReducer(
    pageCardReducer,
    initialState,
  );

  useEffect(() => {
    let cancelled = false;

    const fetchArticulos = async () => {
      try {
        const mapped = await getArticulos();

        if (!cancelled) {
          dispatch({ type: "load_success", payload: mapped });
        }
      } catch (err) {
        if (!cancelled) {
          const message =
            err instanceof Error ? err.message : "Error al cargar articulos";
          dispatch({ type: "load_error", payload: message });
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
    const uniqueCategories = Array.from(
      new Set(itemsInCarta.map((item) => item.clasificacion)),
    ).filter((c) => c !== "PROMO");

    return sortCategoriesForCarta(decoded, uniqueCategories);
  }, [decoded, menuItems]);

  // Filter items based on carta from URL and selected sub-category
  const filteredItems = useMemo(() => {
    const normalizedQuery = normalizeText(searchQuery.trim());
    const filtered = menuItems.filter(
      (item) =>
        item.carta === decoded &&
        (selectedCategory === "all" || item.clasificacion === selectedCategory) &&
        (normalizedQuery === "" ||
          normalizeText(item["nombre largo"]).includes(normalizedQuery)),
    );

    return sortItemsForCarta(decoded, filtered);
  }, [selectedCategory, decoded, menuItems, searchQuery]);

  useEffect(() => {
    return () => {
      if (unlockHeightTimeoutRef.current) {
        window.clearTimeout(unlockHeightTimeoutRef.current);
      }
    };
  }, []);

  const handleCategoryChange = (category: string) => {
    const categoryChanged = category !== selectedCategory;

    if (unlockHeightTimeoutRef.current) {
      window.clearTimeout(unlockHeightTimeoutRef.current);
      unlockHeightTimeoutRef.current = null;
    }

    if (categoryChanged && menuSectionRef.current) {
      setLockedSectionHeight(menuSectionRef.current.offsetHeight);
    }

    requestAnimationFrame(() => {
      scrollToTop(filterBarRef.current);
    });

    if (categoryChanged) {
      setSelectedCategory(category);
      unlockHeightTimeoutRef.current = window.setTimeout(() => {
        setLockedSectionHeight(null);
        unlockHeightTimeoutRef.current = null;
      }, 320);
      return;
    }

    setLockedSectionHeight(null);
  };

  const hasActiveFilters =
    selectedCategory !== "all" || searchQuery.trim().length > 0;

  const clearFilters = () => {
    setSelectedCategory("all");
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)]">
      <Header />

      <div
        ref={filterBarRef}
        className="sticky top-[73px] z-40 w-full bg-[var(--surface-1)]/92 backdrop-blur-xl border-b border-[var(--line-subtle)] shadow-sm shadow-black/30"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />
        </div>
      </div>

      {/* Menu Section */}
      <section
        ref={menuSectionRef}
        className="py-7 sm:py-10"
        style={lockedSectionHeight ? { minHeight: `${lockedSectionHeight}px` } : undefined}
      >
        {error && (
          <p className="text-center text-[var(--state-error-text)] bg-[var(--state-error-bg)] border border-[var(--state-error-border)] rounded-xl max-w-2xl mx-auto px-4 py-3 mb-6">
            Error cargando articulos: {error}
          </p>
        )}

        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-10 px-4">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-12 sm:w-20 h-[1px] bg-gradient-to-r from-transparent to-[var(--gold-primary)]"></div>
            <div className="w-2 h-2 rounded-full bg-[var(--gold-primary)]"></div>
            <div className="w-12 sm:w-20 h-[1px] bg-gradient-to-l from-transparent to-[var(--gold-primary)]"></div>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl text-[var(--text-primary)] mb-2 uppercase tracking-[0.14em]">
            {decoded}
          </h2>
          <p className="text-[var(--text-muted)] text-sm sm:text-base">
            Descubrí nuestra selección gastronómica
          </p>
        </div>

        <div className="max-w-md mx-auto mb-4 px-4 relative group">
          <div className="absolute inset-y-0 left-8 sm:left-8 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-[var(--text-muted)] group-focus-within:text-[var(--gold-primary)] transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Buscar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[var(--surface-2)] border border-[var(--line-subtle)] rounded-full py-3 pl-12 pr-12 text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--line-accent)] focus:border-[var(--gold-primary)] transition-all shadow-sm shadow-black/20"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-8 sm:right-8 flex items-center text-[var(--text-muted)] hover:text-[var(--gold-primary)] transition-colors"
              aria-label="Limpiar busqueda"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="max-w-7xl mx-auto px-4 mb-6 sm:mb-8 flex items-center justify-between gap-3 text-sm">
          <p className="text-[var(--text-muted)]">
            {filteredItems.length}{" "}
            {filteredItems.length === 1 ? "producto" : "productos"}
          </p>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="rounded-full border border-[var(--line-subtle)] bg-[var(--surface-2)] px-4 py-1.5 text-[var(--text-muted)] hover:text-[var(--gold-primary)] hover:border-[var(--line-accent)] transition-colors"
            >
              Limpiar filtros
            </button>
          )}
        </div>

        {/* Menu Grid - Responsive */}
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredItems.map((item) => (
            <MenuComponent
              key={getMenuItemKey(item)}
              item={item}
              highlightQuery={searchQuery}
            />
          ))}
        </div>
        {!error && filteredItems.length === 0 && (
          <div className="text-center mt-10 px-4">
            <p className="text-[var(--text-muted)] mb-4">
              No se encontraron productos para tu busqueda.
            </p>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="rounded-full border border-[var(--line-subtle)] bg-[var(--surface-2)] px-5 py-2 text-sm text-[var(--text-muted)] hover:text-[var(--gold-primary)] hover:border-[var(--line-accent)] transition-colors"
              >
                Mostrar todos
              </button>
            )}
          </div>
        )}
      </section>
      <BackToTop />
    </div>
  );
};

export default PageCard;


