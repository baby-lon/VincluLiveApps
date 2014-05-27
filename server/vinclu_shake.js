var ws = require('websocket.io');
var idol_server = ws.listen(3100, function(){
	console.log(getCurrentTime() + 'idol server running');
});
var audience_server = ws.listen(3050, function(){
	console.log(getCurrentTime() + 'audience server running');
});

var idol_state = "";

audience_server.on('connection', function(socket){
	console.log(getCurrentTime() + 'connect audience:' + audience_server.clients.length);
	socket.on('close', function(){
		console.log(getCurrentTime() + 'close audience:' + audience_server.clients.length);
	});
});

idol_server.on('connection', function(socket){
	console.log(getCurrentTime() + 'connect idol:' + idol_server.clients.length);
	socket.on('message', function(data){
		console.log(getCurrentTime() + "receive idol : " + data);
		switch(data){
			case 'start':
			case 'end':
				idol_state = data;
				break;
		}
		audience_server.clients.forEach(function(client){
            if(client){
			    client.send(idol_state);
            }
		});
	});
	socket.on('close', function(){
		idol_state = 'close';
		console.log(getCurrentTime() + 'close idol:' + idol_server.clients.length);
	});
});

function getCurrentTime(){
	var d = new Date();
    return d.getFullYear()  + "-" +
     (d.getMonth() + 1) + "-" + 
     d.getDate() + " " + 
     d.getHours() + ":" + 
     d.getMinutes() + ":" + 
     d.getSeconds() + ' ';
 }