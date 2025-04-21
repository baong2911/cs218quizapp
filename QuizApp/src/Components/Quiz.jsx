import React, { useRef, useState , useEffect} from 'react'
import styles from './Quiz.module.css'
import { submitQuiz, getRandomQuiz, getQuizById } from '../api/quiz';
import { useNavigate, useLocation } from "react-router-dom";

const Quiz = () => {
    let [index, setIndex] = useState(0);
    let [question, setQuestion] = useState({});
    let [data, setQuestions] = useState([]);
    let [lock, setLock] = useState(false);
    let [score, setScore] = useState(0);
    let [result, setResult] = useState(false);
    let [playerName, setPlayerName] = useState("");
    let [userAnswers, setUserAnswers] = useState([]);
    let [showCorrect, setShowCorrect] = useState(false);
    let [selectedOptions, setSelectedOptions] = useState([]);
    let [quizId, setQuizId] = useState(null);
    let [loading, setLoading] = useState(true);

    let Option1 = useRef(null);
    let Option2 = useRef(null);
    let Option3 = useRef(null);
    let Option4 = useRef(null);

    let option_arr = [Option1, Option2, Option3, Option4];

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const storedName = localStorage.getItem("playerName");
        setPlayerName(storedName || "Guest");

        let isMounted = true;
        const passedQuizId = location.state?.quizId;
        
        const processQuiz = (quiz) => {
            if (!quiz || !quiz.questions || quiz.questions.length === 0) {
                alert("Error fetching quiz, please check server");
                navigate("/");
                return;
            }

            setQuizId(quiz._id);

            const formattedQuestions = quiz.questions.map(q => {
                return {
                    ...q,
                    option1: q.options[0],
                    option2: q.options[1],
                    option3: q.options[2],
                    option4: q.options[3],
                    ans: q.correctAnswer
                };
            });

            setQuestions(formattedQuestions);
            setQuestion(formattedQuestions[0]);
        };

        const fetchQuiz = async () => {
            try {
                setLoading(true);
                let quiz;
                if (passedQuizId) {
                    quiz = await getQuizById(passedQuizId);
                } else {
                    quiz = await getRandomQuiz();
                }

                if (isMounted) {
                    processQuiz(quiz);
                    setLoading(false);
                }
            } catch (error) {
                if (isMounted) {
                    console.error("Failed to fetch quiz:", error);
                    alert("Error fetching quiz, please check server");
                    setLoading(false);
                    navigate("/");
                }
            }
        };
        
        fetchQuiz();

        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        setSelectedOptions([]);
    }, [index]);

    const isMultipleChoice = () => {
        return Array.isArray(question?.ans) && question?.ans.length > 1;
    };

    const handleOptionChange = (e, optionNumber) => {
        if (lock) return;
        
        if (isMultipleChoice()) {
            if (e.target.checked) {
                setSelectedOptions([...selectedOptions, optionNumber]);
            } else {
                setSelectedOptions(selectedOptions.filter(item => item !== optionNumber));
            }
        } else {
            setSelectedOptions([optionNumber]);
        }
    };

    const submitAnswer = () => {
        if (lock || selectedOptions.length === 0) return;
        
        const correctAnswers = Array.isArray(question?.ans) 
            ? question.ans 
            : [question?.ans];
        
        let isCorrect = false;
        
        if (isMultipleChoice()) {
            const selectedIndices = selectedOptions.map(opt => opt - 1);
            isCorrect = 
                selectedIndices.length === correctAnswers.length && 
                selectedIndices.every(selected => correctAnswers.includes(selected)) &&
                correctAnswers.every(correct => selectedIndices.includes(correct));
        } else {
            isCorrect = correctAnswers.includes(selectedOptions[0] - 1);
        }
        
        setUserAnswers([...userAnswers, { 
            question: question?.question, 
            selected: selectedOptions, 
            userAnswer: selectedOptions.map(opt => question[`option${opt}`]).join(', '), 
            correct: correctAnswers.map(index => index + 1).join(', '), 
            isCorrect: isCorrect 
        }]);

        if (isCorrect) {
            setScore(prev => prev + 1);
            selectedOptions.forEach(optNum => {
                if (option_arr[optNum-1] && option_arr[optNum-1].current) {
                    option_arr[optNum-1].current.classList.add(styles.correct);
                }
            });
            setShowCorrect(false);
        } else {
            selectedOptions.forEach(optNum => {
                if (option_arr[optNum-1] && option_arr[optNum-1].current) {
                    option_arr[optNum-1].current.classList.add(styles.wrong);
                }
            });
            setShowCorrect(true);
        }
        
        setLock(true);
    };

    const showCorrectAnswer = () => {
        const correctAnswers = Array.isArray(question?.ans) 
            ? question.ans 
            : [question?.ans];
        
        correctAnswers.forEach(ans => {
            const optionNumber = (typeof ans === 'number' ? ans : parseInt(ans)) + 1;
            if (option_arr[optionNumber - 1] && option_arr[optionNumber - 1].current) {
                option_arr[optionNumber - 1].current.classList.add(styles.correct);
            }
        });
        
        setShowCorrect(false);
    };

    const next = () => {
        if (lock) {
            if (index === data?.length - 1) {
                setResult(true);
                submitQuiz(playerName, score, userAnswers);
                navigate("/result", { state: { questions:data, playerName, score, userAnswers, quizId } });
                return;
            }
            setIndex(index + 1);
            setQuestion(data[index + 1]);
            setLock(false);
            setShowCorrect(false);
            option_arr.forEach(option => {
                if (option.current) {
                    option.current.classList.remove(styles.wrong);
                    option.current.classList.remove(styles.correct);
                }
            });
        }
    };

    const renderOptions = () => {
        const options = [
            { ref: Option1, number: 1, text: question?.option1 },
            { ref: Option2, number: 2, text: question?.option2 },
            { ref: Option3, number: 3, text: question?.option3 },
            { ref: Option4, number: 4, text: question?.option4 }
        ];

        if (isMultipleChoice()) {
            return (
                <ul className={styles.quizOptions}>
                    {options.map((option) => (
                        <li key={option.number} className={`${styles.quizOption} ${styles.optionWithInput}`} ref={option.ref}>
                            <label className={styles.inputContainer}>
                                <input
                                    type="checkbox"
                                    checked={selectedOptions.includes(option.number)}
                                    onChange={(e) => handleOptionChange(e, option.number)}
                                    disabled={lock}
                                />
                                <span className={styles.optionLabel}>{option.text}</span>
                            </label>
                        </li>
                    ))}
                </ul>
            );
        } else {
            return (
                <ul className={styles.quizOptions}>
                    {options.map((option) => (
                        <li key={option.number} className={`${styles.quizOption} ${styles.optionWithInput}`} ref={option.ref}>
                            <label className={styles.inputContainer}>
                                <input
                                    type="radio"
                                    name="quizOption"
                                    checked={selectedOptions.includes(option.number)}
                                    onChange={(e) => handleOptionChange(e, option.number)}
                                    disabled={lock}
                                />
                                <span className={styles.optionLabel}>{option.text}</span>
                            </label>
                        </li>
                    ))}
                </ul>
            );
        }
    };

    return (
        <div className={styles.quizContainer}>
            <h1 className={styles.quizTitle}>Hi {playerName},</h1>
            
            {loading ? (
                <div className="text-center my-5">
                    <h2>Loading Quiz...</h2>
                    <div className="spinner-border text-primary mt-3" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : !result ? (
                <>
                    <h2 className={styles.quizQuestion}>{index + 1}. {question?.question}</h2>
                    {renderOptions()}

                    <div className="row justify-content-center mt-3">
                        {!lock && (
                            <div className="col-12 text-center">
                                <button 
                                    className={styles.quizButton} 
                                    onClick={submitAnswer}
                                    disabled={selectedOptions.length === 0}
                                >
                                    Submit
                                </button>
                            </div>
                        )}
                        
                        {showCorrect && (
                            <div className="col-12 text-center mt-2">
                                <button className="btn btn-warning" style={{width: '200px'}} onClick={showCorrectAnswer}>
                                    Show Correct Answer
                                </button>
                            </div>
                        )}
                        
                        {lock && (
                            <div className="col-12 text-center mt-2">
                                <button className={styles.quizButton} onClick={next}>Next</button>
                            </div>
                        )}
                    </div>
                    <div className={styles.index}>{index + 1} of {data?.length} questions</div>
                </>
            ) : null}
        </div>
    );
};

export default Quiz;
