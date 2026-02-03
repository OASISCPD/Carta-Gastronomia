import { useParams, type Params } from "react-router-dom";
import { MenuKM5090 } from "../../utils/menu";
import { useMemo, useState } from "react";
import Header from "../../test/Header.tsx";
import CategoryFilter from "../../test/CategoryFilter.tsx";
import { MenuComponent } from "../../test/MenuItem.tsx";
import ChefSuggestion from "../../test/ChefSuggestion.tsx";

const PageCard = () => {
  const { value } = useParams<Params>();
  const decoded = value ? decodeURIComponent(value) : undefined;

  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Get unique categories from the current carta
  const categories = useMemo(() => {
    const itemsInCarta = MenuKM5090.filter((item) => item.carta === decoded);
    return Array.from(
      new Set(itemsInCarta.map((item) => item.clasificacion)),
    ).filter((c) => c !== "PROMO");
  }, [decoded]);

  // Filter items based on carta from URL and selected sub-category
  const filteredItems = useMemo(() => {
    return MenuKM5090.filter(
      (item) =>
        item.carta === decoded &&
        (selectedCategory === "all" || item.clasificacion === selectedCategory),
    );
  }, [selectedCategory, decoded]);

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

  // Logic to pick a chef suggestion (e.g., first item or a specific one)
  const suggestionItem = useMemo(() => {
    if (filteredItems.length === 0) return null;
    // Try to find a 'premium' sounding item or just take one
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

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <div className="min-h-screen">
      <Header />

      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />

      {/* Menu Section */}
      <section className="py-8 sm:py-12">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-12 sm:w-20 h-[1px] bg-gradient-to-r from-transparent to-[var(--gold-primary)]"></div>
            <div className="w-2 h-2 rounded-full bg-[var(--red-accent)]"></div>
            <div className="w-12 sm:w-20 h-[1px] bg-gradient-to-l from-transparent to-[var(--gold-primary)]"></div>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2 uppercase tracking-[0.2em]">
            {decoded}
          </h2>
          <p className="text-white/40 text-sm sm:text-base tracking-[0.1em]">
            {selectedCategory === "all"
              ? "Nuestra Selección Gastronómica"
              : selectedCategory.toUpperCase()}
          </p>
        </div>

        {/* Chef Suggestion Section */}
        {suggestionItem && selectedCategory === "all" && (
          <div className="mb-20">
            <ChefSuggestion suggestion={suggestionItem} />
          </div>
        )}

        <div className="space-y-24">
          {Object.entries(groupedItems).map(([category, items]) => (
            <div key={category} className="category-section">
              {/* Category Sub-Header (The requested separator) */}
              <div className="text-center mb-10">
                <div className="flex items-center justify-center gap-4 mb-3 opacity-60">
                  <div className="w-8 sm:w-16 h-[1px] bg-gradient-to-r from-transparent to-[var(--gold-primary)]"></div>
                  <div className="w-2 h-2 rounded-full bg-[var(--red-accent)]"></div>
                  <div className="w-8 sm:w-16 h-[1px] bg-gradient-to-l from-transparent to-[var(--gold-primary)]"></div>
                </div>
                <h3
                  className="text-xl sm:text-2xl font-bold text-[var(--gold-primary)]/80 uppercase tracking-[0.25em]"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  {category}
                </h3>
              </div>

              {/* Menu Grid - Responsive */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 px-4">
                {items.map((item, index) => (
                  <MenuComponent
                    key={`${item["nombre largo"]}-${index}`}
                    item={item}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default PageCard;
