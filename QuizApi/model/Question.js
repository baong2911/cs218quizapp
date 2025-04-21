const mongoose = require("mongoose");


const QuestionSchema = new mongoose.Schema({
    question: String,
    options: [String],
    correctAnswer: [Number],
    quizId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz',
        default: null
    }
});

module.exports = mongoose.model('Question', QuestionSchema);
