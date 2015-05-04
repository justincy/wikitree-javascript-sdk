require('./setup');

var wikitree = require('./../lib/wikitree'),
    expect = require('chai').expect;
    
describe('removePersonFSConnection', function(){
  
  it('error', function(){
    expect(function(){
      wikitree.removePersonFSConnection();
    }).to.throw(Error);
  });
  
  it('success', function(done){
    wikitree.removePersonFSConnection(9889663, 'KWWW-C5C').done(function(connection){
      check(done, function(){
        expect(connection.mUserId).to.equal('9889663');
        expect(connection.mFSId).to.equal('KWWW-C5C');
        expect(connection.mCertainty).to.equal('certain');
      });
    });
  });
  
});