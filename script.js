#! /usr/bin/env node

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/testdmsapi');
require('./app/models/user.schema');
require('./app/models/document.schema');
var User = mongoose.model('User');
var Document = mongoose.model('Document');

var UserController = require('./app/controllers/user.controller');
var ctrl = new UserController();

var commandInput = process.argv[1];
var userCommand = commandInput.split('/')[4];

var userArgs = process.argv.slice(2);

var exec = require('child_process').exec;

if(userCommand === 'createnewuser') {
  if(userArgs.length < 3) {
    console.log(
      'incomplete parameters\n format is : createnewuser "username", "firstname", "lastname", "email", "password" '
    );
  }
  else {
    var child = exec(User.create({
      username: userArgs[0],
      name: {
        first: userArgs[1],
        last: userArgs[2]
      },
      email: userArgs[3],
      password: userArgs[4]
    }, function(err, user) {
      if(err) {
        console.log(err);
      }
      else {
        console.log(user);
      }
    }));
  }  
}

