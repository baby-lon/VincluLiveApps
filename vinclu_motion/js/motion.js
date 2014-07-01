
		$(document).ready(function(){
			vinclu_led = new VincluLed(100,100);
			vinclu_led.init();
			//読み込み完了時に行う処理
			$('#btnStart').click(function(){
				vinclu_led.on();
				vinclu_led.off();
			});
			is_init = true;

			var sample_count = 3;
			var fade_duration = 10;//何回の処理を掛けてmaxの明るさにするか？
		    var alpha_rotations = new Array();
		    var beta_rotations = new Array();

		    var bright_min = -0.35;
		    var bright_max = 0.0;
		    var bright_amount = 0;
		    var motion_mode = 0;

/*			$('#btnStart').click(function(){
				vinclu_led.on();
		        vinclu_led.setBrightness(-0.0);
				setTimeout(function(){
					vinclu_led.off();
				},100);	
			});	*/
			$('#btnSlow').click(function(){
				vinclu_led.on();
		        vinclu_led.setBrightness(-0.0);
				setTimeout(function(){
					vinclu_led.off();
				},100);
				$('#message_area').text("ゆっくりモード");
				motion_mode = 1;
			});				
			$('#btnHard').click(function(){
				vinclu_led.on();
		        vinclu_led.setBrightness(-0.0);
				setTimeout(function(){
					vinclu_led.off();
				},100);	
				$("#message_area").text("激しくモード");
				motion_mode = 2;
			});				

			window.addEventListener("devicemotion", function(event){

			    //加速度
			    var x = event.acceleration.x;
			    var y = event.acceleration.y;
			    var z = event.acceleration.z;

/*			    var txt  = "x:"+x+"<br>";
			        txt += "y:"+y+"<br>";
			        txt += "z:"+z+"<br>";
			        txt += "shake:"+shake_count+"<br>";

			    $('#shake_area').html(txt);*/
			}, true);
			window.addEventListener("deviceorientation", function(event){
				// 回転軸
				var alpha = event.alpha;   // z-axis
				var beta = event.beta;     // x-axis
				var gamma = event.gamma;   // y-axis

				var alpha_mod = alpha;
				if(240<alpha){
					alpha_mod = alpha - 360;
				}
				alpha_rotations.push(alpha_mod);
				while(sample_count+1 < alpha_rotations.length){//距離を求めたいのでほしいのはサンプル+1個
					alpha_rotations.shift();
				}
				var sum_alpha = 0.0;
				var ave_alpha = 0.0;
				if(2<=alpha_rotations.length){
					for(var i=0; i<alpha_rotations.length-1; i++){
						sum_alpha += alpha_rotations[i+1] - alpha_rotations[i];
					}
					ave_alpha = sum_alpha / (alpha_rotations.length-1);
				}

				beta_rotations.push(beta);
				while(sample_count+1 < beta_rotations.length){//距離を求めたいのでほしいのはサンプル+1個
					beta_rotations.shift();
				}
				var sum_beta = 0.0;
				var ave_beta = 0.0;
				if(2<=beta_rotations.length){
					for(var i=0; i<beta_rotations.length-1; i++){
						sum_beta += beta_rotations[i+1] - beta_rotations[i];
					}
					ave_beta = sum_beta / (beta_rotations.length-1);
				}

				if(motion_mode == 1){
					//ゆっくりモード
					if(1.0 < Math.abs(ave_beta)){
						if(bright_amount<=0){
							vinclu_led.on();
						}
						bright_amount+=3;
					}
					else{
						if(bright_amount==1){
							vinclu_led.off();
						}
						bright_amount--;
					}
					if(bright_amount < 0){
						bright_amount = 0;
					}
					if(fade_duration+15 < bright_amount){
						bright_amount = fade_duration+15;
					}
					if(0 < bright_amount){
						var blightness = bright_min + (bright_max - bright_min)/fade_duration * bright_amount;
						vinclu_led.setBrightness(blightness);
					}
				}
				else if(motion_mode == 2){
					//ゆっくりモード
					if(1.0 < ave_alpha ){
						if(bright_amount<=0){
							vinclu_led.on();
						}
						bright_amount+=3;
					}
					else{
						if(bright_amount==1){
							vinclu_led.off();
						}
						bright_amount--;
					}
					if(bright_amount < 0){
						bright_amount = 0;
					}
					if(fade_duration+15 < bright_amount){
						bright_amount = fade_duration+15;
					}
					if(0 < bright_amount){
						var blightness = bright_min + (bright_max - bright_min)/fade_duration * bright_amount;
						vinclu_led.setBrightness(blightness);
					}
				}

//				$('#orientation_area').html("明:" + bright_amount);
//				var txt = 'alpha(z-axis)=' + alpha_mod;
//				var txt = '回転：　<br>alpha(z-axis)=' + alpha + "<br> beta(x-axis)=" + beta + "<br> gumma(y-axis )=" + gamma;
//				$('#orientation_area').html(txt);
			},true);
		});