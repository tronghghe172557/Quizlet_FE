import React, { useState, useEffect, useRef } from 'react';
import { api } from '../utils/api';
import QuestionEditor from './QuestionEditor';

const QuestionList = ({ questions, quizId, onQuestionsUpdate }) => {
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeQuestion, setActiveQuestion] = useState(0);
  const questionRefs = useRef([]);

  const handleEditQuestion = (questionIndex) => {
    setEditingQuestion(questionIndex);
  };

  const handleDeleteQuestion = async (questionIndex) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa câu hỏi này?')) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.deleteQuestion(quizId, questionIndex);
      onQuestionsUpdate();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveQuestion = () => {
    setEditingQuestion(null);
    onQuestionsUpdate();
  };

  const handleCancelEdit = () => {
    setEditingQuestion(null);
  };

  const scrollToQuestion = (questionIndex) => {
    if (questionRefs.current[questionIndex]) {
      questionRefs.current[questionIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      setActiveQuestion(questionIndex);
    }
  };

  // Intersection Observer để theo dõi câu hỏi đang hiển thị
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const questionIndex = parseInt(entry.target.dataset.questionIndex);
            setActiveQuestion(questionIndex);
          }
        });
      },
      {
        threshold: 0.5,
        rootMargin: '-100px 0px -100px 0px'
      }
    );

    questionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [questions]);

  if (questions.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 dark:text-gray-500 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Chưa có câu hỏi nào
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Quiz này chưa có câu hỏi nào được tạo.
        </p>
      </div>
    );
  }

  return (
    <div className="flex gap-6">
      {/* Sidebar với danh sách câu hỏi */}
      <div className="w-64 flex-shrink-0">
        <div className="sticky top-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Danh sách câu hỏi ({questions.length})
            </h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {questions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => scrollToQuestion(index)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeQuestion === index
                      ? 'bg-blue-500 text-white shadow-sm'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>Câu {index + 1}</span>
                    {activeQuestion === index && (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Nội dung chính */}
      <div className="flex-1 space-y-4">
        {error && (
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {questions.map((question, index) => (
        <div 
          key={index} 
          ref={(el) => (questionRefs.current[index] = el)}
          data-question-index={index}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
        >
          <div className="p-6">
            {/* Question Header */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    Câu {index + 1}
                  </span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {question.prompt}
                </h3>
              </div>
              <div className="flex space-x-2 ml-4">
                <button
                  onClick={() => handleEditQuestion(index)}
                  disabled={loading}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Sửa
                </button>
                <button
                  onClick={() => handleDeleteQuestion(index)}
                  disabled={loading}
                  className="inline-flex items-center px-3 py-1.5 border border-red-300 dark:border-red-600 shadow-sm text-sm font-medium rounded-md text-red-700 dark:text-red-300 bg-white dark:bg-gray-700 hover:bg-red-50 dark:hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Xóa
                </button>
              </div>
            </div>

            {/* Choices */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Các lựa chọn:
              </h4>
              <div className="space-y-2">
                {question.choices.map((choice, choiceIndex) => (
                  <div
                    key={choiceIndex}
                    className={`flex items-center space-x-3 p-3 rounded-lg border ${
                      choice.isCorrect
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                        : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      choice.isCorrect
                        ? 'border-green-500 bg-green-500'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}>
                      {choice.isCorrect && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    <span className={`text-sm ${
                      choice.isCorrect
                        ? 'text-green-800 dark:text-green-200 font-medium'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}>
                      {choice.text}
                    </span>
                    {choice.isCorrect && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        Đúng
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Explanation */}
            {question.explanation && (
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
                  Giải thích:
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  {question.explanation}
                </p>
              </div>
            )}
          </div>
        </div>
        ))}

        {/* Question Editor Modal */}
        {editingQuestion !== null && (
          <QuestionEditor
            question={questions[editingQuestion]}
            questionIndex={editingQuestion}
            quizId={quizId}
            onSave={handleSaveQuestion}
            onCancel={handleCancelEdit}
          />
        )}
      </div>
    </div>
  );
};

export default QuestionList;
