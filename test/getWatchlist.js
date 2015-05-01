var wikitree = require('./../lib/wikitree'),
    expect = require('chai').expect;
    
describe('getWatchlist', function(){
  
  it('basic', function(done){
    wikitree.getWatchlist().done(function(watchlist){
      check(done, function(){
        expect(watchlist).to.have.length(3);
        expect(watchlist[0]).to.be.instanceof(wikitree.Person);
      })
    })
  })
  
})