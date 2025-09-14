import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import UserSelector from './UserSelector';
import SharedUsersList from './SharedUsersList';

const QuizSharingModal = ({ quiz, isOpen, onClose, onUpdate }) => {
  const [activeTab, setActiveTab] = useState('share'); // 'share' or 'manage'
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [sharing, setSharing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [sharedUsers, setSharedUsers] = useState([]);

  // Fetch shared users when modal opens
  useEffect(() => {
    if (isOpen && quiz?._id) {
      fetchSharedUsers();
    }
  }, [isOpen, quiz?._id]);

  const fetchSharedUsers = async () => {
    try {
      const response = await api.getSharedUsers(quiz._id);
      setSharedUsers(response.data.sharedUsers || []);
    } catch (err) {
      console.error('Error fetching shared users:', err);
      // Don't show error to user, just log it
    }
  };

  const handleShare = async () => {
    if (selectedUsers.length === 0) {
      setError('Vui lòng chọn ít nhất một user để chia sẻ');
      return;
    }

    try {
      setSharing(true);
      setError(null);
      setSuccess(null);

      const userIds = selectedUsers.map(user => user._id);
      await api.shareQuiz(quiz._id, { userIds });

      setSuccess(`Đã chia sẻ quiz với ${selectedUsers.length} user(s) thành công!`);
      setSelectedUsers([]);
      
      // Notify parent component
      if (onUpdate) {
        onUpdate();
      }

      // Switch to manage tab to show updated list
      setTimeout(() => {
        setActiveTab('manage');
      }, 1500);

    } catch (err) {
      console.error('Error sharing quiz:', err);
      setError(err.message || 'Không thể chia sẻ quiz');
    } finally {
      setSharing(false);
    }
  };

  const handleClose = () => {
    setSelectedUsers([]);
    setError(null);
    setSuccess(null);
    setActiveTab('share');
    onClose();
  };

  const handleUpdate = () => {
    fetchSharedUsers(); // Refresh shared users list
    if (onUpdate) {
      onUpdate();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              Chia sẻ Quiz
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {quiz.title}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('share')}
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === 'share'
                ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Chia sẻ mới
          </button>
          <button
            onClick={() => setActiveTab('manage')}
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === 'manage'
                ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Quản lý chia sẻ
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'share' ? (
            <div className="space-y-6">
              {/* Success Message */}
              {success && (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <p className="text-sm text-green-600 dark:text-green-400">{success}</p>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              {/* User Selector */}
              <div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
                  Chọn users để chia sẻ
                </h3>
                <UserSelector
                  selectedUsers={selectedUsers}
                  onSelectionChange={setSelectedUsers}
                  sharedUsers={sharedUsers}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={handleClose}
                  className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                >
                  Hủy
                </button>
                <button
                  onClick={handleShare}
                  disabled={sharing || selectedUsers.length === 0}
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {sharing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Đang chia sẻ...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                      </svg>
                      <span>Chia sẻ với {selectedUsers.length} user(s)</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div>
              <SharedUsersList
                quizId={quiz._id}
                onUpdate={handleUpdate}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizSharingModal;
