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
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var $ = Package.jquery.$;
var jQuery = Package.jquery.jQuery;
var Iron = Package['iron:core'].Iron;

/* Package-scope variables */
var urlToHashStyle, urlFromHashStyle, fixHashPath, State, Location;

(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                          //
// packages/iron:location/lib/utils.js                                                                      //
//                                                                                                          //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                            //
var Url = Iron.Url;                                                                                         // 1
var HASH_PARAM_NAME='__hash__';                                                                             // 2
                                                                                                            // 3
/**                                                                                                         // 4
 * Given:                                                                                                   // 5
 *   http://host:port/some/pathname/?query=string#bar                                                       // 6
 *                                                                                                          // 7
 * Return:                                                                                                  // 8
 *   http://host:port/?query=string&hash=bar/#/some/pathname                                                // 9
 */                                                                                                         // 10
urlToHashStyle = function (url) {                                                                           // 11
  var parts = Url.parse(url);                                                                               // 12
  var hash = parts.hash && parts.hash.replace('#', '');                                                     // 13
  var search = parts.search;                                                                                // 14
  var pathname = parts.pathname;                                                                            // 15
  var root = parts.rootUrl;                                                                                 // 16
                                                                                                            // 17
  // do we have another hash value that isn't a path?                                                       // 18
  if (hash && hash.charAt(0) !== '/') {                                                                     // 19
    var hashQueryString = HASH_PARAM_NAME + '=' + hash;                                                     // 20
    search = search ? (search + '&') : '?';                                                                 // 21
    search += hashQueryString;                                                                              // 22
  }                                                                                                         // 23
                                                                                                            // 24
  // if we don't already have a path on the hash create one                                                 // 25
  if (!hash || hash.charAt(0) !== '/') {                                                                    // 26
    hash = pathname ? '#' + pathname : '';                                                                  // 27
  } else if (hash) {                                                                                        // 28
    hash = '#' + hash;                                                                                      // 29
  }                                                                                                         // 30
                                                                                                            // 31
  return [                                                                                                  // 32
    root,                                                                                                   // 33
    hash,                                                                                                   // 34
    search                                                                                                  // 35
  ].join('');                                                                                               // 36
};                                                                                                          // 37
                                                                                                            // 38
/**                                                                                                         // 39
 * Given a url that uses the hash style (see above), return a new url that uses                             // 40
 * the hash path as a normal pathname.                                                                      // 41
 *                                                                                                          // 42
 * Given:                                                                                                   // 43
 *   http://host:port/?query=string&hash=bar/#/some/pathname                                                // 44
 *                                                                                                          // 45
 * Return:                                                                                                  // 46
 *   http://host:port/some/pathname?query=string#bar                                                        // 47
 */                                                                                                         // 48
urlFromHashStyle = function (url) {                                                                         // 49
  var parts = Url.parse(url);                                                                               // 50
  var pathname = parts.hash && parts.hash.replace('#', '');                                                 // 51
  var search = parts.search;                                                                                // 52
  var root = parts.rootUrl;                                                                                 // 53
  var hash;                                                                                                 // 54
                                                                                                            // 55
  // see if there's a hash=value in the query string in which case put it back                              // 56
  // in the normal hash position and delete it from the search string.                                      // 57
  if (_.has(parts.queryObject, HASH_PARAM_NAME)) {                                                          // 58
    hash = '#' + parts.queryObject[HASH_PARAM_NAME];                                                        // 59
    delete parts.queryObject[HASH_PARAM_NAME];                                                              // 60
  } else {                                                                                                  // 61
    hash = '';                                                                                              // 62
  }                                                                                                         // 63
                                                                                                            // 64
  return [                                                                                                  // 65
    root,                                                                                                   // 66
    pathname,                                                                                               // 67
    Url.toQueryString(parts.queryObject),                                                                   // 68
    hash                                                                                                    // 69
  ].join('');                                                                                               // 70
};                                                                                                          // 71
                                                                                                            // 72
/**                                                                                                         // 73
 * Fix up a pathname intended for use with a hash path by moving any hash                                   // 74
 * fragments into the query string.                                                                         // 75
 */                                                                                                         // 76
fixHashPath = function (pathname) {                                                                         // 77
  var parts = Url.parse(pathname);                                                                          // 78
  var query = parts.queryObject;                                                                            // 79
                                                                                                            // 80
  // if there's a hash in the path move that to the query string                                            // 81
  if (parts.hash) {                                                                                         // 82
    query.hash = parts.hash.replace('#', '')                                                                // 83
  }                                                                                                         // 84
                                                                                                            // 85
  return [                                                                                                  // 86
    parts.pathname,                                                                                         // 87
    Url.toQueryString(query)                                                                                // 88
  ].join('');                                                                                               // 89
};                                                                                                          // 90
                                                                                                            // 91
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                          //
// packages/iron:location/lib/state.js                                                                      //
//                                                                                                          //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                            //
var Url = Iron.Url;                                                                                         // 1
                                                                                                            // 2
State = function (url, options) {                                                                           // 3
  _.extend(this, Url.parse(url), {options: options || {}});                                                 // 4
};                                                                                                          // 5
                                                                                                            // 6
// XXX: should this compare options (e.g. history.state?)                                                   // 7
State.prototype.equals = function (other) {                                                                 // 8
  if (!other)                                                                                               // 9
    return false;                                                                                           // 10
                                                                                                            // 11
  if (!(other instanceof State))                                                                            // 12
    return false;                                                                                           // 13
                                                                                                            // 14
  if (other.pathname == this.pathname &&                                                                    // 15
     other.search == this.search &&                                                                         // 16
     other.hash == this.hash &&                                                                             // 17
     other.options.historyState === this.options.historyState)                                              // 18
    return true;                                                                                            // 19
                                                                                                            // 20
  return false;                                                                                             // 21
};                                                                                                          // 22
                                                                                                            // 23
State.prototype.isCancelled = function () {                                                                 // 24
  return !!this._isCancelled;                                                                               // 25
};                                                                                                          // 26
                                                                                                            // 27
State.prototype.cancelUrlChange = function () {                                                             // 28
  this._isCancelled = true;                                                                                 // 29
};                                                                                                          // 30
                                                                                                            // 31
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                          //
// packages/iron:location/lib/location.js                                                                   //
//                                                                                                          //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                            //
/*****************************************************************************/                             // 1
/* Imports */                                                                                               // 2
/*****************************************************************************/                             // 3
var Url = Iron.Url;                                                                                         // 4
                                                                                                            // 5
/*****************************************************************************/                             // 6
/* Private */                                                                                               // 7
/*****************************************************************************/                             // 8
var current = null;                                                                                         // 9
var dep = new Deps.Dependency;                                                                              // 10
var handlers = {go: [], popState: []};                                                                      // 11
                                                                                                            // 12
var isIE9 = function () {                                                                                   // 13
  return /MSIE 9/.test(navigator.appVersion);                                                               // 14
};                                                                                                          // 15
                                                                                                            // 16
var isIE8 = function () {                                                                                   // 17
  return /MSIE 8/.test(navigator.appVersion);                                                               // 18
};                                                                                                          // 19
                                                                                                            // 20
var usingAppcache = function() {                                                                            // 21
  return !! Package.appcache;                                                                               // 22
}                                                                                                           // 23
                                                                                                            // 24
var replaceStateUndefined = function() {                                                                    // 25
  return (typeof history === "undefined")  || (typeof history.pushState !== "function");                    // 26
}                                                                                                           // 27
                                                                                                            // 28
var shouldUseHashPaths = function () {                                                                      // 29
  return Location.options.useHashPaths || isIE8() || isIE9() || usingAppcache() || replaceStateUndefined(); // 30
};                                                                                                          // 31
                                                                                                            // 32
var isUsingHashPaths = function () {                                                                        // 33
  return !!Location.options.useHashPaths;                                                                   // 34
};                                                                                                          // 35
                                                                                                            // 36
var runHandlers = function(name, state) {                                                                   // 37
  _.each(handlers[name], function(cb) {                                                                     // 38
    cb.call(state);                                                                                         // 39
  });                                                                                                       // 40
}                                                                                                           // 41
                                                                                                            // 42
var set = function (state) {                                                                                // 43
  if (!(state instanceof State))                                                                            // 44
    throw new Error("Expected a State instance");                                                           // 45
                                                                                                            // 46
  if (!state.equals(current)) {                                                                             // 47
    current = state;                                                                                        // 48
    dep.changed();                                                                                          // 49
                                                                                                            // 50
    // return true to indicate state was set to a new value.                                                // 51
    return true;                                                                                            // 52
  }                                                                                                         // 53
                                                                                                            // 54
  // state not set                                                                                          // 55
  return false;                                                                                             // 56
};                                                                                                          // 57
                                                                                                            // 58
var setStateFromEventHandler = function () {                                                                // 59
  var href = location.href;                                                                                 // 60
  var state;                                                                                                // 61
                                                                                                            // 62
  if (isUsingHashPaths()) {                                                                                 // 63
    state = new State(urlFromHashStyle(href));                                                              // 64
  } else {                                                                                                  // 65
    state = new State(href, {historyState: history.state});                                                 // 66
  }                                                                                                         // 67
                                                                                                            // 68
  runHandlers('popState', state);                                                                           // 69
  set(state);                                                                                               // 70
};                                                                                                          // 71
                                                                                                            // 72
var fireOnClick = function (e) {                                                                            // 73
  var handler = onClickHandler;                                                                             // 74
  handler && handler(e);                                                                                    // 75
};                                                                                                          // 76
                                                                                                            // 77
/**                                                                                                         // 78
 * Go to a url.                                                                                             // 79
 */                                                                                                         // 80
var go = function (url, options) {                                                                          // 81
  options = options || {};                                                                                  // 82
                                                                                                            // 83
  var state = new State(url, options);                                                                      // 84
                                                                                                            // 85
  runHandlers('go', state);                                                                                 // 86
                                                                                                            // 87
  if (set(state)) {                                                                                         // 88
    Deps.afterFlush(function () {                                                                           // 89
      // if after we've flushed if nobody has cancelled the state then change                               // 90
      // the url.                                                                                           // 91
      if (!state.isCancelled()) {                                                                           // 92
        if (isUsingHashPaths()) {                                                                           // 93
          location.hash = fixHashPath(url);                                                                 // 94
        } else {                                                                                            // 95
          if (options.replaceState === true)                                                                // 96
            history.replaceState(options.historyState, null, url);                                          // 97
          else                                                                                              // 98
            history.pushState(options.historyState, null, url);                                             // 99
        }                                                                                                   // 100
      }                                                                                                     // 101
    });                                                                                                     // 102
  }                                                                                                         // 103
};                                                                                                          // 104
                                                                                                            // 105
var onClickHandler = function (e) {                                                                         // 106
  try {                                                                                                     // 107
    var el = e.currentTarget;                                                                               // 108
    var href = el.href;                                                                                     // 109
    var path = el.pathname + el.search + el.hash;                                                           // 110
                                                                                                            // 111
    // ie9 omits the leading slash in pathname - so patch up if it's missing                                // 112
    path = path.replace(/(^\/?)/,"/");                                                                      // 113
                                                                                                            // 114
    // haven't been cancelled already                                                                       // 115
    if (e.isDefaultPrevented()) {                                                                           // 116
      e.preventDefault();                                                                                   // 117
      return;                                                                                               // 118
    }                                                                                                       // 119
                                                                                                            // 120
    // with no meta key pressed                                                                             // 121
    if (e.metaKey || e.ctrlKey || e.shiftKey)                                                               // 122
      return;                                                                                               // 123
                                                                                                            // 124
    // aren't targeting a new window                                                                        // 125
    if (el.target)                                                                                          // 126
      return;                                                                                               // 127
                                                                                                            // 128
    // aren't external to the app                                                                           // 129
    if (!Url.isSameOrigin(href, location.href))                                                             // 130
      return;                                                                                               // 131
                                                                                                            // 132
    // note that we _do_ handle links which point to the current URL                                        // 133
    // and links which only change the hash.                                                                // 134
    e.preventDefault();                                                                                     // 135
                                                                                                            // 136
    // manage setting the new state and maybe pushing onto the pushState stack                              // 137
    go(path);                                                                                               // 138
  } catch (err) {                                                                                           // 139
    // make sure we can see any errors that are thrown before going to the                                  // 140
    // server.                                                                                              // 141
    e.preventDefault();                                                                                     // 142
    throw err;                                                                                              // 143
  }                                                                                                         // 144
};                                                                                                          // 145
                                                                                                            // 146
/*****************************************************************************/                             // 147
/* Location API */                                                                                          // 148
/*****************************************************************************/                             // 149
                                                                                                            // 150
/**                                                                                                         // 151
 * Main Location object. Reactively respond to url changes. Normalized urls                                 // 152
 * between hash style (ie8/9) and normal style using pushState.                                             // 153
 */                                                                                                         // 154
Location = {};                                                                                              // 155
                                                                                                            // 156
/**                                                                                                         // 157
 * Default options.                                                                                         // 158
 */                                                                                                         // 159
Location.options = {                                                                                        // 160
  linkSelector: 'a[href]',                                                                                  // 161
  useHashPaths: false                                                                                       // 162
};                                                                                                          // 163
                                                                                                            // 164
/**                                                                                                         // 165
 * Set options on the Location object.                                                                      // 166
 */                                                                                                         // 167
Location.configure = function (options) {                                                                   // 168
  _.extend(this.options, options || {});                                                                    // 169
};                                                                                                          // 170
                                                                                                            // 171
/**                                                                                                         // 172
 * Reactively get the current state.                                                                        // 173
 */                                                                                                         // 174
Location.get = function () {                                                                                // 175
  dep.depend();                                                                                             // 176
  return current;                                                                                           // 177
};                                                                                                          // 178
                                                                                                            // 179
/**                                                                                                         // 180
 * Set the initial state and start listening for url events.                                                // 181
 */                                                                                                         // 182
Location.start = function () {                                                                              // 183
  if (this._isStarted)                                                                                      // 184
    return;                                                                                                 // 185
                                                                                                            // 186
  // if we're using the /#/items/5 style then start off at the root url but                                 // 187
  // store away the pathname, query and hash into the hash fragment so when the                             // 188
  // client gets the response we can render the correct page.                                               // 189
  if (shouldUseHashPaths()) {                                                                               // 190
    // if we have any pathname like /items/5 take a trip to the server to get us                            // 191
    // back a root url.                                                                                     // 192
    var parts = Url.parse(location.href);                                                                   // 193
                                                                                                            // 194
    if (parts.pathname.length > 1) {                                                                        // 195
      var url = urlToHashStyle(location.href);                                                              // 196
      window.location = url;                                                                                // 197
    }                                                                                                       // 198
                                                                                                            // 199
    // ok good to go                                                                                        // 200
    this.configure({useHashPaths: true});                                                                   // 201
  }                                                                                                         // 202
                                                                                                            // 203
  // set initial state                                                                                      // 204
  var href = location.href;                                                                                 // 205
                                                                                                            // 206
  if (isUsingHashPaths()) {                                                                                 // 207
    var state = new State(urlFromHashStyle(href));                                                          // 208
    set(state);                                                                                             // 209
  } else {                                                                                                  // 210
    var state = new State(href);                                                                            // 211
    // store the fact that this is the first route we hit.                                                  // 212
    // this serves two purposes                                                                             // 213
    //   1. We can tell when we've reached an unhandled route and need to show a                            // 214
    //      404 (rather than bailing out to let the server handle it)                                       // 215
    //   2. Users can look at the state to tell if the history.back() will stay                             // 216
    //      inside the app (this is important for mobile apps).                                             // 217
    history.replaceState({initial: true}, null, href);                                                      // 218
    set(state);                                                                                             // 219
  }                                                                                                         // 220
                                                                                                            // 221
  // bind the event handlers                                                                                // 222
  $(window).on('popstate.iron-location', setStateFromEventHandler);                                         // 223
  $(window).on('hashchange.iron-location', setStateFromEventHandler);                                       // 224
                                                                                                            // 225
  // make sure we have a document before binding the click handler                                          // 226
  Meteor.startup(function () {                                                                              // 227
    $(document).on('click.iron-location', Location.options.linkSelector, fireOnClick);                      // 228
  });                                                                                                       // 229
                                                                                                            // 230
  this._isStarted = true;                                                                                   // 231
};                                                                                                          // 232
                                                                                                            // 233
/**                                                                                                         // 234
 * Stop the Location from listening for url changes.                                                        // 235
 */                                                                                                         // 236
Location.stop = function () {                                                                               // 237
  if (!this._isStarted)                                                                                     // 238
    return;                                                                                                 // 239
                                                                                                            // 240
  $(window).on('popstate.iron-location');                                                                   // 241
  $(window).on('hashchange.iron-location');                                                                 // 242
  $(document).off('click.iron-location');                                                                   // 243
                                                                                                            // 244
  this._isStarted = false;                                                                                  // 245
};                                                                                                          // 246
                                                                                                            // 247
/**                                                                                                         // 248
 * Assign a different click handler.                                                                        // 249
 */                                                                                                         // 250
Location.onClick = function (fn) {                                                                          // 251
  onClickHandler = fn;                                                                                      // 252
};                                                                                                          // 253
                                                                                                            // 254
/**                                                                                                         // 255
 * Go to a new url.                                                                                         // 256
 */                                                                                                         // 257
Location.go = function (url, options) {                                                                     // 258
  return go(url, options);                                                                                  // 259
};                                                                                                          // 260
                                                                                                            // 261
/**                                                                                                         // 262
 * Run the supplied callback whenever we "go" to a new location.                                            // 263
 *                                                                                                          // 264
 * Argument: cb - function, called with no arguments,                                                       // 265
 * `this` is the state that's being set, _may_ be modified.                                                 // 266
 */                                                                                                         // 267
Location.onGo = function (cb) {                                                                             // 268
  handlers.go.push(cb);                                                                                     // 269
};                                                                                                          // 270
                                                                                                            // 271
/**                                                                                                         // 272
 * Run the supplied callback whenever we "popState" to an old location.                                     // 273
 *                                                                                                          // 274
 * Argument: cb - function, called with no arguments,                                                       // 275
 * `this` is the state that's being set, _may_ be modified.                                                 // 276
 */                                                                                                         // 277
Location.onPopState = function (cb) {                                                                       // 278
  handlers.popState.push(cb);                                                                               // 279
};                                                                                                          // 280
                                                                                                            // 281
/**                                                                                                         // 282
 * Automatically start Iron.Location                                                                        // 283
 */                                                                                                         // 284
Location.start();                                                                                           // 285
                                                                                                            // 286
/*****************************************************************************/                             // 287
/* Namespacing */                                                                                           // 288
/*****************************************************************************/                             // 289
Iron.Location = Location;                                                                                   // 290
                                                                                                            // 291
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['iron:location'] = {
  urlToHashStyle: urlToHashStyle,
  urlFromHashStyle: urlFromHashStyle
};

})();
