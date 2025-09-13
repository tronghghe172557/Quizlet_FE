import Header from "./Header";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Header />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
