var ConfigApp = {
	"SAC_TYPE" : "lpu",
	"PATHES": {
		"VIDEO": "/static/video/",
		"SVG": "/static/svg/",
		"MAP": "/static/images/map/",
		"MINI-MAP": "/static/images/mini/"
	},
	"API-HOST": location.origin,
	"FOOTER-NAV": {
		"MAP": {
			"title": "округа"
		},
		"REGIONS": {
			"title": "Регионы"
		},
		"FORMAT": {
			"title": "Форматы"
		},
		"GRAPH": {
			"title": "Графики"
		}, 
		"EVENTS": {
			"title": "События"
		},
		"REPORTS": {
			"title": "Отчеты"
		}
	},
	"REGIONS": {
		"LEFT": {
			"MAP": "/static/images/map/all-regions-left.jpg",
			"VIDEO": {
				"IN": "/static/video/all-regions-left-forward.mp4",
				"OUT": "/static/video/all-regions-left-rewind.mp4"
			},
			"SVG": "/static/svg/all_regions_borders_left.svg"
		},
		"CENTER": {
			"MAP": "/static/images/map/all-regions-center.jpg",
			"SVG": "/static/svg/all_regions_borders_center.svg"
		},
		"RIGHT": {
			"MAP": "/static/images/map/all-regions-right.jpg",
			"VIDEO": {
				"IN": "/static/video/all-regions-right-forward.mp4",
				"OUT": "/static/video/all-regions-right-rewind.mp4"
			},
			"SVG": "/static/svg/all_regions_borders_right.svg"
		}
	},
	"TARGETS": {
		"REGIONS": {
			"38": {
				"x": "-20",
				"y": "15"
			},
			"73": {
				"x": "-45",
				"y": "0"
			},
			"79": {
				"x": "-30",
				"y": "-20"
			},
			"37": {
				"x": "-20",
				"y": "0"
			},
			"70": {
				"x": "-20",
				"y": "20"
			},
			"72": {
				"x": "-20",
				"y": "20"
			},
			"38": {
				"x": "20",
				"y": "0"
			},
			"52": {
				"x": "0",
				"y": "20"
			},
			"55": {
				"x": "10",
				"y": "10"
			},
			"35": {
				"x": "-10",
				"y": "10"
			},
			"59": {
				"x": "-10",
				"y": "10"
			},
			"34": {
				"x": "0",
				"y": "10"
			},
			"13": {
				"x": "0",
				"y": "-5"
			},
			"79": {
				"x": "0",
				"y": "10"
			},
			"59": {
				"x": "10",
				"y": "0"
			}
		},
		"DISTRICT": {
			"52": {
				"x": "30",
				"y": "-40"
			},
			"77": {
				"x": "-20",
				"y": "20"
			},
			"76": {
				"x": "-20",
				"y": "10"
			},
			"102": {
				"x": "-60",
				"y": "10"
			},
			"101": {
				"x": "-70",
				"y": "-30"
			},
			"103": {
				"x": "30",
				"y": "0"
			},
			"104": {
				"x": "-15",
				"y": "0"
			},
			"108": {
				"x": "-15",
				"y": "-50"
			},
			"70": {
				"x": "-15",
				"y": "0"
			},
			"68": {
				"x": "-5",
				"y": "-45"
			},
			"76": {
				"x": "0",
				"y": "-35"
			},
			"40": {
				"x": "10",
				"y": "0"
			},
			"61": {
				"x": "10",
				"y": "-10"
			},
			"25": {
				"x": "0",
				"y": "-50"
			},
			"8": {
				"x": "15",
				"y": "0"
			},
			"6": {
				"x": "0",
				"y": "-50"
			},
			"15": {
				"x": "-10",
				"y": "-40"
			},
			"7": {
				"x": "0",
				"y": "-50"
			},
			"9": {
				"x": "0",
				"y": "-50"
			},
			"58": {
				"x": "-180",
				"y": "-30"
			},
			"45": {
				"x": "30",
				"y": "-10"
			},
			"12": {
				"x": "20",
				"y": "5"
			},
			"54": {
				"x": "-20",
				"y": "0"
			},
			"21": {
				"x": "-40",
				"y": "0"
			},
			"74": {
				"x": "-60",
				"y": "0"
			},
			"13": {
				"x": "-70",
				"y": "0"
			},
			"60": {
				"x": "-60",
				"y": "0"
			},
			"64": {
				"x": "-20",
				"y": "30"
			},
			"47": {
				"x": "0",
				"y": "20"
			},
			"75": {
				"x": "0",
				"y": "-20"
			},
			"73": {
				"x": "-50",
				"y": "0"
			},
			"4": {
				"x": "70",
				"y": "0"
			},
			"17": {
				"x": "0",
				"y": "40"
			},
			"19": {
				"x": "0",
				"y": "20"
			},
			"44": {
				"x": "20",
				"y": "-40"
			},
			"24": {
				"x": "-40",
				"y": "0"
			},
			"30": {
				"x": "80",
				"y": "-40"
			},
			"66": {
				"x": "-20",
				"y": "0"
			},
			"79": {
				"x": "-30",
				"y": "-10"
			},
			"42": {
				"x": "-30",
				"y": "0"
			}
		}
	}
}

/**
 * [ConfigManager description]
 * @param {[type]} app    [description]
 * @param {[type]} config [description]
 */
var ConfigManager = function(app, config) {
	this.app = app;
	this.config = config;

	this.getMapById = function(id_region) {
		return this.app.getResByPath(this.config["PATHES"]["MAP"]+id_region+".jpg");
	}

	this.getMiniMapById = function(id_region) {
		return this.config["PATHES"]["MINI-MAP"]+id_region+".gif";
	}

	this.getSvgById = function(id_region) {
		return this.config["PATHES"]["SVG"]+id_region+".svg";
	}

	this.getInVideoById = function(id_region) {
		var res = this.app.getResByPath(this.config["PATHES"]["VIDEO"]+id_region+"-in.mp4");
		if(res) {
			return res;
		} else {
			return null;
		}
	}

	this.getOutVideoById = function(id_region) {
		return this.app.getResByPath(this.config["PATHES"]["VIDEO"]+id_region+"-out.mp4");
	}
}
