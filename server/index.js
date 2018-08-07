var app = require('express')();
var server = require('http').Server(app);
var path = require("path");
var io = require('socket.io')(server);
import mongoose from "mongoose";
import User from "./User.js";
import Document from "./Document.js";
import bodyParser from "body-parser";
const bcrypt = require('bcrypt');
const saltRounds = 10;

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

app.use(bodyParser.json());

mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true}, (error) => {
  if(error){
    console.log(error);
  }
  else {
    console.log("Success, connected to MongoDB");
  }
});

// set passport middleware to first try local strategy
passport.use(new LocalStrategy(
  function(username, password, done) {
    console.log("Called!");
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      bcrypt.compare(password, user.password).then(function(res) {
          if (res) {
            return done(null, user);
          }
          else {
            return done(null, false);
          }
      });
    });
  }
));

// session configuration
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

// connect passport to express via express middleware
app.use(passport.initialize());
app.use(passport.session());

app.post("/register", (req, res) => {
  const {username, password, passwordconfirm, email} = req.body;
  console.log(username, password, email);
  if (password === passwordconfirm) {
    if (password && username && email) {
      bcrypt.hash(password, saltRounds).then(function(hash) {
        console.log(hash);
        const newUser = new User({
          username: username,
          password: hash,
          email: email
        });
        newUser.save().then((user) => {
          if (!user){
            res.status(500).json({
              error: "Failed to save user"
            });
          }
          else {
            res.status(200).json({
              success: true
            });
          }
        });
      });
    }
  }
  else {
    res.json({
      error: "Password must match"
    });
  }
});

app.post("/ping", (req, res) => {
  res.send("Pong!");
})

app.get("/ping", (req, res) => {
  res.send("Pong!");
});

app.post('/login',
function(req, res, next) {
  console.log('before authenticate');
  passport.authenticate('local', function(err, user, info) {
    console.log('authenticate callback', user);
    if (err) { return next(err);}
    if (!user) {
      return res.json({
        error: "No user in database"
      });
    }
    req.logIn(user, function(err) {
      if (err) {
        return res.json({
          error: err
        });
      }
      else {
        res.json({
          success: true
        });
      }
    });
  })(req, res, next);
});

  app.use("/", (req, res, next) => {
    if (req.user) {
      return next();
    }
    else {
      res.json({
        error: "Unauthorized"
      });
    }
  });

  //EVERYTHING BELOW HERE MUST BE AUTHORIZED

  app.get("/logout", (req, res) => {
    req.logout();
    res.json({
      success: true
    });
  });

  app.get("/documents", (req, res) => {
    let docs = [];
    Document.find({collaborator: req.user._id}, (error, docs) => {
      if (error){
        console.log(error);
      }
      res.json({
        docs: docs
      });
    });
  });

io.on('connection', function (socket) {
  socket.emit('msg', { hello: 'world' });
  socket.on('cmd', function (data) {
    console.log(data);
  });
});

server.listen(8080);
