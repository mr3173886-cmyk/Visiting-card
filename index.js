const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));


app.get('/api/files', (req, res) => {
    const publicPath = path.join(__dirname, 'public');
    fs.readdir(publicPath, (err, files) => {
        if (err) return res.status(500).json({ error: "Error reading folder" });
       
        const htmlFiles = files.filter(file => file.endsWith('.html') && file !== 'index.html');
        res.json(htmlFiles);
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

