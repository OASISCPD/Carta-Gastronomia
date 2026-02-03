import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from 'framer-motion'
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
        }, 2500); // 3000 milisegundos = 3 segundos

        return () => clearTimeout(timer); // Limpia el temporizador al desmontar el componente
    }, [navigate]);

    return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-stone-900 p-4">
            {isLoading && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="fixed inset-0 flex items-center justify-center bg-stone-900 z-50"
                >
                    {/* Aquí puedes colocar tu animación de carga */}
                    <LoaderPageDomain visible />
                </motion.div>
            )}
        </main>
    )
}

export default RedirectModule