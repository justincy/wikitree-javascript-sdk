(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.wikitree = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var wikitree = require('./wikitree');

/**
 * Get a list of FS connections for a person.
 */
wikitree.getPersonFSConnections = function(id){
  if(!id){
    throw new Error('Profile ID is required.');
  }
  
  return wikitree._ajax({
    action: 'getPersonFSConnections',
    key: id
  }, function(data) {           
    return data[0].connections;
  });
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
    
  return wikitree._ajax({
    action: 'addPersonFSConnection',
    key: wikiId,
    fs_id: fsId,
    fs_modified: lastModified,
    certainty: certainty
  }, function(data) {           
    return data[0].connection;
  });
};

/**
 * Remove an FS connection
 */
wikitree.removePersonFSConnection = function(wikiId, fsId){
  if(!wikiId){
    throw new Error('WikiTree ID is required.');
  }
  if(!fsId){
    throw new Error('FamilySearch ID is required.');
  }
    
  return wikitree._ajax({
    action: 'removePersonFSConnection',
    key: wikiId,
    fs_id: fsId
  }, function(data) {           
    return data[0].connection;
  });
};
},{"./wikitree":5}],2:[function(require,module,exports){
var wikitree = require('./wikitree');

/**
 * Create a person from the given `user_id`
 */
var Person = wikitree.Person = function(data){
  this._data = data;
  
  // Create person objects for any attached family members
  var relatives = ['Parents', 'Spouses', 'Children', 'Siblings'];
  for(var i = 0; i < relatives.length; i++){
    var type = relatives[i];
    if(data[type]){
      for(var p in data[type]){
        this._data[type][p] = new Person(data[type][p]);
      }
    }
  }
};

Person.prototype.getFirstName = function(){
  return this._data.FirstName;
};

Person.prototype.getLastNameCurrent = function(){
  return this._data.LastNameCurrent;
};

Person.prototype.getLastNameAtBirth = function(){
  return this._data.LastNameAtBirth;
};

Person.prototype.getDisplayName = function(){
  return this.getFirstName() + ' ' + this.getLastNameCurrent();
};

Person.prototype.getLongNamePrivate = function(){
  return this._data.LongNamePrivate;
};

Person.prototype.getGender = function(){
  return this._data.Gender;
};

Person.prototype.getBirthDate = function(){
  return this._data.BirthDate;
};

Person.prototype.getBirthDateDisplay = function(){
  return getDateDisplayString(this.getBirthDate());
};

Person.prototype.getBirthLocation = function(){
  return this._data.BirthLocation;
};

Person.prototype.getDeathDate = function(){
  return this._data.DeathDate;
};

Person.prototype.getDeathDateDisplay = function(){
  return getDateDisplayString(this.getDeathDate());
};

Person.prototype.getDeathLocation = function(){
  return this._data.DeathLocation;
};

Person.prototype.getFather = function(){
  if(this._data.Father && this._data.Parents){
    return this._data.Parents[this._data.Father];
  }
};

Person.prototype.getFatherId = function(){
  return this._data.Father;
};

Person.prototype.getMother = function(){
  if(this._data.Mother && this._data.Parents){
    return this._data.Parents[this._data.Mother];
  }
};

Person.prototype.getMotherId = function(){
  return this._data.Mother;
};

Person.prototype.getChildren = function(){
  return this._data.Children;
};

Person.prototype.getSpouses = function(){
  return this._data.Spouses;
};

Person.prototype.getSpouse = function(){
  var spouses = this.getSpouses();
  for(var a in spouses){
    return spouses[a]; 
  }
};

Person.prototype.getSiblings= function(){
  return this._data.Siblings;
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

/**
 * Get the URL to the person's profile page on wikitree.com
 */
Person.prototype.getProfileUrl = function(){
  return 'http://www.wikitree.com/wiki/' + this.getName();
};

/**
 * Retrieve the a URL for the person's photo. Size
 * may be 75, 300, or 500. Defaults to 300.
 */
Person.prototype.getPhotoUrl = function(size){
  if(this._data.Photo){
    if([75,300,500].indexOf(size) === -1){
      size = 300;
    }
    return 'http://www.wikitree.com/photo.php/thumb/a/ad/' + this._data.Photo + '/' + size + 'px-' + this._data.Photo;
  }
};

/**
 * Sets this person's mother to be the specified person.
 */
Person.prototype.setMother = function(person){
  var id = person.getId(),
      oldId = this._data.Mother;
  
  // Store the new mother id
  this._data.Mother = id;
  
  // If the Perants map does not exist yet then create it
  if(!this._data.Parents){
    this._data.Parents = {};
  } 
  
  // If the object does exist and there was a previous mother then remove her
  else if(oldId) {
    delete this._data.Parents[oldId];
  }
  
  // Add the new mother to the parents object
  this._data.Parents[id] = person;
};

/**
 * Sets this person's father to be the specified person.
 */
Person.prototype.setFather = function(person){
  var id = person.getId(),
      oldId = this._data.Father;
  
  // Store the new father id
  this._data.Father = id;
  
  // If the Perants map does not exist yet then create it
  if(!this._data.Parents){
    this._data.Parents = {};
  } 
  
  // If the object does exist and there was a previous father then remove her
  else if(oldId) {
    delete this._data.Parents[oldId];
  }
  
  // Add the new father to the parents object
  this._data.Parents[id] = person;
};

/**
 * This method replaces the current list of children with the new list.
 */
Person.prototype.setChildren = function(children){
  this._data.Children = children;
};

/**
 * Convert a raw date string from the API into a human readable string
 */
var months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];
function getDateDisplayString(raw){
  if(!raw || !(/\d{4}-\d{2}-\d{2}/.test(raw)) ||  raw === '0000-00-00'){
    return '';
  }
  
  var date = new Date(raw);
  
  // If the date is invalid it means that the day and possibly also
  // the month are "00". We know the year is not "0000" because we
  // tested for that above.
  if(isNaN(date.getTime())){
    var parts = raw.split('-'),
        year = parts[0],
        month = parts[1],
        monthInt = parseInt(month, 10);
    if(monthInt === 0){
      return year;
    }
    return months[monthInt - 1] + ' ' + year;
  } 
  
  // Valid JS date so formatting is easy
  else {
    return months[date.getMonth()] + ' ' + date.getUTCDate() + ', ' + date.getFullYear();
  }
};
},{"./wikitree":5}],3:[function(require,module,exports){
var wikitree = require('./wikitree'),
    cookies = require('mozilla-doc-cookies');

wikitree.Session = function(opts) {
  this.user_id    = (opts && opts.user_id) ? opts.user_id : cookies.getItem('wikitree_wtb_UserID') || '';
  this.user_name  = (opts && opts.user_name) ? opts.user_name : cookies.getItem('wikitree_wtb_UserName') || '';
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
  var deferred = $.Deferred();
  var request = wikitree._ajax(data);

  request
    // Local success handling to set our cookies.
    .done(function(data) {
      if (data.login.result == session.user_id) { 
        cookies.setItem('wikitree_wtb_UserID', session.user_id);
        cookies.setItem('wikitree_wtb_UserName', session.user_name);
        session.loggedIn = true;
        deferred.resolve();
      } else { 
        cookies.removeItem('wikitree_wtb_UserID');
        cookies.removeItem('wikitree_wtb_UserName');
        session.loggedIn = false;
        deferred.reject();
      }
    })
    .fail(function(xhr, status) { 
      cookies.removeItem('wikitree_wtb_UserID');
      cookies.removeItem('wikitree_wtb_UserName');
      session.loggedIn = false;
      deferred.reject();
    });

  return deferred.promise();
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
  var deferred = $.Deferred();
  var request = wikitree._ajax(data);

  request
    // On successful POST return, check our data. Note from that data whether the login itself was
    // successful (setting session cookies if so). Call the user callback function when done.
    .done(function(data) {
      if (data.login.result == 'Success') { 
        session.user_id   = data.login.userid;
        session.user_name = data.login.username;
        session.loggedIn = true;
        cookies.setItem('wikitree_wtb_UserID', session.user_id);
        cookies.setItem('wikitree_wtb_UserName', session.user_name);
        deferred.resolve();
      } else {
        deferred.reject();
      }
    })
    .fail(function(){
      deferred.reject();
    });

  return deferred.promise();
  
};

/**
 * Logout user by deleting the cookies and resetting the sdk
 */
wikitree.logout = function() {
  this.session.loggedIn = false;
  this.session.user_id = '';
  this.session.user_name = '';
  cookies.removeItem('wikitree_wtb_UserID');
  cookies.removeItem('wikitree_wtb_UserName');
};
},{"./wikitree":5,"mozilla-doc-cookies":6}],4:[function(require,module,exports){
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
  var data = { 
    'action': 'getPerson', 
    'key': personId,
    'format': 'json'
  };
  if(fields){
    data.fields = fields;
  }
  return wikitree._ajax(data, function(data) {           
    return new wikitree.Person(data[0].person);
  });
};

/**
 * Get a user's watchlist
 */
wikitree.getWatchlist = function(params){
  if(typeof params === 'undefined'){
    params = {};
  }
  params.action = 'getWatchlist';
  return wikitree._ajax(params, function(response){
    var persons = [];
    utils.each(response[0].watchlist, function(person, i){
      persons.push(new wikitree.Person(person));
    });
    return persons;
  });
};

/**
 * Get privacy levels. Returns a map keyed by privacy level.
 */
wikitree.getPrivacyLevels = function(){
  return wikitree._ajax({action:'getPrivacyLevels'}, function(levels){
    return levels[0];
  });
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
  
  return wikitree._ajax({
    action: 'getProfile',
    key: id
  }, function(data) {           
    return new wikitree.Person(data[0].profile);
  });
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
  
  return wikitree._ajax(data, function(data){
    var list = [],
        map = {};
        
    utils.each(data[0].ancestors, function(ancestor){
      var person = new wikitree.Person(ancestor);
      list.push(person);
      map[person.getId()] = person;
    });
    
    utils.each(list, function(person){
      var father = map[person.getFatherId()],
          mother = map[person.getMotherId()];
      if(father){
        person.setFather(father);
      }
      if(mother){
        person.setMother(mother);
      }
    });
    
    return list;
  });
};

/**
 * Get a list of persons and their relatives. Returns a map keyed
 * by the requested ID.
 */
wikitree.getRelatives = function(ids, parents, spouses, children, siblings){
  var data = {
    action: 'getRelatives',
    keys: ids.join(','),
    getParents: parents === true ? 1 : 0,
    getSpouses: spouses === true ? 1 : 0,
    getChildren: children === true ? 1 : 0,
    getSiblings: siblings === true ? 1 : 0,
  };
  return wikitree._ajax(data, function(response){
    var items = response[0].items,
        persons = {};
    for(var i = 0; i < items.length; i++){
      var item = items[i];
      persons[item.key] = new wikitree.Person(item.person);
    }
    return persons;
  });
};

/**
 * Perform an ajax request to the API.
 * Return a promise
 */
wikitree._ajax = function(opts, success){
  
  if(!opts){
    opts = {};
  }
  opts.format = 'json';
  if(this.API_KEY && this.API_CODE){
    opts.api_key = this.API_KEY;
    opts.api_code = this.API_CODE;
  }
  
  if(opts.fields){
    opts.fields = opts.fields.join(',');
  }
  
  var deferred = $.Deferred();
  
  $.ajax({
    url: wikitree.API_DOMAIN + wikitree.API_URL,
    crossDomain: true,
    xhrFields: { withCredentials: true }, 
    type: 'POST',
    dataType: 'json',
    data: opts
  }).then(function(response){
    
    // If the success param is called then we're using the shortcut
    // version which globalizes error handling.
    if(success){
      if(response[0].status) {
        deferred.reject(response[0].status);
      }
      else {
        deferred.resolve(success(response));
      }
    }
    else {
      deferred.resolve(response);
    }
  }, function(){
    deferred.reject('Error in API query');
  });
  
  return deferred.promise();
};
},{"./FS":1,"./Person":2,"./Session":3,"./utils":4}],6:[function(require,module,exports){
/*\
|*|
|*|  :: cookies.js ::
|*|
|*|  A complete cookies reader/writer framework with full unicode support.
|*|
|*|  Revision #1 - September 4, 2014
|*|
|*|  https://developer.mozilla.org/en-US/docs/Web/API/document.cookie
|*|  https://developer.mozilla.org/User:fusionchess
|*|
|*|  This framework is released under the GNU Public License, version 3 or later.
|*|  http://www.gnu.org/licenses/gpl-3.0-standalone.html
|*|
|*|  Syntaxes:
|*|
|*|  * docCookies.setItem(name, value[, end[, path[, domain[, secure]]]])
|*|  * docCookies.getItem(name)
|*|  * docCookies.removeItem(name[, path[, domain]])
|*|  * docCookies.hasItem(name)
|*|  * docCookies.keys()
|*|
\*/

module.exports = {
  getItem: function (sKey) {
    if (!sKey) { return null; }
    return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
  },
  setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
    if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false; }
    var sExpires = "";
    if (vEnd) {
      switch (vEnd.constructor) {
        case Number:
          sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
          break;
        case String:
          sExpires = "; expires=" + vEnd;
          break;
        case Date:
          sExpires = "; expires=" + vEnd.toUTCString();
          break;
      }
    }
    document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
    return true;
  },
  removeItem: function (sKey, sPath, sDomain) {
    if (!this.hasItem(sKey)) { return false; }
    document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
    return true;
  },
  hasItem: function (sKey) {
    if (!sKey) { return false; }
    return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
  },
  keys: function () {
    var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
    for (var nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) { aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]); }
    return aKeys;
  }
};

},{}]},{},[5])(5)
});