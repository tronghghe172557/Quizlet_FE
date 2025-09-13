import { Routes, Route, Navigate } from "react-router-dom";
import SignIn from "../component/SignIn";
import SignUp from "../component/SignUp";
import Home from "../component/Home";
import QuizList from "../component/QuizList";
import QuizDetail from "../component/QuizDetail";
import QuizCreate from "../component/QuizCreate";
import SubmitQuiz from "../component/SubmitQuiz";
import UserSubmissions from "../component/UserSubmissions";
import QuizStats from "../component/QuizStats";
import SubmissionDetail from "../component/SubmissionDetail";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/quizzes" replace />} />
      <Route path="/home" element={<Home />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />

      {/* Quiz Routes */}
      <Route path="/quizzes" element={<QuizList />} />
      <Route path="/quizzes/new" element={<QuizCreate />} />
      <Route path="/quizzes/:id" element={<QuizDetail />} />
      <Route path="/quizzes/:id/submit" element={<SubmitQuiz />} />
      <Route path="/quizzes/:id/stats" element={<QuizStats />} />
      
      {/* Submission Routes */}
      <Route path="/submissions" element={<UserSubmissions />} />
      <Route path="/submissions/:id" element={<SubmissionDetail />} />
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
