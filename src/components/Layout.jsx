import Header from "./Header";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
