function hiddenParentList(list) {
	var parentElements = list;
	$.each(parentElements, function(key, value) {
		var sub = $(value).find("li:not(.hidde)");
		if(sub.size() == 0) {
			$(value).addClass("hidde");
		} else {
			$(value).removeClass("hidde");
			parentElements.find("ul").show();
		}
	});
}

function decorateValues(val, fixed) {
	var valItem = val;
	if(valItem) {
		var valItemAr = valItem.split(".");
		if(valItemAr[1] && valItemAr[1] == 0) {
			valItem = valItemAr[0];
		} else {
			valItem = Number(valItem).toFixed(fixed);
		}
	}

	return valItem;
}

/**
 * [ParametrsWidgets description]
 * @param {[type]} app [description]
 */
var RegionsParametrsWidgets = function(app) {
	this.app =  app;
	this.parametrs = {};
	this.currentParametr = null;
	this.CSS = {
		"SHOW": "#regions-paramers-show",
		"MAIN": "#regions-parametrs-widget",
		"SCROLL": ".scroll",
		"HIDDEN": "#regions-parametrs-widget > .hidden",
		"PARAMETRS-LIST": "#regions-parametrs-list",
		"TITLE": "#regions-parametrs-widget h3",
		"FILTER": "#regions-params-filter",
		"AGE-SELECT": "#regions_age_select",
		"UOM": "#regions-param-info",
		"MAP-PARAMS": "#regions-params"
	}

	this.elements = {
		"SHOW": $(this.CSS["SHOW"]),
		"MAIN": $(this.CSS["MAIN"]),
		"SCROLL": $(this.CSS["SCROLL"]),
		"HIDDEN": $(this.CSS["HIDDEN"]),
		"PARAMETRS-LIST": $(this.CSS["PARAMETRS-LIST"]),
		"TITLE": $(this.CSS["TITLE"]),
		"FILTER": $(this.CSS["FILTER"]),
		"AGE-SELECT": $(this.CSS["AGE-SELECT"]),
		"UOM": $(this.CSS["UOM"]),
		"MAP-PARAMS": $(this.CSS["MAP-PARAMS"])
	}

	this.animateStep = "-500px";
	this.animateSpeed = 1000;
	this.legendWidget = new RegionsLegendWidget(this.app);
	this.scrollApi = null;

	this.fullHidden = function() {
		this.elements["MAP-PARAMS"].addClass("hidden");
	}

	this.fullShow = function() {
		this.elements["MAP-PARAMS"].removeClass("hidden");
	}

	this.parametrsClick_ = function(evt) {
		$(evt.target).parent().find("ul").slideToggle("slow");


	}

	this.getParametrById = function(id) {
		var par = null;
		$.each(this.parametrs, function(key, value) {
			if(value && value.id == id) {
				par = value;
			}
		});

		return par;
	}

	this.parametrsNameClick_ = function(evt) {
		if(!$(evt.target).hasClass("active")) {
			var self = this;
			var parentLi = $(evt.target).parent().parent();
			$(this.CSS["SCROLL"]).find(".active").removeClass("active");
			$(evt.target).toggleClass("active");

			this.setTitle($(evt.target).html());
			this.currentParametr = this.getParametrById(parentLi.attr("data-id"));
			this.app.regionsMapColorel.colored(
				this.currentParametr.id,
				this.app.ageSelectorRegionsWidget.selectedYear
			);
			this.app.regionsMapColorWidget.updateParams();
			this.elements["UOM"].html(parentLi.attr("data-uom"));

			$.ajax(
				{
					url: this.app.apiHost + "/param_values/colors_for_legend_list/"+this.currentParametr.id+"/"+this.app.ageSelectorRegionsWidget.selectedYear,
					type: "GET",
					success: function(data) {
						if(data.green) {
							$("#regions-legend-widget .green").html(data.green);
						} else {
							$("#regions-legend-widget .green").html(0);
						}
						if(data.yellow) {
							$("#regions-legend-widget .yellow").html(data.yellow);
						} else {
							$("#regions-legend-widget .yellow").html(0);
						}
						if(data.red) {
							$("#regions-legend-widget .red").html(data.red);
						} else {
							$("#regions-legend-widget .red").html(0);
						}
					}
				}
			);
		} else {
			/*$(this.CSS["PARAMETRS-LIST"]).find(".active").removeClass("active");
			this.setTitle("");
			this.currentParametr = null;
			this.elements["UOM"].html("");
			this.app.regionsMapColorWidget.onToggle_();
			this.app.regionsLegendWidget.hide();
			this.app.regionsMapColorel.hidden();*/
		}
	}

	this.setTitle = function(title) {
		this.elements["TITLE"].html(title);
	}

	this.prepareParamerts_ = function(data) {
		var ret = {};

		$.each(data, function(key, value) {
			if(!ret[value.group_id]) {
				ret[value.group_id] = {
					id: value.group_id,
					name: value.group_name,
					parameters: []
				}
			}

			ret[value.group_id].parameters.push({
				id: value.param_id,
				name: value.param_name,
				value: value.param_val
			});
		});

		return ret;
	}

	this.getParametrs_ = function(data) {
		var self = this;
		this.parametrs = data;
		this.drawRegionsParamets_(this.parametrs);

		$(this.CSS["PARAMETRS-LIST"]+" .name").on("click", $.proxy(this.parametrsNameClick_, this));

		if(this.currentParametr) {
			this.app.legendManager.getLegendByParamAndSubject(
				this.currentParametr.id,
				this.app.currentRegion,
				function(data) {
					self.legendWidget.setLevelText(data);
					self.legendWidget.show();
				}
			);
		}

	}

	this.initScroll_ = function() {
		$(this.CSS["PARAMETRS-LIST"]).jScrollPane(
			{
				showArrows: true,
				verticalDragMinHeight: 60,
	    		verticalDragMaxHeight: 60,
	    		autoReinitialise: true
			}
		);
		this.scrollApi = this.elements["PARAMETRS-LIST"].data('jsp');
	}

	this.drawRegionsParamets_ = function(params)
	{
		var html = "";
		var self = this;
		var contentPane = this.scrollApi.getContentPane();
		var html =  "<ul class='first regions-params'>"
		$.each(params, function(key, value) {
			var uom = value.uom_name == null ? "" : value.uom_name;
			html += "<li data-uom='"+uom+"' data-name='"+value.name+"' data-id='"+value.id+"'><span  class='param'><em class='spr'>-</em> <em class='name'>"+value.name+"</em></span></li>";
		});
		html += "</ul>";
		contentPane.append(html);

		this.scrollApi.reinitialise();
	}

	this.onHidden_ = function() {
		this.elements["MAIN"].animate( {
				right: this.animateStep
			},
			this.animateSpeed,
			$.proxy(this.onMainHiddened_, this)
		);
		this.elements["SHOW"].animate({
				right: "0px"
			},
			this.animateSpeed/4,
			$.proxy(this.onMainHiddened_, this)
		);
		return false;
	}

	this.onShow_ = function() {
		//this.elements["SHOW"].addClass("onRight");
		this.elements["SHOW"].animate({
				right: this.animateStep
			},
			this.animateSpeed/2,
			$.proxy(this.onMainShowed_, this)
		);

		return false;
	}

	this.onMainShowed_ = function() {
		this.elements["MAIN"].css({
			right: this.animateStep,
			display: "block"
		});

		this.elements["MAIN"].animate({
				right: "0px"
			},
			this.animateSpeed
		);

		if(this.currentParametr != null) {
			//this.legendWidget.show();
		}
		this.initScroll_();
	}

	this.onMainHiddened_ = function() {

	}

	this.onFilterClick_ = function(evt) {
		var filterValue = $(evt.target).val();
		if(filterValue.length > 0) {
			this.filteringParametrs(filterValue);
		} else {
			this.clearFilter_();
		}
	}

	this.clearFilter_ = function() {
		$(this.CSS["PARAMETRS-LIST"]).find(".hidde").removeClass("hidde");
	}

	this.filteringParametrs = function(filterValue) {
		var elements = $(this.CSS["PARAMETRS-LIST"]).find("ul li");

		$.each(elements, function(key, value) {
			var elem = $(value).attr("data-name");
			if(elem.toLowerCase().indexOf(filterValue.toLowerCase()) == -1) {
				$(value).addClass("hidde");
			} else {
				$(value).removeClass("hidde");
			}
		});
		hiddenParentList($(this.CSS["PARAMETRS-LIST"]).find(".jspPane > ul > li"));
	}

	this.getParamsByRegionAndYeage = function(region_id) {
		this.app.paramsManager.getParamsByRegionAndYeage(
			region_id,
			this.app.ageSelectorRegionsWidget.selectedYear,
			$.proxy(this.getParametrs_, this)
		);
	}

	this.getRegionsParams = function() {
		this.app.paramsManager.getRegionsParams($.proxy(this.getParametrs_, this));
	}

	this.bindEvents_ = function() {
		this.elements["SHOW"].on("click", $.proxy(this.onShow_, this));
		this.elements["HIDDEN"].on("click", $.proxy(this.onHidden_, this));
		this.elements["FILTER"].on("keyup", $.proxy(this.onFilterClick_, this));
	}

	this.initScroll_();
	this.bindEvents_();
	this.app.ageSelectorRegionsWidget.draw();
}

/**
 * [ParametrsWidgets description]
 * @param {[type]} app [description]
 */
var ParametrsWidgets = function(app) {
	this.app =  app;
	this.parametrs = {};
	this.currentParametr = null;
	this.CSS = {
		"SHOW": "#paramers-show",
		"MAIN": "#parametrs-widget",
		"SCROLL": ".scroll",
		"HIDDEN": ".hidden",
		"PARAMETRS-LIST": "#parametrs-list",
		"TITLE": "#parametrs-widget h3",
		"FILTER": "#params-filter",
		"AGE-SELECT": "#age_select",
		"UOM": "#param-info",
		"MAP-PARAMS": "#map-params"
	}

	this.elements = {
		"SHOW": $(this.CSS["SHOW"]),
		"MAIN": $(this.CSS["MAIN"]),
		"SCROLL": $(this.CSS["SCROLL"]),
		"HIDDEN": $(this.CSS["HIDDEN"]),
		"PARAMETRS-LIST": $(this.CSS["PARAMETRS-LIST"]),
		"TITLE": $(this.CSS["TITLE"]),
		"FILTER": $(this.CSS["FILTER"]),
		"AGE-SELECT": $(this.CSS["AGE-SELECT"]),
		"UOM": $(this.CSS["UOM"]),
		"MAP-PARAMS": $(this.CSS["MAP-PARAMS"])
	}

	this.animateStep = "-500px";
	this.animateSpeed = 1000;
	this.legendWidget = new LegendWidget(this.app);
	this.scrollApi = null;

	this.fullHidden = function() {
		this.elements["MAP-PARAMS"].addClass("hidden");
	}

	this.fullShow = function() {
		this.elements["MAP-PARAMS"].removeClass("hidden");
	}

	this.parametrsClick_ = function(evt) {
		$(evt.target).parent().find("ul").slideToggle("slow");
	}

	this.selectGroup = function(id)
	{
		$("#parametrs-list .first-li").find("ul").slideUp("slow");
		$("#parametrs-list").find("ul.first[data-id='"+id+"']").find("ul").slideDown("slow");
	}

	this.getParametrById = function(id)
	{
		var par = null;
		$.each(this.parametrs, function(key, value)
		{
			$.each(value.parameters, function(key2, value2)
			{
				if(value2 && value2.id == id)
				{
					par = value2;
				}
			});
		});

		return par;
	}

	this.coloredLoad_ = function() {
		this.app.mapColorel.show();
	}

	this.parametrsNameClick_ = function(evt) {
		if(!$(evt.target).hasClass("active")) {
			var self = this;
			var parentLi = $(evt.target).parent().parent();
			$(this.CSS["PARAMETRS-LIST"]).find(".active").removeClass("active");
			$(evt.target).toggleClass("active");

			this.setTitle($(evt.target).html());

			this.currentParametr = this.getParametrById(parentLi.attr("data-id"));
			this.app.mapColorel.colored(
				this.currentParametr.id,
				this.app.currentRegion,
				this.app.ageSelectorWidget.selectedYear,
				$.proxy(this.coloredLoad_, this)
			);
			this.app.mapColorWidget.updateParams();
			this.app.paramsManager.getParamUom(this.currentParametr.id, function(data) {
				if(data && data.responseText) {
					self.elements["UOM"].html(data.responseText);
				} else {
					self.elements["UOM"].html("");
				}
			});

			this.app.legendParamsManager.getLegendByParamAndSubject(
				this.currentParametr.id,
				this.app.currentRegion,
				this.app.ageSelectorWidget.selectedYear,
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


						/*
						if(key == "#ff7f7f") {
							newData["red"][0] += 1;
						}
						if(key == "#ffff7f") {
							newData["yellow"][0] += 1;
						}    */


						if(key == "#ff7f7f") {
							newData["yellow"][0] += 1;
						}
						if(key == "#ffff7f") {
							newData["red"][0] += 1;
						}
						if(!key) {
							newData["blue"][0] += 1;
						}
					});
					self.legendWidget.setLevelText(newData);
					self.legendWidget.show();
				}
			);

		} else {
			/*$(this.CSS["PARAMETRS-LIST"]).find(".active").removeClass("active");
			this.setTitle("");
			this.currentParametr = null;
			this.elements["UOM"].html("");
			this.app.mapColorWidget.onToggle_();
			this.legendWidget.hide();
			this.app.mapColorel.hidden();*/
		}
	}

	this.getLegendByParamAndSubjectCallback = function(data) {
		this.app.legendWidget.setLevelText(data);
		this.app.legendWidget.show();
	}

	this.setTitle = function(title) {
		this.elements["TITLE"].html(title);
	}

	this.prepareParamerts_ = function(data) {
		var ret = {};

		$.each(data, function(key, value) {
			if(!ret[value.group_id]) {
				ret[value.group_id] = {
					id: value.group_id,
					name: value.group_name,
					parameters: []
				}
			}

			ret[value.group_id].parameters.push({
				id: value.param_id,
				name: value.param_name,
				value: value.param_val
			});
		});

		return ret;
	}

	this.getParametrs_ = function(data) {
		var self = this;
		this.parametrs = this.prepareParamerts_(data);
		this.drawParamets_(this.parametrs);

		if(this.currentParametr) {
			this.app.legendManager.getLegendByParamAndSubject(
				this.currentParametr.id,
				this.app.currentRegion,
				function(data) {
					self.legendWidget.setLevelText(data);
					self.legendWidget.show();
				}
			);
		}

	}

	this.initScroll_ = function() {
		$(this.CSS["PARAMETRS-LIST"]).jScrollPane(
			{
				showArrows: true,
				verticalDragMinHeight: 60,
	    		verticalDragMaxHeight: 60,
	    		autoReinitialise: true
			}
		);
		this.scrollApi = this.elements["PARAMETRS-LIST"].data('jsp');
	}


	this.drawParamets_ = function(params) {
		var html = "";
		var self = this;
		var contentPane = this.scrollApi.getContentPane();
       contentPane.empty();
		$.each(params, function(key, value) {

			var elementCurrentGroup = $("ul[data-id='"+value.id+"']", self.CSS["PARAMETRS-LIST"]);
			if(elementCurrentGroup.size() == 0) {
				var html =  "<ul data-id='"+value.id+"' class='first'><li class='first-li'>";
					html += "<a class='group'>"+value.name+"</a>";
					html += "<ul></ul></li></ul>";

				contentPane.append(html);
			}

			var elementCurrentGroup = $("ul[data-id='"+value.id+"']", self.CSS["PARAMETRS-LIST"]);

			var param_vals = new Object();
			if(value.parameters.length > 0) {
				$.each(value.parameters, function(key2, value2) {
					value2.value = decorateValues(value2.value, 2);
					var paramCurrent = $("li[data-id='"+value2.id+"']", self.CSS["PARAMETRS-LIST"]);
					if(value2.value == null) {
						value2.value = "";
					}
					if(param_vals[value2.id] == null) param_vals[value2.id] = 0;
					if(value2.value != "")
					{
						param_vals[value2.id] += parseInt(value2.value);

				//		param_vals[value2.id] +=
					}
					if(paramCurrent.size() == 0) {
						var html = "<li data-name='"+value2.name+"' data-id='"+value2.id+"'><span  class='param'><em class='spr'>-</em> <em class='name' id='parameter_name_"+value2.id+"'>"+value2.name+"</em></span><i>"+value2.value+"</i></li>";

						elementCurrentGroup.find("ul").append(html);
					} else if(ConfigApp["SAC_TYPE"] != 'vimpel'){
						paramCurrent.find("i").html(param_vals[value2.id]);
				 	}
				 	else paramCurrent.find("i").html("");

                    if(self.currentParametr != null && self.currentParametr.name == value2.name &&
                    	self.currentParametr.id != value2.id)
                    {
                    	$("#parameter_name_" + value2.id).click();
                    }
				});
			}
		});
		this.scrollApi.reinitialise();
	}

	this.onHidden_ = function() {
		this.elements["MAIN"].animate( {
				right: this.animateStep
			},
			this.animateSpeed,
			$.proxy(this.onMainHiddened_, this)
		);
		this.elements["SHOW"].animate({
				right: "0px"
			},
			this.animateSpeed/4,
			$.proxy(this.onMainHiddened_, this)
		);
		return false;
	}

	this.onShow_ = function() {
		//this.elements["SHOW"].addClass("onRight");
		this.elements["SHOW"].animate({
				right: this.animateStep
			},
			this.animateSpeed/2,
			$.proxy(this.onMainShowed_, this)
		);

		return false;
	}

	this.onMainShowed_ = function() {
		this.elements["MAIN"].css({
			right: this.animateStep,
			display: "block"
		});

		this.elements["MAIN"].animate({
				right: "0px"
			},
			this.animateSpeed
		);

		if(this.currentParametr != null) {
			this.legendWidget.show();
		}
		this.initScroll_();

		if(!this.app.vitrLoaded)
		{
			this.selectGroup(this.app.group_id);
			this.app.vitrLoaded = true;
		}
	}

	this.onMainHiddened_ = function() {

	}

	this.onFilterClick_ = function(evt) {
		var filterValue = $(evt.target).val();
		if(filterValue.length > 0) {
			this.filteringParametrs(filterValue);
		} else {
			this.clearFilter_();
		}
	}

	this.clearFilter_ = function() {
		$(this.CSS["PARAMETRS-LIST"]).find(".hidde").removeClass("hidde");
	}

	this.filteringParametrs = function(filterValue) {
		var elements = $(this.CSS["PARAMETRS-LIST"]).find("ul li ul li");

		$.each(elements, function(key, value) {
			var elem = $(value).attr("data-name");
			if(elem.toLowerCase().indexOf(filterValue.toLowerCase()) == -1) {
				$(value).addClass("hidde");
			} else {
				$(value).removeClass("hidde");
			}
		});

		hiddenParentList($(this.CSS["PARAMETRS-LIST"]).find(".jspPane > ul > li"));
	}

	this.getParamsByRegionAndYeage = function(region_id) {
		this.app.paramsManager.getParamsByRegionAndYeage(
			region_id,
			this.app.ageSelectorWidget.selectedYear,
			$.proxy(this.getParametrs_, this)
		);
	}

	this.getRegionsParams = function() {
		this.app.paramsManager.getRegionsParams($.proxy(this.getParametrs_, this));
	}

	this.bindEvents_ = function() {
		this.elements["SHOW"].on("click", $.proxy(this.onShow_, this));
		this.elements["HIDDEN"].on("click", $.proxy(this.onHidden_, this));
		this.elements["FILTER"].on("keyup", $.proxy(this.onFilterClick_, this));

		$("body").on("click", this.CSS["PARAMETRS-LIST"]+" li.first-li", $.proxy(this.parametrsClick_, this));
		$("body").on("click", this.CSS["PARAMETRS-LIST"]+" .name", $.proxy(this.parametrsNameClick_, this));
	}

	this.initScroll_();
	this.bindEvents_();
	this.app.ageSelectorWidget.draw();
}

/**
 * [EventRightWidgets description]
 * @param {[type]} app [description]
 */
var EventRightWidgets = function(app) {
	this.app =  app;
	this.parametrs = {};
	this.currentParametr = null;
	this.CSS = {
		"CONTAINER": "#events-params",
		"SHOW": "#events-paramers-show",
		"MAIN": "#events-parametrs-widget",
		"SCROLL": ".scroll",
		"HIDDEN": ".hidden",
	}

	this.elements = {
		"SHOW": $(this.CSS["SHOW"]),
		"MAIN": $(this.CSS["MAIN"]),
		"SCROLL": $(this.CSS["SCROLL"]),
		"HIDDEN": $(this.CSS["HIDDEN"], $(this.CSS["CONTAINER"])),
		"PARAMETRS-LIST": $(this.CSS["PARAMETRS-LIST"]),
		"TITLE": $(this.CSS["TITLE"]),
		"FILTER": $(this.CSS["FILTER"]),
		"AGE-SELECT": $(this.CSS["AGE-SELECT"]),
		"MAP-PARAMS": $(this.CSS["CONTAINER"])
	}

	this.animateStep = "-350px";
	this.animateSpeed = 1000;
	this.legendWidget = new LegendWidget(this.app);
	this.scrollApi = null;

	this.fullHidden = function() {
		this.elements["MAP-PARAMS"].addClass("hidden");
	}

	this.fullShow = function() {
		this.elements["MAP-PARAMS"].removeClass("hidden");
		$("#events-parametrs-widget").show();
	}


	this.onHidden_ = function() {
		this.elements["MAIN"].animate( {
				right: this.animateStep
			},
			this.animateSpeed,
			$.proxy(this.onMainHiddened_, this)
		);
		this.elements["SHOW"].animate({
				right: "0px"
			},
			this.animateSpeed/4,
			$.proxy(this.onMainHiddened_, this)
		);
		this.legendWidget.hide();
		return false;
	}

	this.onShow_ = function() {
		//this.elements["SHOW"].addClass("onRight");
		this.elements["SHOW"].animate({
				right: this.animateStep
			},
			this.animateSpeed/2,
			$.proxy(this.onMainShowed_, this)
		);

		return false;
	}

	this.onMainShowed_ = function() {
		this.elements["MAIN"].css({
			right: this.animateStep,
			display: "block"
		});

		this.elements["MAIN"].animate({
				right: "0px"
			},
			this.animateSpeed
		);

		if(this.currentParametr != null) {
			//this.legendWidget.show();
		}
	}

	this.onMainHiddened_ = function() {

	}


	this.bindEvents_ = function() {
		this.elements["SHOW"].on("click", $.proxy(this.onShow_, this));
		this.elements["HIDDEN"].on("click", $.proxy(this.onHidden_, this));

		var self = this;
		$(".inner_table td").on("click", function() {
			self.app.eventsDrawWidget.show();
		})
	}

	this.bindEvents_();
	this.app.ageSelectorWidget.draw();
}

/**
 * [EventRightWidgets description]
 * @param {[type]} app [description]
 */
var EventLegendWidgets = function(app) {
	this.app =  app;
	this.parametrs = {};
	this.currentParametr = null;
	this.CSS = {
		"CONTAINER": "#events-legend",
	}

	this.elements = {
		"CONTAINER": $(this.CSS["CONTAINER"]),
	}

	this.fullHidden = function() {
		this.elements["CONTAINER"].addClass("hidden");
	}

	this.fullShow = function() {
		this.elements["CONTAINER"].removeClass("hidden");
	}
}

/**
 * [LegendWidget description]
 * @param {[type]} app [description]
 */
var LegendWidget = function(app) {
	this.app =  app;
	this.isShow = false;
	this.legendService = new LegendService(app);

	this.CSS = {
		"MAIN": "#legend-widget"
	}

	this.elements = {
		"MAIN": $(this.CSS["MAIN"])
	}

	this.setLevelText = function(data) {
		var $p = $(this.CSS["MAIN"]).find("p");
		var self = this;
		$.each($p, function(key, value) {
			self.legendService.setHtmlValueByColorName(value, "red", 1, data);
			self.legendService.setHtmlValueByColorName(value, "yellow", 2, data);
			self.legendService.setHtmlValueByColorName(value, "green", 3, data);
			self.legendService.setHtmlValueByColorName(value, "blue", 4, data);
		});
	}

	this.show = function() {
		if(!this.isShow) {
			this.elements["MAIN"].removeClass("hidden");
			this.isShow = true;
		}
	}

	this.hide = function() {
		this.elements["MAIN"].addClass("hidden");
		this.isShow = false;
	}
}

var LegendService = function(app) {
	this.app =  app;

	this.setHtmlValueByColorName = function(element, colorName, key, data) {
		if(key == key && data[colorName] && $(element).hasClass(colorName)) {
			var string = "";
			if(data[colorName][0]) {
				string += parseInt(data[colorName][0]);
			}
			if(data[colorName][1]) {
				if(data[colorName][0]) {
					string += "-";
				}
				string += parseInt(data[colorName][1]);
			}
			if(string == "") {
				string = "0";
			}
			$(element).html(string);
		}
		if(!data[colorName] && $(element).hasClass(colorName)) {
			$(element).html("нет данных");
		}
	}
}

/**
 * [LegendWidget description]
 * @param {[type]} app [description]
 */
var RegionsLegendWidget = function(app) {
	this.app =  app;
	this.isShow = false;
	this.legendService = new LegendService(app);

	this.CSS = {
		"MAIN": "#regions-legend-widget"
	}

	this.elements = {
		"MAIN": $(this.CSS["MAIN"])
	}

	this.show = function() {
		if(!this.isShow) {
			this.elements["MAIN"].removeClass("hidden");
			this.isShow = true;
		}
	}

	this.hide = function() {
		this.elements["MAIN"].addClass("hidden");
		this.isShow = false;
	}
}

var EventsLegendWidget = function(app) {
	this.app =  app;
	this.isShow = false;
	this.legendService = new LegendService(app);

	this.CSS = {
		"MAIN": "#events-legend-widget"
	}

	this.elements = {
		"MAIN": $(this.CSS["MAIN"])
	}

	this.show = function() {
		if(!this.isShow) {
			this.elements["MAIN"].removeClass("hidden");
			this.isShow = true;
		}
	}

	this.hide = function() {
		this.elements["MAIN"].addClass("hidden");
		this.isShow = false;
	}
}

/**
 * [MapColorWidget description]
 * @param {[type]} app [description]
 */
var MapColorWidget = function(app) {
	this.app = app;
	this.state = false;

	this.CSS = {
		"TOGGLE": "#map-color-toggler"
	}

	this.elements = {
		"TOGGLE": $(this.CSS["TOGGLE"])
	}

	this.bindEvents_ = function() {
		this.elements["TOGGLE"].on("click", $.proxy(this.onToggle_, this));
	}

	this.paramsLoaded_ = function(data) {
		var ret = {};
		$.each(data, function(key, value) {
			if(value.val_numeric != 0) {
				ret[value.subject_id] = value.val_numeric;
			}
		});
		var self = this;
		setTimeout(function() {
			self.app.mapStateManager.SVGWriter.drawParamValues(ret);
		}, 0);
	}

	this.updateParams = function() {
		if(this.state && this.app.parametrsWidgets.currentParametr) {
			this.app.paramsManager.getParamValues(
				this.app.parametrsWidgets.currentParametr.id,
				this.app.currentRegion,
				this.app.ageSelectorWidget.selectedYear,
				$.proxy(this.paramsLoaded_, this)
			);
		}
 	}

	this.onToggle_ = function() {
		if(this.state == false) {
			this.elements["TOGGLE"].addClass("onShow");
			this.state = true;

			this.updateParams();
		} else {
			this.elements["TOGGLE"].removeClass("onShow");
			this.state = false;
			this.app.mapStateManager.SVGWriter.removeParamValues();
		}

		return false;
	}

	this.bindEvents_();
}

/**
 * [MapColorWidget description]
 * @param {[type]} app [description]
 */
var MapColorWidget = function(app) {
	this.app = app;
	this.state = false;

	this.CSS = {
		"TOGGLE": "#map-color-toggler"
	}

	this.elements = {
		"TOGGLE": $(this.CSS["TOGGLE"])
	}

	this.bindEvents_ = function() {
		this.elements["TOGGLE"].on("click", $.proxy(this.onToggle_, this));
	}

	this.paramsLoaded_ = function(data) {
		var self = this;
		setTimeout(function() {
			self.app.mapStateManager.SVGWriter.drawParamValues(data);
		}, 0);
	}

	this.updateParams = function() {
		if(this.state && this.app.parametrsWidgets.currentParametr) {
			this.app.paramsManager.getParamValues(
				this.app.parametrsWidgets.currentParametr.id,
				this.app.currentRegion,
				this.app.ageSelectorWidget.selectedYear,
				$.proxy(this.paramsLoaded_, this)
			);
		}
 	}

 	this.enable = function() {
 		this.elements["TOGGLE"].addClass("onShow");
		this.state = true;

		this.updateParams();
 	}

 	this.disable = function() {
 		this.elements["TOGGLE"].removeClass("onShow");
		this.state = false;
		this.app.mapStateManager.SVGWriter.removeParamValues();
 	}

	this.onToggle_ = function() {
		if(this.state == false) {
			this.enable();
		} else {
			this.disable();
		}

		return false;
	}

	this.bindEvents_();
}

/**
 * [RegionsMapColorWidget description]
 * @param {[type]} app [description]
 */
var RegionsMapColorWidget = function(app) {
	this.app = app;
	this.state = false;

	this.CSS = {
		"TOGGLE": "#regions-map-color-toggler"
	}

	this.elements = {
		"TOGGLE": $(this.CSS["TOGGLE"])
	}

	this.bindEvents_ = function() {
		this.elements["TOGGLE"].on("click", $.proxy(this.onToggle_, this));
	}

	this.paramsLoaded_ = function(data) {
		var ret = {};
		$.each(data, function(key, value) {
			if(value.val_numeric != 0) {
				ret[value.subject_id] = value.val_numeric;
			}
		});
		this.app.mapStateManager.SVGWriter.drawParamValues(ret, "regions");
	}

	this.updateParams = function() {
		if(this.state && this.app.regionsParametrsWidgets.currentParametr) {
			this.app.paramsManager.getRegionsParamValues(
				this.app.regionsParametrsWidgets.currentParametr.id,
				this.app.ageSelectorRegionsWidget.selectedYear,
				$.proxy(this.paramsLoaded_, this)
			);
		}
 	}

 	this.enable = function() {
 		this.elements["TOGGLE"].addClass("onShow");
		this.state = true;

		this.updateParams();
 	}

 	this.disable = function() {
 		this.elements["TOGGLE"].removeClass("onShow");
		this.state = false;
		this.app.mapStateManager.SVGWriter.removeParamValues();
 	}

	this.onToggle_ = function() {
		if(this.state == false) {
			this.enable();
		} else {
			this.disable();
		}

		return false;
	}

	this.bindEvents_();
}

/**
 * [MapColorel description]
 * @param {[type]} app [description]
 */
var MapColorel = function(app) {
	this.app = app;
	this.ajaxPath = "/subjects/";
	this.CSS = {
		"CONTAINER": "#bg-colored-image",
		"LOAD": "#load"
	};
	this.isShowed = false;

	this.elements = {
		"CONTAINER": $(this.CSS["CONTAINER"]),
		"IMAGE": $(this.CSS["CONTAINER"]).find("img")
	}

	this.colored = function(params_id, region_id, year, callback) {
		var self = this;
		var mapPath = this.app.apiHost+this.ajaxPath+params_id+"/"+region_id+"/"+year+"/map";

		this.elements["CONTAINER"].removeClass("onShow");

		$.ajax({ url: mapPath }).always(function(data) {
			self.onGetMapLink_(data, callback);
		});
	}

	this.onGetMapLink_ = function(data, callback) {
		var link = data.responseText;
		if(link != "add values or maps for region") {
			var self = this;
			var image = new Image();

	        image.src = self.app.apiHost+link;

	        image.onload = function() {
	        	self.elements["CONTAINER"].addClass("onShow");
	        	self.elements["CONTAINER"].css("backgroundImage", "url('"+self.app.apiHost+link+"')");
	    		if(callback) {
	        		callback();
				}
	        }
		} else if (callback) callback();
	}

	this.show = function() {
		this.elements["CONTAINER"].addClass("onShow");
		this.isShowed = true;
	}

	this.hidden = function() {
		this.elements["CONTAINER"].removeClass("onShow");
		this.isShowed = false;
	}
}

/**
 * [MapColorel description]
 * @param {[type]} app [description]
 */
var RegionsMapColorel = function(app) {
	this.app = app;
	this.ajaxPath = "/param_values/";
	this.CSS = {
		"CONTAINER": "#bg-regions-image",
		"LOAD": "#load"
	};
	this.isShowed = false;

	this.elements = {
		"CONTAINER": $(this.CSS["CONTAINER"]),
		"IMAGE": $(this.CSS["CONTAINER"]).find("img")
	}

	this.getColoredPath = function(params_id, year) {
		var mapPath = "";
		if(this.app.regionPanel.currentCamera == "CENTER") {
			mapPath = this.app.apiHost+this.ajaxPath+params_id+"/"+year+"/map";
		}

		if(this.app.regionPanel.currentCamera == "LEFT") {
			mapPath = this.app.apiHost+this.ajaxPath+params_id+"/"+year+"/map-west";
		}

		if(this.app.regionPanel.currentCamera == "RIGHT") {
			mapPath = this.app.apiHost+this.ajaxPath+params_id+"/"+year+"/map-east";
		}

		return mapPath;
	}


	this.colored = function(params_id, year) {
		//$(this.CSS["LOAD"]).addClass("onShow");

		if(this.isShowed) {
			this.elements["CONTAINER"].removeClass("onShow");
		}
		$.ajax({ url: this.getColoredPath(params_id, year) }).always($.proxy(this.onGetMapLink_, this));
	}

	this.onGetMapLink_ = function(data) {
		var link = data.responseText;
		var self = this;
		var image = new Image();

        image.src = self.app.apiHost+link;

        image.onload = function() {
        	self.app.regionPanel.setBg(self.app.apiHost+link);
			self.elements["CONTAINER"].addClass("onShow");
			//$(self.CSS["LOAD"]).removeClass("onShow");
        }
	}

	this.show = function() {
		this.elements["CONTAINER"].addClass("onShow");
		this.isShowed = true;
	}

	this.hidden = function() {
		this.elements["CONTAINER"].removeClass("onShow");
		this.isShowed = false;
	}
}

/**
 * [RegionsSelector description]
 * @param {[type]} app [description]
 */
var RegionsSelectorWidget = function(app) {
	this.app = app;
	this.CSS = {
		"MAIN": "#regions-selector",
		"HIDDEN": "hidden",
		"SHOW": "#regions-nav-show",
		"DATA": "#region-data",
		"DATA-HIDDEN": "#region-data-hidden",
		"DATA-PLACE": "#region-data-place",
		"FILTER": "#region-selector-filter",
		"LOAD": "#load"
	};

	this.elements = {
		"MAIN": $(this.CSS["MAIN"]),
		"SHOW": $(this.CSS["SHOW"]),
		"DATA": $(this.CSS["DATA"]),
		"DATA-HIDDEN": $(this.CSS["DATA-HIDDEN"]),
		"DATA-PLACE": $(this.CSS["DATA-PLACE"]),
		"FILTER": $(this.CSS["FILTER"])
	}

	this.regions = {};

	this.isDataShow = false;
	this.scrollApi = null;

	this.show = function() {
		this.elements["MAIN"].removeClass(this.CSS["HIDDEN"]);
		this.initScroll_();
	}

	this.hidden = function() {
		this.elements["MAIN"].addClass(this.CSS["HIDDEN"]);
	}

	this.initScroll_ = function() {
		$(this.CSS["DATA-PLACE"]).jScrollPane(
			{
				showArrows: true,
				verticalDragMinHeight: 60,
	    		verticalDragMaxHeight: 60,
	    		autoReinitialise: true
			}
		);
		this.scrollApi = this.elements["DATA-PLACE"].data('jsp');
	}

	this.bindEvents_ = function() {
		this.elements["SHOW"].on("click", $.proxy(this.onShowClick_, this));
		this.elements["DATA-HIDDEN"].on("click", $.proxy(this.onHiddenClick_, this));
		this.elements["FILTER"].on("keyup", $.proxy(this.onFilterClick_, this));
	}

	this.onRegionClick_ = function(evt) {
		var current = $(evt.target);
		var parent = $(evt.target).parent();

		$(evt.target).toggleClass("current");

		if(current.hasClass("current")) {
			parent.find("ul a").addClass("current");
		} else {
			parent.find("ul a").removeClass("current");
		}

		$(this.CSS["LOAD"]).addClass("onShow");
		this.app.formatWidget.updateContent();
	}

	this.onRegionNameClick_ = function(evt) {
		$(evt.target).parent().find("ul").slideToggle("fast");
	}

	this.onShowClick_ = function(evt) {
		this.isDataShow = true;
		this.elements["DATA"].removeClass(this.CSS["HIDDEN"]);
		this.elements["SHOW"].addClass(this.CSS["HIDDEN"]);
	}

	this.onHiddenClick_ = function(evt) {
		this.isDataShow = false;
		this.elements["DATA"].addClass(this.CSS["HIDDEN"]);
		this.elements["SHOW"].removeClass(this.CSS["HIDDEN"]);
	}

	this.onResponseRegions_ = function(data) {
		this.regions = data;
		this.elements["DATA-PLACE"].html(this.findRegionsByParent_(data, this.app.russianId, "", ""));
		this.addChilds(data);

		this.app.paramsManager.getParamsByRegionAndAge(
			this.getCurrentIds(),
			this.app.ageSelectorFormatWidget.selectedYear
		);

		this.app.paramsSelectorWidget.updateParams(this.getCurrentIds(), this.app.ageSelectorFormatWidget.selectedYear);

		$(this.CSS["DATA-PLACE"]+ " li a").on("click", $.proxy(this.onRegionClick_, this));
		$(this.CSS["DATA-PLACE"]+ " li span").on("click", $.proxy(this.onRegionNameClick_, this));

		this.elements["FILTER"].on("keyup", $.proxy(this.onFilterClick_, this));

	}

	this.findRegionsByParent_ = function(data, parent, html, sep) {
		html += "<ul>";
		var self = this;
		$.each(data, function(key, value) {
			if(parent == value.parent_id) {
				html += '<li data-name='+value.name+' data-id="'+value.id+'"><span class="group"> '+sep+value.name+'</span><a class="current" href="#"></a></li>';
				delete data[value];
			}
		});
		html += "</ul>";
		return html;
	}

	this.getCurrentIds = function() {
		var currentsA = $(this.elements["DATA-PLACE"]).find("li a.current");
		var ids = [];

		$.each(currentsA, function(key, value) {
			ids.push($(value).parent().attr("data-id"));
		});

		return ids;
	}

	this.addChilds = function(data) {
		var self = this;
		$.each($(this.elements["DATA-PLACE"]).find("li"), function(key, value) {
			var html = self.findRegionsByParent_(data, $(value).attr("data-id"), "", " - ");
			$(value).append(html);
		});
	}

	this.onFilterClick_ = function(evt) {
		var filterValue = $(evt.target).val();

		if(filterValue.length > 0) {
			this.filteringParametrs(filterValue);
		} else {
			this.clearFilter_();
		}
	}

	this.clearFilter_ = function() {
		$(this.CSS["DATA-PLACE"]).find(".hidde").removeClass("hidde");
	}

	this.filteringParametrs = function(filterValue) {
		var elements = $(this.CSS["DATA-PLACE"]).find("ul li ul li");

		$.each(elements, function(key, value) {
			var elem = $(value).attr("data-name");
			if(elem.toLowerCase().indexOf(filterValue.toLowerCase()) == -1) {
				$(value).addClass("hidde");
			} else {
				$(value).removeClass("hidde");
			}
		});

		hiddenParentList($(this.CSS["DATA-PLACE"]).find(".jspPane > ul > li"));
	}

	this.bindEvents_();
	this.app.regionManager.getAll($.proxy(this.onResponseRegions_, this));
}

/**
 * [RegionsSelector description]
 * @param {[type]} app [description]
 */
var ParamsSelectorWidget = function(app) {
	this.app = app;
	this.CSS = {
		"MAIN": "#params-selector",
		"HIDDEN": "hidden",
		"SHOW": "#params-nav-show",
		"DATA": "#params-data",
		"DATA-HIDDEN": "#params-data-hidden",
		"DATA-PLACE": "#params-data-place",
		"LOAD": "#load"
	};

	this.elements = {
		"MAIN": $(this.CSS["MAIN"]),
		"SHOW": $(this.CSS["SHOW"]),
		"DATA": $(this.CSS["DATA"]),
		"DATA-HIDDEN": $(this.CSS["DATA-HIDDEN"]),
		"DATA-PLACE": $(this.CSS["DATA-PLACE"]),
		"FILTER":  $(this.CSS["DATA"]).find("input")
	}

	this.isDataShow = false;
	this.parametrs = {};
	this.scrollApi = null;

	this.initScroll_ = function() {
		$(this.CSS["DATA-PLACE"]).jScrollPane(
			{
				showArrows: true,
				verticalDragMinHeight: 60,
	    		verticalDragMaxHeight: 60,
	    		autoReinitialise: true
			}
		);
		this.scrollApi = this.elements["DATA-PLACE"].data('jsp');
	}

	this.show = function() {
		this.elements["MAIN"].removeClass(this.CSS["HIDDEN"]);
	}

	this.hidden = function() {
		this.elements["MAIN"].addClass(this.CSS["HIDDEN"]);
	}

	this.bindEvents_ = function() {
		this.elements["SHOW"].on("click", $.proxy(this.onShowClick_, this));
		this.elements["DATA-HIDDEN"].on("click", $.proxy(this.onHiddenClick_, this));

		$(this.CSS["DATA-PLACE"]).on("click", ".params-checkbox" , $.proxy(this.onParamClick_, this));
		$(this.CSS["DATA-PLACE"]).on("click", ".params-name", $.proxy(this.onParamNameClick_, this));

		this.elements["FILTER"].on("keyup", $.proxy(this.onFilterClick_, this));
	}

	this.onShowClick_ = function(evt) {
		this.isDataShow = true;
		this.elements["DATA"].removeClass(this.CSS["HIDDEN"]);
		this.elements["SHOW"].addClass(this.CSS["HIDDEN"]);
	}

	this.onHiddenClick_ = function(evt) {
		this.isDataShow = false;
		this.elements["DATA"].addClass(this.CSS["HIDDEN"]);
		this.elements["SHOW"].removeClass(this.CSS["HIDDEN"]);
	}

	this.onParamsGet_ = function(data) {

		this.parametrs = this.prepareParamerts_(data);
		this.drawParamets_(this.parametrs);

		this.app.formatWidget.updateContent();
	}

	this.updateParams = function(ids, age) {
		this.app.paramsManager.getParamsByRegionAndAge(
			ids,
			age,
			$.proxy(this.onParamsGet_, this)
		);
	}

	this.drawParamets_ = function(params) {
		if(!this.scrollApi) {
			this.initScroll_();
		}
		var html = "";
		var self = this;
		var contentPane = this.scrollApi.getContentPane();

		$.each(params, function(key, value) {
			var elementCurrentGroup = $("ul[data-id='"+value.id+"']", self.CSS["DATA-PLACE"]);
			if(elementCurrentGroup.size() == 0) {
				var html =  "<ul data-id='"+value.id+"' class='first'><li class='first-li'>";
					html += "<span class='group params-name params-checkbox'>"+value.name+"</span><a href='#' class='params-checkbox current'></a>";
					html += "<ul></ul></li></ul>";

				contentPane.append(html);
			}

			var elementCurrentGroup = $("ul[data-id='"+value.id+"']", self.CSS["DATA-PLACE"]);

			if(value.parameters.length > 0) {
				$.each(value.parameters, function(key2, value2) {
					var paramCurrent = $("li[data-id='"+value2.id+"']", self.CSS["DATA-PLACE"]);
					if(paramCurrent.size() == 0) {
						var html = "<li data-name='"+value2.name+"' data-id='"+value2.id+"'><span  class='param params-name '><em class='spr'>-</em> <em class='name'>"+value2.name+"</em></span><a class='params-checkbox current' href='#'></a></li>";

						elementCurrentGroup.find("ul").append(html);
					} else {
						paramCurrent.find("i").html(value2.value);
					}
				});
			}
		});
		this.scrollApi.reinitialise();
	}

	this.prepareParamerts_ = function(data) {
		var ret = {};

		$.each(data, function(key, value) {
			if(!ret[value.group_id]) {
				ret[value.group_id] = {
					id: value.group_id,
					name: value.group_name,
					parameters: []
				}
			}
			ret[value.group_id].parameters.push({
				id: value.id,
				name: value.name,
				value: value.param_val
			});
		});

		return ret;
	}

	this.onParamClick_ = function(evt) {
		var current = $(evt.target);
		var parent = $(evt.target).parent();

		$(evt.target).toggleClass("current");

		if(current.hasClass("current")) {
			parent.find("ul a").addClass("current");
		} else {
			parent.find("ul a").removeClass("current");
		}

		$(this.CSS["LOAD"]).addClass("onShow");
		this.app.formatWidget.updateContent();
	}

	this.onParamNameClick_ = function(evt) {
		$(evt.target).parent().find("ul").slideToggle("slow");
	}

	this.getCurrentIds = function() {
		var currentsA = $(this.elements["DATA-PLACE"]).find("li a.current");
		var ids = [];

		$.each(currentsA, function(key, value) {
			ids.push($(value).parent().attr("data-id"));
		});

		return ids;
	}

	this.onFilterClick_ = function(evt) {
		var filterValue = $(evt.target).val();

		if(filterValue.length > 0) {
			this.filteringParametrs(filterValue);
		} else {
			this.clearFilter_();
		}
	}

	this.clearFilter_ = function() {
		$(this.CSS["DATA-PLACE"]).find(".hidde").removeClass("hidde");
	}

	this.filteringParametrs = function(filterValue) {
		var elements = $(this.CSS["DATA-PLACE"]).find("ul li ul li");

		$.each(elements, function(key, value) {
			var elem = $(value).attr("data-name");
			if(elem.toLowerCase().indexOf(filterValue.toLowerCase()) == -1) {
				$(value).addClass("hidde");
			} else {
				$(value).removeClass("hidde");
			}
		});

		hiddenParentList($(this.CSS["PARAMETRS-LIST"]).find(".jspPane > ul > li"));
	}

	this.initScroll_();
	this.bindEvents_();
	this.app.ageSelectorFormatWidget.draw();

}

/**
 * [FormatWidget description]
 * @param {[type]} app [description]
 */
var FormatWidget = function(app) {
	this.app = app;
	this.scrollApi = null;
	this.CSS = {
		"MAIN": "#format-data",
		"HIDDEN": "hidden",
		"DATA-PLACE": "#table-format",
		"LOAD": "#load"
	}

	this.elements = {
		"MAIN": $(this.CSS["MAIN"]),
		"DATA-PLACE": $(this.CSS["DATA-PLACE"])
	}

	this.show = function() {
		this.elements["MAIN"].removeClass(this.CSS["HIDDEN"]);
	}

	this.hidden = function() {
		this.elements["MAIN"].addClass(this.CSS["HIDDEN"]);
	}

	this.updateContent = function() {
		this.app.formatManager.getFormat(
			this.app.regionsSelectorWidget.getCurrentIds(),
			this.app.paramsSelectorWidget.getCurrentIds(),
			this.app.ageSelectorFormatWidget.selectedYear,
			$.proxy(this.draw_, this)
		);
	}

	this.draw_ = function(data) {
		$(this.CSS["LOAD"]).removeClass("onShow");

		var contentPane = this.scrollApi.getContentPane();
		var self = this;
		var main = this.elements["MAIN"].find("tbody");

		main.html("");
		var html = "<tr>";
		$.each(data, function(key, value) {
			html += '<td>'+value.parameter_name+'</td><td>'+value.subject_name+'</td><td>'+value.val_numeric+'</td><td>'+value.year+'</td>';
			html += "</tr>";
		});
		main.append(html);


		self.scrollApi.reinitialise();
	}

	this.initScroll_ = function() {
		$(this.CSS["DATA-PLACE"]).jScrollPane(
			{
				showArrows: true,
				verticalDragMinHeight: 60,
	    		verticalDragMaxHeight: 60,
	    		autoReinitialise: true
			}
		);
		this.scrollApi = this.elements["DATA-PLACE"].data('jsp');
	}

	this.initScroll_();
}


/**
 * [GraphParametrsWidgets description]
 * @param {[type]} app [description]
 */
var GraphParamsSelector = function(app) {
	this.app = app;
	this.CSS = {
		"MAIN": "#graph-selector",
		"HIDDEN": "hidden",
		"SHOW": "#graph-nav-show",
		"DATA": "#graph-data",
		"DATA-HIDDEN": "#graph-data-hidden",
		"DATA-PLACE": "#graph-data-place",
		"LOAD": "#load"
	};

	this.elements = {
		"MAIN": $(this.CSS["MAIN"]),
		"SHOW": $(this.CSS["SHOW"]),
		"DATA": $(this.CSS["DATA"]),
		"DATA-HIDDEN": $(this.CSS["DATA-HIDDEN"]),
		"DATA-PLACE": $(this.CSS["DATA-PLACE"]),
		"FILTER":  $(this.CSS["DATA"]).find("input")
	}

	this.isDataShow = false;
	this.parametrs = {};
	this.scrollApi = null;
	this.onUpdateGraph = new signals.Signal();
	this.onUpdateGraph.add(OnGraphUpdateEvent);

	this.initScroll_ = function() {
		$(this.CSS["DATA-PLACE"]).jScrollPane(
			{
				showArrows: true,
				verticalDragMinHeight: 60,
	    		verticalDragMaxHeight: 60,
	    		autoReinitialise: true
			}
		);
		this.scrollApi = this.elements["DATA-PLACE"].data('jsp');
	}

	this.show = function() {
		this.elements["MAIN"].removeClass(this.CSS["HIDDEN"]);
	}

	this.hidden = function() {
		this.elements["MAIN"].addClass(this.CSS["HIDDEN"]);
	}

	this.bindEvents_ = function() {
		this.elements["SHOW"].on("click", $.proxy(this.onShowClick_, this));
		this.elements["DATA-HIDDEN"].on("click", $.proxy(this.onHiddenClick_, this));

		$(this.CSS["DATA-PLACE"]).on("click", ".graph-params-checkbox" , $.proxy(this.onParamClick_, this));
		$(this.CSS["DATA-PLACE"]).on("click", ".graph-params-name", $.proxy(this.onParamNameClick_, this));

		this.elements["FILTER"].on("keyup", $.proxy(this.onFilterClick_, this));
	}

	this.onShowClick_ = function(evt) {
		this.isDataShow = true;
		this.elements["DATA"].removeClass(this.CSS["HIDDEN"]);
		this.elements["SHOW"].addClass(this.CSS["HIDDEN"]);
	}

	this.onHiddenClick_ = function(evt) {
		this.isDataShow = false;
		this.elements["DATA"].addClass(this.CSS["HIDDEN"]);
		this.elements["SHOW"].removeClass(this.CSS["HIDDEN"]);
	}

	this.onParamsGet_ = function(data) {
		this.parametrs = this.prepareParamerts_(data);
		this.drawParamets_(this.parametrs);

		this.app.formatWidget.updateContent();
	}

	this.updateParams = function(ids, age) {
		this.app.paramsManager.getParamsByRegionAndAge(
			ids,
			age,
			$.proxy(this.onParamsGet_, this)
		);
	}

	this.drawParamets_ = function(params) {
		if(!this.scrollApi) {
			this.initScroll_();
		}
		var html = "";
		var self = this;
		var contentPane = this.scrollApi.getContentPane();

		$.each(params, function(key, value) {
			var elementCurrentGroup = $("ul[data-id='"+value.id+"']", self.CSS["DATA-PLACE"]);
			if(elementCurrentGroup.size() == 0) {
				var html =  "<ul data-id='"+value.id+"' class='first'><li class='first-li'>";
					html += "<span class='group graph-params-name'>"+value.name+"</span><a href='#' class='graph-params-checkbox'></a>";
					html += "<ul class='itemShow'></ul></li></ul>";

				contentPane.append(html);
			}

			var elementCurrentGroup = $("ul[data-id='"+value.id+"']", self.CSS["DATA-PLACE"]);

			if(value.parameters.length > 0) {
				$.each(value.parameters, function(key2, value2) {
					var paramCurrent = $("li[data-id='"+value2.id+"']", self.CSS["DATA-PLACE"]);
					if(paramCurrent.size() == 0) {
						var html = "<li data-name='"+value2.name+"' data-id='"+value2.id+"'><span  class='param params-name '><em class='spr'>-</em> <em class='name'>"+value2.name+"</em></span><a class='graph-params-checkbox' href='#'></a></li>";

						elementCurrentGroup.find("ul").append(html);
					} else {
						paramCurrent.find("i").html(value2.value);
					}
				});
			}
		});
		this.scrollApi.reinitialise();
	}

	this.prepareParamerts_ = function(data) {
		var ret = {};

		$.each(data, function(key, value) {
			if(!ret[value.group_id]) {
				ret[value.group_id] = {
					id: value.group_id,
					name: value.group_name,
					parameters: []
				}
			}
			ret[value.group_id].parameters.push({
				id: value.id,
				name: value.name,
				value: value.param_val
			});
		});

		return ret;
	}

	this.onParamClick_ = function(evt) {
		var current = $(evt.target);
		var parent = $(evt.target).parent();

		$(evt.target).toggleClass("current");

		if(current.hasClass("current")) {
			parent.find("ul a").addClass("current");
		} else {
			parent.find("ul a").removeClass("current");
		}

		$(this.CSS["LOAD"]).addClass("onShow");
		this.onUpdateGraph.dispatch(this.app);
	}

	this.onParamNameClick_ = function(evt) {
		$(evt.target).parent().find("ul").toggleClass("itemShow");
	}

	this.getCurrentIds = function() {
		var currentsA = $(this.elements["DATA-PLACE"]).find("li a.current");
		var ids = [];

		$.each(currentsA, function(key, value) {
			ids.push($(value).parent().attr("data-id"));
		});

		return ids;
	}

	this.onFilterClick_ = function(evt) {
		var filterValue = $(evt.target).val();

		if(filterValue.length > 0) {
			this.filteringParametrs(filterValue);
		} else {
			this.clearFilter_();
		}
	}

	this.clearFilter_ = function() {
		$(this.CSS["DATA-PLACE"]).find(".hidde").removeClass("hidde");
	}

	this.filteringParametrs = function(filterValue) {
		var elements = $(this.CSS["DATA-PLACE"]).find("ul li ul li");

		$.each(elements, function(key, value) {
			var elem = $(value).attr("data-name");
			if(elem.toLowerCase().indexOf(filterValue.toLowerCase()) == -1) {
				$(value).addClass("hidde");
			} else {
				$(value).removeClass("hidde");
			}
		});

		hiddenParentList($(this.CSS["PARAMETRS-LIST"]).find(".jspPane > ul > li"));
	}

	this.onResponseRegions_ = function(regions) {
		var ids = [];
		$.each(regions, function(key, value) {
			ids.push(value.id);
		});
		this.updateParams(ids, 2014);
	}

	this.initScroll_();
	this.bindEvents_();

	this.app.regionsManagerLocal.getRegions($.proxy(this.onResponseRegions_, this));
	this.app.ageSelectorFormatWidget.draw();
}


var cubeReports = [];

/**
 * [GraphParametrsWidgets description]
 * @param {[type]} app [description]
 */
var ReportsParamsSelector = function(app) {
	this.app = app;
	this.CSS = {
		"MAIN": "#reports-params-selector",
		"HIDDEN": "hidden",
		"SHOW": "#graph-nav-show",
		"DATA": "#reports-params-data-place",
		"DATA-HIDDEN": "#graph-data-hidden",
		"DATA-PLACE": "#reports-params-data-place",
		"LOAD": "#load",
		"FILTER": "#fff",
		"AGE-SELECT": "#reposrts-params-age-selected"
	};

	this.elements = {
		"MAIN": $(this.CSS["MAIN"]),
		"SHOW": $(this.CSS["SHOW"]),
		"DATA": $(this.CSS["DATA"]),
		"DATA-HIDDEN": $(this.CSS["DATA-HIDDEN"]),
		"DATA-PLACE": $(this.CSS["DATA-PLACE"]),
		"AGE-SELECT": $(this.CSS["AGE-SELECT"]),
		"FILTER":  $(this.CSS["FILTER"])
	}

	this.isDataShow = false;
	this.parametrs = {};
	this.scrollApi = null;
	this.onUpdateGraph = new signals.Signal();
	this.onUpdateGraph.add(OnGraphUpdateEvent);

	this.initScroll_ = function() {
		$(this.CSS["DATA-PLACE"]).jScrollPane(
			{
				showArrows: true,
				verticalDragMinHeight: 60,
	    		verticalDragMaxHeight: 60,
	    		autoReinitialise: true
			}
		);
		this.scrollApi = this.elements["DATA-PLACE"].data('jsp');
	}

	this.show = function() {
		this.elements["MAIN"].removeClass(this.CSS["HIDDEN"]);
	}

	this.hidden = function() {
		this.elements["MAIN"].addClass(this.CSS["HIDDEN"]);
	}

	this.bindEvents_ = function() {
		var self = this;
		this.elements["SHOW"].on("click", $.proxy(this.onShowClick_, this));
		this.elements["DATA-HIDDEN"].on("click", $.proxy(this.onHiddenClick_, this));

		$(this.CSS["DATA-PLACE"]).on("click", ".graph-params-checkbox" , $.proxy(this.onParamClick_, this));
		$(this.CSS["DATA-PLACE"]).on("click", ".graph-params-name", $.proxy(this.onParamNameClick_, this));


  		this.app.ageSelectorReportsWidget.onAfterYearSelected = $.proxy(this.onYearChanged, this)


		this.elements["FILTER"].keyup(function() {
			var filterValue = self.elements["FILTER"].val();

			if(filterValue.length > 0) {
				var elements = $(self.CSS["DATA"]).find("li")
				$.each(elements, function(key, value) {
					var elem = $(value).attr("data-name");
					if(elem.toLowerCase().indexOf(filterValue.toLowerCase()) == -1) {
						$(value).addClass("hidde");
					} else {
						$(value).removeClass("hidde");
					}
				});
			} else {
				self.clearFilter_();
			}
		});
	}

	this.onShowClick_ = function(evt) {
		this.isDataShow = true;
		this.elements["DATA"].removeClass(this.CSS["HIDDEN"]);
		this.elements["SHOW"].addClass(this.CSS["HIDDEN"]);
	}

	this.onHiddenClick_ = function(evt) {
		this.isDataShow = false;
		this.elements["DATA"].addClass(this.CSS["HIDDEN"]);
		this.elements["SHOW"].removeClass(this.CSS["HIDDEN"]);
	}

	this.onParamsGet_ = function(data) {
		this.parametrs = this.prepareParamerts_(data);
		this.drawParamets_(this.parametrs);

		this.app.formatWidget.updateContent();
	}

	this.updateParams = function(ids, age) {
		this.app.paramsManager.getParamsByRegionAndAge(
			ids,
			age,
			$.proxy(this.onParamsGet_, this)
		);
	}

	this.drawParamets_ = function() {
		if(!this.scrollApi) {
			this.initScroll_();
		}
		var html = "";
		var self = this;
		var contentPane = this.scrollApi.getContentPane();

		params = [
			{
				id: "1",
				name: "Заболеваемость всего населения по классам, группам болезней и отдельным заболеваниям с диагнозом, установленным впервые в жизни, по субъектам Российской Федерации за 2011-2012гг",
				link: "/static/pdf/1.pdf"
			},
			{
				id: "2",
				name: "Сведения о параметрах реализации приоритетного национального проекта 'Здоровье' Министерство здравоохранения и социального развития Российской Федерации на 1 апреля 2012 г.",
				link: "/static/pdf/2.pdf"
			},
			{
				id: "3",
				name: "Демографическая ситуация",
				link: "/static/pdf/3.pdf"
			},
			{
				id: "4",
				name: "Занятость и оплата труда в здравоохранении, подготовка кадров",
				link: "/static/pdf/4.pdf"
			},
			{
				id: "5",
				name: "Инвалидность населения",
				link: "/static/pdf/5.pdf"
			},
			{
				id: "6",
				name: "Основные экономические показатели здравоохранения",
				link: "/static/pdf/6.pdf"
			},
			{
				id: "7",
				name: "Отдых, физическая культура и спорт",
				link: "/static/pdf/7.pdf"
			},
			{
				id: "8",
				name: "Ресурсы и деятельность организаций здравоохранения",
				link: "/static/pdf/8.pdf"
			},
			{
				id: "9",
				name: "Состояние здоровья населения",
				link: "/static/pdf/9.pdf"
			},
			{
				id: "10",
				name: "Состояние здоровья городского и сельского населения",
				link: "/static/pdf/10.pdf"
			},
			{
				id: "11",
				name: "Условия жизни населения",
				link: "/static/pdf/11.pdf"
			}
		];

		for(var i = 0; i < cubeReports.length; i++)
		{
			params.push(cubeReports[i]);
		}

		params = cubeReports;

		$.each(params, function(key, value) {
			var elementCurrentGroup = $("ul[data-id='"+value.id+"']", self.CSS["DATA-PLACE"]);
			if(elementCurrentGroup.size() == 0) {
				if(value.is_arm) value.link = "/arm/cube_reports/" + value.id + ".pdf";
				var html =  "<ul data-id='"+value.id+"' class='first'><li data-name='"+value.name+"' data-time='"+value.created_at+"'>";
					html += "<span is_arm="+value.is_arm+" link="+value.link+" report_id=" + value.id + " class='link_click_pdf graph-params-name'>"+value.name+"</span>";

				contentPane.append(html);
			}
		});

		$(".link_click_pdf").on("click", function() {
			$(self.CSS["LOAD"]).addClass("onShow");
			var self2 = this;
			setTimeout(function() {
				$(self.CSS["LOAD"]).removeClass("onShow");
				self.app.reportsWidget.show();

				$("#report-pdf h2").html($(self2).html());
			//	alert(SETTINGS_CONFIG['cube_host']);
				if($(self2).attr("is_arm") == "true") $("#report-pdf-in").html('<object width="100%" type="application/pdf" height="670px" src="'+$(self2).attr("link")+'""></object>');
				else $("#report-pdf-in").html('<iframe src="'+ConfigApp["CUBES_SERVER"]+'/reports/'+$(self2).attr("report_id") +'" style="width:97%;height:650px; display:inline;"></iframe>');

				$("#reports-data").hide();
				$("#reports-panel").hide();
				$("#report-pdf").show();
			}, 500);
		});

		this.scrollApi.reinitialise();
		this.onYearChanged();
	}

	this.prepareParamerts_ = function(data) {
		var ret = {};

		$.each(data, function(key, value) {
			if(!ret[value.group_id]) {
				ret[value.group_id] = {
					id: value.group_id,
					name: value.group_name,
					parameters: []
				}
			}
			ret[value.group_id].parameters.push({
				id: value.id,
				name: value.name,
				value: value.param_val
			});
		});

		return ret;
	}

	this.onParamClick_ = function(evt) {
		var current = $(evt.target);
		var parent = $(evt.target).parent();

		$(evt.target).toggleClass("current");

		if(current.hasClass("current")) {
			parent.find("ul a").addClass("current");
		} else {
			parent.find("ul a").removeClass("current");
		}

		$(this.CSS["LOAD"]).addClass("onShow");
		this.onUpdateGraph.dispatch(this.app);
	}

	this.onParamNameClick_ = function(evt) {
		$(evt.target).parent().find("ul").toggleClass("itemShow");
	}

	this.getCurrentIds = function() {
		var currentsA = $(this.elements["DATA-PLACE"]).find("li a.current");
		var ids = [];

		$.each(currentsA, function(key, value) {
			ids.push($(value).parent().attr("data-id"));
		});

		return ids;
	}

	this.onFilterClick_ = function(evt) {
		var filterValue = $(evt.target).val();

		if(filterValue.length > 0) {
			this.filteringParametrs(filterValue);
		} else {
			this.clearFilter_();
		}
	}

	this.clearFilter_ = function() {
		$(this.CSS["DATA-PLACE"]).find(".hidde").removeClass("hidde");
	}

	this.filteringParametrs = function(filterValue) {


		var elements = $(this.CSS["DATA-PLACE"]).find("ul li ul li");

		$.each(elements, function(key, value) {
			var elem = $(value).attr("data-name");
			if(elem.toLowerCase().indexOf(filterValue.toLowerCase()) == -1) {
				$(value).addClass("hidde");
			} else {
				$(value).removeClass("hidde");
			}
		});

		hiddenParentList($(this.CSS["PARAMETRS-LIST"]).find(".jspPane > ul > li"));
	}


	this.onYearChanged = function()
	{
		var year = this.app.ageSelectorReportsWidget.selectedYear;

		var elements = $(this.elements["DATA-PLACE"]).find("li");

		$.each(elements, function(key, value)
		{
			var elem = $(value).attr("data-time");
			if(elem.substring(0, 4) != year)
				$(value).addClass("hidde");
			else $(value).removeClass("hidde");
		});
	}


	this.onResponseRegions_ = function(regions) {
		var ids = [];
		$.each(regions, function(key, value) {
			ids.push(value.id);
		});
		this.updateParams(ids, 2012);
	}

	this.initScroll_();
	this.bindEvents_();

	this.drawParamets_();
	this.app.ageSelectorReportsWidget.draw();
}

/**
 * [GraphParametrsWidgets description]
 * @param {[type]} app [description]
 */
var ReportsDiscSelector = function(app) {
	this.app = app;
	this.CSS = {
		"MAIN": "#reports-disc-selector",
		"HIDDEN": "hidden",
		"SHOW": "#graph-nav-show",
		"DATA": "#reports-disc-data-place",
		"DATA-HIDDEN": "#graph-data-hidden",
		"DATA-PLACE": "#reports-disc-data-place",
		"LOAD": "#load",
		"FILTER": "#ff",
		"AGE-SELECT": "#reposrts-disc-age-selected"
	};

	this.elements = {
		"MAIN": $(this.CSS["MAIN"]),
		"SHOW": $(this.CSS["SHOW"]),
		"DATA": $(this.CSS["DATA"]),
		"DATA-HIDDEN": $(this.CSS["DATA-HIDDEN"]),
		"DATA-PLACE": $(this.CSS["DATA-PLACE"]),
		"AGE-SELECT": $(this.CSS["AGE-SELECT"]),
		"FILTER":  $(this.CSS["FILTER"])
	}

	this.isDataShow = false;
	this.parametrs = {};
	this.scrollApi = null;
	this.onUpdateGraph = new signals.Signal();
	this.onUpdateGraph.add(OnGraphUpdateEvent);

	this.clearFilter_ = function() {
		$(this.CSS["PARAMETRS-LIST"]).find(".hidde").removeClass("hidde");
	}

	this.initScroll_ = function() {
		$(this.CSS["DATA-PLACE"]).jScrollPane(
			{
				showArrows: true,
				verticalDragMinHeight: 60,
	    		verticalDragMaxHeight: 60,
	    		autoReinitialise: true
			}
		);
		this.scrollApi = this.elements["DATA-PLACE"].data('jsp');
	}

	this.show = function() {
		this.elements["MAIN"].removeClass(this.CSS["HIDDEN"]);
	}

	this.hidden = function() {
		this.elements["MAIN"].addClass(this.CSS["HIDDEN"]);
	}

	this.bindEvents_ = function() {
		var self = this;

		$(this.CSS["DATA-PLACE"]).on("click", ".graph-params-name", $.proxy(this.onParamNameClick_, this));

		this.elements["FILTER"].keyup(function() {
			var filterValue = self.elements["FILTER"].val();

			if(filterValue.length > 0) {
				var elements = $(self.CSS["DATA"]).find("li");
				$.each(elements, function(key, value) {
					var elem = $(value).attr("data-name");
					if(elem.toLowerCase().indexOf(filterValue.toLowerCase()) == -1) {
						$(value).addClass("hidde");
					} else {
						$(value).removeClass("hidde");
					}
				});
			} else {
				self.clearFilter_();
			}
		});
	}

	this.onShowClick_ = function(evt) {
		this.isDataShow = true;
		this.elements["DATA"].removeClass(this.CSS["HIDDEN"]);
		this.elements["SHOW"].addClass(this.CSS["HIDDEN"]);
	}

	this.onHiddenClick_ = function(evt) {
		this.isDataShow = false;
		this.elements["DATA"].addClass(this.CSS["HIDDEN"]);
		this.elements["SHOW"].removeClass(this.CSS["HIDDEN"]);
	}

	this.onParamsGet_ = function(data) {
		this.parametrs = this.prepareParamerts_(data);
		this.drawParamets_(this.parametrs);

		this.app.formatWidget.updateContent();
	}

	this.updateParams = function(ids, age) {
		this.app.paramsManager.getParamsByRegionAndAge(
			ids,
			age,
			$.proxy(this.onParamsGet_, this)
		);
	}

	this.drawParamets_ = function(params) {
		if(!this.scrollApi) {
			this.initScroll_();
		}
		var html = "";
		var self = this;
		var contentPane = this.scrollApi.getContentPane();

		$.each(params, function(key, value) {
			var elementCurrentGroup = $("ul[data-id='"+value.id+"']", self.CSS["DATA-PLACE"]);
			if(elementCurrentGroup.size() == 0) {
				var html =  "<ul data-id='"+value.id+"' class='first'><li data-name='"+value.name+"'>";
					html += "<span class=' graph-params-name'>"+value.name+"</span>";
					html += "<ul class='itemShow'></ul></li></ul>";

				contentPane.append(html);
			}
		});
		this.scrollApi.reinitialise();
	}

	this.prepareParamerts_ = function(data) {
		var ret = {};

		$.each(data, function(key, value) {
			if(!ret[value.group_id]) {
				ret[value.group_id] = {
					id: value.group_id,
					name: value.group_name,
					parameters: []
				}
			}
			ret[value.group_id].parameters.push({
				id: value.id,
				name: value.name,
				value: value.param_val
			});
		});

		return ret;
	}

	this.onParamClick_ = function(evt) {
		var current = $(evt.target);
		var parent = $(evt.target).parent();
		$(evt.target).toggleClass("current");

		if(current.hasClass("current")) {
			parent.find("ul a").addClass("current");
		} else {
			parent.find("ul a").removeClass("current");
		}

		$(this.CSS["LOAD"]).addClass("onShow");
	}

	this.onParamNameClick_ = function(evt) {
		var current = $(evt.target);
		var parent = $(evt.target).parent();
		var id = parent.parent().attr("data-id");

		$("#reports-panel").show();
		$("#report-pdf").hide();
		$("#reports-panel h2").html($(evt.target).html());

		this.app.reportsWidget.show();
		this.app.reportsWidget.update(id);
	}

	this.getCurrentIds = function() {
		var currentsA = $(this.elements["DATA-PLACE"]).find("li a.current");
		var ids = [];

		$.each(currentsA, function(key, value) {
			ids.push($(value).parent().attr("data-id"));
		});

		return ids;
	}

	this.onFilterClick_ = function(evt) {
		var filterValue = $(evt.target).val();

		if(filterValue.length > 0) {
			this.filteringParametrs(filterValue);
		} else {
			this.clearFilter_();
		}
	}

	this.clearFilter_ = function() {
		$(this.CSS["DATA-PLACE"]).find(".hidde").removeClass("hidde");
	}

	this.filteringParametrs = function(filterValue) {
		var elements = $(this.CSS["DATA-PLACE"]).find("ul li ul li");

		$.each(elements, function(key, value) {
			var elem = $(value).attr("data-name");
			if(elem.toLowerCase().indexOf(filterValue.toLowerCase()) == -1) {
				$(value).addClass("hidde");
			} else {
				$(value).removeClass("hidde");
			}
		});

		hiddenParentList($(this.CSS["PARAMETRS-LIST"]).find(".jspPane > ul > li"));
	}

	this.initScroll_();
	this.bindEvents_();

	this.app.dictionaryManager.getAll($.proxy(this.drawParamets_, this));
}


/**
 * [GraphRegionsSelectorWidget description]
 * @param {[type]} app [description]
 */
var GraphRegionsSelectorWidget = function(app) {
	this.app = app;
	this.CSS = {
		"MAIN": "#graph-regions-selector",
		"HIDDEN": "hidden",
		"SHOW": "#graph-regions-nav-show",
		"DATA": "#graph-region-data",
		"DATA-HIDDEN": "#graph-region-data-hidden",
		"DATA-PLACE": "#graph-region-data-place",
		"FILTER": "#graph-region-selector-filter",
		"LOAD": "#load"
	};

	this.elements = {
		"MAIN": $(this.CSS["MAIN"]),
		"SHOW": $(this.CSS["SHOW"]),
		"DATA": $(this.CSS["DATA"]),
		"DATA-HIDDEN": $(this.CSS["DATA-HIDDEN"]),
		"DATA-PLACE": $(this.CSS["DATA-PLACE"]),
		"FILTER": $(this.CSS["FILTER"])
	}

	this.regions = {};

	this.isDataShow = false;
	this.scrollApi = null;
	this.onUpdateGraph = new signals.Signal();
	this.onUpdateGraph.add(OnGraphUpdateEvent);

	this.show = function() {
		this.elements["MAIN"].removeClass(this.CSS["HIDDEN"]);
		this.initScroll_();
	}

	this.hidden = function() {
		this.elements["MAIN"].addClass(this.CSS["HIDDEN"]);
	}

	this.initScroll_ = function() {
		$(this.CSS["DATA-PLACE"]).jScrollPane(
			{
				showArrows: true,
				verticalDragMinHeight: 60,
	    		verticalDragMaxHeight: 60,
	    		autoReinitialise: true
			}
		);
		this.scrollApi = this.elements["DATA-PLACE"].data('jsp');
	}

	this.bindEvents_ = function() {
		this.elements["SHOW"].on("click", $.proxy(this.onShowClick_, this));
		this.elements["DATA-HIDDEN"].on("click", $.proxy(this.onHiddenClick_, this));
	}

	this.onRegionClick_ = function(evt) {
		var current = $(evt.target);
		var parent = $(evt.target).parent();

		$(evt.target).toggleClass("current");

		if(current.hasClass("current")) {
			parent.find("ul a").addClass("current");
		} else {
			parent.find("ul a").removeClass("current");
		}

		$(this.CSS["LOAD"]).addClass("onShow");
		this.onUpdateGraph.dispatch(this.app);
	}

	this.onRegionNameClick_ = function(evt) {
		$(evt.target).parent().find("ul").toggleClass("itemShow");
	}

	this.onShowClick_ = function(evt) {
		this.isDataShow = true;
		this.elements["DATA"].removeClass(this.CSS["HIDDEN"]);
		this.elements["SHOW"].addClass(this.CSS["HIDDEN"]);
	}

	this.onHiddenClick_ = function(evt) {
		this.isDataShow = false;
		this.elements["DATA"].addClass(this.CSS["HIDDEN"]);
		this.elements["SHOW"].removeClass(this.CSS["HIDDEN"]);
	}

	this.onResponseRegions_ = function(data) {
		this.regions = data;
		this.elements["DATA-PLACE"].html(this.findRegionsByParent_(data, this.app.russianId, "", ""));
		this.addChilds(data);

		$(this.CSS["DATA-PLACE"]+ " li a").on("click", $.proxy(this.onRegionClick_, this));
		$(this.CSS["DATA-PLACE"]+ " li span").on("click", $.proxy(this.onRegionNameClick_, this));

		this.elements["FILTER"].on("keyup", $.proxy(this.onFilterClick_, this));
	}

	this.findRegionsByParent_ = function(data, parent, html, sep) {
		html += "<ul>";
		var self = this;
		$.each(data, function(key, value) {
			if(parent == value.parent_id) {
				html += '<li data-name='+value.name+' data-id="'+value.id+'"><span class="group"> '+sep+value.name+'</span><a href="#"></a></li>';
				delete data[value];
			}
		});
		html += "</ul>";
		return html;
	}

	this.getCurrentIds = function() {
		var currentsA = $(this.elements["DATA-PLACE"]).find("li a.current");
		var ids = [];

		$.each(currentsA, function(key, value) {
			ids.push($(value).parent().attr("data-id"));
		});

		return ids;
	}

	this.addChilds = function(data) {
		var self = this;
		$.each($(this.elements["DATA-PLACE"]).find("li"), function(key, value) {
			var html = self.findRegionsByParent_(data, $(value).attr("data-id"), "", " - ");
			$(value).append(html);
		});
	}

	this.onFilterClick_ = function(evt) {
		var filterValue = $(evt.target).val();

		if(filterValue.length > 0) {
			this.filteringParametrs(filterValue);
		} else {
			this.clearFilter_();
		}
	}

	this.clearFilter_ = function() {
		$(this.CSS["DATA-PLACE"]).find(".hidde").removeClass("hidde");
	}

	this.filteringParametrs = function(filterValue) {
		var elements = $(this.CSS["DATA-PLACE"]).find("ul li ul li");
		$.each(elements, function(key, value) {
			var elem = $(value).attr("data-name");
			if(elem.toLowerCase().indexOf(filterValue.toLowerCase()) == -1) {
				$(value).addClass("hidde");
			} else {
				$(value).removeClass("hidde");
			}
		});

		hiddenParentList($(this.CSS["PARAMETRS-LIST"]).find(".jspPane > ul > li"));
	}

	this.bindEvents_();
	this.app.regionsManagerLocal.getRegions($.proxy(this.onResponseRegions_, this));
}

/**
 * [GraphWidget description]
 * @param {[type]} app [description]
 */
var GraphWidget = function(app) {
	this.app = app;
	this.scrollApi = null;
	this.onUpdateGraph = new signals.Signal();
	this.onUpdateGraph.add(OnGraphUpdateEvent);

	this.CSS = {
		"MAIN": "#graph-content",
		"HIDDEN": "hidden",
		"LOAD": "#load",
		"GRAPH": "#graph-panel",
		"DATES": "#graph-datas",
		"DATA-BEGIN": "#graph-datas-begin",
		"DATA-END": "#graph-datas-end",
		"BUTTONS": ".buttoms"
	}

	this.elements = {
		"MAIN": $(this.CSS["MAIN"]),
		"DATA-BEGIN": $(this.CSS["DATA-BEGIN"]),
		"DATA-END": $(this.CSS["DATA-END"]),
		"GRAPH": $(this.CSS["GRAPH"]),
		"BUTTONS": $(this.CSS["BUTTONS"], this.CSS["MAIN"])
	}

	var self = this;
	this.ustav = false;

	$("#check-chech").on("click", function() {
		$(this).toggleClass("current");
		self.ustav = !self.ustav;

		$(self.app.graphWidget.CSS["LOAD"]).addClass("onShow");

		self.app.graphManager.getGraph(
			self.app.graphRegionsSelectorWidget.getCurrentIds(),
			self.app.graphParamsSelector.getCurrentIds(),
			self.app.graphWidget.getBeginData(),
			self.app.graphWidget.getEndData(),
			function(data) {
				$(self.app.graphWidget.CSS["LOAD"]).removeClass("onShow");
				self.app.graphWidget.showGraph();
				self.app.graphWidget.updateContent(data);
				$(self.app.graphWidget.CSS["LOAD"]).removeClass("onShow");
			}
		);
	});

	this.elements["DATA-BEGIN"].on("keyup", function() {
		$(self.app.graphWidget.CSS["LOAD"]).addClass("onShow");

		self.app.graphManager.getGraph(
			self.app.graphRegionsSelectorWidget.getCurrentIds(),
			self.app.graphParamsSelector.getCurrentIds(),
			self.app.graphWidget.getBeginData(),
			self.app.graphWidget.getEndData(),
			function(data) {
				$(self.app.graphWidget.CSS["LOAD"]).removeClass("onShow");
				self.app.graphWidget.showGraph();
				self.app.graphWidget.updateContent(data);
				$(self.app.graphWidget.CSS["LOAD"]).removeClass("onShow");
			}
		);
	});

	this.elements["DATA-END"].on("keyup", function() {
		$(self.app.graphWidget.CSS["LOAD"]).addClass("onShow");

		self.app.graphManager.getGraph(
			self.app.graphRegionsSelectorWidget.getCurrentIds(),
			self.app.graphParamsSelector.getCurrentIds(),
			self.app.graphWidget.getBeginData(),
			self.app.graphWidget.getEndData(),
			function(data) {
				$(self.app.graphWidget.CSS["LOAD"]).removeClass("onShow");
				self.app.graphWidget.showGraph();
				self.app.graphWidget.updateContent(data);
				$(self.app.graphWidget.CSS["LOAD"]).removeClass("onShow");
			}
		);
	});

	$(".navss").on("click", function() {
		var ids = $(this).attr("ids");
		var state = $(this).attr("state");
		var currentValue = parseInt($("#"+ids).val());

		if(state == 1) {
			$("#"+ids).val(currentValue - 1);
		}
		if(state == 2) {
			$("#"+ids).val(currentValue + 1);
		}

		$(self.app.graphWidget.CSS["LOAD"]).addClass("onShow");

		self.app.graphManager.getGraph(
			self.app.graphRegionsSelectorWidget.getCurrentIds(),
			self.app.graphParamsSelector.getCurrentIds(),
			self.app.graphWidget.getBeginData(),
			self.app.graphWidget.getEndData(),
			function(data) {
				$(self.app.graphWidget.CSS["LOAD"]).removeClass("onShow");
				self.app.graphWidget.showGraph();
				self.app.graphWidget.updateContent(data);
				$(self.app.graphWidget.CSS["LOAD"]).removeClass("onShow");
			}
		);
	});

	this.onUpdateGraphDispather_ = function() {
		this.onUpdateGraph.dispatch(this.app);
	}

	this.show = function() {
		this.elements["MAIN"].removeClass(this.CSS["HIDDEN"]);
	}

	this.hidden = function() {
		this.elements["MAIN"].addClass(this.CSS["HIDDEN"]);
	}

	this.bindEvents_ = function() {
		$("li", this.elements["BUTTONS"]).on("click", $.proxy(this.onButtonClick_, this));
	}

	this.state = 1;

	this.onButtonClick_ = function(e) {
		var el = $(e.target);
		el.parent().find("li").removeClass("current");
		el.addClass("current");

		if(el.hasClass("graph_button")) {
			$(".flot-base, .flot-text, .flot-overlay").show();
			$("#graph-content .legend").hide();
			this.state = 1;
		} else {
			$(".flot-base, .flot-text, .flot-overlay").hide();
			$("#graph-content .legend").css("width", "100%").show();
			this.state = 2;
		}
	}

	this.showGraph = function() {
		$(".legend_button").removeClass("current");
		$(".graph_button").addClass("current");
		$(".flot-base, .flot-text, .flot-overlay").show();
		$("#graph-content .legend").hide();
		this.state = 1;
	}

	this.testState_ = function() {
		if(this.state = 1) {
			$(".flot-base, .flot-text, .flot-overlay").show();
			$("#graph-content .legend").hide();
		} else {
			$(".flot-base, .flot-text, .flot-overlay").hide();
			$("#graph-content .legend").css("width", "100%").show();
		}
	}

	this.updateContent = function(data) {
		var self = this;
		var lines = [];
		var options = {
		    series: {
		        lines: { show: true },
		        points: { show: true }
		    },
		    legend: {
			    show: true,
			    backgroundOpacity: 0,
			    backgroundColor: null
			},
			grid: {
				color: "rgba(255, 255, 255, 0.5)"
			},
			xaxis: {
				tickColor: "rgba(255, 255, 255, 0.5)",
				mode: "time",
				timeformat: "%Y",
				minTickSize: [1, "year"]
			},
			yaxis: {
				tickColor: "rgba(255, 255, 255, 0.5)"
			}
		};

		$.each(data, function(key, value) {
			if(key != "param_levels") {
				$.each(value.subjects, function(key2, value2) {
					var dataLine = {};
					var line = [];

					$.each(value2.vals_numeric, function(key3, value3) {
						var d = new Date("01/12/"+parseInt(key3.toString().slice(0, 4)));
						var point = [d.getTime(), value3];
						line.push(point);
					});

					dataLine["label"] = value.param_name+"<br/> <i>"+value2.subject_name+"</i>";
					dataLine["data"] = line;

					lines.push(dataLine);
				});
			} else {
				if(self.ustav) {
					var dataLine1 = {};
					var line1 = [];

					var d = new Date("01/12/"+self.getBeginData());
					var point = [d.getTime(), value["#7fff7f_down_level"]];
					line1.push(point);

					var d = new Date("01/12/"+self.getEndData());
					var point = [d.getTime(), value["#7fff7f_down_level"]];
					line1.push(point);

					dataLine1["label"] = "";
					dataLine1["data"] = line1;
					dataLine1["color"] = "rgba(0, 255, 0, 0.7)";

					lines.push(dataLine1);

					var dataLine2 = {};
					var line2 = [];

					var d = new Date("01/12/"+self.getBeginData());
					var point = [d.getTime(), value["#7fff7f_up_level"]];
					line2.push(point);

					var d = new Date("01/12/"+self.getEndData());
					var point = [d.getTime(), value["#7fff7f_up_level"]];
					line2.push(point);

					dataLine2["label"] = "";
					dataLine2["data"] = line2;
					dataLine2["color"] = "rgba(0, 255, 0, 0.7)";

					console.log(dataLine2);

					lines.push(dataLine2);

					var dataLine3 = {};
					var line3 = [];

					var d = new Date("01/12/"+self.getBeginData());
					var point = [d.getTime(), value["#ff7f7f_down_level"]];
					line3.push(point);

					var d = new Date("01/12/"+self.getEndData());
					var point = [d.getTime(), value["#ff7f7f_down_level"]];
					line3.push(point);

					dataLine3["label"] = "";
					dataLine3["data"] = line3;
					dataLine3["color"] = "rgba(255, 0, 0, 0.7)";

					lines.push(dataLine3);

					var dataLine4 = {};
					var line4 = [];

					var d = new Date("01/12/"+self.getBeginData());
					var point = [d.getTime(), value["#ff7f7f_up_level"]];
					line4.push(point);

					var d = new Date("01/12/"+self.getEndData());
					var point = [d.getTime(), value["#ff7f7f_up_level"]];
					line4.push(point);

					dataLine4["label"] = "";
					dataLine4["data"] = line4;
					dataLine4["color"] = "rgba(255, 0, 0, 0.7)";

					lines.push(dataLine4);

					var dataLine5 = {};
					var line5 = [];

					var d = new Date("01/12/"+self.getBeginData());
					var point = [d.getTime(), value["#ffff7f_down_level"]];
					line5.push(point);

					var d = new Date("01/12/"+self.getEndData());
					var point = [d.getTime(), value["#ffff7f_down_level"]];
					line5.push(point);

					dataLine5["label"] = "";
					dataLine5["data"] = line5;
					dataLine5["color"] = "rgba(255, 255, 0, 0.7)";

					lines.push(dataLine5);

					var dataLine6 = {};
					var line6 = [];

					var d = new Date("01/12/"+self.getBeginData());
					var point = [d.getTime(), value["#ffff7f_up_level"]];
					line6.push(point);

					var d = new Date("01/12/"+self.getEndData());
					var point = [d.getTime(), value["#ffff7f_up_level"]];
					line6.push(point);

					dataLine6["label"] = "";
					dataLine6["data"] = line6;
					dataLine6["color"] = "rgba(255, 255, 0, 0.7)";

					lines.push(dataLine6);
				}
			}
		});

		$.plot(this.elements["GRAPH"], lines, options);


		$("#graph-panel .legend").jScrollPane(
			{
				showArrows: true,
				verticalDragMinHeight: 60,
	    		verticalDragMaxHeight: 60
			}
		);

		this.testState_();
	}

	this.getBeginData = function() {
		return this.elements["DATA-BEGIN"].val();
	}

	this.getEndData = function() {
		return this.elements["DATA-END"].val();
	}

	this.bindEvents_();
}

/**
 * [GraphWidget description]
 * @param {[type]} app [description]
 */
var ReportsWidget = function(app) {
	this.app = app;
	this.scrollApi = null;

	this.CSS = {
		"MAIN": "#reports-content",
		"HIDDEN": "hidden",
		"LOAD": "#load",
		"DATA-PLACE": "#reports-panel",
		"DATES": "#reports-datas"
	}

	this.selectedId = null;

	this.elements = {
		"MAIN": $(this.CSS["MAIN"]),
		"DATA-BEGIN": $(this.CSS["DATA-BEGIN"]),
		"DATA-END": $(this.CSS["DATA-END"]),
		"DATA-PLACE": $(this.CSS["DATA-PLACE"]),
		"BUTTONS": $(this.CSS["BUTTONS"], this.CSS["MAIN"])
	}

	$("#reports-data .close").on("click", function() {
		$("#reports-data").hide();
		$("#reports-panel").show();
	})

	this.show = function() {
		this.elements["MAIN"].removeClass(this.CSS["HIDDEN"]);
	}

	this.hidden = function() {
		this.elements["MAIN"].addClass(this.CSS["HIDDEN"]);
	}

	this.showGraph = function() {
		$(".legend_button").removeClass("current");
		$(".graph_button").addClass("current");
		$(".flot-base, .flot-text, .flot-overlay").show();
		$("#graph-content .legend").hide();
		this.state = 1;
	}

	this.getSubjectCallback_ = function(data) {
		$("#reports-data").show();
		$("#reports-panel").hide();

		var contentPane = $("#reports-data").data('jsp').getContentPane();
		var main = this.app.reportsWidget.elements["MAIN"].find("#reports-data .cont tbody");

		main.html("");

		var html = "<tr>";
		html += '<td><strong>Административный центр</strong></td><td>'+data.capital_name+'</td>';
		html += '</tr><tr>';
		html += '<td><strong>Руководитель МЗ региона</strong></td><td>'+data.head_name+'</td>';
		html += '</tr><tr>';
		html += '<td><strong>Телефон руководителя</strong></td><td>'+data.head_phone+'</td>';
		html += '</tr><tr>';
		html += '<td><strong>Заместитель руководителя МЗ региона</strong></td><td>'+data.deputy_head_name+'</td>';
		html += '</tr><tr>';
		html += '<td><strong>Телефон заместителя</strong></td><td>'+data.deputy_head_phone+'</td>';
		html += '</tr><tr>';
		html += '<td><strong>Население</strong></td><td>'+data.population+'</td>';
		html += "</tr>";

		main.append(html);
		$("#reports-data").data('jsp').reinitialise();
	}

	this.getSubjectTableCallback_ = function(data) {
		$("#reports-data").show();
		$("#reports-panel").hide();

		var contentPane = $("#reports-data").data('jsp').getContentPane();
		var main = this.app.reportsWidget.elements["MAIN"].find("#reports-data .tt");

		main.html("");

		var html = "";
		$.each(data, function(i, v) {
			if(!v.param_val) {
				v.param_val = 0;
			}
			html += "<tr>";
			html += '<td><strong>'+v.param_name+'</strong></td><td>'+v.param_val+'</td>';
			html += "</tr>";
		});

		main.append(html);
		$("#reports-data").data('jsp').reinitialise();
	}

	this.subjectCallback_ = function(event) {
		var id = $(event.target).attr("data-id");
		$("#reports-data h2").html($(event.target).html());

		var image = this.app.reportsWidget.elements["MAIN"].find("#reports-data .cont img");
		image.attr("src", "/static/images/Photos/"+id+".jpg");

		$.ajax(
			{
				url: this.app.apiHost + "/get_subject_info/"+id,
				type: "GET",
				success: $.proxy(this.getSubjectCallback_, this)
			}
		);

		$.ajax(
			{
				url: this.app.apiHost + "/groups/"+id+"/2012",
				type: "GET",
				success: $.proxy(this.getSubjectTableCallback_, this)
			}
		);
	}

	this.subject2Callback_ = function(event) {
		var id = $(event.target).attr("data-id");
		var pTr = $(event.target).parent().parent();
		var self = this;

		if(!$(event.target).attr("open")) {
			$(event.target).attr("open", "1");
			$.ajax(
				{
					url: this.app.apiHost + "/mkb_dictionary_children/"+id,
					type: "GET",
					success: function(data) {
						if(data.length > 0) {
							var html = '<tr><td colspan="2"><table style="height: auto !important; width: auto !important;">';
							$.each(data, function(i, v) {
								html += '<tr><td ><span data-id="'+v.id+'">'+v.name+'</span></td><td>'+v.code+'</td></tr>';
							});
							html += "</table></td></tr>";
							pTr.after(html);
							$("#reports-panel tbody span").on("click", $.proxy(self.subject2Callback_, self));
						}
					}
				}
			);
		}
	}

	this.updateCallback_ = function(data) {
		$("#reports-data").hide();
		$("#reports-panel").show();

		var contentPane = this.app.reportsWidget.scrollApi.getContentPane();
		var main = this.app.reportsWidget.elements["MAIN"].find("#reports-panel tbody");

		main.html("");

		var html = "<tr>";
		var self = this;
		$.each(data, function(key, value) {
			if(!value.region_name && value.district_name) {
				value.region_name = value.district_name;
			}
			if(!value.region_name && value.short_name) {
				value.region_name = value.short_name;
			}
			if(!value.region_name && value.group_name) {
				value.region_name = value.group_name;
			}

			if(!value.region_name && value.name_org) {
				value.name = value.name_org;
			}

			if(value.code) {
				value.attr1 = value.code;
			}

			if(value.addr_street) {
				value.attr2 = value.addr_street;
			}

			if(value.addr_street) {
				value.attr1 = value.addr_region;
			}

			if(value.code1) {
				value.attr1 = value.code1;
			}

			if(value.code2) {
				value.attr2 = value.code2;
			}

			if(value.koef1) {
				value.attr3 = value.koef1;
			}

			if(value.koef2) {
				value.attr4 = value.koef2;
			}

			if(value.address) {
				value.attr1 = value.address;
			}

			if(value.fio_rucovod) {
				value.attr2 = value.fio_rucovod;
			}

			if(value.phone_rucovod) {
				value.attr3 = value.phone_rucovod;
			}

			if(value.www) {
				value.attr4 = value.www;
			}

			if(!value.id && value.region_id) {
				value.id = value.region_id;
			}

			if(self.selectedId == 3) {
				html += '<td><a data-id="'+value.id+'">'+value.name+'</a></td>';
			} else {
				if(self.selectedId == 5) {
					html += '<td><span data-id="'+value.id+'">'+value.name+'</span></td>';
				} else {
					html += '<td>'+value.name+'</td>';
				}
			}

			if(value.region_name) {
				html += '<td>'+value.region_name+"</td>";
			}

			if(value.attr1) {
				html += '<td>'+value.attr1+"</td>";
			}

			if(value.attr2) {
				html += '<td>'+value.attr2+"</td>";
			}

			if(value.attr3) {
				html += '<td>'+value.attr3+"</td>";
			}

			if(value.attr4) {
				html += '<td>'+value.attr4+"</td>";
			}

			html += "</tr>";
		});

		main.append(html);
		$(main).find("a").on("click", $.proxy(this.subjectCallback_, this));
		$(main).find("span").on("click", $.proxy(this.subject2Callback_, this));
		app.reportsWidget.scrollApi.reinitialise();
	}

	this.update = function(id) {
		this.selectedId = id;
		this.app.dictionaryManager.getById(id, $.proxy(this.updateCallback_, this));
	}

	this.initScroll_ = function() {
		$(this.CSS["DATA-PLACE"]).jScrollPane(
			{
				showArrows: true,
				verticalDragMinHeight: 60,
	    		verticalDragMaxHeight: 60,
	    		autoReinitialise: true
			}
		);
		this.scrollApi = this.elements["DATA-PLACE"].data('jsp');
	}

	this.initScroll2_ = function() {
		$("#reports-data").jScrollPane(
			{
				showArrows: true,
				verticalDragMinHeight: 60,
	    		verticalDragMaxHeight: 60,
	    		autoReinitialise: true,
	    		contentWidth: '0px'
			}
		);
		//this.scrollApi = $("#reports-data").data('jsp');
	}

	this.initScroll_();
	this.initScroll2_();
}

/**
 * [EventWidget description]
 * @param {[type]} app [description]
 */
var EventsDrawWidget = function(app) {
	this.app = app;

	this.CSS = {
		"MAIN": "#event-content",
		"HIDDEN": "hidden",
		"LOAD": "#load",
		"CLOSE": ".close"
	}

	this.elements = {
		"MAIN": $(this.CSS["MAIN"]),
		"CLOSE": $(this.CSS["MAIN"]).find(this.CSS["CLOSE"])
	}

	var self = this;
	this.elements["CLOSE"].on("click", function() {
		self.hidden();
	});


	this.show = function() {
		this.elements["MAIN"].removeClass(this.CSS["HIDDEN"]);
	}

	this.hidden = function() {
		console.log("gf");
		this.elements["MAIN"].addClass(this.CSS["HIDDEN"]);
	}
}
