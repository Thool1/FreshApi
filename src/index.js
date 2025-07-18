import express from 'express';
import { articles } from "./data.js"; // ✅ fixed

const app = express();
const PORT = 3000;
app.use(express.json())

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

app.post('/articles', express.json(), (req, res) => {
    const title = req.body.title
    // articles.push({id:articles.length + 1,title,slug,content,excerpt,author})
    const newArticle = {
        id: articles.length + 1,
        title,
        slug,
        content,
        excerpt,
        // author: {
        //     id: articles.length + 100,         // ✅ Auto-generated author ID
        //     name,
        //     bio,
        //     profilePicture
        // },
        category,
        tags,
        image,
        publishedAt,
        isFeatured
    }
    articles.push(newArticle);
    res.json({ data: newArticle })

})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

