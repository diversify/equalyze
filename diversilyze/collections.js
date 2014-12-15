AuthInformation = new Mongo.Collection('authInfos');
Playlists = new Mongo.Collection('playlists');
Diversity = new Mongo.Collection('diversity');
GenresData = new Mongo.Collection('genres');
Artists = new Mongo.Collection('artists');
RelatedArtists = new Mongo.Collection('relatedArtists');

AuthInformation.isAuthed = function() {
  return !!AuthInformation.findOne()
}

