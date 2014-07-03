var vinclu_led = null;
var is_init = false;

function ajust_graph(){
  var ll = $(window).width()/2 - $('#graph_area').width() / 2;
  $('#graph_area').css({
    left: ll + 'px'
  });
}