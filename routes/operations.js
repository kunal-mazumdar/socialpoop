var express = require('express');
var bodyParser = require('body-parser');
var Firebase = require('firebase');
var poop = require('../models/poop');

var router = express.Router();
var ref = new Firebase("https://resplendent-torch-2012.firebaseio.com/");

router.get('/', function(request, response) {
  response.render('./pages/index');
});

router.get('/save/:name', function(request, response) {
  var usersRef = ref.child("users");

  usersRef.push().set({
    name: request.params.name
  });
  response.json({response: 'OK'});
});

module.exports = router;
