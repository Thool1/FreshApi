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
    enum: [
      'Sports',
      'Entertainment',
      'Bollywood',
      'Magazine',
      'Business',
      'Politics',
      'Tech',
      'Lifestyle',
      'Other'
    ]
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

  // Bollywood-specific fields are used when category is "Bollywood".
  // The top-level category is the single source of truth; there is no
  // duplicate isBollywood flag.
  bollywood: {
    title: { type: String, default: null },
    language: { type: String, default: null },
    releaseDate: { type: Date, default: null },
    cast: { type: String, default: null },
    director: { type: String, default: null },
    genre: { type: String, default: null },
    plotSummary: { type: String, default: null },
    whatWorks: { type: String, default: null },
    whatDoesntWork: { type: String, default: null },
    finalVerdict: { type: String, default: null },

    boxOffice: {
      budget: { type: String, default: null },
      dailyCollection: [
        {
          day: { type: String, required: true },
          collection: { type: String, required: true }
        }
      ],
      verdict: { type: String, default: null }
    },

    celebrity: {
      name: { type: String, default: null },
      profession: { type: String, default: null }
    }
  },

  featured: {
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
  timestamps: true
});

const Article = mongoose.model('Article', articleSchema);
export default Article;
