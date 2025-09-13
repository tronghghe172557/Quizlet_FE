// API Base URLs
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";
export const QUIZ_API_URL = `${API_BASE_URL}/api/quizzes`;
export const SUBMISSION_API_URL = `${API_BASE_URL}/api/submissions`;

// API Helper Functions
export const api = {
  // Quiz APIs
  async getQuizzes() {
    const res = await fetch(QUIZ_API_URL);
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
    const res = await fetch(QUIZ_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
    const res = await fetch(SUBMISSION_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
    
    const res = await fetch(`${SUBMISSION_API_URL}?${params}`);
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
    
    const res = await fetch(`${SUBMISSION_API_URL}/quiz/${quizId}?${params}`);
    if (!res.ok) throw new Error("Không tải được bài nộp của quiz");
    
    const data = await res.json();
    return Array.isArray(data?.submissions) ? data.submissions : [];
  },

  async getQuizStats(quizId) {
    const res = await fetch(`${SUBMISSION_API_URL}/quiz/${quizId}/stats`);
    if (!res.ok) throw new Error("Không tải được thống kê quiz");
    return await res.json();
  },

  async getSubmissionById(id) {
    const res = await fetch(`${SUBMISSION_API_URL}/${id}`);
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
