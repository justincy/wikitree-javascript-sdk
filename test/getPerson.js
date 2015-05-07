require('./setup');

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
        expect(person.getFirstName()).to.equal('Mary');
        expect(person.getLastNameCurrent()).to.equal('Wojnowski');
        expect(person.getGender()).to.equal('Female');
        expect(person.getBirthDate()).to.equal('1863-00-00');
        expect(person.getBirthLocation()).to.equal('Poznań, Poland');
        expect(person.getDeathDate()).to.equal('1939-10-14');
        expect(person.getDeathLocation()).to.equal('Amsterdam, Montgomery, New York, United States');
        expect(person.getId()).to.equal(10147690);
        expect(person.isLiving()).to.be.false;
        expect(person.getName()).to.equal('Wojnowski-3');
      });
    });
  });
  
});