require('./setup');

var wikitree = require('./../lib/wikitree'),
    expect = require('chai').expect;
    
describe('getProfile', function(){
  
  it('no id', function(){
    expect(function(){
      wikitree.getProfile();
    }).to.throw(Error, 'Profile id is required.');
  });
  
  it('with id', function(done){
    wikitree.getProfile('Clark-21849').done(function(person){
      check(done, function(){
        expect(person).to.be.instanceof(wikitree.Person);
        expect(person.getDisplayName()).to.equal('Allan Clark');
      });
    });
  });
  
});