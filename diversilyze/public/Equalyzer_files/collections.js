(function(){Tokens = new Mongo.Collection('tokens')

Tokens.isAuthed = function() {
  return !!Tokens.findOne()
}

})();
