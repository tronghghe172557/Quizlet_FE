import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, utils } from "../utils/api";

export default function UserSubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userEmail, setUserEmail] = useState("user@example.com");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  useEffect(() => {
    loadSubmissions();
  }, [userEmail, page]);

  async function loadSubmissions() {
    if (!userEmail.trim()) return;
    
    setLoading(true);
    setError("");
    try {
      const items = await api.getUserSubmissions({ userEmail, page, limit });
      setSubmissions(items);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Lịch sử nộp bài</h1>
          <Link to="/quizzes" className="text-blue-600 hover:underline">← Danh sách quiz</Link>
        </div>

        <div className="bg-white border rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email người dùng</label>
              <input
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="user@example.com"
              />
            </div>
            <div className="pt-6">
              <button
                onClick={loadSubmissions}
                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
              >
                Tìm kiếm
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 px-4 py-3 rounded-md mb-6">{error}</div>
        )}

        {submissions.length === 0 ? (
          <div className="bg-white border rounded-xl shadow-sm p-8 text-center">
            <div className="text-gray-500">Không có bài nộp nào.</div>
          </div>
        ) : (
          <div className="space-y-4">
            {submissions.map((submission) => (
              <div key={submission._id} className="bg-white border rounded-xl shadow-sm p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {submission.quiz?.title || "Quiz"}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Email: {submission.userEmail}
                    </p>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    <div>{formatDate(submission.submittedAt || submission.createdAt)}</div>
                    <div>Thời gian: {formatTime(submission.timeSpent)}</div>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Kết quả:</h4>
                  <div className="flex items-center gap-4">
                    <div className="text-sm">
                      <span className="font-medium text-green-600">{submission.correctAnswers || 0}</span>/
                      <span className="font-medium">{submission.totalQuestions || 0}</span> câu đúng
                    </div>
                    <div className="text-sm">
                      Điểm: <span className="font-medium text-blue-600">{submission.scorePercentage || 0}%</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    ID: {submission._id}
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

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-3 py-2 rounded-md border disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Trước
          </button>
          <span className="px-3 py-2 text-sm text-gray-600">Trang {page}</span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={submissions.length < limit}
            className="px-3 py-2 rounded-md border disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Sau
          </button>
        </div>
      </div>
    </div>
  );
}
