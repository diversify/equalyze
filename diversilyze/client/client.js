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

var callbackTest = 'http://localhost:3000/callback';
var callback = 'http://equalyze.meteor.com/callback' ;

var state = generateRandomString(16)

var data = {
  response_type: 'token',
  client_id: '3c03b59c6cc2404aa818748e9250ed47',
  redirect_uri: callbackTest,
  scope: 'user-read-private playlist-read-private playlist-modify-private playlist-modify-public',
  show_dialog: true
}

var playlistNbr = 13;
var graphKey = 'e6168997c0e6b8db78bef46b04a9b794';
var graph_artist_url = 'http://api.musicgraph.com/api/v2/artist/search?api_key='+graphKey;

var currentUser;


Router.onBeforeAction(function() {
  if(!Session.get('currentToken')) {
    this.render('login')
  }
  else {
    var token = Session.get('currentToken')
    Spotify.setAccessToken(token)
    var promise = Spotify.getMe().then(function(me) {
      return me;
    });

    promise.then(function(me) {
      Session.set('currentUser', me.id)
    })
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
  var hash = this.params.hash;
  if(hash) {
    var data = Helpers.queryToObject(hash)
    AuthInformation.insert({token: data.access_token})
    Session.set('currentToken', data.access_token)
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
    var userID = Session.get('currentUser');
    console.log("setAlbumCovers", userID)
    var promise = Spotify.getUserPlaylists(userID).then(function(playlists) {
      return playlists.items[playlistNbr].id;
    });

    promise.then(function(playlistID) {
      Session.set('currentPlaylist', playlistID);
    });
    var playlistID = Session.get('currentPlaylist');
    var promiseTwo = Spotify.getPlaylistTracks(userID, playlistID).then(function(tracks) {
      return tracks;
    })

    promiseTwo.then(function(tracks) {
      for (var i = 0; i < playlistNbr; i++) {
        var url = tracks.items[i].track.album.images[0].url
        $('#album-'+i).css('background', "url("+url+")")
        $('#album-'+i).css('background-size', "100%")
        $('#album-'+i).css('background-repeat', "no-repeat")
      };
    })
  },

  setRelatedAlbums: function() {
    $('#recommend-1').css('background', 'url('+"http://cdn.necolebitchie.com/wp-content/uploads/2008/07/maino-album-cover-pa.jpg"+') no-repeat')
    $('#recommend-2').css('background', 'url('+"http://blog.michaellavine.com/wp-content/uploads/2010/10/mb_cover.jpg"+') no-repeat')
    $('#recommend-3').css('background', 'url('+"http://4.bp.blogspot.com/_9dPtEKC0NW4/Ss7y_zFM4EI/AAAAAAAABaw/CASHQhIKKn8/s400/nirvana_nevermind_album_cover.jpg"+') no-repeat')
  }
})

Template.login.events({
  'click #login': function() {
    if(!Session.get('currentToken')) {
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
  },

  playlists: function() {
    if(Session.get('currentUser')){
      var userID = Session.get('currentUser');
      var playlistPromise = Spotify.getUserPlaylists(userID, {limit: 50}).then(function(playlists) {
        return playlists;
      })

      playlistPromise.then(function(playlists) {
        playlists.items.forEach(function(playlist) {
          $('#playlist-container').append('<option data-owner="'+playlist.owner.id+'"" data-id="'+playlist.id+'">'+playlist.name+'</option>')
        })
      })  
    }
  }
  
})

Template.analyze.events({
  'click #analyze': function(evt) {
    var playlistID = $('#playlist-container').find(':selected').data('id');
    var playlistOwner = $('#playlist-container').find(':selected').data('owner');
    var playlistArtistsPromise = Spotify.getPlaylistTracks(playlistOwner, playlistID).then(function(tracks) {
      var playlistArtists = [];
      tracks.items.forEach(function(track) {
        if(track.track.id != null) {
          playlistArtists.push({"artistID":track.track.artists[0].id, "artistName": track.track.artists[0].name});
        }

      })
      return playlistArtists;

    })

    playlistArtistsPromise.then(function(artistToCheck) {
      var artistGender = [];
      var relatedSongUris = [];
      console.log(artistToCheck)
      Meteor.call('getArtistData', artistToCheck, function(error, genderResult) {
        if(genderResult == -1) {
          console.log("Too long list")
        } else {
          var genderNbrs = Helpers.getNbrOfGenders(genderResult);
          if(genderNbrs.male > genderNbrs.female) {
            Session.set('genderMinority', 'female')
            $('.result-msg-title').text("Oh no!")
            $('.result-msg').text("Your playlist is not very diverse... Check out these artists to make it more diverse!")
            $('.recommend-title').text("Recommended artists")

            Meteor.call('getGenderArtistList', artistToCheck, "female", function(error, relatedArtistResult) {
              relatedArtistResult.forEach(function(artist) {
                var relatedArtistPromise = Spotify.searchArtists(artist.relatedArtist, {limit: 1}).then(function(relatedArtist) {
                  return relatedArtist.artists.items[0].id
                })
                relatedArtistPromise.then(function(artistID) {
                  var artistTopTrackPromise = Spotify.getArtistTopTracks(artistID, "SE", {limit: 1}).then(function(topTracks) {
                    return topTracks.tracks[0];
                  })
                  artistTopTrackPromise.then(function(track) {
                    relatedSongUris.push(track.uri);
                    if(relatedSongUris.length == relatedArtistResult.length) {
                      $('#recommendation-list').empty();
                      relatedSongUris = _.uniq(relatedSongUris)
                      relatedSongUris.forEach(function(uri) {
                        $('#recommendation-list').append('<li><iframe src="https://embed.spotify.com/?uri='+uri+'" width="300" height="80" frameborder="0" allowtransparency="true"></iframe><input class="add-song" type="button" data-trackUri="'+uri+'" value="Add" /></li>')
                      })
                    }
                  })
                })
              })

            })

          } else if(genderNbrs.male < genderNbrs.female) {
            Session.set('genderMinority', 'male')
            $('.result-msg-title').text("Oh no!")
            $('.result-msg').text("Your playlist is not very diverse... Check out these artists to make it more diverse!")
            $('.recommend-title').text("Recommended artists")
            Meteor.call('getGenderArtistList', artistToCheck, "male", function(error, relatedArtistResult) {
              relatedArtistResult.forEach(function(artist) {
                var relatedArtistPromise = Spotify.searchArtists(artist.relatedArtist, {limit: 1}).then(function(relatedArtist) {
                  return relatedArtist.artists.items[0].id
                })
                relatedArtistPromise.then(function(artistID) {
                  var artistTopTrackPromise = Spotify.getArtistTopTracks(artistID, "SE", {limit: 1}).then(function(topTracks) {
                    return topTracks.tracks[0];
                  })
                  artistTopTrackPromise.then(function(track) {
                    relatedSongUris.push(track.uri);
                    if(relatedSongUris.length == relatedArtistResult.length) {
                      $('#recommendation-list').empty();
                      relatedSongUris = _.uniq(relatedSongUris)
                      relatedSongUris.forEach(function(uri) {
                        $('#recommendation-list').append('<li><iframe src="https://embed.spotify.com/?uri='+uri+'" width="300" height="80" frameborder="0" allowtransparency="true"></iframe><input class="add-song" type="button" data-trackUri="'+uri+'" value="Add" /></li>')
                      })
                    }
                  })
                })
              })

            })
          } else {
            $('.result-msg-title').text("Nice!")
            $('.result-msg').text("You have a perfectly gender diverse playlist!")
            $('.recommend-title').empty()
            $('#recommendation-list').empty()
          }
          
          $('#male-container').text('Male: '+Session.get('genderNbrs').male)
          $('#female-container').text('Female: '+Session.get('genderNbrs').female)
          $('#unknown-container').text('Unknown: '+Session.get('genderNbrs').unknown)
           $(".result-chart").addClass("flipInX"); // Pop-in animation of results
           $(".result-msg-container").addClass("fadeInDown");
           $(".album-cover-small").addClass("fadeOutUp");
           $(".album-cover-large").addClass("fadeOutUp");
           var pieData = [
           {
            value: Session.get('genderNbrs').male,
            segmentShowStroke : false,
            segmentStrokeWidth : 0,
            color:"green",
            label: "Male"
          },
          {
            value: Session.get('genderNbrs').female,
            segmentShowStroke : false,
            segmentStrokeWidth : 0,
            color:"red",
            label: "Female"

          }
          ];
          var ctx = document.getElementById("chart-area").getContext("2d");
          var myPie = new Chart(ctx).Pie(pieData);

        }
      })
      return artistGender;
    })
  },

  'click .add-song': function(evt, err) {
    var genderMinority = Session.get('genderMinority')
    var male = Session.get('genderNbrs').male
    var female = Session.get('genderNbrs').female
    var unknown = Session.get('genderNbrs').unknown
    if(genderMinority == "male") {
      Session.set('genderNbrs', {"male": male+1, "female": female, "unknown": unknown})
    } else {
      Session.set('genderNbrs', {"male": male, "female": female+1, "unknown": unknown})
    }
    var trackUri = $(evt.target).data('trackUri');
    var userID = Session.get('currentUser');
    var playlistID = $('#playlist-container').find(':selected').data('id');
    $(evt.target).attr('disabled', true)
    $(evt.target).val('Added!')
    var addPromise = Spotify.addTracksToPlaylist(userID, playlistID, trackUri).then(function(result) {
      console.log(result)   
    })
  }
})
