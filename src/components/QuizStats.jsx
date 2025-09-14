import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api, utils } from "../utils/api";

export default function QuizStats() {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [stats, setStats] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, [id]);

  async function loadData() {
    setLoading(true);
    setError("");
    try {
      // Load quiz info
      const foundQuiz = await api.getQuizById(id);
      setQuiz(foundQuiz);

      // Load stats
      try {
        const statsData = await api.getQuizStats(id);
        setStats(statsData);
      } catch (err) {
        console.warn("Không tải được stats:", err.message);
      }

      // Load recent submissions
      try {
        const submissionsData = await api.getQuizSubmissions({ quizId: id, limit: 10 });
        setSubmissions(submissionsData);
      } catch (err) {
        console.warn("Không tải được submissions:", err.message);
      }
    } catch (err) {
      setError(err?.message || "Lỗi không xác định");
    } finally {
      setLoading(false);
    }
  }

  function formatDate(dateString) {
    return utils.formatDate(dateString);
  }

  function formatTime(seconds) {
    return utils.formatTime(seconds);
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center" style={{ color: 'var(--text-secondary)' }}>Đang tải...</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="px-4 py-3 rounded-lg shadow" style={{ backgroundColor: '#fef2f2', color: '#dc2626' }}>{error}</div>
      </div>
    );
  }

  const questions = quiz?.questions || [];
  const totalSubmissions = stats?.totalSubmissions || submissions.length;
  const averageScore = stats?.averageScore || 0;
  const averageTime = stats?.averageTime || 0;

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
              Thống kê: {quiz?.title || quiz?.model || "Quiz"}
            </h1>
            <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {questions.length} câu hỏi • {totalSubmissions} lượt nộp bài
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to={`/quizzes/${id}/submit`} className="px-4 py-2 rounded-md bg-blue-600 text-white">
              Làm bài
            </Link>
            <Link to={`/quizzes/${id}`} className="text-blue-600 hover:underline">
              ← Xem quiz
            </Link>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="border rounded-xl shadow-sm p-6" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
            <div className="text-2xl font-bold text-blue-600">{totalSubmissions}</div>
            <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Tổng lượt nộp bài</div>
          </div>
          <div className="border rounded-xl shadow-sm p-6" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
            <div className="text-2xl font-bold text-green-600">
              {averageScore.toFixed(1)}/{questions.length}
            </div>
            <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Điểm trung bình</div>
          </div>
          <div className="border rounded-xl shadow-sm p-6" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
            <div className="text-2xl font-bold text-purple-600">
              {formatTime(averageTime)}
            </div>
            <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Thời gian trung bình</div>
          </div>
        </div>

        {/* Question Statistics */}
        {questions.length > 0 && (
          <div className="border rounded-xl shadow-sm mb-8" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
            <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
              <h2 className="text-lg font-medium" style={{ color: 'var(--text-primary)' }}>Thống kê từng câu hỏi</h2>
            </div>
            <div className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
              {questions.map((q, idx) => {
                const correctChoice = q.choices?.find(c => c.isCorrect);
                return (
                  <div key={idx} className="p-6">
                    <div className="mb-3">
                      <div className="font-medium whitespace-pre-line" style={{ color: 'var(--text-primary)' }}>
                        Câu {idx + 1}: {q.prompt}
                      </div>
                      <div className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                        Đáp án đúng: {correctChoice?.text || "Chưa có"}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.choices?.map((c, cIdx) => (
                        <div key={cIdx} className={`px-3 py-2 rounded text-sm ${
                          c.isCorrect ? "bg-green-50 text-green-700" : ""
                        }`} style={!c.isCorrect ? { backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)' } : {}}>
                          {cIdx + 1}. {c.text}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Recent Submissions */}
        <div className="border rounded-xl shadow-sm" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
          <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
            <h2 className="text-lg font-medium" style={{ color: 'var(--text-primary)' }}>Bài nộp gần đây</h2>
          </div>
          {submissions.length === 0 ? (
            <div className="p-8 text-center" style={{ color: 'var(--text-secondary)' }}>
              Chưa có bài nộp nào.
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
              {submissions.map((submission) => (
                <div key={submission._id} className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium" style={{ color: 'var(--text-primary)' }}>
                      {submission.userEmail}
                    </div>
                    <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {formatDate(submission.createdAt)}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      Điểm: {submission.score || 0}/{submission.totalQuestions || questions.length} • 
                      Thời gian: {formatTime(submission.timeSpent)}
                    </div>
                    <Link
                      to={`/submissions/${submission._id}`}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Xem chi tiết →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
