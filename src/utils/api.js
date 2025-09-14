// API Base URLs
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://35.240.251.182:3000";export const QUIZ_API_URL = `${API_BASE_URL}/api/quizzes`;
export const SUBMISSION_API_URL = `${API_BASE_URL}/api/submissions`;

// Helper function to get auth headers
const getAuthHeaders = () => {
  const accessToken = localStorage.getItem('accessToken');
  return accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {};
};

// Helper function to make authenticated requests
const makeAuthenticatedRequest = async (url, options = {}) => {
  const authHeaders = getAuthHeaders();
  const headers = {
    'Content-Type': 'application/json',
    ...authHeaders,
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // If token expired, try to refresh
  if (response.status === 401) {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      try {
        const refreshResponse = await fetch(`${API_BASE_URL}/api/auth/refresh-token`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        });

        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          const newAccessToken = refreshData.data.accessToken;
          localStorage.setItem('accessToken', newAccessToken);

          // Retry original request with new token
          const retryHeaders = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${newAccessToken}`,
            ...options.headers,
          };

          return fetch(url, {
            ...options,
            headers: retryHeaders,
          });
        }
      } catch (error) {
        console.error('Token refresh failed:', error);
        // Clear auth data and redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
  }

  return response;
};

// API Helper Functions
export const api = {
  // Quiz APIs
  async getQuizzes() {
    const res = await makeAuthenticatedRequest(QUIZ_API_URL);
    if (!res.ok) throw new Error("Không tải được danh sách quiz");
    const data = await res.json();
    return Array.isArray(data?.items) ? data.items : [];
  },

  async getQuizById(id) {
    const quizzes = await this.getQuizzes();
    const found = quizzes.find((x) => x._id === id);
    if (!found) throw new Error("Không tìm thấy bài kiểm tra");
    return found;
  },

  async createQuiz({ title, text, createdBy }) {
    const res = await makeAuthenticatedRequest(QUIZ_API_URL, {
      method: "POST",
      body: JSON.stringify({ title, text, createdBy })
    });
    if (!res.ok) {
      let serverMsg = "";
      try {
        const data = await res.json();
        serverMsg = data?.message || "";
      } catch (error) {
        console.error(error);
        serverMsg = await res.text();
      }
      throw new Error(serverMsg || `Tạo quiz thất bại (HTTP ${res.status})`);
    }
    return await res.json();
  },

  // Submission APIs
  async submitQuiz({ quizId, userEmail, answers, timeSpent }) {
    const res = await makeAuthenticatedRequest(SUBMISSION_API_URL, {
      method: "POST",
      body: JSON.stringify({ quizId, userEmail, answers, timeSpent })
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data?.message || "Nộp bài thất bại");
    }
    const result = await res.json();
    console.log("Submit response:", result); // Debug log
    return result;
  },

  async getUserSubmissions({ userEmail, page = 1, limit = 10 }) {
    const params = new URLSearchParams({
      userEmail: userEmail.trim(),
      page: page.toString(),
      limit: limit.toString()
    });
    
    const res = await makeAuthenticatedRequest(`${SUBMISSION_API_URL}?${params}`);
    if (!res.ok) throw new Error("Không tải được lịch sử nộp bài");
    
    const data = await res.json();
    return Array.isArray(data?.submissions) ? data.submissions : [];
  },

  async getQuizSubmissions({ quizId, userEmail = "", page = 1, limit = 10 }) {
    const params = new URLSearchParams({
      userEmail,
      page: page.toString(),
      limit: limit.toString()
    });
    
    const res = await makeAuthenticatedRequest(`${SUBMISSION_API_URL}/quiz/${quizId}?${params}`);
    if (!res.ok) throw new Error("Không tải được bài nộp của quiz");
    
    const data = await res.json();
    return Array.isArray(data?.submissions) ? data.submissions : [];
  },

  async getQuizStats(quizId) {
    const res = await makeAuthenticatedRequest(`${SUBMISSION_API_URL}/quiz/${quizId}/stats`);
    if (!res.ok) throw new Error("Không tải được thống kê quiz");
    return await res.json();
  },

  async getSubmissionById(id) {
    const res = await makeAuthenticatedRequest(`${SUBMISSION_API_URL}/${id}`);
    if (!res.ok) throw new Error("Không tải được chi tiết bài nộp");
    return await res.json();
  }
};

// Utility Functions
export const utils = {
  formatDate(dateString) {
    return new Date(dateString).toLocaleString('vi-VN');
  },

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  },

  deriveTitleFromText(text) {
    if (!text) return "";
    const firstNonEmptyLine =
      text
        .split(/\r?\n/)
        .map((s) => s.trim())
        .find((s) => s.length > 0) || "";
    return firstNonEmptyLine.slice(0, 80);
  },

  shuffle(array) {
    const arr = array.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
};
