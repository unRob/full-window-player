console.log('yay!');
(function main(){
	var $ = function(i){ return document.querySelector(i); };
	var $$ = function(i){ return document.querySelectorAll(i); };
	var player;
	var yt_ready = false;
	var videos = [];

	var setup = function(){
		var ytapi = document.createElement('script');
		ytapi.src = "https://www.youtube.com/iframe_api";
		var firstScriptTag = document.getElementsByTagName('script')[0];
		firstScriptTag.parentNode.insertBefore(ytapi, firstScriptTag);

		var style = document.createElement('link');
		style.rel = 'stylesheet';
		style.href = "https://unrob.github.io/youtube-tv/yttv.css";
		document.head.appendChild(style);
	};
	setup();


	window.onYouTubeIframeAPIReady = function() {
		console.log('ready!');
		videos.length > 0 && render();
		yt_ready = true;
	};


	var page = window.location.pathname;
	var template = '<button id="yttv-close">x</button><div id="yttv-video-player"></div>';

	if (!$("#yttv-container")) {
		var container = document.createElement('div');
		container.id = "yttv-container";
		container.class = "hidden";
		container.innerHTML = template;
		document.body.appendChild(container);

		$('#yttv-close').addEventListener('click', function(evt){
			evt.preventDefault();
			player && player.destroy();
			$('#yttv-container').className = 'hidden';
		});
	}


	var render = function(){
		console.log("rendering");
		container.class = "";

		var ids = videos.map(function(v){ return v.id; });
		console.log(ids.join(','));
		player = new YT.Player('yttv-video-player', {
			height: window.innerHeight,
			width: window.innerWidth,
			playerVars: {autoplay: true}
		});

		player.addEventListener('onReady', function(evt){
			console.log('player ready');
			evt.target.loadPlaylist({playlist: ids.join(','), suggestedQuality: 'hd1080'});
		});

		player.addEventListener('onError', function(evt){
			console.log("error", evt.data);
		});


		console.log(player.getOptions());
	};

	switch (page) {
		case "/feed/subscriptions":
			var items = $$('.feed-item-container');
			[].forEach.call(items, function(i){
				var video = {};
				var show = i.querySelector('.branded-page-module-title');
				video.show = {
					name: show.innerText.trim(),
					img: show.querySelector('img').src
				};

				var title = i.querySelector('.yt-lockup-title');
				video.title = title.innerText.trim();

				var thumbnail = i.querySelector('.expanded-shelf .yt-lockup-thumbnail');
				video.image = thumbnail.querySelector('img').src.replace(/mqdefault/, 'sddefault');
				video.watched = !!thumbnail.querySelector('.watched-badge');
				video.duration = thumbnail.querySelector('.video-time').innerText;
				video.id = title.querySelector('a').href.split('=').pop();

				if (video.id == 'img') {
					console.log(video.title, thumbnail);
				}

				videos.push(video);
			});
		break;
	}
	console.log('done parsing');
	yt_ready && render();


})();
