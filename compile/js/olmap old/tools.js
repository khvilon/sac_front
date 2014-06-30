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
		var bDiv = document.createElement('img');

		var xPref, yPref;
		xPref = yPref = 'px';
		if(typeof inPercent !== 'undefined')
		{
			if(inPercent == 'x')
			{
				xPref = '%';
				bDiv.onload = function(){bDiv.style.marginLeft = -this.width/2;};
			}
			else if(inPercent == 'y')
			{
				yPref = '%';
				bDiv.onload = function(){bDiv.style.marginTop =  -this.height/2;};
			}		
		}

		
		bDiv.id = id;


		//bDiv.style.backgroundImage='url('+ me.hostIP + '/static/compile/js/olmap/images/buttons/'+name+'.png)'; 
		
		var path = me.hostIP + '/static/compile/js/olmap/images/buttons/'+name+'.png';
		var pathP = me.hostIP + '/static/compile/js/olmap/images/buttons/'+name+'_p.png';
		bDiv.src=path;
		bDiv.style.position = 'absolute';
		
		if(y > 0) bDiv.style.top = y+yPref;
		else bDiv.style.bottom = -y+yPref;

		if(x > 0) bDiv.style.left = x+xPref;
		else bDiv.style.right = -x+xPref;
		
		bDiv.style.display ='block';
		bDiv.style.zIndex = 1004;
		bDiv.style.cursor = 'pointer';	
		bDiv.onclick = callback;

		bDiv.onmouseover=function(){bDiv.src=pathP;};
	        bDiv.onmouseout=function(){bDiv.src=path;};


		me.map.getViewport().appendChild(bDiv);
		

		var outside_panel = new OpenLayers.Control.Panel({div: bDiv});

		me.map.addControl(outside_panel);			
	}

	var bOffset = 20;
	var panStep = 100;

	addButton('gis_btn_zoom_in', 'zoom_in', '', bOffset, bOffset, function(){me.map.zoomIn();});
	addButton('gis_btn_zoom_out', 'zoom_out', '', bOffset, bOffset+35, function(){me.map.zoomOut();});
	addButton('gis_btn_close', 'close', '', -bOffset, bOffset, function(){removeGis();});

	addButton('gis_btn_up', 'arrow_up', '', 50, bOffset, function(){me.map.pan(0, -panStep);}, 'x');
	addButton('gis_btn_down', 'arrow_down', '', 50, -bOffset, function(){me.map.pan(0, panStep);}, 'x');
	addButton('gis_btn_left', 'arrow_right', '', bOffset, 50, function(){me.map.pan(-panStep, 0);}, 'y');
	addButton('gis_btn_right', 'arrow_left', '', -bOffset, 50, function(){me.map.pan(panStep, 0);}, 'y');	
	
}

OLMap.prototype.addLayersMenu = function()
{
	var menuDiv = document.createElement('div');
	menuDiv.id = 'gis_layers_menu';
	menuDiv.style.position = 'absolute';
	menuDiv.style.width = '306px';
	menuDiv.style.height = '218px';
	menuDiv.style.left = '0px';
	menuDiv.style.bottom = '20px';
	menuDiv.style.backgroundImage='url('+ this.hostIP + '/static/compile/js/olmap/images/layers_menu/menu_bg.png)'; 

	menuDiv.style.zIndex = 1004;

	this.map.getViewport().appendChild(menuDiv);

	var me = this;

	function addLayerControl(layer)
	{
		var lcDiv = document.createElement('div');
		lcDiv.style.position = 'relative';
		lcDiv.style.left = '20px';
		lcDiv.style.top = '25px';

		var pathTrue = me.hostIP + '/static/compile/js/olmap/images/layers_menu/tick_true.png';
		var pathFalse = me.hostIP + '/static/compile/js/olmap/images/layers_menu/tick_false.png';

		var chbDiv = document.createElement('img');
		chbDiv.src=pathTrue;
		chbDiv.checked = true;
		chbDiv.onclick = function()
		{
			chbDiv.checked = !chbDiv.checked;
			if(chbDiv.checked) chbDiv.src=pathTrue;
			else chbDiv.src=pathFalse;
			layer.setVisibility(chbDiv.checked);	
		}

		var labelDiv = document.createElement('div');
		document.createElement('font');
		
		labelDiv.style.position = 'absolute';
		labelDiv.style.top = '5px';
		labelDiv.style.left = '50px';

		
		labelDiv.innerHTML = layer.name;

		lcDiv.appendChild(chbDiv);
		lcDiv.appendChild(labelDiv);

		document.getElementById('gis_layers_menu').appendChild(lcDiv);
	}

	addLayerControl(this.roadLayer);
	addLayerControl(this.waterLayer);
	addLayerControl(this.railwayLayer);
	addLayerControl(this.lpuLayer);
}