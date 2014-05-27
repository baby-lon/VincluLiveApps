// WebSocketサーバに接続
var ws = new WebSocket('ws://vinclu.luna.ddns.vc:3101/');
 
// エラー処理
ws.onerror = function(e){
}

// WebSocketサーバ接続イベント
ws.onopen = function() {

};
 
// メッセージ受信イベントを処理
ws.onmessage = function(event) {
	var parse_data = $.parseJSON(event.data);
	$('#message_area').text(parse_data.message);
	if(parse_data.process == 'init'){
		$('#txtThreshold').val(parse_data.send_data.threshold);
	}
};