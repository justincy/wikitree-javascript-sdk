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