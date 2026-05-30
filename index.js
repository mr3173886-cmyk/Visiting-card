const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// ১. আপনার আগের স্ট্যাটিক ফোল্ডার ও এক্সপ্রেস বডি পার্সার (লিংক রিড করার জন্য)
app.use(express.json());
app.use(express.static('public'));

// ২. ভিডিও লিংক লোকাল ফাইলে জমা রাখার পাথ সেটআপ
const jsonPath = path.join(__dirname, 'videos.json');

// ভিডিও ডাটা ফাইলটি সার্ভারে না থাকলে স্বয়ংক্রিয়ভাবে তৈরি করার লজিক
if (!fs.existsSync(jsonPath)) {
    fs.writeFileSync(jsonPath, JSON.stringify([]));
}

// ================= [ আপনার আগের কোড - একদম সেম রাখা হলো ] =================

app.get('/api/files', (req, res) => {
    const publicPath = path.join(__dirname, 'public');
    fs.readdir(publicPath, (err, files) => {
        if (err) return res.status(500).json({ error: "Error reading folder" });
       
        const htmlFiles = files.filter(file => file.endsWith('.html') && file !== 'index.html');
        res.json(htmlFiles);
    });
});

// ================= [ নতুন ফিচার: ভিডিও ম্যানেজার এপিআই ] =================

// ৩. সমস্ত ভিডিও লিংকের লিস্ট দেখার API (গোটবট ও vid.html এর জন্য)
app.get('/api/videos', (req, res) => {
    fs.readFile(jsonPath, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: "Error reading data" });
        res.json(JSON.parse(data || "[]"));
    });
});

// ৪. নতুন ক্যাটবক্স ভিডিও লিংক অ্যাড করার API
app.post('/api/videos', (req, res) => {
    const { link } = req.body;
    if (!link) return res.status(400).json({ error: "Link is required" });

    fs.readFile(jsonPath, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: "Error reading data" });
        
        const videos = JSON.parse(data || "[]");
        
        // ডিলিট করার সুবিধার জন্য প্রতিটি লিংকে ইউনিক আইডি দেওয়া হচ্ছে
        const newVideo = {
            id: Date.now().toString(),
            link: link,
            createdAt: new Date()
        };
        
        videos.unshift(newVideo); // নতুন লিংকটি লিস্টের সবার উপরে দেখাবে
        
        fs.writeFile(jsonPath, JSON.stringify(videos, null, 2), (err) => {
            if (err) return res.status(500).json({ error: "Error saving link" });
            res.json({ success: true, message: "Link added successfully!" });
        });
    });
});

// ৫. আইডি ধরে লিস্ট থেকে নির্দিষ্ট লিংক ডিলিট করার API
app.delete('/api/videos/:id', (req, res) => {
    const id = req.params.id;
    
    fs.readFile(jsonPath, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: "Error reading data" });
        
        let videos = JSON.parse(data || "[]");
        videos = videos.filter(video => video.id !== id); // আইডি বাদে বাকিগুলো রেখে ফিল্টার
        
        fs.writeFile(jsonPath, JSON.stringify(videos, null, 2), (err) => {
            if (err) return res.status(500).json({ error: "Error deleting link" });
            res.json({ success: true, message: "Link deleted successfully!" });
        });
    });
});

// ================= [ আপনার আগের পোর্ট লিসেনার ] =================

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
