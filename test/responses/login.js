module.exports = function(opts){
  if(opts.user_id){
    return {"login":{"result":57489123}};
  }
  if(opts.email && opts.password){
    if(opts.email === 'test@testing.com' && opts.password === 'foobaz'){
      return {"login":{"result":"Success","userid":57489123,"username":"Test-123","token":"55c9d999bb1737df431"}}
    } else {
      return {"login":{"result":"WrongPass","wait":1}}; 
    }
  }
};