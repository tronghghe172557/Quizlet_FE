import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../utils/api";
import { useAuth } from "../../contexts/AuthContext";
import QuizCard from "../../components/QuizCard";
import QuizSharingModal from "../../components/QuizSharingModal";

export default function QuizListPage() {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [titleFilter, setTitleFilter] = useState("");
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [showSharingModal, setShowSharingModal] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const items = await api.getQuizzes();
        if (isMounted) setQuizzes(items);
      } catch (err) {
        if (isMounted) setError(err?.message || "Lỗi không xác định");
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const filtered = quizzes.filter((q) => {
    const title = (q.title || q.model || "").toLowerCase();
    return title.includes(titleFilter.trim().toLowerCase());
  });

  const handleShareQuiz = (quiz) => {
    setSelectedQuiz(quiz);
    setShowSharingModal(true);
  };

  const handleCloseSharingModal = () => {
    setShowSharingModal(false);
    setSelectedQuiz(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div style={{ color: 'var(--text-secondary)' }}>Đang tải...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="px-4 py-3 rounded-lg shadow" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--text-primary)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Bộ đề kiểm tra</h1>
          <div className="flex items-center gap-3">
            <input
              value={titleFilter}
              onChange={(e) => setTitleFilter(e.target.value)}
              placeholder="Tìm kiếm theo tiêu đề..."
              className="px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ 
                backgroundColor: 'var(--card-bg)', 
                borderColor: 'var(--border-color)', 
                color: 'var(--text-primary)',
                '--placeholder-color': 'var(--text-secondary)'
              }}
            />
            <Link 
              to="/submissions" 
              className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 text-white font-medium transition-colors"
            >
              Lịch sử nộp bài
            </Link>
            <Link 
              to="/quizzes/new" 
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
            >
              + Tạo mới
            </Link>
          </div>
        </div>
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-lg" style={{ color: 'var(--text-secondary)' }}>
              {titleFilter ? "Không tìm thấy bài kiểm tra phù hợp." : "Chưa có bài kiểm tra nào."}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((q) => (
              <QuizCard key={q._id} quiz={q} onShare={handleShareQuiz} />
            ))}
          </div>
        )}

        {/* Quiz Sharing Modal */}
        {selectedQuiz && (
          <QuizSharingModal
            quiz={selectedQuiz}
            isOpen={showSharingModal}
            onClose={handleCloseSharingModal}
            onUpdate={() => {
              // Could refresh quiz list if needed
            }}
          />
        )}
      </div>
    </div>
  );
}
