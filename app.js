var express = require("express"),
    app     = express();

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

app.use(express.bodyParser());
app.use(express.cookieParser("thisistehsecret"));

app.use(express.session());
app.use(express.static(__dirname + "/static"));

app.get("/", function(req, res) {
  res.render("login");
});

app.listen(3000);
