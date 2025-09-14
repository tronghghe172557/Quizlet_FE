import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';

const ContributionGraph = () => {
  const { isAuthenticated } = useAuth();
  const [graphData, setGraphData] = useState(null);
  const [streakData, setStreakData] = useState(null);
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [hoveredDay, setHoveredDay] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const months = [
    'Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6',
    'Th7', 'Th8', 'Th9', 'Th10', 'Th11', 'Th12'
  ];

  const weekdays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, selectedYear]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Tính ngày cuối cùng của năm đã chọn
      const endDate = new Date(selectedYear, 11, 31); // Tháng 11 = tháng 12 (0-indexed)
      const endDateString = endDate.toISOString().split('T')[0]; // Format: YYYY-MM-DD

      const [graphResponse, streakResponse, summaryResponse] = await Promise.all([
        api.getContributionGraph({ year: selectedYear, endDate: endDateString }),
        api.getContributionStreaks(),
        api.getContributionSummary()
      ]);

      setGraphData(graphResponse.data);
      setStreakData(streakResponse.data);
      setSummaryData(summaryResponse.data);
    } catch (err) {
      console.error('Error fetching contribution data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getIntensityClass = (intensity) => {
    switch (intensity) {
      case 0: return 'intensity-0';
      case 1: return 'intensity-1';
      case 2: return 'intensity-2';
      case 3: return 'intensity-3';
      case 4: return 'intensity-4';
      default: return 'intensity-0';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear; year >= currentYear - 4; year--) {
      years.push(year);
    }
    return years;
  };

  if (!isAuthenticated) {
    return (
      <div className="contribution-graph-container">
        <div className="text-center text-gray-500 py-8">
          Vui lòng đăng nhập để xem contribution graph
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="contribution-graph-container">
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="contribution-graph-container">
        <div className="text-center text-red-500 py-8">
          <p>Lỗi: {error}</p>
          <button 
            onClick={fetchData}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (!graphData || !graphData.contributions) {
    return (
      <div className="contribution-graph-container">
        <div className="text-center text-gray-500 py-8">
          Không có dữ liệu contribution
        </div>
      </div>
    );
  }

  return (
    <div className="contribution-graph-container rounded-lg shadow-lg p-6" style={{ backgroundColor: 'var(--card-bg)' }}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
            Hoạt động học tập {selectedYear}
          </h2>
          {graphData.stats && (
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {graphData.stats.totalContributions} contributions trong {graphData.stats.activeDays} ngày
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="px-3 py-1 border rounded"
            style={{ 
              borderColor: 'var(--border-color)', 
              backgroundColor: 'var(--card-bg)', 
              color: 'var(--text-primary)' 
            }}
          >
            {generateYearOptions().map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Streak Info */}
      {streakData && (
        <div className="mb-6 p-4 rounded-lg border" style={{ 
          background: 'linear-gradient(135deg, rgba(251, 146, 60, 0.1) 0%, rgba(239, 68, 68, 0.1) 100%)',
          borderColor: 'rgba(251, 146, 60, 0.3)'
        }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  🔥 {streakData.currentStreak}
                </div>
                <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Ngày liên tiếp</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  🏆 {streakData.longestStreak}
                </div>
                <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Kỷ lục</div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                {streakData.streakInfo.message}
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                {streakData.streakInfo.motivation}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Contribution Graph */}
      <div className="contribution-graph">
        {/* Month Labels */}
        <div className="flex mb-2">
          <div className="w-8"></div> {/* Space for weekday labels */}
          {months.map((month, index) => (
            <div key={index} className="flex-1 text-xs text-center" style={{ color: 'var(--text-secondary)' }}>
              {month}
            </div>
          ))}
        </div>

        {/* Graph Grid */}
        <div className="flex">
          {/* Weekday Labels */}
          <div className="w-8 flex flex-col justify-around text-xs" style={{ color: 'var(--text-secondary)' }}>
            {weekdays.map((day, index) => (
              <div key={index} className="h-3 flex items-center justify-end pr-1">
                {index % 2 === 0 ? day : ''}
              </div>
            ))}
          </div>

          {/* Contribution Squares */}
          <div className="flex-1 grid grid-cols-53 gap-1">
            {graphData.contributions.map((day, index) => (
              <div
                key={index}
                className={`contribution-square ${getIntensityClass(day.intensity)}`}
                onMouseEnter={(e) => {
                  setHoveredDay(day);
                  setTooltipPosition({ x: e.clientX, y: e.clientY });
                }}
                onMouseLeave={() => setHoveredDay(null)}
                title={`${formatDate(day.date)}: ${day.count} contributions`}
              />
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between mt-4 text-xs" style={{ color: 'var(--text-secondary)' }}>
          <span>Ít hơn</span>
          <div className="flex space-x-1">
            <div className="contribution-square intensity-0"></div>
            <div className="contribution-square intensity-1"></div>
            <div className="contribution-square intensity-2"></div>
            <div className="contribution-square intensity-3"></div>
            <div className="contribution-square intensity-4"></div>
          </div>
          <span>Nhiều hơn</span>
        </div>
      </div>

      {/* Tooltip */}
      {hoveredDay && (
        <div className="fixed z-50 bg-gray-900 text-white p-3 rounded-lg shadow-lg text-sm pointer-events-none"
             style={{
               left: `${tooltipPosition.x}px`,
               top: `${tooltipPosition.y - 10}px`,
               transform: 'translateX(-50%)'
             }}>
          <div className="font-semibold">{formatDate(hoveredDay.date)}</div>
          <div>{hoveredDay.count} contributions</div>
          <div>Điểm TB: {hoveredDay.averageScore?.toFixed(1) || 'N/A'}</div>
          <div>Điểm cao nhất: {hoveredDay.bestScore || 'N/A'}</div>
          <div>Thời gian: {formatTime(hoveredDay.totalTime)}</div>
        </div>
      )}

      {/* Summary Stats */}
      {summaryData && (
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <div className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
              {summaryData.overview.totalSubmissions}
            </div>
            <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Tổng bài làm</div>
          </div>
          <div className="text-center p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <div className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
              {summaryData.overview.averageScore?.toFixed(1) || 'N/A'}
            </div>
            <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Điểm TB</div>
          </div>
          <div className="text-center p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <div className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
              {summaryData.overview.totalTimeHours?.toFixed(1) || 'N/A'}h
            </div>
            <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Tổng thời gian</div>
          </div>
          <div className="text-center p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <div className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
              {summaryData.overview.completionRate?.toFixed(1) || 'N/A'}%
            </div>
            <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Tỷ lệ hoàn thành</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContributionGraph;
