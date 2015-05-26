require('./setup');

var wikitree = require('./../lib/wikitree'),
    expect = require('chai').expect,
    cookies = require('mozilla-doc-cookies');
    
describe('Session', function(){
  
  it.only('checkLogin success', function(done){
    wikitree.checkLogin({
      user_id: 57489123,
      user_name: 'Test-123'
    }).done(function(){
      check(done, function(){
        expect(wikitree.session.loggedIn).to.be.true;
        expect(wikitree.session.user_id).to.equal(57489123);
        expect(wikitree.session.user_name).to.equal('Test-123');
      });
    });
  });
  
  it('checkLogin fail', function(done){
    wikitree.checkLogin({
      user_id: 25487512,
      user_name: 'Test-789'
    }).fail(function(){
      check(done, function(){
        expect(wikitree.session.loggedIn).to.be.false;
        expect(wikitree.session.user_id).to.equal(25487512);
        expect(wikitree.session.user_name).to.equal('Test-789');
      });
    });
  });
  
  it('login success', function(done){
    wikitree.login({
      email: 'test@testing.com',
      password: 'foobaz'
    }).done(function(){
      check(done, function(){
        expect(wikitree.session.loggedIn).to.be.true;
        expect(wikitree.session.user_id).to.equal(57489123);
        expect(wikitree.session.user_name).to.equal('Test-123');
        wikitree.logout();
        expect(wikitree.session.loggedIn).to.be.false;
        expect(wikitree.session.user_id).to.equal('');
        expect(wikitree.session.user_name).to.equal('');
      });
    });
  });
  
  it('login fail', function(done){
    wikitree.login({
      email: 'test@testing.com',
      password: 'wrong'
    }).fail(function(){
      check(done, function(){
        expect(wikitree.session.loggedIn).to.be.false;
        expect(wikitree.session.user_id).to.equal('');
        expect(wikitree.session.user_name).to.equal('');
      });
    });
  });
  
});