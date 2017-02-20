/**
 * Created by sebastijan on 18.02.17.
 */


// loading the modules
var express = require('express'),
    mongoose = require('mongoose'),
    body_parser = require('body-parser');

// instantiating the app
var app = express();

// setting up moongoose
mongoose.connect('mongodb://nbu_online_user:NbuDatabasePassword2016@ds155509.mlab.com:55509/jspsych_db' || 'mongodb://localhost/jspsych');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function callback() {
    console.log('database opened');
});

var emptySchema = new mongoose.Schema({}, { strict: false });
var Entry = mongoose.model('Entry', emptySchema);

// static middleware
app.use(express.static(__dirname));
app.use('/jsPsych', express.static(__dirname + "/jsPsych-5.0"));

// body parsing middleware
app.use(body_parser.json());

// view location, set up serving static html
app.set('views', __dirname);
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// routing
app.get('/', function(request, response) {
    response.render('index.html');
});

app.get('/experiment', function(request, response) {
    response.render('experiment.html');
});

app.get('/finish', function(request, response) {
    response.render('finish.html');
});

app.post('/experiment-data', function(request, response){
    Entry.create({
        "data":request.body
    });
    response.end();
});

// starting the server
var server = app.listen(process.env.PORT || 3000, function(){
    console.log("Listening on port %d", server.address().port);
});




