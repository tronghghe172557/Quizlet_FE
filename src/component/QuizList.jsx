import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../utils/api";

export default function QuizList() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [titleFilter, setTitleFilter] = useState("");

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Bộ đề kiểm tra</h1>
          <div className="flex items-center gap-3">
            <input
              value={titleFilter}
              onChange={(e) => setTitleFilter(e.target.value)}
              placeholder="Title"
              className="px-3 py-2 rounded-md border border-gray-300 bg-white"
            />
            <Link to="/submissions" className="px-4 py-2 rounded-md bg-gray-600 text-white">
              Lịch sử nộp bài
            </Link>
            <Link to="/quizzes/new" className="px-4 py-2 rounded-md bg-blue-600 text-white">+ Tạo mới</Link>
          </div>
        </div>
        {filtered.length === 0 ? (
          <div className="text-gray-500">Không tìm thấy bài kiểm tra phù hợp.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((q) => {
              const title = q.title || q.model || "Quiz";
              const subtitle = q.sourceText?.slice(0, 120) || "";
              return (
                <Link key={q._id} to={`/quizzes/${q._id}`} className="group">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 h-full transition hover:shadow-md">
                    <div className="flex items-start justify-between mb-3">
                      <div className="text-base font-medium text-gray-900 group-hover:text-blue-600 transition">{title}</div>
                      <span className="text-xs text-gray-500">{q?.questions?.length || 0} câu</span>
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-3">{subtitle}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
