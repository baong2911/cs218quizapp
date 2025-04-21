import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    getAllQuizzes, 
    getQuizById, 
    createQuiz, 
    updateQuiz, 
    deleteQuiz,
    addQuestionToQuiz,
    removeQuestionFromQuiz 
} from '../api/quiz';

const ManageQuizzes = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    
    // Form states
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    
    // Modal states
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState(''); // 'create', 'edit', 'view', 'delete'

    // Function to fetch all quizzes
    const fetchQuizzes = async () => {
        setLoading(true);
        try {
            const data = await getAllQuizzes();
            setQuizzes(data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch quizzes');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuizzes();
    }, []);

    const resetForm = () => {
        setSelectedQuiz(null);
        setTitle('');
        setDescription('');
        setIsEditing(false);
    };

    const openCreateModal = () => {
        resetForm();
        setModalType('create');
        setShowModal(true);
    };

    const openEditModal = (quiz) => {
        setSelectedQuiz(quiz);
        setTitle(quiz.title);
        setDescription(quiz.description || '');
        setIsEditing(true);
        setModalType('edit');
        setShowModal(true);
    };

    // Open modal for viewing a quiz
    const openViewModal = async (quiz) => {
        try {
            const detailedQuiz = await getQuizById(quiz._id);
            setSelectedQuiz(detailedQuiz);
            setModalType('view');
            setShowModal(true);
        } catch (err) {
            setError(`Failed to fetch quiz details for "${quiz.title}"`);
            console.error(err);
        }
    };

    // Open modal for confirming quiz deletion
    const openDeleteModal = (quiz) => {
        setSelectedQuiz(quiz);
        setModalType('delete');
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        resetForm();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const quizData = {
            title,
            description
        };
        
        try {
            if (isEditing && selectedQuiz) {
                await updateQuiz(selectedQuiz._id, quizData);
            } else {
                await createQuiz(quizData);
            }
            
            closeModal();
            fetchQuizzes();
        } catch (err) {
            setError(`Failed to ${isEditing ? 'update' : 'create'} quiz`);
            console.error(err);
        }
    };

    const handleDelete = async () => {
        if (!selectedQuiz) return;
        
        try {
            await deleteQuiz(selectedQuiz._id);
            closeModal();
            fetchQuizzes();
        } catch (err) {
            setError(`Failed to delete quiz "${selectedQuiz.title}"`);
            console.error(err);
        }
    };

    const renderQuizzes = () => {
        if (loading) return <p className="text-center">Loading quizzes...</p>;
        if (error) return <p className="text-center text-danger">{error}</p>;
        if (quizzes.length === 0) return <p className="text-center">No quizzes found. Create your first quiz!</p>;

        return (
            <div className="table-responsive">
                <table className="table table-hover table-striped">
                    <thead className="table-dark">
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Title</th>
                            <th scope="col">Description</th>
                            <th scope="col">Questions</th>
                            <th scope="col">Last Updated</th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {quizzes.map((quiz, index) => (
                            <tr key={quiz._id}>
                                <td>{index + 1}</td>
                                <td>{quiz.title}</td>
                                <td>{quiz.description || 'No description'}</td>
                                <td>{quiz.questions ? quiz.questions.length : 0}</td>
                                <td>{quiz.updatedAt ? new Date(quiz.updatedAt).toLocaleDateString() : 'N/A'}</td>
                                <td>
                                    <div className="btn-group">
                                        <button 
                                            className="btn btn-sm btn-outline-primary" 
                                            onClick={() => openViewModal(quiz)}
                                        >
                                            View
                                        </button>
                                        <button 
                                            className="btn btn-sm btn-outline-secondary" 
                                            onClick={() => openEditModal(quiz)}
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            className="btn btn-sm btn-outline-danger" 
                                            onClick={() => openDeleteModal(quiz)}
                                        >
                                            Delete
                                        </button>
                                        <button 
                                            className="btn btn-sm btn-outline-info" 
                                            onClick={() => navigate(`/manage-questions/${quiz._id}`)}
                                        >
                                            Manage Questions
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
            'create': 'Create New Quiz',
            'edit': 'Edit Quiz',
            'view': selectedQuiz ? `Quiz: ${selectedQuiz.title}` : 'Quiz Details',
            'delete': 'Delete Quiz'
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
                                    <p>Are you sure you want to delete the quiz "{selectedQuiz?.title}"?</p>
                                    <p className="text-danger">This action cannot be undone.</p>
                                </div>
                            ) : modalType === 'view' ? (
                                <>
                                    <div className="mb-4">
                                        <h4>{selectedQuiz?.title}</h4>
                                        <p>{selectedQuiz?.description || 'No description'}</p>
                                        <p><small className="text-muted">Created: {new Date(selectedQuiz?.createdAt).toLocaleString()}</small></p>
                                        <p><small className="text-muted">Last Updated: {new Date(selectedQuiz?.updatedAt).toLocaleString()}</small></p>
                                    </div>
                                    <div>
                                        <h5>Questions ({selectedQuiz?.questions?.length || 0})</h5>
                                        {selectedQuiz?.questions?.length > 0 ? (
                                            <ul className="list-group">
                                                {selectedQuiz.questions.map((question, index) => (
                                                    <li key={question._id} className="list-group-item">
                                                        <strong>{index + 1}. {question.question}</strong>
                                                        <ul className="mt-2 list-unstyled">
                                                            {question.options?.map((option, i) => (
                                                                <li key={i} className={`small ${i+1 === question.correctAnswer ? 'text-success fw-bold' : ''}`}>
                                                                    {i+1 === question.correctAnswer ? '✓ ' : ''}
                                                                    {option}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-muted">This quiz has no questions yet.</p>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="title" className="form-label">Title</label>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            id="title" 
                                            value={title} 
                                            onChange={(e) => setTitle(e.target.value)}
                                            required 
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="description" className="form-label">Description</label>
                                        <textarea 
                                            className="form-control" 
                                            id="description" 
                                            rows="3" 
                                            value={description} 
                                            onChange={(e) => setDescription(e.target.value)}
                                        ></textarea>
                                    </div>
                                </form>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={closeModal}>
                                {modalType === 'view' ? 'Close' : 'Cancel'}
                            </button>
                            {modalType === 'delete' ? (
                                <button type="button" className="btn btn-danger" onClick={handleDelete}>
                                    Delete
                                </button>
                            ) : modalType !== 'view' ? (
                                <button type="button" className="btn btn-primary" onClick={handleSubmit}>
                                    {isEditing ? 'Update' : 'Create'}
                                </button>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="container-fluid mt-3">
            <div className="row mb-3">
                <div className="col-12">
                    <div className="d-flex justify-content-between align-items-center">
                        <h1>Manage Quizzes</h1>
                        <button className="btn btn-primary" onClick={openCreateModal}>
                            Create New Quiz
                        </button>
                    </div>
                </div>
            </div>
            
            {renderQuizzes()}
            {renderModal()}
        </div>
    );
};

export default ManageQuizzes;
