import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SignIn from "./component/SignIn";
import SignUp from "./component/SignUp";
import Home from "./component/Home";
import QuizList from "./component/QuizList";
import QuizDetail from "./component/QuizDetail";
import QuizCreate from "./component/QuizCreate";


function App() {
  return <>

    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/quizzes" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        <Route path="/quizzes" element={<QuizList />} />
        <Route path="/quizzes/new" element={<QuizCreate />} />
        <Route path="/quizzes/:id" element={<QuizDetail />} />
      </Routes>
    </Router>

  </>
}

export default App;
