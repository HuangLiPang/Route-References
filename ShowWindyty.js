//起始 windyty
var windytyInit = {
				// Required: API key
				key: 'f647J2Y278pjYbG',
				// Optional: Initial state of the map
				lat: 25.154,
				lon: 121.377,
				zoom: 6
            };            

// windyty主函式
function windytyMain(map) {
                
                //Default mapbox tile
                map.setView([25.154, 121.377], 6);
                
                //Leaflet scale
                L.control.scale({position: 'topleft', maxWidth: 200}).addTo(map);
          
                //Leaflet zoom control fix
                $(".leaflet-control-zoom-in").text("");
                $(".leaflet-control-zoom-out").text("");
                
                //
                //Right side buttons
                function map_tile_change(){
                    if(map_tile_switch){
                        if(map_tile_count == 1){
                            maptile_button.removeFrom(map);
                            map_tile_count --;
                        }
                    }
                    else if(!map_tile_switch){
                            if(map_tile_count == 0){
                                maptile_button.addTo(map);
                                map_tile_count ++;
                            }
                    }
                }
                
                var wind_button = L.easyButton({
                                        states: [{
                                            stateName: "wind-button",
                                            onClick: function(){
                                                    W.setOverlay("wind");												
                                                    setButtonState();
                                                    map_tile_switch = false;
                                                    map_tile_change();
                                                },
                                            title: "Wind",
                                            icon: '<img src="/Icons/wind.png">'
                                        }]
                                    }),
                
                    temp_button = L.easyButton({
                                            states: [{
                                                stateName: "temp-button",
                                                onClick: function(){
                                                        W.setOverlay("temp");												
                                                        setButtonState();
                                                        map_tile_switch = false;
                                                        map_tile_change();
                                                    },
                                                title: "Temperature",
                                                icon: '<img src="/Icons/temp.png">'
                                            }]
                                        }),

                    rain_button = L.easyButton({
                                            states: [{
                                                stateName: "rain-button",
                                                onClick: function(){
                                                        W.setOverlay("clouds");												
                                                        setButtonState();
                                                        map_tile_switch = false;
                                                        map_tile_change();
                                                    },
                                                title: "Rain",
                                                icon: '<img src="/Icons/rain.png">'
                                            }]
                                        }),

                    pressure_button = L.easyButton({
                                            states: [{
                                                stateName: "pressure-button",
                                                onClick: function(){
                                                        W.setOverlay("pressure");	
                                                        setButtonState(); 
                                                        map_tile_switch = false;
                                                        map_tile_change();
                                                    },
                                                title: "Pressure",
                                                icon: '<img src="/Icons/pressure.png">'
                                            }]
                                        }),

                    waves_button = L.easyButton({
                                            states: [{
                                                stateName: "waves-button",
                                                onClick: function(){
                                                        W.setOverlay("waves");												
                                                        setButtonState();
                                                        tile_switch_empty = false;
                                                        tile_switch = false;
                                                        tile_group.clearLayers();
                                                        change_tile();
                                                        map_tile_switch = true;
                                                        map_tile_change();
                                                    },
                                                title: "Waves",
                                                icon: '<img src="/Icons/waves.png">'
                                            }]
                                        }),

                    currents_button = L.easyButton({
                                            states: [{
                                                stateName: "currents-button",
                                                onClick: function(){
                                                        W.setOverlay("currents");			
                                                        setButtonState();
                                                        document.getElementById("timeline").style.display="none";
                                                        tile_switch_empty = false;
                                                        tile_switch = false;
                                                        tile_group.clearLayers();
                                                        change_tile();
                                                        map_tile_switch = true;
                                                        map_tile_change();
                                                    },
                                                title: "Currents",
                                                icon: '<img src="/Icons/currents.png">'
                                            }], 
                                            id: 'current'
                                        });
                
                L.easyBar([wind_button, temp_button, rain_button, pressure_button, waves_button, currents_button]).addTo(map);
                
    
                var measuring_button = L.easyButton({
                                        states: [{
                                            stateName: "measure-button",
                                            onClick: function(){
                                                distance_button();
                                                show_marker_position();
                                            },
                                            title: "Measure Distance",
                                            icon: '<img src="/Icons/measuring.png">'
                                        }]
                                    }).addTo(map),
                    
                    maptile_button = L.easyButton({
                                            states: [{
                                                stateName: "maptile-button",
                                                onClick: change_tile,
                                                title: "Maps",
                                                icon: '<img src="/Icons/maptile.png">'
                                            }]
                                        }).addTo(map),
                    map_tile_switch = true,
                    map_tile_count = 1;
                    
                //LayerGroups
                ECAlayerGroup.addTo(map);       //ECA layerGroup
				geolayerGroup.addTo(map);       //Route layerGroup
                markerlayerGroup.addTo(map);    //Measure marker layerGroups
                tile_group.addTo(map);          //Tile layerGroups
                
                markerlayer.addTo(markerlayerGroup);
                linelayer.addTo(markerlayerGroup);
                
                //Route button control
				var route = document.getElementById("route");
				route.onchange = function(){ createroute(); };
				
				var resetButton = document.getElementById('reset');
				resetButton.onclick = function(){ clearroute(); };							
				
                //
                ////timeline
                
                var weekdays = ['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.'],
                    months = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.'];
                var now = new Date(),
                    presentHour = now.getHours(),
                    presentHourSec = presentHour * 3600000,
                    timelineEnd = 7 * 24 * 3600000,
                    presentWeekday = now.getDay(),
                    presentDate = now.getDate(),
                    presentMonth = now.getMonth(),
                    presentTime = months[presentMonth] + ' ' +  presentDate + '  ' + weekdays[presentWeekday] + ' ' + presentHour + ':00';
                
                var range = document.getElementById('slider');
				range.min = W.timeline.start;   
                range.step = 3600000;   //3600000 seconds = 1 hour
                range.max = W.timeline.start + timelineEnd;
                range.value = W.timeline.start + presentHourSec;
                //W.timeline.start gives 0:00 of that day as input time, and adding 'presentHourSec' to give present time as input
                
                var presentIntTime = parseInt(range.value),     //range.value returns string
                    calendar_pointer = (((parseInt(range.value) - W.timeline.start) / 3600000) / 168) * 100;
                    //the percentage for the timeline indicator
                    
                range.addEventListener('input', time_change);
                
                document.getElementById("timePopup").innerHTML = presentTime;
                document.getElementById("timePopup").style.left = calendar_pointer + '%';
                document.getElementById('calendarpointer-pointer').style.left = calendar_pointer + '%';

                function time_change(){
                    var slider_time = new Date(parseInt(event.target.value))                    
                    document.getElementById("timePopup").innerHTML = months[slider_time.getMonth()] + ' ' +  slider_time.getDate() + '  ' + weekdays[slider_time.getDay()] + ' ' + slider_time.getHours() + ':00';
                    W.setTimestamp(event.target.value);     //event.target represent the slider
                    
                    var calendar_pointer_left = (((parseInt(event.target.value) - W.timeline.start) / 3600000) / 168) * 100;
                    
                    var popup_width = $('#popup').width();
                    
                    document.getElementById('calendarpointer-pointer').style.left = calendar_pointer_left + '%';
                    document.getElementById('timePopup').style.left = calendar_pointer_left + '%';
                }
                
                for(i = 0; i <= 6; i++){
                    var j = (i + presentWeekday) % 7,
                        table_name = 'calendar-table-',
                        date_counter = i * 86400000;
                    presentDate = new Date(W.timeline.start + date_counter).getDate();
                    table_name += i;
                    document.getElementById(table_name).innerHTML = weekdays[j] + ' ' + presentDate;
                }   //loop for displaying the present date
    
                ////
				//
                
                function setButtonState(){
						range.max = W.timeline.start + timelineEnd;
						range.min = W.timeline.start;						
						document.getElementById("timeline").style.display = "block";
				    }
                
                //M
                //Marker Distance
                
                var kilometer = (marker1.getLatLng().distanceTo(marker2.getLatLng())/1000).toFixed(3), 
                    nauticalmile = (kilometer / 1.852).toFixed(3);
                
                marker1.on('move', distance);
                marker2.on('move', distance);

                map.on('move', center_marker_position);
                
                var show_marker_position_switch = false;
                
                function show_marker_position(){
                    if(show_marker_position_switch){
                        document.getElementById('markerposition').style.opacity = 0;
                        show_marker_position_switch = false;
                    }
                    else{
                        document.getElementById('markerposition').style.opacity = 0.6;
                        show_marker_position_switch = true;
                    }
                }
                
                function center_marker_position(){
                    
                    if(!distance_button_switch){
                        
                        center_position1 = map.getCenter();
                        
                        cent_pos();
                        
                        marker1.setLatLng(center_position1);

                        marker2.setLatLng(center_position2);                            
                    };   
                }
                
                function distance_button(){
                    if(distance_button_switch){
                        markerlayer.clearLayers();
                        linelayer.clearLayers();
                        dkilometer.innerHTML = '0.000 km';
                        dnauticalmile.innerHTML = "0.000 nm";
                        distance_button_switch = false;
                    }
                    else{
                        marker1.addTo(markerlayer);
                        marker2.addTo(markerlayer);
                        distanceline.bindPopup('<p style="margin: 0px; padding: 0px; font-size: 16px;">Rhumb Line</p>').addTo(linelayer);
                        greatcircleline.bindPopup('<p style="margin: 0px; padding: 0px; font-size: 16px;">Great Circle</p>').addTo(linelayer);
                        dkilometer.innerHTML = kilometer + ' km';
                        dnauticalmile.innerHTML = nauticalmile + " nm";
                        distance_button_switch = true;
                    };
                }

                function distance(){ 

                    var m1 = marker1.getLatLng(),
                        m2 = marker2.getLatLng();

                    kilometer = (m1.distanceTo(m2)/1000).toFixed(3), 
                    nauticalmile = (kilometer / 1.852).toFixed(3);

                    dkilometer.innerHTML = kilometer + ' km';
                    dnauticalmile.innerHTML = nauticalmile + " nm";

                    linelayer.clearLayers();

                    distanceline = L.polyline([[m1.lat, m1.lng], [m2.lat, m2.lng]]).bindPopup('<p style="margin: 0px; padding: 0px; font-size: 16px;">Rhumb Line</p>');
                    
                    greatcircleline = L.Polyline.Arc([m1.lat, m1.lng], [m2.lat, m2.lng], {
                                    color: 'red',
                                    vertices: 200
                                }).bindPopup('<p style="margin: 0px; padding: 0px; font-size: 16px;">Great Circle</p>');
                    
                    distanceline.setStyle({color: 'white'});
                    
                    //greatcircleline.setStyle({color: 'white'});
                    
                    if(tile_switch_empty){
                        distanceline.setStyle({color: 'black'});
                        
                    }
                    else{
                        distanceline.setStyle({color: 'white'});
                    };

                    if(distance_button_switch){

                        distanceline.addTo(linelayer);
                        
                        greatcircleline.addTo(linelayer);
                    };
                }
                //Marker Distance
                //M
                
                //@@
                //Mouse position
                //var mousemove1 = document.getElementById('mousemove');

                map.on('mousemove', cursor);
                       
                function cursor(a){
                    var lat = Math.abs(a.latlng.lat.toPrecision(9)),
                        lng = Math.abs(a.latlng.wrap(-180, 180).lng.toPrecision(9)),
                        latdeg = parseInt(lat),
                        lngdeg = parseInt(lng),
                        latf = Math.abs(lat - parseFloat(latdeg)),
                        lngf = Math.abs(lng - parseFloat(lngdeg)),
                        latmin = (latf * 60).toPrecision(5),
                        lngmin = (lngf * 60).toPrecision(5);
                    var we = '', ns = '', timer;

                    if(a.latlng.lat>=0){
                        ns = 'N';
                    }
                    else{
                        ns = 'S';
                    }

                    if(a.latlng.wrap(-180, 180).lng>=0){
                        we = 'E';
                    }
                    else{
                        we = 'W';
                    }
                    
                    var cursor_pos = latdeg.toString() + '° ' + latmin.toString() + "' " + ns + ', ' + lngdeg.toString() + '° ' + lngmin.toString() + "' " + we;
                    
                    window['cursor'].innerHTML = cursor_pos;    
                    //window['cursor'] equals to ducument.getElementById('cursor')
                    
                    window['mouseposition'].style.opacity = 0.6;    
                    window['mouseposition'].style.transition = 'opacity 0.5s';
                    window['mouseposition'].style.WebkitTransition = 'opacity 0.5s';
                    
                    timer = setTimeout(fadeout, 3000);
                    
                    function fadeout(){
                        if(cursor_pos == window['cursor'].innerHTML){
                            window['mouseposition'].style.opacity = 0.2;
                            clearTimeout(timer);
                        }
                    }
                }
                //Mouse position
                //@@
                
                //
                ////animation marker
                
                //load geojson to fetch coordinates
                function load(a){
                    animatelayer.clearLayers();
                    $.ajax({
                        headers: {
                            'Accept': 'application'
                        },
                        xhrFields: {
                          withCredentials: false
                        },
                        dataType: 'json',
                        url: a,
                        success: animation_marker
                        });
                }

                function animation_marker(geojson){
                    marker3 = L.marker(
                              [geojson.features[0].geometry.coordinates[1], geojson.features[0].geometry.coordinates[0]], {
                                    icon: L.mapbox.marker.icon({
                                      'marker-size': 'large',
                                      'marker-color': '#f86767',
                                      'marker-symbol': 'ferry'
                                      }),
                                    zIndexOffset: 51
                                }).addTo(animatelayer);
                    animatelayer.addTo(geolayerGroup);
                    animate_marker = geojson;
                    tick();
                }
                
                function tick(){

                    count = animate_marker.features[j].geometry.type.length;
                    if(count == 5){

                        marker3.setLatLng(L.latLng(
                            animate_marker.features[j].geometry.coordinates[1], animate_marker.features[j].geometry.coordinates[0]
                        ));
                        ++j;
                        timer = setTimeout(tick, t);
                    }
                    else{
                        j = 0;
                        clearTimeout(timer);
                        timer = setTimeout(tick, t);
                    };


                }

                ////animation marker
                //

                function createroute(){
                    geo = "GeoJSON/" + p + route.value;                
                    gpx = "GPX/" + p + route.value.replace('.geojson', '.gpx');
                    csv = "CSV/" + p + route.value.replace('.geojson', '.csv');
                    
                    var geoLayer = new L.mapbox.featureLayer();
                    geoLayer.loadURL(geo).addTo(geolayerGroup);
                    
                    geoLayer.on('ready', function() {
                                        map.fitBounds(geoLayer.getBounds());
                                    });
                    
                    document.getElementById("GPX").disabled = false;
                    document.getElementById("CSV").disabled = false;
                    //   
                    //animarion marker
                    j = 0;
                    clearTimeout(timer);
                    load(geo);
                    //
                    //
                }
                
                
                function clearroute(){
                    geolayerGroup.clearLayers();
                    map.setView([25.154, 121.377], 6);
                    P = "";
                    geo = "";
                    gpx = "";
                    csv = "";
                    document.getElementById("GPX").disabled = true;
                    document.getElementById("CSV").disabled = true;
                    //   
                    //animation marker
                    j = 0;
                    count = 0;
                    animate_marker = {};
                    clearTimeout(timer);
                    timer = null;
                    marker3 = null;
                    //
                    //
                    range.value = W.timeline.start + presentHourSec;
                    W.setTimestamp(range.value);
                    document.getElementById("timePopup").innerHTML = presentTime;
                    document.getElementById("timePopup").style.left = calendar_pointer + '%';
                    document.getElementById('calendarpointer-pointer').style.left = calendar_pointer + '%';
                    initial_line();
                }
                
			}			