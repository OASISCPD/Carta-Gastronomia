
import { ArrowLeft/* , ShoppingCart */ } from 'lucide-react';
/* 
interface HeaderProps {
  cartCount: number;
  onCartClick: () => void;
} */

const Header/* : FC<HeaderProps> */ = (/* { cartCount, onCartClick } */) => {
  return (
    <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white p-4 sticky top-0 z-50 shadow-lg">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-gray-700 rounded-full transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            KM 50
          </h1>
        </div>

        {/*  <button
          onClick={onCartClick}
          className="relative p-2 hover:bg-gray-700 rounded-full transition-colors"
        >
          <ShoppingCart size={20} />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button> */}
      </div>
    </div>
  );
};

export default Header;