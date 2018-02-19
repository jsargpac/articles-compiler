const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    id: { type: String, unique: true },
    title: String,
    url: String,
    favorite: {type: Boolean, default: false},
    excerpt: String,
    content: String,
    date: Date,
    domain: String,
    dek: String,
    word_count_mercury: Number,
    tags: [{
    	type: String
    }],
    already_imported: {type: Boolean, default: false},
    word_count: { type: Number, default: 0 }
});

const Article = mongoose.model('id', articleSchema);

module.exports = Article;
