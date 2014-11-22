Package.describe({
  description: 'Spotify for Meteor'
})

Package.on_use(function(api) {
  api.use(['underscore', 'reactive-var', 'deps'], 'client')
  api.add_files(['spotify.js', 'init.js'], 'client')

  api.export(['SpotifyWebApi', 'Spotify'], 'client')
})
