/**
 * [ description]
 * @param  {[type]} app     [description]
 * @param  {[type]} configs [description]
 * @return {[type]}         [description]
 */
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
        "click td": "selectEvent"
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
				

				var template = _.template( data, { events: elements } );
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

  		window.application.eventsContentWidget.show(clickedEl.parent().data("id"), clickedEl.parent().data("status"));
    },
    show: function() {
    	$("#events-parametrs-widget").show();
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
    bindTemplate_: function(content) {
		$(this.el).html(_.template( this.template, content ));

		$("#svg_mm").load("/static/svg/"+content.id+".svg", function(data) {
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
		});
    },
    show: function(id, status) {
    	$(this.el).removeClass("hidden");

    	this.render(id, status);
    },
    hide: function() {
    	$(this.el).addClass("hidden");
    }
});