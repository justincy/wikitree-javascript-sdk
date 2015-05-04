module.exports = function(opts){
  if(opts.key === 'Clark-21849'){
    return [
      {
        "page_name": "Clark-21849",
        "profile": {
          "Id": 10128682,
          "Name": "Clark-21849",
          "FirstName": "Allan",
          "MiddleName": "Paul",
          "LastNameAtBirth": "Clark",
          "LastNameCurrent": "Clark",
          "Nicknames": "",
          "LastNameOther": "",
          "RealName": "Allan",
          "Prefix": "",
          "Suffix": "",
          "BirthLocation": "Salt Lake City, Salt Lake, Utah, United States",
          "DeathLocation": "Lovell, Big Horn, Wyoming, United States",
          "Gender": "Male",
          "BirthDate": "1923-10-06",
          "DeathDate": "2007-03-09",
          "BirthDateDecade": "1920's",
          "DeathDateDecade": "2000's",
          "Photo": null,
          "IsLiving": "0",
          "Father": "10128691",
          "Mother": "10128725",
          "Privacy": "60",
          "IsPerson": 1,
          "Touched": "20150324204818",
          "ShortName": "Allan Clark",
          "BirthNamePrivate": "Allan P. Clark",
          "LongNamePrivate": "Allan P. Clark",
          "LongName": "Allan Paul Clark",
          "BirthName": "Allan P. Clark",
          "Privacy_IsPrivate": false,
          "Privacy_IsPublic": false,
          "Privacy_IsOpen": true,
          "Privacy_IsAtLeastPublic": true,
          "Privacy_IsSemiPrivate": false,
          "Privacy_IsSemiPrivateBio": false
        },
        "status": 0
      }
    ];
  } else {
    throw Error('bad input for getProfile test');
  }
}