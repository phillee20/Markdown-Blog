const express = require("express");
const mongoose = require("mongoose");
const articleRouter = require("./routes/articles"); //Getting it from articles router
const Article = require("./models/articles");
const methodOverride = require("method-override");  //Overrides the method and allows us to use DELETE
const app = express();

mongoose.connect("mongodb://localhost/blog", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false })); //We can access all paramter from article form inside article route by using request.body
app.use(methodOverride("_method"));

app.get("/", async (request, response) => {
  const articles = await Article.find().sort({
    //Finds all the articles
    createdAt: "desc",
  }); //Sorts it all with newest on top
  response.render("articles/index", { articles: articles }); //render accesses the views folder into index
});

app.use("/articles", articleRouter);

app.listen(4000);
