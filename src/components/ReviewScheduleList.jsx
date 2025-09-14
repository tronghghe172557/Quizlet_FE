import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import ReviewScheduleCard from './ReviewScheduleCard';
import ReviewStats from './ReviewStats';

const ReviewScheduleList = () => {
  const [schedules, setSchedules] = useState([]);
  const [dueQuizzes, setDueQuizzes] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('due'); // 'due', 'all', 'stats'

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [schedulesData, dueData, statsData] = await Promise.all([
        api.getMyReviewSchedules({ page: 1, limit: 20 }),
        api.getQuizzesDueForReview(10),
        api.getReviewStatistics()
      ]);
      
      setSchedules(schedulesData);
      setDueQuizzes(dueData);
      setStatistics(statsData);
    } catch (err) {
      console.error('Error loading review data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleDelete = () => {
    loadData();
  };

  if (loading) {
    return (
      <div className="min-h-screen py-8" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 rounded w-1/4 mb-6" style={{ backgroundColor: 'var(--bg-secondary)' }}></div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen py-8" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="px-4 py-3 rounded" style={{ 
            backgroundColor: '#fef2f2', 
            border: '1px solid #fca5a5', 
            color: '#dc2626' 
          }}>
            <p className="font-bold">Lỗi tải dữ liệu:</p>
            <p>{error}</p>
            <button
              onClick={loadData}
              className="mt-2 font-bold py-2 px-4 rounded"
              style={{ 
                backgroundColor: '#dc2626', 
                color: 'white' 
              }}
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            Lịch ôn tập
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Quản lý và theo dõi tiến trình ôn tập của bạn
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div style={{ borderBottom: '1px solid var(--border-color)' }}>
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('due')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'due'
                    ? 'border-blue-500'
                    : 'border-transparent'
                }`}
                style={{ 
                  color: activeTab === 'due' ? '#3b82f6' : 'var(--text-secondary)',
                  borderBottomColor: activeTab === 'due' ? '#3b82f6' : 'transparent'
                }}
              >
                Cần ôn tập ({dueQuizzes.length})
              </button>
              <button
                onClick={() => setActiveTab('all')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'all'
                    ? 'border-blue-500'
                    : 'border-transparent'
                }`}
                style={{ 
                  color: activeTab === 'all' ? '#3b82f6' : 'var(--text-secondary)',
                  borderBottomColor: activeTab === 'all' ? '#3b82f6' : 'transparent'
                }}
              >
                Tất cả lịch ({schedules.length})
              </button>
              <button
                onClick={() => setActiveTab('stats')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'stats'
                    ? 'border-blue-500'
                    : 'border-transparent'
                }`}
                style={{ 
                  color: activeTab === 'stats' ? '#3b82f6' : 'var(--text-secondary)',
                  borderBottomColor: activeTab === 'stats' ? '#3b82f6' : 'transparent'
                }}
              >
                Thống kê
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'due' && (
          <div>
            {dueQuizzes.length === 0 ? (
              <div className="text-center py-12">
                <div className="mb-4" style={{ color: 'var(--text-secondary)' }}>
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                  Không có quiz nào cần ôn tập
                </h3>
                <p style={{ color: 'var(--text-secondary)' }}>
                  Tuyệt vời! Bạn đã hoàn thành tất cả bài ôn tập hôm nay.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {dueQuizzes.map((schedule) => (
                  <ReviewScheduleCard
                    key={schedule._id}
                    schedule={schedule}
                    onDelete={handleScheduleDelete}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'all' && (
          <div>
            {schedules.length === 0 ? (
              <div className="text-center py-12">
                <div className="mb-4" style={{ color: 'var(--text-secondary)' }}>
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                  Chưa có lịch ôn tập nào
                </h3>
                <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>
                  Tạo lịch ôn tập cho quiz để bắt đầu học tập có hệ thống.
                </p>
                <button
                  onClick={() => window.location.href = '/quiz'}
                  className="font-medium py-2 px-4 rounded-lg"
                  style={{ 
                    backgroundColor: '#3b82f6', 
                    color: 'white' 
                  }}
                >
                  Xem danh sách quiz
                </button>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {schedules.map((schedule) => (
                  <ReviewScheduleCard
                    key={schedule._id}
                    schedule={schedule}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'stats' && (
          <ReviewStats statistics={statistics} />
        )}
      </div>
    </div>
  );
};

export default ReviewScheduleList;
