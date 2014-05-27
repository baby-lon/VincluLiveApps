// WebSocketサーバに接続
var ws = new WebSocket('ws://vinclu.luna.ddns.vc:3051/');
 
// エラー処理
ws.onerror = function(e){
}

// WebSocketサーバ接続イベント
ws.onopen = function() {

};
 
// メッセージ受信イベントを処理
var is_blink = false;
ws.onmessage = function(event) {
  var parse_data = $.parseJSON(event.data);
  var cnt = parseInt(parse_data.count);
  var th = parseInt(parse_data.threshold);
// $('#message_area').text(cnt + ', ' + th);

  if(th <= cnt){
    if(is_blink == false && vinclu_led != null){
      vinclu_led.off();
      vinclu_led.blinkOn();
    }
    is_blink = true;
  }
  else{
    if(is_blink == true && vinclu_led != null){
      vinclu_led.off();
      vinclu_led.blinkOff();
    }
    is_blink = false;

    if(vinclu_led != null){
      var blight_max = 1.0;
      var gain = ((cnt / th) - 0.5) * blight_max;
      if(blight_max < gain){
        gain = blight_max;
      }
      if(gain < 0){
        gain = 0;
      }
      if(0 < gain){
        //vinclu_led.setBrightness(gain);
      }
    }
    //グラフの表示
    var max_height = document.documentElement.clientHeight-70;
    var h = (cnt / th) * max_height;
    var padd = max_height - h;
    var duration = '0.3s';

    $('#graph_area').css({
      height: h + 'px',
      marginTop: padd + 'px',
      WebkitTransition: 'height '+ duration +' ease-out , margin-top ' + duration + ' ease-out',
      MozTransition: 'height '+ duration +' ease-out , margin-top ' + duration + ' ease-out',
      MsTransition: 'height '+ duration +' ease-out , margin-top ' + duration + ' ease-out',
      OTransition: 'height '+ duration +' ease-out , margin-top ' + duration + ' ease-out',
      transition: 'height '+ duration +' ease-out , margin-top ' + duration + ' ease-out'
    });
  }
};