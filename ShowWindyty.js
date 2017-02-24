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
	L.control.scale({
		position: 'topright',
		maxWidth: 100
	}).addTo(map);
	
	//
	////animation control
	var W_animation = {
		gradient2: document.getElementsByClassName("leaflet-canvas2 leaflet-zoom-animated")[0],
		gradient3: document.getElementsByClassName("leaflet-canvas3 leaflet-zoom-animated")[0],
		gradcheck: {},
		key: 1,
		canvas1: document.getElementsByClassName("leaflet-canvas1 leaflet-zoom-animated")[0],
		keep: function() {
			if (!this.key) {
				W.animation.stop();
				this.canvas1.style.opacity = 0;
				setTimeout(function () {
					this.canvas1.style.transition = 'opacity 0.001s';
					this.canvas1.style.WebkitTransition = 'opacity 0.001s';
				}, 500);
				this.key = 0;
			}
		}
	}
	W_animation.canvas1.addEventListener('transitionend', W_animation.keep);
	//Because 'transitionstart' event didn't exist in W3C rules, it is a little tricky to change the transition time into 0.001s to fool your eyes.
	////
	//
	
	var W_easybar_sem = {
			statebar: true,
			Switch: true,
			count: 1
		},//W_statebar_c boolean for detecting leaflet easybar.
		W_weather = {
			wind: function() {
				W.setOverlay("wind");
				setButtonState();
				W_easybar_sem.switch = false;
				map_tile_change();
			},
			temp: function() {
				W.setOverlay("temp");
				setButtonState();
				W_easybar_sem.switch = false;
				map_tile_change();
			},
			rain: function() {
				W.setOverlay("clouds");
				setButtonState();
				W_easybar_sem.switch = false;
				map_tile_change();
			},
			press: function() {
				W.setOverlay("pressure");
				setButtonState();
				W_easybar_sem.switch = false;
				map_tile_change();
			},
			waves: function() {
				W.setOverlay("waves");
				setButtonState();
				tile_switch_empty = false;
				tile_switch = false;
				tile_group.clearLayers();
				change_tile();
				W_easybar_sem.switch = true;
				map_tile_change();
			},
			currents: function() {
				W.setOverlay("currents");
				setButtonState();
				document.getElementById("timeline").style.display = "none";
				tile_switch_empty = false;
				tile_switch = false;
				tile_group.clearLayers();
				change_tile();
				W_easybar_sem.switch = true;
				map_tile_change();
			}
		},	
		W_gadget = {
			measuring: function() {
				distance_button();
				show_marker_position();
			},
			animation: function() {
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
			gradient: function() {
				if(W_animation.gradient3.style.opacity == 1){
					W_animation.gradient3.style.opacity = 0;
					W_animation.gradcheck = W_animation.gradient3;
				}
				else if(W_animation.gradient2.style.opacity == 1){
					W_animation.gradient2.style.opacity = 0;
					W_animation.gradcheck = W_animation.gradient2;
				}
				else if(W_animation.gradient3.style.opacity == 0 && W_animation.gradient2.style.opacity == 0){
					W_animation.gradcheck.style.opacity = 1;
				}
			}
		},
		W_easybutton = {
			wind: L.easyButton({
				states: [{
						stateName: "wind-button",
						onClick: W_weather.wind,
						title: "Wind",
						icon: '<img src="Icons/wind.png">'
					}]
				}),
				temp: L.easyButton({
					states: [{
						stateName: "temp-button",
						onClick: W_weather.temp,
						title: "Temperature",
						icon: '<img src="Icons/temp.png">'
					}]
				}),
				rain: L.easyButton({
					states: [{
						stateName: "rain-button",
						onClick: W_weather.rain,
						title: "Rain",
						icon: '<img src="Icons/rain.png">'
													}]
				}),
				pressure: L.easyButton({
					states: [{
						stateName: "pressure-button",
						onClick: W_weather.press,
						title: "Pressure",
						icon: '<img src="Icons/pressure.png">'
													}]
				}),
				waves: L.easyButton({
					states: [{
						stateName: "waves-button",
						onClick: W_weather.waves,
						title: "Waves",
						icon: '<img src="Icons/waves.png">'
													}]
				}),
				currents: L.easyButton({
					states: [{
						stateName: "currents-button",
						onClick: W_weather.currents,
						title: "Currents",
						icon: '<img src="Icons/currents.png">'
													}],
					id: 'current'
				}),
				gradient: L.easyButton({
					states: [{
						stateName: "Gradient-button",
						onClick: W_gadget.gradient,
						title: "Gradient",
						icon: '<img src="Icons/gradient.png">'
													}],
					id: 'gradient'
				}),
				animation: L.easyButton({
					states: [{
						stateName: "animation-button",
						onClick: W_gadget.animation,
						title: "Animation",
						icon: '<img src="Icons/animation_toggle.png">'
													}],
					id: 'animation'
				}),
				measuring: L.easyButton({
					states: [{
						stateName: "measure-button",
						onClick: W_gadget.measuring,
						title: "Measure Distance",
						icon: '<img src="Icons/measuring.png">'
												}]
				}),
				maptile: L.easyButton({
					states: [{
						stateName: "maptile-button",
						onClick: change_tile,
						title: "Maps",
						icon: '<img src="Icons/maptile.png">'
													}]
				})
		},
		W_easybar = {
			state: L.easyBar([W_easybutton.wind, W_easybutton.temp, W_easybutton.rain,	W_easybutton.pressure, W_easybutton.waves, W_easybutton.currents]).addTo(map),
			control: L.easyBar([W_easybutton.measuring, W_easybutton.maptile, W_easybutton.animation, W_easybutton.gradient]).addTo(map)
		};
	
	//
	//Right side buttons
	function map_tile_change() {
		if (W_easybar_sem.switch) {
			if (W_easybar_sem.count === 1) {
				W_easybutton.maptile.disable();
				window['W_change_tile'].classList.toggle('disable');
				window['W_change_tile'].removeAttribute('onclick');
				W_easybar_sem.count -= 1;
			}
		} else if (!W_easybar_sem.switch) {
			if (W_easybar_sem.count === 0) {
				W_easybutton.maptile.enable();
				window['W_change_tile'].classList.toggle('disable');
				window['W_change_tile'].setAttribute('onclick', 'change_tile()');
				W_easybar_sem.count += 1;
			}
		}
	}

	//
	////Layers control
	////toGeoJSON works when geojsons must be loaded(featureLayer.loadURL) outsite the windytyMain function.
	/*var myIcon = L.icon({
			iconUrl: 'Icons/emc/EMC10.gif',
			iconSize: [60, 60],
			iconAnchor: [40, 40],
			labelAnchor: [10, 0] // as I want the label to appear 2px past the icon (10 + 2 - 6)
		});
	L.marker([25, 121.2606], {
		icon: myIcon
	}).bindLabel('Look revealing label!').addTo(map);*/

	for (i = 0; i < trackLayer.toGeoJSON().features.length; i++) {
		var fleet_lat = trackLayer.toGeoJSON().features[i].geometry.coordinates[1],
			fleet_lon = trackLayer.toGeoJSON().features[i].geometry.coordinates[0],
			fleet_name = trackLayer.toGeoJSON().features[i].properties.title,
			shipnum = 'Icons/emc/EMC' + parseInt(1 + Math.random() * 15) + '.gif'
			shipIcon = L.icon({
				iconUrl: shipnum,
				iconSize: [60, 60],
				iconAnchor: [40, 40],
				labelAnchor: [10, 0] // as I want the label to appear 2px past the icon (10 + 2 - 6)
			}),
			fleet_marker = L.marker([fleet_lat, fleet_lon], {
				icon: shipIcon
			})
		.bindLabel(trackLayer.toGeoJSON().features[i].properties.title, { noHide: true, direction: 'auto'})
		.bindPopup('<b>' + trackLayer.toGeoJSON().features[i].properties.title + '</b>' + '<br>' + trackLayer.toGeoJSON().features[i].properties.description)
		.addTo(fleets_layer);
	};
	
	var overlays = {
//		'L-types': fleets_layer.addTo(map),
//		'L': tracklineLayer,
		'ECA zones': ECAlayerGroup.addTo(map)
	};
	
	var layer_controls = L.control.layers({}, overlays, {
		"position": 'topright',
		"collapsed": true
	}).addTo(map);
	
	////
	////
	//////// detect window size for leaflet easybutton

	function leaflet_easybutton_control() {
		var h = $(window).height(),
			w = Math.max($(window).width(), window.innerWidth);
		if (W_easybar_sem.statebar) {
			if (w < 788 || h < 646) {
				W_easybar.state.removeFrom(map);
				W_easybar.control.removeFrom(map);
				layer_controls.removeFrom(map);
				W_easybar_sem.statebar = false;
			}
		} else {
			if (!(w < 788 || h < 646)) {
				W_easybar.state.addTo(map);
				W_easybar.control.addTo(map);
				layer_controls.addTo(map);
				W_easybar_sem.statebar = true;
			}
		};
	};
	leaflet_easybutton_control();
	
	$(document).ready(function () {
		$(window).resize(leaflet_easybutton_control);
	});
	
	document.getElementById('W_wind').onclick = W_weather.wind;
	document.getElementById('W_temp').onclick = W_weather.temp;
	document.getElementById('W_rain').onclick = W_weather.rain;
	document.getElementById('W_press').onclick = W_weather.press;
	document.getElementById('W_waves').onclick = W_weather.waves;
	document.getElementById('W_currents').onclick = W_weather.currents;
	document.getElementById('W_measuring').onclick = W_gadget.measuring;
	document.getElementById('W_change_tile').setAttribute('onclick', 'change_tile()');
	//change_tile function is not in windytyMain()
	document.getElementById('W_animation').onclick = W_gadget.animation;
	document.getElementById('W_gradient').onclick = W_gadget.gradient;
	
	//LayerGroups
	ECAlayerGroup.addTo(map); //ECA layerGroup
	geolayerGroup.addTo(map); //Route layerGroup
	markerlayerGroup.addTo(map); //Measure marker layerGroups
	tile_group.addTo(map); //Tile layerGroups
	markerlayer.addTo(markerlayerGroup);
	linelayer.addTo(markerlayerGroup);
	
	//Route button control
	var route = document.getElementById("route");
	route.onchange = function () {
		createroute();
	};
	var resetButton = document.getElementById('reset');
	resetButton.onclick = function () {
		clearroute();
	};
	
	//
	////timeline
	var W_timeline = {
			weekdays: ['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.'],
			months: ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.'],
			present: {
				Hour: new Date().getHours(),
				HourSec: function(){return this.Hour * 3600000},
				Weekday: new Date().getDay(),
				Date: new Date().getDate(),
				Month: new Date().getMonth(),
				Time: function(){return W_timeline.months[this.Month] + ' ' + this.Date + '  ' + W_timeline.weekdays[this.Weekday] + ' ' + this.Hour + ':00'}
			},
			End: 7 * 24 * 3600000
		};
	var range = document.getElementById('slider');
	range.min = W.timeline.start;
	range.step = 3600000; //3600000 seconds = 1 hour
	range.max = W.timeline.start + W_timeline.End;
	range.value = W.timeline.start + W_timeline.present.HourSec();
	//W.timeline.start gives 0:00 of the day as input time, and adding 'presentHourSec' to give present time as input
	var presentIntTime = parseInt(range.value), //range.value returns string
		calendar_pointer = (((parseInt(range.value) - W.timeline.start) / 3600000) / 168) * 100,
		//the percentage for the timeline indicator
		timePopup = document.getElementById('timePopup');
	range.addEventListener('input', time_change);
	timePopup.innerHTML = W_timeline.present.Time();
	timePopup.style.left = (calendar_pointer - 10) + '%';
	document.getElementById('calendarpointer-pointer').style.left = calendar_pointer + '%';

	function time_change() {
		var slider_time = new Date(parseInt(event.target.value))
		timePopup.innerHTML = W_timeline.months[slider_time.getMonth()] + ' ' + slider_time.getDate() + '  ' + W_timeline.weekdays[slider_time.getDay()] + ' ' + slider_time.getHours() + ':00';
		W.setTimestamp(event.target.value); //event.target represent the slider
		var calendar_pointer_left = (((parseInt(event.target.value) - W.timeline.start) / 3600000) / 168) * 100;
		document.getElementById('calendarpointer-pointer').style.left = calendar_pointer_left + '%';
		timePopup.style.left = (calendar_pointer_left - 10) + '%';
	}
	for (i = 0; i <= 6; i++) {
		var j = (i + W_timeline.present.Weekday) % 7,
			table_name = 'calendar-table-',
			date_counter = i * 86400000;
		W_timeline.present.Date = new Date(W.timeline.start + date_counter).getDate();
		table_name += i;
		document.getElementById(table_name).innerHTML = W_timeline.weekdays[j] + ' ' + W_timeline.present.Date;
		document.getElementById(table_name).onclick = select_date;
	} //loop for displaying the present date
	////Calendar quick click
	function select_date(date) {
		var n = parseInt(date.target.id[15]),
			slider_time = new Date(n * 24 * 3600000 + W_timeline.present.HourSec() + W.timeline.start),
			calendar_pointer_left = (((n * 24 * 3600000 + W_timeline.present.HourSec()) / 3600000) / 168) * 100;
		timePopup.innerHTML = W_timeline.months[slider_time.getMonth()] + ' ' + slider_time.getDate() + '  ' + W_timeline.weekdays[slider_time.getDay()] + ' ' + slider_time.getHours() + ':00';
		document.getElementById('calendarpointer-pointer').style.left = calendar_pointer_left + '%';
		timePopup.style.left = (calendar_pointer_left - 10) + '%';
		range.value = n * 24 * 3600000 + W_timeline.present.HourSec() + W.timeline.start;
		W.setTimestamp(n * 24 * 3600000 + W_timeline.present.HourSec() + W.timeline.start);
	}
	////
	//
	function setButtonState() {
		range.max = W.timeline.start + W_timeline.End;
		range.min = W.timeline.start;
		document.getElementById("timeline").style.display = "block";
	}
	//M
	//Marker Distance
	var kilometer = (marker1.getLatLng().distanceTo(marker2.getLatLng()) / 1000).toFixed(3),
		nauticalmile = (kilometer / 1.852).toFixed(3);
	marker1.on('move', distance);
	marker2.on('move', distance);
	map.on('move', center_marker_position);
	var show_marker_position_switch = false;

	function show_marker_position() {
		if (show_marker_position_switch) {
			document.getElementById('markerposition').style.opacity = 0;
			show_marker_position_switch = false;
		} else {
			document.getElementById('markerposition').style.opacity = 0.6;
			show_marker_position_switch = true;
		}
	}

	function center_marker_position() {
		if (!distance_button_switch) {
			center_position1 = map.getCenter();
			cent_pos();
			marker1.setLatLng(center_position1);
			marker2.setLatLng(center_position2);
		};
	}

	function distance_button() {
		if (distance_button_switch) {
			markerlayer.clearLayers();
			linelayer.clearLayers();
			var timer = setTimeout(function () {
				dkilometer.innerHTML = '0.000 km';
				dnauticalmile.innerHTML = "0.000 nm";
			}, 1000);
			clearTimeout(timer);
			distance_button_switch = false;
		} else {
			marker1.addTo(markerlayer);
			marker2.addTo(markerlayer);
			distanceline.bindPopup('<p style="margin: 0px; padding: 0px; font-size: 16px;">Rhumb Line</p>').addTo(linelayer);
			greatcircleline.bindPopup('<p style="margin: 0px; padding: 0px; font-size: 16px;">Great Circle</p>').addTo(linelayer);
			dkilometer.innerHTML = kilometer + ' km';
			dnauticalmile.innerHTML = nauticalmile + " nm";
			distance_button_switch = true;
		};
	}

	function distance() {
		var m1 = marker1.getLatLng(),
			m2 = marker2.getLatLng();
		kilometer = (m1.distanceTo(m2) / 1000).toFixed(3),
			nauticalmile = (kilometer / 1.852).toFixed(3);
		dkilometer.innerHTML = kilometer + ' km';
		dnauticalmile.innerHTML = nauticalmile + " nm";
		linelayer.clearLayers();
		distanceline = L.polyline([[m1.lat, m1.lng], [m2.lat, m2.lng]]).bindPopup('<p style="margin: 0px; padding: 0px; font-size: 16px;">Rhumb Line</p>');
		greatcircleline = L.Polyline.Arc([m1.lat, m1.lng], [m2.lat, m2.lng], {
			color: 'red',
			vertices: 200
		}).bindPopup('<p style="margin: 0px; padding: 0px; font-size: 16px;">Great Circle</p>');
		distanceline.setStyle({
			color: 'white'
		});
		if (tile_switch_empty) {
			distanceline.setStyle({
				color: 'black'
			});
		} else if (!tile_switch && !tile_switch_empty) {
			distanceline.setStyle({
				color: 'black'
			});
		};
		if (distance_button_switch) {
			distanceline.addTo(linelayer);
			greatcircleline.addTo(linelayer);
		};
	}
	//Marker Distance
	//M
	//@@
	//Mouse position
	map.on('mousemove', cursor);

	function cursor(a) {
		var lat = Math.abs(a.latlng.lat.toPrecision(9)),
			lng = Math.abs(a.latlng.wrap(-180, 180).lng.toPrecision(9)),
			latdeg = parseInt(lat),
			lngdeg = parseInt(lng),
			latf = Math.abs(lat - parseFloat(latdeg)),
			lngf = Math.abs(lng - parseFloat(lngdeg)),
			latmin = (latf * 60).toPrecision(5),
			lngmin = (lngf * 60).toPrecision(5);
		var we = '',
			ns = '',
			timer;
		if (a.latlng.lat >= 0) {
			ns = 'N';
		} else {
			ns = 'S';
		}
		if (a.latlng.wrap(-180, 180).lng >= 0) {
			we = 'E';
		} else {
			we = 'W';
		}
		var cursor_pos = latdeg.toString() + '° ' + latmin.toString() + "' " + ns + ', ' + lngdeg.toString() + '° ' + lngmin.toString() + "' " + we;
		window['cursor'].innerHTML = cursor_pos;
		//window['cursor'] equals to ducument.getElementById('cursor')
		window['mouseposition'].style.opacity = 0.6;
		window['mouseposition'].style.transition = 'opacity 0.5s';
		window['mouseposition'].style.WebkitTransition = 'opacity 0.5s';
		timer = setTimeout(fadeout, 3000);

		function fadeout() {
			if (cursor_pos == window['cursor'].innerHTML) {
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
	function load(a) {
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

	function animation_marker(geojson) {
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

	function tick() {
		count = animate_marker.features[j].geometry.type.length;
		if (count == 5) {
			marker3.setLatLng(L.latLng(
				animate_marker.features[j].geometry.coordinates[1], animate_marker.features[j].geometry.coordinates[0]
			));
			++j;
			timer = setTimeout(tick, t);
		} else {
			j = 0;
			clearTimeout(timer);
			timer = setTimeout(tick, t);
		};
	}
	////animation marker
	//
	function createroute() {
		geo = "GeoJSON/" + p + route.value;
		gpx = "GPX/" + p + route.value.replace('.geojson', '.gpx');
		csv = "CSV/" + p + route.value.replace('.geojson', '.csv');
		var geoLayer = new L.mapbox.featureLayer();
		geoLayer.loadURL(geo).addTo(geolayerGroup);
		geoLayer.on('ready', function () {
			map.fitBounds(geoLayer.getBounds());
		});
		$("#GPX").removeClass("disable");
		$("#CSV").removeClass("disable");
		window['GPX'].setAttribute('onclick', "downloadGPX()");
		window['CSV'].setAttribute('onclick', 'downloadCSV()');
		//   
		//animarion marker
		j = 0;
		clearTimeout(timer);
		load(geo);
		//
		//
	}

	function clearroute() {
		geolayerGroup.clearLayers();
		map.setView([25.154, 121.377], 6);
		P = "";
		geo = "";
		gpx = "";
		csv = "";
		$("#GPX").addClass("disable");
		$("#CSV").addClass("disable");
		window['GPX'].removeAttribute('onclick');
		window['CSV'].removeAttribute('onclick');
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
		timePopup.innerHTML = presentTime;
		timePopup.style.left = (calendar_pointer - 10) + '%';
		document.getElementById('calendarpointer-pointer').style.left = calendar_pointer + '%';
		initial_line();
	}
	
	//
	////Search Bar
	
	//string splice
	String.prototype.splice = function(idx, rem, str) {
		return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
	};
	
	var r_search = {
		key: '',
		harbor: '//*[contains(harbor, "")]/harbor',
		path: '//*[contains(harbor, "")]/path',
		s_harbor: function(key, str){
			return JSON.search(key, str);
		},
		s_path: function(key, str){
			return JSON.search(key, str);
		}
	};
	var search_event = function(){
			$.getJSON("Route_Catalogue.json", function(result){
				var from_harbor = $('#from_harbor').val().toUpperCase(),
					to_harbor = $('#to_harbor').val().toUpperCase(),
					h = r_search.harbor.splice(22, 0, checkto(from_harbor, to_harbor)),
					p = r_search.path.splice(22, 0, checkto(from_harbor, to_harbor)),
					rh = r_search.s_harbor(result, h),
					rp = r_search.s_harbor(result, p);
				iterateItems(rh.length, rh, rp);
			});
		};
	$(document).ready(function(){
		$("[id$=harbor]").on({keyup: search_event, mouseup: search_event});
	});

	function iterateItems(max, a, b){
		var r, s, h, rsh;
		$('#search_result').empty();
		if(max === 0){
			$('#search_bar').css({'height': '0%'});
			$('#search_result').css({'height': '0%'});
		}
		else{
			for(i = 0; i < max; i++){
				r = $("<p></p>").text(b[i].slice(8, 11)).prepend("Route: ");
				s = $("<p></p>").text(b[i].slice(12, 16)).prepend("Ship: ");
				h = $("<p></p>").html('<div id="mark" style="display: inline">' + a[i] + '</div>').prepend("Harbor: ");
				rsh = $("<li></li>").append(r, s, h).attr({id: 'search'+i});
				$('#search_result').append(rsh);
				$("li p").css({'margin': '0px'});
				$("li").css({'margin': '20px 0px 20px 0px '});
				var x = function(){
					var a = b[i];
					return function(){
						searchclick(a);
					};
				};
				//要先建立一個scope來存放位址才不會被覆蓋掉
				$('#search'+i).one('click', x());
			}
		}
		keymark($('#from_harbor').val().toUpperCase(), $("[id$=mark]").text());
		keymark($('#to_harbor').val().toUpperCase(), $("[id$=mark]").text());
	}
	function checkto(a, b){
		if(b === '' && a ===''){
			$('#search_bar').css({'height': '0%'});
			$('#search_result').css({'height': '0%'});
			return 'xxx';
		}
		else if(b === '' && a !== ''){
			$('#search_bar').css({'height': '50%'});
			$('#search_result').css({'height': '100%'});
			return a;
		}
		else if(b !== '' && a === ''){
			$('#search_bar').css({'height': '50%'});
			$('#search_result').css({'height': '100%'});
			return b;
		}
		else{
			$('#search_bar').css({'height': '50%'});
			$('#search_result').css({'height': '100%'});
			return a + '-' + b;
		}
	}
	function keymark(key, str){
		$("[id$=mark]").html(function(n, c){
			return c.replace(key, '<mark>' + key + '</mark>');
		});
	}
	function searchclick(a){
		var geoLayer = new L.mapbox.featureLayer();
		geoLayer.loadURL(a).addTo(geolayerGroup);
		geoLayer.on('ready', function () {
			map.fitBounds(geoLayer.getBounds());
		});
	}
}