var express = require('express');
var bodyParser = require('body-parser');
var Firebase = require('firebase');
var poopModel = require('../models/poop');

var router = express.Router();
var FIREBASE_DB = "https://resplendent-torch-2012.firebaseio.com/";
var ref = new Firebase(FIREBASE_DB);
var poopsRef = ref.child("poops");

router.get('/', function(request, response) {
  response.render('./pages/index');
});

// API #1 Register a new poop
router.post('/poops', function(req, res){
  var poop = poopModel.getPoopModel();
  poop.name = req.body.name;
  poop.source = req.body.source;
  poop.imgUrl = req.body.imgUrl;
  poop.date = req.body.date;
  poop.description = req.body.description;

  poopsRef
    .push()
    .set(poop, function(err){
      if(err){
        res.json({response: 'FAIL', error: err});
      } else{
        res.json({response: 'OK'});
      }
    });
});

// API #2,#3,#5,#7 Get all poops / range / name / source
router.get('/poops', function(req, res){
  if(req.query.start && req.query.end){

    /*console.log(req.query.start,req.query.end)
    poopsRef
      .orderByKey()
      .limitToFirst(1)
      .on('value', function(snapshot) {
        res.json(null != snapshot.val() ? snapshot.val() : {});
      }, function (errorObject) {
        res.json({response: 'FAIL'});
      });*/
      res.json({response: 'API_IN_PROGRESS'});

  } else if(req.query.name){

    poopsRef.orderByChild('name').equalTo(req.query.name).on('value', function(snapshot) {
      res.json(null != snapshot.val() ? snapshot.val() : {});
    }, function (errorObject) {
      res.json({response: 'FAIL'});
    });

  } else if(req.query.source){

    poopsRef.orderByChild('source').equalTo(req.query.source).on('value', function(snapshot) {
      res.json(null != snapshot.val() ? snapshot.val() : {});
    }, function (errorObject) {
      res.json({response: 'FAIL'});
    });

  } else if(req.query.startDt && req.query.endDt){

    res.json({response: 'API_IN_PROGRESS'});

  } else{

    poopsRef.on('value', function(snapshot) {
      res.json(null != snapshot.val() ? snapshot.val() : {});
    }, function (errorObject) {
      res.json({response: 'FAIL'});
    });

  }
});

// API #4 Get poop by ID
router.get('/poops/:id', function(req, res){
  poopsRef
    .orderByKey()
    .equalTo(req.params.id)
    .on('value', function(snapshot) {
      res.json(null != snapshot.val() ? snapshot.val() : {});
    }, function (errorObject) {
      res.json({response: 'FAIL'});
    });
});

// API #8 Update a poop using ID
router.put('/poops/:id', function(req, res){
  var poop = poopModel.getPoopModel();
  poop.name = req.body.name;
  poop.source = req.body.source;
  poop.imgUrl = req.body.imgUrl;
  poop.date = req.body.date;
  poop.description = req.body.description;

  poopsRef
    .orderByKey()
    .equalTo(req.params.id)
    .once('value', function(snapshot) {
      if(snapshot.val()){
        poopsRef
          .child(req.params.id)
          .update(poop, function(err){
            if(err){
              res.json({response: 'FAIL'});
            } else{
              res.json({response: 'OK'});
            }
          });
      } else{
        res.json({response: 'NO_RECORD_FOUND'});
      }
    });
});

// API #9 Increase likes on a poop (URL hit will increase)
router.put('/poops/:id/like', function(req, res){
  poopsRef
    .orderByKey()
    .equalTo(req.params.id)
    .once('value', function(snapshot) {
      if(snapshot.val()){
        poopsRef
          .child(req.params.id)
          .update({'likes': snapshot.val()[req.params.id].likes + 1}, function(err){
            if(err){
              res.json({response: 'FAIL'});
            } else{
              res.json({response: 'OK'});
            }
          });
      } else{
        res.json({response: 'NO_RECORD_FOUND'});
      }
    });
});

// API #9 Post a comment on a poop using ID
router.post('/poops/:id/comment', function(req, res){
  poopsRef
    .orderByKey()
    .equalTo(req.params.id)
    .once('value', function(snapshot) {
      if(snapshot.val()){
        var comment = {
          userName: req.body.userName,
          content: req.body.content,
          date: req.body.date,
          likes: 0
        }
        poopsRef
          .child(req.params.id)
          .child('comments')
          .push().set(comment, function(err){
            if(err){
              res.json({response: 'FAIL'});
            } else{
              res.json({response: 'OK'});
            }
          });
      } else{
        res.json({response: 'NO_RECORD_FOUND'});
      }
    });
});

// API #10 Increase likes on a poop comment (URL hit will increase)
router.put('/poops/:poopId/comments/:commentId/like', function(req, res){
  poopsRef
    .orderByKey()
    .equalTo(req.params.poopId)
    .once('value', function(snapshot) {
      if(snapshot.val()){
        var currLikes = snapshot.val()[req.params.poopId].comments[req.params.commentId].likes;
        poopsRef
          .child(req.params.poopId)
          .child('comments')
          .child(req.params.commentId)
          .update({'likes': currLikes + 1}, function(err){
            if(err){
              res.json({response: 'FAIL'});
            } else{
              res.json({response: 'OK'});
            }
          });
      } else{
        res.json({response: 'NO_RECORD_FOUND'});
      }
    });
});

// API #12 Delete a comment on a poop
router.delete('/poops/:poopId/comments/:commentId', function(req, res){
  poopsRef
    .orderByKey()
    .equalTo(req.params.poopId)
    .once('value', function(snapshot) {
      if(snapshot.val()){
        var currLikes = snapshot.val()[req.params.poopId].comments[req.params.commentId].likes;
        poopsRef
          .child(req.params.poopId)
          .child('comments')
          .child(req.params.commentId)
          .remove(function(err){
            if(err){
              res.json({response: 'FAIL'});
            } else{
              res.json({response: 'OK'});
            }
          });
      } else{
        res.json({response: 'NO_RECORD_FOUND'});
      }
    });
});


// API #12 Delete a poop
router.delete('/poops/:id', function(req, res){
  poopsRef
    .orderByKey()
    .equalTo(req.params.poopId)
    .once('value', function(snapshot) {
      if(snapshot.val()){
        //var poopModel = new Firebase(FIREBASE_DB + 'poops/' + req.params.id);
        poopsRef.child(req.params.id).remove(function(err){
          if(err){
            res.json({response: 'FAIL', error: err});
          } else{
            res.json({response: 'OK'});
          }
        });
      } else{
        res.json({response: 'NO_RECORD_FOUND'});
      }
    });
});

module.exports = router;
