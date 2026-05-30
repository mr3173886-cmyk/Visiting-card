const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// এক্সপ্রেস বডি পার্সার এবং স্ট্যাটিক ফোল্ডার সেটআপ
app.use(express.json());
app.use(express.static('public'));

// ================= [ MONGODB CONNECTION ] =================
const mongoURI = "mongodb+srv://mr3173886_db_user:Monikaamydarling12@cluster0.ozx9rai.mongodb.net/?appName=Cluster0";

mongoose.connect(mongoURI)
    .then(() => console.log("🔥 MongoDB Connected Successfully!"))
    .catch(err => console.error("❌ MongoDB Connection Error:", err));

// মঙ্গোডিবি ভিডিও স্কিমা ও মডেল
const VideoSchema = new mongoose.Schema({
    link: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});
const Video = mongoose.model('Video', VideoSchema);

// ================= [ WEB PANEL API ROUTES ] =================

// ১. সমস্ত ভিডিও লিংক ডাটাবেজ থেকে নিয়ে আসার API
app.get('/api/videos', async (req, res) => {
    try {
        const videos = await Video.find().sort({ createdAt: -1 });
        res.json(videos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ২. নতুন ক্যাটবক্স ভিডিও লিংক মঙ্গোডিবিতে সেভ করার API
app.post('/api/videos', async (req, res) => {
    const { link } = req.body;
    if (!link) return res.status(400).json({ error: "Link is required" });

    try {
        const newVideo = new Video({ link });
        await newVideo.save();
        res.json({ success: true, message: "Link added to MongoDB!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ৩. মঙ্গোডিবির ইউনিক _id ধরে লিংক ডিলিট করার API
app.delete('/api/videos/:id', async (req, res) => {
    try {
        await Video.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Link deleted from MongoDB!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ================= [ SERVER PORT LISTENER ] =================
app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
});
