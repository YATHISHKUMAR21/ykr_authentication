const express = require('express');
const app = express();
const passport = require("passport");
const { connectMongoose, User } = require("./db");
const { initialisingPassport, isAuthenticated } = require("./passportConfig");
const expressSession = require('express-session');

connectMongoose();
initialisingPassport(passport);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  expressSession({
    secret: "secret", // move to env later
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', "ejs");

// Routes
app.get('/', (req, res) => {
    res.render("index");
});

app.get('/register', (req, res) => {
    res.render("register");
});

app.get('/login', (req, res) => {
    res.render("login");
});

app.get('/profile', isAuthenticated, (req, res) => {
    res.send(req.user);
});

app.post('/register', async (req, res) => {
    const user = await User.findOne({ username: req.body.username });

    if (user) {
        return res.status(400).send("User already exists");
    }

    const newUser = await User.create(req.body);
    res.status(201).send(newUser);
});

app.post(
  '/login',
  passport.authenticate("local", {
    failureRedirect: "/register",
    successRedirect: "/profile"
  })
);

app.get('/logout', (req, res, next) => {
    req.logout(err => {
        if (err) return next(err);
        res.redirect("/login");
    });
});

app.listen(3000, () => {
    console.log("Server started on port 3000");
});
