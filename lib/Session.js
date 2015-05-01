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