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

var playlistNbr = 13;

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

Router.route('/about',function(){
  this.render('about')
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

  setAlbumCovers: function() {   
    var userID = Session.get('currentUser').userID;
    console.log(userID)
    console.log(playlistNbr)
    var promise = Spotify.getUserPlaylists(userID).then(function(playlists) {
      return playlists.items[playlistNbr].id;
    });

    promise.then(function(playlistID) {
      console.log(playlistID)
      Session.set('currentPlaylist', playlistID);
    });
    var playlistID = Session.get('currentPlaylist');
    var promiseTwo = Spotify.getPlaylistTracks(userID, playlistID).then(function(tracks) {
      return tracks;
    })

    console.log(promiseTwo)
    promiseTwo.then(function(tracks) {
      for (var i = 0; i < playlistNbr; i++) {
          var url = tracks.items[i].track.album.images[0].url
          $('#album-'+i).css('background', "url("+url+")")
          $('#album-'+i).css('background-size', "100%")
          $('#album-'+i).css('background-repeat', "no-repeat")
      };
    })
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

Template.analyze.events({
  'click #analyze': function() {
    var userID = Session.get('currentUser').userID;
    var promise = Spotify.getUserPlaylists(userID).then(function(playlists) {
      var returnTwo =  Spotify.getPlaylistTracks(userID, playlists.items[playlistNbr].id).then(function(tracks) {
        var diversityReturn = Helpers.checkDiversity(tracks, playlists.items[playlistNbr].id);
        return diversityReturn;
      })
      return returnTwo;
    })
      $(".result-chart").addClass("flipInX"); // Pop-in animation of results
      $(".result-msg-container").addClass("fadeInDown");
      $(".album-cover-small").addClass("fadeOutUp");
      $(".album-cover-large").addClass("fadeOutUp");
    promise.then(function(diversity) {
      var promiseTwo = Spotify.getUser(userID).then(function(user) {
        return user;
      })
      promiseTwo.then(function(spotifyUser) {
        console.log("Doing chart")
        $('.result-chart').css('background-image', 'url(' + spotifyUser.images[0].url + ')');
        var pieData = [
        {
          value: Math.round(diversity*100),
          segmentShowStroke : false,
          segmentStrokeWidth : 0,
          color:"#F2345A",
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

      })
      
    })
  }
})
