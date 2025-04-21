const Quiz = require('../model/Quiz');
const Question = require('../model/Question');


exports.getAllQuizzes = async (req, res) => {
    try {
        const quizzes = await Quiz.find().populate('questions');
        res.json({
            data: quizzes,
            success: 1
        });
    } catch (err) {
        res.status(500).json({ error: "Server error", message: err.message });
    }
};

exports.getQuizById = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id).populate('questions');
        
        if (!quiz) {
            return res.status(404).json({ success: 0, message: "Quiz not found" });
        }
        
        res.json({
            data: quiz,
            success: 1
        });
    } catch (err) {
        res.status(500).json({ error: "Server error", message: err.message });
    }
};


exports.createQuiz = async (req, res) => {
    try {
        const { title, description, questions } = req.body;
        
  
        if (!title) {
            return res.status(400).json({ 
                success: 0, 
                message: "Quiz title is required" 
            });
        }
        
        const newQuiz = new Quiz({
            title,
            description,
            questions: questions || []
        });
        
        await newQuiz.save();
        
        res.status(201).json({
            data: newQuiz,
            success: 1
        });
    } catch (err) {
        res.status(500).json({ error: "Server error", message: err.message });
    }
};


exports.updateQuiz = async (req, res) => {
    try {
        const { title, description, questions } = req.body;
        

        const updatedQuiz = await Quiz.findByIdAndUpdate(
            req.params.id,
            { 
                title, 
                description, 
                questions,
                updatedAt: Date.now()
            },
            { new: true, runValidators: true }
        );
        
        if (!updatedQuiz) {
            return res.status(404).json({ success: 0, message: "Quiz not found" });
        }
        
        res.json({
            data: updatedQuiz,
            success: 1
        });
    } catch (err) {
        res.status(500).json({ error: "Server error", message: err.message });
    }
};


exports.deleteQuiz = async (req, res) => {
    try {
        const quiz = await Quiz.findByIdAndDelete(req.params.id);
        
        if (!quiz) {
            return res.status(404).json({ success: 0, message: "Quiz not found" });
        }
        
        res.json({
            message: "Quiz deleted successfully",
            success: 1
        });
    } catch (err) {
        res.status(500).json({ error: "Server error", message: err.message });
    }
};


exports.addQuestionToQuiz = async (req, res) => {
    try {
        const { questionId } = req.body;
        

        if (!questionId) {
            return res.status(400).json({ 
                success: 0, 
                message: "Question ID is required" 
            });
        }
        

        const questionExists = await Question.findById(questionId);
        if (!questionExists) {
            return res.status(404).json({ 
                success: 0, 
                message: "Question not found" 
            });
        }
        
        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) {
            return res.status(404).json({ 
                success: 0, 
                message: "Quiz not found" 
            });
        }
        

        if (!quiz.questions.includes(questionId)) {
            quiz.questions.push(questionId);
            quiz.updatedAt = Date.now();
            await quiz.save();
        }
        
        res.json({
            data: quiz,
            success: 1
        });
    } catch (err) {
        res.status(500).json({ error: "Server error", message: err.message });
    }
};


exports.removeQuestionFromQuiz = async (req, res) => {
    try {
        const { questionId } = req.params;
        
        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) {
            return res.status(404).json({ 
                success: 0, 
                message: "Quiz not found" 
            });
        }
        

        quiz.questions = quiz.questions.filter(q => q.toString() !== questionId);
        quiz.updatedAt = Date.now();
        await quiz.save();
        
        res.json({
            data: quiz,
            success: 1
        });
    } catch (err) {
        res.status(500).json({ error: "Server error", message: err.message });
    }
};


exports.submitQuizResult = async (req, res) => {
    try {
        const { playerName, score, userAnswers } = req.body;
        const History = require('../model/History');
        const newResult = new History({ playerName, score, userAnswers });
        await newResult.save();
        res.json({
            success: 1
        });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
};


exports.getRandomQuiz = async (req, res) => {
    try {

        const excludeQuizId = req.query.quizId;
        

        let filter = {};
        if (excludeQuizId) {
            filter = { _id: { $ne: excludeQuizId } };
        }
        
        const count = await Quiz.countDocuments(filter);
        
        if (count === 0) {
            return res.status(404).json({ 
                success: 0, 
                message: excludeQuizId 
                    ? "No other quizzes found" 
                    : "No quizzes found"
            });
        }
        

        const random = Math.floor(Math.random() * count);
        

        const randomQuiz = await Quiz.find(filter).skip(random).limit(1).populate('questions');
        
        if (!randomQuiz || randomQuiz.length === 0) {
            return res.status(404).json({ 
                success: 0, 
                message: "Quiz not found" 
            });
        }
        
        res.json({
            data: randomQuiz[0],
            success: 1
        });
    } catch (err) {
        res.status(500).json({ error: "Server error", message: err.message });
    }
};
