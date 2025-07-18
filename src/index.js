import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Article from './models/Article.js'; // import MongoDB model
// import Article from './models/Article.js'; // ✅ add this at the top


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

// Routes
app.get('/', (req, res) => {
    res.json({ message: 'HelloBhau' });
});

// GET all articles
// app.get('/articles', async (req, res) => {
//     try {
//         const articles = await Article.find();
//         res.json({ data: articles });
//     } catch (err) {
//         res.status(500).json({ error: 'Failed to fetch articles' });
//     }
// });

app.get('/articles', async (req, res) => {
    try {
        const articles = await Article.find(); // fetch from MongoDB
        res.json({ data: articles });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch articles' });
    }
});


// GET single article by ID
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

// POST new article
app.post('/articles', async (req, res) => {
    try {
        const newArticle = new Article(req.body);
        await newArticle.save();
        res.status(201).json({ data: newArticle });
    } catch (err) {
        res.status(400).json({ error: 'Failed to create article' });
    }
});

// PUT (update) article by ID
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

// DELETE article by ID
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
    res.status(404).json({ Error: 'Nothing Found' });
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
