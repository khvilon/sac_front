/**
 * [ description]
 * @param  {[type]} app     [description]
 * @param  {[type]} configs [description]
 * @return {[type]}         [description]
 */
String.prototype.SQLDatetimeToDate = function()
{	var date = this.substring(0, 10);
    var date_time_parts = date.split('-');
    return date_time_parts[2] + '/' + date_time_parts[1] + '/' + date_time_parts[0];};


var YearSelectWidget = function(app, configs) {
	this.app = app;
	this.configs = configs;
	this.years = configs.years;
	this.selectedYear = configs.selectedYear;
	this.onAfterYearSelected = configs.onAfterYearSelected;

	this.CSS = {
		"SELECTOR": configs.container
	}
	this.elements = {
		"SELECTOR": $(this.CSS["SELECTOR"])
	}

	this.onYearSelected_ = function(val, inst) {
		this.selectedYear = val;
		if(this.onAfterYearSelected) {
			this.onAfterYearSelected();
		}
	}

	this.clear = function() {
		this.elements["SELECTOR"].html("");
	}

	this.decorate_ = function() {
		this.elements["SELECTOR"].selectbox({
			effect: "slide",
			onChange: $.proxy(this.onYearSelected_, this)
		});
	}

	this.createOptionChild_ = function(key, value) {
		var newOption = document.createElement("option");
		var newOptionContent = document.createTextNode(value);

		newOption.appendChild(newOptionContent);
		newOption.setAttribute("value", value);

		if(value == this.selectedYear) {
			newOption.setAttribute("selected", "selected");
		}

		this.elements["SELECTOR"].append(newOption);
	}

	this.draw = function() {
		this.clear();
		$.each(this.years, $.proxy(this.createOptionChild_, this));
		this.decorate_();
	}
}

/**
 * [ description]
 * @param  {[type]} app [description]
 * @return {[type]}     [description]
 */
var PageTitleWidget = function(app) {
	this.CSS = {
		"CONTAINER": "header h1"
	};
	this.elements = {
		"CONTAINER": $(this.CSS["CONTAINER"])
	};

	this.hidden = function() {
		this.elements["CONTAINER"].addClass("onHidden");
	}

	this.show = function() {
		this.elements["CONTAINER"].removeClass("onHidden");
	}
}


var ExitWidget = function(app) {
	this.CSS = {
		"EXIT": "header h1"
	};
	this.elements = {
		"EXIT": $(this.CSS["EXIT"])
	};

/*	this.hidden = function() {
		this.elements["CONTAINER"].addClass("onHidden");
	}

	this.show = function() {
		this.elements["CONTAINER"].removeClass("onHidden");
	}  */
}


/**
 * [FooterNavWidget description]
 * @param {[type]} app [description]
 */
var FooterNavWidget = function(app) {
	this.app = app;
	this.CSS = {
		"MAIN": "#footer-nav-widget"
	};
	this.elements = {
		"MAIN": $(this.CSS["MAIN"])
	};
	this.items = ConfigApp["FOOTER-NAV"];

	this.draw_ = function() {
		$.each(this.items, $.proxy(this.drawItem_, this));
	}
	this.drawItem_ = function(index, element) {
		var newLink = document.createElement("a");
		var newLinkContent = document.createTextNode(element["title"]);

		newLink.appendChild(newLinkContent);
		newLink.setAttribute("data-id", index);

		if(element["cooming"]) {
			$(newLink).addClass("cooming");
		}
		if(index == "MAP") {
			$(newLink).addClass("active");
		}
		this.elements["MAIN"].append(newLink);
	}
	this.addEvents_ = function() {
		$(this.CSS["MAIN"]).find("a").on("click", $.proxy(this.onItemClick_, this));
	}
	this.onItemClick_ = function(evt) {
		var curElement = $(evt.target);
		var itemId = curElement.attr("data-id");

		if(!curElement.hasClass("cooming")) {
			if(itemId == "GRAPH") {
				this.app.districtsPanel.hidden();
				this.app.regionPanel.hidden();
				this.app.formatPanel.hidden();
				this.app.mapEventsPanel.hidden();
				this.app.reportsPanel.hidden();

				this.app.graphPanel.show();
			}

			if(itemId == "FORMAT") {
				this.app.districtsPanel.hidden();
				this.app.regionPanel.hidden();
				this.app.graphPanel.hidden();
				this.app.mapEventsPanel.hidden();
				this.app.reportsPanel.hidden();

				this.app.formatPanel.show();
			}

			if(itemId == "REGIONS") {
				this.app.districtsPanel.hidden();
				this.app.graphPanel.hidden();
				this.app.formatPanel.hidden();
				this.app.mapEventsPanel.hidden();
				this.app.reportsPanel.hidden();

				this.app.regionPanel.show();
			}
			if(itemId == "MAP") {
				this.app.regionPanel.hidden();
				this.app.graphPanel.hidden();
				this.app.formatPanel.hidden();
				this.app.mapEventsPanel.hidden();
				this.app.reportsPanel.hidden();

				this.app.districtsPanel.show();
			}
			if(itemId == "EVENTS") {
				this.app.regionPanel.hidden();
				this.app.graphPanel.hidden();
				this.app.formatPanel.hidden();
				this.app.districtsPanel.hiddenWidgets();
				this.app.reportsPanel.hidden();

				this.app.mapEventsPanel.show();
			}

			if(itemId == "REPORTS") {
				this.app.regionPanel.hidden();
				this.app.graphPanel.hidden();
				this.app.formatPanel.hidden();
				this.app.districtsPanel.hidden();
				this.app.mapEventsPanel.hidden();

				this.app.reportsPanel.show();
			}

			this.app.currentMenuSate = itemId;
		}

		if(!curElement.hasClass("cooming")) {
			if(!curElement.hasClass("active")) {
				$(this.CSS["MAIN"]).find("a").removeClass("active");
				curElement.toggleClass("active");
			}
		}
	}

	this.draw = function() {
		this.draw_();
		this.addEvents_();
	}

	this.hidden = function() {
		this.elements["MAIN"].removeClass("onShow");
	}
}

/**
 * [AppTimer description]
 * @param {[type]} app [description]
 */
var AppTimer = function(app) {
	this.timerEvent_ = {};
	this.CSS = {
		"hour": "#hour",
		"minute": "#minute",
		"day": "#day",
		"month": "#month",
		"age": "#age"
	}
	this.month = ['января','февраля','марта','апреля','мая','июня', 'июля','августа','сентября','рктября','ноября','декабря'];
	this.elements = {
		"minute": $(this.CSS["minute"]),
		"hour": $(this.CSS["hour"]),
		"day": $(this.CSS["day"]),
		"month": $(this.CSS["month"]),
		"age": $(this.CSS["age"])
	}

	this.run = function() {
		this.tick_();
		this.timerEvent_ = setInterval($.proxy(this.tick_, this), 10000);
	}

	this.tick_ = function() {
		var date = new Date();

		var strMonth = '' + date.getMinutes();
		if (strMonth.length == 1) {
		  strMonth = '0' + strMonth;
		}

		this.elements["hour"].html(date.getHours());
		this.elements["minute"].html(strMonth);
		this.elements["day"].html(date.getDate());
		this.elements["month"].html(this.month[date.getMonth()]);
		this.elements["age"].html(date.getUTCFullYear());
	}
}


var EventsListWidget = Backbone.View.extend({
    el: $("#events-params"),
    events: {
        "click td": "selectEvent",
        "click .hidden": "onHidden",
//        "click img": "deleteEvent",
//        "mouseenter td"   : "hoverOn",
// 		"mouseleave td"   : "hoverOff"
    },
    initialize: function(app) {
      this.app = app;
    },
    render: function (id) {
    	var self = this;

    	this.collection = new Event({id: id});
    	this.collection.fetch().done(function() {
			$.get('/static/templates/event-list.js', function (data) {
				var elements = self.collection.toJSON();
				delete elements.id;

				if(!self.app.mobile) {
					if($("#events-list-table").data('jsp')) {
						$("#events-list-table").data('jsp').destroy();
					}
				}


				var template = _.template( data, { events: elements, title: self.app.mapStateManager.currentRegionData.name, host: self.app.apiHost } );
				$(self.el).html(template);

				self.show();

				if(!self.app.mobile) {
					$("#events-list-table").jScrollPane(
						{
							showArrows: true,
							verticalDragMinHeight: 60,
				    		verticalDragMaxHeight: 60,
				    		autoReinitialise: true
						}
					);
				}

				self.app.eventsLegendLeftWidget.render({ counts :self.countCollections(elements) });
			}, 'html');
      	});
    },
    countCollections: function(elements) {
    	var counts = {};
    	counts.red = 0;
    	counts.yellow = 0;

    	_.each(elements, function(element) {
    		if(element.event_status_id == 2) {
    			counts.yellow += 1;
    		}
    		if(element.event_status_id == 3) {
    			counts.red += 1;
    		}
    	});

    	return counts;
    },
    selectEvent: function(e) {
    	var clickedEl = $(e.currentTarget);

		var event_id = clickedEl.parent().data("id");

    	if(document.getElementById("event_delete_" + event_id) != null)
			window.application.eventsContentWidget.show(clickedEl.parent().data("id"), clickedEl.parent().data("status"));
    },
    deleteEvent: function(e) {
    	var clickedEl = $(e.currentTarget);
        var td = clickedEl.parent();
        var tr = td.parent();
  		tr.remove();
    },
    hoverOn: function(e) {
    	var dEl = $(e.currentTarget);

  		$("#event_delete_" + dEl.parent().data("id")).css("display", "inline");
    },
    hoverOff: function(e) {
    	var dEl = $(e.currentTarget);

  		$("#event_delete_" + dEl.parent().data("id")).css("display", "none");
    },
    onHidden: function(event) {
    	$("#events-parametrs-widget").css("right", "-820px");
    	$("#events-paramers-show").css("opacity", "1").show();
    },
    onShow: function(event) {
    	console.log(event);
    	$("#events-parametrs-widget").css("right", "0px");
    	$("#events-paramers-show").css("opacity", "0").hide();
    },
    show: function() {
    	$("#events-parametrs-widget").show();

    	$("#events-paramers-show").on("click", this.onShow);
    }
});



var EventsLegendLeftWidget = Backbone.View.extend({
    el: $("#events-legend"),
    template: null,
    initialize: function() {

    },
    render: function (data) {
    	this.renderTemplate(data);
    },
    renderTemplate: function(content) {
    	var self = this;
    	if(!self.template) {
    		$.get('/static/templates/event-legend.js', function (data) {
	    		self.template = data;
				self.bindTemplate_(content);
			}, 'html');
    	} else {
    		this.bindTemplate_(content);
    	}
    },
    bindTemplate_: function(content) {
		$(this.el).html(_.template( this.template, content ));
    },
    show: function(id, status) {
    	$(this.el).removeClass("hidden");

    	this.render(id, status);
    },
    hide: function() {
    	$(this.el).addClass("hidden");
    }
});


var EventsContentWidget = Backbone.View.extend({
    el: $("#event-content"),
    template: null,
    events: {
        "click .close": "hide"
    },
    initialize: function() {

    },
    render: function (id, status) {
    	var self = this;
    	if(id) {
    		this.collection = new EventInfo({id: id});
	    	this.collection.fetch().done(function() {
	    		self.renderTemplate({ event: self.collection.toJSON(), id: id, status: status });
	      	});
    	} else {
    		self.renderTemplate({});
    	}
    },
    renderTemplate: function(content) {

    	content.event.date_time = content.event.date_time.SQLDatetimeToDate();/* = content.event.date_time.substring(0, 10);
    	var date_time_parts = content.event.date_time.split('-');
    	content.event.date_time = date_time_parts[2] + '/' + date_time_parts[1] + '/' + date_time_parts[0];   */
    	var self = this;
    	if(!self.template) {
    		$.get('/static/templates/event-content.js', function (data) {
	    		self.template = data;
				self.bindTemplate_(content);
			}, 'html');
    	} else {
    		this.bindTemplate_(content);
    	}
    },
    showMedia: function(url)
    {
    	var media_div = document.createElement('div');

		media_div.style.width = "60%";
		media_div.style.height = "80%";
		media_div.style.position = "absolute";
		media_div.style.left = "20%";
		media_div.style.top = "13%";
		media_div.style.background = "#000000";
		media_div.style.borderStyle = "solid";
		media_div.style.borderWidth = "2px";
		media_div.style.borderColor = "#79a7d9";
		media_div.style.zIndex = 200;
		media_div.id = 'event_media_div';

		document.getElementById('app').appendChild(media_div);
		var closeDivText = '<span class="close" onclick=window.application.eventsContentWidget.closeMedia() style="display:inline; position:absolute; z-index:203; right:30px; top:30px"></span>';
		if (url.indexOf(".pdf") > 2) $('#event_media_div').append(closeDivText + '<object type="application/pdf"  width=100% height=100% src="'+ url +'" />' );
     	if(url.indexOf(".mp4") > 2) $('#event_media_div').append('<div style="z-index:202; width:100%; height:100%"><video controls autoplay width=100% height=100% allowfullscreen="false" wmode="opaque" ><source src="'+ url +'" type="video/mp4"></video></div>' + closeDivText );
    	else  $('#event_media_div').append(closeDivText + '<img width=100% height=100% src="'+ url +'" />' );    },
    closeMedia: function()
    {    	document.getElementById('app').removeChild(document.getElementById('event_media_div'));    },
    bindTemplate_: function(content) {
		$(this.el).html(_.template( this.template, content ));

		var me = this;

  		window.application.eventManager.getEventMedia(content.event.id, function(data)
  		{
  			var playImg = '<img style="position:relative; top:50%; left:50%; margin-top:-21px; margin-left:-21px" src="/static/images/play_button.png">';
  		     for(var i=0;i<data.length;i++)
  		     {
  		     	var slide = '<li onclick=window.application.eventsContentWidget.showMedia("' + data[i].file_path + '"); ' +
  		     	'style="cursor:pointer; margin-left:4px; margin-right:4px; border:1px solid #8bd9d6; float:left; height:110px; width:140px" >'+
  		     	'<img height=110px width=140px src="' + data[i].file_thumb_path + '" style="position:absolute"/>';
  		     	if(data[i].file_type == "video/mp4") slide += playImg;
                $('#cont_event_slider_ul').append(slide);
             }


			var slidesCount = 6;
  			if($('#cont_event_slider_ul').children().length > slidesCount)
  			{
	  			$("#cont_event_slider_inner").jCarouselLite({
					btnNext: $("#next_slide_button"),
			        btnPrev: $("#prev_slide_button"),
					speed: 500,

					visible: slidesCount
			    });
		    }
  		});

	/*	$("#svg_mm").load("/static/svg/"+content.id+".svg", function(data) {
			$("#svg_mm").html(data);

			$.each($("#svg_mm").find("path"), function(key, value) {
				if(content.status == 2) {
					$(value).attr("fill", "rgba(255, 215, 0, 0.5)");
				}
				if(content.status == 3) {
					$(value).attr("fill", "rgba(255, 0, 0, 0.5)");
				}

				$(value).attr("fill-opacity", "1");
			});
		});  */
    },
    show: function(id, status) {
    	$(this.el).removeClass("hidden");

    	this.render(id, status);
    },
    hide: function() {
    	$(this.el).addClass("hidden");
    }
});