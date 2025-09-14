import { Link } from "react-router-dom";

export default function QuizCard({ quiz }) {
  const title = quiz.title || quiz.model || "Quiz";
  const subtitle = quiz.sourceText?.slice(0, 120) || "";

  return (
    <Link to={`/quizzes/${quiz._id}`} className="group">
      <div 
        className="rounded-2xl shadow-lg border p-6 h-full transition-all hover:shadow-xl hover:scale-105"
        style={{ 
          backgroundColor: 'var(--card-bg)', 
          borderColor: 'var(--border-color)' 
        }}
      >
        <div className="flex items-start justify-between mb-4">
          <div 
            className="text-lg font-semibold line-clamp-2 group-hover:text-blue-600 transition-colors"
            style={{ color: 'var(--text-primary)' }}
          >
            {title}
          </div>
          <span 
            className="text-sm px-2 py-1 rounded-full whitespace-nowrap ml-2"
            style={{ 
              color: 'var(--text-secondary)', 
              backgroundColor: 'var(--bg-secondary)' 
            }}
          >
            {quiz?.questions?.length || 0} câu
          </span>
        </div>
        <p 
          className="text-sm line-clamp-3 leading-relaxed"
          style={{ color: 'var(--text-secondary)' }}
        >
          {subtitle}
        </p>
        <div className="mt-4 text-xs" style={{ color: 'var(--text-secondary)' }}>
          Tạo bởi: {typeof quiz?.createdBy === 'object' ? quiz?.createdBy?.email || quiz?.createdBy?.name || "Unknown" : quiz?.createdBy || "Unknown"}
        </div>
      </div>
    </Link>
  );
}
