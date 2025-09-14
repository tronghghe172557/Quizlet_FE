import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';

const ReviewNotification = () => {
  const [dueQuizzes, setDueQuizzes] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkDueQuizzes();
  }, []);

  const checkDueQuizzes = async () => {
    setIsLoading(true);
    try {
      const quizzes = await api.getQuizzesDueForReview(5);
      setDueQuizzes(quizzes);
      setIsVisible(quizzes.length > 0);
    } catch (error) {
      console.error('Error checking due quizzes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  const handleStartReview = (quizId) => {
    window.location.href = `/quiz/${quizId}`;
  };

  if (!isVisible || isLoading) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-orange-200 dark:border-orange-700 p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center">
            <div className="text-orange-500 text-xl mr-2">📚</div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Quiz cần ôn tập
            </h3>
          </div>
          <button
            onClick={handleDismiss}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-2 mb-3">
          {dueQuizzes.slice(0, 3).map((schedule) => (
            <div key={schedule._id} className="flex items-center justify-between p-2 bg-orange-50 dark:bg-orange-900/20 rounded">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {schedule.quiz?.title || 'Quiz không xác định'}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Điểm TB: {schedule.averageScore || 0}%
                </p>
              </div>
              <button
                onClick={() => handleStartReview(schedule.quiz?._id)}
                className="ml-2 px-2 py-1 text-xs font-medium text-white bg-orange-600 hover:bg-orange-700 rounded transition-colors"
              >
                Ôn tập
              </button>
            </div>
          ))}
        </div>

        {dueQuizzes.length > 3 && (
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
            Và {dueQuizzes.length - 3} quiz khác...
          </p>
        )}

        <div className="flex justify-between items-center">
          <button
            onClick={() => window.location.href = '/review-schedule'}
            className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
          >
            Xem tất cả
          </button>
          <button
            onClick={handleDismiss}
            className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            Nhắc lại sau
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewNotification;
