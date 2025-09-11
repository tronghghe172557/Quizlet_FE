import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const API_URL = "http://35.240.251.182:3000/api/quizzes";

function deriveTitleFromText(text) {
  if (!text) return "";
  const firstNonEmptyLine =
    text
      .split(/\r?\n/)
      .map((s) => s.trim())
      .find((s) => s.length > 0) || "";
  // Cắt gọn vừa phải
  return firstNonEmptyLine.slice(0, 80);
}

export default function QuizCreate() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [createdBy, setCreatedBy] = useState("you@example.com");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    // Tự sinh title nếu chưa nhập
    let nextTitle = title.trim();
    if (!nextTitle) {
      nextTitle = deriveTitleFromText(text).trim();
      if (nextTitle) setTitle(nextTitle);
    }

    if (!nextTitle) {
      setError("Vui lòng nhập tiêu đề (title)");
      return;
    }
    if (!text.trim()) {
      setError("Vui lòng nhập nội dung text");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: nextTitle, text, createdBy }),
      });
      if (!res.ok) {
        let serverMsg = "";
        try {
          const data = await res.json();
          serverMsg = data?.message || "";
        } catch (error) {
          console.error(error);
          serverMsg = await res.text();
        }
        throw new Error(serverMsg || `Tạo quiz thất bại (HTTP ${res.status})`);
      }
      navigate("/quizzes");
    } catch (err) {
      setError(err?.message || "Lỗi không xác định");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            Tạo bài kiểm tra
          </h1>
          <Link to="/quizzes" className="text-blue-600 hover:underline">
            ← Danh sách
          </Link>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white border rounded-xl shadow-sm p-6 space-y-5"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tiêu đề (Title)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ví dụ: Từ vựng Unit 1"
            />
            <p className="mt-1 text-xs text-gray-500">
              Nếu để trống, hệ thống sẽ lấy dòng đầu của Text làm title.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email người tạo
            </label>
            <input
              type="email"
              value={createdBy}
              onChange={(e) => setCreatedBy(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Text
            </label>
            <textarea
              value={text}
              onChange={(e) => {
                const val = e.target.value;
                setText(val);
                // Gợi ý title theo text nếu title đang rỗng
                if (!title.trim()) {
                  const suggestion = deriveTitleFromText(val);
                  if (suggestion) setTitle(suggestion);
                }
              }}
              rows={16}
              className="w-full rounded-md border border-gray-300 px-3 py-2 font-mono text-sm leading-5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={"Nhập block text theo mẫu..."}
            />
            <p className="mt-2 text-xs text-gray-500">
              Body POST sẽ là &#123; title, text, createdBy &#125;.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 px-4 py-2 rounded-md">
              {error}
            </div>
          )}

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-md bg-blue-600 text-white disabled:opacity-60"
            >
              {loading ? "Đang tạo..." : "Tạo quiz"}
            </button>
            <button
              type="button"
              onClick={() => {
                setTitle("");
                setText("");
              }}
              className="px-4 py-2 rounded-md border"
            >
              Xóa
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
