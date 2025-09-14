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
import ReviewScheduleList from "../components/ReviewScheduleList";
import VocabularyList from "../components/VocabularyList";
import { ProtectedRoute, GuestRoute } from "../components/ProtectedRoute";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/quizzes" replace />} />
      
      {/* Auth Routes - Chỉ cho guest (chưa đăng nhập) */}
      <Route path="/signin" element={
        <GuestRoute>
          <LoginPage />
        </GuestRoute>
      } />
      <Route path="/signup" element={
        <GuestRoute>
          <RegisterPage />
        </GuestRoute>
      } />

      {/* Main Routes - Cần authentication */}
      <Route path="/home" element={
        <ProtectedRoute>
          <Layout><HomePage /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/quizzes" element={
        <ProtectedRoute>
          <Layout><QuizListPage /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/quizzes/new" element={
        <ProtectedRoute>
          <Layout><QuizCreatePage /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/quizzes/:id" element={
        <ProtectedRoute>
          <Layout><QuizDetailPage /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/quizzes/:id/submit" element={
        <ProtectedRoute>
          <Layout><SubmitQuiz /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/quizzes/:id/stats" element={
        <ProtectedRoute>
          <Layout><QuizStats /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/submissions" element={
        <ProtectedRoute>
          <Layout><UserSubmissions /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/submissions/:id" element={
        <ProtectedRoute>
          <Layout><SubmissionDetail /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/review-schedule" element={
        <ProtectedRoute>
          <Layout><ReviewScheduleList /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/vocabulary" element={
        <ProtectedRoute>
          <Layout><VocabularyList /></Layout>
        </ProtectedRoute>
      } />
    </Routes>
  );
};
