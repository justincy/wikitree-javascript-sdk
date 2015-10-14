require('./setup');

var wikitree = require('./../lib/wikitree'),
    expect = require('chai').expect;
    
describe('getWatchlist', function(){
  
  it('basic', function(done){
    wikitree.getWatchlist().done(function(response){
      check(done, function(){
        expect(response.list).to.have.length(3);
        expect(response.total).to.equal(52);
        expect(response.list[0]).to.be.instanceof(wikitree.Person);
      });
    });
  });
  
  it('with params', function(done){
    wikitree.getWatchlist({limit:1}).done(function(response){
      check(done, function(){
        expect(response.list).to.have.length(1);
        expect(response.total).to.equal(52);
      });
    });
  });
  
});