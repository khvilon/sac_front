OLMap.prototype.newPnt = function(lat, lon)
{
    var pnt = new OpenLayers.Geometry.Point(lat, lon);
    pnt = pnt.transform( new OpenLayers.Projection("EPSG:4326"),
        this.map.getProjectionObject());
    return pnt;
}

OLMap.prototype.newLonLat = function(lat, lon)
{
    var lonlat = new OpenLayers.LonLat(lon, lat);
    
    return lonlat.transform( new OpenLayers.Projection("EPSG:4326"),
        this.map.getProjectionObject());
}


OLMap.prototype.addCustomControls = function()
{
	var me = this;

	function addButton(id, name, title, x, y, callback, inPercent)
	{
		var xPref, yPref;
		xPref = yPref = 'px';
		alert(typeof inPercent);
		if(typeof inPercent !== 'undefined')
		{
			alert(xPref);
			if(inPercent == 'x') xPref = '%';
			else if(inPercent == 'y') yPref = '%';		
		}

		var bDiv = document.createElement('img');

		bDiv.id = id;


		//bDiv.style.backgroundImage='url('+ me.hostIP + '/static/compile/js/olmap/images/buttons/'+name+'.png)'; 
		bDiv.src=me.hostIP + '/static/compile/js/olmap/images/buttons/'+name+'.png'; 
		bDiv.style.position = 'absolute';
		
		if(y > 0) bDiv.style.top = y+yPref;
		else bDiv.style.bottom = -y+yPref;

		if(x > 0) bDiv.style.left = x+xPref;
		else bDiv.style.right = -x+xPref;
		bDiv.style.width = '36px';
		bDiv.style.height = '36px';
		bDiv.style.zIndex = 1004;
		bDiv.style.cursor = 'pointer';	
		bDiv.onclick = callback;

		me.map.getViewport().appendChild(bDiv);

		var outside_panel = new OpenLayers.Control.Panel({div: bDiv});

		me.map.addControl(outside_panel);			
	}

	addButton('gis_btn_zoom_in', 'zoom_in', '', 20, 20, function(){me.map.zoomIn();});
	addButton('gis_btn_zoom_out', 'zoom_out', '', 20, 55, function(){me.map.zoomOut();});
	addButton('gis_btn_close', 'close', '', -20, 20, function(){removeGis();});

	addButton('gis_btn_up', 'arrow_up', '', 50, 20, function(){removeGis();}, 'x');
	addButton('gis_btn_down', 'arrow_down', '', 50, -20, function(){removeGis();}, 'x');
	addButton('gis_btn_left', 'arrow_right', '', 20, 50, function(){removeGis();}, 'y');
	addButton('gis_btn_right', 'arrow_left', '', -20, 50, function(){removeGis();}, 'y');	
	
}