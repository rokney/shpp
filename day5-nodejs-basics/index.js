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
            io.emit('chat message', {msg: msg, nick: socket.nickname});
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
        io.sockets.emit('usernames', Object.keys(listSockets));
    }

});

http.listen(6630, function () {
    console.log('listening on *:3000');
});
