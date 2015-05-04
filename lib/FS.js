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
        deferred.resolve(data[0].connection);
      }
    })
    .fail(function(xhr, status) {             
      deferred.reject('Error in API query');
    });

  return deferred.promise();
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
  
  var deferred = $.Deferred(),
      request = wikitree._ajax({
        action: 'removePersonFSConnection',
        key: wikiId,
        fs_id: fsId
      });
    
  request
    .done(function(data) {           
      if(data[0].status) {
        deferred.reject(data[0].status);
      }
      else { 
        deferred.resolve(data[0].connection);
      }
    })
    .fail(function(xhr, status) {             
      deferred.reject('Error in API query');
    });

  return deferred.promise();
};