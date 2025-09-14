import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import VocabularyCard from './VocabularyCard';
import VocabularyStats from './VocabularyStats';
import VocabularyPreferences from './VocabularyPreferences';

const VocabularyList = () => {
  const [todayVocabulary, setTodayVocabulary] = useState(null);
  const [history, setHistory] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('today'); // 'today', 'history', 'stats'
  const [showPreferences, setShowPreferences] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [todayData, historyData, statsData] = await Promise.all([
        api.getTodayVocabulary(),
        api.getVocabularyHistory({ page: 1, limit: 7 }),
        api.getVocabularyStatistics()
      ]);
      
      console.log("VocabularyList - todayData:", todayData); // Debug log
      setTodayVocabulary(todayData);
      setHistory(historyData);
      setStatistics(statsData);
    } catch (err) {
      console.error('Error loading vocabulary data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkLearned = (wordIndex) => {
    if (todayVocabulary?.metadata?.vocabularyWords) {
      const updatedWords = [...todayVocabulary.metadata.vocabularyWords];
      updatedWords[wordIndex] = {
        ...updatedWords[wordIndex],
        isLearned: true,
        reviewCount: (updatedWords[wordIndex].reviewCount || 0) + 1,
        lastReviewedAt: new Date().toISOString()
      };
      
      setTodayVocabulary({
        ...todayVocabulary,
        metadata: {
          ...todayVocabulary.metadata,
          vocabularyWords: updatedWords,
          completedWords: updatedWords.filter(w => w.isLearned).length,
          progressPercentage: (updatedWords.filter(w => w.isLearned).length / updatedWords.length) * 100,
          isCompleted: updatedWords.every(w => w.isLearned)
        }
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p className="font-bold">Lỗi tải dữ liệu:</p>
            <p>{error}</p>
            <button
              onClick={loadData}
              className="mt-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  const words = todayVocabulary?.metadata?.vocabularyWords || [];
  const progress = todayVocabulary?.metadata?.progressPercentage || 0;
  const completedWords = todayVocabulary?.metadata?.completedWords || 0;
  const totalWords = todayVocabulary?.metadata?.totalWords || 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Từ vựng hôm nay
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Học từ vựng mới mỗi ngày để cải thiện tiếng Anh
              </p>
            </div>
            <button
              onClick={() => setShowPreferences(true)}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
            >
              ⚙️ Cài đặt
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        {todayVocabulary && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Tiến độ hôm nay
              </h2>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {completedWords}/{totalWords} từ
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div 
                className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-2">
              <span>0%</span>
              <span className="font-medium">{Math.round(progress)}%</span>
              <span>100%</span>
            </div>
            {todayVocabulary.metadata?.isCompleted && (
              <div className="mt-4 p-4 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center">
                  <div className="text-green-600 text-2xl mr-3">🎉</div>
                  <div>
                    <p className="font-medium text-green-800 dark:text-green-200">
                      Chúc mừng! Bạn đã hoàn thành từ vựng hôm nay!
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-400">
                      Hãy quay lại vào ngày mai để học từ vựng mới.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('today')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'today'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Hôm nay ({words.length})
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'history'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Lịch sử ({history.length})
              </button>
              <button
                onClick={() => setActiveTab('stats')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'stats'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Thống kê
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'today' && (
          <div>
            {words.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 dark:text-gray-500 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Chưa có từ vựng hôm nay
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Hệ thống sẽ tự động tạo từ vựng mới cho bạn.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {words.map((word, index) => (
                  <VocabularyCard
                    key={index}
                    word={word}
                    index={index}
                    onMarkLearned={handleMarkLearned}
                    isLearned={word.isLearned}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div>
            {history.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 dark:text-gray-500 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Chưa có lịch sử học
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Bắt đầu học từ vựng để xem lịch sử của bạn.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {history.map((day) => (
                  <div key={day._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {new Date(day.date).toLocaleDateString('vi-VN', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </h3>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {day.completedWords}/{day.totalWords} từ
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          day.isCompleted 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {day.isCompleted ? 'Hoàn thành' : 'Chưa hoàn thành'}
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          day.progressPercentage >= 80 ? 'bg-green-500' :
                          day.progressPercentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${day.progressPercentage}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-2">
                      <span>0%</span>
                      <span className="font-medium">{day.progressPercentage}%</span>
                      <span>100%</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'stats' && (
          <VocabularyStats statistics={statistics} />
        )}
      </div>

      {/* Preferences Modal */}
      {showPreferences && (
        <VocabularyPreferences onClose={() => setShowPreferences(false)} />
      )}
    </div>
  );
};

export default VocabularyList;
