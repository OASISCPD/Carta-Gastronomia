import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { ContainerPages } from "../shared/ContainerPages";

const PageCard = lazy(() => import("../pages/card/page"));
const RedirectModule = lazy(() => import("../hook/RedirectComponent"));
const CorePage = lazy(() => import("../pages/page"));

export const RouterContainer = () => {
  return (
    <ContainerPages>
      <Suspense fallback={<div className="min-h-screen bg-[var(--bg-main)]" />}>
        <Routes>
          <Route path="/" element={<RedirectModule route="/home" />} />
          <Route path="/home" element={<CorePage />} />
          <Route path="/card/:value?" element={<PageCard />} />
        </Routes>
      </Suspense>
    </ContainerPages>
  );
};
