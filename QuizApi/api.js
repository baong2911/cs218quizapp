require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const app = express();
const PORT = process.env.PORT || 5000;


const questionRoutes = require("./routes/questionRoutes");
const quizRoutes = require("./routes/quizRoutes");


app.use(cors());
app.use(express.json());
app.use(morgan("dev"));


mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB connection error:", err));


app.use("/api/questions", questionRoutes);
app.use("/api/quizzes", quizRoutes);


app.listen(PORT,"0.0.0.0", () => console.log(`🚀 Server running on port ${PORT}`));
