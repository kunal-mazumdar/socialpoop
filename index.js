var express = require('express');
var app = express();
var Firebase = require("firebase");

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

var ref = new Firebase("https://resplendent-torch-2012.firebaseio.com/");

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.get('/save/:name', function(request, response) {
  var usersRef = ref.child("users");
    usersRef.set({
      name: request.params.name
    });
    response.json({response: 'OK'});
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
