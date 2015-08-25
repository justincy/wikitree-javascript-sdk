require('./setup');

var wikitree = require('./../lib/wikitree'),
    expect = require('chai').expect;
    
describe('getRelatives', function(){
  
  it('basic', function(done){
    wikitree.getRelatives(['10147690'], true, true).then(function(persons){
      check(done, function(){
        var person = persons['10147690'];
        expect(person).to.be.instanceof(wikitree.Person);
        expect(person.getDisplayName()).to.equal("Mary Wojnowski");
        expect(person.getMother()).to.be.instanceof(wikitree.Person);
        expect(person.getFather()).to.be.instanceof(wikitree.Person);
        expect(person.getChildren()).to.not.exist;
        expect(person.getSiblings()).to.not.exist;
        expect(person.getSpouses()).to.have.all.keys(['10147689']);
        expect(person.getSpouse()).to.be.instanceof(wikitree.Person);
        expect(person.getSpouse().getDisplayName()).to.equal('Albert John Zierak');
        expect(person.getFirstName()).to.equal('Mary');
        expect(person.getLastNameCurrent()).to.equal('Wojnowski');
        expect(person.getGender()).to.equal('Female');
        expect(person.getBirthDate()).to.equal('1863-00-00');
        expect(person.getBirthDateDisplay()).to.equal('1863');
        expect(person.getBirthLocation()).to.equal('Poznań, Poland');
        expect(person.getDeathDate()).to.equal('1939-10-14');
        expect(person.getDeathDateDisplay()).to.equal('October 14, 1939');
        expect(person.getDeathLocation()).to.equal('Amsterdam, Montgomery, New York, United States');
        expect(person.getId()).to.equal(10147690);
        expect(person.isLiving()).to.be.false;
        expect(person.getName()).to.equal('Wojnowski-3');
      });
    });
  });
  
});