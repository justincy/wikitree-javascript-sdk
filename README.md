[![Build Status](https://travis-ci.org/justincy/wikitree-javascript-sdk.svg)](https://travis-ci.org/justincy/wikitree-javascript-sdk)
[![Coverage Status](https://coveralls.io/repos/justincy/wikitree-javascript-sdk/badge.svg)](https://coveralls.io/r/justincy/wikitree-javascript-sdk)

wikitree-javascript-sdk
=======================

Javascript library to work with the WikiTree API functions.

## Prerequisites
* jQuery 1.10 or higher (may work with lower versions but it hasn't been tested)

## Usage

```html

// Load scripts
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
<script src="wikitree.js"></script>

<script type="text/javascript">

	// Verify that an existing session is still valid
	wikitree.checkLogin().then(function(data){
	
	});

	// Start a new session
	wikitree.login( { email: 'xxx', password: 'yyyy' }).then(function(data) {
	
	});

	// Get a person. Returns a Person object.
	wikitree.getPerson(id).then(function(person){
		
	});
	
	// Get multiple persons and their relatives. Specify whether you want
	// their parents, spouses, children, and or siblings returned.
	// Returns a map of person objects keyed by the requested IDs.
	wikitree.getRelatives(ids, parents, spouses, children, siblings).then(function(persons){
		
	});
	
	// Get a user's watchlist
	wikitree.getWatchlist().then(function({ list, total }){
	
	});
	
	// Get a person's ancestors.
	wikitree.getAncestors(id).then(function(ancestors){
	
	});
	
	// Get a profile.
	wikitree.getProfile(id).then(function(profile){
	
	});
	
	// Get privacy levels.
	wikitree.getPrivacyLevels().then(function(privacyLevels){
	
	});

</script>
```

See the [API docs](http://apps.wikitree.com/api.php) for a complete listing of
available API functions and parameters.

### Person

__getFirstName()__

__getMiddleName()__

__getLastNameCurrent()__

__getLastNameAtBirth()__

__getLongNamePrivate()__

__getDisplayName()__ - First name and last name.

__getGender()__

__getBirthDate()__ - Birth date in 'YYYY-MM-DD' format

__getBirthDateDisplay()__ - Birth date in human readable format; 'October 14, 1939'

__getBirthLocation()__

__getDeathDate()__ - Death date in 'YYYY-MM-DD' format

__getDeathDateDisplay()__ - Death date in human readable format; 'October 14, 1939'

__getDeathLocation()__

__getFather()__ - Returns a Person object for the father, if available.

__getMother()__ - Returns a Person object for the mother, if available.

__getChildren()__ - Returns a map of Person objects for the children keyed by ID. Returns undefined if no children have been requested. Returns an empty object if there are no children.

__getSpouses()__ - Returns a map of Person objects for the spouses keyed by ID. Returns undefined if no spouses have been requested. Returns an empty object if there are no spouses.

__getSpouse()__ - Returns the first spouse in the list of spouses. Returns undefined if no spouses are available.

__getSiblings()__ - Returns a map of Person objects for the siblings keyed by ID. Returns undefined if no siblings have been requested. Returns an empty object if there are no siblings.

__isLiving()__ - Returns `true` or `false`.

__getId()__

__getName()__ - This is not the person's name but the identifier which is used in URLs; eg `"Smith-1234"`.

__getProfileUrl()__ - Return a URL to the person's profile on WikiTree.

__getPhotoUrl()__ - Return a URL to the person's profile photo.

__toJSON()__ - Returns the raw JSON data. Tell us if you use this for anything
other than serialization because it likely means that something is missing from
the SDK.

## Example

The documentation here is incomplete as the SDK (and the API itself) are all in early development.
The index.html file has a decent example of usage. 

## Contributing

```
# run tests
npm test

# run coverage; output will be on the coverage directory
npm run coverage

# build with browserify
npm run build
```