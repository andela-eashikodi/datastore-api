require('../models/user.schema');
require('../models/document.schema');
var jwt = require('jsonwebtoken');
var config = require('../../config/config');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Document = mongoose.model('Document');
var UserController = function() {};

// method to authenticate user
UserController.prototype.userAuth = function(req, res) {
  User.findOne({email: req.body.email}, function(err, user) {
    if (!user) {
      return res.json({
        success: false,
        message: 'Failed to authenticate user.'
      });
    } 
    else {
      // user password input is compared with saved password
      var validPassword = user.comparePassword(req.body.password);
      if (validPassword) {
        var token = jwt.sign(user, config.secret, {
          expiresInMinutes: 1440 //24hr expiration
        });
        // user is authenticated and receives a token
        res.json({
          success: true,
          token: token
        });
      } 
      else {
        return res.json({
          success: false,
          message: 'Failed to authenticate user.'
        });
      }
    }
  });
};

// this middleware attach user info to req
UserController.prototype.verifyUserAuth = function(req, res, next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  if (token) {
    jwt.verify(token, config.secret, function(err, decoded) {
      if (err) {
        return res.json({
          success: false,
          message: 'Failed to authenticate token.'
        });
      } else {
        //if all checks are passed, save decoded info to request
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.json({
      success: false,
      message: 'No token provided.'
    });

  }
};

// this middlewares verify user to grant a session
UserController.prototype.verifyUser = function(req, res, next) {
   User.findOne({email: req.body.email}, function(err, user) {
    if (!user) {
      return res.json({
        success: false,
        message: 'Failed to authenticate user.'
      });
    } 
    else {
      var validPassword = user.comparePassword(req.body.password);
      if (validPassword) {
        // sets a cookie with the user's info
        req.session.user = user;
        next();
      } 
      else {
        return res.json({
          success: false,
          message: 'Failed to authenticate user.'
        });
      }
    }
  });
};

// checks if user has session granted
UserController.prototype.userLogin = function(req, res) {
  if(req.session && req.session.user) {
    /*
    most appropriate to redirect user
    like this 
    res.redirect('/dashboard')
    */
    res.json({
      success: true,
      message: 'User login succesful'
    });
  }
  else {
    res.json({
      success: false,
      message: 'User login failed'
    });
  }
};

// session is cleared and user is logged out
UserController.prototype.userLogout = function(req, res) {
  req.session.reset();
  /*
    most appropriate to redirect user
    like this 
    res.redirect('/login-page')
    */
  res.json({
    success: true,
    message: 'User Logout succesful'
  });
};

UserController.prototype.createUser = function(req, res) {
  User.findOne({email: req.body.email, username: req.body.username}, function(err, user) {
    if (user) {
      res.json({
        sucess: false,
        message: 'email taken'
      });
    } 
    else {
      User.create(req.body, function(err, user) {
        if (err) {
          return res.json(err);
        }
        return res.json(user);
      });
    }
  });
};

UserController.prototype.getAllUsers = function(req, res) {
  User.find(function(err, users) {
    if (err) {
      return res.json(err);
    }
    return res.json(users);
  });
};

UserController.prototype.findUser = function(req, res) {
  User.findById(req.params.id, function(err, user) {
    if (err) {
      res.send(err);
    }
    res.json(user);
  });
};

UserController.prototype.updateUser = function(req, res) {
  User.findByIdAndUpdate({_id: req.params.id}, req.body, {new: true}, function(err, user) {
    if (err) {
      return res.json(err);
    }
    res.json(user);
  });
};

UserController.prototype.deleteUser = function(req, res) {
  User.findByIdAndRemove({_id: req.params.id}, function(err, user) {
    if (err) {
      return res.json(err);
    }
    UserController.prototype.findUser(req, res);
  });
};

UserController.prototype.findUserDocuments = function(req, res) {
  Document.find({ownerId: req.params.id}).exec(function(err, docs) {
    if (err) {
      return res.json(err);
    }
    return res.json(docs);
  });
};

module.exports = UserController;