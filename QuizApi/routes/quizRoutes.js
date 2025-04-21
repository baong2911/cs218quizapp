const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');

router.get('/', quizController.getAllQuizzes);

router.get('/random', quizController.getRandomQuiz);

router.get('/:id', quizController.getQuizById);

router.post('/', quizController.createQuiz);

router.put('/:id', quizController.updateQuiz);

router.delete('/:id', quizController.deleteQuiz);

router.post('/:id/questions', quizController.addQuestionToQuiz);

router.delete('/:id/questions/:questionId', quizController.removeQuestionFromQuiz);

router.post('/submit', quizController.submitQuizResult);

module.exports = router;
