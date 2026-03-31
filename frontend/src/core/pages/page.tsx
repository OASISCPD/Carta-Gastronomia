import { useEffect } from "react";
import { FaLocationDot, FaWhatsapp } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { prefetchArticulos } from "../../services/articulos.service";
import { toCartaSlug } from "../utils/cartaSlug";
import { useGlobalLoader } from "../shared/Loaders";

const buildPexelsImageUrl = (baseUrl: string, width: number): string => {
  return `${baseUrl}?auto=compress&cs=tinysrgb&fit=crop&w=${width}&fm=webp`;
};

function CorePage() {
  const navigate = useNavigate();
  const { resetLoader, showLoader } = useGlobalLoader();

  const CATEGORIES = [
    {
      name: "RESTAURANT",
      label: "RESTAURANTE",
      imageBase: "https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg",
      path: `/${toCartaSlug("RESTAURANT")}`,
    },
    {
      name: "PROMOCIONES",
      label: "PROMOCIONES",
      imageBase: "https://images.pexels.com/photos/1565982/pexels-photo-1565982.jpeg",
      path: `/${toCartaSlug("PROMOCIONES")}`,
    },
    {
      name: "BEBIDAS PREMIUM",
      label: "BEBIDAS PREMIUM",
      imageBase: "https://images.pexels.com/photos/1189257/pexels-photo-1189257.jpeg",
      path: `/${toCartaSlug("BEBIDAS PREMIUM")}`,
    },
    {
      name: "POSTRES & CAFE",
      label: "POSTRES Y CAFE",
      imageBase: "https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg",
      path: `/${toCartaSlug("POSTRES & CAFE")}`,
    },
  ];

  const CONTACT_PHONE = "+543874101956";
  const CONTACT_ADDRESS = "Alberdi 165, Salta";
  const CONTACT_ADDRESS_FULL = "Alberdi 165, A4400 - Salta";
  const MAPS_URL = "https://maps.app.goo.gl/cdVtxH2d5bLAUAtU9";

  useEffect(() => {
    resetLoader();
  }, [resetLoader]);

  return (
    <div className="app-mobile-shell app-dvh min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)]">
      <div className="container mx-auto flex min-h-[100svh] max-w-6xl flex-col px-4 pb-6 pt-6 sm:px-6 md:min-h-screen md:px-8 md:pb-10 md:pt-10">
        <div className="mb-3 flex justify-center md:mb-5">
          <div className="flex h-30 w-30 items-center justify-center opacity-90 md:h-50 md:w-50">
            <img
              src="/images/logo.salta.png"
              alt="Logo"
              className="drop-shadow-sm"
              width={200}
              height={200}
            />
          </div>
        </div>

        <div className="mb-5 text-center md:mb-10">
          <h1 className="mb-2 text-[34px] font-bold leading-none tracking-[0.03em] text-[var(--gold-primary)] md:mb-3 md:text-5xl md:tracking-[0.04em]">
            BIENVENIDOS
          </h1>
          <span className="text-[11px] font-medium uppercase tracking-[0.04em] text-[var(--text-muted)]/95 sm:text-[14px] md:text-[15px] md:tracking-[0.08em]">
            SABORES, COCTELERIA Y CLASICOS
          </span>
        </div>

        <div className="flex flex-1 items-center justify-center py-2 md:py-0">
          <div className="mx-auto grid w-full max-w-[420px] grid-cols-2 gap-3.5 sm:max-w-[560px] md:max-w-[760px] md:gap-6">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.name}
                onMouseEnter={() => {
                  void prefetchArticulos();
                }}
                onTouchStart={() => {
                  void prefetchArticulos();
                }}
                onClick={() => {
                  const loaderStartedAt = Date.now();
                  showLoader();
                  navigate(cat.path, {
                    state: { loaderPrimed: true, loaderStartedAt },
                  });
                }}
                type="button"
                className="group relative aspect-[0.92/1] w-full cursor-pointer overflow-hidden rounded-lg border border-white/12 shadow-[0_10px_24px_rgba(0,0,0,0.3)] transition-[border-color,box-shadow] duration-200 ease-out hover:border-[var(--line-accent)] hover:shadow-[0_14px_32px_rgba(0,0,0,0.42)] md:aspect-[1/1] md:rounded-2xl"
              >
                <img
                  src={buildPexelsImageUrl(cat.imageBase, 640)}
                  srcSet={[
                    `${buildPexelsImageUrl(cat.imageBase, 480)} 480w`,
                    `${buildPexelsImageUrl(cat.imageBase, 640)} 640w`,
                    `${buildPexelsImageUrl(cat.imageBase, 960)} 960w`,
                    `${buildPexelsImageUrl(cat.imageBase, 1280)} 1280w`,
                  ].join(", ")}
                  sizes="(max-width: 640px) 48vw, (max-width: 1024px) 38vw, 24vw"
                  alt={cat.name}
                  loading={cat.name === "RESTAURANT" ? "eager" : "lazy"}
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.012]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/82 via-black/32 to-black/8" />
                <div className="absolute inset-x-0 bottom-2 px-2 text-center md:bottom-3 md:px-3">
                  <span className="inline-flex items-center justify-center rounded-full border border-white/15 bg-black/35 px-2.5 py-1 backdrop-blur-[1px] md:px-3 md:py-1.5">
                    <h3 className="text-[11px] font-semibold leading-tight tracking-[0.008em] text-white uppercase md:text-sm md:tracking-[0.015em]">
                      {cat.label}
                    </h3>
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-auto w-full max-w-[420px] pt-5 sm:max-w-[560px] md:mt-7 md:max-w-[760px] md:pt-0">
          <div className="rounded-xl border border-[var(--line-subtle)] bg-[var(--surface-2)]/50 px-3 py-3.5 md:px-4">
            <p className="mb-2 text-center text-[10px] uppercase tracking-[0.06em] text-[var(--gold-primary)] md:text-[11px] md:tracking-[0.08em]">
              Contacto
            </p>
            <div className="mx-auto mb-3 h-px w-14 bg-[var(--line-accent)]/70" />
            <div className="grid grid-cols-2 gap-2.5">
              <a
                href="https://wa.me/543874101956"
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-13 items-center justify-center gap-1 rounded-lg border border-white/10 bg-[var(--surface-1)]/55 px-1.5 text-[11px] text-[var(--text-muted)] transition-all hover:border-[var(--line-accent)] hover:text-[var(--gold-primary)] active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-[var(--line-accent)] focus-visible:outline-none md:min-h-16 md:px-2 md:text-xs"
              >
                <FaWhatsapp className="h-4.5 w-4.5 md:h-5 md:w-5" />
                {CONTACT_PHONE}
              </a>
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noreferrer"
                title={CONTACT_ADDRESS_FULL}
                className="inline-flex min-h-13 items-center justify-center gap-1 rounded-lg border border-white/10 bg-[var(--surface-1)]/55 px-1.5 text-[11px] text-[var(--text-muted)] transition-all hover:border-[var(--line-accent)] hover:text-[var(--gold-primary)] active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-[var(--line-accent)] focus-visible:outline-none md:min-h-16 md:px-2 md:text-xs"
              >
                <FaLocationDot className="h-4.5 w-4.5 md:h-5 md:w-5" />
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
