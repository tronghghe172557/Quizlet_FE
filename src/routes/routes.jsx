import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "../components/Layout";
import HomePage from "../pages/Home/HomePage";
import LoginPage from "../pages/Auth/LoginPage";
import RegisterPage from "../pages/Auth/RegisterPage";
import QuizListPage from "../pages/Quiz/QuizListPage";
import QuizDetailPage from "../pages/Quiz/QuizDetailPage";
import QuizCreatePage from "../pages/Quiz/QuizCreatePage";
import SubmitQuiz from "../components/SubmitQuiz";
import UserSubmissions from "../components/UserSubmissions";
import QuizStats from "../components/QuizStats";
import SubmissionDetail from "../components/SubmissionDetail";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/quizzes" replace />} />
      
      {/* Auth Routes - No Layout */}
      <Route path="/signin" element={<LoginPage />} />
      <Route path="/signup" element={<RegisterPage />} />

      {/* Main Routes - With Layout */}
      <Route path="/home" element={<Layout><HomePage /></Layout>} />
      <Route path="/quizzes" element={<Layout><QuizListPage /></Layout>} />
      <Route path="/quizzes/new" element={<Layout><QuizCreatePage /></Layout>} />
      <Route path="/quizzes/:id" element={<Layout><QuizDetailPage /></Layout>} />
      <Route path="/quizzes/:id/submit" element={<Layout><SubmitQuiz /></Layout>} />
      <Route path="/quizzes/:id/stats" element={<Layout><QuizStats /></Layout>} />
      <Route path="/submissions" element={<Layout><UserSubmissions /></Layout>} />
      <Route path="/submissions/:id" element={<Layout><SubmissionDetail /></Layout>} />
    </Routes>
  );
};

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
  SUBMISSION_DETAIL: (id) => `/submissions/${id}`
};
