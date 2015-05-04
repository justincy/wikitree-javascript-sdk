require('./setup');

var wikitree = require('./../lib/wikitree'),
    expect = require('chai').expect;
    
describe('getPrivacyLevels', function(){
  
  it('basic', function(done){
    wikitree.getPrivacyLevels().done(function(levels){
      check(done, function(){
        expect(levels).to.deep.equal({
          "UNLISTED": 10,
          "PRIVATE": 20,
          "SEMIPRIVATE_BIO": 30,
          "SEMIPRIVATE_BIOTREE": 40,
          "PUBLIC": 50,
          "OPEN": 60
        })
      })
    })
  })
  
})