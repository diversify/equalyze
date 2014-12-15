var keys = [
{'key':'e6168997c0e6b8db78bef46b04a9b794','timesUsed': 0},
{'key':'b58f7aa1ad32141515c8dd31346e3b76','timesUsed': 0},
{'key':'741205ecb0823a1390be71647597f3b7','timesUsed': 0},
{'key':'e76e40e050aebcf87690d56755712991','timesUsed': 0},
{'key':'cd52c976afc458005bcf5bcb60e54c30','timesUsed': 0},
{'key':'93aa1f8663d1e5ec5b067c728b584d0a','timesUsed': 0},
{'key':'a26cd9cdd9085799199c3a586fb06276','timesUsed': 0},
{'key':'d58a51ba8280113230c46986d1da8d4a','timesUsed': 0},
{'key':'f7f7203c47db40973efddfbeebc4a651','timesUsed': 0},
{'key':'abd33d75ad18caf6d8d317458b0565f1','timesUsed': 0},
{'key':'2c594aa7744220b8bfccf677e6307a23','timesUsed': 0},
{'key':'1a147a719def87de6d6088ce51e02af3','timesUsed': 0},
{'key':'e4db82baf00dd8a451a108040a169da8','timesUsed': 0},
{'key':'5825163293b4a6ac3aea0d09c20fba02','timesUsed': 0},
{'key':'116621386bc6d5ddfcecc7bd682b79f2','timesUsed': 0},
{'key':'f8cbcc8a9c59148f29e938e2088b45be','timesUsed': 0},
{'key':'37995c655f66dce1d497790ca21eb94f','timesUsed': 0},
{'key':'70326fc328cc6e4aaf7fa3e30b7f429b','timesUsed': 0},
{'key':'2b77a7a1bdb5cb855c88cc32c495a20c','timesUsed': 0},
{'key':'c36fa822413535d495d479a8bdf65c67','timesUsed': 0},
{'key':'0999c920a5a0c3bdf671581e2819e0b1','timesUsed': 0}
]

Meteor.methods({
	getArtistData: function (artistList) {
		var savedArtists = Artists.find().fetch();
		this.unblock();
		var artistData = [];
		if(artistList.length > (keys*45)/2) {
			console.log("Too long")
			return -1;
		}
		
		var i, j, chunk = 45;
		var tempArray = [];
		for (i = 0, j= artistList.length; i<j; i+=chunk) {
			tempArray.push(artistList.slice(i, i+chunk));
		};

		var index = 0;
		tempArray.forEach(function(artistArray) {
			keys[index].timesUsed++;
			artistArray.forEach(function(artist) {
				var result = _.find(savedArtists, function(e) { if(e.name == artist.artistName) { return e } })
				if(!result) {
					var artistResult = Meteor.http.call('GET', 'http://api.musicgraph.com/api/v2/artist/search?api_key='+keys[index].key+'&name='+artist.artistName.split(' ').join('+'))
					var gender = "";
					if (artistResult.data.data.length > 0) {
						gender = artistResult.data.data[0].gender
					} else {
						gender = "Not specified"
					}
					artistData.push(gender);
					Artists.insert({"name":artist.artistName, "gender": gender});
				} else {
					artistData.push(result.gender);
				} 
			})
			index++;
		})		
		// Sort the key-array after how many times a key has been used.
		keys.sort(function(a,b) {
			var keyA = a.timesUsed;
			var keyB = b.timesUsed;

			if(keyA < keyB) return -1;
			if(keyA > keyB) return 1;
			return 0;
		});
		console.log(artistData)
		return artistData;
	},

	getGenderArtistList: function(artistList, gender) {
		var savedRelatedArtists = RelatedArtists.find().fetch();
		this.unblock();
		artistList = _.uniq(artistList);
		var relatedArtistData = [];
		if(artistList.length > (keys*45)/2) {
			console.log("Too long")
			return -1;
		}
		
		var i, j, chunk = 45;
		var tempArray = [];
		for (i = 0, j= artistList.length; i<j; i+=chunk) {
			tempArray.push(artistList.slice(i, i+chunk));
		};

		var index = 0;
		tempArray.forEach(function(artistArray) {
			keys[index].timesUsed++;
			artistArray.forEach(function(artist) {
				console.log("Artist", artist)
				var result = _.find(savedRelatedArtists, function(e) { if(e.artistName == artist.artistName && e.relatedGender == gender) { return e } })
				console.log("Result", result)
				if(!result) {
					console.log("No saved related artist")
					var artistResult = Meteor.http.call('GET', 'http://api.musicgraph.com/api/v2/artist/search?api_key='+keys[0].key+'&similar_to='+artist.artistName.split(' ').join('+')+'&gender='+gender+'&limit=1')
					if (artistResult.data.data.length > 0) {
						resultRelated = artistResult.data.data[0];
						
						relatedArtistData.push(resultRelated);
						RelatedArtists.insert({"artistName": artist.artistName, "relatedArtist": resultRelated.name, "relatedGender": gender})
					}
				} else {
					console.log("Saved related artist")
					relatedArtistData.push(result);
				}
				
			})
			index++;
		})
		// Sort the key-array after how many times a key has been used.
		keys.sort(function(a,b) {
			var keyA = a.timesUsed;
			var keyB = b.timesUsed;

			if(keyA < keyB) return -1;
			if(keyA > keyB) return 1;
			return 0;
		});
		return relatedArtistData;
	}
})


//
