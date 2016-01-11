var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var listSockets = {};

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
    socket.on('new user', function (data, callback) {
        if (data in listSockets || data === '') {
            callback(false);
        } else {
            callback(true);
            socket.nickname = data;
            listSockets[socket.nickname] = socket;
            socket.broadcast.emit('new user', {nick: data});
            listSockets[data].emit('new user', {nick: null});
            updateNicknames();
        }
    });

    socket.on('chat message', function (msg, callback) {
        var inputMsg = msg.trim();
        if (inputMsg.substr(0, 3) === '/s ') {
            inputMsg = inputMsg.substr(3);
            var index = inputMsg.indexOf(' ');
            if (index !== -1) {
                var userName = inputMsg.substr(0, index);
                var inputMsg = inputMsg.substr(index + 1);
                if (userName in listSockets) {
                    listSockets[userName].emit('secret', {msg: inputMsg, nick: socket.nickname});
                } else {
                    callback('Enter a valid user name');
                }
            } else {
                callback('usage: "/s UserName your message" for send secret message');
            }
        } else {
            socket.broadcast.emit('chat message', {msg: msg, nick: socket.nickname});
            listSockets[socket.nickname].emit('chat message', {msg: msg, nick: null})
        }
    });

    socket.on('disconnect', function (data) {
        if (!socket.nickname) {
            return;
        }
        delete listSockets[socket.nickname];
        updateNicknames();
    });

    function updateNicknames() {
        io.emit('usernames', Object.keys(listSockets));
    }

});

http.listen(6630, function () {
    console.log('listening on *:6630');
});
