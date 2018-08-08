var app = require('express')();
var server = require('http').Server(app);
var path = require("path");
var io = require('socket.io')(server);
import express from "express";
import mongoose from "mongoose";
import User from "./User.js";
import Document from "./Document.js";
import bodyParser from "body-parser";
const bcrypt = require('bcrypt');
const saltRounds = 10;
var session = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(session);
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var cookieParser = require('cookie-parser');
app.use(bodyParser.json());
var store = new MongoDBStore({
  uri: process.env.MONGODB_URI,
  collection: "sessions"
})
app.use(session({
  secret: process.env.SECRET,
  store: store
}));

app.use(express.static(path.join(__dirname)));
app.use(cookieParser());

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
app.use(express.session());

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
      console.log("User:", user);
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

  app.post("/create/document", (req, res) => {
    if (!req.user) {
      res.json({
        error: "unauthorized"
      });
    }
    else {
      const {title, password} = req.body;
      const owner = req.user._id;
      if (title && password) {
        const newDoc = new Document({
          title: title,
          password: password,
          owner: owner,
          collaborators: [owner],
        });
        newDoc.save()
        .then((doc) => {
          if (!doc) {
            res.json({
              error: "Failed to save document"
            });
          }
          else {
            res.json({
              success: true
            });
          }
        });
      }
    }
  });

  app.post("/document", (req, res) => {
    if (!req.user) {
      res.json({
        error: "Unauthorized"
      });
    }
    else {
      {id} = req.body;
      Document.findOne(id)
        .then((error, doc) => {
          if(error) {
            console.log(error);
            res.json({
              error: "Failed to retrieve document"
            });
          }
          else {
            res.json({
              doc: doc
            });
          }
        })
    }
  });

  app.get("/documents", (req, res) => {
    if (!req.user) {
      res.json({
        error: "Unauthorized"
      });
    }
    else {
      console.log("Get documents is called!");
      console.log("reg.user:", req.user);
      console.log("Session:", req.session);
      Document.find({}, (error, docs) => {
        if (error){
          console.log(error);
        }
        res.json({
          success: true,
          docs: docs
        });
      });
    }
  });

  app.get("/logout", (req, res) => {
    req.logout();
    res.json({
      success: true
    });
  });

  app.post("/save/document", (req, res) => {
    if (!req.user) {
      res.json({
        error: "Unauthorized"
      });
    }
    else {
      {content, id} = req.body;
      Document.findOneAndUpdate(id, {content: content})
        .then((error) => {
          if (error) {
            console.log(error);
            res.json({
              error: "Could not save"
            });
          }
          else {
            res.json({
              success: true
            });
          }
        });
    }
  });

io.on('connection', function (socket) {
  socket.emit('msg', { hello: 'world' });
  socket.on('cmd', function (data) {
    console.log(data);
  });
});

server.listen(8080);
