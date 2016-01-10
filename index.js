var express = require('express');
var bodyParser = require('body-parser');
var ops = require('./routes/operations');

var app = express();

app.set('port', (process.env.PORT || 5000));
// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));
app.use('/', ops);

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
