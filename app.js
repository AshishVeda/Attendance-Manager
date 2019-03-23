var express = require("express"),
  app = express(),
  mongoose = require("mongoose"),
  bodyParser = require("body-parser"),
  passport = require("passport"),
  localStrategy = require("passport-local"),
  passportLocalMon = require("passport-local-mongoose"),
  User = require("./models/user"),
  Subject = require("./models/subjects"),
  methodOverride = require("method-override");
var flash = require("express-flash-messages");
var cookieParser = require("cookie-parser");
var expressValidator = require("express-validator");
app.use(cookieParser());
app.use(flash());
app.use(expressValidator());
mongoose.connect("mongodb://localhost/attendanceManager");
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  require("express-session")({
    secret: "Hakoona Matataa",
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  next();
});
app.get("/", function(req, res) {
  req.flash("error", "username or password is incorrect");
  res.render("home.ejs");
});
app.get("/register", function(req, res) {
  res.render("home.ejs", { showErrors: false, x: 0 });
});
app.post("/register", function(req, res) {
  User.register(
    new User({ username: req.body.username }),
    req.body.password,
    function(err, user) {
      if (err) {
        console.log(err);
        res.redirect("/");
      }
      passport.authenticate("local")(req, res, function() {
        res.redirect("/ind");
      });
    }
  );
});
app.get("/login", function(req, res) {
  var flashMessages = res.locals.getMessages();
  if (flashMessages.error) {
    res.render("login.ejs", {
      showErrors: true,
      errors: flashMessages.error,
      x: 1
    });
  } else {
    res.render("login.ejs", { showErrors: false, x: 0 });
  }
});
app.get("/index/:id", isLoggedIn, function(req, res) {
  Subject.find({}, function(err, sub) {
    if (err) {
      console.log(err);
      res.redirect("/");
    } else {
      res.render("index.ejs", { sub: sub });
    }
  });
});
app.get("/", function(req, res) {
  res.render("home.ejs");
});
app.get("/logout", isLoggedIn, function(req, res) {
  req.logout();
  res.redirect("/");
});
app.get("/new", function(req, res) {
  res.render("new.ejs");
});
app.post("/new", function(req, res) {
  var student = {
      id: req.user._id,
      name: req.user.username
    },
    subject = req.body.subject,
    per = req.body.per;
  var obj = { student: student, subject: subject, percent: per };
  Subject.create(obj, function(err, Sub) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/index/" + req.user._id);
    }
  });
});
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}
app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/ind",
    failureFlash: true,
    failureRedirect: "/login"
  }),
  function(req, res) {}
);
app.get("/ind", function(req, res) {
  res.redirect("/index/" + req.user._id);
});
app.get("/index/:id/show/:subid", function(req, res) {
  Subject.findById(req.params.subid, function(err, sub) {
    if (err) {
      console.log(err);
    } else {
      res.render("show.ejs", { sub: sub });
    }
  });
});
app.put("/index/:id/show/:subid", function(req, res) {
  //Subject.findByIdAndUpdate(req.params._id)
  if (req.body.pre == "Present") {
    var total = req.body.total;
    var attended = req.body.att;
    total++;
    attended++;
    var obj = { attended: attended, total: total };
    Subject.findByIdAndUpdate(req.params.subid, obj, function(err, sub) {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/index/" + req.user._id + "/show/" + req.params.subid);
      }
    });
  } else if (req.body.pre == "Absent") {
    var total = req.body.total;
    var attended = req.body.att;
    total++;
    var obj = { attended: attended, total: total };
    Subject.findByIdAndUpdate(req.params.subid, obj, function(err, sub) {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/index/" + req.user._id + "/show/" + req.params.subid);
      }
    });
  } else {
    var total = req.body.total;
    var attended = req.body.att;
    var obj = { attended: attended, total: total };
    Subject.findByIdAndUpdate(req.params.subid, obj, function(err, sub) {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/index/" + req.user._id + "/show/" + req.params.subid);
      }
    });
  }
});

app.listen("3004", function() {
  console.log("Server has started");
});
