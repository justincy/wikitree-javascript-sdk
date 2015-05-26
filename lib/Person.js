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

Person.prototype.setMother = function(person){
  var id = person.getId();
  if(!this._data.Mother){
    this._data.Mother = id;
  }
  if(!this._data.Parents){
    this._data.Parents = {};
  }
  this._data.Parents[id] = person;
};

Person.prototype.setFather = function(person){
  var id = person.getId();
  if(!this._data.Father){
    this._data.Father = id;
  }
  if(!this._data.Parents){
    this._data.Parents = {};
  }
  this._data.Parents[id] = person;
};