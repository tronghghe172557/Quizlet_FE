import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function QuizCard({ quiz, onShare }) {
  const { user } = useAuth();
  const title = quiz.title || quiz.model || "Quiz";
  const subtitle = quiz.sourceText?.slice(0, 120) || "";
  const isAdmin = user?.role === 'admin';

  const handleShareClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onShare) {
      onShare(quiz);
    }
  };

  return (
    <div className="group relative">
      <Link to={`/quizzes/${quiz._id}`} className="block">
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
      
      {/* Share Button for Admin */}
      {isAdmin && (
        <button
          onClick={handleShareClick}
          className="absolute top-3 right-3 p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200"
          title="Chia sẻ quiz"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
          </svg>
        </button>
      )}
    </div>
  );
}
