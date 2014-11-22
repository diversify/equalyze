Helpers = {
  toQueryString: function(params) {
    var parts = []
    for (var i in params) {
      if (params.hasOwnProperty(i)) {
        parts.push(encodeURIComponent(i) + "=" + encodeURIComponent(params[i]))
      }
    }
    return '?'+parts.join('&')
  },

  queryToObject: function(q) {
    return q.split('&').reduce(function(obj, pair){
      var keyValues = pair.split('=')
      obj[keyValues[0]] = keyValues[1]
      return obj
    }, {})
  }
}
