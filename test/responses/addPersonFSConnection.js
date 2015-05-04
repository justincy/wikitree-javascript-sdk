module.exports = function(opts){
  if(opts.key == '9889663' && opts.fs_id === 'KW42-C5C'){
    return [
      {
        "user_id": "9889663",
        "status": 0,
        "connection": {
          "mUserId": "9889663",
          "mFSId": "KW42-C5C",
          "mAddedBy": "4650952",
          "mAddedOn": "2015-05-04 18:18:05",
          "mUpdatedBy": "4650952",
          "mUpdatedOn": "2015-05-04 18:18:05",
          "mFSModified": "2015-04-01 21:35:57",
          "mCertainty": "certain"
        }
      }
    ];
  } else {
    throw new Error('bad input for addPersonFSConnection test');
  }
};