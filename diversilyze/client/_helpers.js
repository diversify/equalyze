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
  createAuthWindow: function(url, params) {
      var width = 400,
          height = 500
      var left = (screen.width / 2) - (width / 2),
          top = (screen.height / 2) - (height / 2)

      return window.open(
        url + this.toQueryString(params),
        "Spotify",
        'menubar=no,location=no,resizable=no,scrollbars=no,status=no,'+
        'width=' + width + ', height=' + height + ', top=' + top + ', left=' + left)
    }
  }