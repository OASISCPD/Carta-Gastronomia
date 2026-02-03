interface props {
    children: React.ReactNode
}

export const ContainerModals: React.FC<props> = ({ children }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[var(--bg-100)] rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    )
}