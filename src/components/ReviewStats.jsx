import React from 'react';
import { utils } from '../utils/api';

const ReviewStats = ({ statistics }) => {
  if (!statistics?.metadata?.statistics) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Thống kê ôn tập
        </h3>
        <p className="text-gray-600 dark:text-gray-400">Chưa có dữ liệu thống kê</p>
      </div>
    );
  }

  const stats = statistics.metadata.statistics;
  const recentPerformance = statistics.metadata.recentPerformance || [];

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Tổng quan ôn tập
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{stats.totalSchedules}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Tổng lịch ôn tập</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{stats.activeSchedules}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Đang hoạt động</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">{stats.needsReview}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Cần ôn tập</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">{stats.averageScore}%</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Điểm trung bình</p>
          </div>
        </div>
      </div>

      {/* Recent Performance */}
      {recentPerformance.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Hiệu suất gần đây
          </h3>
          <div className="space-y-3">
            {recentPerformance.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {item.quiz?.title || 'Quiz không xác định'}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Ôn tập lần cuối: {utils.formatDate(item.lastReviewedAt)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {item.lastScore}%
                  </p>
                  <div className={`w-16 h-2 rounded-full ${
                    item.lastScore >= 80 ? 'bg-green-500' :
                    item.lastScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Progress Chart Placeholder */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Tiến trình ôn tập
        </h3>
        <div className="h-32 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">
            Biểu đồ tiến trình sẽ được thêm sau
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReviewStats;
