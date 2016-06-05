(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*
* Content Script: inject.js
* Author: Junkai Yang
*/

var extensionOrigin = 'chrome-extension://' + chrome.runtime.id;
var id = chrome.runtime.id;

var ifWindowExists = function () {
    return document.getElementById(id) != null;
};

if (!location.ancestorOrigins.contains(extensionOrigin)) {
    var iframe;

    // test if the menu window has already existed
    if (!ifWindowExists()) {
        iframe = document.createElement('iframe');
        // Must be declared at web_accessible_resources in manifest.json
        iframe.src = chrome.runtime.getURL('/html/menu.html');
        iframe.id = chrome.runtime.id;
        iframe.dataset.shown = false;
        iframe.style.cssText = 'position:fixed;top:0;right:0;display:block;' + 'width:0;height:0;z-index:2999999999;border:none;';
        document.body.appendChild(iframe);
    } else {
        iframe = document.getElementById(id);
    }

    // Show the window only when it is ready
    if (iframe.dataset.shown == "false" && iframe.dataset.ready == "true") {
        window.parent.postMessage({ application: 'video_caption', type: "UI_SHOW", message: "" }, "*");
    } else if (iframe.dataset.shown == "true") {
        window.parent.postMessage({ application: 'video_caption', type: "UI_HIDE", message: "" }, "*");
    }
}

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzY3JpcHRzXFxjb250ZW50X3NjcmlwdHNcXGluamVjdF9tZW51LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7QUNLQSxJQUFJLGtCQUFrQix3QkFBd0IsT0FBTyxPQUFQLENBQWUsRUFBN0Q7QUFDQSxJQUFJLEtBQUssT0FBTyxPQUFQLENBQWUsRUFBeEI7O0FBRUEsSUFBSSxpQkFBaUIsWUFBWTtBQUM3QixXQUFPLFNBQVMsY0FBVCxDQUF3QixFQUF4QixLQUErQixJQUF0QztBQUNILENBRkQ7O0FBSUEsSUFBSSxDQUFDLFNBQVMsZUFBVCxDQUF5QixRQUF6QixDQUFrQyxlQUFsQyxDQUFMLEVBQXlEO0FBQ3JELFFBQUksTUFBSjs7O0FBR0EsUUFBSSxDQUFDLGdCQUFMLEVBQXVCO0FBQ25CLGlCQUFTLFNBQVMsYUFBVCxDQUF1QixRQUF2QixDQUFUOztBQUVBLGVBQU8sR0FBUCxHQUFhLE9BQU8sT0FBUCxDQUFlLE1BQWYsQ0FBc0IsaUJBQXRCLENBQWI7QUFDQSxlQUFPLEVBQVAsR0FBWSxPQUFPLE9BQVAsQ0FBZSxFQUEzQjtBQUNBLGVBQU8sT0FBUCxDQUFlLEtBQWYsR0FBdUIsS0FBdkI7QUFDQSxlQUFPLEtBQVAsQ0FBYSxPQUFiLEdBQXVCLGdEQUNuQixrREFESjtBQUVBLGlCQUFTLElBQVQsQ0FBYyxXQUFkLENBQTBCLE1BQTFCO0FBQ0gsS0FURCxNQVNLO0FBQ0QsaUJBQVMsU0FBUyxjQUFULENBQXdCLEVBQXhCLENBQVQ7QUFDSDs7O0FBR0QsUUFBSSxPQUFPLE9BQVAsQ0FBZSxLQUFmLElBQXdCLE9BQXhCLElBQW1DLE9BQU8sT0FBUCxDQUFlLEtBQWYsSUFBd0IsTUFBL0QsRUFBdUU7QUFDbkUsZUFBTyxNQUFQLENBQWMsV0FBZCxDQUEwQixFQUFFLGFBQWEsZUFBZixFQUFnQyxNQUFNLFNBQXRDLEVBQWlELFNBQVMsRUFBMUQsRUFBMUIsRUFBMEYsR0FBMUY7QUFDSCxLQUZELE1BRU0sSUFBRyxPQUFPLE9BQVAsQ0FBZSxLQUFmLElBQXdCLE1BQTNCLEVBQWtDO0FBQ3BDLGVBQU8sTUFBUCxDQUFjLFdBQWQsQ0FBMEIsRUFBRSxhQUFhLGVBQWYsRUFBZ0MsTUFBTSxTQUF0QyxFQUFpRCxTQUFTLEVBQTFELEVBQTFCLEVBQTBGLEdBQTFGO0FBQ0g7QUFDSiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKlxyXG4qIENvbnRlbnQgU2NyaXB0OiBpbmplY3QuanNcclxuKiBBdXRob3I6IEp1bmthaSBZYW5nXHJcbiovXHJcblxyXG52YXIgZXh0ZW5zaW9uT3JpZ2luID0gJ2Nocm9tZS1leHRlbnNpb246Ly8nICsgY2hyb21lLnJ1bnRpbWUuaWQ7XHJcbnZhciBpZCA9IGNocm9tZS5ydW50aW1lLmlkO1xyXG5cclxudmFyIGlmV2luZG93RXhpc3RzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKSAhPSBudWxsO1xyXG59XHJcblxyXG5pZiAoIWxvY2F0aW9uLmFuY2VzdG9yT3JpZ2lucy5jb250YWlucyhleHRlbnNpb25PcmlnaW4pKSB7XHJcbiAgICB2YXIgaWZyYW1lIFxyXG4gICAgXHJcbiAgICAvLyB0ZXN0IGlmIHRoZSBtZW51IHdpbmRvdyBoYXMgYWxyZWFkeSBleGlzdGVkXHJcbiAgICBpZiAoIWlmV2luZG93RXhpc3RzKCkpIHtcclxuICAgICAgICBpZnJhbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpZnJhbWUnKTtcclxuICAgICAgICAvLyBNdXN0IGJlIGRlY2xhcmVkIGF0IHdlYl9hY2Nlc3NpYmxlX3Jlc291cmNlcyBpbiBtYW5pZmVzdC5qc29uXHJcbiAgICAgICAgaWZyYW1lLnNyYyA9IGNocm9tZS5ydW50aW1lLmdldFVSTCgnL2h0bWwvbWVudS5odG1sJyk7XHJcbiAgICAgICAgaWZyYW1lLmlkID0gY2hyb21lLnJ1bnRpbWUuaWQ7XHJcbiAgICAgICAgaWZyYW1lLmRhdGFzZXQuc2hvd24gPSBmYWxzZTtcclxuICAgICAgICBpZnJhbWUuc3R5bGUuY3NzVGV4dCA9ICdwb3NpdGlvbjpmaXhlZDt0b3A6MDtyaWdodDowO2Rpc3BsYXk6YmxvY2s7JyArXHJcbiAgICAgICAgICAgICd3aWR0aDowO2hlaWdodDowO3otaW5kZXg6Mjk5OTk5OTk5OTtib3JkZXI6bm9uZTsnO1xyXG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoaWZyYW1lKTtcclxuICAgIH1lbHNle1xyXG4gICAgICAgIGlmcmFtZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgLy8gU2hvdyB0aGUgd2luZG93IG9ubHkgd2hlbiBpdCBpcyByZWFkeVxyXG4gICAgaWYgKGlmcmFtZS5kYXRhc2V0LnNob3duID09IFwiZmFsc2VcIiAmJiBpZnJhbWUuZGF0YXNldC5yZWFkeSA9PSBcInRydWVcIikge1xyXG4gICAgICAgIHdpbmRvdy5wYXJlbnQucG9zdE1lc3NhZ2UoeyBhcHBsaWNhdGlvbjogJ3ZpZGVvX2NhcHRpb24nLCB0eXBlOiBcIlVJX1NIT1dcIiwgbWVzc2FnZTogXCJcIiB9LCBcIipcIik7XHJcbiAgICB9ZWxzZSBpZihpZnJhbWUuZGF0YXNldC5zaG93biA9PSBcInRydWVcIil7XHJcbiAgICAgICAgd2luZG93LnBhcmVudC5wb3N0TWVzc2FnZSh7IGFwcGxpY2F0aW9uOiAndmlkZW9fY2FwdGlvbicsIHR5cGU6IFwiVUlfSElERVwiLCBtZXNzYWdlOiBcIlwiIH0sIFwiKlwiKTtcclxuICAgIH1cclxufVxyXG4iXX0=
