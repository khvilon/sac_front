if ( !Array.prototype.forEach ) {
  Array.prototype.forEach = function(fn, scope) {
    for(var i = 0, len = this.length; i < len; ++i) {
      fn.call(scope, this[i], i, this);
    }
  }
}

var KScriptLoaderObj;

function KScriptLoader()
{
	this.srcCount = 0;
	this.cssCount = 0;
	this.callbackCount = 0;

	this.srcOkCount = 0;

	this.items = new Array();
	this.itemTypes = new Array();
	//0 script, 1 css, 2 callback

function KJScript(url)
{
    this.obj.src = url;
    this.obj.type = 'text/javascript';

function KCSS(url)
{
    this.obj.rel='stylesheet';
    this.obj.type='text/css';
    this.obj.href = url;

KJScript.prototype.addCallback = KCSS.prototype.addCallback = function(callback)
{
    {
    	this.obj.onreadystatechange = callback;
    	this.obj.onload = callback;
	}

KJScript.prototype.write = KCSS.prototype.write = function()
{
	document.getElementsByTagName('head')[0].appendChild(this.obj);
	//alert(this.obj.type);
};

KScriptLoader.prototype.getUrlObj = function(url)
{
	var obj = null;
	else if(/.css$/.test(url)) obj = new KCSS(url);
	else {obj = new KJScript(url);}//alert("Не корректный путь: " + url);
	return obj;

KScriptLoader.prototype.load = function(url, callback)
{
	var obj = this.getUrlObj(url);
	obj.addCallback(callback);
	obj.write();
};

KScriptLoader.prototype.loadObj = function(obj, callback, me)
{
	obj.addCallback(callback);
	obj.write();
};


KScriptLoader.prototype.add = function(arg)
{
	{
		{
			//alert(arg[i]);
			if(obj != null) this.items.push(obj);
	else if(typeof arg == 'string')
	{

		if(obj != null) this.items.push(obj);
	else if(typeof arg == 'function')
	{
};

KScriptLoader.prototype.run = function()
{
	if(this.items.length == 0) return;
	var item = this.items.shift();

 	var tempThis = this;

 	//alert(typeof item);

	if(typeof item === 'function') {item.call();  this.run();}
	else this.loadObj(item, function(){ tempThis.run();}, this);
};


function loadScript(url, callback)
{
    // Adding the script tag to the head
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.src = url;
    script.type = 'text/javascript';

    // Then bind the event to the callback function.
    // There are several events for cross browser compatibility.
    if(callback != null)
    {
    	script.onreadystatechange = callback;
    	script.onload = callback;
	}

    // Fire the loading
    head.appendChild(script);
}

function loadChainScripts(urls, callback)
{
	var url = urls.shift();
	//alert(url);
	if(urls.length > 0) loadScript(url, function(){loadChainScripts(urls, callback)});
	else loadScript(url, callback);



function loadLocalScript(url, callback)
{
   url = getCurrJSPath() +"/"+ url;
   loadScript(url, callback);
}

function loadCSS(url)
{
    // Adding the script tag to the head
    var head = document.getElementsByTagName('head')[0];
    var link = document.createElement('link');
    link.rel='stylesheet';
    link.type='text/css';
    link.href = url;

    // Then bind the event to the callback function.
    // There are several events for cross browser compatibility.
   /* if(callback != null)
    {
    	link.onreadystatechange = callback;
    	link.onload = callback;
	}   */

    // Fire the loading
    head.appendChild(link);
}

function loadLocalCSS(url)
{
	loadCSS(url);

//Get path to current JS file for loading other lib scripts.
function getCurrJSPath()
{
	var scriptObjects = document.getElementsByTagName("script");
	var src = scriptObjects[scriptObjects.length-1].src;