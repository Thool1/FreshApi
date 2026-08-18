import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Article from './models/Article.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '1mb' }));

if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not set in .env');
}

// Simple in-memory rate limiter for write operations.
// This intentionally avoids adding another dependency and protects the public
// mutation endpoints from accidental or abusive request bursts.
const rateLimitStore = new Map();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX_WRITES = 30;

const writeRateLimiter = (req, res, next) => {
    const key = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const current = rateLimitStore.get(key);

    if (!current || now - current.startedAt >= RATE_LIMIT_WINDOW_MS) {
        rateLimitStore.set(key, { startedAt: now, count: 1 });
        return next();
    }

    if (current.count >= RATE_LIMIT_MAX_WRITES) {
        const retryAfter = Math.ceil((RATE_LIMIT_WINDOW_MS - (now - current.startedAt)) / 1000);
        res.set('Retry-After', String(retryAfter));
        return res.status(429).json({ error: 'Too many write requests. Please try again later.' });
    }

    current.count += 1;
    return next();
};

const getPagination = (req) => {
    const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 20, 1), 100);
    return { page, limit, skip: (page - 1) * limit };
};

const sendPaginatedArticles = async (res, filter, page, limit, skip) => {
    const [articles, total] = await Promise.all([
        Article.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
        Article.countDocuments(filter)
    ]);

    res.json({
        data: articles,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    });
};

app.get('/', (req, res) => {
    res.json({ message: 'HelloBhau' });
});

app.get('/articles', async (req, res) => {
    try {
        const { page, limit, skip } = getPagination(req);
        await sendPaginatedArticles(res, {}, page, limit, skip);
    } catch (error) {
        console.error('Failed to fetch articles:', error);
        res.status(500).json({ error: 'Failed to fetch articles' });
    }
});

app.get('/editors-pick', async (req, res) => {
    try {
        const { page, limit, skip } = getPagination(req);
        await sendPaginatedArticles(res, { isEditorsPick: true }, page, limit, skip);
    } catch (error) {
        console.error('Failed to fetch editor-picked articles:', error);
        res.status(500).json({ error: 'Failed to fetch editor-picked articles' });
    }
});

app.get('/trending', async (req, res) => {
    try {
        const { page, limit, skip } = getPagination(req);
        await sendPaginatedArticles(res, { isTrending: true }, page, limit, skip);
    } catch (error) {
        console.error('Failed to fetch trending articles:', error);
        res.status(500).json({ error: 'Failed to fetch trending articles' });
    }
});

app.get('/sports', async (req, res) => {
    try {
        const { page, limit, skip } = getPagination(req);
        await sendPaginatedArticles(res, { category: 'Sports' }, page, limit, skip);
    } catch (error) {
        console.error('Failed to fetch sports articles:', error);
        res.status(500).json({ error: 'Failed to fetch sports articles' });
    }
});

app.get('/magazine', async (req, res) => {
    try {
        const { page, limit, skip } = getPagination(req);
        await sendPaginatedArticles(res, { category: 'Magazine' }, page, limit, skip);
    } catch (error) {
        console.error('Failed to fetch magazine articles:', error);
        res.status(500).json({ error: 'Failed to fetch magazine articles' });
    }
});

app.get('/entertainment', async (req, res) => {
    try {
        const { page, limit, skip } = getPagination(req);
        await sendPaginatedArticles(res, { category: 'Entertainment' }, page, limit, skip);
    } catch (error) {
        console.error('Failed to fetch entertainment articles:', error);
        res.status(500).json({ error: 'Failed to fetch entertainment articles' });
    }
});

app.get('/bestof', async (req, res) => {
    try {
        const { page, limit, skip } = getPagination(req);
        await sendPaginatedArticles(res, { bestOf: true }, page, limit, skip);
    } catch (error) {
        console.error('Failed to fetch best of articles:', error);
        res.status(500).json({ error: 'Failed to fetch best of articles' });
    }
});

app.get('/articles/:id', async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ error: 'Invalid article ID' });
        }

        const article = await Article.findById(req.params.id);
        if (!article) {
            return res.status(404).json({ error: 'Article not found' });
        }

        return res.json({ data: article });
    } catch (err) {
        console.error('Failed to fetch article:', err);
        return res.status(500).json({ error: 'Failed to fetch article' });
    }
});

app.post('/articles', writeRateLimiter, async (req, res) => {
    try {
        const newArticle = new Article(req.body);
        await newArticle.save();
        return res.status(201).json({ data: newArticle });
    } catch (err) {
        console.error('Failed to create article:', err);
        return res.status(400).json({ error: err.name === 'ValidationError' ? err.message : 'Failed to create article' });
    }
});

app.put('/articles/:id', writeRateLimiter, async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ error: 'Invalid article ID' });
        }

        const updatedArticle = await Article.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedArticle) {
            return res.status(404).json({ error: 'Article not found' });
        }

        return res.json({ data: updatedArticle });
    } catch (err) {
        console.error('Failed to update article:', err);
        return res.status(400).json({ error: err.name === 'ValidationError' ? err.message : 'Failed to update article' });
    }
});

app.patch('/articles/:id', writeRateLimiter, async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ error: 'Invalid article ID' });
        }

        const updatedArticle = await Article.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        );

        if (!updatedArticle) {
            return res.status(404).json({ error: 'Article not found' });
        }

        return res.json({ data: updatedArticle });
    } catch (err) {
        console.error('Failed to update article:', err);
        return res.status(400).json({ error: err.name === 'ValidationError' ? err.message : 'Failed to update article' });
    }
});

app.delete('/articles/:id', writeRateLimiter, async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ error: 'Invalid article ID' });
        }

        const deletedArticle = await Article.findByIdAndDelete(req.params.id);
        if (!deletedArticle) {
            return res.status(404).json({ error: 'Article not found' });
        }

        return res.status(204).end();
    } catch (err) {
        console.error('Failed to delete article:', err);
        return res.status(500).json({ error: 'Failed to delete article' });
    }
});

app.use((req, res) => {
    res.status(404).json({ error: 'Nothing Found' });
});

const startServer = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB Atlas');

        app.listen(PORT, () => {
            console.log(`🚀 Server is running at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
};

startServer();
