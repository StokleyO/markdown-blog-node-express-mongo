const mongoose = require('mongoose');
const marked = require('marked') //converts markdown to HTML
const slugify = require('slugify')
const createDomPurify = require('dompurify')
const { JSDOM } = require ('jsdom')
const dompurify = createDomPurify(new JSDOM().window)
// allows our DomPurifier to create HTML and purify it using the JSDOM window object. This is all in the dompurify documentation

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    markdown: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    sanitizedHtml: {
        type: String,
        required: true
    }
})

articleSchema.pre('validate', function(next) {
    if (this.title) {
        this.slug = slugify(this.title, {lower: true, strict: true})
    }

    if (this.markdown) {
        this.sanitizedHtml = dompurify.sanitize(marked.parse(this.markdown))
    }

    next()
})

module.exports = mongoose.model('Article', articleSchema)