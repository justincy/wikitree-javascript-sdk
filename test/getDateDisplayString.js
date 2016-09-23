require('./setup');

var utils = require('./../lib/utils'),
    expect = require('chai').expect;
    
describe('getDateDisplayString', function(){
  
  it('basic', function(){
    expect(utils.getDateDisplayString('1931-02-01')).to.equal('February 1, 1931');
    expect(utils.getDateDisplayString('1918-01-01')).to.equal('January 1, 1918');
  });
  
});