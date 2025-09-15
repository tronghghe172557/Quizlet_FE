import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';

const SharedUsersList = ({ quizId, onUpdate }) => {
  const [sharedUsers, setSharedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [removingUsers, setRemovingUsers] = useState(new Set());

  useEffect(() => {
    fetchSharedUsers();
  }, [quizId]);

  const fetchSharedUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getSharedUsers(quizId);
      setSharedUsers(response.data.sharedUsers || []);
    } catch (err) {
      console.error('Error fetching shared users:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveUser = async (userId) => {
    try {
      setRemovingUsers(prev => new Set(prev).add(userId));
      
      // Find user email by userId
      const user = sharedUsers.find(u => u._id === userId);
      if (!user) return;
      
      await api.unshareQuiz(quizId, { userEmails: [user.email] });
      
      // Remove user from local state
      setSharedUsers(prev => prev.filter(user => user._id !== userId));
      
      // Notify parent component
      if (onUpdate) {
        onUpdate();
      }
      
    } catch (err) {
      console.error('Error removing user:', err);
      alert(err.message || 'Không thể hủy chia sẻ với user này');
    } finally {
      setRemovingUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  const handleRemoveMultiple = async (userIds) => {
    if (userIds.length === 0) return;
    
    try {
      // Add all users to removing state
      setRemovingUsers(prev => new Set([...prev, ...userIds]));
      
      // Find user emails by userIds
      const userEmails = sharedUsers
        .filter(user => userIds.includes(user._id))
        .map(user => user.email);
      
      await api.unshareQuiz(quizId, { userEmails });
      
      // Remove users from local state
      setSharedUsers(prev => prev.filter(user => !userIds.includes(user._id)));
      
      // Notify parent component
      if (onUpdate) {
        onUpdate();
      }
      
    } catch (err) {
      console.error('Error removing users:', err);
      alert(err.message || 'Không thể hủy chia sẻ với các user này');
    } finally {
      setRemovingUsers(prev => {
        const newSet = new Set(prev);
        userIds.forEach(id => newSet.delete(id));
        return newSet;
      });
    }
  };

  if (loading) {
    return (
      <div className="shared-users-list">
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="shared-users-list">
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          <button
            onClick={fetchSharedUsers}
            className="mt-2 px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="shared-users-list">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          Users được chia sẻ ({sharedUsers.length})
        </h3>
        {sharedUsers.length > 0 && (
          <button
            onClick={() => handleRemoveMultiple(sharedUsers.map(u => u._id))}
            className="px-3 py-1 text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 border border-red-300 dark:border-red-600 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            Xóa tất cả
          </button>
        )}
      </div>

      {sharedUsers.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <div className="text-4xl mb-2">👥</div>
          <p>Chưa chia sẻ với user nào</p>
        </div>
      ) : (
        <div className="space-y-2">
          {sharedUsers.map(user => (
            <div
              key={user._id}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-medium text-gray-800 dark:text-white">
                    {user.name}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {user.email}
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => handleRemoveUser(user._id)}
                disabled={removingUsers.has(user._id)}
                className="px-3 py-1 text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 border border-red-300 dark:border-red-600 rounded hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {removingUsers.has(user._id) ? (
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 border border-red-600 border-t-transparent rounded-full animate-spin"></div>
                    <span>Đang xóa...</span>
                  </div>
                ) : (
                  'Xóa'
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SharedUsersList;
