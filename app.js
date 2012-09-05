var express = require("express"),
    https   = require("https"),
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
    res.redirect("/chat");
    return;
  }

  // ejs complains about undefined variable?
  res.locals.message = "";
  if (req.query.err) {
    res.locals.message = req.query.err;
  }
  res.render("login");
});

app.get("/chat", function(req, res) {
  if (!req.session.user) {
    doRedirect("Access denied, try logging in?", res);
    return;
  }
  res.locals.user = req.session.user;
  res.render("chat");
});

app.post("/login", function(req, res) {
  if (!req.body.assertion) {
    res.send(500, "Invalid login request");
    return;
  }

  verifyAssertion(req.body.assertion, audience, function(val) {
    if (val) {
      req.session.regenerate(function() {
        req.session.user = val;
        res.send(200);
      });
    } else {
      res.send(401, "Invalid Persona assertion");
    }
  });
});

app.post("/logout", function(req, res) {

});

var port = process.env.PORT || 5000;
var audience = process.env.AUDIENCE || "http://gupshup.herokuapp.com";

app.listen(port, function() {
  console.log("Port is " + port + " with audience " + audience);
});

// Helper functions.

function doRedirect(msg, res) {
  res.redirect("/login?err=" + encodeURIComponent(msg));
}

function verifyAssertion(ast, aud, cb) {
  var data = "audience=" + encodeURIComponent(aud);
  data += "&assertion=" + encodeURIComponent(ast);

  var options = {
    host: "verifier.login.persona.org",
    path: "/verify",
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length": data.length
    }
  };

  var req = https.request(options, function(res) {
    var ret = "";
    res.on("data", function(chunk) {
      ret += chunk;
    });
    res.on("end", function() {
      try {
        var val = JSON.parse(ret);
      } catch(e) {
        cb(false);
        return;
      }
      if (val.status == "okay") {
        cb(val.email);
      } else {
        console.log(data);
        console.log(val);
        cb(false);
      }
    });
  });

  req.write(data);
  req.end();
}
