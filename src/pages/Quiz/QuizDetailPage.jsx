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
    return <div className="min-h-screen flex items-center justify-center text-gray-600">Đang tải...</div>;
  }
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg shadow">{error}</div>
      </div>
    );
  }

  const title = quiz?.title || quiz?.model || "Quiz";

  return (
    <div className="bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
            <div className="text-sm text-gray-500">{total} câu hỏi</div>
          </div>
          <div className="flex items-center gap-3">
            <Link to={`/quizzes/${id}/submit`} className="px-4 py-2 rounded-md bg-green-600 text-white">
              Làm bài
            </Link>
            <Link to={`/quizzes/${id}/stats`} className="px-4 py-2 rounded-md bg-purple-600 text-white">
              Thống kê
            </Link>
            <Link to="/quizzes" className="text-blue-600 hover:underline">← Danh sách</Link>
          </div>
        </div>

        <div className="mb-6 inline-flex rounded-lg border p-1 bg-white">
          <button
            onClick={() => setMode("flashcard")}
            className={`px-4 py-2 rounded-md text-sm ${mode === "flashcard" ? "bg-blue-600 text-white" : "text-gray-700"}`}
          >Flashcards</button>
          <button
            onClick={() => setMode("test")}
            className={`px-4 py-2 rounded-md text-sm ${mode === "test" ? "bg-blue-600 text-white" : "text-gray-700"}`}
          >Kiểm tra</button>
        </div>

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
  );
}
