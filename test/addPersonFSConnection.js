require('./setup');

var wikitree = require('./../lib/wikitree'),
    expect = require('chai').expect;
    
describe('addPersonFSConnection', function(){
  
  it('error', function(){
    expect(function(){
      wikitree.addPersonFSConnection();
    }).to.throw(Error);
  });
  
  it('success', function(done){
    wikitree.addPersonFSConnection(9889663, 'KW42-C5C', '2015-04-01 21:35:57', 'certain').done(function(connection){
      check(done, function(){
        expect(connection.mUserId).to.equal('9889663');
        expect(connection.mFSId).to.equal('KW42-C5C');
        expect(connection.mFSModified).to.equal('2015-04-01 21:35:57');
        expect(connection.mCertainty).to.equal('certain');
      });
    });
  });
  
})