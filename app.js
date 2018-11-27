var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var mongojs = require('mongojs');
var db = mongojs('templatebindingsexameple', ['list']);

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/client')));

app.get('/', function (req, res) {
    res.send('It Works!');
});

app.get('/list', function (req, res) {
    db.list.find(function (err, docs) {
        if (err) {
            res.send(err);
        } else {
            console.log('Getting list...');
            res.json(docs);
        }
    })
});

app.post('/list', function (req, res) {
    db.list.insert(req.body, function (err, doc) {
        if (err) {
            res.send(err);
        } else {
            console.log('Posting list');
            res.json(doc);
        }
    })
});

app.delete('/list/:id', function (req, res) {
    db.list.remove({
        _id: mongojs.ObjectId(req.params.id)
    }, function (err, doc) {
        if (err) {
            res.send(err);
        } else {
            console.log('Deleting list');
            res.json(doc);
        }
    });
});

app.put('/list/:id', function (req, res) {
    db.list.findAndModify({
        query: {
            _id: mongojs.ObjectId(req.params.id)
        },
        update: {
            $set: {
                name: req.body.name,
                type: req.body.type,
                deadline: req.body.deadline
            }
        }, new: true,
    }, function (err, doc) {
        if (err) {
            res.send(err);
        } else {
            console.log('Updating list');
            res.json(doc);
        }
    });
});

app.listen(3000);
console.log('Running on port 3000...')