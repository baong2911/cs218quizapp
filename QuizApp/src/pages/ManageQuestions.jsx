import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    getQuizById, 
    getAllQuestions,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    addQuestionToQuiz,
    removeQuestionFromQuiz
} from '../api/quiz';

const ManageQuestions = () => {
    const { quizId } = useParams();
    const navigate = useNavigate();
    
    const [quiz, setQuiz] = useState(null);
    const [allQuestions, setAllQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [questionText, setQuestionText] = useState('');
    const [options, setOptions] = useState(['', '', '', '']);
    const [correctAnswer, setCorrectAnswer] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('');
    
    const fetchData = async () => {
        setLoading(true);
        try {
            const quizData = await getQuizById(quizId);
            setQuiz(quizData);
            
            const questionsData = await getAllQuestions();
            setAllQuestions(questionsData);
            
            setError(null);
        } catch (err) {
            setError('Failed to fetch quiz data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchData();
    }, [quizId]);
    
    const resetForm = () => {
        setSelectedQuestion(null);
        setQuestionText('');
        setOptions(['', '', '', '']);
        setCorrectAnswer([]);
        setIsEditing(false);
    };
    
    const openCreateModal = () => {
        resetForm();
        setModalType('create');
        setShowModal(true);
    };
    
    const openEditModal = (question) => {
        setSelectedQuestion(question);
        setQuestionText(question.question);
        setOptions(question.options || ['', '', '', '']);
        const answerArray = Array.isArray(question.correctAnswer) 
            ? question.correctAnswer 
            : question.correctAnswer ? [question.correctAnswer] : [];
        setCorrectAnswer(answerArray);
        setIsEditing(true);
        setModalType('edit');
        setShowModal(true);
    };
    
    const openDeleteModal = (question) => {
        setSelectedQuestion(question);
        setModalType('delete');
        setShowModal(true);
    };
    
    const openAddQuestionModal = () => {
        setModalType('add');
        setShowModal(true);
    };
    
    const closeModal = () => {
        setShowModal(false);
        resetForm();
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (correctAnswer.length === 0) {
            setError("Please select at least one correct answer");
            return;
        }
        
        const questionData = {
            question: questionText,
            options: options,
            correctAnswer: correctAnswer
        };
        
        try {
            let result;
            if (isEditing && selectedQuestion) {
                const questionId = selectedQuestion.id || selectedQuestion._id;
                result = await updateQuestion(questionId, questionData);
            } else {
                result = await createQuestion(questionData);
                if (result && result.id) {
                    await addQuestionToQuiz(quizId, result.id);
                }
            }
            
            closeModal();
            fetchData();
        } catch (err) {
            setError(`Failed to ${isEditing ? 'update' : 'create'} question`);
            console.error(err);
        }
    };
    
    const handleDelete = async () => {
        if (!selectedQuestion) return;
        
        try {
            await deleteQuestion(selectedQuestion.id);
            closeModal();
            fetchData();
        } catch (err) {
            setError(`Failed to delete question`);
            console.error(err);
        }
    };
    
    const handleAddQuestionToQuiz = async (questionId) => {
        try {
            await addQuestionToQuiz(quizId, questionId);
            fetchData();
        } catch (err) {
            setError(`Failed to add question to quiz`);
            console.error(err);
        }
    };
    
    const handleRemoveQuestionFromQuiz = async (questionId) => {
        try {
            await removeQuestionFromQuiz(quizId, questionId);
            fetchData();
        } catch (err) {
            setError(`Failed to remove question from quiz`);
            console.error(err);
        }
    };
    
    const handleOptionChange = (index, value) => {
        const updatedOptions = [...options];
        updatedOptions[index] = value;
        setOptions(updatedOptions);
    };

    const isQuestionInQuiz = (questionId) => {
        return quiz?.questions?.some(q => q.id === questionId || q._id === questionId);
    };
    
    const renderQuizQuestions = () => {
        if (!quiz || !quiz.questions || quiz.questions.length === 0) {
            return <p className="text-center">This quiz has no questions yet.</p>;
        }
        
        return (
            <div className="table-responsive mt-4">
                <h3>Questions in this Quiz</h3>
                <table className="table table-hover table-striped">
                    <thead className="table-dark">
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Question</th>
                            <th scope="col">Options</th>
                            <th scope="col">Correct Answer</th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {quiz.questions.map((question, index) => (
                            <tr key={question.id || question._id}>
                                <td>{index + 1}</td>
                                <td>{question.question}</td>
                                <td>
                                    <ul className="list-unstyled">
                                        {question.options?.map((option, i) => {
                                            const correctAnswers = Array.isArray(question.correctAnswer) 
                                                ? question.correctAnswer 
                                                : [question.correctAnswer];
                                            const isCorrect = correctAnswers.includes(i);
                                            
                                            return (
                                                <li key={i} className={isCorrect ? "text-success fw-bold" : ""}>
                                                    {i+1}. {option}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </td>
                                <td>
                                    {Array.isArray(question.correctAnswer) 
                                        ? question.correctAnswer.map(ans => ans + 1).join(", ")
                                        : question.correctAnswer !== undefined ? question.correctAnswer + 1 : ""}
                                </td>
                                <td>
                                    <div className="btn-group">
                                        <button 
                                            className="btn btn-sm btn-outline-secondary" 
                                            onClick={() => openEditModal(question)}
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            className="btn btn-sm btn-outline-danger" 
                                            onClick={() => handleRemoveQuestionFromQuiz(question.id || question._id)}
                                        >
                                            Remove from Quiz
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };
    
    const renderAllQuestions = () => {
        if (!allQuestions || allQuestions.length === 0) {
            return <p className="text-center">No questions available.</p>;
        }
        
        const availableQuestions = allQuestions.filter(q => !isQuestionInQuiz(q.id || q._id));
        
        if (availableQuestions.length === 0) {
            return <p className="text-center">All available questions have been added to this quiz.</p>;
        }
        
        return (
            <div className="table-responsive mt-4">
                <h3>Available Questions</h3>
                <table className="table table-hover table-striped">
                    <thead className="table-dark">
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Question</th>
                            <th scope="col">Options</th>
                            <th scope="col">Correct Answer</th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {availableQuestions.map((question, index) => (
                            <tr key={question.id || question._id}>
                                <td>{index + 1}</td>
                                <td>{question.question}</td>
                                <td>
                                    <ul className="list-unstyled">
                                        {question.options?.map((option, i) => {
                                            const correctAnswers = Array.isArray(question.correctAnswer) 
                                                ? question.correctAnswer 
                                                : [question.correctAnswer];
                                            const isCorrect = correctAnswers.includes(i);
                                            
                                            return (
                                                <li key={i} className={isCorrect ? "text-success fw-bold" : ""}>
                                                    {i+1}. {option}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </td>
                                <td>
                                    {Array.isArray(question.correctAnswer) 
                                        ? question.correctAnswer.map(ans => ans + 1).join(", ")
                                        : question.correctAnswer !== undefined ? question.correctAnswer + 1 : ""}
                                </td>
                                <td>
                                    <div className="btn-group">
                                        <button 
                                            className="btn btn-sm btn-outline-primary" 
                                            onClick={() => handleAddQuestionToQuiz(question.id || question._id)}
                                        >
                                            Add to Quiz
                                        </button>
                                        <button 
                                            className="btn btn-sm btn-outline-secondary" 
                                            onClick={() => openEditModal(question)}
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            className="btn btn-sm btn-outline-danger" 
                                            onClick={() => openDeleteModal(question)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };
    
    const renderModal = () => {
        if (!showModal) return null;
        
        const modalTitle = {
            'create': 'Create New Question',
            'edit': 'Edit Question',
            'delete': 'Delete Question'
        }[modalType];
        
        return (
            <div className="modal show d-block" tabIndex="-1">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{modalTitle}</h5>
                            <button type="button" className="btn-close" onClick={closeModal}></button>
                        </div>
                        <div className="modal-body">
                            {modalType === 'delete' ? (
                                <div className="text-center">
                                    <p>Are you sure you want to delete this question?</p>
                                    <p className="text-danger">This action cannot be undone.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="question" className="form-label">Question</label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            id="question" 
                                            value={questionText} 
                                            onChange={(e) => setQuestionText(e.target.value)}
                                            required 
                                        />
                                    </div>
                                    
                                    {options.map((option, index) => (
                                        <div className="mb-3" key={index}>
                                            <label htmlFor={`option${index + 1}`} className="form-label">
                                                Option {index + 1}
                                            </label>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                id={`option${index + 1}`} 
                                                value={option} 
                                                onChange={(e) => handleOptionChange(index, e.target.value)}
                                                required 
                                            />
                                        </div>
                                    ))}
                                    
                                    <div className="mb-3">
                                        <label className="form-label">Correct Answer(s)</label>
                                        <div className="border rounded p-3">
                                            <p className="text-muted small mb-2">Select one or more correct answers:</p>
                                            {options.map((option, index) => (
                                                <div className="form-check" key={index}>
                                                    <input 
                                                        className="form-check-input" 
                                                        type="checkbox" 
                                                        id={`correctAnswer${index + 1}`}
                                                        checked={correctAnswer.includes(index)}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setCorrectAnswer([...correctAnswer, index]);
                                                            } else {
                                                                setCorrectAnswer(correctAnswer.filter(ans => ans !== index));
                                                            }
                                                        }}
                                                    />
                                                    <label className="form-check-label" htmlFor={`correctAnswer${index + 1}`}>
                                                        Option {index + 1}: {option || `(Empty option ${index + 1})`}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </form>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={closeModal}>
                                Cancel
                            </button>
                            {modalType === 'delete' ? (
                                <button type="button" className="btn btn-danger" onClick={handleDelete}>
                                    Delete
                                </button>
                            ) : (
                                <button type="button" className="btn btn-primary" onClick={handleSubmit}>
                                    {isEditing ? 'Update' : 'Create'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };
    
    return (
        <div className="container-fluid mt-3">
            {loading ? (
                <p className="text-center">Loading quiz data...</p>
            ) : error ? (
                <div className="alert alert-danger">{error}</div>
            ) : (
                <>
                    <div className="row mb-3">
                        <div className="col-12">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h1>Manage Questions</h1>
                                    <h4 className="text-muted">Quiz: {quiz?.title}</h4>
                                </div>
                                <div>
                                    <button 
                                        className="btn btn-secondary me-2" 
                                        onClick={() => navigate('/manage')}
                                    >
                                        Back to Quizzes
                                    </button>
                                    <button 
                                        className="btn btn-primary" 
                                        onClick={openCreateModal}
                                    >
                                        Create New Question
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {renderQuizQuestions()}
                    {renderModal()}
                </>
            )}
        </div>
    );
};

export default ManageQuestions;
