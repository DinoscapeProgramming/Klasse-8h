const fs = require("fs");
const express = require("express");
const app = express();
const Database = require("@replit/database");
const db = new Database();
const analytics = require("./analytics.js");

app.set("views", __dirname);
app.set("view engine", "ejs");
app.use(express.json());
app.use(analytics);
app.use(express.static("public"));
app.use("/pages", express.static("pages"));
app.use("/articles", express.static("articles"));

app.post("/api/v1/like", (req, res) => {
  db.get("feedback").then(({ value: feedback }) => {
    feedback = JSON.parse(feedback || "[]");
    db.set("feedback", JSON.stringify({
      ...feedback,
      ...{
        [req.body.article]: {
          ...feedback[req.body.article] || {},
          ...{
            likes: feedback[req.body.article]?.likes + 1 || 1
          }
        }
      }
    })).then(() => res.json({
      success: true
    }));
  });
});

app.post("/api/v1/dislike", (req, res) => {
  db.get("feedback").then(({ value: feedback }) => {
    feedback = JSON.parse(feedback || "[]");
    db.set("feedback", JSON.stringify({
      ...feedback,
      ...{
        [decodeURIComponent(req.body.article).toLowerCase()]: {
          ...feedback[decodeURIComponent(req.body.article).toLowerCase()] || {},
          ...{
            dislikes: feedback[req.body.article]?.dislikes + 1 || 1
          }
        }
      }
    })).then(() => res.json({
      success: true
    }));
  });
});

app.all("/*", (req, res) => {
  let title = (decodeURIComponent(req.path).substring(1) || "home").replace("random", fs.readdirSync("./articles")[Math.floor(Math.random() * fs.readdirSync("./articles").length)]).toLowerCase();
  let articles = fs.readdirSync("./articles").filter((article) => article !== "error");
  if (title === "popular") {
    db.get("feedback").then(({ value: feedback }) => {
      feedback = JSON.parse(feedback || "[]");
      articles = articles.map((article) => [article, feedback[article.toLowerCase()]?.likes || 0, feedback[article.toLowerCase()]?.dislikes || 0]).sort((a, b) => (b[1] - b[2]) - (a[1] - a[2]));
    }).then(() => {
      res.render("pages/article/index.ejs", {
        title,
        content: fs.readFileSync(`./articles/${(fs.readdirSync("./articles").includes(title)) ? title : "error"}/index.html`),
        articles
      });
    });
  } else {
    res.render("pages/article/index.ejs", {
      title,
      content: fs.readFileSync(`./articles/${(fs.readdirSync("./articles").includes(title)) ? title : ((fs.readdirSync("./articles").includes(title.split(" ").map((part) => part[0].toUpperCase() + part.substring(1)).join(" "))) ? title.split(" ").map((part) => part[0].toUpperCase() + part.substring(1)).join(" ") : "error")}/index.html`),
      articles
    });
  };
});

const listen = app.listen(3000, () => {
  console.log("Server is now ready on port", listen.address().port);
});