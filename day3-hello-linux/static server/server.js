var express = require('express'),
app = express(),
port = process.env.PORT || 6630;

app.use(express.static(__dirname + '/Jupither'));
app.listen(port);