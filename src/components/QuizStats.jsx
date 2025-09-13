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
    return <div className="min-h-screen flex items-center justify-center text-gray-600">Đang tải...</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg shadow">{error}</div>
      </div>
    );
  }

  const questions = quiz?.questions || [];
  const totalSubmissions = stats?.totalSubmissions || submissions.length;
  const averageScore = stats?.averageScore || 0;
  const averageTime = stats?.averageTime || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Thống kê: {quiz?.title || quiz?.model || "Quiz"}
            </h1>
            <div className="text-sm text-gray-500">
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
          <div className="bg-white border rounded-xl shadow-sm p-6">
            <div className="text-2xl font-bold text-blue-600">{totalSubmissions}</div>
            <div className="text-sm text-gray-500">Tổng lượt nộp bài</div>
          </div>
          <div className="bg-white border rounded-xl shadow-sm p-6">
            <div className="text-2xl font-bold text-green-600">
              {averageScore.toFixed(1)}/{questions.length}
            </div>
            <div className="text-sm text-gray-500">Điểm trung bình</div>
          </div>
          <div className="bg-white border rounded-xl shadow-sm p-6">
            <div className="text-2xl font-bold text-purple-600">
              {formatTime(averageTime)}
            </div>
            <div className="text-sm text-gray-500">Thời gian trung bình</div>
          </div>
        </div>

        {/* Question Statistics */}
        {questions.length > 0 && (
          <div className="bg-white border rounded-xl shadow-sm mb-8">
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-medium text-gray-900">Thống kê từng câu hỏi</h2>
            </div>
            <div className="divide-y">
              {questions.map((q, idx) => {
                const correctChoice = q.choices?.find(c => c.isCorrect);
                return (
                  <div key={idx} className="p-6">
                    <div className="mb-3">
                      <div className="font-medium text-gray-900 whitespace-pre-line">
                        Câu {idx + 1}: {q.prompt}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        Đáp án đúng: {correctChoice?.text || "Chưa có"}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.choices?.map((c, cIdx) => (
                        <div key={cIdx} className={`px-3 py-2 rounded text-sm ${
                          c.isCorrect ? "bg-green-50 text-green-700" : "bg-gray-50 text-gray-600"
                        }`}>
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
        <div className="bg-white border rounded-xl shadow-sm">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-medium text-gray-900">Bài nộp gần đây</h2>
          </div>
          {submissions.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              Chưa có bài nộp nào.
            </div>
          ) : (
            <div className="divide-y">
              {submissions.map((submission) => (
                <div key={submission._id} className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium text-gray-900">
                      {submission.userEmail}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatDate(submission.createdAt)}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
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
