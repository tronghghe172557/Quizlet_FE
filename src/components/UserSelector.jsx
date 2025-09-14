import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';

const UserSelector = ({ selectedUsers, onSelectionChange, excludeUsers = [] }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, [searchTerm, page]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.getUsers({
        search: searchTerm,
        page: page,
        limit: 20
      });

      const newUsers = response.data.users.filter(user => 
        !excludeUsers.includes(user._id)
      );

      if (page === 1) {
        setUsers(newUsers);
      } else {
        setUsers(prev => [...prev, ...newUsers]);
      }

      setHasMore(newUsers.length === 20);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const handleUserToggle = (user) => {
    const isSelected = selectedUsers.some(u => u._id === user._id);
    
    if (isSelected) {
      onSelectionChange(selectedUsers.filter(u => u._id !== user._id));
    } else {
      onSelectionChange([...selectedUsers, user]);
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  const clearSelection = () => {
    onSelectionChange([]);
  };

  return (
    <div className="user-selector">
      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm users theo tên hoặc email..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Selected Users Count */}
      {selectedUsers.length > 0 && (
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-300">
            Đã chọn: {selectedUsers.length} user(s)
          </span>
          <button
            onClick={clearSelection}
            className="text-xs text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
          >
            Xóa tất cả
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Users List */}
      <div className="max-h-64 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg">
        {users.length === 0 && !loading ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            {searchTerm ? 'Không tìm thấy user nào' : 'Không có user nào'}
          </div>
        ) : (
          users.map(user => {
            const isSelected = selectedUsers.some(u => u._id === user._id);
            
            return (
              <div
                key={user._id}
                className={`p-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                  isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                }`}
                onClick={() => handleUserToggle(user)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-gray-800 dark:text-white">
                      {user.name}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {user.email}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      Role: {user.role}
                    </div>
                  </div>
                  <div className="ml-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleUserToggle(user)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                </div>
              </div>
            );
          })
        )}

        {/* Load More Button */}
        {hasMore && (
          <div className="p-3 text-center border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={loadMore}
              disabled={loading}
              className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 disabled:opacity-50"
            >
              {loading ? 'Đang tải...' : 'Tải thêm'}
            </button>
          </div>
        )}

        {/* Loading Spinner */}
        {loading && (
          <div className="p-4 text-center">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Đang tải...</p>
          </div>
        )}
      </div>

      {/* Selected Users Preview */}
      {selectedUsers.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Users đã chọn:
          </h4>
          <div className="flex flex-wrap gap-2">
            {selectedUsers.map(user => (
              <div
                key={user._id}
                className="flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm"
              >
                <span>{user.name}</span>
                <button
                  onClick={() => handleUserToggle(user)}
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserSelector;
