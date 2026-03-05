import React, { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";

export const BackToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > 500) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility, { passive: true });
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0 pointer-events-none"}`}
    >
      <button
        onClick={scrollToTop}
        className="bg-white/95 backdrop-blur-md text-[var(--gold-primary)] p-3 rounded-full shadow-lg shadow-slate-300/40 border border-[var(--gold-primary)]/35 hover:bg-[var(--bg-main)] hover:border-[var(--gold-primary)]/60 hover:scale-110 active:scale-95 transition-all group"
        aria-label="Volver arriba"
      >
        <ChevronUp
          size={24}
          className="group-hover:-translate-y-1 transition-transform"
        />
      </button>
    </div>
  );
};
