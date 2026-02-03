interface ContainerPagesProps {
    children: React.ReactNode
}
export const ContainerPages: React.FC<ContainerPagesProps> = ({ children }) => {
    return (
        <div className=" min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white break-words text-xs">
            <div className=" max-w-sm  sm:max-w-2xl lg:max-w-4xl mx-auto">
                {children}
            </div>
        </div>
    )
}