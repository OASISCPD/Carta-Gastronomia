import { Utensils, Sparkles, Tag, Wine, Coffee } from "lucide-react";
import { useNavigate } from "react-router-dom";

function CorePage() {
  const navigate = useNavigate();

  const CATEGORIES = [
    {
      name: "RESTAURANT",
      icon: Utensils,
      image:
        "https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=800",
      path: "/card/RESTAURANT",
    },
    {
      name: "PROMOCIONES",
      icon: Tag,
      image:
        "https://images.pexels.com/photos/1565982/pexels-photo-1565982.jpeg?auto=compress&cs=tinysrgb&w=800",
      path: "/card/PROMOCIONES",
    },
    {
      name: "BEBIDAS PREMIUM",
      icon: Wine,
      image:
        "https://images.pexels.com/photos/1189257/pexels-photo-1189257.jpeg?auto=compress&cs=tinysrgb&w=800",
      path: "/card/BEBIDAS PREMIUM",
    },
    {
      name: "POSTRES & CAFÉ",
      icon: Coffee,
      image:
        "https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=800",
      path: "/card/POSTRES %26 CAFÉ",
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-main)]">
      {/* Header */}
      <div className="container mx-auto px-6 py-8">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 flex items-center justify-center">
            <img
              src="/images/logo.salta.png"
              alt="Logo"
              className="drop-shadow-sm"
            />
          </div>
        </div>

        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-light text-[var(--gold-primary)] mb-4 tracking-wide">
            BIENVENIDOS
          </h1>
          <div className="flex items-center justify-center gap-4 mb-8">
            <Sparkles className="text-[var(--gold-primary)] w-4 h-4" />
            <span className="text-slate-500 text-lg uppercase tracking-widest font-medium">
              AL EMOCIONANTE MUNDO DEL BINGO
            </span>
            <Sparkles className="text-[var(--gold-primary)] w-4 h-4" />
          </div>
        </div>

        {/* Main Grid - Static Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 max-w-4xl mx-auto px-4">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.name}
              onClick={() => navigate(cat.path)}
              className="group flex flex-col bg-white rounded-2xl overflow-hidden cursor-pointer shadow-md shadow-slate-200/60 border border-slate-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-amber-200"
            >
              <div className="h-44 overflow-hidden">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="p-6 text-center bg-white">
                <cat.icon className="text-[var(--gold-primary)] w-6 h-6 mx-auto mb-3" />
                <h3 className="text-xl font-bold tracking-[0.2em] text-slate-900 mb-2 uppercase">
                  {cat.name}
                </h3>
                <div className="w-12 h-0.5 bg-amber-400 mx-auto opacity-40"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[var(--gold-primary)] to-transparent mb-8 opacity-20"></div>

        {/* Footer Text */}
        <div className="text-center mt-8">
          <p className="text-slate-400 text-xs tracking-[0.2em] font-medium">
            &copy; 2026 CPD - BINGO OASIS
          </p>
        </div>
      </div>
    </div>
  );
}

export default CorePage;
