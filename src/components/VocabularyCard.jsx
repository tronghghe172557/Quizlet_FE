import React, { useState } from 'react';
import { api } from '../utils/api';

const VocabularyCard = ({ word, index, onMarkLearned, isLearned }) => {
  const [isMarking, setIsMarking] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  // Debug log để xem data từ API
  console.log(`VocabularyCard ${index}:`, word);

  const handleMarkLearned = async () => {
    if (isLearned) return;
    
    setIsMarking(true);
    try {
      await api.markWordAsLearned(index);
      onMarkLearned?.(index);
    } catch (error) {
      console.error('Error marking word as learned:', error);
      alert(error.message);
    } finally {
      setIsMarking(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-100';
      case 'intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'advanced': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'noun': return 'text-blue-600 bg-blue-100';
      case 'verb': return 'text-purple-600 bg-purple-100';
      case 'adjective': return 'text-pink-600 bg-pink-100';
      case 'adverb': return 'text-indigo-600 bg-indigo-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-2 transition-all duration-200 ${
      isLearned 
        ? 'border-green-300 bg-green-50 dark:bg-green-900/20' 
        : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
    }`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {word.word}
          </h3>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-2">
            {word.meaning}
          </p>
          {word.pronunciation && (
            <p className="text-sm text-gray-500 dark:text-gray-400 italic">
              /{word.pronunciation}/
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(word.difficulty)}`}>
            {word.difficulty}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(word.category)}`}>
            {word.category}
          </span>
        </div>
      </div>

      {word.example && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Ví dụ:</p>
          <p className="text-sm italic text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 p-2 rounded">
            "{word.example}"
          </p>
        </div>
      )}

      <div className="flex justify-between items-center">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
        >
          {showDetails ? 'Ẩn chi tiết' : 'Xem chi tiết'}
        </button>
        
        <button
          onClick={handleMarkLearned}
          disabled={isLearned || isMarking}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            isLearned
              ? 'bg-green-100 text-green-700 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50'
          }`}
        >
          {isMarking ? 'Đang xử lý...' : isLearned ? 'Đã học ✓' : 'Đánh dấu đã học'}
        </button>
      </div>

      {showDetails && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600 dark:text-gray-400">Số lần ôn tập</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {word.reviewCount || 0}
              </p>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400">Lần ôn tập cuối</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {word.lastReviewedAt 
                  ? new Date(word.lastReviewedAt).toLocaleDateString('vi-VN')
                  : 'Chưa có'
                }
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VocabularyCard;
