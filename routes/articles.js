const express = require("express");
const Article = require("../models/articles");
const router = express.Router();

router.get("/new", (request, response) => {
  response.render("articles/new", { article: new Article() });
});

router.get("/edit/:id", async (request, response) => {
  const article = await Article.findById(request.params.id);
  response.render("articles/edit", { article: article });
});

router.get("/:slug", async (request, response) => {
  const article = await Article.findOne({ slug: request.params.slug });
  if (article === null) response.redirect("/");
  response.render("articles/show", { article: article });
});

router.post(
  "/",
  async (request, response, next) => {
    request.article = new Article();
    next();
  },
  saveArticleAndRedirect("new")
);

router.put(
  "/:id",
  async (request, response, next) => {
    request.article = await Article.findById(request.params.id);
    next();
  },
  saveArticleAndRedirect("edit")
);

method = "delete";
router.delete("/:id", async (request, response) => {
  await Article.findByIdAndDelete(request.params.id);
  response.redirect("/");
});

function saveArticleAndRedirect(path) {
  return async (request, response) => {
    let article = request.article;
    article.title = request.body.title;
    article.description = request.body.description;
    article.markdown = request.body.markdown;
    try {
      article = await article.save();
      response.redirect(`/articles/${article.slug}`);
    } catch (error) {
      console.log(error);
      response.render(`articles/${path}`, { article: article });
    }
  };
}

module.exports = router; //Passed out to server.js for accessing routes
