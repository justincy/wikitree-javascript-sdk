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