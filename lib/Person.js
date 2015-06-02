var wikitree = require('./wikitree');

/**
 * Create a person from the given `user_id`
 */
var Person = wikitree.Person = function(data){
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

Person.prototype.getFatherId = function(){
  return this._data.Father;
}

Person.prototype.getMother = function(){
  if(this._data.Mother && this._data.Parents){
    return this._data.Parents[this._data.Mother];
  }
};

Person.prototype.getMotherId = function(){
  return this._data.Mother;
}

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