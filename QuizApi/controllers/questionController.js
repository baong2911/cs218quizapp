const Question = require('../model/Question');

exports.getAllQuestions = async (req, res) => {
    try {
        const { quizId } = req.query;
        
        const query = quizId ? { quizId } : {};
        
        const questions = await Question.find(query);
        const formattedQuestions = questions.map(q => ({
            id: q._id,
            question: q.question,
            option1: q.options[0],
            option2: q.options[1],
            option3: q.options[2],
            option4: q.options[3],
            ans: q.correctAnswer,
            quizId: q.quizId
        }));
        
        res.json({
            data: formattedQuestions,
            success: 1
        });
    } catch (err) {
        res.status(500).json({ error: "Server error", message: err.message });
    }
};


exports.getQuestionById = async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);
        
        if (!question) {
            return res.status(404).json({ success: 0, message: "Question not found" });
        }
        
        res.json({
            data: {
                id: question._id,
                question: question.question,
                options: question.options,
                correctAnswer: question.correctAnswer
            },
            success: 1
        });
    } catch (err) {
        res.status(500).json({ error: "Server error", message: err.message });
    }
};


exports.createQuestion = async (req, res) => {
    try {
        const { question, options, correctAnswer } = req.body;
        

        if (!question || !options || options.length !== 4 || !correctAnswer || !Array.isArray(correctAnswer)) {
            return res.status(400).json({ 
                success: 0, 
                message: "Question, four options, and array of correct answers are required" 
            });
        }
        
      
        const validAnswers = correctAnswer.every(ans => Number.isInteger(ans) && ans >= 0 && ans < options.length);
        if (!validAnswers) {
            return res.status(400).json({
                success: 0,
                message: "All correct answer indexes must be valid integers between 0 and " + (options.length - 1)
            });
        }
        
        const newQuestion = new Question({
            question,
            options,
            correctAnswer
        });
        
        await newQuestion.save();
        
        res.status(201).json({
            data: {
                id: newQuestion._id,
                question: newQuestion.question,
                options: newQuestion.options,
                correctAnswer: newQuestion.correctAnswer
            },
            success: 1
        });
    } catch (err) {
        res.status(500).json({ error: "Server error", message: err.message });
    }
};

exports.updateQuestion = async (req, res) => {
    try {
        const { question, options, correctAnswer } = req.body;
        

        const updatedQuestion = await Question.findByIdAndUpdate(
            req.params.id,
            { question, options, correctAnswer },
            { new: true, runValidators: true }
        );
        
        if (!updatedQuestion) {
            return res.status(404).json({ success: 0, message: "Question not found" });
        }
        
        res.json({
            data: {
                id: updatedQuestion._id,
                question: updatedQuestion.question,
                options: updatedQuestion.options,
                correctAnswer: updatedQuestion.correctAnswer
            },
            success: 1
        });
    } catch (err) {
        res.status(500).json({ error: "Server error", message: err.message });
    }
};


exports.deleteQuestion = async (req, res) => {
    try {
        const question = await Question.findByIdAndDelete(req.params.id);
        
        if (!question) {
            return res.status(404).json({ success: 0, message: "Question not found" });
        }
        
        res.json({
            message: "Question deleted successfully",
            success: 1
        });
    } catch (err) {
        res.status(500).json({ error: "Server error", message: err.message });
    }
};
