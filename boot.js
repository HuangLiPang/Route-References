!function() {
	function a(a, b) {
		var c = document.createElement("script");
		c.type = "text/javascript", 
        document.head.appendChild(c), 
        c.async = !0, 
        c.onload = b || function() {}, 
        c.onerror = function() {
			console.error("Failed to load" + a)
		}, 
        c.src = a
	}

	function b(a) {
		var b = document.createElement("link");
		b.rel = "stylesheet", 
        b.href = a, 
        document.head.appendChild(b)
	}

	function c(a) {
		throw alert(a), a
	}

	function d() {
		W.require(f, function(a) {
			W.setTimestamp = W.windytyUI.setTimestamp.bind(W.windytyUI), 
            W.setOverlay = W.windytyUI.setOverlay.bind(W.windytyUI),
            W.setLevel = W.windytyUI.setLevel.bind(W.windytyUI), 
            W.timeline = W.windytyUI.calendar, 
            W.on = W.broadcast.on.bind(W.broadcast), 
            W.off = W.broadcast.off.bind(W.broadcast), 
            W.once = W.broadcast.once.bind(W.broadcast),
            W.fire = W.broadcast.emit.bind(W.broadcast), 
            windytyMain(a)
		}),
        setTimeout(function() {
			console.log("Welcome to Windyty API: Please  do not remove, or hide Windyty logo and link from a map.")
		}, 1e3)
	}

	function e() {
		ref = document.URL, 
        ga("create", "UA-56263486-8", {
			name : "b"
		}), 
        ga("b.send", "pageview", "key/" + windytyInit.key), 
        ga("b.send", "pageview", "source/" + ref)
	}
	var f = [ "maps", "prototypes", "rootScope", "broadcast", "object", "mapsCtrl", "trans", "broadcast", "calendar", "http", "jsonLoader", "overlays", "products", "colors", "legend", "windytyUI", "windytyCtrl" ];
    
	API_MODE = !0, 
    DEBUG = !0, 
    DEBUG2 = !1, 
    L || c("Missing Leaflet library. Add leaflet library into HEAD seaction of your code"),
    /0.7.5|0.7.7/.test(L.version) || c("Wrong version of Leaflet library. Version 0.7.5 or 0.7.7 required"), 
    window.windytyInit|| c("Missing windytyInit object"), 
    windytyInit.key || c("Missing API key"),
    window.windytyMain || c("Missing function named windytyMain");
    
	var g = "https://api.windytv.com/v2.1/", h = document.getElementById("windyty");
    
    h || c("Missing DIV with windyty id"),
    h.innerHTML = '<div id="map_container" style="width: 100%; height: 100%;"></div><div id="contrib">OSM & contributors</div><div id="legend"></div><canvas id="jpg_decoder" style="display: none;"></canvas><div id="globe_container"></div>',
    b(g + "api.css"), 
    a("https://www.windytv.com/gfs/minifest.js", function() {
                                a("api.js?key=" + windytyInit.key, d)
                            }), 
    setTimeout(function() {
        "function" == typeof ga ? e() : a("https://www.google-analytics.com/analytics.js", e)
    }, 5e3)
}();