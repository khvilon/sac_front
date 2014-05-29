

function OLMap()
{
	//OpenLayers map object
	var map;
    var hostIP;

	//Yandex and Google traffic layers
	//var yTraffic, gTraffic;
    var msLayer, osmLayer;

	//vector layers
    var lpuLayer, maskLayer, requisitionsLayer;
    
    //other non base layers
    var borderLayer;
    
    var msMapIp = '54.185.39.17';
    var msMapPath = '/home/ubuntu/osm2/basemaps/osm-default.map';
    var msLayers = 'all';

	var maxZoom;
    
    var popup;
}


OLMap.prototype.init = function(divName, ip, type)
{
	OpenLayers.Lang.setCode("ru");
    
	this.hostIP = ip;


	this.createMap(divName);
	this.addCustomControls();
    
	this.addMapserverLayer();
	this.addOSMLayer();
	
	this.addVectorLayers(type); 
	
	this.addLayersMenu();

	return true;
};



OLMap.prototype.addBorderLayer =  function()
{
    this.borderLayer = new OpenLayers.Layer.TMS(
              "границы",
              "http://openmapsurfer.uni-hd.de/tiles/adminb/",
              {
                  type: 'png', getURL: getTileURL,
                  displayOutsideMaxExtent: true,
                  isBaseLayer: false,
                  numZoomLevels: 19,
              }
            );

     this.map.addLayer(this.borderLayer);
}


 