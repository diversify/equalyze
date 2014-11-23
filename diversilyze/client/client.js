var auth_url = 'https://accounts.spotify.com/authorize'

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
 var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var state = generateRandomString(16)

var data = {
  response_type: 'token',
  client_id: '3c03b59c6cc2404aa818748e9250ed47',
  redirect_uri: 'http://localhost:3000/callback',
  scope: 'user-read-private user-read-email playlist-read-private',
  show_dialog: true
}

Router.onBeforeAction(function() {
  if(!AuthInformation.isAuthed()) {
    this.render('login')
  }
  else {

    var token = AuthInformation.findOne().token
    Spotify.setAccessToken(token)
    Spotify.getMe().then(function(me) {
      Session.set('currentUser', {userID: me.id, token: token});
    });
    this.next()
  }

}, { except: ['callback'] })

Router.route('/', function() {
  this.render('analyze')
})

Router.route('/callback', function() {
  console.log('callback');
  var hash = this.params.hash;
  if(hash) {
    var data = Helpers.queryToObject(hash)
    console.log(data)
    AuthInformation.insert({token: data.access_token, userID: data.id})
    this.redirect('/')
  }
})

Router.route('/result', function() {
  this.render('result')
})

Template.analyze.helpers({
  artists: function() {
    return ArtistsData.find();
  },

  genres: function() {
    return GenresData.find();
  },

  relatedStuff: function() {
    var playlistID = Session.get('currentPlaylist')
    var relatedArtists = RelatedArtistData.find({playlistID: playlistID}).fetch();
    var genres = GenresData.find({playlistID: playlistID}).fetch();
    var genresData = [];
    var artistData = [];
    var addIt = true;
    var n = 0
    var stop = false;
    genres.forEach(function(genreObj){
      genresData.push(genreObj.genre);
    })
    relatedArtists.forEach(function(artist) {
      if(!stop) {
        artist.genres.forEach(function(genre) {
          var check = $.inArray(genre, genresData);
          if(check >= 0) {
            addIt = false;
          }
        })
        if(addIt) {
          console.log(n)
          n++;
          if(n<30) {
            Spotify.getArtist(artist.id).then(function(artistObj) {
              UniqueRelatedArtists.insert({playlistID: playlistID, artist: artistObj})
              console.log('asd')
              artistData.push(artistObj)
            })
          } else {
            stop = true
          }
        }
        addIt = true;
      }})
    console.log(artistData)
    //console.log("Playlist: " + playlistID)
  //  console.log("RelatedArtistData: " + relatedArtists)
//    console.log("Genres: " + genres);
},

relatedArtists: function() {
  var playlistID =  Session.get('currentPlaylist');
  return UniqueRelatedArtists.find({playlistID: playlistID});
}
})

Template.login.events({
  'click #login': function() {

    if(!AuthInformation.isAuthed()) {
      window.location = auth_url + Helpers.toQueryString(data)
    }
  }
})

Template.analyze.helpers({
  playlists: function() {

    return Playlists.find();
  },
  diversity: function() {
    return Diversity.findOne();
  }

  
})

/*Template.diversityItem.helpers({
  fixDiversity: function(diversityRate) {
    return Math.round(diversityRate * 100);
  }
})*/

Template.analyze.events({
  'click #analyze': function() {
    var userID = Session.get('currentUser').userID;
    var promise = Spotify.getUserPlaylists(userID).then(function(playlists) {
      var returnTwo =  Spotify.getPlaylistTracks(userID, playlists.items[13].id).then(function(tracks) {
        var diversityReturn = Helpers.checkDiversity(tracks, playlists.items[13].id);
        return diversityReturn;
      })
      return returnTwo;
    })
    promise.then(function(diversity) {
      var pieData = [
      {
        value: Math.round(diversity*100),
        segmentShowStroke : false,
        segmentStrokeWidth : 0,
        color:"#F2345A",
        animationEasing : "easeOutBounce",
        label: "Men"
      },
      {
        value: Math.round((1-diversity)*100),
        segmentShowStroke : false,
        highlight: "#5AD3D1",
        color:"#FF3500",
        label: "Women"
      }
      ];

      var ctx = document.getElementById("chart-area").getContext("2d");
      var myPie = new Chart(ctx).Pie(pieData);
      console.log(myPie)
    })
  }
})
