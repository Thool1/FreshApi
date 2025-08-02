import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Article from './models/Article.js'; // MongoDB model

dotenv.config(); // Load .env file

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('✅ Connected to MongoDB Atlas'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

// Home route
app.get('/', (req, res) => {
    res.json({ message: 'HelloBhau' });
});

// ✅ GET all articles - Newest first
app.get('/articles', async (req, res) => {
    try {
        const articles = await Article.find().sort({ createdAt: -1 });
        res.json({ data: articles });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch articles' });
    }
});

// ✅ GET editor-picked articles
app.get('/editors-pick', async (req, res) => {
    try {
        const editorsPicks = await Article.find({ isEditorsPick: true })
            .sort({ createdAt: -1 })
            .limit(3)
        res.json({ data: editorsPicks });
    } catch (error) {
        console.error('Failed to fetch editor-picked articles:', error);
        res.status(500).json({ error: 'Failed to fetch editor-picked articles' });
    }
});

// ✅ GET trending articles (isTrending: true)
app.get('/trending', async (req, res) => {
    try {
        const trendingArticles = await Article.find({ isTrending: true }).sort({ createdAt: -1 });
        res.json({ data: trendingArticles });
    } catch (error) {
        console.error('Failed to fetch trending articles:', error);
        res.status(500).json({ error: 'Failed to fetch trending articles' });
    }
});

// ✅ GET sports articles (category: "Sports")
app.get('/sports', async (req, res) => {
    try {
        const sportsArticles = await Article.find({ category: 'Sports' }).sort({ createdAt: -1 });
        res.json({ data: sportsArticles });
    } catch (error) {
        console.error('Failed to fetch sports articles:', error);
        res.status(500).json({ error: 'Failed to fetch sports articles' });
    }
});

// ✅ GET magazine articles (category: "Magazine")
app.get('/magazine', async (req, res) => {
    try {
        const magazineArticles = await Article.find({ category: 'Magazine' }).sort({ createdAt: -1 });
        res.json({ data: magazineArticles });
    } catch (error) {
        console.error('Failed to fetch magazine articles:', error);
        res.status(500).json({ error: 'Failed to fetch magazine articles' });
    }
});

// ✅ GET entertainment articles (category: "Entertainment")
app.get('/entertainment', async (req, res) => {
    try {
        const entertainmentArticles = await Article.find({ category: 'Entertainment' }).sort({ createdAt: -1 });
        res.json({ data: entertainmentArticles });
    } catch (error) {
        console.error('Failed to fetch entertainment articles:', error);
        res.status(500).json({ error: 'Failed to fetch entertainment articles' });
    }
});

// ✅ GET best of articles (bestOf: true, limit 5)
app.get('/bestof', async (req, res) => {
    try {
        const bestOfArticles = await Article.find({ bestOf: true })
            .sort({ createdAt: -1 })
            .limit(5);
        res.json({ data: bestOfArticles });
    } catch (error) {
        console.error('Failed to fetch best of articles:', error);
        res.status(500).json({ error: 'Failed to fetch best of articles' });
    }
});

// ✅ GET single article by ID
app.get('/articles/:id', async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        if (article) {
            res.json({ data: article });
        } else {
            res.status(404).json({ error: 'Article not found' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch article' });
    }
});

// ✅ POST new article
app.post('/articles', async (req, res) => {
    try {
        const newArticle = new Article(req.body);
        await newArticle.save();
        res.status(201).json({ data: newArticle });
    } catch (err) {
        res.status(400).json({ error: 'Failed to create article' });
    }
});

// ✅ PUT (update) article by ID
app.put('/articles/:id', async (req, res) => {
    try {
        const updatedArticle = await Article.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (updatedArticle) {
            res.json({ data: updatedArticle });
        } else {
            res.status(404).json({ error: 'Article not found' });
        }
    } catch (err) {
        res.status(400).json({ error: 'Failed to update article' });
    }
});

// ✅ PATCH (partial update) article by ID
app.patch('/articles/:id', async (req, res) => {
    try {
        const updatedArticle = await Article.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        if (updatedArticle) {
            res.json({ data: updatedArticle });
        } else {
            res.status(404).json({ error: 'Article not found' });
        }
    } catch (err) {
        res.status(400).json({ error: 'Failed to update article' });
    }
});

// ✅ DELETE article by ID
app.delete('/articles/:id', async (req, res) => {
    try {
        const deletedArticle = await Article.findByIdAndDelete(req.params.id);
        if (deletedArticle) {
            res.status(204).end(); // 204: No Content
        } else {
            res.status(404).json({ error: 'Article not found' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete article' });
    }
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Nothing Found' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
