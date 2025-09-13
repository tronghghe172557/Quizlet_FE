import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api, utils } from "../utils/api";

export default function SubmissionDetail() {
  const { id } = useParams();
  const [submission, setSubmission] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, [id]);

  async function loadData() {
    setLoading(true);
    setError("");
    try {
      // Load submission details
      const submissionData = await api.getSubmissionById(id);
      setSubmission(submissionData);

      // Quiz data is already included in submission response
      if (submissionData.quiz) {
        setQuiz(submissionData.quiz);
      } else {
        // Fallback: try to load quiz separately if not included
        try {
          const quizData = await api.getQuizById(submissionData.quizId);
          setQuiz(quizData);
        } catch (err) {
          console.warn("Could not load quiz separately:", err.message);
        }
      }
    } catch (err) {
      setError(err?.message || "Lỗi không xác định");
    } finally {
      setLoading(false);
    }
  }

  function calculateScore() {
    if (!submission) return { correct: 0, total: 0 };
    
    // Use data from API response if available
    if (submission.correctAnswers !== undefined && submission.totalQuestions !== undefined) {
      return { 
        correct: submission.correctAnswers, 
        total: submission.totalQuestions 
      };
    }
    
    // Fallback: calculate from quiz questions
    if (!quiz) return { correct: 0, total: 0 };
    
    const questions = quiz.questions || [];
    let correct = 0;
    
    submission.answers?.forEach((answer) => {
      const question = questions[answer.questionIndex];
      if (question) {
        const correctChoice = question.choices?.find(c => c.isCorrect);
        const selectedChoice = question.choices?.[answer.selectedChoiceIndex];
        if (correctChoice && selectedChoice && correctChoice.text === selectedChoice.text) {
          correct++;
        }
      }
    });
    
    return { correct, total: questions.length };
  }

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

  const { correct, total } = calculateScore();
  const percentage = submission?.scorePercentage || (total > 0 ? Math.round((correct / total) * 100) : 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Chi tiết bài nộp</h1>
            <div className="text-sm text-gray-500">
              Quiz: {submission?.title || quiz?.title || quiz?.model || "Unknown"} • 
              Email: {submission?.userEmail} • 
              {utils.formatDate(submission?.submittedAt || submission?.createdAt)}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to={`/quizzes/${submission?.quiz?._id || submission?.quizId}`} className="px-4 py-2 rounded-md bg-blue-600 text-white">
              Xem quiz
            </Link>
            <Link to="/submissions" className="text-blue-600 hover:underline">← Lịch sử</Link>
          </div>
        </div>

        {/* Score Summary */}
        <div className="bg-white border rounded-xl shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{correct}/{total}</div>
              <div className="text-sm text-gray-500">Câu đúng</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{percentage}%</div>
              <div className="text-sm text-gray-500">Điểm số</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {utils.formatTime(submission?.timeSpent || 0)}
              </div>
              <div className="text-sm text-gray-500">Thời gian</div>
            </div>
          </div>
        </div>

        {/* Answer Details */}
        <div className="bg-white border rounded-xl shadow-sm">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-medium text-gray-900">Chi tiết đáp án</h2>
          </div>
          <div className="divide-y">
            {quiz?.questions?.map((question, idx) => {
              const answer = submission?.answers?.find(a => a.questionIndex === idx);
              const selectedChoice = question.choices?.[answer?.selectedChoiceIndex];
              const correctChoice = question.choices?.find(c => c.isCorrect);
              const isCorrect = selectedChoice && correctChoice && selectedChoice.text === correctChoice.text;
              
              return (
                <div key={idx} className="p-6">
                  <div className="mb-4">
                    <div className="flex items-start gap-3">
                      <span className="text-sm font-medium text-gray-500">Câu {idx + 1}:</span>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 mb-2 whitespace-pre-line">{question.prompt}</div>
                        <div className="text-sm text-gray-500 mb-3">
                          Đáp án đúng: <span className="font-medium text-green-600">{correctChoice?.text}</span>
                        </div>
                        <div className="text-sm text-gray-500">
                          Bạn chọn: <span className={`font-medium ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                            {selectedChoice?.text || "Không trả lời"}
                          </span>
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded text-xs font-medium ${
                        isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {isCorrect ? 'Đúng' : 'Sai'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {question.choices?.map((choice, cIdx) => {
                      const isSelected = answer?.selectedChoiceIndex === cIdx;
                      const isCorrectChoice = choice.isCorrect;
                      
                      return (
                        <div key={cIdx} className={`px-3 py-2 rounded text-sm ${
                          isCorrectChoice 
                            ? "bg-green-50 text-green-700 border border-green-200" 
                            : isSelected 
                              ? "bg-red-50 text-red-700 border border-red-200"
                              : "bg-gray-50 text-gray-600"
                        }`}>
                          {cIdx + 1}. {choice.text}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
