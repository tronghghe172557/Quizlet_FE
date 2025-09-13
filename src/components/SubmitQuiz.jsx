import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { api, utils } from "../utils/api";

export default function SubmitQuiz() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  
  // Form state
  const [userEmail, setUserEmail] = useState("user@example.com");
  const [answers, setAnswers] = useState({}); // questionIndex -> selectedChoiceIndex
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime] = useState(Date.now());

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

  // Update time spent every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  function handleAnswerSelect(questionIndex, choiceIndex) {
    setAnswers(prev => ({ ...prev, [questionIndex]: choiceIndex }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!userEmail.trim()) {
      setError("Vui lòng nhập email");
      return;
    }
    
    const answerArray = Object.entries(answers).map(([qIdx, cIdx]) => ({
      questionIndex: parseInt(qIdx),
      selectedChoiceIndex: parseInt(cIdx)
    }));

    try {
      setSubmitting(true);
      setError("");
      const result = await api.submitQuiz({
        quizId: id,
        userEmail: userEmail.trim(),
        answers: answerArray,
        timeSpent
      });
      
      // Handle different response structures
      const submissionId = result._id || result.id || result.submissionId;
      if (submissionId) {
        navigate(`/submissions/${submissionId}`);
      } else {
        console.error("No submission ID in response:", result);
        navigate("/submissions");
      }
    } catch (err) {
      setError(err?.message || "Lỗi không xác định");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div style={{ color: 'var(--text-secondary)' }}>Đang tải...</div>
      </div>
    );
  }
  if (error && !quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="px-4 py-3 rounded-lg shadow" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'rgb(239, 68, 68)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>{error}</div>
      </div>
    );
  }

  const questions = quiz?.questions || [];
  const answeredCount = Object.keys(answers).length;
  const isComplete = answeredCount === questions.length;

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{quiz?.title || quiz?.model || "Quiz"}</h1>
            <div className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              {answeredCount}/{questions.length} câu đã trả lời • Thời gian: {utils.formatTime(timeSpent)}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link 
              to={`/quizzes/${id}`} 
              className="px-4 py-2 rounded-lg border transition-colors"
              style={{ 
                borderColor: 'var(--border-color)', 
                color: 'var(--text-secondary)',
                backgroundColor: 'var(--card-bg)'
              }}
            >
              ← Xem lại
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div 
              className="border rounded-xl shadow-sm p-6"
              style={{ 
                backgroundColor: 'var(--card-bg)', 
                borderColor: 'var(--border-color)' 
              }}
            >
              <h2 className="text-lg font-medium mb-4" style={{ color: 'var(--text-primary)' }}>Thông tin nộp bài</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>Email</label>
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
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>Thời gian làm bài</label>
                  <input
                    type="text"
                    value={utils.formatTime(timeSpent)}
                    className="w-full rounded-md border px-3 py-2"
                    style={{ 
                      backgroundColor: 'var(--bg-secondary)', 
                      borderColor: 'var(--border-color)', 
                      color: 'var(--text-secondary)' 
                    }}
                    readOnly
                  />
                </div>
              </div>
            </div>

            <div 
              className="border rounded-2xl shadow-xl"
              style={{ 
                backgroundColor: 'var(--card-bg)', 
                borderColor: 'var(--border-color)' 
              }}
            >
              <div 
                className="px-8 py-6 border-b flex items-center justify-between"
                style={{ borderColor: 'var(--border-color)' }}
              >
                <div className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Kiểm tra</div>
                <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Tiến độ: <span className="font-semibold text-blue-600">{answeredCount}/{questions.length}</span>
                </div>
              </div>
              <div style={{ borderColor: 'var(--border-color)' }}>
                {questions.map((q, idx) => (
                  <div key={idx} className="p-8" style={{ borderBottom: idx < questions.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
                    <div className="mb-6 text-lg font-medium whitespace-pre-line" style={{ color: 'var(--text-primary)' }}>
                      {idx + 1}. {q.prompt}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {q.choices?.map((c, cIdx) => {
                        const isSelected = answers[idx] === cIdx;
                        return (
                          <button
                            key={cIdx}
                            type="button"
                            className={`px-6 py-4 rounded-xl border transition-all cursor-pointer text-left hover:shadow-md ${
                              isSelected 
                                ? "border-blue-600 bg-blue-50" 
                                : ""
                            }`}
                            style={{
                              backgroundColor: isSelected ? 'rgba(59, 130, 246, 0.1)' : 'var(--card-bg)',
                              borderColor: isSelected ? 'rgba(59, 130, 246, 0.3)' : 'var(--border-color)',
                              color: 'var(--text-primary)'
                            }}
                            onClick={() => handleAnswerSelect(idx, cIdx)}
                          >
                            {c.text}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {error && (
              <div className="px-4 py-3 rounded-md" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'rgb(239, 68, 68)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>{error}</div>
            )}

            <div className="flex items-center justify-between">
              <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {isComplete ? "✅ Đã hoàn thành tất cả câu hỏi" : `⚠️ Còn ${questions.length - answeredCount} câu chưa trả lời`}
              </div>
              <button
                type="submit"
                disabled={submitting || !isComplete}
                className="px-6 py-3 rounded-lg bg-green-500 hover:bg-green-600 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Đang nộp..." : "Nộp bài"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
