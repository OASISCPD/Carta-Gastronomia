import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="glass-dark sticky top-0 z-50 py-4 px-4 sm:px-6">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <Link
            to="/home"
            className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300 hover:border-[var(--gold-primary)]"
          >
            <ArrowLeft size={20} className="text-white/80" />
          </Link>
          <div className="flex flex-col">
            <h1
              className="text-2xl sm:text-3xl font-bold tracking-[0.1em] bg-gradient-to-r from-[var(--gold-light)] via-[var(--gold-primary)] to-[var(--gold-dark)] bg-clip-text text-transparent"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              NCA
            </h1>
            <span className="text-[10px] sm:text-xs tracking-[0.3em] text-[var(--red-accent)] font-medium uppercase">
              Gastronomía
            </span>
          </div>
        </div>

        {/* Decorative element */}
      </div>
    </header>
  );
};

export default Header;
