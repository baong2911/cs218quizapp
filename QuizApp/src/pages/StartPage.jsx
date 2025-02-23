import { useState } from "react";
import { useNavigate } from "react-router-dom";

const StartPage = () => {
    const [name, setName] = useState("");
    const navigate = useNavigate();

    const startQuiz = () => {
        if (name.trim() !== "") {
            localStorage.setItem("playerName", name); // Lưu tên vào localStorage
            navigate("/quiz");
        }
    };


    return (
        <div>
            <h1>Welcome to Quiz <br/> develope <br/> by <br/>Bao H Nguyen</h1>
            <input
                type="text"
                className="form-control mb-3"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <button className="btn btn-success w-100" onClick={startQuiz}>Start Quiz</button>

        </div>
    );
};

export default StartPage;
