[![Build Status](https://travis-ci.org/justincy/wikitree-javascript-sdk.svg)](https://travis-ci.org/justincy/wikitree-javascript-sdk)
[![Coverage Status](https://coveralls.io/repos/justincy/wikitree-javascript-sdk/badge.svg)](https://coveralls.io/r/justincy/wikitree-javascript-sdk)

wikitree-javascript-sdk
=======================

Javascript library to work with the WikiTree API functions.

## Prerequisites
* jQuery 1.10 or higher (may work with lower versions but it hasn't been tested)
* jQuery Cookie Plugin 1.3.1 or later (https://github.com/carhartl/jquery-cookie)

## Usage

```html

// Load scripts
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.min.js"></script>
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
	
	// Get a user's watchlist
	wikitree.getWatchlist().then(function(watchlist){
	
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

### Person

__getFirstName()__

__getLastNameCurrent()__

__getDisplayName()__ - First name and last name.

__getGender()__

__getBirthDate()__

__getBirthLocation()__

__getDeathDate()__

__getDeathLocation()__

__getFather()__ - Returns a Person object for the father, if available.

__getMother()__ - Returns a Person object for the mother, if available.

__getChildren()__ - Returns an array of Person objects for the children.

__isLiving()__ - Returns `true` or `false`.

__getId()__

__getName()__ - This is not the person's name but the identifier which is used in URLs; eg `"Smith-1234"`.

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