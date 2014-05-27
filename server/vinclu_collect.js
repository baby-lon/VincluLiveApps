var ws = require('websocket.io');

var timer_id = null;
var shake_count = 0;
var prev_shake_count = 0;

var light_threshold = 100;//光る閾値
var send_data = {
	count: 0,
	threshold: light_threshold
};
var master_data = {
	send_data: send_data,
	message: "",
	process: ""
}

var audience_server = ws.listen(3051, function(){
	console.log(getCurrentTime() + 'audience server running');
});
var master_server = ws.listen(3101, function(){
	console.log(getCurrentTime() + 'master server running');
})

audience_server.on('connection', function(socket){
	console.log(getCurrentTime() + 'connect audience:' + audience_server.clients.length);
	sendToClient(socket);
	socket.on('message', function(data){
		if(data != 'shake'){
			console.log('receive audience: ' + data);
		}
		//socket.broadcast.send('text');
		if(data == 'shake' && timer_id != null){
			shake_count++;
		}
	});
	socket.on('close', function(){
		console.log(getCurrentTime() + 'close audience:' + audience_server.clients.length);
	});
});

function sendToClient(client){
	send_data.count = shake_count;
	send_data.threshold = light_threshold;
	var json_text = JSON.stringify(send_data);
    if(client){
	    client.send(json_text);
	    console.log('send:' + shake_count + ', ' + light_threshold);
    }
}

function broadcastToClietns(){
	send_data.count = shake_count;
	send_data.threshold = light_threshold;
	var json_text = JSON.stringify(send_data);
	audience_server.clients.forEach(function(client){
        if(client){
		    client.send(json_text);
		    console.log('send:' + shake_count + ', ' + light_threshold);
        }
	});
}

var timerUpdate = function(){
//	console.log('interval');

	if(prev_shake_count != shake_count){
		broadcastToClietns();
	}
	prev_shake_count = shake_count;
}

master_server.on('connection', function(socket){
	console.log(getCurrentTime() + 'connect master:' + master_server.clients.length);

	// 返事を送る
	master_data.send_data.count = shake_count;
	master_data.send_data.threshold = light_threshold;
	master_data.message = 'receive';
	master_data.process = 'init';
	var json_data = JSON.stringify(master_data);
	socket.send(json_data);

	socket.on('message', function(data){
		console.log('receive master: ' + data);
		var is_valid = false;
		switch(data){
			case 'start':
				if(timer_id == null){
					timer_id = setInterval(timerUpdate, 100);
				}
				is_valid = true;
				break;
			case 'stop':
				if(timer_id != null){
				 	clearInterval(timer_id);
				 	timer_id = null;
				 }
				 is_valid = true;
			 	break;
			 case 'reset':
				shake_count = 0;
				prev_shake_count = 0;
				is_valid = true;
				broadcastToClietns();
			 	break;
		}

		//閾値の変更
		if(0 <= data.indexOf('threshold')){
			array_data = data.split(':');
			light_threshold = parseInt(array_data[1], 10);
			console.log('threshold:' + light_threshold);
			is_valid = true;
		}
		if(is_valid==true){
			master_data.send_data.count = shake_count;
			master_data.send_data.threshold = light_threshold;
			master_data.message = 'receive';
			master_data.process = 'result';
			var json_data = JSON.stringify(master_data);
			socket.send(json_data);
		}
	});
	socket.on('close', function(){
		console.log(getCurrentTime() + 'close master:' + master_server.clients.length);
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