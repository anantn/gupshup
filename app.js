var express = require("express"),
    app     = express();

app.get("/", function(req, res) {
  res.redirect("/index.html");
});
app.use(express.static(__dirname + "/static"));

app.listen(3000);
