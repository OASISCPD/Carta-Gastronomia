import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 h-[73px] border-b border-[var(--line-subtle)] bg-[var(--surface-1)]/92 px-4 shadow-[0_6px_24px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:px-6">
      <div className="mx-auto grid h-full max-w-7xl grid-cols-[44px_1fr_44px] items-center">
        <div>
          <Link
            to="/"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-transparent bg-transparent text-[var(--text-muted)] transition-all duration-300 hover:border-[var(--line-subtle)] hover:bg-[var(--surface-2)]/50 hover:text-[var(--gold-primary)]"
            aria-label="Volver al inicio"
          >
            <ArrowLeft size={18} />
          </Link>
        </div>

        <div className="pointer-events-none flex items-center justify-center">
          <img
            src="/images/logo.salta.top.png"
            alt="Logo Salta"
            className="h-9 w-auto max-w-[70%] object-contain opacity-95"
          />
        </div>

        <div aria-hidden="true" />
      </div>
    </header>
  );
};

export default Header;
