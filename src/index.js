import express from 'express';
import cors from 'cors'; // ✅ import cors
import { articles } from "./data.js";

const app = express();
const PORT = 3000;

app.use(cors()); // ✅ enable CORS
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.json({ message: 'HelloBhau' });
});

app.get('/articles', (req, res) => {
    res.json({ data: articles });
});

app.get('/articles/:id', (req, res) => {
    const articleId = parseInt(req.params.id, 10);
    const article = articles.find(article => article.id === articleId);
    if (article) {
        res.json({ data: article });
    } else {
        res.status(404).json({ Error: "Nothing Found" });
    }
});

app.post('/articles', (req, res) => {
    const { title, slug, content, excerpt, author, category, tags, image, publishedAt, isFeatured } = req.body;
    const { name, bio, profilePicture } = author;
    const newArticle = {
        id: articles.length + 1,
        title,
        slug,
        content,
        excerpt,
        author: {
            id: articles.length + 100,
            name,
            bio,
            profilePicture
        },
        category,
        tags,
        image,
        publishedAt,
        isFeatured
    };
    articles.push(newArticle);
    res.json({ data: newArticle });
});

app.put('/articles/:id', (req, res) => {
    const articleId = parseInt(req.params.id, 10);
    const articleIndex = articles.findIndex(a => a.id === articleId);
    if (articleIndex !== -1) {
        articles[articleIndex].title = req.body.title;
        res.json(articles[articleIndex]);
    } else {
        res.status(400).json({ error: "Article not found" });
    }
});

app.delete('/articles/:id', (req, res) => {
    const articleId = parseInt(req.params.id, 10);
    const articleIndex = articles.findIndex(a => a.id === articleId);
    if (articleIndex !== -1) {
        articles.splice(articleIndex, 1);
        res.status(204).json({ data: { id: articleId } });
    } else {
        res.status(400).json({ error: "Article not found" });
    }
});

app.use((req, res) => {
    res.status(404).json({ Error: 'Nothing Found' });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
