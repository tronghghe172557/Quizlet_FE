import WelcomeCard from "../../components/WelcomeCard";

export default function HomePage() {
  return (
    <div 
      className="flex min-h-screen items-center justify-center p-6"
      style={{ 
        background: 'linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%)' 
      }}
    >
      <WelcomeCard />
    </div>
  );
}
