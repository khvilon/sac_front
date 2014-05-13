var olmap;
var gisDiv;

function getTileURL(bounds)
{
  /*  var res = olmap.map.getResolution();
    var x = Math.round((bounds.left - olmap.maxExtent.left) / (res * this.tileSize.w));
    var y = Math.round((this.maxExtent.top - bounds.top) / (res * this.tileSize.h));
    var z = this.map.getZoom();
            var limit = Math.pow(2, z);

            if (y < 0 || y >= limit) {
                return OpenLayers.Util.getImagesLocation() + "404.png";
            } else {
                x = ((x % limit) + limit) % limit;
                return this.url + "x=" + x + "&y=" + y + "&z=" + z;    //+ "&ss=" + x + "-" + y + "-" + z
            }*/
} 

var displObj = {};


function showGis(id)
{
    gisDiv = document.createElement('div');
    
	gisDiv.style.width = "90%";
	gisDiv.style.height = "80%";
	gisDiv.style.position = "absolute"; 
	gisDiv.style.left = "5%"; 
	gisDiv.style.top = "13%"; 
	gisDiv.style.background = "#77a4d4"; 
	gisDiv.style.borderStyle = "solid";
	gisDiv.style.borderWidth = "2px";
	gisDiv.style.borderColor = "#79a7d9";
	gisDiv.id = "gis_div";
	document.getElementById('bg-image').appendChild(gisDiv);

	document.getElementById('bg-events').style.display='none';
	document.getElementById('bg-event-image').style.display='none';
	document.getElementById('bg-svg').style.display='none';
	document.getElementById('bg-regions-image').style.display='none';
	document.getElementById('bg-colored-image').style.display='none';
	document.getElementById('miniMap').className = 'temp';
	document.getElementById('miniMap').style.display='none';
	document.getElementById('legend-widget').style.display='none';


    olmap = new OLMap();
    olmap.init("gis_div", this.app.apiHost, ConfigApp["SAC_TYPE"]);
    
    this.app.regionsManagerLocal.geRegionLatLonById(id);
    if(ConfigApp["SAC_TYPE"] == 'avto')this.app.regionsManagerLocal.getRequisitions(id);
    else if(ConfigApp["SAC_TYPE"] == 'lpu') this.app.regionsManagerLocal.getMarkers(id);
}

function removeGis()
{
    document.getElementById('bg-events').style.display='yes';
    document.getElementById('bg-event-image').style.display='';
    document.getElementById('bg-svg').style.display='block';
	document.getElementById('bg-video').style.display='';
	document.getElementById('bg-regions-image').style.display='';
	document.getElementById('bg-colored-image').style.display='';
	document.getElementById('miniMap').className = 'onShow';
	document.getElementById('miniMap').style.display='';
document.getElementById('legend-widget').style.display='block';

    var gisDiv = document.getElementById("gis_div");
    gisDiv.parentNode.removeChild(gisDiv);
}





