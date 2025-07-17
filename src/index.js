import express from 'express';
import { articles } from "./data.js"; // ✅ fixed

const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
    res.json({ message: 'HelloBhau' });
});

app.get('/articles', (req, res) => {
    res.json({ data: articles });
});
app.get('/articles/:id', (req, res) => {
    const articleId = parseInt(req.params.id, 10)
    const article = articles.find(article => article.id === articleId)
    if (article) {
        res.json({ daat: article })
    } else {
        res.status(404).json({ Error: "Nothing Found" })
    }
});

// app.post('/articles', express.json(), (req, res) => {

// })

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

