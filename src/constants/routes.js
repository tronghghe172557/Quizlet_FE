// Route constants for easy navigation
export const ROUTES = {
  HOME: "/home",
  SIGNIN: "/signin",
  SIGNUP: "/signup",
  QUIZZES: "/quizzes",
  QUIZ_CREATE: "/quizzes/new",
  QUIZ_DETAIL: (id) => `/quizzes/${id}`,
  QUIZ_SUBMIT: (id) => `/quizzes/${id}/submit`,
  QUIZ_STATS: (id) => `/quizzes/${id}/stats`,
  SUBMISSIONS: "/submissions",
  SUBMISSION_DETAIL: (id) => `/submissions/${id}`,
  REVIEW_SCHEDULE: "/review-schedule",
  VOCABULARY: "/vocabulary"
};
