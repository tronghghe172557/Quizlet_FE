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
    <div className="contribution-graph-container bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Hoạt động học tập {selectedYear}
          </h2>
          {graphData.stats && (
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {graphData.stats.totalContributions} contributions trong {graphData.stats.activeDays} ngày
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
          >
            {generateYearOptions().map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Streak Info */}
      {streakData && (
        <div className="mb-6 p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  🔥 {streakData.currentStreak}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Ngày liên tiếp</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-gray-700 dark:text-gray-200">
                  🏆 {streakData.longestStreak}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Kỷ lục</div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-700 dark:text-gray-200 font-medium">
                {streakData.streakInfo.message}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
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
            <div key={index} className="flex-1 text-xs text-gray-600 dark:text-gray-400 text-center">
              {month}
            </div>
          ))}
        </div>

        {/* Graph Grid */}
        <div className="flex">
          {/* Weekday Labels */}
          <div className="w-8 flex flex-col justify-around text-xs text-gray-600 dark:text-gray-400">
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
        <div className="flex items-center justify-between mt-4 text-xs text-gray-600 dark:text-gray-400">
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
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {summaryData.overview.totalSubmissions}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Tổng bài làm</div>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-lg font-bold text-green-600 dark:text-green-400">
              {summaryData.overview.averageScore?.toFixed(1) || 'N/A'}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Điểm TB</div>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
              {summaryData.overview.totalTimeHours?.toFixed(1) || 'N/A'}h
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Tổng thời gian</div>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-lg font-bold text-orange-600 dark:text-orange-400">
              {summaryData.overview.completionRate?.toFixed(1) || 'N/A'}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Tỷ lệ hoàn thành</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContributionGraph;
