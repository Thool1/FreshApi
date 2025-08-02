import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  excerpt: {
    type: String,
    required: true
  },
  author: {
    id: {
      type: Number,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    bio: String,
    profilePicture: String
  },
  category: {
    type: String,
    required: true,
    trim: true,
    enum: ['Sports', 'Entertainment', 'Magazine', 'Business', 'Politics', 'Tech', 'Lifestyle', 'Other']
  },
  tags: {
    type: [String],
    default: []
  },
  image: {
    type: String,
    required: true
  },
  publishedAt: {
    type: Date,
    default: Date.now
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isEditorsPick: {
    type: Boolean,
    default: false
  },
  isTrending: {
    type: Boolean,
    default: false
  },
  bestOf: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true // adds createdAt and updatedAt
});

const Article = mongoose.model('Article', articleSchema);
export default Article;
