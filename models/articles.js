const mongoose = require("mongoose");
const slugify = require("slugify");
const marked = require("marked");
const createDomPurify = require("dompurify"); //sanitizes HTML and prevents XSS attacks
const { JSDOM } = require("jsdom"); //Parses and interacts assembled HTML just like browser
const dompurify = createDomPurify(new JSDOM().window);

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
  description: {
    type: String,
  },
  markdown: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  sanitizedHTML: {
    type: String,
    require: true,
  },
});

articleSchema.pre("validate", function (next) {
  //creates a slug from title everytime we validate our model
  if (this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }

  if (this.markdown) {
    this.sanitizedHTML = dompurify.sanitized(marked.parse(this.markdown));
  }
  next();
});

//converts markdown to HTML and purifies the HTML to take out malicious code

module.exports = mongoose.model("Article", articleSchema);
