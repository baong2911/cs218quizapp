const mongoose = require("mongoose");


const HistorySchema = new mongoose.Schema({
    playerName: String,
    score: Number,
    userAnswers: [
        {
            question: String,
            userAnswer: String,
            isCorect: Boolean
        }
    ]
});

module.exports = mongoose.model('History', HistorySchema);
