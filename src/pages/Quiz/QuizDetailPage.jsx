import { useEffect, useMemo, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { api, utils } from "../../utils/api";
import { useAuth } from "../../contexts/AuthContext";
import FlashcardView from "../../components/FlashcardView";
import TestView from "../../components/TestView";
import QuizSharingModal from "../../components/QuizSharingModal";
import QuestionList from "../../components/QuestionList";

export default function QuizDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Practice state
  const [mode, setMode] = useState("flashcard"); // flashcard | test | manage
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState({}); // questionIndex -> choiceIndex
  const [showAnswer, setShowAnswer] = useState(false);

  // Quiz sharing state
  const [showSharingModal, setShowSharingModal] = useState(false);

  // Check if user is admin
  const isAdmin = user?.role === 'admin';

  const loadQuiz = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const found = await api.getQuizById(id);
      setQuiz(found);
    } catch (err) {
      setError(err?.message || "Lỗi không xác định");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadQuiz();
  }, [loadQuiz]);

  const questions = useMemo(() => quiz?.questions || [], [quiz]);

  const shuffledChoicesByQ = useMemo(() => {
    return questions.map((q) => utils.shuffle(q.choices || []));
  }, [questions]);

  const correctMap = useMemo(() => {
    // Build a map from choice text to correctness per question for quick lookup
    return questions.map((q) => {
      const map = new Map();
      (q.choices || []).forEach((c) => map.set(c.text, !!c.isCorrect));
      return map;
    });
  }, [questions]);

  function handleSelect(questionIndex, choiceIndex) {
    setSelected((prev) => ({ ...prev, [questionIndex]: choiceIndex }));
  }

  const numCorrect = useMemo(() => {
    let score = 0;
    shuffledChoicesByQ.forEach((choices, idx) => {
      const sel = selected[idx];
      if (sel == null) return;
      const choice = choices[sel];
      if (!choice) return;
      if (correctMap[idx]?.get(choice.text)) score += 1;
    });
    return score;
  }, [selected, shuffledChoicesByQ, correctMap]);

  const total = questions.length;

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

  const title = quiz?.title || quiz?.model || "Quiz";

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{title}</h1>
            <div className="text-sm mt-1 space-y-1" style={{ color: 'var(--text-secondary)' }}>
              <div>{total} câu hỏi • Tạo bởi {typeof quiz?.createdBy === 'object' ? quiz?.createdBy?.email || quiz?.createdBy?.name || "Unknown" : quiz?.createdBy || "Unknown"}</div>
              <div className="flex items-center gap-4 text-xs">
                {quiz?.englishLevel && (
                  <span className="px-2 py-1 rounded-full" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
                    Trình độ: {quiz.englishLevel}
                  </span>
                )}
                {quiz?.questionType && (
                  <span className="px-2 py-1 rounded-full" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
                    Loại: {quiz.questionType === 'mixed' ? 'Hỗn hợp' : 
                      quiz.questionType === 'vocabulary' ? 'Từ vựng' :
                      quiz.questionType === 'grammar' ? 'Ngữ pháp' :
                      quiz.questionType === 'reading' ? 'Đọc hiểu' :
                      quiz.questionType === 'conversation' ? 'Hội thoại' : quiz.questionType}
                  </span>
                )}
                {quiz?.model && (
                  <span className="px-2 py-1 rounded-full" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
                    Model: {quiz.model}
                  </span>
                )}
                {quiz?.displayLanguage && (
                  <span className="px-2 py-1 rounded-full" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
                    Ngôn ngữ: {quiz.displayLanguage === 'vietnamese' ? 'Tiếng Việt' : 
                      quiz.displayLanguage === 'english' ? 'English' : 'Hỗn hợp'}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link 
              to={`/quizzes/${id}/submit`} 
              className="px-6 py-3 rounded-lg bg-green-500 hover:bg-green-600 text-white font-medium transition-colors"
            >
              Làm bài kiểm tra
            </Link>
            <Link 
              to={`/quizzes/${id}/stats`} 
              className="px-6 py-3 rounded-lg bg-purple-500 hover:bg-purple-600 text-white font-medium transition-colors"
            >
              Thống kê
            </Link>
            {isAdmin && (
              <button
                onClick={() => setShowSharingModal(true)}
                className="px-6 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
                Chia sẻ
              </button>
            )}
            <Link 
              to="/quizzes" 
              className="px-4 py-2 rounded-lg border transition-colors"
              style={{ 
                borderColor: 'var(--border-color)', 
                color: 'var(--text-primary)', 
                backgroundColor: 'var(--card-bg)' 
              }}
            >
              ← Quay lại
            </Link>
          </div>
        </div>

        {/* Mode Toggle */}
        <div className="mb-8 flex justify-center">
          <div className="inline-flex rounded-xl border p-1" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--card-bg)' }}>
            <button
              onClick={() => setMode("flashcard")}
              className={`px-6 py-3 rounded-lg text-sm font-medium transition-all ${
                mode === "flashcard" 
                  ? "bg-blue-500 text-white shadow-sm" 
                  : ""
              }`}
              style={mode !== "flashcard" ? { color: 'var(--text-secondary)' } : {}}
            >
              Flashcards
            </button>
            <button
              onClick={() => setMode("test")}
              className={`px-6 py-3 rounded-lg text-sm font-medium transition-all ${
                mode === "test" 
                  ? "bg-blue-500 text-white shadow-sm" 
                  : ""
              }`}
              style={mode !== "test" ? { color: 'var(--text-secondary)' } : {}}
            >
              Kiểm tra
            </button>
            {isAdmin && (
              <button
                onClick={() => setMode("manage")}
                className={`px-6 py-3 rounded-lg text-sm font-medium transition-all ${
                  mode === "manage" 
                    ? "bg-blue-500 text-white shadow-sm" 
                    : ""
                }`}
                style={mode !== "manage" ? { color: 'var(--text-secondary)' } : {}}
              >
                Quản lý câu hỏi
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          {mode === "flashcard" ? (
            <FlashcardView
              questions={questions}
              current={current}
              setCurrent={setCurrent}
              showAnswer={showAnswer}
              setShowAnswer={setShowAnswer}
            />
          ) : mode === "test" ? (
            <TestView
              questions={questions}
              shuffledChoicesByQ={shuffledChoicesByQ}
              selected={selected}
              onSelect={handleSelect}
              score={numCorrect}
              total={total}
            />
          ) : mode === "manage" && isAdmin ? (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                  Quản lý câu hỏi
                </h2>
                <p style={{ color: 'var(--text-secondary)' }}>
                  Chỉnh sửa và xóa các câu hỏi trong quiz này
                </p>
              </div>
              <QuestionList
                questions={questions}
                quizId={id}
                onQuestionsUpdate={loadQuiz}
              />
            </div>
          ) : null}
        </div>

        {/* Quiz Sharing Modal */}
        {quiz && (
          <QuizSharingModal
            quiz={quiz}
            isOpen={showSharingModal}
            onClose={() => setShowSharingModal(false)}
            onUpdate={() => {
              // Refresh quiz data if needed
              // Could add a refresh function here
            }}
          />
        )}
      </div>
    </div>
  );
}
