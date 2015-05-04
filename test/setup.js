/**
 * Test tooling
 */

var Q = require('q'),
    utils = require('../lib/utils.js');
  
// Mock jQuery $ object for testing
var $ = GLOBAL.$ = {
  
  Deferred: function(){
    var defer = Q.defer(),
        origPromise = defer.promise,
        dones = [],
        fails = [];
        
    // Match the jQuery API
    defer.promise = function(){
      return origPromise;
    };
    origPromise.done = function(cb){
      dones.push(cb);
      return this;
    };
    origPromise.fail = function(cb){
      fails.push(cb);
      return this;
    };
    origPromise.then(function(){
      var args = arguments;
      utils.each(dones, function(cb){
        cb.apply(this, args);
      });
    }, function(){
      var args = arguments;
      utils.each(fails, function(cb){
        cb.apply(this, args);
      });
    });
    
    return defer;
  },
  
  ajax: function(opts){
    var defer = $.Deferred();
    
    try {
      var action = opts.data.action,
          json = require('./responses/' + action)(opts.data);
      setTimeout(function(){
        defer.resolve(json);
      });
    } catch(e) {
      console.log(e);
      setTimeout(function(){
        defer.reject(new Error('Unable to load response file for ' + action));
      });
    }
    
    return defer.promise();
  },
  
  _cookies: {},
  
  cookie: function(key, val){
    if(typeof val === 'undefined'){
      return this._cookies[key];
    } else {
      // Force everything to a string because that's how cookies are stored
      this._cookies[key] = '' + val;
    }
  },
  
  removeCookie: function(key){
    delete this._cookies[key];
  }
};

// Helper function for async tests
// http://stackoverflow.com/a/15208067/879121
GLOBAL.check = function(done, f){
  try {
    f();
    done();
  } catch(e) {
    done(e);
  }
};