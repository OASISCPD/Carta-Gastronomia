import { useParams, type Params } from "react-router-dom"
import { MenuKM5090 } from '../../utils/menu.ts'
import { useMemo, useState } from "react";
import type { CartItem, MenuItem as MenuItemType } from "../../types/index";
import Cart from "../../test/Cart.tsx";
import Header from "../../test/Header.tsx";
import CategoryFilter from "../../test/CategoryFilter.tsx";
import ChefSuggestion from "../../test/ChefSuggestion.tsx";
import DietaryFilters from "../../test/DietaryFilters.tsx";
import { MenuComponent } from "../../test/MenuItem.tsx";

const PageCard = () => {
    const { value } = useParams<Params>()
    console.log(value);

    const decoded = value ? decodeURIComponent(value) : undefined;
    console.log(MenuKM5090);

    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [dietaryFilters, setDietaryFilters] = useState({
        vegetarian: false,
        new: false,
        vegan: false,
        kids: false,
        celiac: false,
    });
    // Get unique categories
    const categories = useMemo(() => {
        return Array.from(new Set(MenuKM5090.map(item => item.clasificacion)));
    }, []);

    // Get chef suggestion (most expensive item)
    const chefSuggestion = useMemo(() => {
        return MenuKM5090.reduce((max, item) =>
            item.monto > max.monto ? item : max
        );
    }, []);

    // Filter items based on selected category
    const filteredItems = useMemo(() => {
        return MenuKM5090.filter(item =>
            selectedCategory === 'all' || item.clasificacion === selectedCategory
        );
    }, [selectedCategory]);

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
    };

    const handleDietaryFilterChange = (filter: string) => {
        setDietaryFilters(prev => ({
            ...prev,
            [filter]: !prev[filter as keyof typeof prev]
        }));
    };

    const handleAddToCart = (item: MenuItemType, size: 'individual' | 'complete') => {
        const existingItemIndex = cartItems.findIndex(
            cartItem =>
                cartItem["nombre largo"] === item["nombre largo"] &&
                cartItem.selectedSize === size
        );

        if (existingItemIndex >= 0) {
            const newCartItems = [...cartItems];
            newCartItems[existingItemIndex].quantity += 1;
            setCartItems(newCartItems);
        } else {
            const newCartItem: CartItem = {
                ...item,
                quantity: 1,
                selectedSize: size
            };
            setCartItems([...cartItems, newCartItem]);
        }
    };

    const handleUpdateQuantity = (index: number, quantity: number) => {
        if (quantity <= 0) {
            handleRemoveItem(index);
            return;
        }

        const newCartItems = [...cartItems];
        newCartItems[index].quantity = quantity;
        setCartItems(newCartItems);
    };

    const handleRemoveItem = (index: number) => {
        const newCartItems = cartItems.filter((_, i) => i !== index);
        setCartItems(newCartItems);
    };

    /*    const getTotalCartItems = () => {
           return cartItems.reduce((total, item) => total + item.quantity, 0);
       }; */

    return (
        <div className="min-h-screen bg-gray-100">
            <Header
            /*   cartCount={getTotalCartItems()}
              onCartClick={() => setIsCartOpen(true)} */
            />

            {/*    <CategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
            /> */}

            <DietaryFilters
                filters={dietaryFilters}
                onFilterChange={handleDietaryFilterChange}
            />

            {/*    <div className="py-6">
                <ChefSuggestion
                    suggestion={chefSuggestion}
                    onAddToCart={handleAddToCart}
                />
            </div> */}

            <div className="max-w-7xl mx-auto p-6">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                    {selectedCategory === 'all' ? 'MENÚ COMPLETO' : selectedCategory.toUpperCase()}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredItems.map((item, index) => (
                        <MenuComponent
                            key={`${item["nombre largo"]}-${index}`}
                            item={item}
                            onAddToCart={handleAddToCart}
                        />
                    ))}
                </div>
            </div>

            <Cart
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                items={cartItems}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
            />
        </div>
    );

}




export default PageCard