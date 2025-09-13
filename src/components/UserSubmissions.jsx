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
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div style={{ color: 'var(--text-secondary)' }}>Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>Lịch sử nộp bài</h1>
          <Link to="/quizzes" className="text-blue-600 hover:underline">← Danh sách quiz</Link>
        </div>

        <div 
          className="border rounded-xl shadow-sm p-6 mb-6"
          style={{ 
            backgroundColor: 'var(--card-bg)', 
            borderColor: 'var(--border-color)' 
          }}
        >
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>Email người dùng</label>
              <input
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ 
                  backgroundColor: 'var(--bg-primary)', 
                  borderColor: 'var(--border-color)', 
                  color: 'var(--text-primary)' 
                }}
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
          <div className="px-4 py-3 rounded-md mb-6" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'rgb(239, 68, 68)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>{error}</div>
        )}

        {submissions.length === 0 ? (
          <div 
            className="border rounded-xl shadow-sm p-8 text-center"
            style={{ 
              backgroundColor: 'var(--card-bg)', 
              borderColor: 'var(--border-color)' 
            }}
          >
            <div style={{ color: 'var(--text-secondary)' }}>Không có bài nộp nào.</div>
          </div>
        ) : (
          <div className="space-y-4">
            {submissions.map((submission) => (
              <div 
                key={submission._id} 
                className="border rounded-xl shadow-sm p-6"
                style={{ 
                  backgroundColor: 'var(--card-bg)', 
                  borderColor: 'var(--border-color)' 
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-medium" style={{ color: 'var(--text-primary)' }}>
                      {submission.quiz?.title || "Quiz"}
                    </h3>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      Email: {submission.userEmail}
                    </p>
                  </div>
                  <div className="text-right text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <div>{formatDate(submission.submittedAt || submission.createdAt)}</div>
                    <div>Thời gian: {formatTime(submission.timeSpent)}</div>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Kết quả:</h4>
                  <div className="flex items-center gap-4">
                    <div className="text-sm">
                      <span className="font-medium text-green-600">{submission.correctAnswers || 0}</span>/
                      <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{submission.totalQuestions || 0}</span> câu đúng
                    </div>
                    <div className="text-sm">
                      Điểm: <span className="font-medium text-blue-600">{submission.scorePercentage || 0}%</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
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
            style={{ 
              borderColor: 'var(--border-color)', 
              backgroundColor: 'var(--card-bg)', 
              color: 'var(--text-secondary)' 
            }}
          >
            Trước
          </button>
          <span className="px-3 py-2 text-sm" style={{ color: 'var(--text-secondary)' }}>Trang {page}</span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={submissions.length < limit}
            className="px-3 py-2 rounded-md border disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ 
              borderColor: 'var(--border-color)', 
              backgroundColor: 'var(--card-bg)', 
              color: 'var(--text-secondary)' 
            }}
          >
            Sau
          </button>
        </div>
      </div>
    </div>
  );
}
