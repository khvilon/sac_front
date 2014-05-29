/**
 * [SVGLoader description]
 * @param {[type]} app [description]
 */
var SVGLoader = function(app, config) {
	this.app = app;
	this.maxOpacity = 0.3;
	this.minOpacity = 0.001;

	if(config && config.onClick) {
		this.onGroupClick = config.onClick;
	}

	this.CSS = {
		"BG": "#bg-svg",
		"SVG": "#svg",
		"IN-SVG-CSS": "#in-svg-css"
	}

	this.elements = {
		"BG": $(this.CSS["BG"]),
		"SVG": $(this.CSS["SVG"]),
		"IN-SVG-CSS": $(this.CSS["IN-SVG-CSS"])
	}

	this.load = function(path) {
		this.elements["BG"].hide();

		var newObject = document.createElement("object");
		newObject.setAttribute("id", "svg");
		newObject.setAttribute("type", "image/svg+xml");
		newObject.setAttribute("data", path);
		newObject.setAttribute("width", "100%");
		newObject.setAttribute("height", "100%");

		this.elements["BG"].html("");
		this.elements["BG"].append(newObject);
		this.elements["SVG"] = $(this.CSS["SVG"]);

		this.prepareSvg_();
	}

	this.hide = function() {
		this.elements["BG"].addClass("onHidden");
	}

	this.show = function() {
		this.elements["BG"].removeClass("onHidden");
	}

	this.prepareSvg_ = function() {
		this.elements["SVG"].on("load", $.proxy(this.onLoadSvg_, this));
		this.elements["BG"].show();
	}

	this.appendCSS_ = function(svg) {
		var styleElement = svg.createElementNS("http://www.w3.org/2000/svg", "style");
		styleElement.textContent = this.elements["IN-SVG-CSS"].html();
		$(svg).find("svg")[0].appendChild(styleElement);
	}

	this.onLoadSvg_ = function() {
		var svg = this.elements["SVG"][0].getSVGDocument();
		var self = this;
		this.appendCSS_(svg);

		$(svg).on("mouseover", function(event) {
			if(event.target.nodeName == "svg" && self.app.parametrsWidgets.currentParametr && self.app.parametrsWidgets.currentParametr.id) {
				self.app.legendParamsManager.getLegendByParamAndSubject(
					self.app.parametrsWidgets.currentParametr.id, 
					self.app.currentRegion,
					self.app.ageSelectorWidget.selectedYear,
					function(data) {
						var newData = {};
						newData["green"] = [0];
						newData["yellow"] = [0];
						newData["red"] = [0];
						newData["blue"] = [0];

						$.each(data, function(value, key){
							if(key == "#7fff7f") {
								newData["green"][0] += 1; 
							}
							if(key == "#ff7f7f") {
								newData["red"][0] += 1; 
							}
							if(key == "#ffff7f") {
								newData["yellow"][0] += 1; 
							}
							if(!key) {
								newData["blue"][0] += 1; 
							}
						});
						self.app.legendWidget.setLevelText(newData);
						self.app.legendWidget.show();
					}
				);
			}
			event.stopPropagation();
		});
		
		$.each($(svg).find("path"), function(key, value) {
			$(value).attr("fill", "#ffffff");
			$(value).attr("fill-opacity", "0");
			$(value).removeAttr("opacity");
			if(self.app.currentZoom != 3) {
				$(value).css("cursor", "pointer");	
			}
		});

		var groups = $(svg).find("g");
		groups.off();

		groups.on("mouseover", function() {
			var paths = $(this).find("path");
			paths.attr({
				"fill-opacity": self.maxOpacity
			});

			if(self.app.parametrsWidgets.currentParametr && self.app.parametrsWidgets.currentParametr.id) {
				self.app.legendManager.getLegendByParamAndSubject(
					self.app.parametrsWidgets.currentParametr.id, 
					$(this).attr("target"),
					function(data) {
						self.app.legendWidget.setLevelText(data);
						self.app.legendWidget.show();
					}
				);	
			}
		});
		groups.on("mouseout", function() {
			var paths = $(this).stop().find("path");
			paths.attr({
				"fill-opacity": self.minOpacity
			});
		});
			

		if(this.onGroupClick) {
			groups.on("click", this.onGroupClick);	
		}
	}

	this.drawParamValues = function(data, CSSclasses) {
		this.removeParamValues();

		var svg = $(this.CSS["SVG"])[0].getSVGDocument();
		var self = this;

		$.each($(svg).find("g"), function(key, value) {
			var id = $(value).attr("target");
			if(id && data[id] != 0) {
				var newElement = document.createElementNS("http://www.w3.org/2000/svg", "text");
				var path = $(value).find("path")[0];

				var x = parseInt(($(path).offset().left + path.getBoundingClientRect().width/2));
				var y = parseInt(($(path).offset().top + path.getBoundingClientRect().height/2));

				var correctPath = "DISTRICT";

				if(CSSclasses == "regions") {
					correctPath = "REGIONS";
				}
				if(ConfigApp["TARGETS"][correctPath][id]) {
					x = x + parseInt(ConfigApp["TARGETS"][correctPath][id]["x"]);
					y = y + parseInt(ConfigApp["TARGETS"][correctPath][id]["y"]);
				}

				var classes = "zoom"+self.app.currentZoom+" "+CSSclasses;
				var val = decorateValues(data[id], 2);
				$(newElement).html(Number(val));
				$(newElement).attr({
					x: x,
					y: y,
					"fill": "#ffffff",
					"class": classes,
					"fill-opacity": "0"
				});

				$(svg).find("svg")[0].appendChild(newElement);	
			}

			$(svg).find("text").attr({
				"fill-opacity": "1"
			});
		});
	}

	this.removeParamValues = function() {
		var svg = $(this.CSS["SVG"])[0].getSVGDocument();
		$(svg).find("text").remove();
	}

}

/**
 * [ description]
 * @return {[type]} [description]
 */
var VideoPlayer = function() {
	this.CSS = {
		"BG": "bg-video",
		"VIDEO": "video",
		"HEADER": "header",
		"SVG": "#bg-svg"
	}
	this.elements = {
		"BG": document.getElementById(this.CSS["BG"]),
		"VIDEO": document.getElementById(this.CSS["VIDEO"]),
		"HEADER": $(this.CSS["HEADER"]),
		"SVG": $(this.CSS["SVG"])
	}

	this.video = $("#video");
	this.endedCallback = null;

	this.onTimeupdate_ = function(e) {
		if(e.currentTarget.duration - e.currentTarget.currentTime < 0.2) {
			e.currentTarget.pause();
			console.log(this.endedCallback);
			if(this.endedCallback) {
				this.endedCallback();	
			}
		}
	}

	this.video.on('timeupdate', $.proxy(this.onTimeupdate_, this));

	this.play = function(videoPath, config) {
		this.video.attr("src", videoPath);

		if(config && config.poster) {
			this.video.attr("poster", config.poster);	
		}
		
		if(config && config.onEndedCallback) {
			this.endedCallback = config.onEndedCallback;
		}
		
		this.video[0].load();
		this.video[0].play();
		$(this.elements["BG"]).show();
	}

	this.hide = function() {
		$(this.elements["BG"]).fadeOut();
	}
}

/**
 * [MiniMapWriter Работает с отображением и логикой мини карты слева]
 */
var MiniMapWriter = function() {
	this.CSS = {
		"CONTAINER": "#miniMap",
		"TEXT": " a"
	}
	this.elements = {
		"CONTAINER": $(this.CSS["CONTAINER"]),
		"TEXT": $(this.CSS["CONTAINER"]+this.CSS["TEXT"])
	}

	this.show = function(imagePath, callback) {
		this.elements["CONTAINER"].addClass("onShow");
		this.elements["TEXT"].css("backgroundImage", "url('"+imagePath+"')");
		this.elements["CONTAINER"].off("click");
		this.elements["CONTAINER"].on("click", callback);
	}

	this.hiden = function() {
		this.elements["CONTAINER"].removeClass("onShow");
		this.elements["TEXT"].css("backgroundImage", "none");
		this.elements["CONTAINER"].off("click");
	}

	this.opacityHidden = function() {
		this.elements["CONTAINER"].removeClass("onShow");
	}

	this.opacityShow = function() {
		this.elements["CONTAINER"].addClass("onShow");
	}

	this.setText = function(text) {
		this.elements["TEXT"].html(text);
	}
}

/**
 * [LoadingState description]
 * @param {[type]} app [description]
 */
var LoadingState = function(app) {
	this.app = app;
	this.stateCSS = {
		"BG-IMAGE": "#bg-image",
		"NAV-ELEMENTS": ".nav-elements",
		"LOADER": "#load",
		"LOAD-IMAGE": "#load-image",
		"LOADING-TEXT": "#loading"
	}
	this.animateSpeed = 2000;

	this.elements = {
		"BG-IMAGE": $(this.stateCSS["BG-IMAGE"]),
		"NAV-ELEMENTS": $(this.stateCSS["NAV-ELEMENTS"]),
		"LOADER": $(this.stateCSS["LOADER"]),
		"LOAD-IMAGE": $(this.stateCSS["LOAD-IMAGE"]),
		"LOADING-TEXT": $(this.stateCSS["LOADING-TEXT"])
	}

	this.run = function() {
		this.elements["BG-IMAGE"].addClass("blur");
		this.elements["BG-IMAGE"].css("backgroundImage", "url('/static/images/map/100.png')");
		this.elements["LOADER"].addClass("onShow");
	}

	this.stop = function(callback) {
		this.elements["BG-IMAGE"].removeClass("blur");
		this.elements["NAV-ELEMENTS"].addClass("onShow");
		this.elements["LOADER"].removeClass("onShow");

		if(callback) {
			callback();	
		}
	}

	this.updateText = function(currentFile, allFile) {
		this.elements["LOADING-TEXT"].html("");
		this.elements["LOADING-TEXT"].html('Загружено: '+parseInt(currentFile)+' из '+ allFile +' </p>');
	}

	this.clearText = function() {
		this.elements["LOADING-TEXT"].html("");
	}
}

/**
 * [ description]
 * @param  {[type]} app [description]
 * @return {[type]}     [description]
 */
var DistrictsPanel = function(app) {
	this.app = app;

	this.show = function() {
		$("#legend-widget").show();
		$("#bg-colored-image").show();

		this.app.mapStateManager.removeBlur();
		if(this.app.currentZoom != 1) {
			this.app.mapStateManager.miniMapWriter.opacityShow();	
		}
		
		this.app.mapStateManager.SVGWriter.show();
		this.app.mapStateManager.SVGWriter.load(this.app.configManager.getSvgById(this.app.currentRegion));
		this.app.parametrsWidgets.fullShow();
		this.app.mapColorWidget.updateParams();
		this.app.mapColorel.show();
		this.app.pageTitleWidget.show();

		if(this.app.parametrsWidgets.currentParametr && this.app.parametrsWidgets.currentParametr.id) {
			this.app.legendWidget.show();
		}

		this.app.setAppTitle(this.app.mapStateManager.currentRegionData.name);
	}

	this.hidden = function() {
		this.app.mapStateManager.addBlur();
		this.app.mapStateManager.miniMapWriter.opacityHidden();
		this.app.mapStateManager.SVGWriter.hide();

		this.app.parametrsWidgets.fullHidden();
		this.app.legendWidget.hide();
		this.app.paramsSelectorWidget.hidden();
		this.app.mapColorel.hidden();

		$("#bg-colored-image").hide();
	}

	this.hiddenWidgets = function() {
		//this.app.mapStateManager.addBlur();
		//this.app.mapStateManager.miniMapWriter.opacityHidden();
		//this.app.mapStateManager.SVGWriter.hide();

		this.app.parametrsWidgets.fullHidden();
		this.app.legendWidget.hide();
		this.app.paramsSelectorWidget.hidden();
		this.app.mapColorel.hidden();
	}
}

/**
 * [ description]
 * @param  {[type]} app [description]
 * @return {[type]}     [description]
 */
var FormatPanel = function(app) {
	this.app = app;

	this.show = function() {
		this.app.formatWidget.show();
		this.app.regionsSelectorWidget.show();
		this.app.paramsSelectorWidget.show();

		this.app.setAppTitle("Форматы");
	}

	this.hidden = function() {
		this.app.formatWidget.hidden();
		this.app.regionsSelectorWidget.hidden();
		this.app.paramsSelectorWidget.hidden();
	}
}

/**
 * [ description]
 * @param  {[type]} app [description]
 * @return {[type]}     [description]
 */
var GraphPanel = function(app) {
	this.app = app;

	this.show = function() {
		this.app.graphParamsSelector.show();
		this.app.graphRegionsSelectorWidget.show();
		this.app.graphWidget.show();

		this.app.setAppTitle("Графики");
	}

	this.hidden = function() {
		this.app.graphParamsSelector.hidden();
		this.app.graphRegionsSelectorWidget.hidden();
		this.app.graphWidget.hidden();
	}
}

var ReportsPanel = function(app) {
	this.app = app;

	this.show = function() {
		console.log("gf");
		this.app.reportsParamsSelector.show();
		this.app.reportsDiscSelector.show();

		this.app.setAppTitle("Отчеты");
		//this.app.graphRegionsSelectorWidget.show();
		//this.app.graphWidget.show();
	}

	this.hidden = function() {
		this.app.reportsParamsSelector.hidden();
		this.app.reportsDiscSelector.hidden();
		this.app.reportsWidget.hidden();
		//this.app.graphRegionsSelectorWidget.hidden();
		//this.app.graphWidget.hidden();
	}
}

/**
 * [ description]
 * @param  {[type]} app [description]
 * @return {[type]}     [description]
 */
var RegionPanel = function(app) {
	this.app = app;
	this.bgImage = null;
	this.CSS = {
		"BG-IMAGE": "#bg-regions-image",
		"CAMERA-LEFT": "#regions-left-camera",
		"CAMERA-RIGHT": "#regions-right-camera"
	}
	this.currentCamera = "CENTER";

	this.elements = {
		"BG-IMAGE": $(this.CSS["BG-IMAGE"]),
		"CAMERA-LEFT": $(this.CSS["CAMERA-LEFT"]),
		"CAMERA-RIGHT": $(this.CSS["CAMERA-RIGHT"])
	}

	this.svgWriter = new SVGLoader(this);

	this.getBgCurrentCamera = function() {
		return this.app.getResByPath(ConfigApp["REGIONS"][this.currentCamera]["MAP"]) ;
	}

	this.getSVGCurrentCamera = function() {
		return ConfigApp["REGIONS"][this.currentCamera]["SVG"];
	}

	this.getVideoName = function(start, end) {
		if(start == "LEFT" && end == "CENTER") {
			return ConfigApp["REGIONS"]["LEFT"]["VIDEO"]["OUT"];
		}
		if(start == "CENTER" && end == "RIGHT") {
			return ConfigApp["REGIONS"]["RIGHT"]["VIDEO"]["IN"];
		}
		if(start == "RIGHT" && end == "CENTER") {
			return ConfigApp["REGIONS"]["RIGHT"]["VIDEO"]["OUT"];
		}
		if(start == "CENTER" && end == "LEFT") {
			return ConfigApp["REGIONS"]["LEFT"]["VIDEO"]["IN"];
		}
	}

	this.setBg = function(bg) {
		if(bg) {
			this.bgImage = bg;	
		}
		if(this.bgImage) {
			this.elements["BG-IMAGE"].css("backgroundImage", "url('"+this.bgImage+"')");
		} else {
			this.elements["BG-IMAGE"].css("backgroundImage", "url('"+this.getBgCurrentCamera()+"')");
		}
	}

	this.show = function() {
		this.elements["BG-IMAGE"].addClass("onShow");

		if(this.currentCamera != "LEFT") {
			this.elements["CAMERA-LEFT"].addClass("onShow");
		}
		if(this.currentCamera != "RIGHT") {
			this.elements["CAMERA-RIGHT"].addClass("onShow");
		}
		this.svgWriter.show();
		this.svgWriter.load(this.getSVGCurrentCamera());
		this.setBg();

		this.app.regionsParametrsWidgets.fullShow();
		this.app.regionsMapColorWidget.updateParams();

		this.app.regionsLegendWidget.show();

		this.app.setAppTitle("Россия");
	}

	this.hidden = function() {
		this.elements["BG-IMAGE"].removeClass("onShow");
		this.elements["CAMERA-LEFT"].removeClass("onShow");
		this.elements["CAMERA-RIGHT"].removeClass("onShow");

		this.app.regionsParametrsWidgets.fullHidden();
		this.app.regionsSelectorWidget.hidden();

		this.app.regionsLegendWidget.hide();
	}

	this.addBlur = function() {
		this.elements["BG-IMAGE"].addClass("blur");
	}

	this.removeBlur = function() {
		this.elements["BG-IMAGE"].removeClass("blur");
	}



	this.onCameraLeftClick_ = function() {
		var startState = "";
		var endState = "";

		if(this.currentCamera == "CENTER") {
			this.currentCamera = "LEFT";
			this.elements["CAMERA-LEFT"].removeClass("onShow");

			startState = "CENTER";
			endState = "LEFT";
		}
		if(this.currentCamera == "RIGHT") {
			this.currentCamera = "CENTER";
			this.elements["CAMERA-RIGHT"].addClass("onShow");

			startState = "RIGHT";
			endState = "CENTER";
		}
		if(!this.app.mobile) {
			this.app.videoPlayer.play(
				this.app.getResByPath(this.getVideoName(startState, endState)) ,
				{
					onEndedCallback: $.proxy(this.onVideoPlayEnd_, this),
					poster: this.bgImage	
				}
			);	
		} else {
			this.onVideoPlayEnd_();
		}
	}

	this.onVideoPlayEnd_ = function() {
		var self = this;

		this.setBg(this.getBgCurrentCamera());
		this.svgWriter.load(this.getSVGCurrentCamera());

		if(this.app.regionsParametrsWidgets.currentParametr) {
			this.app.regionsMapColorel.colored(
				this.app.regionsParametrsWidgets.currentParametr.id, 
				this.app.ageSelectorRegionsWidget.selectedYear
			);	
		}
		this.app.regionsMapColorWidget.updateParams();
		setTimeout(function() {
			self.app.videoPlayer.hide();
		}, 0);
		
	}

	this.onCameraRightClick_ = function() {
		var startState = "";
		var endState = "";

		if(this.currentCamera == "CENTER") {
			this.currentCamera = "RIGHT";
			this.elements["CAMERA-RIGHT"].removeClass("onShow");

			startState = "CENTER";
			endState = "RIGHT";
		}
		if(this.currentCamera == "LEFT") {
			this.currentCamera = "CENTER";
			this.elements["CAMERA-LEFT"].addClass("onShow");

			startState = "LEFT";
			endState = "CENTER";
		}

		if(!this.app.mobile) {
			this.app.videoPlayer.play(
				this.app.getResByPath(this.getVideoName(startState, endState)) ,
				{
					onEndedCallback: $.proxy(this.onVideoPlayEnd_, this),
					poster: this.bgImage	
				}
			)
		} else {
			this.onVideoPlayEnd_();
		}
	}

	this.bindEvents_ = function() {
		this.elements["CAMERA-LEFT"].on("click", $.proxy(this.onCameraLeftClick_, this));
		this.elements["CAMERA-RIGHT"].on("click", $.proxy(this.onCameraRightClick_, this));
	}

	this.app.regionsParametrsWidgets.getRegionsParams();
	this.bindEvents_();
}

var MapEventsPanel = function(app) {
	this.app = app;

	this.OnEvensMapChangeState = new signals.Signal();
	this.OnEvensMapChangeState.add(OnEvensMapChangeState);

	this.eventsFactory = new EventsFactory(this.app);

	this.CSS = {
		"CONTAINER": "#bg-event-image"
	}

	this.elements = {
		"CONTAINER": $(this.CSS["CONTAINER"])
	}

	this.getCountCallback_ = function(data) {
		this.app.mapStateManager.SVGWriter.removeParamValues();

		var svg = $(this.app.mapStateManager.SVGWriter.CSS["SVG"])[0].getSVGDocument();
		var self = this;
		console.log(svg);
		$.each($(svg).find("g"), function(key, value) {
			var id = $(value).attr("target");

			if(id && data[id] != 0) {
				var newElement = document.createElementNS("http://www.w3.org/2000/svg", "text");
				var path = $(value).find("path")[0];

				var x = parseInt(($(path).offset().left + path.getBoundingClientRect().width/2));
				var y = parseInt(($(path).offset().top + path.getBoundingClientRect().height/2));

				var correctPath = "DISTRICT";

				if(ConfigApp["TARGETS"][correctPath][id]) {
					x = x + parseInt(ConfigApp["TARGETS"][correctPath][id]["x"]);
					y = y + parseInt(ConfigApp["TARGETS"][correctPath][id]["y"]);
				}

				var classes = "zoom"+self.app.currentZoom+" ";
				var val = data[id];
				$(newElement).html(Number(val));
				$(newElement).attr({
					x: x,
					y: y,
					"fill": "#ffffff",
					"class": classes,
					"fill-opacity": "0"
				});

				$(svg).find("svg")[0].appendChild(newElement);	
			}

			$(svg).find("text").attr({
				"fill-opacity": "1"
			});
		});
	}

	this.drawNumbers = function() {
		$.get(this.app.apiHost + "/events/get_event_count_list/by_subject_id/"+this.app.currentRegion, $.proxy(this.getCountCallback_, this));
	}

	this.show = function() {
		this.app.mapStateManager.SVGWriter.show();
		this.app.mapStateManager.SVGWriter.load(this.app.configManager.getSvgById(this.app.currentRegion));
		this.drawNumbers();
		
		this.elements["CONTAINER"].removeClass("onHidden");
		this.app.eventRightWidgets.fullShow();
		this.app.eventLegendWidgets.fullShow();
		this.app.eventsLegendWidget.show();
		this.app.mapStateManager.removeBlur();

		this.app.setAppTitle("События");

		$("#legend-widget").hide();
	}

	this.hidden = function() {
		this.elements["CONTAINER"].addClass("onHidden");
		this.app.eventRightWidgets.fullHidden();
		this.app.eventLegendWidgets.fullHidden();
		this.app.eventsDrawWidget.hidden();
		this.app.eventsLegendWidget.hide();
	}
}

/**
 * [MapStateManager description]
 * @param {[type]} app [description]
 */
var MapStateManager = function(app) {
	this.miniMapWriter = new MiniMapWriter();
	this.miniMapWriter.setText(this.backTitleText);

	this.OnDistrictChangeState = new signals.Signal();
	this.OnDistrictChangeState.add(OnDistrictChangeState);

	this.onAfterStateChange = null;

	this.stateCSS = {
		"BG-IMAGE": "#bg-image"
	}

	this.stateElements =  {
		"BG-IMAGE": {}
	}

	this.bgImage = {};
	this.regions = {};
	this.currentRegionData = {};
	this.stateElements["BG-IMAGE"] = $(this.stateCSS["BG-IMAGE"]);
	this.level = 0;
	this.maxLevel = 2;

	this.addBlur = function() {
		this.stateElements["BG-IMAGE"].addClass("blur");
	}

	this.removeBlur = function() {
		this.stateElements["BG-IMAGE"].removeClass("blur");
	}

	this.setPrevRegion = function(data) {
		this.prevRegion = data;
		this.miniMapWriter.setText(this.prevRegion.name);
		this.miniMapWriter.show(
			this.app.configManager.getMiniMapById(this.app.currentRegion), 
			$.proxy(this.onBack_, this)
		);
	}

	this.setRootRegions = function(data) {
		this.regions = this.app.regionsManagerLocal.getRegionsByParent(this.app.currentRegion, data);
		this.currentRegionData = this.app.regionsManagerLocal.getRegionById(this.app.currentRegion, data);
		
				console.log(this.currentRegionData);
		if(this.currentRegionData) {
			this.app.setAppTitle(this.currentRegionData.name);
			if(this.app.currentZoom != 1) {
				if(this.currentRegionData.parent_id) {
					this.setPrevRegion(
						this.app.regionsManagerLocal.getRegionById(
							this.currentRegionData.parent_id, 
							data
						)
					);
				}
			}	
		}
		
	}

	this.show = function() {
		this.app.regionsManagerLocal.getRegions($.proxy(this.setRootRegions, this));
		
		this.setBgImage();
		this.app.mapColorWidget.updateParams();
		this.SVGWriter.load(this.app.configManager.getSvgById(this.app.currentRegion));
		this.app.parametrsWidgets.getParamsByRegionAndYeage(this.app.currentRegion);

		this.app.legendWidget.show();
	}

	this.setBgImage = function(bgImageLoaded) {
		this.bgImage = this.app.configManager.getMapById(this.app.currentRegion);
		this.stateElements["BG-IMAGE"].css("backgroundImage", "url('"+this.bgImage+"')");
	}

	this.onBack_ = function() {
		this.level -= 1;
		this.onBeforeVideoPlay_();

		var outVideo = this.app.configManager.getOutVideoById(this.app.currentRegion);

		this.app.currentRegion = this.prevRegion.id;
		this.app.prevState();

		this.OnDistrictChangeState.dispatch(this.app, this, outVideo);

		this.app.legendWidget.hide();
	}

	this.clear = function() {
		this.miniMapWriter.hiden();
	}

	this.onBeforeVideoPlay_ = function() {
		this.miniMapWriter.hiden();
		this.app.mapColorel.hidden();
		this.SVGWriter.hide();
	}

	this.onSvgClick_ = function(evt) {
		var newIdRegion = $(evt.target).parent().attr("target");

		if(newIdRegion && this.level != this.maxLevel) {
			this.app.legendWidget.hide();
			this.level += 1;

			var inVideo = this.app.configManager.getInVideoById(newIdRegion);

			if(inVideo) {
				this.onBeforeVideoPlay_();

				this.app.currentRegion = newIdRegion;
				this.app.nextState();

				this.OnDistrictChangeState.dispatch(this.app, this, inVideo);
			}
		}
	}

	this.app = app;
	this.SVGWriter = new SVGLoader(app, {
		onClick: $.proxy(this.onSvgClick_, this)
	});
}

/**
 * [Application description]
 */
var Application = function() {
	this.appSize = [1920, 1080];
	this.currentRegion = 100;
	this.maxZoom = 3;
	this.currentZoom = 1;
	this.russianId = 100;

	this.apiHost = ConfigApp["API-HOST"];
	this.currentMenuSate = "MAP";

	this.loadingState = new LoadingState(this);
	this.configManager = new ConfigManager(this, ConfigApp);
	this.appTimer = new AppTimer(this);
	this.footerNavWidget = new FooterNavWidget(this);

	this.onDistrictUpdateMapEvent = new signals.Signal();
	this.onDistrictUpdateMapEvent.add(OnDistrictUpdateMapEvent);

	this.onFormatUpdateContentEvent = new signals.Signal();
	this.onFormatUpdateContentEvent.add(OnFormatUpdateContentEvent);

	this.mobile = navigator.userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i);

	var self = this;

	this.getResByPath = function(path) {
		return path;
	}
	
	this.CSS = {
		"APP": "#app",
		"TITLE": "h1"
	}
	this.elements = {
		"APP": $(this.CSS["APP"]),
		"TITLE": $(this.CSS["TITLE"])
	}

	this.prevState = function() {
		this.currentZoom--;
	}

	this.nextState = function() {
		this.currentZoom++;
	}

	this.run = function() {
		this.loadingState.run();
		this.appTimer.run();
		this.initResource_();
		this.footerNavWidget.draw();
	}

	// Загружаем ресурсы, используя родной applicationCache
	this.initResource_ = function() {
		var appCache = window.applicationCache;
        if (appCache.status == appCache.IDLE)
            return this.onCacheLoaded_();

        var loaded = $.proxy(function () {
            this.onCacheLoaded_();
        }, this);

        appCache.addEventListener('updateready', loaded, false);
        appCache.addEventListener('noupdate', loaded, false);
        appCache.addEventListener('error', loaded, false); // Если размер кэша недостаточен — продолжим без кэширования
        appCache.addEventListener('cached', function () {
            // Reload page after all content is cached
            window.location.reload();
        }, false);
        appCache.addEventListener('downloading', $.proxy(function () {
            this.loadingState.run();
        }, this), false);
        appCache.addEventListener('progress', $.proxy(function (e) {
            this.loadingState.updateText(e.loaded, e.total);
        }, this), false);
        
	};

	this.init = function() {
		$(this.elements["APP"]).width(this.appSize[0]).height(this.appSize[1]);
	}

	this.onPanelsShow = function() {
		this.mapStateManager.show();
	}

	this.onDistrictUpdateMapEventBind_ = function() {
		this.onDistrictUpdateMapEvent.dispatch(this);
	}

	this.onFormatUpdateContentEventBind_ = function() {
		this.onFormatUpdateContentEvent.dispatch(this);
	}

	this.onCacheLoaded_ = function() {
		this.loadingState.clearText();

		this.regionManager = new RegionManager(this);
		this.paramsManager = new ParamsManager(this);
		
		this.mapStateManager = new MapStateManager(this);
		this.legendManager = new LegendManager(this);
		this.graphManager = new GraphManager(this);
		this.regionsManagerLocal = new RegionsManagerLocal(this);

		this.videoPlayer = new VideoPlayer();
		
		this.ageSelectorWidget = new YearSelectWidget(this, {
			years: [2014, 2013, 2012, 2011, 2010, 2009, 2008],
			selectedYear: 2012,
			container: "#age_select",
			onAfterYearSelected: $.proxy(this.onDistrictUpdateMapEventBind_, this)
		});
		this.ageSelectorFormatWidget = new YearSelectWidget(this, {
			years: [2014, 2013, 2012, 2011, 2010, 2009, 2008],
			selectedYear: 2012,
			container: "#params-age-selected",
			onAfterYearSelected: $.proxy(this.onFormatUpdateContentEventBind_, this)
		});
		this.ageSelectorRegionsWidget = new YearSelectWidget(this, {
			years: [2012],
			selectedYear: 2012,
			container: "#regions_age_select"
		});
		this.ageSelectorReportsWidget = new YearSelectWidget(this, {
			years: [2014, 2013, 2012, 2011, 2010, 2009, 2008],
			selectedYear: 2012,
			container: "#reposrts-params-age-selected",
			onAfterYearSelected: $.proxy(this.onFormatUpdateContentEventBind_, this)
		});
		this.parametrsWidgets = new ParametrsWidgets(this);
		this.eventLegendWidgets = new EventLegendWidgets(this);
		this.eventRightWidgets = new EventRightWidgets(this);
		this.mapColorWidget = new MapColorWidget(this);
		this.mapColorel = new MapColorel(this);
		this.regionsMapColorel = new RegionsMapColorel(this);
		this.legendWidget = new LegendWidget(this);
		this.regionsLegendWidget = new RegionsLegendWidget(this);
		this.eventsLegendWidget = new EventsLegendWidget(this);
		this.pageTitleWidget = new PageTitleWidget(this);
		this.eventsDrawWidget = new EventsDrawWidget(this);
		this.dictionaryManager = new DictionaryManager(this);
		this.legendParamsManager = new LegendParamsManager(this);
		
		this.regionsSelectorWidget = new RegionsSelectorWidget(this);
		this.paramsSelectorWidget = new ParamsSelectorWidget(this);
		this.formatWidget = new FormatWidget(this);
		this.graphWidget = new GraphWidget(this);
		this.formatManager = new FormatManager(this);
		this.graphParamsSelector = new GraphParamsSelector(this);
		this.graphRegionsSelectorWidget = new GraphRegionsSelectorWidget(this);
		this.reportsParamsSelector = new ReportsParamsSelector(this);
		this.reportsDiscSelector = new ReportsDiscSelector(this);
		this.reportsWidget = new ReportsWidget(this);

		this.regionsMapColorWidget = new RegionsMapColorWidget(this);
		
		this.regionsParametrsWidgets = new RegionsParametrsWidgets(this);
		this.regionsLegendWidget = new RegionsLegendWidget(this);
		this.eventsListWidget = new EventsListWidget(this);

		this.regionPanel = new RegionPanel(this);
		this.districtsPanel = new DistrictsPanel(this);
		this.graphPanel = new GraphPanel(this);
		this.formatPanel = new FormatPanel(this);
		this.reportsPanel = new ReportsPanel(this);
		this.mapEventsPanel = new MapEventsPanel(this);
		this.eventsContentWidget = new EventsContentWidget();
		this.eventsLegendLeftWidget = new EventsLegendLeftWidget(this);

		this.regionsMapColorWidget.enable();
		this.mapColorWidget.enable();

		this.loadingState.stop();
		this.onPanelsShow();

		this.eventsListWidget.render(this.currentRegion);
		//this.eventsContentWidget.render();
		this.eventsLegendLeftWidget.render({counts: null});
	}

	this.setAppTitle = function(title) {
		this.elements["TITLE"].html(title);
	}

	this.init();
}

$(document).ready(function() {
	window.webkitStorageInfo.requestQuota(PERSISTENT, 3111111111, function(grantedBytes) {
  		window.webkitRequestFileSystem(PERSISTENT, grantedBytes, function() {
  			window.application = new Application();
			application.run();	
  		}, function() {

  		});
	}, function(e) {
	});
	
}); 