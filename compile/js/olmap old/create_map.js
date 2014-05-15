OLMap.prototype.createMap =  function(divName)
{
    this.map = new OpenLayers.Map(
    {
        div: divName,
       	projection: new OpenLayers.Projection("EPSG:900913"),
        displayProjection: new OpenLayers.Projection("EPSG:4326"),
	controls: []
    });

	this.map.events.register('zoomend', this, function(event)
	{
		var zoom = event.object.getZoom();
		if(this.maxZoom > zoom) removeGis(); 
	});    	

   // this.map.addControl(new OpenLayers.Control.LayerSwitcher());
    this.map.addControl(new OpenLayers.Control.Navigation());
}

OLMap.prototype.addMapserverLayer =  function()
{

 this.msLayer = new OpenLayers.Layer.TMS( "TMS",
        "http://sac.khvi.ru:82/mapcache/tms/", {layername: 'osm@g', type:'png', opacity: 1} );
this.map.addLayer(this.msLayer);

    this.waterLayer = new OpenLayers.Layer.TMS( "Реки и озера",
        "http://sac.khvi.ru:82/mapcache/tms/", {layername: 'water@g', type:'png', opacity: 1, isBaseLayer: false} );
	this.map.addLayer(this.waterLayer);

this.roadLayer = new OpenLayers.Layer.TMS( "Дороги",
        "http://sac.khvi.ru:82/mapcache/tms/", {layername: 'road@g', type:'png', opacity: 1, isBaseLayer: false} );
	this.map.addLayer(this.roadLayer);

this.railwayLayer = new OpenLayers.Layer.TMS( "Железные дороги",
        "http://sac.khvi.ru:82/mapcache/tms/", {layername: 'railway@g', type:'png', opacity: 1, isBaseLayer: false} );
	this.map.addLayer(this.railwayLayer);

/*
this.msLayer = new OpenLayers.Layer.WMS("OpenLayers WMS", "http://sac.khvi.ru:82/mapcache/wms?",

        {layers: 'all'}

    );*/


 /*  var msMapAddr = "http://" + this.msMapIp + "/cgi-bin/mapserv?map=" + this.msMapPath;   
    this.msLayer = new OpenLayers.Layer.MapServer("msMap", msMapAddr, {layers: "all"}); */
      

/*var gsat = new OpenLayers.Layer.Google(
                "Google sat",
                {type: google.maps.MapTypeId.SATELLITE, numZoomLevels: 20,isBaseLayer: false, opacity: 1}
            );
this.map.addLayer(gsat);  */ 
}

OLMap.prototype.addOSMLayer =  function()
{
	this.osmLayer = new OpenLayers.Layer.OSM(); 
	this.map.addLayer(this.osmLayer);
	      
}