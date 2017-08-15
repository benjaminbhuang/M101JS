var express = require('express'),
    app = express(),
    engines = require('consolidate'),
    MongoClient = require('mongodb').MongoClient,
    assert = require('assert'),
    bodyParser = require('body-parser');

app.engine('html', engines.nunjucks);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use(bodyParser());


function errorHandler(err, req, res,next) {
    console.error(err.message);
    console.error(err.stack);
    res.status(500);
    res.render('error_template', {error: err});
}

app.use(errorHandler);

app.get('/:name', function (req, res, next) {

    var name = req.params.name;
    var getvar1 = req.query.getvar1;
    var getvar2 = req.query.getvar2;

    res.render('hello', {name: name, getvar1: getvar1, getvar2: getvar2});
});

app.get('/', function (req, res, next) {
    res.render('fruit_picker', {'fruits': ['apple', 'orange', 'banana', 'peach']});
});

app.post('/favorite_fruit', function (req, res, next) {
    var favorite = req.body.fruit;
    if(typeof favorite == 'undefined') {
        next(Error('Please choose a fruit!'));
    }else{
        res.send('your favorite fruit is '+ favorite);
    }
});


MongoClient.connect('mongodb://localhost:27017/video', function(err, db) {

    assert.equal(null, err);
    console.log("Successfully connected to MongoDB.");

    app.get('/', function(req, res){

        db.collection('movies').find({}).toArray(function(err, docs) {
            res.render('movies', { 'movies': docs } );
        });

    });

    app.use(function(req, res){
        res.sendStatus(404);
    });

    var server = app.listen(8000, function() {
        var port = server.address().port;
        console.log('Express server listening on port %s.', port);
    });

});




