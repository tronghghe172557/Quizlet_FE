import React from 'react';

const VocabularyStats = ({ statistics }) => {
  if (!statistics?.metadata?.statistics) {
    return (
      <div className="rounded-lg shadow-md p-6" style={{ backgroundColor: 'var(--card-bg)' }}>
        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
          Thống kê từ vựng
        </h3>
        <p style={{ color: 'var(--text-secondary)' }}>Chưa có dữ liệu thống kê</p>
      </div>
    );
  }

  const stats = statistics.metadata.statistics;
  const recentActivity = statistics.metadata.recentActivity || [];

  const getStreakColor = (streak) => {
    if (streak >= 7) return '#ea580c';
    if (streak >= 3) return '#d97706';
    return 'var(--text-secondary)';
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return '#10b981';
    if (progress >= 60) return '#d97706';
    return '#dc2626';
  };

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="rounded-lg shadow-md p-6" style={{ backgroundColor: 'var(--card-bg)' }}>
        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
          Tổng quan học từ vựng
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold" style={{ color: '#3b82f6' }}>{stats.totalDays}</p>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Tổng ngày học</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold" style={{ color: '#10b981' }}>{stats.totalLearnedWords}</p>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Từ đã học</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold" style={{ color: getStreakColor(stats.currentStreak) }}>
              {stats.currentStreak}
            </p>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Ngày liên tiếp</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold" style={{ color: getProgressColor(stats.averageProgress) }}>
              {stats.averageProgress}%
            </p>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Tiến độ TB</p>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="rounded-lg shadow-md p-6" style={{ backgroundColor: 'var(--card-bg)' }}>
        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
          Tiến độ tổng thể
        </h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span style={{ color: 'var(--text-secondary)' }}>Ngày hoàn thành</span>
              <span style={{ color: 'var(--text-primary)' }}>
                {stats.completedDays}/{stats.totalDays}
              </span>
            </div>
            <div className="w-full rounded-full h-2" style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <div 
                className="h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${(stats.completedDays / stats.totalDays) * 100}%`,
                  backgroundColor: '#3b82f6'
                }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span style={{ color: 'var(--text-secondary)' }}>Từ đã học</span>
              <span style={{ color: 'var(--text-primary)' }}>
                {stats.totalLearnedWords}/{stats.totalWords}
              </span>
            </div>
            <div className="w-full rounded-full h-2" style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <div 
                className="h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${(stats.totalLearnedWords / stats.totalWords) * 100}%`,
                  backgroundColor: '#10b981'
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      {recentActivity.length > 0 && (
        <div className="rounded-lg shadow-md p-6" style={{ backgroundColor: 'var(--card-bg)' }}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            Hoạt động gần đây
          </h3>
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div
                key={activity._id}
                className="flex items-center justify-between p-3 rounded-lg"
                style={{ backgroundColor: 'var(--bg-secondary)' }}
              >
                <div className="flex-1">
                  <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                    {new Date(activity.date).toLocaleDateString('vi-VN')}
                  </p>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {activity.completedWords}/{activity.totalWords} từ
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold" style={{ color: getProgressColor(activity.progressPercentage) }}>
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
      <div className="rounded-lg shadow-md p-6" style={{ backgroundColor: 'var(--card-bg)' }}>
        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
          Thành tích
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 rounded-lg" style={{ 
            backgroundColor: stats.currentStreak >= 7 ? '#fed7aa' : 'var(--bg-secondary)' 
          }}>
            <div className="text-2xl mb-2">🔥</div>
            <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              {stats.currentStreak >= 7 ? 'Streak Master' : 'Streak'}
            </p>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              {stats.currentStreak} ngày
            </p>
          </div>
          <div className="text-center p-4 rounded-lg" style={{ 
            backgroundColor: stats.totalLearnedWords >= 100 ? '#dcfce7' : 'var(--bg-secondary)' 
          }}>
            <div className="text-2xl mb-2">📚</div>
            <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              {stats.totalLearnedWords >= 100 ? 'Word Master' : 'Learner'}
            </p>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              {stats.totalLearnedWords} từ
            </p>
          </div>
          <div className="text-center p-4 rounded-lg" style={{ 
            backgroundColor: stats.averageProgress >= 80 ? '#dbeafe' : 'var(--bg-secondary)' 
          }}>
            <div className="text-2xl mb-2">🎯</div>
            <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              {stats.averageProgress >= 80 ? 'Consistent' : 'Progress'}
            </p>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              {stats.averageProgress}%
            </p>
          </div>
          <div className="text-center p-4 rounded-lg" style={{ 
            backgroundColor: stats.completedDays >= 30 ? '#e9d5ff' : 'var(--bg-secondary)' 
          }}>
            <div className="text-2xl mb-2">⭐</div>
            <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              {stats.completedDays >= 30 ? 'Dedicated' : 'Regular'}
            </p>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              {stats.completedDays} ngày
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VocabularyStats;
