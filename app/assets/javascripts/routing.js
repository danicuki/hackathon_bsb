var directionService = new google.maps.DirectionsService();
var rboxer = new RouteBoxer();
var distance = 1; // km
var debug = true;
var abox;

function find_bounds(){
  var request = {
    origin: $("#parameter_from").attr("value"),
    destination: $("#parameter_to").attr("value"),
    travelMode: google.maps.DirectionsTravelMode.DRIVING
  }

  directionService.route(request, function(result, status) {
    if (status == google.maps.DirectionsStatus.OK) {
  
      // Box the overview path of the first route
      var path = result.routes[0].overview_path;
      var boxes = rboxer.box(path, distance);
    
      if (debug){
        drawBoxes(boxes);
      }
    
      for (var i = 0; i < boxes.length; i++) {
        var bounds = boxes[i];
        $("#boxes").append("<p>");
        $("#boxes").append("Box "+i+": ");
        $("#boxes").append("<br/>[[");        
        $("#boxes").append(bounds.Z.b+ ",");
        $("#boxes").append(bounds.ca.b + "],[");        
        $("#boxes").append(bounds.Z.d+ ",");        
        $("#boxes").append(bounds.ca.d + "]]");        
        $("#boxes").append("</p>");
        
        [[-23.58,-46.7],[-23.55,-46.6]]
        abox = bounds;        
      } 
    }else {
        alert("fail!");
    }
  });

  function drawBoxes(boxes) {
   boxpolys = new Array(boxes.length);
   for (var i = 0; i < boxes.length; i++) {
     boxpolys[i] = new google.maps.Rectangle({
     bounds: boxes[i],
       fillOpacity: 0,
       strokeOpacity: 1.0,
       strokeColor: '000000',
       strokeWeight: 1,
       map: Gmaps.map.serviceObject,
     });
   }
  }
}

Gmaps.map.callback = function() {
   google.maps.event.addListenerOnce(Gmaps.map.serviceObject, 'idle', function(){
     find_bounds();
     Gmaps.map.map.setZoom(Gmaps.map.map.zoom -1);
   });
}
