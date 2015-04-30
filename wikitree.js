(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.wikitree = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Create a person from the given `user_id`
 */
var Person = module.exports = function(data){
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
},{}],2:[function(require,module,exports){
var wikitree = require('./wikitree');

var Session = module.exports = function(opts) {
  this.user_id    = (opts && opts.user_id) ? opts.user_id : $.cookie('wikitree_wtb_UserID');
  this.user_name  = (opts && opts.user_name) ? opts.user_name : $.cookie('wikitree_wtb_UserName');
  this.loggedIn  = false;
};
  
/**
 * Define new method for Session objects to check the current login.
 * Return a promise object (from our .ajax() call) so we can do things when this resolves.
 */
Session.prototype.checkLogin = function (opts){

  var self = this;

  if (opts && opts.user_id) { self.user_id = opts.user_id; }
  if (opts && opts.user_name) { self.user_name = opts.user_name; }
  
  var data = { 'action': 'login', 'user_id': self.user_id };
  var request = wikitree._ajax(data);

  request
    // Local success handling to set our cookies.
    .done(function(data) {        
      if (data.login.result == self.user_id) { 
        $.cookie('wikitree_wtb_UserID', self.user_id);
        $.cookie('wikitree_wtb_UserName', self.user_name);
        self.loggedIn = true;
      } else { 
        $.cookie('wikitree_wtb_UserID', '');
        $.cookie('wikitree_wtb_UserName', '');
        self.loggedIn = false;
      }
    })
    .fail(function(xhr, status) { 
      $.cookie('wikitree_wtb_UserID', '');
      $.cookie('wikitree_wtb_UserName', '');
      self.loggedIn = false;
    });

  return request;

}
  
/**
 * Do an actual login through the server API with an Ajax call. 
 */
Session.prototype.login = function(opts) {
  var self = this;

  var email    = (opts && opts.email) ? opts.email : '';
  var password = (opts && opts.password) ? opts.password : '';
  var data = { 'action': 'login', 'email': email, 'password': password };
  var request = wikitree._ajax(data);

  request
    // On successful POST return, check our data. Note from that data whether the login itself was
    // successful (setting session cookies if so). Call the user callback function when done.
    .done(function(data) {
      if (data.login.result == 'Success') { 
        self.user_id   = data.login.userid;
        self.user_name = data.login.username;
        self.loggedIn = true;
        $.cookie('wikitree_wtb_UserID', self.user_id);
        $.cookie('wikitree_wtb_UserName', self.user_name);
      } else { 
        this.loggedIn = false;
        $.cookie('wikitree_wtb_UserID', self.user_id);
        $.cookie('wikitree_wtb_UserName', self.user_name);
      }
    })
    // On failed POST/server error, act like a failed login.
    .fail(function(xhr, status) {
      this.user_id = 0;
      this.user_name = '';
      this.loggedin = false;
      $.cookie('wikitree_wtb_UserID', self.user_id);
      $.cookie('wikitree_wtb_UserName', self.user_name);
    });

  return request;
  
}

/**
 * Logout user by deleting the cookies and resetting the sdk
 */
Session.prototype.logout = function(opts) {
  this.loggedIn = false;
  this.user_id = 0;
  this.user_name = '';
  $.removeCookie('wikitree_wtb_UserID');
  $.removeCookie('wikitree_wtb_UserName');
}
},{"./wikitree":3}],3:[function(require,module,exports){
var wikitree = module.exports = {
  API_URL: '/api.php',
  API_DOMAIN: 'https://apps.wikitree.com'
};

var Session = require('./Session'),
    Person = require('./Person');
    
/**
 * Setup the sdk
 */
wikitree.init = function(opts) { 
  wikitree.session = new Session();
};

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
    // On success, we note that we're done loading. 
    // If we got data back, we store it in self and set loaded=true.
    .done(function(data) {           
      if(data[0].status) {
        deferred.reject(data[0].status);
      }
      else { 
        deferred.resolve(new Person(data[0].person));
      }
    })
    // On error, report the "status" we got back.
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
      $.each(response[0].watchlist, function(i, person){
        persons.push(new Person(person));
      });
      deferred.resolve(persons);
    }
  }).fail(function(){
    deferred.reject('Error in API query');
  });
  return deferred.promise();
};

/**
 * Perform an ajax request to the API.
 * Return a promise
 */
wikitree._ajax = function(opts){
  opts.format = 'json';
  return $.ajax({
    url: wikitree.API_URL,
    crossDomain: true,
    xhrFields: { withCredentials: true }, 
    type: 'POST',
    dataType: 'json',
    data: opts
  }).promise();
};
},{"./Person":1,"./Session":2}]},{},[3])(3)
});