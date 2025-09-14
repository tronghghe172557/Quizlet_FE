import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api, utils } from "../../utils/api";
import { useAuth } from "../../contexts/AuthContext";
import QuizForm from "../../components/QuizForm";

export default function QuizCreatePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
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
    if (!user?.email) {
      setError("Vui lòng đăng nhập để tạo quiz");
      return;
    }
    try {
      setLoading(true);
      await api.createQuiz({ title: nextTitle, text, createdBy: user.email });
      navigate("/quizzes");
    } catch (err) {
      setError(err?.message || "Lỗi không xác định");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Tạo bài kiểm tra
          </h1>
          <Link 
            to="/quizzes" 
            className="px-4 py-2 rounded-lg border transition-colors"
            style={{ 
              borderColor: 'var(--border-color)', 
              color: 'var(--text-secondary)',
              backgroundColor: 'var(--card-bg)'
            }}
          >
            ← Danh sách
          </Link>
        </div>

        <QuizForm
          title={title}
          setTitle={setTitle}
          text={text}
          setText={setText}
          loading={loading}
          error={error}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
