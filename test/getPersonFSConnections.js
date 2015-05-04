require('./setup');

var wikitree = require('./../lib/wikitree'),
    expect = require('chai').expect;
    
describe('getPersonFSConnections', function(){
  
  it('no id', function(){
    expect(function(){
      wikitree.getPersonFSConnections();
    }).to.throw(Error, 'Profile ID is required.');
  });
  
  it('no connections', function(done){
    wikitree.getPersonFSConnections('6689725').done(function(connections){
      check(done, function(){
        expect(connections).to.have.length(0);
      });
    });
  });
  
  it('connections', function(done){
    wikitree.getPersonFSConnections('9889663').done(function(connections){
      check(done, function(){
        expect(connections).to.have.length(1);
        var connection = connections[0];
        expect(connection.mUserId).to.equal('9889663');
        expect(connection.mFSId).to.equal('KW42-C5C');
      });
    });
  });
  
});