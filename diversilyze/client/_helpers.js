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
  },

  checkDiversity: function(tracks, playlistID) {
    var promises = tracks.items.map(function(track) {
      return Spotify.getArtist(track.track.artists[0].id).then(function(artist) {
        return artist.genres
      })
    })
    return Promise.all(promises).then(function(genres) {
      var unique = _.chain(genres).flatten().uniq().value()
      var total = _.chain(genres).flatten().value()
      var diversity = unique.length/total.length;
      unique.forEach(function(genre) {
        GenresData.insert({playlistID: playlistID, genre: genre})
      })
      Diversity.insert({playlistID: playlistID, diversity: diversity});
      Session.set('currentPlaylist', playlistID)
      return diversity;
    })

  },

  getNbrOfGenders: function(genderData) {
    var nbrOfMale = 0;
    var nbrOfFemale = 0;
    var nbrOfUnknown = 0;
    genderData.forEach(function(genderObj) {
      if(genderObj == "Male") {
        nbrOfMale++;
      } else if(genderObj == "Female") {
        nbrOfFemale++;
      } else {
        nbrOfUnknown++;
      }
    })
    var genderNbrs = {"male": nbrOfMale, "female": nbrOfFemale, "unknown": nbrOfUnknown} 
    Session.set('genderNbrs', genderNbrs);
    return genderNbrs;    
  }
}

