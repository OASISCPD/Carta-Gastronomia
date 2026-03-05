import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 py-4 px-4 sm:px-6 border-b border-white/70 bg-white/70 backdrop-blur-xl shadow-[0_6px_24px_rgba(15,23,42,0.06)]">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <Link
            to="/home"
            className="p-2.5 rounded-full bg-white hover:bg-amber-50 border border-slate-200 transition-all duration-300 hover:border-[var(--gold-primary)] hover:-translate-x-0.5"
          >
            <ArrowLeft size={20} className="text-slate-600" />
          </Link>
          <div className="flex flex-col">
            <h1
              className="text-2xl sm:text-3xl font-bold tracking-[0.1em] bg-gradient-to-r from-[var(--gold-light)] via-[var(--gold-primary)] to-[var(--gold-dark)] bg-clip-text text-transparent"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              NCA
            </h1>
            <span className="text-[10px] sm:text-xs tracking-[0.3em] text-[var(--red-accent)] font-semibold uppercase">
              Gastronomia
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
