AuthInformation = new Mongo.Collection('authInfos');
Playlists = new Mongo.Collection('playlists');
Diversity = new Mongo.Collection('diversity');
GenresData = new Mongo.Collection('genres');
RelatedArtistData = new Mongo.Collection('relatedartists');
UniqueRelatedArtists = new Mongo.Collection('uniquerelatedartists');

AuthInformation.isAuthed = function() {
  return !!AuthInformation.findOne()
}

