import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api, utils } from "../../utils/api";
import QuizForm from "../../components/QuizForm";

export default function QuizCreatePage() {
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
      nextTitle = utils.deriveTitleFromText(text).trim();
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
      await api.createQuiz({ title: nextTitle, text, createdBy });
      navigate("/quizzes");
    } catch (err) {
      setError(err?.message || "Lỗi không xác định");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            Tạo bài kiểm tra
          </h1>
          <Link to="/quizzes" className="text-blue-600 hover:underline">
            ← Danh sách
          </Link>
        </div>

        <QuizForm
          title={title}
          setTitle={setTitle}
          text={text}
          setText={setText}
          createdBy={createdBy}
          setCreatedBy={setCreatedBy}
          loading={loading}
          error={error}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
