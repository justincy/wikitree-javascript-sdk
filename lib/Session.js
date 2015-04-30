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