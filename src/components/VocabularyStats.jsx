import React from 'react';

const VocabularyStats = ({ statistics }) => {
  if (!statistics?.metadata?.statistics) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Thống kê từ vựng
        </h3>
        <p className="text-gray-600 dark:text-gray-400">Chưa có dữ liệu thống kê</p>
      </div>
    );
  }

  const stats = statistics.metadata.statistics;
  const recentActivity = statistics.metadata.recentActivity || [];

  const getStreakColor = (streak) => {
    if (streak >= 7) return 'text-orange-600';
    if (streak >= 3) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'text-green-600';
    if (progress >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Tổng quan học từ vựng
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{stats.totalDays}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Tổng ngày học</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{stats.totalLearnedWords}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Từ đã học</p>
          </div>
          <div className="text-center">
            <p className={`text-2xl font-bold ${getStreakColor(stats.currentStreak)}`}>
              {stats.currentStreak}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Ngày liên tiếp</p>
          </div>
          <div className="text-center">
            <p className={`text-2xl font-bold ${getProgressColor(stats.averageProgress)}`}>
              {stats.averageProgress}%
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Tiến độ TB</p>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Tiến độ tổng thể
        </h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600 dark:text-gray-400">Ngày hoàn thành</span>
              <span className="text-gray-900 dark:text-white">
                {stats.completedDays}/{stats.totalDays}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(stats.completedDays / stats.totalDays) * 100}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600 dark:text-gray-400">Từ đã học</span>
              <span className="text-gray-900 dark:text-white">
                {stats.totalLearnedWords}/{stats.totalWords}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(stats.totalLearnedWords / stats.totalWords) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      {recentActivity.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Hoạt động gần đây
          </h3>
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div
                key={activity._id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {new Date(activity.date).toLocaleDateString('vi-VN')}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {activity.completedWords}/{activity.totalWords} từ
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-semibold ${getProgressColor(activity.progressPercentage)}`}>
                    {activity.progressPercentage}%
                  </p>
                  <div className={`w-16 h-2 rounded-full ${
                    activity.progressPercentage >= 80 ? 'bg-green-500' :
                    activity.progressPercentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Achievement Badges */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Thành tích
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className={`text-center p-4 rounded-lg ${
            stats.currentStreak >= 7 ? 'bg-orange-100 dark:bg-orange-900/20' : 'bg-gray-100 dark:bg-gray-700'
          }`}>
            <div className="text-2xl mb-2">🔥</div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {stats.currentStreak >= 7 ? 'Streak Master' : 'Streak'}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {stats.currentStreak} ngày
            </p>
          </div>
          <div className={`text-center p-4 rounded-lg ${
            stats.totalLearnedWords >= 100 ? 'bg-green-100 dark:bg-green-900/20' : 'bg-gray-100 dark:bg-gray-700'
          }`}>
            <div className="text-2xl mb-2">📚</div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {stats.totalLearnedWords >= 100 ? 'Word Master' : 'Learner'}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {stats.totalLearnedWords} từ
            </p>
          </div>
          <div className={`text-center p-4 rounded-lg ${
            stats.averageProgress >= 80 ? 'bg-blue-100 dark:bg-blue-900/20' : 'bg-gray-100 dark:bg-gray-700'
          }`}>
            <div className="text-2xl mb-2">🎯</div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {stats.averageProgress >= 80 ? 'Consistent' : 'Progress'}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {stats.averageProgress}%
            </p>
          </div>
          <div className={`text-center p-4 rounded-lg ${
            stats.completedDays >= 30 ? 'bg-purple-100 dark:bg-purple-900/20' : 'bg-gray-100 dark:bg-gray-700'
          }`}>
            <div className="text-2xl mb-2">⭐</div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {stats.completedDays >= 30 ? 'Dedicated' : 'Regular'}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {stats.completedDays} ngày
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VocabularyStats;
