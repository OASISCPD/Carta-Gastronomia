import { Star, QrCode, Calendar, Gift } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function CorePage() {
    const navigate = useNavigate();

    const handleNavigate = (link: string) => {
        navigate(link)
    }

    return (
        <div className="min-h-screen ">
            {/* Header */}
            <div className="container mx-auto px-6 py-8">
                {/* Logo */}
                <div className="flex justify-center mb-8">
                    <div className="w-20 h-20  rounded-full flex items-center justify-center">
                        {/*   <span className="text-black font-bold text-2xl">BO</span> */}
                        <img src="/images/logo.pilar.png" alt="Logo Dominio" />
                    </div>
                </div>

                {/* Welcome Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-light text-amber-400 mb-4 tracking-wide">
                        BIENVENIDOS
                    </h1>
                    <div className="flex items-center justify-center gap-4 mb-8">
                        <Star className="text-amber-400 w-4 h-4" />
                        <span className="text-gray-300 text-lg uppercase tracking-widest">
                            AL MUNDO EMOCIONANTE DEL BINGO
                        </span>
                        <Star className="text-amber-400 w-4 h-4" />
                    </div>
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 max-w-4xl mx-auto">
                    {/* Salas de Bingo */}
                    <div onClick={() => navigate('/card/restaurantes')} className="relative h-48 md:h-56 rounded-lg overflow-hidden group cursor-pointer transform transition-transform duration-300 hover:scale-105">
                        <img
                            src="https://images.pexels.com/photos/6963944/pexels-photo-6963944.jpeg?auto=compress&cs=tinysrgb&w=800"
                            alt="Salas de Bingo"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-50 group-hover:bg-opacity-40 transition-all duration-300"></div>
                        <div className="absolute inset-0 flex items-end mb-8 justify-center">
                            <div className="text-center">
                                <Star className="text-amber-400 w-6 h-6 mx-auto mb-2" />
                                <h3 className="text-xl md:text-2xl font-bold tracking-wide">SALAS DE BINGO</h3>
                                <div className="w-16 h-0.5 bg-amber-400 mx-auto mt-2"></div>
                            </div>
                        </div>
                    </div>

                    {/* Promociones */}
                    <div className="relative h-48 md:h-56 rounded-lg overflow-hidden group cursor-pointer transform transition-transform duration-300 hover:scale-105">
                        <img
                            src="https://images.pexels.com/photos/6963765/pexels-photo-6963765.jpeg?auto=compress&cs=tinysrgb&w=800"
                            alt="Promociones"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-50 group-hover:bg-opacity-40 transition-all duration-300"></div>
                        <div className="absolute inset-0 flex items-end mb-8 justify-center">
                            <div className="text-center">
                                <Star className="text-amber-400 w-6 h-6 mx-auto mb-2" />
                                <h3 className="text-xl md:text-2xl font-bold tracking-wide">PROMOCIONES</h3>
                                <div className="w-16 h-0.5 bg-amber-400 mx-auto mt-2"></div>
                            </div>
                        </div>
                    </div>

                    {/* Eventos Especiales */}
                    <div className="relative h-48 md:h-56 rounded-lg overflow-hidden group cursor-pointer transform transition-transform duration-300 hover:scale-105">
                        <img
                            src="https://images.pexels.com/photos/8111357/pexels-photo-8111357.jpeg?auto=compress&cs=tinysrgb&w=800"
                            alt="Eventos Especiales"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-50 group-hover:bg-opacity-40 transition-all duration-300"></div>
                        <div className="absolute inset-0 flex items-end mb-8 justify-center">
                            <div className="text-center">
                                <Star className="text-amber-400 w-6 h-6 mx-auto mb-2" />
                                <h3 className="text-xl md:text-2xl font-bold tracking-wide">EVENTOS ESPECIALES</h3>
                                <div className="w-16 h-0.5 bg-amber-400 mx-auto mt-2"></div>
                            </div>
                        </div>
                    </div>

                    {/* Premios */}
                    <div className="relative h-48 md:h-56 rounded-lg overflow-hidden group cursor-pointer transform transition-transform duration-300 hover:scale-105">
                        <img
                            src="https://images.pexels.com/photos/6963676/pexels-photo-6963676.jpeg?auto=compress&cs=tinysrgb&w=800"
                            alt="Premios"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-50 group-hover:bg-opacity-40 transition-all duration-300"></div>
                        <div className="absolute inset-0 flex items-end mb-8 justify-center">
                            <div className="text-center">
                                <Star className="text-amber-400 w-6 h-6 mx-auto mb-2" />
                                <h3 className="text-xl md:text-2xl font-bold tracking-wide">PREMIOS</h3>
                                <div className="w-16 h-0.5 bg-amber-400 mx-auto mt-2"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 max-w-md mx-auto">
                    <button className="w-full sm:w-auto px-8 py-3 bg-transparent border-2 border-amber-400 text-amber-400 rounded-full hover:bg-amber-400 hover:text-black transition-all duration-300 flex items-center justify-center gap-2 font-semibold tracking-wide">
                        <Star className="w-4 h-4" />
                        HORARIOS DE JUEGO
                        <Star className="w-4 h-4" />
                    </button>
                    <button className="w-full sm:w-auto px-8 py-3 bg-transparent border-2 border-amber-400 text-amber-400 rounded-full hover:bg-amber-400 hover:text-black transition-all duration-300 flex items-center justify-center gap-2 font-semibold tracking-wide">
                        <Star className="w-4 h-4" />
                        MEMBRESÍAS VIP
                        <Star className="w-4 h-4" />
                    </button>
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent mb-8"></div>

                {/* Footer Icons */}
                <div className="flex justify-center gap-12 md:gap-16">
                    <div className="text-center group cursor-pointer">
                        <div className="w-12 h-12 mx-auto mb-2 border border-gray-600 rounded-lg flex items-center justify-center group-hover:border-amber-400 transition-colors duration-300">
                            <QrCode className="w-6 h-6 text-gray-400 group-hover:text-amber-400 transition-colors duration-300" />
                        </div>
                        <span className="text-sm text-gray-400 group-hover:text-amber-400 transition-colors duration-300">Código QR</span>
                    </div>

                    <div className="text-center group cursor-pointer">
                        <div className="w-12 h-12 mx-auto mb-2 border border-gray-600 rounded-lg flex items-center justify-center group-hover:border-amber-400 transition-colors duration-300">
                            <Calendar className="w-6 h-6 text-gray-400 group-hover:text-amber-400 transition-colors duration-300" />
                        </div>
                        <span className="text-sm text-gray-400 group-hover:text-amber-400 transition-colors duration-300">Reservas</span>
                    </div>

                    <div className="text-center group cursor-pointer">
                        <div className="w-12 h-12 mx-auto mb-2 border border-gray-600 rounded-lg flex items-center justify-center group-hover:border-amber-400 transition-colors duration-300">
                            <Gift className="w-6 h-6 text-gray-400 group-hover:text-amber-400 transition-colors duration-300" />
                        </div>
                        <span className="text-sm text-gray-400 group-hover:text-amber-400 transition-colors duration-300">Regalos</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CorePage;