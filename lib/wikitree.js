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
    return {
      list: persons,
      total: response[0].watchlistCount
    };
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