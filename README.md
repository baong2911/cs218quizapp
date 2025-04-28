# CS218 Quiz Application

- Develop by Bao H Nguyen.
- This repository contains a Quiz Application with a React frontend (QuizApp) and Node.js backend (QuizApi).

## Technologies Used

- NodeJs API
- React.js
- JavaScript
- CSS for styling
- Mongo DB

### QuizApp Implementation

- The QuizApp project is a React.js frontend that interacts with a backend API to manage and run quizzes.
- Users start on a StartPage where they select or begin a quiz.
- Quiz questions are fetched dynamically from the backend API using Axios (src/api/quiz.js).
- The Quiz component displays one question at a time, handles answer selection, tracks user scores locally in React states.
- After completing all questions, the ResultPage shows the final score.
- Admin panels (ManageQuizzes, ManageQuestions) allow creation and editing of quizzes and questions.
- CRUD link: https://baohnguyencs218sjsu.com/manage
- The project uses CSS Modules for component-specific styles.
- Sensitive information (e.g., API base URLs) are handled via environment variables (.env file).
- The system follows a modular, API-driven design that supports easy scaling, extension, and secure deployment.

#### API Documentation

Below is a comprehensive list of all API endpoints available in the QuizApi service:

##### Question APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/questions | Get all questions. Can filter by quizId using query parameter ?quizId=xyz |
| GET | /api/questions/:id | Get a specific question by ID |
| POST | /api/questions | Create a new question with question text, options array, and correctAnswer array |
| PUT | /api/questions/:id | Update an existing question by ID |
| DELETE | /api/questions/:id | Delete a question by ID |

##### Quiz APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/quizzes | Get all quizzes with their questions |
| GET | /api/quizzes/random | Get a random quiz. Can exclude a specific quiz with ?quizId=xyz |
| GET | /api/quizzes/:id | Get a specific quiz by ID with its questions |
| POST | /api/quizzes | Create a new quiz with title, description, and optional questions array |
| PUT | /api/quizzes/:id | Update an existing quiz by ID |
| DELETE | /api/quizzes/:id | Delete a quiz by ID |
| POST | /api/quizzes/:id/questions | Add a question to a quiz (requires questionId in request body) |
| DELETE | /api/quizzes/:id/questions/:questionId | Remove a question from a quiz |
| POST | /api/quizzes/submit | Submit quiz results with playerName, score, and userAnswers |

##### CI/CD

- Build image from Dockerfile and then push image to DockerHub.
