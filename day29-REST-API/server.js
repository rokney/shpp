var express = require('express');
var morgan = require('morgan');
var log = require('./libs/logs')(module);
var app = express();
var bodyParser = require('body-parser');

var streamIdList = [];

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

function findStreamId(streamId) {
    for (var i = 0; i < streamIdList; i++) {
        if (streamIdList[i].id == streamId) {
            return i;
        }
    }
    return -1;
}

app.get('/api', function (req, res) {
    var query = require('url').parse(req.url, true).query;
    var user = {
        userId: query.userId,
        streamId: query.streamId
    }
    if (!user.userId) {
        res.status(500);
        res.send({error: 'Not found userId'});
    }
    if (!user.streamId) {
        res.status(500);
        res.send({error: 'Not found streamId'});
    }
    var currStream = findStreamId(user.streamId);
    if (currStream < 0) {
        res.status(500);
        res.send({error: 'Not found stream'});
    } else {
        if (streamIdList[currStream].whiteList.indexOf(user.userId) > -1) {
            res.status(200);
            res.send({data: "Access is allowed"})
        } else {
            res.status(400);
            res.send({error: "Access is denied"});
        }
    }
})

app.post('/api', function (req, res) {
    var streamId = req.body.streamId;
    if (!streamId) {
        res.status(500);
        res.send({error: "Not found streamId"});
    } else {
        var newUserId = req.body.userId;
        if (!newUserId) {
            res.status(500);
            res.send({error: "not found userId"});
        } else {
            var currStream = findStreamId(streamId);
            if (currStream < 0) {
                res.status(500);
                res.send({error: 'Not found stream'});
            } else {
                streamIdList[currStream].whiteList.push(newUserId);
                res.status(200);
                res.send({data: "New user added"});
            }
        }
    }
});

app.put('/api', function (req, res) {
    var streamId = req.body.streamId;
    if (!streamId) {
        res.status(500);
        res.send({error: "Not found streamId"});
    } else {
        if (findStreamId(streamId) > -1) {
            res.status(500);
            res.send({error: "This stream is already used"})
        }
        var newStream = {};
        newStream.id = streamId;
        newStream.whiteList = [];
        streamIdList.push(newStream);
        res.status(200);
        res.send({data: "New stream added"});
    }
});

app.delete('/api', function (req, res) {
    var streamId = req.body.streamId;
    if (!streamId) {
        res.status(500);
        res.send({error: "Not found streamId"});
    } else {
        var currStream = findStreamId(streamId);
        if (currStream < 0) {
            res.status(500);
            res.send({error: 'Not found stream'});
        } else {
            delete streamIdList[currStream];
            res.status(200);
            res.send({data: "Stream is successfully removed"})
        }
    }
});


app.use(function (req, res, next) {
    res.status(404);
    log.debug('Not found URL: %s', req.url);
    res.send({error: 'Not found'});
    return;
});

app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    log.error('Internal error(%d): %s', res.statusCode, err.message);
    res.send({error: err.message});
    return;
});

app.listen(6633, function () {
    log.info("Express server listening on port 6633");
})