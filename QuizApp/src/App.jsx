import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StartPage from "./pages/StartPage";
import ResultPage from "./pages/ResultPage";
import Quiz from "./Components/Quiz";
import ManageQuizzes from "./pages/ManageQuizzes";
import ManageQuestions from "./pages/ManageQuestions";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/result" element={<ResultPage />} />
        <Route path="/manage" element={<ManageQuizzes />} />
        <Route path="/manage-questions/:quizId" element={<ManageQuestions />} />
      </Routes>
    </Router>
  );
};

export default App;
