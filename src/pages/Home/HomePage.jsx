import ContributionGraph from "../../components/ContributionGraph";

export default function HomePage() {
  return (
    <div 
      className="min-h-screen p-6"
      style={{ 
        background: 'linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%)' 
      }}
    >
      <div className="max-w-6xl mx-auto">
        <ContributionGraph />
      </div>
    </div>
  );
}
