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


function errorHandler(err, req, res, next) {
    console.error(err.message);
    console.error(err.stack);
    res.status(500);
    res.render('error_template', {'error': err});
}

app.use(errorHandler);


app.get('/', function (req, res, next) {
    res.render('enter_movies');
});

app.post('/enter_movies', function (req, res, next) {
    var title = req.body.title;
    var year = req.body.year;
    var imdb = req.body.imdb;

    if (typeof title == 'undefined' || title == '' ||
        typeof year == 'undefined' || year == '' ||
        typeof  imdb == 'undefined' || imdb == ''
    ) {

        next(Error('all fields required!'));

    } else {
        var movie = {'title': title, 'year': year, 'imdb': imdb};

        MongoClient.connect('mongodb://localhost:27017/video', function (err, db) {

            assert.equal(null, err);
            console.log("Successfully connected to MongoDB.");

            db.collection('movies').insertOne(movie);

            db.collection('movies').find({}).toArray(function (err, docs) {
                res.render('movies', {'movies': docs});
            });

        });
    }
});


app.use(function (req, res) {
    res.sendStatus(404);
});

var server = app.listen(8000, function () {
    var port = server.address().port;
    console.log('Express server listening on port %s.', port);
});




