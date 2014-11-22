var spotifyApi = new SpotifyWebApi();
Users = new Mongo.Collection('currentusers');
Token = new Mongo.Collection('tokens');

var auth_url = "https://accounts.spotify.com/authorize";

var client_id = '3c03b59c6cc2404aa818748e9250ed47'; // Your client id
var secret = '81c0291692294979a7a38ebe7e96bf86'; // Your secret
var redirect_uri = 'http://localhost:3000/callback'; // Your redirect uri

var auth_params = {
	client_id: client_id,
	redirect_uri: redirect_uri,
	scope: "user-read-private user-read-email playlist-read playlist-read-private",
	response_type: "token",
	show_dialog: true
}

var auth_window = null;

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

 var stateKey = 'spotify_auth_state';

 Router.route('/', function() {
 	this.render('home');
 })

 Router.route('callback', {
 	path: '/callback',
 	action: function () {
 		var params = location.hash.split("#")[1].split(/&|=/)
 		var data = {
 			token: params[ params.indexOf('access_token') + 1 ],
 			expires: params[ params.indexOf('expires_in') + 1 ]
 		}

 		spotifyApi.setAccessToken(data.token);
 		Token.insert({token: data.token});
 		Router.go('/analyze');
 	}
 });

 Template.home.events({
 	"click #login": function(evt) {
 		evt.preventDefault();
 		auth_window = Helpers.createAuthWindow(auth_url, auth_params)
 	}
 })

 Template.analyze.helpers({
 	users: function() {
 		return Users.find();
 	}
 });

 Template.analyze.events({
 	'click input': function(event, template) {
 		spotifyApi.getUserPlaylists().then(function(data) {
 			console.log(data)
 		})
 	}
 })