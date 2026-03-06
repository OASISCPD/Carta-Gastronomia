import { FaLocationDot, FaWhatsapp } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

function CorePage() {
  const navigate = useNavigate();

  const CATEGORIES = [
    {
      name: "RESTAURANT",
      label: "RESTAURANTE",
      image:
        "https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=800",
      path: "/card/RESTAURANT",
    },
    {
      name: "PROMOCIONES",
      label: "PROMOCIONES",
      image:
        "https://images.pexels.com/photos/1565982/pexels-photo-1565982.jpeg?auto=compress&cs=tinysrgb&w=800",
      path: "/card/PROMOCIONES",
    },
    {
      name: "BEBIDAS PREMIUM",
      label: "BEBIDAS PREMIUM",
      image:
        "https://images.pexels.com/photos/1189257/pexels-photo-1189257.jpeg?auto=compress&cs=tinysrgb&w=800",
      path: "/card/BEBIDAS PREMIUM",
    },
    {
      name: "POSTRES & CAFE",
      label: "POSTRES Y CAFE",
      image:
        "https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=800",
      path: `/card/${encodeURIComponent("POSTRES & CAFE")}`,
    },
  ];

  const CONTACT_PHONE = "+543874101956";
  const CONTACT_ADDRESS = "Alberdi 165, Salta";
  const CONTACT_ADDRESS_FULL = "Alberdi 165, A4400 - Salta";
  const MAPS_URL = "https://maps.app.goo.gl/cdVtxH2d5bLAUAtU9";

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)]">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 md:px-8 pt-6 md:pt-10 pb-6 md:pb-10 min-h-screen flex flex-col">
        <div className="flex justify-center mb-3 md:mb-5">
          <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center opacity-90">
            <img
              src="/images/logo.salta.png"
              alt="Logo"
              className="drop-shadow-sm"
            />
          </div>
        </div>

        <div className="text-center mb-5 md:mb-10">
          <h1 className="text-[34px] md:text-5xl font-bold text-[var(--gold-primary)] mb-2 md:mb-3 tracking-[0.03em] md:tracking-[0.04em] leading-none">
            BIENVENIDOS
          </h1>
          <span className="text-[var(--text-muted)]/95 text-[11px] sm:text-[14px] md:text-[15px] uppercase tracking-[0.04em] md:tracking-[0.08em] font-medium">
            SABORES, COCTELERIA Y CLASICOS
          </span>
        </div>

        <div className="flex-1 flex items-center justify-center py-2 md:py-0">
          <div className="grid grid-cols-2 gap-3.5 md:gap-6 max-w-[420px] sm:max-w-[560px] md:max-w-[760px] mx-auto w-full">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.name}
                onClick={() => navigate(cat.path)}
                type="button"
                className="group relative w-full aspect-[0.92/1] md:aspect-[1/1] rounded-lg md:rounded-2xl overflow-hidden cursor-pointer border border-white/12 shadow-[0_10px_24px_rgba(0,0,0,0.3)] transition-[border-color,box-shadow] duration-200 ease-out hover:border-[var(--line-accent)] hover:shadow-[0_14px_32px_rgba(0,0,0,0.42)] motion-reduce:transform-none"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.015] motion-reduce:transform-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/82 via-black/32 to-black/8" />
                <div className="absolute inset-x-0 bottom-2 md:bottom-3 px-2 md:px-3 text-center">
                  <span className="inline-flex items-center justify-center rounded-full border border-white/15 bg-black/35 px-2.5 md:px-3 py-1 md:py-1.5 backdrop-blur-[1px]">
                    <h3 className="text-[11px] md:text-sm font-semibold tracking-[0.008em] md:tracking-[0.015em] text-white uppercase leading-tight">
                    {cat.label}
                    </h3>
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-[420px] sm:max-w-[560px] md:max-w-[760px] mx-auto w-full mt-auto pt-5 md:mt-7 md:pt-0">
          <div className="rounded-xl border border-[var(--line-subtle)] bg-[var(--surface-2)]/50 px-3 md:px-4 py-3.5">
            <p className="text-[10px] md:text-[11px] uppercase tracking-[0.06em] md:tracking-[0.08em] text-[var(--gold-primary)] mb-2 text-center">
              Contacto
            </p>
            <div className="w-14 h-px bg-[var(--line-accent)]/70 mx-auto mb-3" />
            <div className="grid grid-cols-2 gap-2.5">
              <a
                href="https://wa.me/543874101956"
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-13 md:min-h-16 items-center justify-center gap-1 rounded-lg border border-white/10 bg-[var(--surface-1)]/55 px-1.5 md:px-2 text-[11px] md:text-xs text-[var(--text-muted)] hover:text-[var(--gold-primary)] hover:border-[var(--line-accent)] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--line-accent)] transition-all"
              >
                <FaWhatsapp className="w-4.5 h-4.5 md:w-5 md:h-5" />
                {CONTACT_PHONE}
              </a>
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noreferrer"
                title={CONTACT_ADDRESS_FULL}
                className="inline-flex min-h-13 md:min-h-16 items-center justify-center gap-1 rounded-lg border border-white/10 bg-[var(--surface-1)]/55 px-1.5 md:px-2 text-[11px] md:text-xs text-[var(--text-muted)] hover:text-[var(--gold-primary)] hover:border-[var(--line-accent)] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--line-accent)] transition-all"
              >
                <FaLocationDot className="w-4.5 h-4.5 md:w-5 md:h-5" />
                {CONTACT_ADDRESS}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CorePage;
