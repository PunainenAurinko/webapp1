// Global variables

var pages = [],
    links = [];
var numLinks = 0;
var numPages = 0;
var latitude,
    longitude;

// Add DOMContentLoaded listener

document.addEventListener("DOMContentLoaded", function () {
    pages = document.querySelectorAll('[data-role="page"]');
    numPages = pages.length;
    links = document.querySelectorAll('[data-role="pagelink"]');
    numLinks = links.length;
    for (var i = 0; i < numLinks; i++) {
        //either add a touch or click listener
        if (detectTouchSupport()) {
            links[i].addEventListener("touchend", handleTouch, false);
        }
        links[i].addEventListener("click", handleNav, false);
    }
    //add the listener for the back button
    window.addEventListener("popstate", browserBackButton, false);
    loadPage(null);

    if (navigator.geolocation) {

        var params = {
            enableHighAccuracy: true,
            timeout: 30000,
            maximumAge: 90000
        };

        navigator.geolocation.getCurrentPosition(findCoordinates, gpsError, params);

    } else {
        //browser does not support geolocation
        alert("Sorry, but your phone does not support location-based servicess.")
    }

});

//handle the touchend event
function handleTouch(ev) {
    ev.preventDefault();
    ev.stopImmediatePropagation();
    var touch = ev.changedTouches[0]; //this is the first object touched
    var newEvt = document.createEvent("MouseEvent");
    //old method works across browsers, though it is deprecated.
    newEvt.initMouseEvent("click", true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY);
    ev.currentTarget.dispatchEvent(newEvt);
    //send the touch to the click handler
}

//handle the click event
function handleNav(ev) {
    ev.preventDefault();
    var href = ev.currentTarget.href;
    console.log(href);
    var parts = href.split("#");
    loadPage(parts[1]);
    return false;
}

//Deal with history API and switching divs
function loadPage(url) {
    if (url == null) {
        //home page first call
        pages[0].style.display = 'block';
        history.replaceState(null, null, "#home");
    } else {

        for (var i = 0; i < numPages; i++) {
            if (pages[i].id == url) {
                pages[i].style.display = "block";
                pages[i].className = "active";
                history.pushState(null, null, "#" + url);
            } else {
                pages[i].className = "";
                pages[i].style.display = "block";

            }
        }
        for (var t = 0; t < numLinks; t++) {
            links[t].className = "";
            if (links[t].href == location.href) {
                links[t].className = "activetab";
            }
        }
    }
}

//A listener for the popstate event to handle the back button
function browserBackButton(ev) {
    url = location.hash; //hash will include the "#"
    //update the visible div and the active tab
    for (var i = 0; i < numPages; i++) {
        if (("#" + pages[i].id) == url) {
            pages[i].style.display = "block";
            pages[i].className = "active";
        } else {
            pages[i].className = "";
            pages[i].style.display = "block";
        }
    }
    for (var t = 0; t < numLinks; t++) {
        links[t].className = "";
        if (links[t].href == location.href) {
            links[t].className = "activetab";
        }
    }
}

// Test for browser support of touch events

function detectTouchSupport() {
    msGesture = navigator && navigator.msPointerEnabled && navigator.msMaxTouchPoints > 0 && MSGesture;
    var touchSupport = (("ontouchstart" in window) || msGesture || (window.DocumentTouch && document instanceof DocumentTouch));
    return touchSupport;
}

// Get location coordinates and display a map on canvas tag with a marker in the center

function findCoordinates(position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    var canvas = document.createElement("canvas");
    canvas.width = 327;
    canvas.height = 327;
    var output = document.querySelector("#two");
    output.appendChild(canvas);
    var context = canvas.getContext("2d");
    var img = document.createElement("img");
    img.src = "https://maps.googleapis.com/maps/api/staticmap?center=" + latitude + "," + longitude + "&zoom=16&size=400x400&scale=2&maptype=hybrid&language=english&markers=color:white|" + latitude + "," + longitude + "&key=AIzaSyDP68CXSK9TynSN4n_Moo7PPakL8SQM0xk";
    img.onload = function imageDraw() {
        context.drawImage(img, 0, 0, 327, 327);
    }
    console.log("Latitude: " + latitude);
    console.log("Longitude: " + longitude);

    findStreetAddress()
}

function gpsError(error) {
    var errors = {
        1: 'Permission denied',
        2: 'Position unavailable',
        3: 'Request timeout'
    };
    alert("Error: " + errors[error.code]);
}

// Get and display human-readable street address based on the found coordinates

function findStreetAddress() {
    var geocoder = new google.maps.Geocoder();
    var latlng = new google.maps.LatLng(latitude, longitude);
    geocoder.geocode({
        'latLng': latlng
    }, function (results, status) {
        console.log(google.maps.GeocoderStatus);
        if (status == google.maps.GeocoderStatus.OK) {
            console.log(results[1].formatted_address);
            var h2 = document.createElement("h2");
            h2.innerHTML = "<small>" + results[1].formatted_address + "</small>";
            var output2 = document.querySelector("#two");
            output2.appendChild(h2);
        } else {
            alert("Geocoder failed due to: " + status);
        }
    });
}

// Add deviceready listener

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {

    // Geolocation function call may also be located here, but left in DOMContentLoaded event for easier testing both on android devices and the browser


    // Working function to manually pick and display a contact from phone contacts app
    // Was used for testing whether cordova.js was working properly on the phone 

    //    navigator.contacts.pickContact(function (contact) {
    //        var output3 = document.querySelector("#three");
    //        var p = document.createElement("p");
    //        p.innerHTML = 'The following contact has been selected:' + JSON.stringify(contact);
    //        output3.appendChild(p);
    //    }, function (err) {
    //        console.log('Error: ' + err);
    //    });

    var options = new ContactFindOptions();
    options.filter = "";
    options.multiple = true;
    var filter = ["displayName", "phoneNumbers", "emails", "addresses", "organizations", "birthday"];
    navigator.contacts.find(filter, onSuccess, onError, options);
}

// Pick and display a random contact out of all device contacts

function onSuccess(contacts) {
    console.log(contacts);
    var r = Math.floor((Math.random() * contacts.length));
    console.log("Random contact: " + r);
    //for (var i = 0; i < contacts.length; i++) {
    var output3 = document.querySelector("#three");
    var p = document.createElement("p");

    if (contacts.length != 0) {

        if (contacts[r].displayName != null) {
            p.innerHTML = "<strong>Contact's Name:</strong> " + contacts[r].displayName + "<br>";
        } else {
            p.innerHTML += "<strong>Contact's Name:</strong> <small>No name on record.<small>" + "<br>";
        }

        if (contacts[r].phoneNumbers != null) {
            for (var i = 0; i < contacts[r].phoneNumbers.length; i++) {
                if (contacts[r].phoneNumbers.length > 1) {
                    p.innerHTML += "<strong>Phone " + (i + 1) + " (" + contacts[r].phoneNumbers[i].type + ")" + ":</strong> " + contacts[r].phoneNumbers[i].value + "<br>";
                } else {
                    p.innerHTML += "<strong>Phone:</strong> " + contacts[r].phoneNumbers[i].value + "<br>";
                }
            }
        } else {
            p.innerHTML += "<strong>Phone:</strong> <small>No phone number on record.</small>" + "<br>";
        }

        if (contacts[r].emails != null) {
            for (var i = 0; i < contacts[r].emails.length; i++) {
                if (contacts[r].emails.length > 1) {
                    p.innerHTML += "<strong>Email " + (i + 1) + ":</strong> " + contacts[r].emails[i].value + "<br>";
                } else {
                    p.innerHTML += "<strong>Email:</strong> " + contacts[r].emails[i].value + "<br>";
                }
            }
        } else {
            p.innerHTML += "<strong>Email:</strong> <small>No email on record.</small>" + "<br>";
        }


        if (contacts.addresses != null) {
            for (var i = 0; i < contacts[r].addresses.length; i++) {
                p.innerHTML += "<strong>Address:</strong> " + contacts[r].addresses[i].formatted + "<br>";
            }
        } else {
            p.innerHTML += "<strong>Address:</strong> <small>No address on record.</small>" + "<br>";
        }
    } else {
        p.innerHTML = "No contacts found on phone."
    }
    output3.appendChild(p);

    //}
}

// Failed to get the contacts

function onError(contactError) {
    alert("Error!");
}