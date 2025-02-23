import React, { useRef, useState , useEffect} from 'react'
import './Quiz.css'
// import {data} from '../assets/data'
// import getQuestion from '../api/quiz'
import { getQuestion, submitQuiz } from '../api/quiz';
import { useNavigate } from "react-router-dom";


const Quiz = () => {
    let [index, setIndex] = useState(0);
    let [question, setQuestion] = useState({});
    let [data, setQuestions] = useState([]);
    let [lock, setLock] = useState(false);
    let [score, setScore] = useState(0);
    let [result, setResult] = useState(false);
    let [playerName, setPlayerName] = useState("");
    let [userAnswers, setUserAnswers] = useState([]); // Lưu câu trả lời của người chơi
    let [showCorrect, setShowCorrect] = useState(false); // Trạng thái hiển thị đáp án đúng

    let Option1 = useRef(null);
    let Option2 = useRef(null);
    let Option3 = useRef(null);
    let Option4 = useRef(null);

    let option_arr = [Option1, Option2, Option3, Option4];

    const navigate = useNavigate();

    useEffect(() => {
        const storedName = localStorage.getItem("playerName");
        setPlayerName(storedName || "Guest");

        // get questions
        getQuestion().then(data=>{
            if (!data){
                // display notification
                alert("Error fetching questions, please check server");
                navigate("/");
            }
            setQuestions(data);
            setQuestion(data[0]);
        })
    }, []);

    const checkAns = (e, ans) => {
        if (!lock) {
            const isCorrect = question?.ans === ans;
            setUserAnswers([...userAnswers, { question: question?.question, selected: ans, userAnswer: question[`option${ans}`], correct: question?.ans, isCorect: isCorrect  }]);

            if (isCorrect) {
                e.target.classList.add("correct");
                setScore(prev => prev + 1);
                setLock(true);
            } else {
                e.target.classList.add("wrong");
                setLock(true);
                setShowCorrect(true); // Chỉ hiện nút Show Correct Answer
            }
        }
    };

    const showCorrectAnswer = () => {
        option_arr[question?.ans - 1].current.classList.add("correct");
        setShowCorrect(false);
    };

    const next = () => {
        if (lock) {
            if (index === data?.length - 1) {
                setResult(true);

                // submit quiz
                submitQuiz(playerName, score, userAnswers);
                //
                navigate("/result", { state: { questions:data, playerName, score, userAnswers } });
                return;
            }
            setIndex(index + 1);
            setQuestion(data[index + 1]);
            setLock(false);
            setShowCorrect(false);
            option_arr.forEach(option => {
                option.current.classList.remove("wrong");
                option.current.classList.remove("correct");
            });
        }
    };

    return (
        <div>
            <h1>Hi {playerName},</h1>
            {!result ? (
                <>
                    <h2>{index + 1}. {question?.question}</h2>
                    <ul>
                        <li ref={Option1} onClick={(e) => checkAns(e, 1)}>{question?.option1}</li>
                        <li ref={Option2} onClick={(e) => checkAns(e, 2)}>{question?.option2}</li>
                        <li ref={Option3} onClick={(e) => checkAns(e, 3)}>{question?.option3}</li>
                        <li ref={Option4} onClick={(e) => checkAns(e, 4)}>{question?.option4}</li>
                    </ul>

                     
                    <div className="row justify-content-center mt-3">
                        {showCorrect && (
                            <div className="col-6">
                                <button className="btn btn-warning w-100" onClick={showCorrectAnswer}>
                                    Show Correct Answer
                                </button>
                            </div>
                        )}
                        <div className="col-6">
                            <button className="btn btn-primary w-100" onClick={next}>Next</button>
                        </div>
                    </div>
                    <div className="index">{index + 1} of {data?.length} questions</div>
                </>
            ) : null}
        </div>
    );
};

export default Quiz;


