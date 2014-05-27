// WebSocketサーバに接続
var ws = new WebSocket('ws://bm-node.sun.ddns.vc:3050/');
 
// エラー処理
ws.onerror = function(e){
}

// WebSocketサーバ接続イベント
ws.onopen = function() {

};
 
// メッセージ受信イベントを処理
ws.onmessage = function(event) {
  $('#message_area').text(event.data);
  switch(event.data){
    case 'start':
      if(vinclu_led != null){
        vinclu_led.blinkOn();
      }
      break;
    case 'end':
      if(vinclu_led != null){
        vinclu_led.blinkOff();
      }
      break;
  }
};