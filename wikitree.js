(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.wikitree = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var wikitree = require('./wikitree');

/**
 * Get a list of FS connections for a person.
 */
wikitree.getPersonFSConnections = function(id){
  if(!id){
    throw new Error('Profile ID is required.');
  }
  
  var deferred = $.Deferred(),
      request = wikitree._ajax({
        action: 'getPersonFSConnections',
        key: id
      });
  
  request
    .done(function(data) {           
      if(data[0].status) {
        deferred.reject(data[0].status);
      }
      else { 
        deferred.resolve(data[0].connections);
      }
    })
    .fail(function(xhr, status) {             
      deferred.reject('Error in API query');
    });

  return deferred.promise();
};

/**
 * Create an FS connection for a person.
 */
wikitree.addPersonFSConnection = function(wikiId, fsId, lastModified, certainty){
  if(!wikiId){
    throw new Error('WikiTree ID is required.');
  }
  if(!fsId){
    throw new Error('FamilySearch ID is required.');
  }
  if(!lastModified){
    throw new Error('Last-modified timestamp is required.');
  }
  if(!certainty){
    throw new Error('Certainty is required.');
  }

  var deferred = $.Deferred(),
      request = wikitree._ajax({
        action: 'addPersonFSConnection',
        key: wikiId,
        fs_id: fsId,
        fs_modified: lastModified,
        certainty: certainty
      });
    
  request
    .done(function(data) {           
      if(data[0].status) {
        deferred.reject(data[0].status);
      }
      else { 
        console.log('resolving');
        deferred.resolve(data[0].connection);
      }
    })
    .fail(function(xhr, status) {             
      deferred.reject('Error in API query');
    });

  return deferred.promise();
};
},{"./wikitree":5}],2:[function(require,module,exports){
var wikitree = require('./wikitree');

/**
 * Create a person from the given `user_id`
 */
var Person = wikitree.Person = function(data){
  this._data = data;
  if(data.Parents){
    for(var p in data.Parents){
      this._data.Parents[p] = new Person(data.Parents[p]);
    }
  }
  if(data.Children){
    for(var c in data.Children){
      this._data.Children[c] = new Person(data.Children[c]);
    }
  }
};

Person.prototype.getFirstName = function(){
  return this._data.FirstName;
};

Person.prototype.getLastNameCurrent = function(){
  return this._data.LastNameCurrent;
};

Person.prototype.getDisplayName = function(){
  return this.getFirstName() + ' ' + this.getLastNameCurrent();
};

Person.prototype.getGender = function(){
  return this._data.Gender;
};

Person.prototype.getBirthDate = function(){
  return this._data.BirthDate;
};

Person.prototype.getBirthLocation = function(){
  return this._data.BirthLocation;
};

Person.prototype.getDeathDate = function(){
  return this._data.DeathDate;
};

Person.prototype.getDeathLocation = function(){
  return this._data.DeathLocation;
};

Person.prototype.getFather = function(){
  if(this._data.Father && this._data.Parents){
    return this._data.Parents[this._data.Father];
  }
};

Person.prototype.getMother = function(){
  if(this._data.Mother && this._data.Parents){
    return this._data.Parents[this._data.Mother];
  }
};

Person.prototype.getChildren = function(){
  return this._data.Children;
};

Person.prototype.getId = function(){
  return this._data.Id;
};

Person.prototype.toJSON = function(){
  return this._data;
};

Person.prototype.isLiving = function(){
  return this._data.IsLiving == 1;
};

/**
 * This is not the person's name but the identifier
 * used in URLs; e.g. Smith-3624
 */
Person.prototype.getName = function(){
  return this._data.Name;
};
},{"./wikitree":5}],3:[function(require,module,exports){
var wikitree = require('./wikitree');

wikitree.Session = function(opts) {
  this.user_id    = (opts && opts.user_id) ? opts.user_id : $.cookie('wikitree_wtb_UserID') || '';
  this.user_name  = (opts && opts.user_name) ? opts.user_name : $.cookie('wikitree_wtb_UserName') || '';
  this.loggedIn  = false;
};
  
/**
 * Define new method for Session objects to check the current login.
 * Return a promise object (from our .ajax() call) so we can do things when this resolves.
 */
wikitree.checkLogin = function (opts){

  var session = this.session;

  if (opts && opts.user_id) { session.user_id = opts.user_id; }
  if (opts && opts.user_name) { session.user_name = opts.user_name; }
  
  var data = { 'action': 'login', 'user_id': session.user_id };
  var request = wikitree._ajax(data);

  request
    // Local success handling to set our cookies.
    .done(function(data) {        
      if (data.login.result == session.user_id) { 
        $.cookie('wikitree_wtb_UserID', session.user_id);
        $.cookie('wikitree_wtb_UserName', session.user_name);
        session.loggedIn = true;
      } else { 
        $.removeCookie('wikitree_wtb_UserID');
        $.removeCookie('wikitree_wtb_UserName');
        session.loggedIn = false;
      }
    })
    .fail(function(xhr, status) { 
      $.removeCookie('wikitree_wtb_UserID');
      $.removeCookie('wikitree_wtb_UserName');
      session.loggedIn = false;
    });

  return request;

};
  
/**
 * Do an actual login through the server API with an Ajax call. 
 */
wikitree.login = function(opts) {
  var session = this.session;
  wikitree.logout();

  var email    = (opts && opts.email) ? opts.email : '';
  var password = (opts && opts.password) ? opts.password : '';
  var data = { 'action': 'login', 'email': email, 'password': password };
  var request = wikitree._ajax(data);

  request
    // On successful POST return, check our data. Note from that data whether the login itself was
    // successful (setting session cookies if so). Call the user callback function when done.
    .done(function(data) {
      if (data.login.result == 'Success') { 
        session.user_id   = data.login.userid;
        session.user_name = data.login.username;
        session.loggedIn = true;
        $.cookie('wikitree_wtb_UserID', session.user_id);
        $.cookie('wikitree_wtb_UserName', session.user_name);
      }
    });

  return request;
  
};

/**
 * Logout user by deleting the cookies and resetting the sdk
 */
wikitree.logout = function() {
  this.session.loggedIn = false;
  this.session.user_id = '';
  this.session.user_name = '';
  $.removeCookie('wikitree_wtb_UserID');
  $.removeCookie('wikitree_wtb_UserName');
};
},{"./wikitree":5}],4:[function(require,module,exports){
var utils = module.exports = {};

/**
 * Lifted from underscore.js
 * http://underscorejs.org/docs/underscore.html#section-15
 */
utils.each = function(obj, iterator, context) {
  if (obj == null) return obj;
  if (Array.prototype.forEach && obj.forEach === Array.prototype.forEach) {
    obj.forEach(iterator, context);
  } else if (obj.length === +obj.length) {
    for (var i = 0, length = obj.length; i < length; i++) {
      iterator.call(context, obj[i], i, obj);
    }
  } else {
    var keys = utils.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      iterator.call(context, obj[keys[i]], keys[i], obj);
    }
  }
  return obj;
};
},{}],5:[function(require,module,exports){
var utils = require('./utils');

var wikitree = module.exports = {
  API_URL: '/api.php',
  API_DOMAIN: 'https://apps.wikitree.com',
  API_KEY: null,
  API_CODE: null
};

require('./Session');
require('./Person');
require('./FS');

wikitree.session = new wikitree.Session();

/**
 * Get a person from the specified id
 */
wikitree.getPerson = function(personId, fields){
  if(!fields){
    fields = 'Id,Name,FirstName,MiddleName,LastNameAtBirth,LastNameCurrent,BirthDate,DeathDate,Father,Mother';
  }
  var data = { 
    'action': 'getPerson', 
    'key': personId, 
    'fields': fields, 
    'format': 'json'
  };
  var deferred = $.Deferred(),
      promise = deferred.promise(),
      request = wikitree._ajax(data);
  
  request
    .done(function(data) {           
      if(data[0].status) {
        deferred.reject(data[0].status);
      }
      else { 
        deferred.resolve(new wikitree.Person(data[0].person));
      }
    })
    .fail(function(xhr, status) {             
      deferred.reject('Error in API query');
    });

  return promise;
};

/**
 * Get a user's watchlist
 */
wikitree.getWatchlist = function(){
  var deferred = $.Deferred(),
      request = wikitree._ajax({action:'getWatchlist'});
  request.done(function(response){
    if(response[0].status) {
      deferred.reject(response[0].status);
    }
    else { 
      var persons = [];
      utils.each(response[0].watchlist, function(person, i){
        persons.push(new wikitree.Person(person));
      });
      deferred.resolve(persons);
    }
  }).fail(function(){
    deferred.reject('Error in API query');
  });
  return deferred.promise();
};

/**
 * Get privacy levels. Returns a map keyed by privacy level.
 */
wikitree.getPrivacyLevels = function(){
  var deferred = $.Deferred(),
      request = wikitree._ajax({action:'getPrivacyLevels'});
  request.done(function(levels){
    deferred.resolve(levels[0]);
  }).done(function(){
    deferred.reject('Error in API query');
  })
  return deferred.promise();
};

/**
 * Get profile. Requires a profile ID. Returns a person object.
 * Returns same info as getPerson with no fields specified,
 * except that it has a few additional items such as privacy info.
 */
wikitree.getProfile = function(id){
  if(!id){
    throw new Error('Profile ID is required.');
  }
  
  var deferred = $.Deferred(),
      request = wikitree._ajax({
        action: 'getProfile',
        key: id
      });
  
  request
    .done(function(data) {           
      if(data[0].status) {
        deferred.reject(data[0].status);
      }
      else { 
        deferred.resolve(new wikitree.Person(data[0].profile));
      }
    })
    .fail(function(xhr, status) {             
      deferred.reject('Error in API query');
    });

  return deferred.promise();
};

/**
 * Retrieve the list of ancestors of a person.
 * Depth is optional; ranges 1-10.
 */
wikitree.getAncestors = function(id, depth){
  if(!id){
    throw new Error('Profile ID is required.');
  }
  var data = {
    action: 'getAncestors',
    key: id
  };
  if(depth && depth >=1 && depth <= 10){
    data.depth = depth;
  }
  
  var deferred = $.Deferred(),
      request = wikitree._ajax(data);
  
  request
    .done(function(data) {           
      if(data[0].status) {
        deferred.reject(data[0].status);
      }
      else { 
        var persons = [];
        utils.each(data[0].ancestors, function(ancestor){
          persons.push(new wikitree.Person(ancestor));
        });
        deferred.resolve(persons);
      }
    })
    .fail(function(xhr, status) {             
      deferred.reject('Error in API query');
    });

  return deferred.promise();
};

/**
 * Perform an ajax request to the API.
 * Return a promise
 */
wikitree._ajax = function(opts){
  if(!opts){
    opts = {};
  }
  opts.format = 'json';
  if(this.API_KEY && this.API_CODE){
    opts.api_key = this.API_KEY;
    opts.api_code = this.API_CODE;
  }
  return $.ajax({
    url: wikitree.API_DOMAIN + wikitree.API_URL,
    crossDomain: true,
    xhrFields: { withCredentials: true }, 
    type: 'POST',
    dataType: 'json',
    data: opts
  }).promise();
};
},{"./FS":1,"./Person":2,"./Session":3,"./utils":4}]},{},[5])(5)
});