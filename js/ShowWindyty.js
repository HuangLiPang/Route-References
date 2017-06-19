(function (window) {
    //Side bar
    function openNav() {
        document.getElementById("menu").style.width = "230px";
        document.getElementById('open').style.opacity = 0;
        document.getElementById('open').style.cursor = 'default';
        document.getElementById('open').style.transition = '0.5s 0s';
        window['windyty'].setAttribute('onclick', 'closeNav()');
        document.getElementsByClassName('search-container')[0].style.opacity = 0;
        document.getElementsByClassName('search-container')[1].style.opacity = 0;
        document.getElementsByClassName('search-container')[0].style.transition = '0.5s 0s';
        document.getElementsByClassName('search-container')[1].style.transition = '0.5s 0s';
        document.getElementById('search_result').style.opacity = 0;
        document.getElementById('search_result').style.transition = '0.5s 0s';
    }

    function closeNav() {
        document.getElementById("menu").style.width = "0";
        document.getElementById('open').style.opacity = 1;
        document.getElementById('open').style.cursor = 'pointer';
        document.getElementById('open').style.transition = '0.5s 0.4s';
        window['windyty'].removeAttribute('onclick');
        document.getElementsByClassName('search-container')[0].style.opacity = 1;
        document.getElementsByClassName('search-container')[1].style.opacity = 1;
        document.getElementsByClassName('search-container')[0].style.transition = '0.5s 0.4s';
        document.getElementsByClassName('search-container')[1].style.transition = '0.5s 0.4s';
        document.getElementById('search_result').style.opacity = 1;
        document.getElementById('search_result').style.transition = '0.5s 0.4s';
    }
    var about_key = true;

    function showabout() {

        if (about_key) {
            document.getElementsByClassName("logo_image")[0].style.left = '0px';
            about_key = false;
        } else {
            document.getElementsByClassName("logo_image")[0].style.left = '-230px';
            about_key = true;
        }
    }

    function bar_move(bar) {
        bar.classList.toggle("barchange");
    }

    window.openNav = openNav;
    window.closeNav = closeNav;
    window.showabout = showabout;
    window.bar_move = bar_move;
})(this);
//Mapbox API token
L.mapbox.accessToken = 'pk.eyJ1IjoiaHVhbmdsaXBhbmciLCJhIjoiY2luOGJoeWV3MDU0dDN5bHpmN3ZnNm11dSJ9.1kSYNfN3L-uzTzqmBsIekw';
(function (window) {
    var W_layerGroup = {
        routeGroup: new L.layerGroup(),
        markerGroup: new L.layerGroup(),
        marker: new L.mapbox.featureLayer(),
        line: new L.mapbox.featureLayer(),
        routeAnimate: new L.mapbox.featureLayer(),
        track: new L.mapbox.featureLayer().loadURL("data/position_line/fleet.geojson"),
        //	trackLine: new L.mapbox.featureLayer().loadURL("position/fleet_line.geojson"),
        ECAsNOxLayer: new L.mapbox.featureLayer().loadURL("data/ECA/eca.geojson").on('ready', function () {
            this.setStyle({
                "color": "white",
                "weight": "2"
            })
        }),
        fleets: {
            l: new L.mapbox.featureLayer(),
            s: new L.mapbox.featureLayer(),
            e: new L.mapbox.featureLayer(),
            u: new L.mapbox.featureLayer(),
            d: new L.mapbox.featureLayer(),
            a: new L.mapbox.featureLayer(),
            p: new L.mapbox.featureLayer(),
            //			c: new L.mapbox.featureLayer(),
            //			t: new L.mapbox.featureLayer(),
            labels: new L.mapbox.featureLayer()
        },
        fleetsLine: {
            layer: new L.layerGroup()
        }
    };

    W_layerGroup.ECAsNOxLayer.on('mouseover', function () {
        this.setStyle({
            "color": "#ff0000",
            "weight": "5"
        })
    });
    W_layerGroup.ECAsNOxLayer.on('mouseout', function () {
        this.setStyle({
            "color": "#fff",
            "weight": "2"
        })
    });
    window.W_layerGroup = W_layerGroup;
})(this);

//起始 windyty
var windytyInit = {
    key: 'f647J2Y278pjYbG', // Required: API key
    lat: 25.154, // Optional: Initial state of the map
    lon: 121.377, //Default map center
    zoom: 6
};
// windyty主函式
function windytyMain(map) {
    //Add forEach to NodeList and HTMLCollection for old version Chrome.
    NodeList.prototype.forEach = Array.prototype.forEach;
    HTMLCollection.prototype.forEach = Array.prototype.forEach;
    map.setMaxBounds([[-50, -50], [70, 370]]);
    //Leaflet scale with nautical mile
    L.control.scalenautic({
        position: 'topright',
        maxWidth: 100,
        metric: true,
        imperial: false,
        nautic: true
    }).addTo(map);
    /*
    	//
    	////animation control
    	var W_animation = {
    		canvas1: document.getElementsByClassName("leaflet-canvas1 leaflet-zoom-animated")[0],
    		gradient2: document.getElementsByClassName("leaflet-canvas2 leaflet-zoom-animated")[0],
    		gradient3: document.getElementsByClassName("leaflet-canvas3 leaflet-zoom-animated")[0],
    		gradcheck: {},
    		key: 1,
    		keep: function () {
    			if (!W_animation.key) {
    				W.animation.stop();
    				W_animation.canvas1.style.opacity = 0;
    				setTimeout(function () {
    					W_animation.canvas1.style.transition = 'opacity 0.001s';
    					W_animation.canvas1.style.WebkitTransition = 'opacity 0.001s';
    				}, 500);
    				W_animation.key = 0;
    			}
    		}
    	}
    	W_animation.canvas1.addEventListener('transitionend', W_animation.keep);

    	//Because 'transitionstart' event didn't exist in W3C rules, it is tricky to change the transition time into 0.001s to fool your eyes.
    	////
    */
    var W_route = {
            path: "", //String variable for for the data path of the route
            geojson: "", //Variable for geojson data path
            gpx: "", //Variable for gpx data path
            csv: "", //Variable for csv data path
            //Load lines
            initLine: function () {
                $(document).ready(function () {
                    $("#line").empty().load("data/initial_line.txt");
                    $("#route").empty().load("data/Catalogue/ADL.txt").prop("disabled", true);
                    document.getElementsByClassName('menu_route')[0].style.cursor = 'not-allowed';
                });
            },
            downloadGPX: function () {
                window.open(W_route.gpx);
            },
            downloadCSV: function () {
                window.open(W_route.csv);
            },
            changeLine: function () {
                var lineIndex = document.getElementById("line").selectedIndex,
                    lineOption = document.getElementById("line").options;
                W_route.path = lineOption[lineIndex].text;
                var lineTXT = "data/Catalogue/" + W_route.path + ".txt"
                $(document).ready(function () {
                    $("#route").empty().load(lineTXT).prop("disabled", false);
                });
                document.getElementsByClassName('menu_route')[0].style.cursor = 'pointer';
            },
            create: function () {
                W_route.geojson = "data/GeoJSON/" + W_route.path + route.value;
                W_route.gpx = "data/GPX/" + W_route.path + route.value.replace('.geojson', '.gpx');
                W_route.csv = "data/CSV/" + W_route.path + route.value.replace('.geojson', '.csv');
                var geoLayer = new L.mapbox.featureLayer();
                geoLayer.loadURL(W_route.geojson).addTo(W_layerGroup.routeGroup);
                geoLayer.on('ready', function () {
                    map.fitBounds(geoLayer.getBounds());
                });
                $("#GPX").removeClass("disable");
                $("#CSV").removeClass("disable");
                window['GPX'].addEventListener('click', W_route.downloadGPX);
                window['CSV'].addEventListener('click', W_route.downloadCSV);
                //   
                //animation marker
                W_dynamic.counter = 0;
                clearTimeout(W_dynamic.timer);
                W_dynamic.load(W_route.geojson);
                //
                //
            },
            clear: function () {
                W_layerGroup.routeGroup.clearLayers();
                map.setView([25.154, 121.377], 6);
                //				map.fitBounds([[19, 112], [31, 129]]);
                W_route.path = "";
                W_route.geojson = "";
                W_route.gpx = "";
                W_route.csv = "";
                $("#GPX").addClass("disable");
                $("#CSV").addClass("disable");
                window['GPX'].removeEventListener('click', W_route.downloadGPX);
                window['CSV'].removeEventListener('click', W_route.downloadCSV);
                //   
                //animation marker
                W_dynamic.counter = 0;
                W_dynamic.checkPoint = 0;
                W_dynamic.geojson = {};
                clearTimeout(W_dynamic.timer);
                W_dynamic.timer = null;
                W_dynamic.marker = null;
                //
                W_route.clearHistory();
                var timePopup = document.getElementById('timePopup'),
                    slider = document.getElementById('slider');
                slider.value = W.timeline.start + W_timeline.present.HourSec();
                timePopup.innerHTML = W_timeline.present.Time();
                timePopup.style.left = ((((parseInt(slider.value) - W.timeline.start) / 3600000) / 168) * 100 - 1) + '%';
                document.getElementById('calendarpointer-pointer').style.left = (((parseInt(slider.value) - W.timeline.start) / 3600000) / 168) * 100 + '%';
                W.setTimestamp(parseInt(slider.value));
                W_route.initLine();
            },
            clearHistory: function () {
                for (var shipName in W_layerGroup.fleetsLine)
                    if (shipName !== "layer") {
                        W_layerGroup.fleetsLine[shipName].clearLayers();
                        delete W_layerGroup.fleetsLine[shipName];
                    }
            }
        },
        W_easybar_sem = {
            statebar: true,
        },
        W_weatherControl = {
            weather: ["wind", "temp", "clouds", "pressure", "waves", "currents"],
            state: "wind",
            baselayerState: "full",
            change: function () {
                var tileCheckForLayerControl = function () {
                        if (W_easybar_sem.statebar) {
                            if (map.hasLayer(W_tileLayer.Weather)) {
                                for (var tile in W_tileLayer)
                                    layerControls.removeLayer(W_tileLayer[tile]);
                            } else {
                                for (var tile in W_tileLayer) {
                                    if (map.hasLayer(W_tileLayer[tile]))
                                        map.removeLayer(W_tileLayer[tile]);
                                    layerControls.removeLayer(W_tileLayer[tile]);
                                }
                                map.addLayer(W_tileLayer.Weather);
                                $(".leaflet-layer:first").show();
                            }
                            W_easybutton.addSeparator();
                            W_weatherControl.baselayerState = 'empty';
                        } else {
                            $('#W_maptile').addClass("disable");
                            document.getElementById('W_maptile').removeEventListener('click', W_gadget.map);
                        }
                    },
                    timeline = document.getElementById("timeline");
                if (this.state === 'currents') {
                    W.setOverlay("currents");
                    timeline.style.display = "none";
                    tileCheckForLayerControl();
                } else if (this.state === 'waves') {
                    W.setOverlay("waves");
                    timeline.style.display = "block";
                    tileCheckForLayerControl();
                } else {
                    if (map.hasLayer(W_tileLayer.Weather))
                        timeline.style.display = "block";
                    if (this.baselayerState === 'empty' && W_easybar_sem.statebar) {
                        for (var obj in W_tileLayer)
                            layerControls.addBaseLayer(W_tileLayer[obj], obj);
                        W_easybutton.addSeparator();
                    }
                    if (!W_easybar_sem.statebar) {
                        $('#W_maptile').removeClass("disable");
                        document.getElementById('W_maptile').addEventListener('click', W_gadget.map);
                    }
                    this.baselayerState === 'full';
                }
            },
            button: function () {
                //use console.log(this) to check
                //console.log(this)
                var weather;
                if (this.id)
                    weather = this.id.replace(/^(W_)/, ""); //sidebar buttons
                else
                    weather = this.options.id; //easybuttons
                W_weatherControl.state = weather;
                if (weather !== "currents" && weather !== "waves")
                    W.setOverlay(weather);
                W_weatherControl.change();
            }
        },
        W_gadget = {
            measuring: function () {
                W_distance.button();
            },
            withMapChange: function () {
                if (map.hasLayer(W_tileLayer.Weather)) {
                    if (map.getZoom() > 11)
                        map.setZoom(11);
                    //Toggle windyty layers
                    $(".leaflet-layer:first").show();
                    document.querySelectorAll('div.leaflet-overlay-pane canvas').forEach(function (canvas) {
                        canvas.style.display = 'block';
                    });
                    //Weather buttons control
                    if (W_easybar_sem.statebar)
                        W_weatherControl.weather.forEach(function (weather) {
                            W_easybutton[weather].enable();
                        });
                    else
                        W_weatherControl.weather.forEach(function (weather) {
                            $('#W_' + weather).removeClass("disable");
                            document.getElementById('W_' + weather).addEventListener('click', W_weatherControl.button);
                        });
                    document.getElementById("timeline").style.display = "block";
                    W_layerGroup.ECAsNOxLayer.setStyle({
                        "color": "#fff",
                        "weight": "2"
                    });
                    W_layerGroup.ECAsNOxLayer.on('mouseout', function () {
                        this.setStyle({
                            "color": "#fff",
                            "weight": "2"
                        })
                    });
                } else {
                    $(".leaflet-layer:first").hide();
                    document.querySelectorAll('div.leaflet-overlay-pane canvas').forEach(function (canvas) {
                        canvas.style.display = 'none';
                    });
                    if (W_easybar_sem.statebar)
                        W_weatherControl.weather.forEach(function (weather) {
                            W_easybutton[weather].disable();
                        });
                    else
                        W_weatherControl.weather.forEach(function (weather) {
                            $('#W_' + weather).addClass("disable");
                            document.getElementById('W_' + weather).removeEventListener('click', W_weatherControl.button);
                        });
                    document.getElementById("timeline").style.display = "none";
                    W_layerGroup.ECAsNOxLayer.setStyle({
                        "color": "#EC7063",
                        "weight": "2"
                    });
                    W_layerGroup.ECAsNOxLayer.on('mouseout', function () {
                        this.setStyle({
                            "color": "#EC7063",
                            "weight": "2"
                        })
                    });
                }
                W_distance.drive();
            },
            map: function () {
                if (map.hasLayer(W_tileLayer.Weather)) {
                    map.removeLayer(W_tileLayer.Weather);
                    map.addLayer(W_tileLayer['Nautical Map']/*W_tileLayer['Streets Map']*/);
                } else {
                    map.removeLayer(W_tileLayer['Nautical Map']/*W_tileLayer['Streets Map']*/);
                    map.addLayer(W_tileLayer.Weather);
                }
                W_gadget.withMapChange();
            }
            /*,
            animation: function () {
            	if (W_animation.key) {
            		W.animation.stop();
            		W_animation.canvas1.style.opacity = 0;
            		setTimeout(function () {
            			W_animation.canvas1.style.transition = 'opacity 0.001s';
            			W_animation.canvas1.style.WebkitTransition = 'opacity 0.001s';
            		}, 500);
            		W_animation.key = 0;
            	} else {
            		W.animation.run();
            		W_animation.canvas1.style.opacity = 1;
            		W_animation.canvas1.style.transition = 'opacity 1.5s';
            		W_animation.canvas1.style.WebkitTransition = 'opacity 1.5s';
            		W_animation.key = 1;
            	}
            },
            gradient: function () {
            	if (W_animation.gradient3.style.opacity == 1) {
            		W_animation.gradient3.style.opacity = 0;
            		W_animation.gradcheck = W_animation.gradient3;
            	} else if (W_animation.gradient2.style.opacity == 1) {
            		W_animation.gradient2.style.opacity = 0;
            		W_animation.gradcheck = W_animation.gradient2;
            	} else if (W_animation.gradient3.style.opacity == 0 && W_animation.gradient2.style.opacity == 0) {
            		W_animation.gradcheck.style.opacity = 1;
            	}
            }*/
        },
        W_easybutton = {
            control: function () {
                var h = $(window).height(),
                    w = Math.max($(window).width(), window.innerWidth);
                if (W_easybar_sem.statebar) {
                    if (w < 767 || h < 646) {
                        W_easybar.state.removeFrom(map);
                        W_easybar.control.removeFrom(map);
                        searchControl.removeFrom(map);
                        layerControls.removeFrom(map);
                        W_easybar_sem.statebar = false;
                        W_weatherControl.change();
                    }
                } else {
                    if (!(w < 767 || h < 646)) {
                        W_easybar.state.addTo(map);
                        W_easybar.control.addTo(map);
                        searchControl.addTo(map);
                        layerControls.addTo(map);
                        W_easybutton.addSeparator();
                        W_easybar_sem.statebar = true;
                    }
                }
                W_gadget.withMapChange();
                W_weatherControl.change();
            },
            addSeparator: function () {
                var leafletOverlays = document.querySelector(".leaflet-control-layers-overlays"),
                    newSeparator = document.createElement("div");
                newSeparator.setAttribute("class", "leaflet-control-layers-separator");
                leafletOverlays.insertBefore(newSeparator, leafletOverlays.childNodes[3]);
            }
        },
        W_easybar = {},
        W_fleetPosition = {
            everG: {
                l: [],
                s: [],
                e: [],
                u: [],
                d: [],
                a: [],
                p: []
                /*,
                				c: [],
                				t: []*/
            },
            fleetTypeCat: function (a) {
                //a = W_layerGroup.track.toGeoJSON().features[i]
                for (var k in W_fleetPosition.everG)
                    if (a.properties['marker-symbol'] === k)
                        W_fleetPosition.everG[k].push({
                            title: a.properties.title,
                            coordinates: [a.geometry.coordinates[1], a.geometry.coordinates[0]],
                            description: a.properties.description,
                            time: a.properties.time,
                            course: a.properties.course,
                            speed: a.properties.speed,
                            symbol: a.properties.symbol,
                            color: a.properties['marker-color'],
                            type: a.properties['marker-symbol'],
                            'previous port': a.properties.preport,
                            'next port': a.properties.nextport,
                            eta: a.properties.eta
                        });
            },
            showLine: function (ship) {
                //console.log(ship);
                var shipName = ship.target._popup._contentNode.firstChild.innerHTML;
                if (!W_layerGroup.fleetsLine[shipName]) {
                    W_layerGroup.fleetsLine[shipName] = new L.layerGroup();
                    L.mapbox.featureLayer().loadURL("data/position_line/" + shipName + "_line.geojson").addTo(W_layerGroup.fleetsLine[shipName]);
                    W_layerGroup.fleetsLine[shipName].addTo(W_layerGroup.fleetsLine.layer);
                    //console.log(W_layerGroup.fleetsLine);
                } else {
                    W_layerGroup.fleetsLine[shipName].clearLayers();
                    delete W_layerGroup.fleetsLine[shipName];
                    //console.log(W_layerGroup.fleetsLine);
                }
            },
            plotMarker: function (a) {
                //a = everG.type
                a.forEach(plot);

                function plot(ship) {
                    var fleet_marker_option = {
                            size: 27,
                            fill: 1,
                            fillColor: ship.color,
                            fillOpacity: 1.0,
                            stroke: true,
                            color: '#000',
                            opacity: 1.0,
                            weight: 1.5,
                            speed: (ship.speed) / 0.5144,
                            leaderTime: Math.exp(((22 - map.getZoom()) / 2)),
                            course: ship.course * Math.PI / 180.0,
                            heading: ship.course * Math.PI / 180.0
                        },
                        fleet_popup = '<b>' + ship.title + '</b>' + '<br>' +
                        'Time: ' + ship.time + '<br>' +
                        'Position: ' + ship.description + '<br>' +
                        'Speed: ' + ship.speed + '<br>' +
                        'Heading: ' + ship.course + '<br>' +
                        'Previous port: ' + ship['previous port'] + '<br>' +
                        'Next port: ' + ship['next port'] + '<br>' +
                        'ETA: ' + ship.eta,
                        fleet_marker = L.trackSymbol(ship.coordinates, fleet_marker_option)
                        .bindPopup(fleet_popup).addTo(W_layerGroup.fleets[ship.type]);
                    fleet_marker.on('click', W_fleetPosition.showLine);
                }
            },
            plotLabel: function (a) {
                //a = everG.type
                a.forEach(plot);

                function plot(ship) {
                    //					console.log(ship);
                    var labelIcon = L.icon({
                            iconUrl: 'Icons/easybutton/wind.png',
                            iconSize: [0, 0],
                            iconAnchor: [0, 0],
                            labelAnchor: [16, 0]
                        }),
                        fleet_label = L.marker(ship.coordinates, {
                            icon: labelIcon,
                            ship: ship.title
                        }).bindLabel(ship.title.replace(/^(EVER|UNI-|THALASSA|ITAL)/, ''), {
                            noHide: true,
                            direction: 'right',
                            className: 'fleetLabels ' + ship.type + '-typeFleets'
                        }).addTo(W_layerGroup.fleets['labels']);
                }
            },
            overlays: {
                'ECA zones': W_layerGroup.ECAsNOxLayer.addTo(map),
                OpenSeaMap: L.tileLayer('http://tiles.openseamap.org/seamark/{z}/{x}/{y}.png').addTo(map),
                Labels: W_layerGroup.fleets['labels'].addTo(map)
            },
            zoomChangeFleetsSpeed: function () {
                for (var obj in W_fleetPosition.everG) {
                    W_layerGroup.fleets[obj].clearLayers();
                    W_fleetPosition.plotMarker(W_fleetPosition.everG[obj]);
                }
            },
            overlayChangeLabels: function (overlay) {
                var layer = overlay.name;
                if (layer === 'Labels') {
                    for (var ship in W_fleetPosition.everG) {
                        if (!map.hasLayer(W_layerGroup.fleets[ship]))
                            toggleDisplay(false, ship);
                        else
                            toggleDisplay(true, ship);
                    }
                } else if (layer.search(/-TYPEs/) !== -1) {
                    var shipType = layer[29].toLowerCase();
                    if (!map.hasLayer(W_layerGroup.fleets[shipType]))
                        toggleDisplay(false, shipType);
                    else
                        toggleDisplay(true, shipType);
                }

                function toggleDisplay(boolean, ship) {
                    var x = document.getElementsByClassName(ship + '-typeFleets'),
                        i = 0,
                        length = x.length;
                    if (boolean)
                        for (i = 0; i < length; i++)
                            x[i].style.display = "block";
                    else
                        for (i = 0; i < length; i++)
                            x[i].style.display = "none";
                }
            }
        },
        W_tileLayer = {
            /*OpenStreetMap: L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            	maxZoom: 19,
            	minZoom: 3,
            	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }),
            Satellite: L.mapbox.tileLayer("mapbox.streets-satellite", {
            	format: 'jpg70',
            	zIndex: 200,
            	maxZoom: 19,
            	minZoom: 3,
            	maxNativeZoom: 19,
            	minNativeZoom: 3
            }),
            'Streets Map': L.mapbox.tileLayer("mapbox.streets", {
                format: 'jpg70',
                zIndex: 200,
                maxZoom: 19,
                minZoom: 3
            }),*/
            'Nautical Map': L.tileLayer("http://wms.transas.com/TMS/1.0.0/TX97/{z}/{x}/{y}.png?token=114c0d17-9ca1-4edf-9b9b-6e1aff73fbf0", {
                edgeBufferTiles: 2,
                tms: !0,
                maxZoom: 19,
                minZoom: 3
            }),
            /*
            			Ocean: L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/{z}/{y}/{x}', {
            				attribution: 'Tiles &copy; Esri &mdash; Sources: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ, and Esri',
            				maxZoom: 9,
            				minZoom: 3
            			}),*/
            Weather: L.tileLayer("", {
                maxZoom: 11,
                minZoom: 3
            }).addTo(map)
        },
        W_distance = {
            position1: [25.154, 121.377],
            position2: [27.154, 123.377],
            constant: 2.0,
            marker1: L.marker([25.154, 121.377], {
                draggable: true,
                icon: L.mapbox.marker.icon({
                    'marker-size': 'large',
                    'marker-symbol': 'ferry',
                    'marker-color': '#FF8040'
                }),
                zIndexOffset: 50
            }),
            marker2: L.marker([27.154, 123.377], {
                draggable: true,
                icon: L.mapbox.marker.icon({
                    'marker-size': 'large',
                    'marker-symbol': 'harbor',
                    'marker-color': '#FF8040'
                }),
                zIndexOffset: 49
            }),
            displayKM: null,
            displayNM: null,
            buttonSwitch: false,
            markerSwitch: false,
            line: L.polyline([[25.154, 121.377], [27.154, 123.377]], {
                color: 'white',
                zIndex: 200
            }),
            greatcircle: L.Polyline.Arc([25.154, 121.377], [27.154, 123.377], {
                color: 'red',
                vertices: 200
            }),
            //'Polyline' is used for great circle and 'polyline' is used for leaflet polyline
            //cf. polyline([[coordinate1],[coordinate2]])
            //    Polyline([coordinate1],[coordinate2])
            centerPosition: function () {
                if (!W_distance.buttonSwitch) {
                    W_distance.position1 = map.getCenter();
                    W_distance.position2 = [W_distance.position1.lat + W_distance.constant, W_distance.position1.lng + W_distance.constant];
                    W_distance.marker1.setLatLng(W_distance.position1);
                    W_distance.marker2.setLatLng(W_distance.position2);
                }
            },
            button: function () {
                var km = document.getElementById('distance_kilometer'),
                    nm = document.getElementById('distance_nauticalmile'),
                    markerPosition = document.getElementById('markerposition');
                if (this.buttonSwitch) {
                    W_layerGroup.marker.clearLayers();
                    W_layerGroup.line.clearLayers();
                    this.buttonSwitch = false;
                } 
                else {
                    this.marker1.addTo(W_layerGroup.marker);
                    this.marker2.addTo(W_layerGroup.marker);
                    this.line.bindPopup('<p style="margin: 0px; padding: 0px; font-size: 16px;">Rhumb Line</p>').addTo(W_layerGroup.line);
                    this.greatcircle.bindPopup('<p style="margin: 0px; padding: 0px; font-size: 16px;">Great Circle</p>').addTo(W_layerGroup.line);
                    km.innerHTML = this.displayKM + ' km';
                    nm.innerHTML = this.displayNM + " nm";
                    this.buttonSwitch = true;
                }
                if (this.markerSwitch) {
                    markerPosition.style.opacity = 0;
                    this.markerSwitch = false;
                } 
                else {
                    markerPosition.style.opacity = 0.6;
                    this.markerSwitch = true;
                }
            },
            drive: function () {
                var m1 = W_distance.marker1.getLatLng(),
                    m2 = W_distance.marker2.getLatLng(),
                    km = document.getElementById('distance_kilometer'),
                    nm = document.getElementById('distance_nauticalmile');
                W_distance.displayKM = (m1.distanceTo(m2) / 1000).toFixed(3),
                W_distance.displayNM = (W_distance.displayKM / 1.852).toFixed(3);
                km.innerHTML = W_distance.displayKM + ' km';
                nm.innerHTML = W_distance.displayNM + " nm";
                if (m1.lng > m2.lng)
                    //					[m1, m2] = [m2, m1];	//ES6 Destructuring assignment
                    m2 = [m1, m1 = m2][0]; //fix greatcircle line               
                W_layerGroup.line.clearLayers();
                W_distance.line = L.polyline([[m1.lat, m1.lng], [m2.lat, m2.lng]]).bindPopup('<p style="margin: 0px; padding: 0px; font-size: 16px;">Rhumb Line</p>');
                W_distance.greatcircle = L.Polyline.Arc([m1.lat, m1.lng], [m2.lat, m2.lng], {
                    color: 'red',
                    vertices: 200
                }).bindPopup('<p style="margin: 0px; padding: 0px; font-size: 16px;">Great Circle</p>');
                W_distance.line.setStyle({
                    color: 'white'
                });
                if (map.hasLayer(W_tileLayer.Weather) || map.hasLayer(W_tileLayer.Satellite)) {
                    W_distance.line.setStyle({
                        color: 'white'
                    });
                } else {
                    W_distance.line.setStyle({
                        color: 'black'
                    });
                };
                if (W_distance.buttonSwitch) {
                    W_distance.line.addTo(W_layerGroup.line);
                    W_distance.greatcircle.addTo(W_layerGroup.line);
                };
            }
        },
        W_dynamic = {
            marker: null,
            geojson: null,
            counter: 0,
            checkPoint: 0,
            interval: 500,
            timer: function () {},
            load: function (url) {
                W_layerGroup.routeAnimate.clearLayers();
                $.ajax({
                    headers: {
                        'Accept': 'application'
                    },
                    xhrFields: {
                        withCredentials: false
                    },
                    dataType: 'json',
                    url: url,
                    success: this.animation
                });
            },
            animation: function (geojson) {
                var geometry = geojson.features[0].geometry;
                W_dynamic.marker = L.marker([geometry.coordinates[1], geometry.coordinates[0]], {
                        icon: L.mapbox.marker.icon({
                            'marker-size': 'large',
                            'marker-color': '#f86767',
                            'marker-symbol': 'ferry'
                        }),
                        zIndexOffset: 51
                    }).addTo(W_layerGroup.routeAnimate);
                W_layerGroup.routeAnimate.addTo(W_layerGroup.routeGroup);
                W_dynamic.geojson = geojson;
                W_dynamic.tick();
            },
            tick: function () {
                W_dynamic.checkPoint = W_dynamic.geojson.features[W_dynamic.counter].geometry.type.length;
                if (W_dynamic.checkPoint === 5) {
                    W_dynamic.marker.setLatLng(L.latLng(
                        W_dynamic.geojson.features[W_dynamic.counter].geometry.coordinates[1], W_dynamic.geojson.features[W_dynamic.counter].geometry.coordinates[0]));
                    ++W_dynamic.counter;
                    W_dynamic.timer = setTimeout(W_dynamic.tick, W_dynamic.interval);
                } else {
                    W_dynamic.counter = 0;
                    clearTimeout(W_dynamic.timer);
                    W_dynamic.timer = setTimeout(W_dynamic.tick, W_dynamic.interval);
                };
            }
        },
        W_timeline = {
            weekdays: ['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.'],
            months: ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.'],
            present: {
                Hour: new Date().getHours(),
                HourSec: function () {
                    return this.Hour * 3600000
                },
                Weekday: new Date().getDay(),
                Date: new Date().getDate(),
                Month: new Date().getMonth(),
                Time: function () {
                    return W_timeline.months[this.Month] + ' ' + this.Date + '  ' + W_timeline.weekdays[this.Weekday] + ' ' + this.Hour + ':00'
                }
            },
            length: 7 * 24 * 3600000,
            slider: {
                range: document.getElementById('slider'),
                display: document.getElementById('timePopup'),
                calendarPointer: (((parseInt(document.getElementById('slider').value) - W.timeline.start) / 3600000) / 168) * 100,
                change: function () {
                    var slider_time = new Date(parseInt(event.target.value));
                    W_timeline.slider.display.innerHTML = W_timeline.months[slider_time.getMonth()] + ' ' + slider_time.getDate() + '  ' + W_timeline.weekdays[slider_time.getDay()] + ' ' + slider_time.getHours() + ':00';
                    W.setTimestamp(event.target.value); //event.target represent the slider
                    var calendar_pointer_left = (((parseInt(event.target.value) - W.timeline.start) / 3600000) / 168) * 100;
                    document.getElementById('calendarpointer-pointer').style.left = calendar_pointer_left + '%';
                    document.getElementById('timePopup').style.left = (calendar_pointer_left - 1) + '%';
                }
            },
            select: function (date) {
                var n = parseInt(date.target.id[15]),
                    slider_time = new Date(n * 24 * 3600000 + W_timeline.present.HourSec() + W.timeline.start),
                    calendar_pointer_left = (((n * 24 * 3600000 + W_timeline.present.HourSec()) / 3600000) / 168) * 100;
                W_timeline.slider.display.innerHTML = W_timeline.months[slider_time.getMonth()] + ' ' + slider_time.getDate() + '  ' + W_timeline.weekdays[slider_time.getDay()] + ' ' + slider_time.getHours() + ':00';
                document.getElementById('calendarpointer-pointer').style.left = calendar_pointer_left + '%';
                W_timeline.slider.display.style.left = (calendar_pointer_left - 1) + '%';
                W_timeline.slider.range.value = n * 24 * 3600000 + W_timeline.present.HourSec() + W.timeline.start;
                W.setTimestamp(n * 24 * 3600000 + W_timeline.present.HourSec() + W.timeline.start);
            }
        };
    /*,
    	W_weatherDisplay = {
    		display: W.timeline.start + W_timeline.present.HourSec(),
    		maxTime: W.timeline.start + 3600000 * 24 * 7,
    		walkTime: function(){
    			var slider = window['slider'],
    				timePopup = window['timePopup'],
    				calendarPointer = window['calendarpointer-pointer'];
    			slider.value += 3600000;
    			W.setTimestamp(parseInt(slider.value));
    			W_weatherDisplay.play = setTimeout(W_weatherDisplay.walkTime, 2500);
    		},
    		play: setTimeout(W_weatherDisplay.walkTime, 2500),
    		stop: clearTimeout(W_weatherDisplay.play)
    	}*/

    W_route.initLine();
    ! function () {
        var state = [],
            control = [];
        W_weatherControl.weather.forEach(function (weather) {
            W_easybutton[weather] = L.easyButton({
                states: [{
                    stateName: weather + "-button",
                    onClick: W_weatherControl.button,
                    title: weather,
                    icon: '<img src="Icons/easybutton/' + weather + '.png">'
				}],
                id: weather
            });
            state.push(W_easybutton[weather]);
            document.getElementById('W_' + weather).addEventListener('click', W_weatherControl.button);
        });
        W_easybutton['measuring'] = L.easyButton({
            states: [{
                stateName: "measuring-button",
                onClick: W_gadget['measuring'],
                title: 'measuring',
                icon: '<img src="Icons/easybutton/measuring.png">'
				}],
            id: 'measuring'
        });
        control.push(W_easybutton['measuring']);
        document.getElementById('W_measuring').addEventListener('click', W_gadget['measuring']);
        document.getElementById('W_maptile').addEventListener('click', W_gadget.map);
        W_easybar["state"] = L.easyBar(state).addTo(map);
        W_easybar["control"] = L.easyBar(control).addTo(map);
    }();
    //parse ships
    //toGeoJSON works when geojsons are loaded(featureLayer.loadURL) outside the windytyMain function.
    W_layerGroup.track.toGeoJSON().features.forEach(W_fleetPosition.fleetTypeCat);
    W_layerGroup.fleetsLine.layer.addTo(map);
    //overlays加入船位
    for (var ship in W_fleetPosition.everG) {
        W_fleetPosition.plotMarker(W_fleetPosition.everG[ship]);
        W_fleetPosition.plotLabel(W_fleetPosition.everG[ship]);
        W_fleetPosition.overlays['<span style="color:' + W_fleetPosition.everG[ship][0].color + ';">' + ship.toUpperCase() + '-TYPEs</span>'] = W_layerGroup.fleets[ship].addTo(map);
    };
    //Controls
    var searchControl = new L.Control.Search({
            position: 'topright',
            layer: W_layerGroup.fleets.labels,
            initial: false,
            zoom: 8,
            marker: false,
            propertyName: 'ship',
            textErr: 'Ship not found...',
            textPlaceholder: 'Ship Name'
        }).addTo(map),
        layerControls = L.control.layers(W_tileLayer, W_fleetPosition.overlays, {
            position: 'topright',
            collapsed: true
        }).addTo(map);

    //Add a separator in overlay
    W_easybutton.addSeparator();

    map.on('zoomend', W_fleetPosition.zoomChangeFleetsSpeed);
    map.on('baselayerchange', W_gadget.withMapChange);
    map.on('overlayadd overlayremove', W_fleetPosition.overlayChangeLabels);
    //set min zoom level in Street Map
    map.on('zoomend', function () {
        if (map.getZoom() < 3)
            map.setZoom(3);
        if (map.hasLayer(W_tileLayer.Weather) && map.getZoom() > 11)
            map.setZoom(11);
    });
    // detect window size for leaflet easybutton
    W_easybutton.control();
    $(document).ready(function () {
        $(window).resize(W_easybutton.control);
    });

    if (L.Browser.mobile) {
        document.querySelector(".leaflet-touch .leaflet-control-layers-toggle").style.width = "30px";
        document.querySelector(".leaflet-touch .leaflet-control-layers-toggle").style.height = "30px";
        document.querySelectorAll(".easy-button-button .button-state").forEach(function (tag) {
            tag.style.left = "-15%";
        });
    }

    //LayerGroups
    W_layerGroup.routeGroup.addTo(map); //Route layerGroup
    W_layerGroup.markerGroup.addTo(map); //Measure marker layerGroups
    W_layerGroup.fleetsLine.layer.addTo(map);
    W_layerGroup.marker.addTo(W_layerGroup.markerGroup);
    W_layerGroup.line.addTo(W_layerGroup.markerGroup);

    //Route button control
    document.getElementById("line").onchange = W_route.changeLine;
    document.getElementById("route").onchange = W_route.create;
    document.getElementById('reset').onclick = W_route.clear;

    W_timeline.slider.range.min = W.timeline.start;
    W_timeline.slider.range.step = 3600000; //3600000 seconds = 1 hour
    W_timeline.slider.range.max = W.timeline.start + W_timeline.length;
    W_timeline.slider.range.value = W.timeline.start + W_timeline.present.HourSec();
    //W.timeline.start gives 0:00 of the day as input time, and adding 'presentHourSec' to give present time as input
    W_timeline.slider.range.addEventListener('input', W_timeline.slider.change);
    W_timeline.slider.display.innerHTML = W_timeline.present.Time();
    W_timeline.slider.display.style.left = ((((parseInt(document.getElementById('slider').value) - W.timeline.start) / 3600000) / 168) * 100 - 1) + '%';
    document.getElementById('calendarpointer-pointer').style.left = (((parseInt(document.getElementById('slider').value) - W.timeline.start) / 3600000) / 168) * 100 + '%';

    //loop for displaying the present date
    //Calendar quick click
    for (i = 0; i < 7; i++) {
        var j = (i + W_timeline.present.Weekday) % 7,
            table_name = 'calendar-table-',
            date_counter = i * 86400000;
        W_timeline.present.Date = new Date(W.timeline.start + date_counter).getDate();
        table_name += i;
        document.getElementById(table_name).innerHTML = W_timeline.weekdays[j] + ' ' + W_timeline.present.Date;
        document.getElementById(table_name).onclick = W_timeline.select;
    }

    //Measuring Distance
    W_distance.displayKM = (W_distance.marker1.getLatLng().distanceTo(W_distance.marker2.getLatLng()) / 1000).toFixed(3);
    W_distance.displayNM = (W_distance.displayKM / 1.852).toFixed(3);
    W_distance.marker1.on('move', W_distance.drive);
    W_distance.marker2.on('move', W_distance.drive);
    map.on('move', W_distance.centerPosition);

    //Cursor position
    map.on('mousemove', cursor);
    function cursor(mouse) {
        var lat = Math.abs(mouse.latlng.lat.toPrecision(9)),
            lng = Math.abs(mouse.latlng.wrap(-180, 180).lng.toPrecision(9)),
            latdeg = parseInt(lat),
            lngdeg = parseInt(lng),
            latf = Math.abs(lat - parseFloat(latdeg)),
            lngf = Math.abs(lng - parseFloat(lngdeg)),
            latmin = (latf * 60).toPrecision(5),
            lngmin = (lngf * 60).toPrecision(5);
        var mousePosition = document.getElementById('mouseposition'),
            cursor = document.getElementById('cursor');
        var we = '',
            ns = '';
        if (mouse.latlng.lat >= 0) {
            ns = 'N';
        } else {
            ns = 'S';
        }
        if (mouse.latlng.wrap(-180, 180).lng >= 0) {
            we = 'E';
        } else {
            we = 'W';
        }
        var cursor_pos = latdeg.toString() + '° ' + latmin.toString() + "' " + ns + ', ' + lngdeg.toString() + '° ' + lngmin.toString() + "' " + we;
        cursor.innerHTML = cursor_pos;
        mousePosition.style.opacity = 0.6;
        mousePosition.style.transition = 'opacity 0.5s';
        mousePosition.style.WebkitTransition = 'opacity 0.5s';
        setTimeout(fadeout, 3000);

        function fadeout() {
            if (cursor_pos == cursor.innerHTML)
                mousePosition.style.opacity = 0.2;
        }
    }

    //
    ////Search Bar

    //string splice
    String.prototype.splice = function (index, remainder, string) {
        return this.slice(0, index) + string + this.slice(index + Math.abs(remainder));
    };
    var searchTarget = function (start, end) {
            var searchStart = "//*[contains(start, '')]/",
                searchEnd = "//*[contains(end, '')]/",
                searchHarbor = "//*[contains(harbor, '')]/",
                searchArray = ["start", "end", "harbor", "path", "distanceInNM"],
                target = {};
            start = start.toUpperCase();
            end = end.toUpperCase();
            var searchBar = window["search_bar"],
                searchResult = window["search_result"],
                search;
            searchBar.style.height = '50%';
            searchResult.style.height = '100%';
            if (start !== '' && end === '') {
                search = searchStart.splice(21, 0, start);
                searchArray.forEach(function (item) {
                    if (item !== "end")
                        target[item] = JSON.search(routeCatalogue, search + item);
                });
            } else if (start === '' && end !== '') {
                search = searchEnd.splice(19, 0, end);
                searchArray.forEach(function (item) {
                    if (item !== "start")
                        target[item] = JSON.search(routeCatalogue, search + item);
                });
            } else if (start !== '' && end !== '') {
                search = searchHarbor.splice(22, 0, start + "-" + end);
                searchArray.forEach(function (item) {
                    if (item !== "start" && item !== "end")
                        target[item] = JSON.search(routeCatalogue, search + item); //JSON.search(json, key)
                });
            } else {
                searchBar.style.height = '0%';
                searchResult.style.height = '0%';
                return;
            }
            showSearchItems(target.harbor.length, target.harbor, target.path, target.distanceInNM);

        },
        routeCatalogue = undefined,
        searchEvent = function () {
            searchTarget(window["from_harbor"].value, window["to_harbor"].value);
        },
        parseRouteShip = function (path, harbor) {
            var temp = path.replace(/^data\/GeoJSON\//, "").replace(/\.geojson$/, "").replace('-' + harbor, "");
            return temp.split('/');
        },
        showSearchItems = function (length, harbors, paths, distances) {
            var route, ship, harbor, distance, all, routeShipArray,
                searchBar = window["search_bar"],
                searchResult = window["search_result"];
            while (searchResult.childNodes[0])
                searchResult.removeChild(searchResult.childNodes[0]);
            if (length === 0) {
                searchBar.style.height = '0%';
                searchResult.style.height = '0%';
            } else {
                for (var i = 0; i < length; i++) {
                    routeShipArray = parseRouteShip(paths[i], harbors[i]);
                    route = $("<p></p>").text("Route: " + routeShipArray[0]);
                    ship = $("<p></p>").text("Ship: " + routeShipArray[1]);
                    distance = $("<p></p>").text("Distance: " + distances[i] + " nm");
                    harbor = $("<p></p>").html('<div id="mark" style="display: inline">' + harbors[i] + '</div>').prepend("Harbor: ");
                    all = $("<li></li>").append(route, ship, harbor, distance).attr({
                        id: 'search' + i
                    });
                    $('#search_result').append(all);
                    var showhitoryRoute = function () {
                        var path = paths[i];
                        return function () {
                            searchClick(path);
                        };
                    };
                    //要先建立一個scope來存放位址才不會被覆蓋掉
                    $('#search' + i).one('click', showhitoryRoute());
                }
                searchResult.querySelectorAll("li p").forEach(function (p) {
                    p.style.margin = "0px";
                });
                searchResult.querySelectorAll("li").forEach(function (li) {
                    li.style.margin = "20px 0px";
                });
            }
            keyMark(window["from_harbor"].value.toUpperCase());
            keyMark(window["to_harbor"].value.toUpperCase());
        },
        keyMark = function (key) {
            $("[id$=mark]").html(function (n, c) {
                return c.replace(key, '<mark>' + key + '</mark>');
            });
        },
        searchClick = function (path) {
            var geoLayer = new L.mapbox.featureLayer();
            geoLayer.loadURL(path).addTo(W_layerGroup.routeGroup);
            geoLayer.on('ready', function () {
                map.fitBounds(geoLayer.getBounds());
            });
        };
    $(document).ready(function () {
        $("[id$=harbor]").on({
            keyup: searchEvent,
            mouseup: function () {
                setTimeout(searchEvent, 1);
            }
        });
        var searchBar = document.getElementById('search_bar'),
            loadCatalogue = function () {
            $.getJSON("data/Route_Catalogue.json", function (json) {
                if (!routeCatalogue) {
                    routeCatalogue = json;
                }
            });
            searchBar.removeEventListener('mouseover', loadCatalogue);
            //Only execute once.
        };
        searchBar.addEventListener('mouseover', loadCatalogue);
    });
}