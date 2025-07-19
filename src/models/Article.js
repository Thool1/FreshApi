import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema({
  title: String,
  slug: String,
  content: String,
  excerpt: String,
  author: {
    id: Number,
    name: String,
    bio: String,
    profilePicture: String
  },
  category: String,
  tags: [String],
  image: String,
  publishedAt: Date,
  isFeatured: Boolean
}, {
  timestamps: true  // 👈 adds createdAt and updatedAt automatically
});

const Article = mongoose.model('Article', articleSchema);
export default Article;
