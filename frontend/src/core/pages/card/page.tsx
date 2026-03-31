import { useLocation, useParams, type Params } from "react-router-dom";
import { useEffect, useMemo, useReducer, useRef } from "react";
import { Search, WifiOff, X } from "lucide-react";
import Header from "../../test/Header.tsx";
import CategoryFilter from "../../test/CategoryFilter.tsx";
import { MenuComponent } from "../../test/MenuItem.tsx";
import { BackToTop } from "../../components/BackToTop.tsx";
import type { MenuItem } from "../../types";
import { getArticulos } from "../../../services/articulos.service";
import { LoaderPageDomain, useGlobalLoader } from "../../shared/Loaders.tsx";
import { reportMetric } from "../../utils/metrics";
import { resolveCartaFromRoute } from "../../utils/cartaSlug";
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

interface PageCardLocationState {
  loaderPrimed?: boolean;
  loaderStartedAt?: number;
}

interface PageCardState {
  menuItems: MenuItem[];
  error: string | null;
  selectedCategory: string;
  searchQuery: string;
  isInitialLoading: boolean;
  reloadCounter: number;
  isOffline: boolean;
}

type PageCardAction =
  | { type: "load_success"; payload: MenuItem[] }
  | { type: "load_error"; payload: string }
  | { type: "set_category"; payload: string }
  | { type: "set_query"; payload: string }
  | { type: "clear_filters" }
  | { type: "retry_load" }
  | { type: "set_offline"; payload: boolean };

const getInitialState = (): PageCardState => ({
  menuItems: [],
  error: null,
  selectedCategory: "all",
  searchQuery: "",
  isInitialLoading: true,
  reloadCounter: 0,
  isOffline: typeof navigator !== "undefined" ? !navigator.onLine : false,
});

const pageCardReducer = (
  state: PageCardState,
  action: PageCardAction,
): PageCardState => {
  switch (action.type) {
    case "load_success":
      return {
        ...state,
        menuItems: action.payload,
        error: null,
        isInitialLoading: false,
      };
    case "load_error":
      return {
        ...state,
        menuItems: [],
        error: action.payload,
        isInitialLoading: false,
      };
    case "set_category":
      return { ...state, selectedCategory: action.payload };
    case "set_query":
      return { ...state, searchQuery: action.payload };
    case "clear_filters":
      return { ...state, selectedCategory: "all", searchQuery: "" };
    case "retry_load":
      return {
        ...state,
        isInitialLoading: true,
        error: null,
        reloadCounter: state.reloadCounter + 1,
      };
    case "set_offline":
      return { ...state, isOffline: action.payload };
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
  const location = useLocation();
  const decoded = resolveCartaFromRoute(value);
  const locationState = location.state as PageCardLocationState | null;

  const filterBarRef = useRef<HTMLDivElement | null>(null);
  const [
    {
      menuItems,
      error,
      selectedCategory,
      searchQuery,
      isInitialLoading,
      reloadCounter,
      isOffline,
    },
    dispatch,
  ] = useReducer(pageCardReducer, undefined, getInitialState);
  const { hideLoader, showLoader } = useGlobalLoader();

  useEffect(() => {
    const handleOnline = () => dispatch({ type: "set_offline", payload: false });
    const handleOffline = () => dispatch({ type: "set_offline", payload: true });

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const shouldShowLoader = !locationState?.loaderPrimed || reloadCounter > 0;
    const loaderStartedAt = locationState?.loaderStartedAt ?? Date.now();
    const startedAt = performance.now();

    const fetchArticulos = async () => {
      if (shouldShowLoader) {
        showLoader();
      }

      try {
        const mapped = await getArticulos();
        const elapsed = Date.now() - loaderStartedAt;
        const remaining = Math.max(0, 500 - elapsed);

        if (remaining > 0) {
          await new Promise((resolve) => window.setTimeout(resolve, remaining));
        }

        if (!cancelled) {
          dispatch({ type: "load_success", payload: mapped });
          reportMetric("card_data_ready_ms", Math.round(performance.now() - startedAt), {
            carta: decoded ?? "unknown",
            retry: reloadCounter,
          });
        }
      } catch (err) {
        if (!cancelled) {
          const message =
            err instanceof Error ? err.message : "Error al cargar articulos";
          dispatch({ type: "load_error", payload: message });
          reportMetric("card_data_error", message);
        }
      } finally {
        if (!cancelled) {
          hideLoader();
        }
      }
    };

    fetchArticulos();

    return () => {
      cancelled = true;
      if (shouldShowLoader) {
        hideLoader();
      }
    };
  }, [
    decoded,
    hideLoader,
    locationState?.loaderPrimed,
    locationState?.loaderStartedAt,
    reloadCounter,
    showLoader,
  ]);

  const categories = useMemo(() => {
    const itemsInCarta = menuItems.filter((item) => item.carta === decoded);
    const uniqueCategories = Array.from(
      new Set(itemsInCarta.map((item) => item.clasificacion)),
    ).filter((c) => c !== "PROMO");

    return sortCategoriesForCarta(decoded, uniqueCategories);
  }, [decoded, menuItems]);

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

  const handleCategoryChange = (category: string) => {
    const categoryChanged = category !== selectedCategory;

    requestAnimationFrame(() => {
      scrollToTop(filterBarRef.current);
    });

    if (categoryChanged) {
      dispatch({ type: "set_category", payload: category });
    }
  };

  const hasActiveFilters =
    selectedCategory !== "all" || searchQuery.trim().length > 0;

  const retryLoad = () => {
    dispatch({ type: "retry_load" });
  };

  if (isInitialLoading) return <LoaderPageDomain visible />;

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)]">
      <Header />

      <div
        ref={filterBarRef}
        className="sticky top-[73px] z-40 w-full border-b border-[var(--line-subtle)] bg-[var(--surface-1)]/92 shadow-sm shadow-black/30 backdrop-blur-xl"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />
        </div>
      </div>

      <section className="py-7 sm:py-10">
        {error && (
          <div className="mx-auto mb-6 max-w-2xl rounded-xl border border-[var(--state-error-border)] bg-[var(--state-error-bg)] px-4 py-3 text-center text-[var(--state-error-text)]">
            <p>
              {isOffline
                ? "Sin conexion. Verifica internet y reintenta."
                : `Error cargando articulos: ${error}`}
            </p>
            <div className="mt-3 flex items-center justify-center gap-3">
              {isOffline && <WifiOff className="h-4 w-4" aria-hidden="true" />}
              <button
                type="button"
                onClick={retryLoad}
                className="rounded-full border border-white/30 bg-black/25 px-4 py-1.5 text-sm text-white hover:bg-black/35"
              >
                Reintentar
              </button>
            </div>
          </div>
        )}

        <div className="mb-8 px-4 text-center sm:mb-10">
          <div className="mb-4 flex items-center justify-center gap-4">
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[var(--gold-primary)] sm:w-20"></div>
            <div className="h-2 w-2 rounded-full bg-[var(--gold-primary)]"></div>
            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[var(--gold-primary)] sm:w-20"></div>
          </div>
          <h2 className="mb-2 text-2xl text-[var(--text-primary)] uppercase tracking-[0.14em] sm:text-3xl md:text-4xl">
            {decoded}
          </h2>
          <p className="text-sm text-[var(--text-muted)] sm:text-base">
            Descubri nuestra seleccion gastronomica
          </p>
        </div>

        <div className="group relative mx-auto mb-4 max-w-md px-4">
          <div className="pointer-events-none absolute inset-y-0 left-8 flex items-center sm:left-8">
            <Search className="h-5 w-5 text-[var(--text-muted)] transition-colors group-focus-within:text-[var(--gold-primary)]" />
          </div>
          <input
            type="text"
            placeholder="Buscar..."
            value={searchQuery}
            onChange={(e) => dispatch({ type: "set_query", payload: e.target.value })}
            className="w-full rounded-full border border-[var(--line-subtle)] bg-[var(--surface-2)] py-3 pl-12 pr-12 text-[var(--text-primary)] placeholder-[var(--text-muted)] shadow-sm shadow-black/20 transition-all focus:border-[var(--gold-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--line-accent)]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => dispatch({ type: "set_query", payload: "" })}
              className="absolute inset-y-0 right-8 flex items-center text-[var(--text-muted)] transition-colors hover:text-[var(--gold-primary)] sm:right-8"
              aria-label="Limpiar busqueda"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        <div className="mx-auto mb-6 flex max-w-7xl items-center justify-between gap-3 px-4 text-sm sm:mb-8">
          <p className="text-[var(--text-muted)]">
            {filteredItems.length} {filteredItems.length === 1 ? "producto" : "productos"}
          </p>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={() => dispatch({ type: "clear_filters" })}
              className="rounded-full border border-[var(--line-subtle)] bg-[var(--surface-2)] px-4 py-1.5 text-[var(--text-muted)] transition-colors hover:border-[var(--line-accent)] hover:text-[var(--gold-primary)]"
            >
              Limpiar filtros
            </button>
          )}
        </div>

        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
          {filteredItems.map((item) => (
            <MenuComponent
              key={getMenuItemKey(item)}
              item={item}
              highlightQuery={searchQuery}
            />
          ))}
        </div>

        {!error && filteredItems.length === 0 && (
          <div className="mt-10 px-4 text-center">
            <p className="mb-4 text-[var(--text-muted)]">
              No se encontraron productos para tu busqueda.
            </p>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={() => dispatch({ type: "clear_filters" })}
                className="rounded-full border border-[var(--line-subtle)] bg-[var(--surface-2)] px-5 py-2 text-sm text-[var(--text-muted)] transition-colors hover:border-[var(--line-accent)] hover:text-[var(--gold-primary)]"
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
