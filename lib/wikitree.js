var utils = require('./utils');

var wikitree = module.exports = {
  API_URL: '/api.php',
  API_DOMAIN: 'https://apps.wikitree.com'
};

var Session = wikitree.Session = require('./Session');
var Person = wikitree.Person = require('./Person');
    
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
      utils.each(response[0].watchlist, function(person, i){
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