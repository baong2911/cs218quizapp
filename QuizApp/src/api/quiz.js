import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

// Question APIs
const getQuestion = async () => {
    return axios.get(`${API_URL}/api/questions`)
    .then(response => {
        return response.data["data"]
    })
    .catch(error => console.error("Error fetching questions:", error));
}

const submitQuiz = async (playerName, score, userAnswers) => {
    axios.post(`${API_URL}/api/quizzes/submit`, { 
        playerName, 
        score, 
        userAnswers 
    })
    .then(response => {
        console.log("Submitted successfully:", response.data);
    })
    .catch(error => console.error("Error submitting quiz:", error));
};

// Quiz Management APIs
const getAllQuizzes = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/quizzes`);
        return response.data.data;
    } catch (error) {
        console.error("Error fetching quizzes:", error);
        throw error;
    }
};

const getQuizById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/api/quizzes/${id}`);
        return response.data.data;
    } catch (error) {
        console.error(`Error fetching quiz with id ${id}:`, error);
        throw error;
    }
};

const createQuiz = async (quizData) => {
    try {
        const response = await axios.post(`${API_URL}/api/quizzes`, quizData);
        return response.data.data;
    } catch (error) {
        console.error("Error creating quiz:", error);
        throw error;
    }
};

const updateQuiz = async (id, quizData) => {
    try {
        const response = await axios.put(`${API_URL}/api/quizzes/${id}`, quizData);
        return response.data.data;
    } catch (error) {
        console.error(`Error updating quiz with id ${id}:`, error);
        throw error;
    }
};

const deleteQuiz = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/api/quizzes/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting quiz with id ${id}:`, error);
        throw error;
    }
};

const addQuestionToQuiz = async (quizId, questionId) => {
    try {
        const response = await axios.post(`${API_URL}/api/quizzes/${quizId}/questions`, { questionId });
        return response.data.data;
    } catch (error) {
        console.error(`Error adding question to quiz ${quizId}:`, error);
        throw error;
    }
};

const removeQuestionFromQuiz = async (quizId, questionId) => {
    try {
        const response = await axios.delete(`${API_URL}/api/quizzes/${quizId}/questions/${questionId}`);
        return response.data.data;
    } catch (error) {
        console.error(`Error removing question from quiz ${quizId}:`, error);
        throw error;
    }
};

// Question CRUD Operations
const getAllQuestions = async (quizId = null) => {
    try {
        const url = quizId 
            ? `${API_URL}/api/questions?quizId=${quizId}`
            : `${API_URL}/api/questions`;
        const response = await axios.get(url);
        return response.data.data;
    } catch (error) {
        console.error("Error fetching questions:", error);
        throw error;
    }
};

const getQuestionById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/api/questions/${id}`);
        return response.data.data;
    } catch (error) {
        console.error(`Error fetching question with id ${id}:`, error);
        throw error;
    }
};

const createQuestion = async (questionData) => {
    try {
        const response = await axios.post(`${API_URL}/api/questions`, questionData);
        return response.data.data;
    } catch (error) {
        console.error("Error creating question:", error);
        throw error;
    }
};

const updateQuestion = async (id, questionData) => {
    try {
        const response = await axios.put(`${API_URL}/api/questions/${id}`, questionData);
        return response.data.data;
    } catch (error) {
        console.error(`Error updating question with id ${id}:`, error);
        throw error;
    }
};

const deleteQuestion = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/api/questions/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting question with id ${id}:`, error);
        throw error;
    }
};

const getRandomQuiz = async (excludeQuizId = null) => {
    try {
        let url = `${API_URL}/api/quizzes/random`;
        if (excludeQuizId) {
            url += `?quizId=${excludeQuizId}`;
        }
        const response = await axios.get(url);
        return response.data.data;
    } catch (error) {
        console.error("Error fetching random quiz:", error);
        throw error;
    }
};

export { 
    getQuestion, 
    submitQuiz, 
    getAllQuizzes, 
    getQuizById, 
    createQuiz, 
    updateQuiz, 
    deleteQuiz,
    addQuestionToQuiz,
    removeQuestionFromQuiz,
    getAllQuestions,
    getQuestionById,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    getRandomQuiz
};