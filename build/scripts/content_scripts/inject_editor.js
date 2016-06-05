(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*
* Content Script: inject_editor.js
* Author: Junkai Yang
*/
var extensionOrigin = 'chrome-extension://' + chrome.runtime.id;
var id = "video_caption_editor_" + chrome.runtime.id;

var ifWindowExists = function () {
    return document.getElementById(id) != null;
};

if (!location.ancestorOrigins.contains(extensionOrigin)) {
    // test if the menu window has already existed
    var topPos = $("video").offset().top + $("video").height() + 10 + "px";
    var leftPos = $("video").offset().left - 50 + "px";
    var width = $("video").width() + "px";

    var $container = $('<div style="' + 'position:absolute;top:' + topPos + ';left:' + leftPos + ';display:block;' + 'width: 890px;height:331px;z-index:2999999999;border:none;border-radius: 5px;"' + '></div>');
    //$container.css("position", absolute)

    var $dragHandler = $('<div id="video_caption_editor_drag"></div>');
    $container.hover(function () {
        $dragHandler.show();
    }, function () {
        $dragHandler.hide();
    });
    if (!ifWindowExists()) {
        iframe = document.createElement('iframe');
        // Must be declared at web_accessible_resources in manifest.json
        iframe.src = chrome.runtime.getURL('/html/editor.html');
        iframe.id = id;
        iframe.dataset.shown = false;
        // iframe.style.cssText = 'position:absolute;top:' + topPos + ';left:' + leftPos + ';display:block;' +
        //     'width: 890px;height:331px;z-index:2999999999;border:none;border-radius: 5px;';

        iframe.style.cssText = "height:100%; width:100%;";
        //iframe.onload = addHandle(document.getElementsByTagName('body').item(0), window);
        $container.append($dragHandler);
        $container.append($(iframe));
        $('body').append($container);

        $container.draggable({
            handle: "#video_caption_editor_drag"
        });
        //document.body.appendChild(iframe);
    } else {
            iframe = document.getElementById(id);
        }
    //$( "#" + id ).draggable();
}

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzY3JpcHRzXFxjb250ZW50X3NjcmlwdHNcXGluamVjdF9lZGl0b3IuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0FDSUEsSUFBSSxrQkFBa0Isd0JBQXdCLE9BQU8sT0FBUCxDQUFlLEVBQTdEO0FBQ0EsSUFBSSxLQUFLLDBCQUEwQixPQUFPLE9BQVAsQ0FBZSxFQUFsRDs7QUFFQSxJQUFJLGlCQUFpQixZQUFZO0FBQzdCLFdBQU8sU0FBUyxjQUFULENBQXdCLEVBQXhCLEtBQStCLElBQXRDO0FBQ0gsQ0FGRDs7QUFLQSxJQUFJLENBQUMsU0FBUyxlQUFULENBQXlCLFFBQXpCLENBQWtDLGVBQWxDLENBQUwsRUFBeUQ7O0FBRXJELFFBQUksU0FBVSxFQUFFLE9BQUYsRUFBVyxNQUFYLEdBQW9CLEdBQXBCLEdBQTBCLEVBQUUsT0FBRixFQUFXLE1BQVgsRUFBMUIsR0FBZ0QsRUFBakQsR0FBdUQsSUFBcEU7QUFDQSxRQUFJLFVBQVcsRUFBRSxPQUFGLEVBQVcsTUFBWCxHQUFvQixJQUFwQixHQUEyQixFQUE1QixHQUFrQyxJQUFoRDtBQUNBLFFBQUksUUFBUSxFQUFFLE9BQUYsRUFBVyxLQUFYLEtBQXFCLElBQWpDOztBQUVBLFFBQUksYUFBYSxFQUFFLGlCQUFpQix3QkFBakIsR0FBNEMsTUFBNUMsR0FBcUQsUUFBckQsR0FBZ0UsT0FBaEUsR0FBMEUsaUJBQTFFLEdBQ2pCLCtFQURpQixHQUNpRSxTQURuRSxDQUFqQjs7O0FBSUEsUUFBSSxlQUFlLEVBQUUsNENBQUYsQ0FBbkI7QUFDQSxlQUFXLEtBQVgsQ0FBaUIsWUFBVTtBQUN2QixxQkFBYSxJQUFiO0FBQ0gsS0FGRCxFQUVHLFlBQVU7QUFDVCxxQkFBYSxJQUFiO0FBQ0gsS0FKRDtBQUtBLFFBQUksQ0FBQyxnQkFBTCxFQUF1QjtBQUNuQixpQkFBUyxTQUFTLGFBQVQsQ0FBdUIsUUFBdkIsQ0FBVDs7QUFFQSxlQUFPLEdBQVAsR0FBYSxPQUFPLE9BQVAsQ0FBZSxNQUFmLENBQXNCLG1CQUF0QixDQUFiO0FBQ0EsZUFBTyxFQUFQLEdBQVksRUFBWjtBQUNBLGVBQU8sT0FBUCxDQUFlLEtBQWYsR0FBdUIsS0FBdkI7Ozs7QUFJQSxlQUFPLEtBQVAsQ0FBYSxPQUFiLEdBQXVCLDBCQUF2Qjs7QUFFQSxtQkFBVyxNQUFYLENBQWtCLFlBQWxCO0FBQ0EsbUJBQVcsTUFBWCxDQUFrQixFQUFFLE1BQUYsQ0FBbEI7QUFDQSxVQUFFLE1BQUYsRUFBVSxNQUFWLENBQWlCLFVBQWpCOztBQUVBLG1CQUFXLFNBQVgsQ0FBcUI7QUFDakIsb0JBQVE7QUFEUyxTQUFyQjs7QUFLSCxLQXBCRCxNQW9CSztBQUNELHFCQUFTLFNBQVMsY0FBVCxDQUF3QixFQUF4QixDQUFUO0FBQ0g7O0FBR0oiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLypcclxuKiBDb250ZW50IFNjcmlwdDogaW5qZWN0X2VkaXRvci5qc1xyXG4qIEF1dGhvcjogSnVua2FpIFlhbmdcclxuKi9cclxudmFyIGV4dGVuc2lvbk9yaWdpbiA9ICdjaHJvbWUtZXh0ZW5zaW9uOi8vJyArIGNocm9tZS5ydW50aW1lLmlkO1xyXG52YXIgaWQgPSBcInZpZGVvX2NhcHRpb25fZWRpdG9yX1wiICsgY2hyb21lLnJ1bnRpbWUuaWQ7XHJcblxyXG52YXIgaWZXaW5kb3dFeGlzdHMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpICE9IG51bGw7XHJcbn1cclxuXHJcblxyXG5pZiAoIWxvY2F0aW9uLmFuY2VzdG9yT3JpZ2lucy5jb250YWlucyhleHRlbnNpb25PcmlnaW4pKSB7XHJcbiAgICAvLyB0ZXN0IGlmIHRoZSBtZW51IHdpbmRvdyBoYXMgYWxyZWFkeSBleGlzdGVkXHJcbiAgICB2YXIgdG9wUG9zID0gKCQoXCJ2aWRlb1wiKS5vZmZzZXQoKS50b3AgKyAkKFwidmlkZW9cIikuaGVpZ2h0KCkgKyAxMCkgKyBcInB4XCI7XHJcbiAgICB2YXIgbGVmdFBvcyA9ICgkKFwidmlkZW9cIikub2Zmc2V0KCkubGVmdCAtIDUwKSArIFwicHhcIjtcclxuICAgIHZhciB3aWR0aCA9ICQoXCJ2aWRlb1wiKS53aWR0aCgpICsgXCJweFwiO1xyXG4gICAgXHJcbiAgICB2YXIgJGNvbnRhaW5lciA9ICQoJzxkaXYgc3R5bGU9XCInICsgJ3Bvc2l0aW9uOmFic29sdXRlO3RvcDonICsgdG9wUG9zICsgJztsZWZ0OicgKyBsZWZ0UG9zICsgJztkaXNwbGF5OmJsb2NrOycgXHJcbiAgICArICd3aWR0aDogODkwcHg7aGVpZ2h0OjMzMXB4O3otaW5kZXg6Mjk5OTk5OTk5OTtib3JkZXI6bm9uZTtib3JkZXItcmFkaXVzOiA1cHg7XCInICsgJz48L2Rpdj4nKTtcclxuICAgIC8vJGNvbnRhaW5lci5jc3MoXCJwb3NpdGlvblwiLCBhYnNvbHV0ZSlcclxuICAgIFxyXG4gICAgdmFyICRkcmFnSGFuZGxlciA9ICQoJzxkaXYgaWQ9XCJ2aWRlb19jYXB0aW9uX2VkaXRvcl9kcmFnXCI+PC9kaXY+Jyk7XHJcbiAgICAkY29udGFpbmVyLmhvdmVyKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgJGRyYWdIYW5kbGVyLnNob3coKTtcclxuICAgIH0sIGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgJGRyYWdIYW5kbGVyLmhpZGUoKTtcclxuICAgIH0pXHJcbiAgICBpZiAoIWlmV2luZG93RXhpc3RzKCkpIHtcclxuICAgICAgICBpZnJhbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpZnJhbWUnKTtcclxuICAgICAgICAvLyBNdXN0IGJlIGRlY2xhcmVkIGF0IHdlYl9hY2Nlc3NpYmxlX3Jlc291cmNlcyBpbiBtYW5pZmVzdC5qc29uXHJcbiAgICAgICAgaWZyYW1lLnNyYyA9IGNocm9tZS5ydW50aW1lLmdldFVSTCgnL2h0bWwvZWRpdG9yLmh0bWwnKTtcclxuICAgICAgICBpZnJhbWUuaWQgPSBpZDtcclxuICAgICAgICBpZnJhbWUuZGF0YXNldC5zaG93biA9IGZhbHNlO1xyXG4gICAgICAgIC8vIGlmcmFtZS5zdHlsZS5jc3NUZXh0ID0gJ3Bvc2l0aW9uOmFic29sdXRlO3RvcDonICsgdG9wUG9zICsgJztsZWZ0OicgKyBsZWZ0UG9zICsgJztkaXNwbGF5OmJsb2NrOycgKyBcclxuICAgICAgICAvLyAgICAgJ3dpZHRoOiA4OTBweDtoZWlnaHQ6MzMxcHg7ei1pbmRleDoyOTk5OTk5OTk5O2JvcmRlcjpub25lO2JvcmRlci1yYWRpdXM6IDVweDsnO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICBpZnJhbWUuc3R5bGUuY3NzVGV4dCA9IFwiaGVpZ2h0OjEwMCU7IHdpZHRoOjEwMCU7XCI7XHJcbiAgICAgICAgLy9pZnJhbWUub25sb2FkID0gYWRkSGFuZGxlKGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdib2R5JykuaXRlbSgwKSwgd2luZG93KTtcclxuICAgICAgICAkY29udGFpbmVyLmFwcGVuZCgkZHJhZ0hhbmRsZXIpO1xyXG4gICAgICAgICRjb250YWluZXIuYXBwZW5kKCQoaWZyYW1lKSk7XHJcbiAgICAgICAgJCgnYm9keScpLmFwcGVuZCgkY29udGFpbmVyKTtcclxuICAgICAgICBcclxuICAgICAgICAkY29udGFpbmVyLmRyYWdnYWJsZSh7IFxyXG4gICAgICAgICAgICBoYW5kbGU6IFwiI3ZpZGVvX2NhcHRpb25fZWRpdG9yX2RyYWdcIlxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIC8vZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChpZnJhbWUpO1xyXG4gICAgICAgIFxyXG4gICAgfWVsc2V7XHJcbiAgICAgICAgaWZyYW1lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xyXG4gICAgfVxyXG4gICAgLy8kKCBcIiNcIiArIGlkICkuZHJhZ2dhYmxlKCk7XHJcblxyXG59XHJcbiJdfQ==
