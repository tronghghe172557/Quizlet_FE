import { Link } from "react-router-dom";

export default function QuizCard({ quiz }) {
  const title = quiz.title || quiz.model || "Quiz";
  const subtitle = quiz.sourceText?.slice(0, 120) || "";

  return (
    <Link to={`/quizzes/${quiz._id}`} className="group">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 h-full transition hover:shadow-md">
        <div className="flex items-start justify-between mb-3">
          <div className="text-base font-medium text-gray-900 group-hover:text-blue-600 transition">{title}</div>
          <span className="text-xs text-gray-500">{quiz?.questions?.length || 0} câu</span>
        </div>
        <p className="text-sm text-gray-500 line-clamp-3">{subtitle}</p>
      </div>
    </Link>
  );
}
