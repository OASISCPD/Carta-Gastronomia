import { Route, Routes } from "react-router-dom"
import PageCard from "../pages/card/page"
import RedirectModule from "../hook/RedirectComponent"
import CorePage from "../pages/page"
import { ContainerPages } from "../shared/ContainerPages"

export const RouterContainer = () => {
    return (
        <ContainerPages>
            <Routes>
                <Route path="/" element={<RedirectModule route="/home" />} />
                <Route path="/home" element={<CorePage />} />
                <Route path="/card/:value?" element={<PageCard />} />
            </Routes>
        </ContainerPages>
    )
}