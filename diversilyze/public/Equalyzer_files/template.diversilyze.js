(function(){
Template.body.addContent((function() {
  var view = this;
  return [ HTML.Raw('<!-- {{>home}} -->\n<div class="landing-container">\n\n 	<div class="col-xs-11 col-md-6 landing-content-container col-centered">\n 		<div class="logo-container animated ">\n 			<img src="/Logo.png" alt="">\n\n 		</div>\n 		<p class="analyze-desc">\n 			How gender equal are your playlist? Analyze your playlists now!\n 		</p>\n 		<div class="analyze-button animated flipInX">let\'s analyze</div>\n 	</div>\n 	<div class="bottom-container-fix">\n	<div class="album-cover-container">\n		<div class="album-cover-large" id="album-1">\n		</div><div class="album-cover-small" id="album-1">\n	  	</div><div class="album-cover-large" id="album-2">\n	  	</div><div class="album-cover-small" id="album-3">\n	  	</div><div class="album-cover-large" id="album-4">\n		</div><div class="album-cover-small" id="album-5">\n		</div><div class="album-cover-large" id="album-6">\n		</div><div class="album-cover-small" id="album-7">\n		</div><div class="album-cover-large" id="album-8">\n		</div><div class="album-cover-small" id="album-9">\n		</div><div class="album-cover-large" id="album-10">\n		</div><div class="album-cover-small" id="album-11">\n		</div>\n	</div>\n	</div>\n </div>\n\n\n\n\n '), HTML.DIV({
    "class": "results-container"
  }, "\n\n 	", HTML.DIV({
    "class": "result-profile col-xs-9 col-centered"
  }, "\n		", HTML.Raw('<div class="result-chart">\n			<div id="canvas-holder">\n				<canvas id="chart-area" width="220" height="220">\n\n				</canvas>\n			</div>\n		</div>'), "\n\n		", HTML.SCRIPT('\n			var pieData = [\n					{\n					value: 75,\n					segmentShowStroke : false,\n					segmentStrokeWidth : 0,\n					color:"#F2345A",\n					animationEasing : "easeOutBounce",\n					label: "Men"\n				},\n				{\n					value: 25,\n					segmentShowStroke : false,\n					highlight: "#5AD3D1",\n					label: "Women"\n				}\n			];\n			window.onload = function(){\n				var ctx = document.getElementById("chart-area").getContext("2d");\n				window.myPie = new Chart(ctx).Pie(pieData);\n			};\n		'), "\n\n\n 	", HTML.Raw('<h2 class="result-msg-title">Oh no!</h2>'), "\n 	", HTML.Raw('<p class="result-msg">Your playlists are not very gender equal. Checkout these female artists to diversify your music</p>'), "\n\n	\n 	"), "\n\n 	", HTML.Raw('<div class="album-recommendation col-xs-10 col-centered">\n 			<h4 class="recommend-title">Check these albums out:</h4>\n 			<div class="album-cover-recommend" id="recommend-1"></div>\n 			<div class="album-cover-recommend" id="recommend-2"></div>\n \n 	</div>'), "\n "), "\n  \n	  ", HTML.SCRIPT('\n	        $(document).ready(function (){\n	            $(".analyze-button").click(function (){\n	                    $(\'html, body\').animate({\n	                        scrollTop: $(".results-container").offset().top\n	                    }, 500);\n	            });\n	        });\n	  ') ];
}));
Meteor.startup(Template.body.renderToDocument);

Template.__checkName("home");
Template["home"] = new Template("Template.home", (function() {
  var view = this;
  return [ HTML.Raw('<a href="#" id="login">Login</a>\n  '), Blaze.Each(function() {
    return Spacebars.call(view.lookup("users"));
  }, function() {
    return [ "\n  	", Spacebars.include(view.lookupTemplate("userItem")), "\n  " ];
  }) ];
}));

Template.__checkName("analyze");
Template["analyze"] = new Template("Template.analyze", (function() {
  var view = this;
  return HTML.Raw('<input type="button" class="button" value="Analyze">');
}));

Template.__checkName("userItem");
Template["userItem"] = new Template("Template.userItem", (function() {
  var view = this;
  return HTML.Raw('<li class="song-name"></li>');
}));

})();
