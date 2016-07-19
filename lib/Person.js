var wikitree = require('./wikitree');

/**
 * Create a person from the given `user_id`
 */
var Person = wikitree.Person = function(data){
  this._data = data;
  
  // Create person objects for any attached family members
  var relatives = ['Parents', 'Spouses', 'Children', 'Siblings'];
  for(var i = 0; i < relatives.length; i++){
    var type = relatives[i];
    if(data[type]){
      for(var p in data[type]){
        this._data[type][p] = new Person(data[type][p]);
      }
    }
  }
};

Person.prototype.getFirstName = function(){
  return this._data.FirstName;
};

Person.prototype.getRealName = function(){
  return this._data.RealName;
};

Person.prototype.getMiddleName = function(){
  return this._data.MiddleName;
};

Person.prototype.getLastNameCurrent = function(){
  return this._data.LastNameCurrent;
};

Person.prototype.getLastNameAtBirth = function(){
  return this._data.LastNameAtBirth;
};

Person.prototype.getDisplayName = function(){
  return this.getFirstName() + ' ' + this.getLastNameCurrent();
};

Person.prototype.getLongNamePrivate = function(){
  return this._data.LongNamePrivate;
};

Person.prototype.getGender = function(){
  return this._data.Gender;
};

Person.prototype.getBirthDate = function(){
  return this._data.BirthDate;
};

Person.prototype.getBirthDateDisplay = function(){
  return getDateDisplayString(this.getBirthDate());
};

Person.prototype.getBirthLocation = function(){
  return this._data.BirthLocation;
};

Person.prototype.getDeathDate = function(){
  return this._data.DeathDate;
};

Person.prototype.getDeathDateDisplay = function(){
  return getDateDisplayString(this.getDeathDate());
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
};

Person.prototype.getMother = function(){
  if(this._data.Mother && this._data.Parents){
    return this._data.Parents[this._data.Mother];
  }
};

Person.prototype.getMotherId = function(){
  return this._data.Mother;
};

Person.prototype.getChildren = function(){
  return this._data.Children;
};

Person.prototype.getSpouses = function(){
  return this._data.Spouses;
};

Person.prototype.getSpouse = function(){
  var spouses = this.getSpouses();
  for(var a in spouses){
    return spouses[a]; 
  }
};

Person.prototype.getSiblings= function(){
  return this._data.Siblings;
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

/**
 * Convert a raw date string from the API into a human readable string
 */
var months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];
function getDateDisplayString(raw){
  if(!raw || !(/\d{4}-\d{2}-\d{2}/.test(raw)) ||  raw === '0000-00-00'){
    return '';
  }
  
  var date = new Date(raw);
  
  // If the date is invalid it means that the day and possibly also
  // the month are "00". We know the year is not "0000" because we
  // tested for that above.
  if(isNaN(date.getTime())){
    var parts = raw.split('-'),
        year = parts[0],
        month = parts[1],
        monthInt = parseInt(month, 10);
    if(monthInt === 0){
      return year;
    }
    return months[monthInt - 1] + ' ' + year;
  } 
  
  // Valid JS date so formatting is easy
  else {
    return months[date.getMonth()] + ' ' + date.getUTCDate() + ', ' + date.getFullYear();
  }
};