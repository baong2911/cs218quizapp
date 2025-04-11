import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./StartPage.css";

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
        <div className="start-page">
            <h1 style={{color:"#99FFFF"}}><b><i>Welcome to Quiz Website<br/> developed by <br/>Bao H. Nguyen</i></b></h1>
            <input
				style={{ width: "300px" }}
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
