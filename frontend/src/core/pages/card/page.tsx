import { useParams, type Params } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import Header from "../../test/Header.tsx";
import CategoryFilter from "../../test/CategoryFilter.tsx";
import { MenuComponent } from "../../test/MenuItem.tsx";
import ChefSuggestion from "../../test/ChefSuggestion.tsx";
import { BackToTop } from "../../components/BackToTop.tsx";
import { ImageModal } from "../../components/ImageModal.tsx";
import { Search, X } from "lucide-react";
import {
  MenuItemSkeleton,
  ChefSuggestionSkeleton,
} from "../../components/Skeleton";
import type { MenuItem } from "../../types";
import { getProductos } from "../../../services/productos.service";

const PageCard = () => {
  const { value } = useParams<Params>();
  const decoded = value ? decodeURIComponent(value) : undefined;

  // Normalizer to ignore accents (tildes)
  const normalizeString = (str: string) => {
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, ""); // Remove accents
  };

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [modalState, setModalState] = useState({
    isOpen: false,
    src: "",
    alt: "",
  });

  const handleImageOpen = (src: string, alt: string) => {
    setModalState({ isOpen: true, src, alt });
  };

  // Fetch products from the API
  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const productos = await getProductos();
        if (!cancelled) {
          setMenuItems(productos);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Error al cargar productos",
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchData();
    return () => {
      cancelled = true;
    };
  }, []);

  // Filter items for the current carta
  const itemsInCarta = useMemo(() => {
    return menuItems.filter((item) => item.carta === decoded);
  }, [menuItems, decoded]);

  // Get unique categories (using clasificacion — all items already belong to this "carta")
  const categories = useMemo(() => {
    // Since clasificacion = categoria_nombre, we show all unique categories for this carta
    const allCategories = Array.from(
      new Set(itemsInCarta.map((item) => item.clasificacion)),
    ).sort();
    return allCategories;
  }, [itemsInCarta]);

  // Filter items based on selected category and search query
  const filteredItems = useMemo(() => {
    const normalizedQuery = normalizeString(searchQuery);

    return itemsInCarta.filter((item) => {
      const matchesCategory =
        selectedCategory === "all" || item.clasificacion === selectedCategory;
      const matchesSearch =
        normalizedQuery === "" ||
        normalizeString(item["nombre largo"]).includes(normalizedQuery);

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, itemsInCarta, searchQuery]);

  // Group filtered items by classification
  const groupedItems = useMemo(() => {
    const groups: { [key: string]: typeof filteredItems } = {};
    filteredItems.forEach((item) => {
      if (!groups[item.clasificacion]) {
        groups[item.clasificacion] = [];
      }
      groups[item.clasificacion].push(item);
    });
    return groups;
  }, [filteredItems]);

  // Logic to pick a chef suggestion
  const suggestionItem = useMemo(() => {
    if (filteredItems.length === 0) return null;
    return (
      filteredItems.find((item) =>
        item["nombre largo"].toLowerCase().includes("lomo"),
      ) ||
      filteredItems.find((item) =>
        item["nombre largo"].toLowerCase().includes("salmon"),
      ) ||
      filteredItems[0]
    );
  }, [filteredItems]);

  return (
    <div className="min-h-screen bg-[var(--bg-main)]">
      <Header />

      <div className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-lg border-b border-slate-200 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={(cat) => {
              setSelectedCategory(cat);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        </div>
      </div>

      {/* Menu Section */}
      <section className="py-8 sm:py-12">
        {/* Section Header & Search */}
        <div className="container mx-auto px-6 mb-16">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-12 sm:w-20 h-[1px] bg-gradient-to-r from-transparent to-[var(--gold-primary)]"></div>
              <div className="w-2 h-2 rounded-full bg-[var(--red-accent)]"></div>
              <div className="w-12 sm:w-20 h-[1px] bg-gradient-to-l from-transparent to-[var(--gold-primary)]"></div>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-2 uppercase tracking-[0.2em]">
              {decoded}
            </h2>
            <p className="text-slate-400 text-sm sm:text-base tracking-[0.1em] font-medium">
              {selectedCategory === "all"
                ? "Nuestra Selección Gastronómica"
                : selectedCategory.toUpperCase()}
            </p>
          </div>

          {/* Search Input */}
          <div className="max-w-md mx-auto relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-slate-400 group-focus-within:text-[var(--gold-primary)] transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Buscar plato..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-full py-3.5 pl-12 pr-12 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-200/50 focus:border-[var(--gold-primary)] transition-all shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-4 flex items-center"
              >
                <X className="w-5 h-5 text-slate-400 hover:text-slate-600" />
              </button>
            )}
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="text-center py-20 px-6">
            <div className="text-red-400 mb-4 text-6xl">⚠</div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">
              Error al cargar el menú
            </h3>
            <p className="text-slate-500">{error}</p>
          </div>
        )}

        {/* Loading State Skeletons */}
        {isLoading ? (
          <div className="container mx-auto">
            <ChefSuggestionSkeleton />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4 mt-12">
              {[...Array(8)].map((_, i) => (
                <MenuItemSkeleton key={i} />
              ))}
            </div>
          </div>
        ) : (
          !error && (
            <>
              {/* Chef Suggestion Section */}
              {suggestionItem && selectedCategory === "all" && !searchQuery && (
                <div className="mb-20">
                  <ChefSuggestion
                    suggestion={suggestionItem}
                    onImageClick={handleImageOpen}
                  />
                </div>
              )}

              <div className="space-y-24">
                {Object.entries(groupedItems).map(([category, items]) => (
                  <div key={category} className="category-section">
                    {/* Category Sub-Header */}
                    <div className="text-center mb-10">
                      <div className="flex items-center justify-center gap-4 mb-3 opacity-60">
                        <div className="w-8 sm:w-16 h-[1px] bg-gradient-to-r from-transparent to-[var(--gold-primary)]"></div>
                        <div className="w-2 h-2 rounded-full bg-[var(--red-accent)]"></div>
                        <div className="w-8 sm:w-16 h-[1px] bg-gradient-to-l from-transparent to-[var(--gold-primary)]"></div>
                      </div>
                      <h3
                        className="text-xl sm:text-2xl font-bold text-[var(--gold-primary)] uppercase tracking-[0.25em]"
                        style={{ fontFamily: "'Cinzel', serif" }}
                      >
                        {category}
                      </h3>
                    </div>

                    {/* Menu Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 px-4">
                      {items.map((item, index) => (
                        <MenuComponent
                          key={`${item["nombre largo"]}-${index}`}
                          item={item}
                          onImageClick={handleImageOpen}
                        />
                      ))}
                    </div>
                  </div>
                ))}

                {filteredItems.length === 0 && (
                  <div className="text-center py-20 px-6">
                    <div className="text-slate-300 mb-4 flex justify-center">
                      <Search size={64} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">
                      No encontramos nada
                    </h3>
                    <p className="text-slate-500">
                      Prueba ajustando tu búsqueda o filtros.
                    </p>
                  </div>
                )}
              </div>
            </>
          )
        )}
      </section>

      <BackToTop />

      <ImageModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState((prev) => ({ ...prev, isOpen: false }))}
        src={modalState.src}
        alt={modalState.alt}
      />
    </div>
  );
};

export default PageCard;
