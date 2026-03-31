import { lazy, Suspense } from "react";
import { Navigate, Route, Routes, useParams } from "react-router-dom";
import { GlobalLoaderProvider, LoaderPageDomain } from "../shared/Loaders";
import { ContainerPages } from "../shared/ContainerPages";
import CorePage from "../pages/page";
import { getCanonicalCategoryPath } from "../utils/cartaSlug";

const PageCard = lazy(() => import("../pages/card/page"));

const LegacyCardRedirect = () => {
  const { value } = useParams<{ value?: string }>();

  return <Navigate to={getCanonicalCategoryPath(value)} replace />;
};

export const RouterContainer = () => {
  return (
    <ContainerPages>
      <GlobalLoaderProvider>
        <Suspense fallback={<LoaderPageDomain visible />}>
          <Routes>
            <Route path="/" element={<CorePage />} />
            <Route path="/home" element={<Navigate to="/" replace />} />
            <Route path="/card/:value?" element={<LegacyCardRedirect />} />
            <Route path="/:value" element={<PageCard />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </GlobalLoaderProvider>
    </ContainerPages>
  );
};
