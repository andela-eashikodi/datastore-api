var express = require('express');
var router = express.Router();
var DocumentController = require('../controllers/document.controller');
var UserController = require('../controllers/user.controller');
var documentCtrl = new DocumentController();
var userCtrl = new UserController();

//document routes defined
module.exports = function(app) {

  router.route('/')
    .post(userCtrl.verifyUserAuth, documentCtrl.createDocument)
    .get(documentCtrl.getAllDocuments);

  router.route('/:id')
    .get(documentCtrl.findDocument)
    .put(documentCtrl.updateDocument)
    .delete(documentCtrl.deleteDocument);

  app.use('/documents', router);
};