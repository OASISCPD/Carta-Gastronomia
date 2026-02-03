interface ContainerPagesProps {
  children: React.ReactNode;
}
export const ContainerPages: React.FC<ContainerPagesProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-night-veil text-white antialiased">
      <div className="w-full max-w-sm sm:max-w-2xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  );
};
