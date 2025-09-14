import React, { useState } from 'react';
import { api } from '../utils/api';

const CreateReviewSchedule = ({ quizId, onSuccess, onCancel }) => {
  const [reviewInterval, setReviewInterval] = useState(3);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState(null);

  const intervalOptions = [
    { value: 1, label: '1 ngày' },
    { value: 3, label: '3 ngày' },
    { value: 5, label: '5 ngày' },
    { value: 7, label: '1 tuần' },
    { value: 15, label: '2 tuần' },
    { value: 30, label: '1 tháng' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsCreating(true);
    setError(null);

    try {
      await api.createReviewSchedule({ 
        quizId, 
        reviewInterval 
      });
      onSuccess?.();
    } catch (err) {
      console.error('Error creating review schedule:', err);
      setError(err.message);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Tạo lịch ôn tập
        </h3>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Khoảng cách ôn tập
            </label>
            <select
              value={reviewInterval}
              onChange={(e) => setReviewInterval(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              {intervalOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Quiz sẽ được nhắc nhở ôn tập sau mỗi {reviewInterval} ngày
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-md">
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isCreating}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
            >
              {isCreating ? 'Đang tạo...' : 'Tạo lịch ôn tập'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateReviewSchedule;
