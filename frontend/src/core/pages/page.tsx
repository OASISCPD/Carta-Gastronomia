import { Utensils, Tag, Sparkles, Wine, Coffee } from "lucide-react";
import { useNavigate } from "react-router-dom";

function CorePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen ">
      {/* Header */}
      <div className="container mx-auto px-6 py-8">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20  rounded-full flex items-center justify-center">
            {/*   <span className="text-black font-bold text-2xl">BO</span> */}
            <img src="/images/logo.pilar.png" alt="Logo Dominio" />
          </div>
        </div>

        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-light text-amber-400 mb-4 tracking-wide">
            BIENVENIDOS
          </h1>
          <div className="flex items-center justify-center gap-4 mb-8">
            <Sparkles className="text-amber-400 w-4 h-4" />
            <span className="text-gray-300 text-lg uppercase tracking-widest">
              AL EMOCIONANTE MUNDO DEL BINGO
            </span>
            <Sparkles className="text-amber-400 w-4 h-4" />
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 max-w-4xl mx-auto">
          {/* Restaurant */}
          <div
            onClick={() => navigate("/card/RESTAURANT")}
            className="relative h-48 md:h-56 rounded-lg overflow-hidden group cursor-pointer transform transition-transform duration-300 hover:scale-105"
          >
            <img
              src="https://images.pexels.com/photos/6963944/pexels-photo-6963944.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Restaurant"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 group-hover:bg-opacity-40 transition-all duration-300"></div>
            <div className="absolute inset-0 flex items-end mb-8 justify-center">
              <div className="text-center">
                <Utensils className="text-amber-400 w-6 h-6 mx-auto mb-2" />
                <h3 className="text-xl md:text-2xl font-bold tracking-wider">
                  RESTAURANT
                </h3>
                <div className="w-16 h-0.5 bg-amber-400 mx-auto mt-2"></div>
              </div>
            </div>
          </div>

          {/* Promociones */}
          <div
            onClick={() => navigate("/card/PROMOCIONES")}
            className="relative h-48 md:h-56 rounded-lg overflow-hidden group cursor-pointer transform transition-transform duration-300 hover:scale-105"
          >
            <img
              src="https://images.pexels.com/photos/6963765/pexels-photo-6963765.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Promociones"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 group-hover:bg-opacity-40 transition-all duration-300"></div>
            <div className="absolute inset-0 flex items-end mb-8 justify-center">
              <div className="text-center">
                <Tag className="text-amber-400 w-6 h-6 mx-auto mb-2" />
                <h3 className="text-xl md:text-2xl font-bold tracking-wider">
                  PROMOCIONES
                </h3>
                <div className="w-16 h-0.5 bg-amber-400 mx-auto mt-2"></div>
              </div>
            </div>
          </div>

          {/* Bebidas Premium */}
          <div
            onClick={() => navigate("/card/BEBIDAS PREMIUM")}
            className="relative h-48 md:h-56 rounded-lg overflow-hidden group cursor-pointer transform transition-transform duration-300 hover:scale-105"
          >
            <img
              src="https://images.pexels.com/photos/8111357/pexels-photo-8111357.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Bebidas Premium"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 group-hover:bg-opacity-40 transition-all duration-300"></div>
            <div className="absolute inset-0 flex items-end mb-8 justify-center">
              <div className="text-center">
                <Wine className="text-amber-400 w-6 h-6 mx-auto mb-2" />
                <h3 className="text-xl md:text-2xl font-bold tracking-wider">
                  BEBIDAS PREMIUM
                </h3>
                <div className="w-16 h-0.5 bg-amber-400 mx-auto mt-2"></div>
              </div>
            </div>
          </div>

          {/* Postres & Café */}
          <div
            onClick={() => navigate("/card/POSTRES %26 CAFÉ")}
            className="relative h-48 md:h-56 rounded-lg overflow-hidden group cursor-pointer transform transition-transform duration-300 hover:scale-105"
          >
            <img
              src="https://images.pexels.com/photos/6963676/pexels-photo-6963676.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Postres y Café"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 group-hover:bg-opacity-40 transition-all duration-300"></div>
            <div className="absolute inset-0 flex items-end mb-8 justify-center">
              <div className="text-center">
                <Coffee className="text-amber-400 w-6 h-6 mx-auto mb-2" />
                <h3 className="text-xl md:text-2xl font-bold tracking-wider">
                  POSTRES & CAFÉ
                </h3>
                <div className="w-16 h-0.5 bg-amber-400 mx-auto mt-2"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent mb-8"></div>

        {/* Footer Text */}
        <div className="text-center mt-8">
          <p className="text-[var(--gold-primary)] text-xs tracking-[0.2em] font-light opacity-60">
            &copy; 2026 CPD - BINGO OASIS
          </p>
        </div>
      </div>
    </div>
  );
}

export default CorePage;
