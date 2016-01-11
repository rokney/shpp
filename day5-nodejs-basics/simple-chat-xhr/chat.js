/**
 * Created by rokne on 10.01.2016.
 */
var clients = [];

exports.subscribe = function(req, res){
    console.log("subscribe");

    clients.push(res);

    res.on('close', function(){
       clients.splice(clients.indexOf(res), 1);
    });
}

exports.publish = function(message){
    console.log('publish "%s"', message);

    clients.forEach(function(res){
        res.end('client: ' + clients.indexOf(res) + ' ' + message);
    });
    clients = [];
}