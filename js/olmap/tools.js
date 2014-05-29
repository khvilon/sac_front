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