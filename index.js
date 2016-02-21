var express = require('express');
var bodyParser = require('body-parser');
var ops = require('./routes/operations');

var app = express();

// Registering CORS
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.set('port', (process.env.PORT || 8080));
// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));
app.use('/social/api', ops);

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
