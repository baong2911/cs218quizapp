import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getRandomQuiz } from "../api/quiz";

const ResultPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { questions, playerName, score, userAnswers, quizId } = location.state || {};
    
    const handleNextQuiz = async () => {
        try {
            const randomQuiz = await getRandomQuiz(quizId);
            localStorage.setItem("playerName", playerName);
            navigate("/quiz", { state: { quizId: randomQuiz._id } });
        } catch (error) {
            console.error("Error fetching next quiz:", error);
            navigate("/");
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center text-primary">Quiz Results</h1>
            <h3 className="text-center">Player: <span className="fw-bold">{playerName}</span></h3>
            <h2 className="text-center text-success">You scored {score} out of {questions.length}</h2>

            <h3 className="mt-4">Review your answers:</h3>
            <div className="row">
                {questions.map((item, index) => {
                    const userAnswer = userAnswers.find(ans => ans.question === item.question);

                    return (
                        <div key={index} className="col-md-12 mb-4">
                            <div className="card shadow">
                                <div className="card-body">
                                    <h5 className="fw-bold">{index + 1}. {item.question}</h5>

                                    <div className="row g-2 mt-3">
                                        {[1, 2, 3, 4].map((optIndex) => {
                                            const isUserAnswer = Array.isArray(userAnswer?.selected) 
                                                ? userAnswer?.selected.includes(optIndex) 
                                                : userAnswer?.selected === optIndex;
                                            
                                            const isCorrectAnswer = Array.isArray(item.ans)
                                                ? item.ans.map(a => a + 1).includes(optIndex)
                                                : item.ans + 1 === optIndex;

                                            let optionStyle = "p-3 border rounded text-center ";
                                            
                                            if (isUserAnswer) {
                                                optionStyle += isCorrectAnswer 
                                                    ? "bg-success text-white" 
                                                    : "bg-danger text-white";
                                            } else if (isCorrectAnswer) {
                                                optionStyle += "bg-success bg-opacity-50";
                                            }

                                            return (
                                                <div key={optIndex} className="col-6">
                                                    <div className={optionStyle}>
                                                        {item[`option${optIndex}`]}{" "}
                                                        {isUserAnswer && (isCorrectAnswer ? "✅" : "❌")}
                                                        {!isUserAnswer && isCorrectAnswer && "✓"}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="text-center mt-4">
                <button className="btn btn-primary btn-lg me-3" onClick={() => navigate("/")}>Play Again</button>
                <button className="btn btn-success btn-lg" onClick={handleNextQuiz}>Next Quiz</button>
            </div>
        </div>
    );
};

export default ResultPage;
