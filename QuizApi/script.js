require("dotenv").config();
const mongoose = require("mongoose");
const Question = require("./model/Question");
const data = require("./sample.json");

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB connection error:", err));



// Thêm dữ liệu vào MongoDB
const insertQuestions = async () => {
    try {
        await Question.deleteMany(); // Xóa dữ liệu cũ (nếu cần)
        await Question.insertMany(data);
        console.log("✅ Questions inserted successfully!");
    } catch (err) {
        console.error("❌ Error inserting questions:", err);
    } finally {
        mongoose.connection.close();
    }
};

insertQuestions();
