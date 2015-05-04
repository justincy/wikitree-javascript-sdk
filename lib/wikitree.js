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