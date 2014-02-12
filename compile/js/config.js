var ConfigApp = {
	"PATHES": {
		"VIDEO": "/static/video/",
		"SVG": "/static/svg/",
		"MAP": "/static/images/map/",
		"MINI-MAP": "/static/images/mini/"
	},
	"API-HOST": "http://192.168.1.110:3000",
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
	},
	"PRELOAD": [
	  "/static/images/map/all-regions-center.jpg",
	  "/static/images/map/all-regions-left.jpg",
	  "/static/images/map/all-regions-right.jpg"/*
	  "/static/svg/100.svg",
	  "/static/svg/101.svg",
	  "/static/svg/102.svg",
	  "/static/svg/103.svg",
	  "/static/svg/104.svg",
	  "/static/svg/105.svg",
	  "/static/svg/106.svg",
	  "/static/svg/107.svg",
	  "/static/svg/108.svg",
	  "/static/svg/1.svg",
	  "/static/svg/2.svg",
	  "/static/svg/3.svg",
	  "/static/svg/4.svg",
	  "/static/svg/5.svg",
	  "/static/svg/6.svg",
	  "/static/svg/7.svg",
	  "/static/svg/8.svg",
	  "/static/svg/9.svg",
	  "/static/svg/10.svg",
	  "/static/svg/11.svg",
	  "/static/svg/12.svg",
	  "/static/svg/13.svg",
	  "/static/svg/14.svg",
	  "/static/svg/15.svg",
	  "/static/svg/16.svg",
	  "/static/svg/17.svg",
	  "/static/svg/18.svg",
	  "/static/svg/19.svg",
	  "/static/svg/20.svg",
	  "/static/svg/21.svg",
	  "/static/svg/22.svg",
	  "/static/svg/23.svg",
	  "/static/svg/24.svg",
	  "/static/svg/25.svg",
	  "/static/svg/26.svg",
	  "/static/svg/27.svg",
	  "/static/svg/28.svg",
	  "/static/svg/29.svg",
	  "/static/svg/30.svg",
	  "/static/svg/31.svg",
	  "/static/svg/32.svg",
	  "/static/svg/33.svg",
	  "/static/svg/34.svg",
	  "/static/svg/35.svg",
	  "/static/svg/36.svg",
	  "/static/svg/37.svg",
	  "/static/svg/38.svg",
	  "/static/svg/39.svg",
	  "/static/svg/40.svg",
	  "/static/svg/41.svg",
	  "/static/svg/42.svg",
	  "/static/svg/43.svg",
	  "/static/svg/44.svg",
	  "/static/svg/45.svg",
	  "/static/svg/46.svg",
	  "/static/svg/47.svg",
	  "/static/svg/48.svg",
	  "/static/svg/49.svg",
	  "/static/svg/50.svg",
	  "/static/svg/51.svg",
	  "/static/svg/52.svg",
	  "/static/svg/53.svg",
	  "/static/svg/54.svg",
	  "/static/svg/55.svg",
	  "/static/svg/56.svg",
	  "/static/svg/57.svg",
	  "/static/svg/58.svg",
	  "/static/svg/59.svg",
	  "/static/svg/60.svg",
	  "/static/svg/61.svg",
	  "/static/svg/62.svg",
	  "/static/svg/63.svg",
	  "/static/svg/64.svg",
	  "/static/svg/65.svg",
	  "/static/svg/66.svg",
	  "/static/svg/67.svg",
	  "/static/svg/68.svg",
	  "/static/svg/69.svg",
	  "/static/svg/70.svg",
	  "/static/svg/71.svg",
	  "/static/svg/72.svg",
	  "/static/svg/73.svg",
	  "/static/svg/74.svg",
	  "/static/svg/75.svg",
	  "/static/svg/76.svg",
	  "/static/svg/77.svg",
	  "/static/svg/78.svg",
	  "/static/svg/79.svg",
	  "/static/svg/80.svg",
	  "/static/svg/81.svg",
	  "/static/svg/82.svg",
	  "/static/svg/83.svg",
	  "/static/svg/all_regions_borders_center.svg",
	  "/static/svg/all_regions_borders_left.svg",
	  "/static/svg/all_regions_borders_right.svg",
	  "/static/images/mini/101.gif",
	  "/static/images/mini/102.gif",
	  "/static/images/mini/103.gif",
	  "/static/images/mini/104.gif",
	  "/static/images/mini/105.gif",
	  "/static/images/mini/106.gif",
	  "/static/images/mini/107.gif",
	  "/static/images/mini/108.gif",
	  "/static/images/mini/1.gif",
	  "/static/images/mini/2.gif",
	  "/static/images/mini/3.gif",
	  "/static/images/mini/4.gif",
	  "/static/images/mini/5.gif",
	  "/static/images/mini/6.gif",
	  "/static/images/mini/7.gif",
	  "/static/images/mini/8.gif",
	  "/static/images/mini/9.gif",
	  "/static/images/mini/10.gif",
	  "/static/images/mini/11.gif",
	  "/static/images/mini/12.gif",
	  "/static/images/mini/13.gif",
	  "/static/images/mini/14.gif",
	  "/static/images/mini/15.gif",
	  "/static/images/mini/16.gif",
	  "/static/images/mini/17.gif",
	  "/static/images/mini/18.gif",
	  "/static/images/mini/19.gif",
	  "/static/images/mini/20.gif",
	  "/static/images/mini/21.gif",
	  "/static/images/mini/22.gif",
	  "/static/images/mini/23.gif",
	  "/static/images/mini/24.gif",
	  "/static/images/mini/25.gif",
	  "/static/images/mini/26.gif",
	  "/static/images/mini/27.gif",
	  "/static/images/mini/28.gif",
	  "/static/images/mini/29.gif",
	  "/static/images/mini/30.gif",
	  "/static/images/mini/31.gif",
	  "/static/images/mini/32.gif",
	  "/static/images/mini/33.gif",
	  "/static/images/mini/34.gif",
	  "/static/images/mini/35.gif",
	  "/static/images/mini/36.gif",
	  "/static/images/mini/37.gif",
	  "/static/images/mini/38.gif",
	  "/static/images/mini/39.gif",
	  "/static/images/mini/40.gif",
	  "/static/images/mini/41.gif",
	  "/static/images/mini/42.gif",
	  "/static/images/mini/43.gif",
	  "/static/images/mini/44.gif",
	  "/static/images/mini/45.gif",
	  "/static/images/mini/46.gif",
	  "/static/images/mini/47.gif",
	  "/static/images/mini/48.gif",
	  "/static/images/mini/49.gif",
	  "/static/images/mini/50.gif",
	  "/static/images/mini/51.gif",
	  "/static/images/mini/52.gif",
	  "/static/images/mini/53.gif",
	  "/static/images/mini/54.gif",
	  "/static/images/mini/55.gif",
	  "/static/images/mini/56.gif",
	  "/static/images/mini/57.gif",
	  "/static/images/mini/58.gif",
	  "/static/images/mini/59.gif",
	  "/static/images/mini/60.gif",
	  "/static/images/mini/61.gif",
	  "/static/images/mini/62.gif",
	  "/static/images/mini/63.gif",
	  "/static/images/mini/64.gif",
	  "/static/images/mini/65.gif",
	  "/static/images/mini/66.gif",
	  "/static/images/mini/67.gif",
	  "/static/images/mini/68.gif",
	  "/static/images/mini/69.gif",
	  "/static/images/mini/70.gif",
	  "/static/images/mini/71.gif",
	  "/static/images/mini/72.gif",
	  "/static/images/mini/73.gif",
	  "/static/images/mini/74.gif",
	  "/static/images/mini/75.gif",
	  "/static/images/mini/76.gif",
	  "/static/images/mini/77.gif",
	  "/static/images/mini/78.gif",
	  "/static/images/mini/79.gif",
	  "/static/images/mini/80.gif",
	  "/static/images/mini/81.gif",
	  "/static/images/mini/82.gif",
	  "/static/images/mini/83.gif"
	  */
	]
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
