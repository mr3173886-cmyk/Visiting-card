const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// ================= [ FULL MONGODB CONNECTION ] =================
const mongoURI = "mongodb+srv://mr3173886_db_user:RoniNewPass123@cluster0.ozx9rai.mongodb.net/Missqueenbot?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(mongoURI)
    .then(() => console.log("🔥 MongoDB Connected Successfully!"))
    .catch(err => console.error("❌ MongoDB Connection Error:", err));

// স্কিমা ও মডেল
const VideoSchema = new mongoose.Schema({
    link: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});
const Video = mongoose.model('Video', VideoSchema);

// ================= [ API ROUTES ] =================
app.get('/api/videos', async (req, res) => {
    try {
        const videos = await Video.find().sort({ createdAt: -1 });
        res.json(videos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/videos', async (req, res) => {
    const { link } = req.body;
    if (!link) return res.status(400).json({ error: "Link is required" });
    try {
        const newVideo = new Video({ link });
        await newVideo.save();
        res.json({ success: true, message: "Link added!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/videos/:id', async (req, res) => {
    try {
        await Video.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Deleted!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/', (req, res) => {
    res.send("Server is running perfectly!");
});

app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
});
