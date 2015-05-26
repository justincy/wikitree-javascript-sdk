require('./setup');

var wikitree = require('./../lib/wikitree'),
    expect = require('chai').expect;
    
describe('getAncestors', function(){
  
  it('error', function(){
    expect(function(){
      wikitree.getAncestors();
    }).to.throw(Error, 'Profile ID is required.');
  });
  
  it('basic', function(done){
    wikitree.getAncestors('York-2480').done(function(ancestors){
      check(done, function(){
        expect(ancestors).to.have.length(17);
        for(var i = 0; i < ancestors.length; i++){
          expect(ancestors[i]).to.be.instanceof(wikitree.Person);
        }
        expect(ancestors[0].getFather()).to.be.instanceof(wikitree.Person);
        expect(ancestors[0].getMother()).to.be.instanceof(wikitree.Person);
      });
    });
  });
  
});