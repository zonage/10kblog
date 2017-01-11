var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');


mongoose.connect('mongodb://localhost/db');

//var db = mongoose.connection;


var blogModel = mongoose.model('Blog', {
    id: Number,
    title: String,
    date: {type: Date, default: Date.now },
    content: String,
    image: String
});


app.listen(8080);
console.log("App listening on port 8080");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(express.static(__dirname + '/public'));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));

app.get('/api', function(req, res) {
    //res.send('Welcome to my world... (BLOG)');

    blogModel.find(function(err, entries) {
        if (err) res.send(err);
        res.json(entries);
    });
});

app.post('/api', function(req, res, next) {
    console.log(req.body);
    blogModel.create(req.body ,
        function (err, entry) {
            if (err) res.send(err);

            blogModel.find(function(err, entries) {
                if (err) res.send(err);
                res.json(entries);
            });
        }
    );
    }
);

app.delete('/api/:blogModel_id', function(req, res) {
    console.log(req.params);
    blogModel.remove({
        _id : req.params.blogModel_id
    }, function(err) {
        if (err) res.send(err);
        blogModel.find(function(err, entries) {
            if (err) res.send(err);
            res.json(entries);
        });
    });
});

app.get('*', function(req, res) {
    res.sendFile('./public/index.html', { root: '/Users/ttcdev/Documents/blog'});
});