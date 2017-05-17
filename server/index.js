var express = require('express')
var bodyParser = require('body-parser');
var cors = require('cors')

var app = express()

var appController = require('./controllers/appController');


app.set('port', process.env.PORT || 3001);
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/', appController.fuzzify);

app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});

module.exports = app;