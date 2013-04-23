require.config
		shim:
			'underscore':
				exports: '_'
			'jquery':
				exports: '$'
			'text' :
				exports: 'text'
			'backbone':
				deps: ['underscore', 'jquery']
				exports: 'Backbone'
		paths :
			'use' :'vendor/use'
			'jquery' : 'vendor/jquery-1.8.2.mini'
			'underscore' : 'vendor/underscore'
			'backbone' : 'vendor/backbone'
			'text' : 'vendor/text'
			'templates' : '../templates'

do ()->
	require ['jquery'],($)->

		currentModel  = $('body').data 'model'
		require ["app/#{currentModel}"],(app)->
			app.init()
		


