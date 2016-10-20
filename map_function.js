//Mapbox API token
L.mapbox.accessToken = 'pk.eyJ1IjoiaHVhbmdsaXBhbmciLCJhIjoiY2luOGJoeWV3MDU0dDN5bHpmN3ZnNm11dSJ9.1kSYNfN3L-uzTzqmBsIekw';

//tilelayer style variable
var tile_group = L.layerGroup(),

    tile_satellite = L.mapbox.tileLayer("mapbox.streets-satellite", {format: 'jpg70', zIndex: 0}),

    tile_streets = L.mapbox.tileLayer("mapbox.streets", {format: 'jpg70', zIndex: 1000}),

    tile_switch = tile_group.hasLayer(tile_satellite),

    tile_switch_empty = true,

//marker distance layers
    markerlayerGroup = new L.layerGroup(),
    markerlayer = new L.mapbox.featureLayer(),
    linelayer = new L.mapbox.featureLayer(),

    distance_button_switch = false,

    dkilometer = document.getElementById('distance_kilometer'),
    dnauticalmile = document.getElementById('distance_nauticalmile'),

    center_position1 = [25.154, 121.377],
    coor_constant = 2.0,
    center_position2 = [27.154, 123.377];

function cent_pos(){
    center_position2 = [center_position1.lat + coor_constant, center_position1.lng + coor_constant];
}

var marker1 = L.marker(center_position1, {
                    draggable: true,
                    icon: L.mapbox.marker.icon({
                        'marker-size': 'large',
                        'marker-symbol': 'ferry',
                        'marker-color': '#FF8040',
                        }),
                    zIndexOffset: 50
                }),

    marker2 = L.marker(center_position2, {
                    draggable: true,
                    icon: L.mapbox.marker.icon({
                        'marker-size': 'large',
                        'marker-symbol': 'harbor',
                        'marker-color': '#FF8040',
                        }),
                    zIndexOffset: 49
                });

var distanceline = L.polyline([center_position1, center_position2], {zIndex: 200}),
    greatcircleline = L.Polyline.Arc(center_position1, center_position2, {
                                    color: 'red',
                                    vertices: 200
                                });
    //'Polyline' with great circle and 'polyline' with leaflet polyline
    //cf. polyline([[coordinate1],[coordinate2]])
    //    Polyline([coordinate1],[coordinate2])

//
////animation marker

var j = 0,
    count = 0,
    t = 500,
    timer,
    marker3,

    animate_marker = {},
    animatelayer = L.mapbox.featureLayer();

function change_tile(){
                
                if(tile_switch && !tile_switch_empty){
                   
                    tile_group.removeLayer(tile_satellite);
                    
                    tile_streets.addTo(tile_group);
                    
                    distanceline.setStyle({color: 'white'});
                    
                    tile_switch = tile_group.hasLayer(tile_satellite);
                }
                else if(!tile_switch && !tile_switch_empty){
                    
                    tile_group.removeLayer(tile_streets);
                    
                    distanceline.setStyle({color: 'black'});
                    
                    tile_switch_empty = true;
                }
                else{
                    
                    tile_satellite.addTo(tile_group);
                    
                    distanceline.setStyle({color: 'white'});
                    
                    tile_switch = tile_group.hasLayer(tile_satellite);
                    
                    tile_switch_empty = false;
                };
            }
