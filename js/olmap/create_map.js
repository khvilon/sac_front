OLMap.prototype.createMap =  function(divName)
{
    this.map = new OpenLayers.Map(
    {
        div: divName,
       	projection: new OpenLayers.Projection("EPSG:900913"),
        displayProjection: new OpenLayers.Projection("EPSG:4326")
    });

	this.map.events.register('zoomend', this, function(event)
	{
		var zoom = event.object.getZoom();
		if(this.maxZoom > zoom) removeGis(); 
	});    	

    this.map.addControl(new OpenLayers.Control.LayerSwitcher());
}

OLMap.prototype.addMapserverLayer =  function()
{

    this.msLayer = new OpenLayers.Layer.TMS( "TMS",
        "http://54.212.51.74/mapcache/tms/", {layername: 'osm@g', type:'png'} );


   /* var msMapAddr = "http://" + this.msMapIp + "/cgi-bin/mapserv?map=" + this.msMapPath;   
    this.msLayer = new OpenLayers.Layer.MapServer("msMap", msMapAddr, {layers: "all"}); */
    this.map.addLayer(this.msLayer);   
}

OLMap.prototype.addOSMLayer =  function()
{
    this.osmLayer = new OpenLayers.Layer.OSM();
    this.map.addLayer(this.osmLayer);   
}