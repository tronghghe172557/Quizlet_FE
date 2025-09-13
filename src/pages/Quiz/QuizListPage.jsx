import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../utils/api";
import QuizCard from "../../components/QuizCard";

export default function QuizListPage() {
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
    <div className="bg-gray-50">
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
            {filtered.map((q) => (
              <QuizCard key={q._id} quiz={q} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
