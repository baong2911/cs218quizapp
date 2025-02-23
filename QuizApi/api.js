require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const app = express();
const PORT = process.env.PORT || 5000;

const Question = require("./model/Question");
const History = require("./model/History");

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB connection error:", err));



app.get("/api/questions", async (req, res) => {
    try {
        const questions = await Question.find();
        let data = questions.map(i=>{
            return {
                question: i.question,
                option1: i.options[0],
                option2: i.options[1],
                option3: i.options[2],
                option4: i.options[3],
                ans: i.correctAnswer
            }
        })
        res.json({
            data: data,
            success: 1
        });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});


app.post("/api/submit", async (req, res) => {
    try {
        const { playerName, score, userAnswers } = req.body;
        const newResult = new History({ playerName, score, userAnswers });
        await newResult.save();
        res.json({
            success: 1
        });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

// Khởi động server
app.listen(PORT,"0.0.0.0", () => console.log(`🚀 Server running on port ${PORT}`));
