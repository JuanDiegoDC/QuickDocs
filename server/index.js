var app = require('express')();
var server = require('http').Server(app);
var path = require("path");
var io = require('socket.io')(server);
import mongoose from "mongoose";
import User from "./User.js";
import bodyParser from "body-parser";

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

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
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
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

});

app.get("/ping", (req, res) => {
  res.send("Pong!");
});

app.post('/login',
  passport.authenticate('local'), (req, res) => {
  if (req.user) {
    res.json({
      success: true
    });
  }
  else {
    res.json({
      error: "Invalid credentials"
    })
  }
  });

io.on('connection', function (socket) {
  socket.emit('msg', { hello: 'world' });
  socket.on('cmd', function (data) {
    console.log(data);
  });
});

server.listen(8080);
