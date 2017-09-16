$(function() {
	var pointY = 42;
	var Ainit = true;
	switch (Swindth){
		case 1024:
			$('.animation').css({"transform":"scale(0.52) translateX(-240px)"});
			break;
		case 1280:
			$('.animation').css({"transform":"scale(0.65) translateX(-110px)"});
			break;
		case 1366:
			$('.animation').css({"transform":"scale(0.7) translateX(-70px)"});
			break;
		case 1440:
			$('.animation').css({"transform":"scale(0.74) translateX(-32px)"});
			break;
		case 1600:
			$('.animation').css({"transform":"scale(0.82) translateX(0px)"});
			break;
		case 1680:
			$('.animation').css({"transform":"scale(0.86) translateX(0px)"});
			break;
		case 1920:
			$('.animation').css({"transform":"scale(0.98) translateX(0px)"});
			break;
	}
	$('#loudou_hype_container').css({"transform":"scale(" + (Swindth / 3840 * 7 / 5.2) + ") translateY(0rem)"});
	var canvas = document.getElementById('canvas');
	var context = canvas.getContext('2d');
	var offCanvas = document.createElement('canvas');
	var offContext = offCanvas.getContext('2d');
	var pointY0 = pointY + 141;
	var halfWidth = 390;
	var lines = [{
		start: {
			x: canvas.width / 2,
			y: pointY
		},
		end: {
			x: canvas.width / 2,
			y: pointY + 36
		}
	}, {
		start: {
			x: canvas.width / 2,
			y: pointY + 36 + 130
		},
		end: {
			x: canvas.width / 2,
			y: pointY + 36 + 130 + 22
		}
	}, {
		start: {
			x: canvas.width / 2 - 190,
			y: pointY0
		},
		end: {
			x: canvas.width / 2 - 190 - halfWidth,
			y: pointY0
		}
	}, {
		start: {
			x: canvas.width / 2 - 190 - halfWidth,
			y: pointY0
		},
		end: {
			x: canvas.width / 2 - 190 - halfWidth,
			y: pointY0 + 46
		}
	}, {
		start: {
			x: canvas.width / 2 + 190,
			y: pointY0
		},
		end: {
			x: canvas.width / 2 + 190 + halfWidth,
			y: pointY0
		}
	}, {
		start: {
			x: canvas.width / 2 + 190 + halfWidth,
			y: pointY0
		},
		end: {
			x: canvas.width / 2 + 190 + halfWidth,
			y: pointY0 + 46
		}
	}];
	var points = [{
		x: canvas.width / 2,
		y: pointY
	}, {
		x: canvas.width / 2,
		y: pointY + 36 + 130 + 22
	}, {
		x: canvas.width / 2 - 190 - halfWidth,
		y: pointY0 + 46
	}, {
		x: canvas.width / 2 + 190 + halfWidth,
		y: pointY0 + 46
	}];
	var imgs = {
		'down': {
			'src': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACEAAABsCAMAAADT/CvvAAABj1BMVEUAAAAAo/8Bw/8CyP8Awv8Cy/8AwP8Bvf8Byv8Ayf8Aw/8Av/8AwP8AvP8Aw/8Awv8Asv8Ax/8AzP8Awv8AtP8AxP8Aw/8Axv8AxP8A0v8Axf8Axv8Ax/8Aw/8Axf8Axv8AwP8Azf8AzP8Axv8Ayf8Axv8Aw/8Awv8Ayf9c+fBj++0Dx/8Bxf9j++5k/O4Ayv9k/O5k/O5k++1j+u1j/O1j++5g+O1k++4Ax/8Ezf5i++1i+u1h+e1j++1e9+441/NM+vFQ8fFS9fFW9vFY9+9f+u5h+u1h++5i++5k++056/Vk++5e9+805/dW8/Fk++1R7/Iq3vdk++1M7PEP0f9G6vRj+e1g+/Bc9e4AzP9b9O5X8vIKzf5U9fFP7fJC3PI62PMA1P9l/O0c1PpA6PM96Pcv4fkp0/gZzvpO/fBN8fBE9PJj++1k/O027vU45PY35PU24vUy5Pgv4vYi2vhm/O0V0fxg+O025vcAy/8i0/of0/pS7vJN5vdJ6fY35vY34vIR0vw75/c35PNO/+8e82kDAAAAhHRSTlMAAwcDBQkRCw0iFBYZDyofCTAfGg0cHTkoDzwzJScXLCQZLTY+T0EyQdCORULApjS1rKGZlIdrZElEvIN/c3EQ6+Dd2dbMysbEsZV6d3ZlXl1bWVZST05CPDk1LyopIRkUEblQSEM6Ny775L64nJaHgG1nYVVTS0c9NjMwJR4cjIxJQUHE50WyAAAFlUlEQVRIx9TSTQqEMAwF4KmaHyqFLrLxNN5EvYieffIsHUaLs59AEZKPFwK+/rLCp36B+nma9/35UE8A4oEUMAx4hTwACK+WYB7OWdcVAXMR6BRQyNloIjDP1GU3TYgDCAAvJxBOriAggsSLEFJ6bYSIziJNCESAII+YXRBBoHlfQmI2z2aSb2ugISiLpW1LLggC7dsSMeVtYzW5rfG4IkwTrysnNaprqvBEXKJpgpiS4hpvfgvcKjpxPI7IkwrubUQW4xj3PUY2yRfRV6Ecx2UZI2sVfRX4NTIZ8wgxMhvlAe0qAkSJeNNRBzkKwmAYhjOi1b8t1rSWYAIVLiErvYKJCyEgW/UCRqOuZi4+/TvMjBBc8wS+viQ1z6dxL3Hio0fwuub9whZFwdO6TjkKW7UtsKhPWKqqSqWM+Fi1K2ZznzKlq0orRv35rC08Jwg1qS5LnRpKnPAagXXxKzhDi7IUGoeMUNhHv2LoBOOBKAoRcObEsCPGVqhAFoUMFE7tEb4VQua5FG8FNVpAnoPQhnaE53IQamfA9Qp2CCVjN7UlJigk7PcAKCY9YkG5gGS/T0BwtuiI5rBKQHS5RCBUc9yWmDVit2vErE9omYS7XZhI3St8YjREh+32EEFgiN8RAwzGA4itOFvBMcigKyiKc5ad4/dCQPjIskcIolcQqkQS3rPsHiZCUfIivH8RTU+r1WkayT/hOeHup/mCKRmjOE5jqdhi7i68H+E1Qltx3GxQ6D5hg0G8vK3Xt2UINtm4I0ZjDBYuv9brTxQGf/+LGDjxXWe9PScNRGEAH9FAlkLCRmHDJiUhNxAoCAUHpDr1bqt16rQ+dMaXtvbB+3Wc8Umd4Q/3201DTVO/R+bHspyzm5waMb2T289OPJPUpMilxDWU1NXoydOnr6nm1kr5axlRLBkQr2NhlIoZoULYGn25sfGSajaEek5UIHQp5kLoEJW0KKhFFMxp7c3ney0HJSuqhXOiLIW1N5nsWUKslDNi5SpZ9azdyWTX8lZJSlxaCtPzdzudXd8zl+JSIhSIKtHo4Hmn83xANVKFUC4SvhA+RC0j0LiaEDfH45tMClHUrGixO+PxHdbKiFwiLHZnff0ZszQXQrRuKeSd1F3HYs+kcFwddyoWAKcCRXcsvvHhwwa3HJT9VIBIUYnFgM9HozkfxKKyFFekaOqrns8no9GE+96q3pTiyjlBfd7p9zvcpxeKkhDBuN8fB0KU0kLu1DApC9b7w/WAUdOAUNKiCNFi0Wg4HEWsBVHMCoI1ov7WsB9hDSKEciYUccSI2eLt4dbWsM1RdnHIUqIMoVm8t3Xjxo0et4QoZ4QL0QV4P4Nw/yuOjo4gLl6jStCWP7eQH2gMqZ4X+RUpfqzdWls7DtBc3P6MsB0/OF5DjiPfsbOiUbOp3/7+BPke+dSuNdJCzTfQFtZ+8Rh50WZoTCOvXigeIf8TaNxB79tD5FvvAK3LiKZhWkH363XkazcYmEYTQlmKgmi+NgimX4T4Mg0GGkH7C8ka8fEgr35G050HyM40+umQ+ICcrqFANInHeuHOfWQn7DGPyF9ZikIsZuHne8jncCYF2v/vTksu5bPw013kUzjj1L2aV9M1bboe64a/325uvv0VdpnnNs9qejkWRIjtN4vFm20hSCwuS3EZol4ijt8O3y2Qd2Hbx3+pQ8RzXywaumYF049CfJwGlqY3YiHvPkQFJ8imB9H+5mKxuR8dUBsnqALxzxPmEEVt8d7+9vZ+D2fdKB2mn0E5pSyfUowHAWfxc0zJJWJ5LUE8alnUAzi7lCLxHF7HgGLYpqaZtoERpS7AFYDlIrlCHZNS1dB1o4pJqV7IJUskO5ED7GFxBSkeyhE22UXyxpV7UesyqtxD8rZNiDBAMuL7aQCCgCQBwAen4C9oY84rpF/q1wAAAABJRU5ErkJggg=='
		},
		'left': {
			'src': 'data:image/png;base64,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'
		},
		'right': {
			'src': 'data:image/png;base64,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'
		},
		'shortDown': {
			'src': 'data:image/png;base64,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'
		}
	};

	var event0 = (function() {
		var listCache = {},
			listen,
			trigger,
			remove;

		listen = function(key, fn) {
			if(!listCache[key]) {
				listCache[key] = [];
			}
			listCache[key].push(fn);
		};

		trigger = function() {
			var key = Array.prototype.shift.call(arguments),
				fns = listCache[key];
			if(!fns || !fns.length) {
				return;
			}
			for(var i = 0, len = fns.length; i < len; i++) {
				fns[i].apply(this, arguments);
			}
		};

		remove = function(key, fn) {
			var fns = listCache[key];
			if(!fns) {
				return false;
			}
			if(!fn) {
				fns && (fns.length = 0);
			} else {
				for(var i = 0, len = fns.length; i < len; i++) {
					var _fn = fns[i];
					if(_fn === fn) {
						fns.splice(i, 1)
					}
				}
			}
		};

		return {
			listen: listen,
			trigger: trigger,
			remove: remove
		}
	})();

	/**
	 * 预加载图片
	 * @param images 期待数据格式{ img1:{src:''},img2:{src:''} }
	 * @param callback
	 */
	function loadImage(images, callback) {
		//加载完成图片的计数器
		var count = 0;
		//全部图片加载成功的标志位
		var success = true;
		//每个图片的ID生成
		var __id = 0;

		for(var key in images) {
			if(!images.hasOwnProperty(key)) continue;
			var item = images[key];
			count++;
			item.id = '_img_' + key + getId();
			item.img = new Image();
			doLoad(item);
		}

		function doLoad(item) {
			item.status = 'loading';
			var img = item.img;

			img.onload = function() {
				item.status = 'loaded';
				done();
			};
			img.onerror = function() {
				success = false;
				item.status = 'error';
				done();
			};
			img.src = item.src;

			/*
			 * 每张图片加载完成的回调函数
			 * */
			function done() {
				img.onload = img.onerror = null;
				if(!--count) {
					callback(success)
				}
			}

		}

		function getId() {
			return ++__id;
		}
	}
	/**
	 * 创造离屏canvas
	 * @param img
	 */
	window.callback = function callback() {
		lineMove(context, [{
			line: lines[0],
			img: imgs['down'].img,
			bool: true
		}], 1000, step2);

		function step2() {
			var line1 = {
				start: {
					x: canvas.width / 2,
					y: pointY + 36 + 130
				},
				//这里让中线第二段动画执行3/4；
				end: {
					x: canvas.width / 2,
					y: pointY + 36 + 130 + 22 * 3 / 4
				}
			};
			lineMove(context, [{
				line: line1,
				img: imgs['down'].img,
				bool: true
			}, {
				line: lines[2],
				img: imgs['left'].img
			}, {
				line: lines[4],
				img: imgs['right'].img
			}], 2000, step3)
		}

		function step3() {
			var line1 = {
				start: {
					x: canvas.width / 2,
					y: pointY + 36 + 130 + 22 * 3 / 4
				},
				//这里让中线第二段动画执行1/4；
				end: {
					x: canvas.width / 2,
					y: pointY + 36 + 130 + 22
				}
			};
			var line2 = {
				start: {
					x: canvas.width / 2 - 190 - halfWidth,
					y: pointY0
				},
				end: {
					x: canvas.width / 2 - 190 - halfWidth - imgs['left'].img.width,
					y: pointY0
				}
			};
			var line4 = {
				start: {
					x: canvas.width / 2 + 190 + halfWidth,
					y: pointY0
				},
				end: {
					x: canvas.width / 2 + 190 + halfWidth + imgs['right'].img.width,
					y: pointY0
				}
			};

			lineMove(context, [{
				line: line1,
				img: imgs['down'].img,
				bool: true,
				cut: {
					x: canvas.width / 2,
					y: pointY + 36 + 130
				}
			}, {
				line: lines[3],
				img: imgs['down'].img,
				bool: true
			}, {
				line: lines[5],
				img: imgs['down'].img,
				bool: true
			}], 800, function() {
				if($('.controll').hasClass('stop')) {
					callback();
				} else {
					pageAnimate();
				}
			})
		}
	}
	loadImage(imgs, callback);

	//画背景图
	var bg = function(context, lines, points) {
		function drawLine(line) {
			context.beginPath();
			context.moveTo(line.start.x, line.start.y);
			context.lineTo(line.end.x, line.end.y);
			context.stroke();
			context.closePath();
		}

		function drawPoint(point) {
			context.beginPath();
			context.arc(point.x, point.y, 5, 0, Math.PI * 2, false);
			context.fill();
		}
		context.save();
		context.strokeStyle = '#65fff1';
		context.fillStyle = '#65fff1';
		context.lineWidth = 2;
		for(var j = 0, len = points.length; j < len; j++) {
			drawPoint(points[j])
		}
		for(var i = 0, len = lines.length; i < len; i++) {
			drawLine(lines[i])
		}

		context.restore();
	};

	var lineMove = function(context, arry, time, callback) {
		var lastTime = +new Date();
		var temline = [];
		var line = {};

		for(var i = 0, len = arry.length; i < len; i++) {
			line.sx = arry[i].line.start.x;
			line.sy = arry[i].line.start.y;
			line.dx = arry[i].line.end.x - arry[i].line.start.x;
			line.dy = arry[i].line.end.y - arry[i].line.start.y;
			line.angle = 180 * Math.atan2(line.dy, line.dx) / Math.PI;
			line.img = arry[i].img;
			line.num = arry[i].num;
			line.bool = arry[i].bool;
			line.cut = arry[i].cut;

			temline.push($.extend(true, {}, line));
		}

		//用于绘制单独的point
		function drawPoint(obj, percent) {
			var x = obj.dx * percent;
			var y = obj.dy * percent;
			var res = {};
			switch(obj.angle) {
				case 0: //right
					res.x = x + obj.sx - obj.img.width + 8;
					res.y = y + obj.sy - obj.img.height / 2;
					break;
				case 90: //down
					res.x = x + obj.sx - obj.img.width / 2;
					res.y = y + obj.sy - obj.img.height + 8;
					break;
				case 180: //left
					res.x = x + obj.sx - 8;
					res.y = y + obj.sy - obj.img.height / 2;
					break;
			}
			if(obj.bool !== undefined) {
				cutPic(obj);
			} else {
				context.drawImage(obj.img, res.x, res.y);
			}

			function cutPic(obj, angle) {
				offCanvas.setAttribute('width', obj.img.width);
				offCanvas.setAttribute('height', obj.img.height);
				offContext.drawImage(obj.img, 0, 0);
				var cx = obj.sx - res.x;
				var cy = obj.sy - res.y;
				if(obj.cut !== undefined) { //如果cut点不为undefined的话就用配置好的cut，为undefined就用运动起始点
					cx = obj.cut.x - res.x;
					cy = obj.cut.y - res.y;
				}
				switch(obj.angle) {
					case 0: //right
						offContext.clearRect(0, 0, cx, obj.img.height);
						break;
					case 90: //down
						offContext.clearRect(0, 0, obj.img.width, Math.floor(cy));
						break;
					case 180: //left
						offContext.clearRect(0, 0, cx, obj.img.height);
						break;
				}
				var imgData = offContext.getImageData(0, 0, offCanvas.width, offCanvas.height);

				context.putImageData(imgData, res.x + 1, res.y);
			}

		}

		function move() {
			var now = +new Date();
			var percent = (now - lastTime) / time;
			if(percent < 1) {
				window.requestAnimationFrame(move)
			} else {
				if(callback) callback();
			}

			//清空画布
			context.clearRect(0, 0, canvas.width, canvas.height);

			//绘制运动部分线条
			for(var i = 0, len = temline.length; i < len; i++) {
				context.save();
				drawPoint(temline[i], percent);
				context.restore();
			}

			//重绘背景
			bg(context, lines, points);
		}
		move();
	};
	
	var animation = window.animation;
	
	
	var $demo = document.getElementsByClassName('page_animate');
	
	
	var image = [`${basePath}pages/imgs/page_animate.png`];
	
	
	var demoMap = [];
	
	
	for(var index = 0; index < 21; index++) {
		demoMap.push(`${(-0.075 - index * 1.375) * REM} 0`);
	}
	
	demoMap = demoMap.reverse();
	
	var demoMap2 = JSON.parse(JSON.stringify(demoMap)).reverse();
	demoMap2.shift();
	demoMap = demoMap.concat(demoMap2);
	
	function pageAnimate(){
		Array.prototype.forEach.call($demo, function(v, i) {
			var demoAnimation = animation().loadImage(image).changePosition(v, demoMap, image[0]).repeat(0).then(function(){
				demoAnimation.dispose();
				$(v).css('display', 'none');
				if(!i) {
					callback();
				}
			});
			$(v).css('display', 'block');
			if($(v).siblings('.container').hasClass('flap')) {
//				console.log(2)
			} else {
//				console.log(1)
			}
			demoAnimation.start(40);
		});
	}
	
//	$('.setting').click(pageAnimate)
})