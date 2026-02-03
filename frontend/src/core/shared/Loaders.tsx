import { useEffect, useState } from "react"
import '../utils/css/loaderDomain.scss'
interface LoaderProps {
    visible: boolean
}

export const LoaderPageDomain: React.FC<LoaderProps> = ({ visible }) => {
    //manejamos la visibilidad del componente
    const [show, setShow] = useState<boolean>(visible)

    useEffect(() => {
        if (visible) {
            setShow(true)
        } else {
            //retrasar la eliminacion para que termine la animacion
            setTimeout(() => {
                setShow(false)
            }, 2500)
        }
    }, [visible])

    return show ? (
        <div className={`loader-container ${visible ? "visible" : "hidden"}`}>
            <div className="palm-loader">
                <div className="palm-tree">
                    <img src={`/images/logo.pilar.png`} alt="Logo" className="palm-image" />
                </div>
                <div className="dots-circle">
                    {[...Array(24)].map((_, i) => (
                        <div
                            key={i}
                            className="dot"
                            style={{
                                transform: `rotate(${i * 15}deg) translateY(-40px)`,
                            }}
                        ></div>
                    ))}
                </div>
            </div>
        </div>
    ) : null
}