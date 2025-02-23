
import { useEffect, useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";

// import {data} from '../assets/data'// Import dữ liệu gốc

const ResultPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { questions, playerName, score, userAnswers } = location.state || {};

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
                                            const isUserAnswer = userAnswer?.selected === optIndex;
                                            const isCorrectAnswer = item.ans === optIndex;

                                            return (
                                                <div key={optIndex} className="col-6">
                                                    <div className={`p-3 border rounded text-center 
                                                        ${isUserAnswer ? "border-primary" : ""} 
                                                        ${isCorrectAnswer ? "bg-success text-white" : ""}`}>
                                                        {item[`option${optIndex}`]}{" "}
                                                        {isUserAnswer && (isCorrectAnswer ? "✅" : "❌")}
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
                <button className="btn btn-primary btn-lg" onClick={() => navigate("/")}>Play Again</button>
            </div>
        </div>
    );
};

export default ResultPage;
