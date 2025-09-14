// API Base URLs
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://35.240.251.182:3000";
export const QUIZ_API_URL = `${API_BASE_URL}/api/quizzes`;
export const SUBMISSION_API_URL = `${API_BASE_URL}/api/submissions`;
export const REVIEW_SCHEDULE_API_URL = `${API_BASE_URL}/api/review-schedule`;
export const VOCABULARY_API_URL = `${API_BASE_URL}/api/vocabulary`;

// Helper function to get auth headers
const getAuthHeaders = () => {
  const accessToken = localStorage.getItem("accessToken");
  console.log("API - Access token:", accessToken ? "exists" : "missing");
  return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
};

// Helper function to make authenticated requests
const makeAuthenticatedRequest = async (url, options = {}) => {
  const authHeaders = getAuthHeaders();
  const headers = {
    "Content-Type": "application/json",
    ...authHeaders,
    ...options.headers,
  };

  let response = await fetch(url, {
    ...options,
    headers,
  });

  // If token expired, try to refresh
  if (response.status === 401) {
    console.log("API - Token expired, attempting refresh...");
    const refreshToken = localStorage.getItem("refreshToken");
    console.log("API - Refresh token:", refreshToken ? "exists" : "missing");
    if (refreshToken) {
      try {
        console.log("API - Calling refresh token endpoint...");
        const refreshResponse = await fetch(
          `${API_BASE_URL}/api/auth/refresh-token`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken }),
          }
        );

        console.log("API - Refresh response status:", refreshResponse.status);
        if (refreshResponse.ok) {
          try {
            const refreshData = await refreshResponse.json();
            console.log("API - Refresh data:", refreshData);
            
            // Handle different response formats
            let newAccessToken;
            if (refreshData.data && refreshData.data.accessToken) {
              newAccessToken = refreshData.data.accessToken;
            } else if (refreshData.accessToken) {
              newAccessToken = refreshData.accessToken;
            } else {
              throw new Error("Invalid refresh token response format");
            }
            
            localStorage.setItem("accessToken", newAccessToken);
            console.log("API - New access token saved, retrying original request...");

            // Retry original request with new token
            const retryHeaders = {
              "Content-Type": "application/json",
              Authorization: `Bearer ${newAccessToken}`,
              ...options.headers,
            };

            response = await fetch(url, {
              ...options,
              headers: retryHeaders,
            });
            console.log("API - Retry response status:", response.status);
          } catch (parseError) {
            console.error("API - Error parsing refresh response:", parseError);
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("user");
            window.location.href = "/login";
            return response;
          }
        } else {
          // Refresh failed, clear auth data and redirect to login
          console.error("API - Token refresh failed with status:", refreshResponse.status);
          try {
            const errorText = await refreshResponse.text();
            console.error("API - Refresh error response:", errorText);
          } catch {
            console.error("API - Could not read error response");
          }
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
          window.location.href = "/login";
          return response; // Return original 401 response
        }
      } catch (error) {
        console.error("Token refresh failed:", error);
        // Clear auth data and redirect to login
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return response; // Return original 401 response
      }
    } else {
      // No refresh token, redirect to login
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      window.location.href = "/login";
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
      body: JSON.stringify({ title, text, createdBy }),
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
      body: JSON.stringify({ quizId, userEmail, answers, timeSpent }),
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
      limit: limit.toString(),
    });

    const res = await makeAuthenticatedRequest(
      `${SUBMISSION_API_URL}?${params}`
    );
    if (!res.ok) throw new Error("Không tải được lịch sử nộp bài");

    const data = await res.json();
    return Array.isArray(data?.submissions) ? data.submissions : [];
  },

  async getQuizSubmissions({ quizId, userEmail = "", page = 1, limit = 10 }) {
    const params = new URLSearchParams({
      userEmail,
      page: page.toString(),
      limit: limit.toString(),
    });

    const res = await makeAuthenticatedRequest(
      `${SUBMISSION_API_URL}/quiz/${quizId}?${params}`
    );
    if (!res.ok) throw new Error("Không tải được bài nộp của quiz");

    const data = await res.json();
    return Array.isArray(data?.submissions) ? data.submissions : [];
  },

  async getQuizStats(quizId) {
    const res = await makeAuthenticatedRequest(
      `${SUBMISSION_API_URL}/quiz/${quizId}/stats`
    );
    if (!res.ok) throw new Error("Không tải được thống kê quiz");
    return await res.json();
  },

  async getSubmissionById(id) {
    const res = await makeAuthenticatedRequest(`${SUBMISSION_API_URL}/${id}`);
    if (!res.ok) throw new Error("Không tải được chi tiết bài nộp");
    return await res.json();
  },

  // Review Schedule APIs
  async createReviewSchedule({ quizId, reviewInterval }) {
    const res = await makeAuthenticatedRequest(REVIEW_SCHEDULE_API_URL, {
      method: "POST",
      body: JSON.stringify({ quizId, reviewInterval }),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data?.message || "Tạo lịch ôn tập thất bại");
    }
    return await res.json();
  },

  async getQuizzesDueForReview(limit = 10) {
    const params = new URLSearchParams({ limit: limit.toString() });
    const res = await makeAuthenticatedRequest(
      `${REVIEW_SCHEDULE_API_URL}/due?${params}`
    );
    if (!res.ok) throw new Error("Không tải được danh sách quiz cần ôn tập");
    const data = await res.json();
    return Array.isArray(data?.metadata?.quizzes) ? data.metadata.quizzes : [];
  },

  async getMyReviewSchedules({ page = 1, limit = 10, active = true } = {}) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      active: active.toString(),
    });
    const res = await makeAuthenticatedRequest(
      `${REVIEW_SCHEDULE_API_URL}/my?${params}`
    );
    if (!res.ok) throw new Error("Không tải được lịch ôn tập");
    const data = await res.json();
    return Array.isArray(data?.metadata?.schedules) ? data.metadata.schedules : [];
  },

  async updateReviewAfterSubmission(scheduleId, { submissionId }) {
    const res = await makeAuthenticatedRequest(
      `${REVIEW_SCHEDULE_API_URL}/${scheduleId}/complete`,
      {
        method: "PATCH",
        body: JSON.stringify({ submissionId }),
      }
    );
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data?.message || "Cập nhật lịch ôn tập thất bại");
    }
    return await res.json();
  },

  async updateReviewScheduleSettings(scheduleId, { reviewInterval, isActive }) {
    const res = await makeAuthenticatedRequest(
      `${REVIEW_SCHEDULE_API_URL}/${scheduleId}`,
      {
        method: "PATCH",
        body: JSON.stringify({ reviewInterval, isActive }),
      }
    );
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data?.message || "Cập nhật cài đặt lịch ôn tập thất bại");
    }
    return await res.json();
  },

  async deleteReviewSchedule(scheduleId) {
    const res = await makeAuthenticatedRequest(
      `${REVIEW_SCHEDULE_API_URL}/${scheduleId}`,
      {
        method: "DELETE",
      }
    );
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data?.message || "Xóa lịch ôn tập thất bại");
    }
    return await res.json();
  },

  async getReviewStatistics() {
    const res = await makeAuthenticatedRequest(
      `${REVIEW_SCHEDULE_API_URL}/statistics`
    );
    if (!res.ok) throw new Error("Không tải được thống kê ôn tập");
    return await res.json();
  },

  // Vocabulary APIs
  async getTodayVocabulary() {
    const res = await makeAuthenticatedRequest(`${VOCABULARY_API_URL}/today`);
    if (!res.ok) throw new Error("Không tải được từ vựng hôm nay");
    const data = await res.json();
    console.log("API Response - getTodayVocabulary:", data); // Debug log
    return data;
  },

  async markWordAsLearned(wordIndex) {
    const res = await makeAuthenticatedRequest(`${VOCABULARY_API_URL}/learn`, {
      method: "PATCH",
      body: JSON.stringify({ wordIndex }),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data?.message || "Đánh dấu từ đã học thất bại");
    }
    return await res.json();
  },

  async getVocabularyHistory({ page = 1, limit = 7 } = {}) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    const res = await makeAuthenticatedRequest(
      `${VOCABULARY_API_URL}/history?${params}`
    );
    if (!res.ok) throw new Error("Không tải được lịch sử học từ vựng");
    const data = await res.json();
    return Array.isArray(data?.metadata?.history) ? data.metadata.history : [];
  },

  async getVocabularyStatistics() {
    const res = await makeAuthenticatedRequest(
      `${VOCABULARY_API_URL}/statistics`
    );
    if (!res.ok) throw new Error("Không tải được thống kê từ vựng");
    return await res.json();
  },

  async getWordsForReview(limit = 20) {
    const params = new URLSearchParams({ limit: limit.toString() });
    const res = await makeAuthenticatedRequest(
      `${VOCABULARY_API_URL}/review?${params}`
    );
    if (!res.ok) throw new Error("Không tải được từ vựng để ôn tập");
    const data = await res.json();
    return Array.isArray(data?.metadata?.words) ? data.metadata.words : [];
  },

  async updateVocabularyPreferences({ dailyWordGoal, reminderTime, difficultyLevel }) {
    const res = await makeAuthenticatedRequest(
      `${VOCABULARY_API_URL}/preferences`,
      {
        method: "PATCH",
        body: JSON.stringify({ dailyWordGoal, reminderTime, difficultyLevel }),
      }
    );
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data?.message || "Cập nhật preferences thất bại");
    }
    return await res.json();
  },

  async resetVocabularyProgress() {
    const res = await makeAuthenticatedRequest(`${VOCABULARY_API_URL}/reset`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data?.message || "Reset tiến trình thất bại");
    }
    return await res.json();
  },

  // Contribution Graph APIs
  async getContributionGraph({ year, days = 365, endDate } = {}) {
    const params = new URLSearchParams();
    if (year) params.append('year', year.toString());
    if (days) params.append('days', days.toString());
    if (endDate) params.append('endDate', endDate);

    const res = await makeAuthenticatedRequest(
      `${SUBMISSION_API_URL}/contributions/graph?${params}`
    );
    if (!res.ok) throw new Error("Không tải được contribution graph");
    return await res.json();
  },

  async getContributionStreaks() {
    const res = await makeAuthenticatedRequest(
      `${SUBMISSION_API_URL}/contributions/streaks`
    );
    if (!res.ok) throw new Error("Không tải được streak information");
    return await res.json();
  },

  async getContributionSummary() {
    const res = await makeAuthenticatedRequest(
      `${SUBMISSION_API_URL}/contributions/summary`
    );
    if (!res.ok) throw new Error("Không tải được contribution summary");
    return await res.json();
  },

  // Quiz Sharing APIs
  async getUsers({ search = '', page = 1, limit = 20 } = {}) {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    const res = await makeAuthenticatedRequest(
      `${API_BASE_URL}/api/auth/users?${params}`
    );
    if (!res.ok) throw new Error("Không tải được danh sách users");
    return await res.json();
  },

  async shareQuiz(quizId, { userIds }) {
    const res = await makeAuthenticatedRequest(
      `${QUIZ_API_URL}/${quizId}/share`,
      {
        method: "POST",
        body: JSON.stringify({ userIds }),
      }
    );
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data?.message || "Chia sẻ quiz thất bại");
    }
    return await res.json();
  },

  async unshareQuiz(quizId, { userIds }) {
    const res = await makeAuthenticatedRequest(
      `${QUIZ_API_URL}/${quizId}/share`,
      {
        method: "DELETE",
        body: JSON.stringify({ userIds }),
      }
    );
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data?.message || "Hủy chia sẻ quiz thất bại");
    }
    return await res.json();
  },

  async getSharedUsers(quizId) {
    const res = await makeAuthenticatedRequest(
      `${QUIZ_API_URL}/${quizId}/shared-users`
    );
    if (!res.ok) throw new Error("Không tải được danh sách users được chia sẻ");
    return await res.json();
  },

  async getMyQuizzes({ type = 'all', page = 1, limit = 10 } = {}) {
    const params = new URLSearchParams();
    params.append('type', type);
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    const res = await makeAuthenticatedRequest(
      `${QUIZ_API_URL}/my/quizzes?${params}`
    );
    if (!res.ok) throw new Error("Không tải được danh sách quiz của tôi");
    return await res.json();
  },

  // Question Management APIs
  async updateQuestion(quizId, questionIndex, questionData) {
    const res = await makeAuthenticatedRequest(
      `${QUIZ_API_URL}/${quizId}/questions/${questionIndex}`,
      {
        method: "PUT",
        body: JSON.stringify(questionData),
      }
    );
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data?.message || "Cập nhật câu hỏi thất bại");
    }
    return await res.json();
  },

  async deleteQuestion(quizId, questionIndex) {
    const res = await makeAuthenticatedRequest(
      `${QUIZ_API_URL}/${quizId}/questions/${questionIndex}`,
      {
        method: "DELETE",
      }
    );
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data?.message || "Xóa câu hỏi thất bại");
    }
    return await res.json();
  },

  async addQuestion(quizId, questionData) {
    const res = await makeAuthenticatedRequest(
      `${QUIZ_API_URL}/${quizId}/questions`,
      {
        method: "POST",
        body: JSON.stringify(questionData),
      }
    );
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data?.message || "Thêm câu hỏi thất bại");
    }
    return await res.json();
  },
};

// Utility Functions
export const utils = {
  formatDate(dateString) {
    return new Date(dateString).toLocaleString("vi-VN");
  },

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
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
  },
};
