OLVectorStyle =
{
	mask: new OpenLayers.StyleMap(
	{
        pointRadius: 0,
        strokeWidth: 0,
        fillOpacity: 0.8,
        strokeOpacity: 0,
        strokeLinecap: "round",
        strokeColor: "black",
        fillColor: "black"
	}),


	lpu: new OpenLayers.StyleMap(
   	{
        graphicName: "circle",
	  	pointRadius: 13,
	  	strokeWidth: 10,
	  	fillOpacity: 0.8,
	  	strokeOpacity: 0.3,
	  	strokeLinecap: "round",
	  	strokeColor: "yellow",
	  	fillColor: "yellow",
	  //	label : "${label}",	
    	fontColor: "blue",
        fontSize: "8px",
        fontFamily: "Arial",
        labelXOffset: 0,
        labelYOffset: -30,     
        fontOpacity: 1 ,
        cursor: 'pointer'
	}),
    
    requisitions: new OpenLayers.StyleMap(
   	{
        externalGraphic: "${path}",
	  	graphicWidth: 20,
	  	graphicHeight: 20,
	  	pointRadius: 100
	}),
};


OLMap.prototype.addVectorLayers = function(ver)
{
	var me = this;
	function addVectorLayer(name, styleMap, projection)
	{
		var args = {styleMap: styleMap};
		if(projection) args.projection = projection;
		var layer = new OpenLayers.Layer.Vector(name, args);
	    me.map.addLayer(layer);
	    return layer;
	}

    this.maskLayer = addVectorLayer("Затемнение", OLVectorStyle.mask);
    
    if (ver == "lpu")
	   this.lpuLayer = addVectorLayer("ЛПУ", OLVectorStyle.lpu);
       
    if (ver == "avto")
	   this.requisitionsLayer = addVectorLayer("Обращения", OLVectorStyle.requisitions);
    
//	this.carsLayer = addVectorLayer("Машины", OLStyleMapList.SMCar, new OpenLayers.Projection("EPSG:4326"));
};