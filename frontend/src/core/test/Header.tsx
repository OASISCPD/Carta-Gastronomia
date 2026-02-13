import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="glass py-4 px-4 sm:px-6 relative z-30">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <Link
            to="/home"
            className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all duration-300 hover:border-[var(--gold-primary)]"
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
