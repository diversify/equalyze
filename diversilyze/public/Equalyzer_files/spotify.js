//////////////////////////////////////////////////////////////////////////
//                                                                      //
// This is a generated file. You can view the original                  //
// source in your browser if your browser supports source maps.         //
//                                                                      //
// If you are using Chrome, open the Developer Tools and click the gear //
// icon in its lower right corner. In the General Settings panel, turn  //
// on 'Enable source maps'.                                             //
//                                                                      //
// If you are using Firefox 23, go to `about:config` and set the        //
// `devtools.debugger.source-maps-enabled` preference to true.          //
// (The preference should be on by default in Firefox 24; versions      //
// older than 23 do not support source maps.)                           //
//                                                                      //
//////////////////////////////////////////////////////////////////////////


(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var _ = Package.underscore._;
var ReactiveVar = Package['reactive-var'].ReactiveVar;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;

/* Package-scope variables */
var SpotifyWebApi, Spotify;

(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/spotify/spotify.js                                                                                         //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
SpotifyWebApi = (function() {                                                                                          // 1
                                                                                                                       // 2
  'use strict';                                                                                                        // 3
  var _baseUri = 'https://api.spotify.com/v1';                                                                         // 4
  var _accessToken = null;                                                                                             // 5
  var _promiseImplementation = null;                                                                                   // 6
                                                                                                                       // 7
  var _promiseProvider = function(promiseFunction) {                                                                   // 8
    if (_promiseImplementation !== null) {                                                                             // 9
      var deferred = _promiseImplementation.defer();                                                                   // 10
      promiseFunction(function(resolvedResult) {                                                                       // 11
        deferred.resolve(resolvedResult);                                                                              // 12
      }, function(rejectedResult) {                                                                                    // 13
        deferred.reject(rejectedResult);                                                                               // 14
      });                                                                                                              // 15
      return deferred.promise;                                                                                         // 16
    } else {                                                                                                           // 17
      if (window.Promise) {                                                                                            // 18
        return new window.Promise(promiseFunction);                                                                    // 19
      }                                                                                                                // 20
    }                                                                                                                  // 21
    return null;                                                                                                       // 22
  };                                                                                                                   // 23
                                                                                                                       // 24
  var _checkParamsAndPerformRequest = function(requestData, options, callback) {                                       // 25
    var opt = {};                                                                                                      // 26
    var cb = null;                                                                                                     // 27
                                                                                                                       // 28
    if (typeof options === 'object') {                                                                                 // 29
      opt = options;                                                                                                   // 30
      cb = callback;                                                                                                   // 31
    } else if (typeof options === 'function') {                                                                        // 32
      cb = options;                                                                                                    // 33
    }                                                                                                                  // 34
                                                                                                                       // 35
    // options extend postData, if any. Otherwise they extend parameters sent in the url                               // 36
    var type = requestData.type || 'GET';                                                                              // 37
    if (type !== 'GET' && requestData.postData) {                                                                      // 38
      requestData.postData = _extend(requestData.postData, opt);                                                       // 39
    } else {                                                                                                           // 40
      requestData.params = _extend(requestData.params, opt);                                                           // 41
    }                                                                                                                  // 42
    return _performRequest(requestData, cb);                                                                           // 43
  };                                                                                                                   // 44
                                                                                                                       // 45
  var _performRequest = function(requestData, callback) {                                                              // 46
    var promiseFunction = function(resolve, reject) {                                                                  // 47
      var req = new XMLHttpRequest();                                                                                  // 48
      var type = requestData.type || 'GET';                                                                            // 49
      req.open(type, _buildUrl(requestData.url, requestData.params));                                                  // 50
      if (_accessToken) {                                                                                              // 51
        req.setRequestHeader('Authorization', 'Bearer ' + _accessToken);                                               // 52
      }                                                                                                                // 53
                                                                                                                       // 54
      req.onreadystatechange = function() {                                                                            // 55
        if (req.readyState === 4) {                                                                                    // 56
          var data = null;                                                                                             // 57
          try {                                                                                                        // 58
            data = req.responseText ? JSON.parse(req.responseText) : '';                                               // 59
          } catch (e) {}                                                                                               // 60
                                                                                                                       // 61
          if (req.status === 200 || req.status === 201) {                                                              // 62
            if (resolve) {                                                                                             // 63
              resolve(data);                                                                                           // 64
            }                                                                                                          // 65
            if (callback) {                                                                                            // 66
              callback(null, data);                                                                                    // 67
            }                                                                                                          // 68
          } else {                                                                                                     // 69
            if (reject) {                                                                                              // 70
              reject(req);                                                                                             // 71
            }                                                                                                          // 72
            if (callback) {                                                                                            // 73
              callback(req, null);                                                                                     // 74
            }                                                                                                          // 75
          }                                                                                                            // 76
        }                                                                                                              // 77
      };                                                                                                               // 78
                                                                                                                       // 79
      if (type === 'GET') {                                                                                            // 80
        req.send(null);                                                                                                // 81
      } else {                                                                                                         // 82
        req.send(JSON.stringify(requestData.postData));                                                                // 83
      }                                                                                                                // 84
    };                                                                                                                 // 85
                                                                                                                       // 86
    if (callback) {                                                                                                    // 87
      promiseFunction();                                                                                               // 88
      return null;                                                                                                     // 89
    } else {                                                                                                           // 90
      return _promiseProvider(promiseFunction);                                                                        // 91
    }                                                                                                                  // 92
  };                                                                                                                   // 93
                                                                                                                       // 94
  var _extend = function() {                                                                                           // 95
    var args = Array.prototype.slice.call(arguments);                                                                  // 96
    var target = args[0];                                                                                              // 97
    var objects = args.slice(1);                                                                                       // 98
    target = target || {};                                                                                             // 99
    for (var i = 0; i < objects.length; i++) {                                                                         // 100
      for (var j in objects[i]) {                                                                                      // 101
        target[j] = objects[i][j];                                                                                     // 102
      }                                                                                                                // 103
    }                                                                                                                  // 104
    return target;                                                                                                     // 105
  };                                                                                                                   // 106
                                                                                                                       // 107
  var _buildUrl = function(url, parameters){                                                                           // 108
    var qs = '';                                                                                                       // 109
    for (var key in parameters) {                                                                                      // 110
      if (parameters.hasOwnProperty(key)) {                                                                            // 111
        var value = parameters[key];                                                                                   // 112
        qs += encodeURIComponent(key) + '=' + encodeURIComponent(value) + '&';                                         // 113
      }                                                                                                                // 114
    }                                                                                                                  // 115
    if (qs.length > 0){                                                                                                // 116
      qs = qs.substring(0, qs.length - 1); //chop off last '&'                                                         // 117
      url = url + '?' + qs;                                                                                            // 118
    }                                                                                                                  // 119
    return url;                                                                                                        // 120
  };                                                                                                                   // 121
                                                                                                                       // 122
  var Constr = function() {};                                                                                          // 123
                                                                                                                       // 124
  Constr.prototype = {                                                                                                 // 125
    constructor: SpotifyWebApi                                                                                         // 126
  };                                                                                                                   // 127
                                                                                                                       // 128
  /**                                                                                                                  // 129
  * Fetches a resource through a generic GET request.                                                                  // 130
  * @param {string} url The URL to be fetched                                                                          // 131
  * @param {function(Object, Object)} callback An optional callback                                                    // 132
  * @return {Object} Null if a callback is provided, a `Promise` object otherwise                                      // 133
  */                                                                                                                   // 134
  Constr.prototype.getGeneric = function(url, callback) {                                                              // 135
    var requestData = {                                                                                                // 136
      url: url                                                                                                         // 137
    };                                                                                                                 // 138
    return _checkParamsAndPerformRequest(requestData, callback);                                                       // 139
  };                                                                                                                   // 140
                                                                                                                       // 141
  /**                                                                                                                  // 142
  * Fetches information about the current user.                                                                        // 143
  * See [Get Current User's Profile](https://developer.spotify.com/web-api/get-current-users-profile/) on              // 144
  * the Spotify Developer site for more information about the endpoint.                                                // 145
  * @param {Object} options A JSON object with options that can be passed                                              // 146
  * @param {function(Object, Object)} callback An optional callback that receives 2 parameters. The first              // 147
  * one is the error object (null if no error), and the second is the value if the request succeeded.                  // 148
  * @return {Object} Null if a callback is provided, a `Promise` object otherwise                                      // 149
  */                                                                                                                   // 150
  Constr.prototype.getMe = function(options, callback) {                                                               // 151
    var requestData = {                                                                                                // 152
      url: _baseUri + '/me'                                                                                            // 153
    };                                                                                                                 // 154
    return _checkParamsAndPerformRequest(requestData, options, callback);                                              // 155
  };                                                                                                                   // 156
                                                                                                                       // 157
  /**                                                                                                                  // 158
  * Fetches current user's saved tracks.                                                                               // 159
  * See [Get Current User's Saved Tracks](https://developer.spotify.com/web-api/get-users-saved-tracks/) on            // 160
  * the Spotify Developer site for more information about the endpoint.                                                // 161
  * @param {Object} options A JSON object with options that can be passed                                              // 162
  * @param {function(Object, Object)} callback An optional callback that receives 2 parameters. The first              // 163
  * one is the error object (null if no error), and the second is the value if the request succeeded.                  // 164
  * @return {Object} Null if a callback is provided, a `Promise` object otherwise                                      // 165
  */                                                                                                                   // 166
  Constr.prototype.getMySavedTracks = function(options, callback) {                                                    // 167
    var requestData = {                                                                                                // 168
      url: _baseUri + '/me/tracks'                                                                                     // 169
    };                                                                                                                 // 170
    return _checkParamsAndPerformRequest(requestData, options, callback);                                              // 171
  };                                                                                                                   // 172
                                                                                                                       // 173
  /**                                                                                                                  // 174
  * Adds a list of tracks to the current user's saved tracks.                                                          // 175
  * See [Save Tracks for Current User](https://developer.spotify.com/web-api/save-tracks-user/) on                     // 176
  * the Spotify Developer site for more information about the endpoint.                                                // 177
  * @param {Array<string>} trackIds The ids of the tracks. If you know their Spotify URI it is easy                    // 178
  * to find their track id (e.g. spotify:track:<here_is_the_track_id>)                                                 // 179
  * @param {Object} options A JSON object with options that can be passed                                              // 180
  * @param {function(Object, Object)} callback An optional callback that receives 2 parameters. The first              // 181
  * one is the error object (null if no error), and the second is the value if the request succeeded.                  // 182
  * @return {Object} Null if a callback is provided, a `Promise` object otherwise                                      // 183
  */                                                                                                                   // 184
  Constr.prototype.addToMySavedTracks = function(trackIds, options, callback) {                                        // 185
    var requestData = {                                                                                                // 186
      url: _baseUri + '/me/tracks',                                                                                    // 187
      type: 'PUT',                                                                                                     // 188
      postData: trackIds                                                                                               // 189
    };                                                                                                                 // 190
    return _checkParamsAndPerformRequest(requestData, options, callback);                                              // 191
  };                                                                                                                   // 192
                                                                                                                       // 193
  /**                                                                                                                  // 194
  * Remove a list of tracks from the current user's saved tracks.                                                      // 195
  * See [Remove Tracks for Current User](https://developer.spotify.com/web-api/remove-tracks-user/) on                 // 196
  * the Spotify Developer site for more information about the endpoint.                                                // 197
  * @param {Array<string>} trackIds The ids of the tracks. If you know their Spotify URI it is easy                    // 198
  * to find their track id (e.g. spotify:track:<here_is_the_track_id>)                                                 // 199
  * @param {Object} options A JSON object with options that can be passed                                              // 200
  * @param {function(Object, Object)} callback An optional callback that receives 2 parameters. The first              // 201
  * one is the error object (null if no error), and the second is the value if the request succeeded.                  // 202
  * @return {Object} Null if a callback is provided, a `Promise` object otherwise                                      // 203
  */                                                                                                                   // 204
  Constr.prototype.removeFromMySavedTracks = function(trackIds, options, callback) {                                   // 205
    var requestData = {                                                                                                // 206
      url: _baseUri + '/me/tracks',                                                                                    // 207
      type: 'DELETE',                                                                                                  // 208
      postData: trackIds                                                                                               // 209
    };                                                                                                                 // 210
    return _checkParamsAndPerformRequest(requestData, options, callback);                                              // 211
  };                                                                                                                   // 212
                                                                                                                       // 213
  /**                                                                                                                  // 214
  * Checks if the current user's saved tracks contains a certain list of tracks.                                       // 215
  * See [Check Current User's Saved Tracks](https://developer.spotify.com/web-api/check-users-saved-tracks/) on        // 216
  * the Spotify Developer site for more information about the endpoint.                                                // 217
  * @param {Array<string>} trackIds The ids of the tracks. If you know their Spotify URI it is easy                    // 218
  * to find their track id (e.g. spotify:track:<here_is_the_track_id>)                                                 // 219
  * @param {Object} options A JSON object with options that can be passed                                              // 220
  * @param {function(Object, Object)} callback An optional callback that receives 2 parameters. The first              // 221
  * one is the error object (null if no error), and the second is the value if the request succeeded.                  // 222
  * @return {Object} Null if a callback is provided, a `Promise` object otherwise                                      // 223
  */                                                                                                                   // 224
  Constr.prototype.containsMySavedTracks = function(trackIds, options, callback) {                                     // 225
    var requestData = {                                                                                                // 226
      url: _baseUri + '/me/tracks/contains',                                                                           // 227
      params: { ids: trackIds.join(',') }                                                                              // 228
    };                                                                                                                 // 229
    return _checkParamsAndPerformRequest(requestData, options, callback);                                              // 230
  };                                                                                                                   // 231
                                                                                                                       // 232
  /**                                                                                                                  // 233
  * Fetches information about a specific user.                                                                         // 234
  * See [Get a User's Profile](https://developer.spotify.com/web-api/get-users-profile/) on                            // 235
  * the Spotify Developer site for more information about the endpoint.                                                // 236
  * @param {string} userId The id of the user. If you know the Spotify URI it is easy                                  // 237
  * to find the id (e.g. spotify:user:<here_is_the_id>)                                                                // 238
  * @param {Object} options A JSON object with options that can be passed                                              // 239
  * @param {function(Object, Object)} callback An optional callback that receives 2 parameters. The first              // 240
  * one is the error object (null if no error), and the second is the value if the request succeeded.                  // 241
  * @return {Object} Null if a callback is provided, a `Promise` object otherwise                                      // 242
  */                                                                                                                   // 243
  Constr.prototype.getUser = function(userId, options, callback) {                                                     // 244
    var requestData = {                                                                                                // 245
      url: _baseUri + '/users/' + userId                                                                               // 246
    };                                                                                                                 // 247
    return _checkParamsAndPerformRequest(requestData, options, callback);                                              // 248
  };                                                                                                                   // 249
                                                                                                                       // 250
  /**                                                                                                                  // 251
  * Fetches a list of the current user's playlists.                                                                    // 252
  * See [Get a List of a User's Playlists](https://developer.spotify.com/web-api/get-list-users-playlists/) on         // 253
  * the Spotify Developer site for more information about the endpoint.                                                // 254
  * @param {string} userId The id of the user. If you know the Spotify URI it is easy                                  // 255
  * to find the id (e.g. spotify:user:<here_is_the_id>)                                                                // 256
  * @param {Object} options A JSON object with options that can be passed                                              // 257
  * @param {function(Object, Object)} callback An optional callback that receives 2 parameters. The first              // 258
  * one is the error object (null if no error), and the second is the value if the request succeeded.                  // 259
  * @return {Object} Null if a callback is provided, a `Promise` object otherwise                                      // 260
  */                                                                                                                   // 261
  Constr.prototype.getUserPlaylists = function(userId, options, callback) {                                            // 262
    var requestData = {                                                                                                // 263
      url: _baseUri + '/users/' + userId + '/playlists'                                                                // 264
    };                                                                                                                 // 265
    return _checkParamsAndPerformRequest(requestData, options, callback);                                              // 266
  };                                                                                                                   // 267
                                                                                                                       // 268
  /**                                                                                                                  // 269
  * Fetches a specific playlist.                                                                                       // 270
  * See [Get a Playlist](https://developer.spotify.com/web-api/get-playlist/) on                                       // 271
  * the Spotify Developer site for more information about the endpoint.                                                // 272
  * @param {string} userId The id of the user. If you know the Spotify URI it is easy                                  // 273
  * to find the user id (e.g. spotify:user:<here_is_the_user_id>:playlist:xxxx)                                        // 274
  * @param {string} playlistId The id of the playlist. If you know the Spotify URI it is easy                          // 275
  * to find the playlist id (e.g. spotify:user:xxxx:playlist:<here_is_the_playlist_id>)                                // 276
  * @param {Object} options A JSON object with options that can be passed                                              // 277
  * @param {function(Object, Object)} callback An optional callback that receives 2 parameters. The first              // 278
  * one is the error object (null if no error), and the second is the value if the request succeeded.                  // 279
  * @return {Object} Null if a callback is provided, a `Promise` object otherwise                                      // 280
  */                                                                                                                   // 281
  Constr.prototype.getPlaylist = function(userId, playlistId, options, callback) {                                     // 282
    var requestData = {                                                                                                // 283
      url: _baseUri + '/users/' + userId + '/playlists/' + playlistId                                                  // 284
    };                                                                                                                 // 285
    return _checkParamsAndPerformRequest(requestData, options, callback);                                              // 286
  };                                                                                                                   // 287
                                                                                                                       // 288
  /**                                                                                                                  // 289
  * Fetches the tracks from a specific playlist.                                                                       // 290
  * See [Get a Playlist's Tracks](https://developer.spotify.com/web-api/get-playlists-tracks/) on                      // 291
  * the Spotify Developer site for more information about the endpoint.                                                // 292
  * @param {string} userId The id of the user. If you know the Spotify URI it is easy                                  // 293
  * to find the user id (e.g. spotify:user:<here_is_the_user_id>:playlist:xxxx)                                        // 294
  * @param {string} playlistId The id of the playlist. If you know the Spotify URI it is easy                          // 295
  * to find the playlist id (e.g. spotify:user:xxxx:playlist:<here_is_the_playlist_id>)                                // 296
  * @param {Object} options A JSON object with options that can be passed                                              // 297
  * @param {function(Object, Object)} callback An optional callback that receives 2 parameters. The first              // 298
  * one is the error object (null if no error), and the second is the value if the request succeeded.                  // 299
  * @return {Object} Null if a callback is provided, a `Promise` object otherwise                                      // 300
  */                                                                                                                   // 301
  Constr.prototype.getPlaylistTracks = function(userId, playlistId, options, callback) {                               // 302
    var requestData = {                                                                                                // 303
      url: _baseUri + '/users/' + userId + '/playlists/' + playlistId + '/tracks'                                      // 304
    };                                                                                                                 // 305
    return _checkParamsAndPerformRequest(requestData, options, callback);                                              // 306
  };                                                                                                                   // 307
                                                                                                                       // 308
  /**                                                                                                                  // 309
  * Creates a playlist and stores it in the current user's library.                                                    // 310
  * See [Create a Playlist](https://developer.spotify.com/web-api/create-playlist/) on                                 // 311
  * the Spotify Developer site for more information about the endpoint.                                                // 312
  * @param {string} userId The id of the user. You may want to user the "getMe" function to                            // 313
  * find out the id of the current logged in user                                                                      // 314
  * @param {Object} options A JSON object with options that can be passed                                              // 315
  * @param {function(Object, Object)} callback An optional callback that receives 2 parameters. The first              // 316
  * one is the error object (null if no error), and the second is the value if the request succeeded.                  // 317
  * @return {Object} Null if a callback is provided, a `Promise` object otherwise                                      // 318
  */                                                                                                                   // 319
  Constr.prototype.createPlaylist = function(userId, options, callback) {                                              // 320
    var requestData = {                                                                                                // 321
      url: _baseUri + '/users/' + userId + '/playlists',                                                               // 322
      type: 'POST',                                                                                                    // 323
      postData: options                                                                                                // 324
    };                                                                                                                 // 325
    return _checkParamsAndPerformRequest(requestData, options, callback);                                              // 326
  };                                                                                                                   // 327
                                                                                                                       // 328
  /**                                                                                                                  // 329
  * Change a playlist's name and public/private state                                                                  // 330
  * See [Change a Playlist's Details](https://developer.spotify.com/web-api/change-playlist-details/) on               // 331
  * the Spotify Developer site for more information about the endpoint.                                                // 332
  * @param {string} userId The id of the user. You may want to user the "getMe" function to                            // 333
  * find out the id of the current logged in user                                                                      // 334
  * @param {string} playlistId The id of the playlist. If you know the Spotify URI it is easy                          // 335
  * to find the playlist id (e.g. spotify:user:xxxx:playlist:<here_is_the_playlist_id>)                                // 336
  * @param {Object} data A JSON object with the data to update. E.g. {name: 'A new name', public: true}                // 337
  * @param {function(Object, Object)} callback An optional callback that receives 2 parameters. The first              // 338
  * one is the error object (null if no error), and the second is the value if the request succeeded.                  // 339
  * @return {Object} Null if a callback is provided, a `Promise` object otherwise                                      // 340
  */                                                                                                                   // 341
  Constr.prototype.changePlaylistDetails = function(userId, playlistId, data, callback) {                              // 342
    var requestData = {                                                                                                // 343
      url: _baseUri + '/users/' + userId + '/playlists/' + playlistId,                                                 // 344
      type: 'PUT',                                                                                                     // 345
      postData: data                                                                                                   // 346
    };                                                                                                                 // 347
    return _checkParamsAndPerformRequest(requestData, data, callback);                                                 // 348
  };                                                                                                                   // 349
                                                                                                                       // 350
  /**                                                                                                                  // 351
  * Add tracks to a playlist.                                                                                          // 352
  * See [Add Tracks to a Playlist](https://developer.spotify.com/web-api/add-tracks-to-playlist/) on                   // 353
  * the Spotify Developer site for more information about the endpoint.                                                // 354
  * @param {string} userId The id of the user. If you know the Spotify URI it is easy                                  // 355
  * to find the user id (e.g. spotify:user:<here_is_the_user_id>:playlist:xxxx)                                        // 356
  * @param {string} playlistId The id of the playlist. If you know the Spotify URI it is easy                          // 357
  * to find the playlist id (e.g. spotify:user:xxxx:playlist:<here_is_the_playlist_id>)                                // 358
  * @param {Array<string>} uris An array of Spotify URIs for the tracks                                                // 359
  * @param {Object} options A JSON object with options that can be passed                                              // 360
  * @param {function(Object, Object)} callback An optional callback that receives 2 parameters. The first              // 361
  * one is the error object (null if no error), and the second is the value if the request succeeded.                  // 362
  * @return {Object} Null if a callback is provided, a `Promise` object otherwise                                      // 363
  */                                                                                                                   // 364
  Constr.prototype.addTracksToPlaylist = function(userId, playlistId, uris, options, callback) {                       // 365
    var requestData = {                                                                                                // 366
      url: _baseUri + '/users/' + userId + '/playlists/' + playlistId + '/tracks',                                     // 367
      type: 'POST',                                                                                                    // 368
      params: {                                                                                                        // 369
        uris: uris                                                                                                     // 370
      }                                                                                                                // 371
    };                                                                                                                 // 372
    return _checkParamsAndPerformRequest(requestData, options, callback);                                              // 373
  };                                                                                                                   // 374
                                                                                                                       // 375
  /**                                                                                                                  // 376
  * Replace the tracks of a plsylist                                                                                   // 377
  * See [Replace a Playlist's Tracks](https://developer.spotify.com/web-api/replace-playlists-tracks/) on              // 378
  * the Spotify Developer site for more information about the endpoint.                                                // 379
  * @param {string} userId The id of the user. If you know the Spotify URI it is easy                                  // 380
  * to find the user id (e.g. spotify:user:<here_is_the_user_id>:playlist:xxxx)                                        // 381
  * @param {string} playlistId The id of the playlist. If you know the Spotify URI it is easy                          // 382
  * to find the playlist id (e.g. spotify:user:xxxx:playlist:<here_is_the_playlist_id>)                                // 383
  * @param {Array<string>} uris An array of Spotify URIs for the tracks                                                // 384
  * @param {function(Object, Object)} callback An optional callback that receives 2 parameters. The first              // 385
  * one is the error object (null if no error), and the second is the value if the request succeeded.                  // 386
  * @return {Object} Null if a callback is provided, a `Promise` object otherwise                                      // 387
  */                                                                                                                   // 388
  Constr.prototype.replaceTracksInPlaylist = function(userId, playlistId, uris, callback) {                            // 389
    var requestData = {                                                                                                // 390
      url: _baseUri + '/users/' + userId + '/playlists/' + playlistId + '/tracks',                                     // 391
      type: 'PUT',                                                                                                     // 392
      postData: {uris: uris}                                                                                           // 393
    };                                                                                                                 // 394
    return _checkParamsAndPerformRequest(requestData, {}, callback);                                                   // 395
  };                                                                                                                   // 396
                                                                                                                       // 397
  /**                                                                                                                  // 398
  * Remove tracks from a playlist                                                                                      // 399
  * See [Remove Tracks from a Playlist](https://developer.spotify.com/web-api/remove-tracks-playlist/) on              // 400
  * the Spotify Developer site for more information about the endpoint.                                                // 401
  * @param {string} userId The id of the user. If you know the Spotify URI it is easy                                  // 402
  * to find the user id (e.g. spotify:user:<here_is_the_user_id>:playlist:xxxx)                                        // 403
  * @param {string} playlistId The id of the playlist. If you know the Spotify URI it is easy                          // 404
  * to find the playlist id (e.g. spotify:user:xxxx:playlist:<here_is_the_playlist_id>)                                // 405
  * @param {Array<Object>} uris An array of tracks to be removed. Each element of the array can be either a            // 406
  * string, in which case it is treated as a URI, or an object containing the properties `uri` (which is a             // 407
  * string) and `positions` (which is an array of integers).                                                           // 408
  * @param {function(Object, Object)} callback An optional callback that receives 2 parameters. The first              // 409
  * one is the error object (null if no error), and the second is the value if the request succeeded.                  // 410
  * @return {Object} Null if a callback is provided, a `Promise` object otherwise                                      // 411
  */                                                                                                                   // 412
  Constr.prototype.removeTracksFromPlaylist = function(userId, playlistId, uris, callback) {                           // 413
    var dataToBeSent = uris.map(function(uri) {                                                                        // 414
      if (typeof uri === 'string') {                                                                                   // 415
        return { uri: uri };                                                                                           // 416
      } else {                                                                                                         // 417
        return uri;                                                                                                    // 418
      }                                                                                                                // 419
    });                                                                                                                // 420
                                                                                                                       // 421
    var requestData = {                                                                                                // 422
      url: _baseUri + '/users/' + userId + '/playlists/' + playlistId + '/tracks',                                     // 423
      type: 'DELETE',                                                                                                  // 424
      postData: {tracks: dataToBeSent}                                                                                 // 425
    };                                                                                                                 // 426
    return _checkParamsAndPerformRequest(requestData, {}, callback);                                                   // 427
  };                                                                                                                   // 428
                                                                                                                       // 429
  /**                                                                                                                  // 430
  * Remove tracks from a playlist, specifying a snapshot id.                                                           // 431
  * See [Remove Tracks from a Playlist](https://developer.spotify.com/web-api/remove-tracks-playlist/) on              // 432
  * the Spotify Developer site for more information about the endpoint.                                                // 433
  * @param {string} userId The id of the user. If you know the Spotify URI it is easy                                  // 434
  * to find the user id (e.g. spotify:user:<here_is_the_user_id>:playlist:xxxx)                                        // 435
  * @param {string} playlistId The id of the playlist. If you know the Spotify URI it is easy                          // 436
  * to find the playlist id (e.g. spotify:user:xxxx:playlist:<here_is_the_playlist_id>)                                // 437
  * @param {Array<Object>} uris An array of tracks to be removed. Each element of the array can be either a            // 438
  * string, in which case it is treated as a URI, or an object containing the properties `uri` (which is a             // 439
  * string) and `positions` (which is an array of integers).                                                           // 440
  * @param {string} snapshotId The playlist's snapshot ID against which you want to make the changes                   // 441
  * @param {function(Object, Object)} callback An optional callback that receives 2 parameters. The first              // 442
  * one is the error object (null if no error), and the second is the value if the request succeeded.                  // 443
  * @return {Object} Null if a callback is provided, a `Promise` object otherwise                                      // 444
  */                                                                                                                   // 445
  Constr.prototype.removeTracksFromPlaylistWithSnapshotId = function(userId, playlistId, uris, snapshotId, callback) { // 446
    /*jshint camelcase: false */                                                                                       // 447
    var dataToBeSent = uris.map(function(uri) {                                                                        // 448
      if (typeof uri === 'string') {                                                                                   // 449
        return { uri: uri };                                                                                           // 450
      } else {                                                                                                         // 451
        return uri;                                                                                                    // 452
      }                                                                                                                // 453
    });                                                                                                                // 454
                                                                                                                       // 455
    var requestData = {                                                                                                // 456
      url: _baseUri + '/users/' + userId + '/playlists/' + playlistId + '/tracks',                                     // 457
      type: 'DELETE',                                                                                                  // 458
      postData: {                                                                                                      // 459
        tracks: dataToBeSent,                                                                                          // 460
        snapshot_id: snapshotId                                                                                        // 461
      }                                                                                                                // 462
    };                                                                                                                 // 463
    return _checkParamsAndPerformRequest(requestData, {}, callback);                                                   // 464
  };                                                                                                                   // 465
  /**                                                                                                                  // 466
  * Fetches an album from the Spotify catalog.                                                                         // 467
  * See [Get an Album](https://developer.spotify.com/web-api/get-album/) on                                            // 468
  * the Spotify Developer site for more information about the endpoint.                                                // 469
  * @param {string} albumId The id of the album. If you know the Spotify URI it is easy                                // 470
  * to find the album id (e.g. spotify:album:<here_is_the_album_id>)                                                   // 471
  * @param {Object} options A JSON object with options that can be passed                                              // 472
  * @param {function(Object, Object)} callback An optional callback that receives 2 parameters. The first              // 473
  * one is the error object (null if no error), and the second is the value if the request succeeded.                  // 474
  * @return {Object} Null if a callback is provided, a `Promise` object otherwise                                      // 475
  */                                                                                                                   // 476
  Constr.prototype.getAlbum = function(albumId, options, callback) {                                                   // 477
    var requestData = {                                                                                                // 478
      url: _baseUri + '/albums/' + albumId                                                                             // 479
    };                                                                                                                 // 480
    return _checkParamsAndPerformRequest(requestData, options, callback);                                              // 481
  };                                                                                                                   // 482
                                                                                                                       // 483
  /**                                                                                                                  // 484
  * Fetches the tracks of an album from the Spotify catalog.                                                           // 485
  * See [Get an Album's Tracks](https://developer.spotify.com/web-api/get-albums-tracks/) on                           // 486
  * the Spotify Developer site for more information about the endpoint.                                                // 487
  * @param {string} albumId The id of the album. If you know the Spotify URI it is easy                                // 488
  * to find the album id (e.g. spotify:album:<here_is_the_album_id>)                                                   // 489
  * @param {Object} options A JSON object with options that can be passed                                              // 490
  * @param {function(Object, Object)} callback An optional callback that receives 2 parameters. The first              // 491
  * one is the error object (null if no error), and the second is the value if the request succeeded.                  // 492
  * @return {Object} Null if a callback is provided, a `Promise` object otherwise                                      // 493
  */                                                                                                                   // 494
  Constr.prototype.getAlbumTracks = function(albumId, options, callback) {                                             // 495
    var requestData = {                                                                                                // 496
      url: _baseUri + '/albums/' + albumId + '/tracks'                                                                 // 497
    };                                                                                                                 // 498
    return _checkParamsAndPerformRequest(requestData, options, callback);                                              // 499
  };                                                                                                                   // 500
                                                                                                                       // 501
  /**                                                                                                                  // 502
  * Fetches multiple albums from the Spotify catalog.                                                                  // 503
  * See [Get Several Albums](https://developer.spotify.com/web-api/get-several-albums/) on                             // 504
  * the Spotify Developer site for more information about the endpoint.                                                // 505
  * @param {Array<string>} albumIds The ids of the albums. If you know their Spotify URI it is easy                    // 506
  * to find their album id (e.g. spotify:album:<here_is_the_album_id>)                                                 // 507
  * @param {Object} options A JSON object with options that can be passed                                              // 508
  * @param {function(Object, Object)} callback An optional callback that receives 2 parameters. The first              // 509
  * one is the error object (null if no error), and the second is the value if the request succeeded.                  // 510
  * @return {Object} Null if a callback is provided, a `Promise` object otherwise                                      // 511
  */                                                                                                                   // 512
  Constr.prototype.getAlbums = function(albumIds, options, callback) {                                                 // 513
    var requestData = {                                                                                                // 514
      url: _baseUri + '/albums/',                                                                                      // 515
      params: { ids: albumIds.join(',') }                                                                              // 516
    };                                                                                                                 // 517
    return _checkParamsAndPerformRequest(requestData, options, callback);                                              // 518
  };                                                                                                                   // 519
                                                                                                                       // 520
  /**                                                                                                                  // 521
  * Fetches a track from the Spotify catalog.                                                                          // 522
  * See [Get a Track](https://developer.spotify.com/web-api/get-track/) on                                             // 523
  * the Spotify Developer site for more information about the endpoint.                                                // 524
  * @param {string} trackId The id of the track. If you know the Spotify URI it is easy                                // 525
  * to find the track id (e.g. spotify:track:<here_is_the_track_id>)                                                   // 526
  * @param {Object} options A JSON object with options that can be passed                                              // 527
  * @param {function(Object, Object)} callback An optional callback that receives 2 parameters. The first              // 528
  * one is the error object (null if no error), and the second is the value if the request succeeded.                  // 529
  * @return {Object} Null if a callback is provided, a `Promise` object otherwise                                      // 530
  */                                                                                                                   // 531
  Constr.prototype.getTrack = function(trackId, options, callback) {                                                   // 532
    var requestData = {};                                                                                              // 533
    requestData.url = _baseUri + '/tracks/' + trackId;                                                                 // 534
    return _checkParamsAndPerformRequest(requestData, options, callback);                                              // 535
  };                                                                                                                   // 536
                                                                                                                       // 537
  /**                                                                                                                  // 538
  * Fetches multiple tracks from the Spotify catalog.                                                                  // 539
  * See [Get Several Tracks](https://developer.spotify.com/web-api/get-several-tracks/) on                             // 540
  * the Spotify Developer site for more information about the endpoint.                                                // 541
  * @param {Array<string>} trackIds The ids of the tracks. If you know their Spotify URI it is easy                    // 542
  * to find their track id (e.g. spotify:track:<here_is_the_track_id>)                                                 // 543
  * @param {Object} options A JSON object with options that can be passed                                              // 544
  * @param {function(Object, Object)} callback An optional callback that receives 2 parameters. The first              // 545
  * one is the error object (null if no error), and the second is the value if the request succeeded.                  // 546
  * @return {Object} Null if a callback is provided, a `Promise` object otherwise                                      // 547
  */                                                                                                                   // 548
  Constr.prototype.getTracks = function(trackIds, options, callback) {                                                 // 549
    var requestData = {                                                                                                // 550
      url: _baseUri + '/tracks/',                                                                                      // 551
      params: { ids: trackIds.join(',') }                                                                              // 552
    };                                                                                                                 // 553
    return _checkParamsAndPerformRequest(requestData, options, callback);                                              // 554
  };                                                                                                                   // 555
                                                                                                                       // 556
  /**                                                                                                                  // 557
  * Fetches an artist from the Spotify catalog.                                                                        // 558
  * See [Get an Artist](https://developer.spotify.com/web-api/get-artist/) on                                          // 559
  * the Spotify Developer site for more information about the endpoint.                                                // 560
  * @param {string} artistId The id of the artist. If you know the Spotify URI it is easy                              // 561
  * to find the artist id (e.g. spotify:artist:<here_is_the_artist_id>)                                                // 562
  * @param {Object} options A JSON object with options that can be passed                                              // 563
  * @param {function(Object, Object)} callback An optional callback that receives 2 parameters. The first              // 564
  * one is the error object (null if no error), and the second is the value if the request succeeded.                  // 565
  * @return {Object} Null if a callback is provided, a `Promise` object otherwise                                      // 566
  */                                                                                                                   // 567
  Constr.prototype.getArtist = function(artistId, options, callback) {                                                 // 568
    var requestData = {                                                                                                // 569
      url: _baseUri + '/artists/' + artistId                                                                           // 570
    };                                                                                                                 // 571
    return _checkParamsAndPerformRequest(requestData, options, callback);                                              // 572
  };                                                                                                                   // 573
                                                                                                                       // 574
  /**                                                                                                                  // 575
  * Fetches multiple artists from the Spotify catalog.                                                                 // 576
  * See [Get Several Artists](https://developer.spotify.com/web-api/get-several-artists/) on                           // 577
  * the Spotify Developer site for more information about the endpoint.                                                // 578
  * @param {Array<string>} artistIds The ids of the artists. If you know their Spotify URI it is easy                  // 579
  * to find their artist id (e.g. spotify:artist:<here_is_the_artist_id>)                                              // 580
  * @param {Object} options A JSON object with options that can be passed                                              // 581
  * @param {function(Object, Object)} callback An optional callback that receives 2 parameters. The first              // 582
  * one is the error object (null if no error), and the second is the value if the request succeeded.                  // 583
  * @return {Object} Null if a callback is provided, a `Promise` object otherwise                                      // 584
  */                                                                                                                   // 585
  Constr.prototype.getArtists = function(artistIds, options, callback) {                                               // 586
    var requestData = {                                                                                                // 587
      url: _baseUri + '/artists/',                                                                                     // 588
      params: { ids: artistIds.join(',') }                                                                             // 589
    };                                                                                                                 // 590
    return _checkParamsAndPerformRequest(requestData, options, callback);                                              // 591
  };                                                                                                                   // 592
                                                                                                                       // 593
  /**                                                                                                                  // 594
  * Fetches the albums of an artist from the Spotify catalog.                                                          // 595
  * See [Get an Artist's Albums](https://developer.spotify.com/web-api/get-artists-albums/) on                         // 596
  * the Spotify Developer site for more information about the endpoint.                                                // 597
  * @param {string} artistId The id of the artist. If you know the Spotify URI it is easy                              // 598
  * to find the artist id (e.g. spotify:artist:<here_is_the_artist_id>)                                                // 599
  * @param {Object} options A JSON object with options that can be passed                                              // 600
  * @param {function(Object, Object)} callback An optional callback that receives 2 parameters. The first              // 601
  * one is the error object (null if no error), and the second is the value if the request succeeded.                  // 602
  * @return {Object} Null if a callback is provided, a `Promise` object otherwise                                      // 603
  */                                                                                                                   // 604
  Constr.prototype.getArtistAlbums = function(artistId, options, callback) {                                           // 605
    var requestData = {                                                                                                // 606
      url: _baseUri + '/artists/' + artistId + '/albums'                                                               // 607
    };                                                                                                                 // 608
    return _checkParamsAndPerformRequest(requestData, options, callback);                                              // 609
  };                                                                                                                   // 610
                                                                                                                       // 611
  /**                                                                                                                  // 612
  * Fetches a list of top tracks of an artist from the Spotify catalog, for a specific country.                        // 613
  * See [Get an Artist's Top Tracks](https://developer.spotify.com/web-api/get-artists-top-tracks/) on                 // 614
  * the Spotify Developer site for more information about the endpoint.                                                // 615
  * @param {string} artistId The id of the artist. If you know the Spotify URI it is easy                              // 616
  * to find the artist id (e.g. spotify:artist:<here_is_the_artist_id>)                                                // 617
  * @param {string} countryId The id of the country (e.g. ES for Spain or US for United States)                        // 618
  * @param {Object} options A JSON object with options that can be passed                                              // 619
  * @param {function(Object, Object)} callback An optional callback that receives 2 parameters. The first              // 620
  * one is the error object (null if no error), and the second is the value if the request succeeded.                  // 621
  * @return {Object} Null if a callback is provided, a `Promise` object otherwise                                      // 622
  */                                                                                                                   // 623
  Constr.prototype.getArtistTopTracks = function(artistId, countryId, options, callback) {                             // 624
    var requestData = {                                                                                                // 625
      url: _baseUri + '/artists/' + artistId + '/top-tracks',                                                          // 626
      params: { country: countryId }                                                                                   // 627
    };                                                                                                                 // 628
    return _checkParamsAndPerformRequest(requestData, options, callback);                                              // 629
  };                                                                                                                   // 630
                                                                                                                       // 631
  /**                                                                                                                  // 632
  * Fetches a list of artists related with a given one from the Spotify catalog.                                       // 633
  * See [Get an Artist's Related Artists](https://developer.spotify.com/web-api/get-related-artists/) on               // 634
  * the Spotify Developer site for more information about the endpoint.                                                // 635
  * @param {string} artistId The id of the artist. If you know the Spotify URI it is easy                              // 636
  * to find the artist id (e.g. spotify:artist:<here_is_the_artist_id>)                                                // 637
  * @param {Object} options A JSON object with options that can be passed                                              // 638
  * @param {function(Object, Object)} callback An optional callback that receives 2 parameters. The first              // 639
  * one is the error object (null if no error), and the second is the value if the request succeeded.                  // 640
  * @return {Object} Null if a callback is provided, a `Promise` object otherwise                                      // 641
  */                                                                                                                   // 642
  Constr.prototype.getArtistRelatedArtists = function(artistId, options, callback) {                                   // 643
    var requestData = {                                                                                                // 644
      url: _baseUri + '/artists/' + artistId + '/related-artists'                                                      // 645
    };                                                                                                                 // 646
    return _checkParamsAndPerformRequest(requestData, options, callback);                                              // 647
  };                                                                                                                   // 648
                                                                                                                       // 649
  /**                                                                                                                  // 650
  * Fetches a list of Spotify featured playlists (shown, for example, on a Spotify player's "Browse" tab).             // 651
  * See [Get a List of Featured Playlists](https://developer.spotify.com/web-api/get-list-featured-playlists/) on      // 652
  * the Spotify Developer site for more information about the endpoint.                                                // 653
  * @param {Object} options A JSON object with options that can be passed                                              // 654
  * @param {function(Object, Object)} callback An optional callback that receives 2 parameters. The first              // 655
  * one is the error object (null if no error), and the second is the value if the request succeeded.                  // 656
  * @return {Object} Null if a callback is provided, a `Promise` object otherwise                                      // 657
  */                                                                                                                   // 658
  Constr.prototype.getFeaturedPlaylists = function(options, callback) {                                                // 659
    var requestData = {                                                                                                // 660
      url: _baseUri + '/browse/featured-playlists'                                                                     // 661
    };                                                                                                                 // 662
    return _checkParamsAndPerformRequest(requestData, options, callback);                                              // 663
  };                                                                                                                   // 664
                                                                                                                       // 665
  /**                                                                                                                  // 666
  * Fetches a list of new album releases featured in Spotify (shown, for example, on a Spotify player's "Browse" tab). // 667
  * See [Get a List of New Releases](https://developer.spotify.com/web-api/get-list-new-releases/) on                  // 668
  * the Spotify Developer site for more information about the endpoint.                                                // 669
  * @param {Object} options A JSON object with options that can be passed                                              // 670
  * @param {function(Object, Object)} callback An optional callback that receives 2 parameters. The first              // 671
  * one is the error object (null if no error), and the second is the value if the request succeeded.                  // 672
  * @return {Object} Null if a callback is provided, a `Promise` object otherwise                                      // 673
  */                                                                                                                   // 674
  Constr.prototype.getNewReleases = function(options, callback) {                                                      // 675
    var requestData = {                                                                                                // 676
      url: _baseUri + '/browse/new-releases'                                                                           // 677
    };                                                                                                                 // 678
    return _checkParamsAndPerformRequest(requestData, options, callback);                                              // 679
  };                                                                                                                   // 680
                                                                                                                       // 681
  /**                                                                                                                  // 682
  * Fetches albums from the Spotify catalog according to a query.                                                      // 683
  * See [Search for an Item](https://developer.spotify.com/web-api/search-item/) on                                    // 684
  * the Spotify Developer site for more information about the endpoint.                                                // 685
  * @param {Object} options A JSON object with options that can be passed                                              // 686
  * @param {function(Object, Object)} callback An optional callback that receives 2 parameters. The first              // 687
  * one is the error object (null if no error), and the second is the value if the request succeeded.                  // 688
  * @return {Object} Null if a callback is provided, a `Promise` object otherwise                                      // 689
  */                                                                                                                   // 690
  Constr.prototype.searchAlbums = function(query, options, callback) {                                                 // 691
    var requestData = {                                                                                                // 692
      url: _baseUri + '/search/',                                                                                      // 693
      params: {                                                                                                        // 694
        q: query,                                                                                                      // 695
        type: 'album'                                                                                                  // 696
      }                                                                                                                // 697
    };                                                                                                                 // 698
    return _checkParamsAndPerformRequest(requestData, options, callback);                                              // 699
  };                                                                                                                   // 700
                                                                                                                       // 701
  /**                                                                                                                  // 702
  * Fetches artists from the Spotify catalog according to a query.                                                     // 703
  * See [Search for an Item](https://developer.spotify.com/web-api/search-item/) on                                    // 704
  * the Spotify Developer site for more information about the endpoint.                                                // 705
  * @param {Object} options A JSON object with options that can be passed                                              // 706
  * @param {function(Object, Object)} callback An optional callback that receives 2 parameters. The first              // 707
  * one is the error object (null if no error), and the second is the value if the request succeeded.                  // 708
  * @return {Object} Null if a callback is provided, a `Promise` object otherwise                                      // 709
  */                                                                                                                   // 710
  Constr.prototype.searchArtists = function(query, options, callback) {                                                // 711
    var requestData = {                                                                                                // 712
      url: _baseUri + '/search/',                                                                                      // 713
      params: {                                                                                                        // 714
        q: query,                                                                                                      // 715
        type: 'artist'                                                                                                 // 716
      }                                                                                                                // 717
    };                                                                                                                 // 718
    return _checkParamsAndPerformRequest(requestData, options, callback);                                              // 719
  };                                                                                                                   // 720
                                                                                                                       // 721
  /**                                                                                                                  // 722
  * Fetches tracks from the Spotify catalog according to a query.                                                      // 723
  * See [Search for an Item](https://developer.spotify.com/web-api/search-item/) on                                    // 724
  * the Spotify Developer site for more information about the endpoint.                                                // 725
  * @param {Object} options A JSON object with options that can be passed                                              // 726
  * @param {function(Object, Object)} callback An optional callback that receives 2 parameters. The first              // 727
  * one is the error object (null if no error), and the second is the value if the request succeeded.                  // 728
  * @return {Object} Null if a callback is provided, a `Promise` object otherwise                                      // 729
  */                                                                                                                   // 730
  Constr.prototype.searchTracks = function(query, options, callback) {                                                 // 731
    var requestData = {                                                                                                // 732
      url: _baseUri + '/search/',                                                                                      // 733
      params: {                                                                                                        // 734
        q: query,                                                                                                      // 735
        type: 'track'                                                                                                  // 736
      }                                                                                                                // 737
    };                                                                                                                 // 738
    return _checkParamsAndPerformRequest(requestData, options, callback);                                              // 739
  };                                                                                                                   // 740
                                                                                                                       // 741
  /**                                                                                                                  // 742
  * Sets the access token to be used.                                                                                  // 743
  * See [the Authorization Guide](https://developer.spotify.com/web-api/authorization-guide/) on                       // 744
  * the Spotify Developer site for more information about obtaining an access token.                                   // 745
  * @param {string} accessToken The access token                                                                       // 746
  */                                                                                                                   // 747
  Constr.prototype.setAccessToken = function(accessToken) {                                                            // 748
    _accessToken = accessToken;                                                                                        // 749
  };                                                                                                                   // 750
                                                                                                                       // 751
  /**                                                                                                                  // 752
  * Sets an implementation of Promises/A+ to be used. E.g. Q, when.                                                    // 753
  * See [Conformant Implementations](https://github.com/promises-aplus/promises-spec/blob/master/implementations.md)   // 754
  * for a list of some available options                                                                               // 755
  * @param {Object} promiseImplementation A Promises/A+ valid implementation                                           // 756
  */                                                                                                                   // 757
  Constr.prototype.setPromiseImplementation = function(promiseImplementation) {                                        // 758
    if (!('defer' in promiseImplementation)) {                                                                         // 759
      throw new Error('Unsupported implementation of Promises/A+');                                                    // 760
    } else {                                                                                                           // 761
      _promiseImplementation = promiseImplementation;                                                                  // 762
    }                                                                                                                  // 763
  };                                                                                                                   // 764
                                                                                                                       // 765
  return Constr;                                                                                                       // 766
})();                                                                                                                  // 767
                                                                                                                       // 768
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/spotify/init.js                                                                                            //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Spotify = new SpotifyWebApi()                                                                                          // 1
                                                                                                                       // 2
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package.spotify = {
  SpotifyWebApi: SpotifyWebApi,
  Spotify: Spotify
};

})();
