import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoaderPageDomain } from "../shared/Loaders";

interface RedirectModuleProps {
    route: string;
}

const RedirectModule: React.FC<RedirectModuleProps> = ({ route }) => {
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
            navigate(route);
        }, 2500);

        return () => clearTimeout(timer);
    }, [navigate, route]);

    return (
        <main className="min-h-screen flex flex-col items-center justify-center p-4">
            {isLoading && <LoaderPageDomain visible />}
        </main>
    );
};

export default RedirectModule;
