import React from 'react';
import { utils } from '../utils/api';

const ReviewStats = ({ statistics }) => {
  if (!statistics?.metadata?.statistics) {
    return (
      <div className="rounded-lg shadow-md p-6" style={{ backgroundColor: 'var(--card-bg)' }}>
        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
          Thống kê ôn tập
        </h3>
        <p style={{ color: 'var(--text-secondary)' }}>Chưa có dữ liệu thống kê</p>
      </div>
    );
  }

  const stats = statistics.metadata.statistics;
  const recentPerformance = statistics.metadata.recentPerformance || [];

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="rounded-lg shadow-md p-6" style={{ backgroundColor: 'var(--card-bg)' }}>
        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
          Tổng quan ôn tập
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold" style={{ color: '#3b82f6' }}>{stats.totalSchedules}</p>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Tổng lịch ôn tập</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold" style={{ color: '#10b981' }}>{stats.activeSchedules}</p>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Đang hoạt động</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold" style={{ color: '#f59e0b' }}>{stats.needsReview}</p>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Cần ôn tập</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold" style={{ color: '#8b5cf6' }}>{stats.averageScore}%</p>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Điểm trung bình</p>
          </div>
        </div>
      </div>

      {/* Recent Performance */}
      {recentPerformance.length > 0 && (
        <div className="rounded-lg shadow-md p-6" style={{ backgroundColor: 'var(--card-bg)' }}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            Hiệu suất gần đây
          </h3>
          <div className="space-y-3">
            {recentPerformance.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between p-3 rounded-lg"
                style={{ backgroundColor: 'var(--bg-secondary)' }}
              >
                <div className="flex-1">
                  <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                    {item.quiz?.title || 'Quiz không xác định'}
                  </p>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Ôn tập lần cuối: {utils.formatDate(item.lastReviewedAt)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
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
      <div className="rounded-lg shadow-md p-6" style={{ backgroundColor: 'var(--card-bg)' }}>
        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
          Tiến trình ôn tập
        </h3>
        <div className="h-32 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--bg-secondary)' }}>
          <p style={{ color: 'var(--text-secondary)' }}>
            Biểu đồ tiến trình sẽ được thêm sau
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReviewStats;
