import React from 'react';
import { utils } from '../utils/api';

const ReviewScheduleCard = ({ schedule }) => {
  const getDifficultyColor = (level) => {
    switch (level) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (needsReview) => {
    return needsReview ? 'text-orange-600 bg-orange-100' : 'text-green-600 bg-green-100';
  };

  return (
    <div className="rounded-lg shadow-md p-6 border" style={{ 
      backgroundColor: 'var(--card-bg)',
      borderColor: 'var(--border-color)'
    }}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
            {schedule.quiz?.title || 'Quiz không xác định'}
          </h3>
          <div className="flex flex-wrap gap-2 mb-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(schedule.difficultyLevel)}`}>
              {schedule.difficultyLevel || 'medium'}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(schedule.needsReview)}`}>
              {schedule.needsReview ? 'Cần ôn tập' : 'Đã ôn tập'}
            </span>
            <span className="px-2 py-1 rounded-full text-xs font-medium text-blue-600 bg-blue-100">
              {schedule.reviewInterval} ngày
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => window.location.href = `/quizzes/${schedule.quiz?._id}`}
            className="px-3 py-1 rounded text-xs font-medium bg-green-100 text-green-700 hover:bg-green-200"
          >
            Học tập
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Lần ôn tập</p>
          <p className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            {schedule.reviewCount || 0}
          </p>
        </div>
        <div>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Điểm trung bình</p>
          <p className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            {schedule.averageScore || 0}%
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <div>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Lần ôn tập cuối</p>
          <p className="text-sm" style={{ color: 'var(--text-primary)' }}>
            {schedule.lastReviewedAt ? utils.formatDate(schedule.lastReviewedAt) : 'Chưa có'}
          </p>
        </div>
        <div>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Lần ôn tập tiếp theo</p>
          <p className="text-sm" style={{ color: 'var(--text-primary)' }}>
            {schedule.nextReviewAt ? utils.formatDate(schedule.nextReviewAt) : 'Chưa có'}
          </p>
        </div>
      </div>

      {schedule.needsReview && (
        <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--border-color)' }}>
          <button
            onClick={() => window.location.href = `/quiz/${schedule.quiz?._id}`}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Bắt đầu ôn tập
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewScheduleCard;
