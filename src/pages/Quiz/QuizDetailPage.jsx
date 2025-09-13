import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api, utils } from "../../utils/api";
import FlashcardView from "../../components/FlashcardView";
import TestView from "../../components/TestView";

export default function QuizDetailPage() {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Practice state
  const [mode, setMode] = useState("flashcard"); // flashcard | test
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState({}); // questionIndex -> choiceIndex
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const found = await api.getQuizById(id);
        if (isMounted) setQuiz(found);
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
  }, [id]);

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
            <div className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              {total} thuật ngữ • Tạo bởi {quiz?.createdBy || "Unknown"}
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
            <Link 
              to="/quizzes" 
              className="px-4 py-2 rounded-lg border transition-colors"
              style={{ 
                borderColor: 'var(--border-color)', 
                color: 'var(--text-secondary)',
                backgroundColor: 'var(--card-bg)'
              }}
            >
              ← Quay lại
            </Link>
          </div>
        </div>

        {/* Mode Toggle */}
        <div className="mb-8 flex justify-center">
          <div 
            className="inline-flex rounded-xl border p-1"
            style={{ 
              borderColor: 'var(--border-color)', 
              backgroundColor: 'var(--card-bg)' 
            }}
          >
            <button
              onClick={() => setMode("flashcard")}
              className={`px-6 py-3 rounded-lg text-sm font-medium transition-all ${
                mode === "flashcard" 
                  ? "bg-blue-500 text-white shadow-sm" 
                  : ""
              }`}
              style={{ 
                color: mode === "flashcard" ? "white" : "var(--text-secondary)" 
              }}
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
              style={{ 
                color: mode === "test" ? "white" : "var(--text-secondary)" 
              }}
            >
              Kiểm tra
            </button>
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
          ) : (
            <TestView
              questions={questions}
              shuffledChoicesByQ={shuffledChoicesByQ}
              selected={selected}
              onSelect={handleSelect}
              score={numCorrect}
              total={total}
            />
          )}
        </div>
      </div>
    </div>
  );
}
