import { useEffect, useReducer } from "react"
import '../utils/css/loaderDomain.scss'
interface LoaderProps {
    visible: boolean
}

interface LoaderState {
    shouldRender: boolean
    isVisible: boolean
}

type LoaderAction =
    | { type: "SHOW" }
    | { type: "START_HIDE" }
    | { type: "FINISH_HIDE" }

const loaderReducer = (state: LoaderState, action: LoaderAction): LoaderState => {
    switch (action.type) {
        case "SHOW":
            return { shouldRender: true, isVisible: true }
        case "START_HIDE":
            if (!state.shouldRender) return state
            return { ...state, isVisible: false }
        case "FINISH_HIDE":
            return { shouldRender: false, isVisible: false }
        default:
            return state
    }
}

export const LoaderPageDomain: React.FC<LoaderProps> = ({ visible }) => {
    const [state, dispatch] = useReducer(
        loaderReducer,
        visible,
        (isVisible): LoaderState => ({
            shouldRender: isVisible,
            isVisible,
        })
    )

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout> | undefined

        if (visible) {
            dispatch({ type: "SHOW" })
        } else {
            dispatch({ type: "START_HIDE" })
            timer = setTimeout(() => {
                dispatch({ type: "FINISH_HIDE" })
            }, 2500)
        }

        return () => {
            if (timer) clearTimeout(timer)
        }
    }, [visible])

    return state.shouldRender ? (
        <div className={`loader-container ${state.isVisible ? "visible" : "hidden"}`}>
            <div className="brand-loader" role="status" aria-live="polite" aria-label="Cargando">
                <div className="brand-loader__scene">
                    <div className="dots-circle">
                        {[...Array(24)].map((_, i) => (
                            <div
                                key={`dot-${i * 15}`}
                                className="dot"
                                style={{
                                    transform: `rotate(${i * 15}deg) translateX(64px)`,
                                }}
                            ></div>
                        ))}
                    </div>
                    <div className="brand-loader__badge">
                        <img src={`/images/logo.salta.png`} alt="Logo" className="brand-loader__image" />
                    </div>
                </div>
                <p className="brand-loader__label">Cargando carta...</p>
            </div>
        </div>
    ) : null
}
