// модель событий
var Event = Backbone.Model.extend({
    initialize: function() {
        
    }
});

var EventInfo = Backbone.Model.extend({
	urlRoot: ConfigApp["API-HOST"]+"/events/get_event_info/",
    initialize: function() {
        
    }
});

// коллекция событий
var EventCollection = Backbone.Collection.extend({
    model: Event,
    url: ConfigApp["API-HOST"]+"/events/get_event_list"
});

var EventInfoCollection = Backbone.Collection.extend({
    model: Event,
    
});