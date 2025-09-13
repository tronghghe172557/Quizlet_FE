import { Link, useLocation } from "react-router-dom";
import { useDarkMode } from "../contexts/DarkModeContext";

export default function Header() {
  const location = useLocation();
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/quizzes" className="flex items-center">
              <div className="text-2xl font-bold text-blue-600">📚</div>
              <span className="ml-2 text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>Quiz App</span>
            </Link>
          </div>

          {/* Navigation Menu */}
          <nav className="hidden md:flex space-x-8">
            <Link
              to="/quizzes"
              className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                isActive('/quizzes') 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'hover:bg-gray-100'
              }`}
              style={{ 
                color: isActive('/quizzes') ? 'var(--text-primary)' : 'var(--text-secondary)',
                backgroundColor: isActive('/quizzes') ? 'rgba(59, 130, 246, 0.1)' : 'transparent'
              }}
            >
              Danh sách Quiz
            </Link>
            
            <Link
              to="/quizzes/new"
              className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                isActive('/quizzes/new') 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'hover:bg-gray-100'
              }`}
              style={{ 
                color: isActive('/quizzes/new') ? 'var(--text-primary)' : 'var(--text-secondary)',
                backgroundColor: isActive('/quizzes/new') ? 'rgba(59, 130, 246, 0.1)' : 'transparent'
              }}
            >
              Tạo Quiz
            </Link>
            
            <Link
              to="/submissions"
              className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                isActive('/submissions') 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'hover:bg-gray-100'
              }`}
              style={{ 
                color: isActive('/submissions') ? 'var(--text-primary)' : 'var(--text-secondary)',
                backgroundColor: isActive('/submissions') ? 'rgba(59, 130, 246, 0.1)' : 'transparent'
              }}
            >
              Lịch sử nộp bài
            </Link>
            
            <Link
              to="/home"
              className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                isActive('/home') 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'hover:bg-gray-100'
              }`}
              style={{ 
                color: isActive('/home') ? 'var(--text-primary)' : 'var(--text-secondary)',
                backgroundColor: isActive('/home') ? 'rgba(59, 130, 246, 0.1)' : 'transparent'
              }}
            >
              Trang chủ
            </Link>
          </nav>

          {/* Right side - Dark mode toggle and Auth Links */}
          <div className="flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
              style={{ 
                backgroundColor: 'var(--card-bg)', 
                borderColor: 'var(--border-color)',
                color: 'var(--text-secondary)'
              }}
              title={isDarkMode ? "Chuyển sang sáng" : "Chuyển sang tối"}
            >
              {isDarkMode ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            <Link
              to="/signin"
              className="text-sm font-medium transition-colors"
              style={{ color: 'var(--text-secondary)' }}
            >
              Đăng nhập
            </Link>
            <Link
              to="/signup"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Đăng ký
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="focus:outline-none"
              style={{ color: 'var(--text-secondary)' }}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
