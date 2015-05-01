var wikitree = require('./../lib/wikitree'),
    expect = require('chai').expect;
    
describe('getPerson', function(){
  
  it('basic', function(done){
    wikitree.getPerson('10147690').then(function(person){
      check(done, function(){
        expect(person).to.be.instanceof(wikitree.Person);
        expect(person.getDisplayName()).to.equal("Mary Wojnowski");
        expect(person.getMother()).to.be.instanceof(wikitree.Person);
        expect(person.getFather()).to.be.instanceof(wikitree.Person);
        expect(person.getChildren()).to.have.all.keys(['10147688','10147705']);
      });
    });
  });
  
});