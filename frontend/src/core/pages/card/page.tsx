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
        <div className="text-center mb-8 sm:mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-12 sm:w-20 h-[1px] bg-gradient-to-r from-transparent to-[var(--gold-primary)]"></div>
            <div className="w-2 h-2 rounded-full bg-[var(--red-accent)]"></div>
            <div className="w-12 sm:w-20 h-[1px] bg-gradient-to-l from-transparent to-[var(--gold-primary)]"></div>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 uppercase tracking-wider">
            {decoded}
          </h2>
          <p className="text-white/50 text-sm sm:text-base">
            {selectedCategory === "all"
              ? "Descubrí nuestra selección gastronómica"
              : selectedCategory.charAt(0).toUpperCase() +
                selectedCategory.slice(1).toLowerCase()}
          </p>
        </div>

        {/* Chef Suggestion Section */}
        {suggestionItem && (
          <div className="mb-12">
            <ChefSuggestion suggestion={suggestionItem} />
          </div>
        )}

        {/* Menu Grid - Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredItems.map((item, index) => (
            <MenuComponent
              key={`${item["nombre largo"]}-${index}`}
              item={item}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default PageCard;
