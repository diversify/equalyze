(function(){
Template.body.addContent((function() {
  var view = this;
  return "";
}));
Meteor.startup(Template.body.renderToDocument);

Template.__checkName("login");
Template["login"] = new Template("Template.login", (function() {
  var view = this;
  return HTML.Raw('<h1>Log in with Spotify</h1>\n\n  <button id="login">Log in</button>');
}));

Template.__checkName("analyze");
Template["analyze"] = new Template("Template.analyze", (function() {
  var view = this;
  return HTML.Raw('<h1>Analyze</h1>\n  <input type="button" class="analyze-button" value="Run my analyze">');
}));

})();
