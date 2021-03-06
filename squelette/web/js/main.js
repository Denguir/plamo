// Generated by CoffeeScript 1.4.0
(function() {

  require.config({
    shim: {
      'underscore': {
        exports: '_'
      },
      'jquery': {
        exports: '$'
      },
      'text': {
        exports: 'text'
      },
      'backbone': {
        deps: ['underscore', 'jquery'],
        exports: 'Backbone'
      }
    },
    paths: {
      'use': 'vendor/use',
      'jquery': 'vendor/jquery-1.8.2.mini',
      'underscore': 'vendor/underscore',
      'backbone': 'vendor/backbone',
      'text': 'vendor/text',
      'templates': '../templates'
    }
  });

  require(['app/app'], function(app) {
    return app.init();
  });

}).call(this);
