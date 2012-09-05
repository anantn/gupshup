var express = require("express"),
    app     = express();

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

app.use(express.bodyParser());
app.use(express.cookieParser("thisistehsecret"));

app.use(express.session());
app.use(express.static(__dirname + "/static"));

app.get("/", function(req, res) {
  res.redirect("/login");
});

app.get("/login", function(req, res) {
  if (req.session.user) {
    res.redirect("/chat")
  } else {
    // ejs complains about undefined variable?
    res.locals.message = "";
    if (req.query.err) {
      res.locals.message = req.query.err;
    }
    res.render("login");
  }
});

app.get("/chat", function(req, res) {
  if (!req.session.user) {
    var msg = "Access denied, try logging in?";
    res.redirect("/login?err=" + encodeURIComponent(msg));
  } else {
    res.render("chat");
  }
});

app.post("/login", function(req, res)) {

}

app.post("/logout", function(req, res)) {

}

app.listen(3000);
