// JavaScript Document
var app1_tonk0006 = {
    pages: [],
    links: [],
    numLinks: 0,
    numPages: 0,
    initialize: function() {
        app1_tonk0006.bindEvents();
    },
bindEvents: function() {
    document.addEventListener('deviceready', this.onDeviceReady, false);
    document.addEventListener("DOMContentLoaded", this.onDeviceReady, false);
    },
    
reportPosition: function(position) {
    
},
onDeviceReady: function(){
	//devicre ready listener
    alert("test");
	pages = document.querySelectorAll('[data-role="page"]');	
	numPages = pages.length;
	links = document.querySelectorAll('[data-role="pagelink"]');
	numLinks = links.length;
	for(var i=0;i<numLinks; i++){
		//either add a touch or click listener
     if(detectTouchSupport( )){
       links[i].addEventListener("touchend", handleTouch, false);
     }
		links[i].addEventListener("click", handleNav, false);	
	}
  //add the listener for the back button
  window.addEventListener("popstate", browserBackButton, false);
	loadPage(null);
    
    if(navigator.geolocation) { 
    
        var params = {enableHighAccuracy: false, timeout:6000, maximumAge:60000};
    
        navigator.geolocation.getCurrentPosition( reportPosition, gpsError, params ); 
    
    } else {
    //browser does not support geolocation
        alert("Sorry, but your browser does not support location based awesomeness.")
    }
};

//handle the touchend event
function handleTouch(ev){
  ev.preventDefault();
  ev.stopImmediatePropagation();
  var touch = evt.changedTouches[0];        //this is the first object touched
  var newEvt = document.createEvent("MouseEvent");	
  //old method works across browsers, though it is deprecated.
  newEvt.initMouseEvent("click", true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY);
  ev.currentTarget.dispatchEvent(newEvt);
  //send the touch to the click handler
}

//handle the click event
function handleNav(ev){
	ev.preventDefault();
	var href = ev.target.href;
	var parts = href.split("#");
	loadPage( parts[1] );	
  return false;
}

//Deal with history API and switching divs
function loadPage( url ){
	if(url == null){
		//home page first call
		pages[0].style.display = 'block';
		history.replaceState(null, null, "#home");	
	}else{
    
    for(var i=0; i < numPages; i++){
      if(pages[i].id == url){
        pages[i].style.display = "block";
        history.pushState(null, null, "#" + url);	
      }else{
        pages[i].style.display = "none";	
      }
    }
    for(var t=0; t < numLinks; t++){
      links[t].className = "";
      if(links[t].href == location.href){
        links[t].className = "activetab";
      }
    }
	}
}

//Need a listener for the popstate event to handle the back button
function browserBackButton(ev){
  url = location.hash;  //hash will include the "#"
  //update the visible div and the active tab
  for(var i=0; i < numPages; i++){
      if(("#" + pages[i].id) == url){
        pages[i].style.display = "block";
      }else{
        pages[i].style.display = "none";	
      }
  }
  for(var t=0; t < numLinks; t++){
    links[t].className = "";
    if(links[t].href == location.href){
      links[t].className = "activetab";
    }
  }
}

//Test for browser support of touch events
function detectTouchSupport( ){
  msGesture = navigator && navigator.msPointerEnabled && navigator.msMaxTouchPoints > 0 && MSGesture;
  var touchSupport = (("ontouchstart" in window) || msGesture || (window.DocumentTouch && document instanceof DocumentTouch));
  return touchSupport;
}

function reportPosition(position) { 
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    var canvas = document.createElement("canvas");
    canvas.width = 400;
    canvas.height = 400;
    var output = document.querySelector("#two");
    output.appendChild(canvas);
    var context = canvas.getContext("2d");
    var img = document.createElement("img");
    img.src = "https://maps.googleapis.com/maps/api/staticmap?center="+latitude+","+longitude+"&zoom=16&size=400x400&scale=2&maptype=hybrid&language=english&markers=color:white|"+latitude+","+longitude+"&key=AIzaSyDP68CXSK9TynSN4n_Moo7PPakL8SQM0xk";
    img.onload = function imageDraw() {
        context.drawImage(img, 0, 0, 400, 400); 
    } 
    console.log(latitude);
    console.log(longitude);
}

function gpsError(error) {   
  var errors = {
    1: 'Permission denied',
    2: 'Position unavailable',
    3: 'Request timeout'
  };
  alert("Error: " + errors[error.code]);
}
