

var Assets = vtools.loadAssets(__ASSETSARRAY__,{
			 // On assets loading...
			 loading: function(loader){
			 	console.log('the images loading progress (%) ' + loader.currentLoaded +' % current '+ loader.currentIndex + '/'+  loader.total )
			 },
			 // On assets Loaded
			 loaded : function(){
			 	console.log('my Assets loaded');
			 }

			})