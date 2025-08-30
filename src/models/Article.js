// models/article.js
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
      'Bollywood', // ✅ Added Bollywood category
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

  // ✅ Bollywood schema merged
  // bollywood: {
  //   boxOffice: {
  //     budget: { type: String, default: null }, // e.g., "₹100 Crore"
  //     collection: { type: String, default: null }, // e.g., "₹300 Crore"
  //     verdict: { type: String, default: null } // e.g., "Blockbuster"
  //   },
  //   celebrity: {
  //     name: { type: String, default: null }, // e.g., "Ranveer Singh"
  //     profession: { type: String, default: null } // e.g., "Actor"
  //   }
  // },
bollywood: {
  isBollywood: { type: Boolean, default: false },
  title: { type: String, default: null },
  language: { type: String, default: null },
  releaseDate: { type: String, default: null },
  cast: { type: String, default: null },
  director: { type: String, default: null },
  genre: { type: String, default: null },
  plotSummary: { type: String, default: null },
  whatWorks: { type: String, default: null },
  whatDoesntWork: { type: String, default: null },
  finalVerdict: { type: String, default: null },

  boxOffice: {
    budget: { type: String, default: null }, // e.g., "₹100 Crore"
    dailyCollection: [
      {
        day: { type: String },       // e.g., "Day 1 (Friday)"
        collection: { type: String } // e.g., "₹7 Cr"
      }
    ],
    verdict: { type: String, default: null } // e.g., "Blockbuster", "Hit"
  },

  celebrity: {
    name: { type: String, default: null },      // e.g., "Ranveer Singh"
    profession: { type: String, default: null } // e.g., "Actor"
  }
},
  // ✅ Common flags
  featured: { // renamed back from isFeatured
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
