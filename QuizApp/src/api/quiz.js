import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";


const getQuestion = async () =>{
    return axios.get(`${API_URL}/api/questions`)
    .then(response => {
        return response.data["data"]
    })
    .catch(error => console.error("Error fetching questions:", error));
}

const submitQuiz = async (playerName, score, userAnswers) => {
    axios.post(`${API_URL}/api/submit`, { 
        playerName, 
        score, 
        userAnswers 
    })
    .then(response => {
        console.log("Submitted successfully:", response.data);
    })
    .catch(error => console.error("Error submitting quiz:", error));
};

export { getQuestion, submitQuiz };