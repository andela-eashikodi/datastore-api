var express = require('express');
var router = express.Router();
var UserController = require('../controllers/user.controller');
var ctrl = new UserController();

// user routes defined
module.exports = function(app) {
  router.route('/login')
    .post(ctrl.verifyUser, ctrl.userLogin);

  router.route('/logout')
    .post(ctrl.userLogout);

  router.route('/')
    .post(ctrl.createUser)
    .get(ctrl.getAllUsers);

  router.route('/:id')
    .get(ctrl.findUser)
    .put(ctrl.updateUser)
    .delete(ctrl.deleteUser);

  router.route('/:id/documents')
    .get(ctrl.findUserDocuments);

  router.route('/authenticate')
    .post(ctrl.userAuth);

  app.use('/users', router);
};