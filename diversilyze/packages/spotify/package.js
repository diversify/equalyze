Package.describe({
  summary: "Spotify for Meteor"
});

Package.on_use(function (api) {
	api.add_files("spotify.js", "client");

	api.export("SpotifyWebApi", "client")
})