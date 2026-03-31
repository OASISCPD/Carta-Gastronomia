interface ContainerPagesProps {
  children: React.ReactNode;
}
export const ContainerPages: React.FC<ContainerPagesProps> = ({ children }) => {
  return (
    <div className="app-dvh min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] antialiased">
      <div className="w-full">
        {children}
      </div>
    </div>
  );
};
