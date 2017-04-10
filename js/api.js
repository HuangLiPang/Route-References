    L.TileLayer.Multi = L.TileLayer.extend({
            _tileDefs: [],
            initialize: function (a, b) {
                L.TileLayer.prototype.initialize.call(this, void 0, b);
                var c = this.options.minZoom;
                for (var d in a)
                    for (var e = this._fixTileDef(a[d]); d >= c; c++) this._tileDefs[c] = e
            },
            _fixTileDef: function (a) {
                var b = L.extend({}, {
                    subdomains: L.TileLayer.prototype.options.subdomains
                }, a);
                return "string" == typeof b.subdomains && (b.subdomains = b.subdomains.split("")), b
            },
            _getSubdomain: function (a, b) {
                var c = (a.x + a.y) % b.length;
                return b[c]
            },
            setUrl: function () {},
            getTileUrl: function (a) {
                var b = this._getZoomForUrl(),
                    c = this._tileDefs[b];
                return this._adjustTilePoint(a), L.Util.template(c.url, L.extend({
                    s: this._getSubdomain(a, c.subdomains),
                    z: b,
                    x: a.x,
                    y: a.y
                }, this.options))
            }
        }), L.TileLayer.multi = function (a, b) {
            return new L.TileLayer.Multi(a, b)
        },
        function (a) {
            function b(a, b) {
                return function () {
                    a.apply(b, arguments)
                }
            }

            function c(a) {
                if ("object" != typeof this) throw new TypeError("Promises must be constructed via new");
                if ("function" != typeof a) throw new TypeError("not a function");
                this._state = null, this._value = null, this._deferreds = [], i(a, b(e, this), b(f, this))
            }

            function d(a) {
                var b = this;
                return null === this._state ? void this._deferreds.push(a) : void j(function () {
                    var c = b._state ? a.onFulfilled : a.onRejected;
                    if (null === c) return void(b._state ? a.resolve : a.reject)(b._value);
                    var d;
                    try {
                        d = c(b._value)
                    } catch (e) {
                        return void a.reject(e)
                    }
                    a.resolve(d)
                })
            }

            function e(a) {
                try {
                    if (a === this) throw new TypeError("A promise cannot be resolved with itself.");
                    if (a && ("object" == typeof a || "function" == typeof a)) {
                        var c = a.then;
                        if ("function" == typeof c) return void i(b(c, a), b(e, this), b(f, this))
                    }
                    this._state = !0, this._value = a, g.call(this)
                } catch (d) {
                    f.call(this, d)
                }
            }

            function f(a) {
                this._state = !1, this._value = a, g.call(this)
            }

            function g() {
                for (var a = 0, b = this._deferreds.length; b > a; a++) d.call(this, this._deferreds[a]);
                this._deferreds = null
            }

            function h(a, b, c, d) {
                this.onFulfilled = "function" == typeof a ? a : null, this.onRejected = "function" == typeof b ? b : null, this.resolve = c, this.reject = d
            }

            function i(a, b, c) {
                var d = !1;
                try {
                    a(function (a) {
                        d || (d = !0, b(a))
                    }, function (a) {
                        d || (d = !0, c(a))
                    })
                } catch (e) {
                    if (d) return;
                    d = !0, c(e)
                }
            }
            var j = c.immediateFn || "function" == typeof setImmediate && setImmediate || function (a) {
                    setTimeout(a, 1)
                },
                k = Array.isArray || function (a) {
                    return "[object Array]" === Object.prototype.toString.call(a)
                };
            c.prototype["catch"] = function (a) {
                return this.then(null, a)
            }, c.prototype.then = function (a, b) {
                var e = this;
                return new c(function (c, f) {
                    d.call(e, new h(a, b, c, f))
                })
            }, c.all = function () {
                var a = Array.prototype.slice.call(1 === arguments.length && k(arguments[0]) ? arguments[0] : arguments);
                return new c(function (b, c) {
                    function d(f, g) {
                        try {
                            if (g && ("object" == typeof g || "function" == typeof g)) {
                                var h = g.then;
                                if ("function" == typeof h) return void h.call(g, function (a) {
                                    d(f, a)
                                }, c)
                            }
                            a[f] = g, 0 === --e && b(a)
                        } catch (i) {
                            c(i)
                        }
                    }
                    if (0 === a.length) return b([]);
                    for (var e = a.length, f = 0; f < a.length; f++) d(f, a[f])
                })
            }, c.resolve = function (a) {
                return a && "object" == typeof a && a.constructor === c ? a : new c(function (b) {
                    b(a)
                })
            }, c.reject = function (a) {
                return new c(function (b, c) {
                    c(a)
                })
            }, c.race = function (a) {
                return new c(function (b, c) {
                    for (var d = 0, e = a.length; e > d; d++) a[d].then(b, c)
                })
            }, "undefined" != typeof module && module.exports ? module.exports = c : a.Promise || (a.Promise = c)
        }(this),
        /*! 
            Adrian Cooney <cooney.adrian@gmail.com> License: MIT */
        function (a) {
            function b(a, b, d, f) {
                var g, h;
                if ("function" == typeof b ? (h = b, g = []) : (g = b, h = d), e[a]) throw "DI conflict: Module " + a + " already defined.";
                return e[a] = {
                    name: a,
                    callback: h,
                    loaded: null,
                    wasLoaded: !1,
                    dependencies: g
                }, f && c(e[a]), e[a]
            }

            function c(a) {
                var b = [];
                return a.dependencies.forEach(function (a) {
                    var d = e[a];
                    if (!d) throw "DI error: Module " + a + " not defined";
                    d.wasLoaded ? b.push(d.loaded) : b.push(c(d))
                }), a.loaded = a.callback.apply(null, b), a.wasLoaded = !0, W[a.name] ? console.error("DI error: Object W." + a.name + " already exists") : W[a.name] = a.loaded, a.loaded
            }

            function d(a, b) {
                var d, f, g;
                "function" == typeof a ? (f = a, d = []) : (d = a, f = b), g = c({
                    callback: f,
                    dependencies: d
                });
                for (var h in e) e[h].wasLoaded || console.warn("DI warning: module " + h + " defined but not loaded")
            }
            var e = {};
            a.W || (a.W = {}), d.modules = e, a.W.require = d, a.W.define = b
        }(window), /*! */
        W.define("prototypes", [], function () {
            Date.prototype.add = function (a, b) {
                var c = new Date(this.getTime());
                return c.setTime(this.getTime() + ("days" === b ? 24 : 1) * a * 60 * 60 * 1e3), c
            }, 
			Date.prototype.toUTCPath = function () {
                return this.toISOString().replace(/^(\d+)-(\d+)-(\d+)T(\d+):.*$/, "$1/$2/$3/$4")
            }, 
			String.prototype.trunc = function (a) {
                return this.length > a ? this.substr(0, a - 1) + "&hellip;" : this
            },
			Date.prototype.midnight = function () {
                return this.setHours(0), this.setMinutes(0), this.setSeconds(0), this.setMilliseconds(0), this
            }, 
			Number.prototype.pad = function (a) {
                for (var b = String(this); b.length < (a || 2);) b = "0" + b;
                return b
            }, 
			Number.prototype.format = function (a) {
                return this.toFixed(a || 0).replace(/(\d)(?=(\d{3})+\.?)/g, "$1 ")
            }, 
			String.prototype.firstCapital = function () {
                return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase()
            }, 
			Number.prototype.bound = function (a, b) {
                return Math.max(Math.min(this, b), a)
            },
			Math.deg2rad = function (a) {
                return a / 180 * Math.PI
            }, 
			String.prototype.template = function (a) {
                return this.replace(/\{\s*(.+?)\s*\}/g, function (b, c) {
                    return "undefined" == typeof a[c] ? "" : a[c]
                })
            }, 
			String.prototype.template2 = function (a) {
                return this.replace(/\{\{(.+?)\}\}/g, function (b, c) {
                    return a[c] || ""
                })
            }
        }), /*! */
        W.define("http", ["lruCache"], function (lruCache) {
            var httpCache = new lruCache(50),
                http = {};
            return http.get = function (url, options) {
                var wasCancelled = !1,
                    data, headers = {},
                    options = options || {},
                    match, rqst, returnObject, cacheHit, cache, promise;
                return cache = "undefined" == typeof options.cache || "boolean" == typeof options.cache && options.cache ? httpCache : "object" == typeof options.cache ? options.cache : null, url = encodeURI(url), cache && (cacheHit = cache.get(url)) ? Promise.resolve(cacheHit) : (rqst = new XMLHttpRequest, rqst.open("get", url, !0), options.responseType && (rqst.responseType = options.responseType), promise = new Promise(function (resolve, reject) {
                    rqst.onreadystatechange = function () {
                        if (4 === rqst.readyState)
                            if (options.parseHeaders && rqst.getAllResponseHeaders().split(/\n/).forEach(function (a) {
                                    (match = a.match(/(.*:?)\: (.*)/)) && (headers[match[1].toLowerCase()] = match[2])
                                }), rqst.status >= 200 && rqst.status < 300 || 304 === rqst.status) {
                                if (data = rqst.responseText, data && /json/.test(rqst.getResponseHeader("Content-Type"))) try {
                                    data = JSON.parse(data)
                                } catch (e) {
                                    try {
                                        eval("data = " + data)
                                    } catch (e) {}
                                }
                                returnObject = {
                                    data: data,
                                    headers: headers,
                                    status: rqst.status
                                }, cache && cache.put(url, returnObject), resolve(returnObject)
                            } else wasCancelled ? reject("cancelled") : options.substituteData ? resolve({
                                data: options.substituteData,
                                headers: headers,
                                status: rqst.status
                            }) : reject(rqst.status)
                    }
                }), promise.cancel = function () {
                    wasCancelled = !0, rqst.abort()
                }, rqst.send(null), promise)
            }, http
        }), /*! */
        W.define("storage", ["rootScope", "http", "log"], function (a, b, c) {
            var d = {},
                e = {
                    isAvbl: !0,
                    put: function (a, b) {
                        try {
                            this.isAvbl ? window.localStorage.setItem(a, JSON.stringify(b)) : d[a] = b
                        } catch (e) {
                            c.event("Error writing to localStorage:" + e)
                        }
                    },
                    get: function (a) {
                        try {
                            return this.isAvbl ? JSON.parse(window.localStorage.getItem(a)) : d[a]
                        } catch (b) {}
                    },
                    getFile: function (c, d) {
                        var e = this,
                            f = this.get(c);
                        return f && (d.aboluteURL || f.version === a.version) && (!d.test || f.data && f.data[d.test]) ? Promise.resolve(f.data) : new Promise(function (f, g) {
                            b.get(d.aboluteURL ? c : "/v" + a.version + "/" + c).then(function (b) {
                                b.version = d.aboluteURL ? "notAplicable" : a.version, e.put(c, b), f(b.data)
                            }, function (a) {
                                g(a)
                            })
                        })
                    }
                };
            try {
                window.localStorage.test = 2
            } catch (f) {
                e.isAvbl = !1, c.event("localStorage not supported"), c.page("settings/noStorage")
            }
            return e
        }), /*! */
        W.define("broadcast", ["Evented"], function (a) {
            return a.extend({
                ident: "bcast"
            })
        }),
        /*!
            Licensed under MIT. 
            Copyright (c) 2010 Rasmus Andersson <http://hunch.se/> */
        W.define("lruCache", [], function () {
            function a(a) {
                this.size = 0, this.limit = a, this._keymap = {}
            }
            return a.prototype.put = function (a, b) {
                var c = {
                    key: a,
                    value: b
                };
                return this._keymap[a] = c, this.tail ? (this.tail.newer = c, c.older = this.tail) : this.head = c, this.tail = c, this.size === this.limit ? this.shift() : void this.size++
            }, a.prototype.shift = function () {
                var a = this.head;
                return a && (this.head.newer ? (this.head = this.head.newer, this.head.older = void 0) : this.head = void 0, a.newer = a.older = void 0, delete this._keymap[a.key]), a
            }, a.prototype.get = function (a, b) {
                var c = this._keymap[a];
                if (void 0 !== c) return c === this.tail ? b ? c : c.value : (c.newer && (c === this.head && (this.head = c.newer), c.newer.older = c.older), c.older && (c.older.newer = c.newer), c.newer = void 0, c.older = this.tail, this.tail && (this.tail.newer = c), this.tail = c, b ? c : c.value)
            }, a
        }), /*! */
        W.define("object", [], function () {
            var a = {};
            return a.clone = function (b, c) {
                var d;
                if (null === b || "object" != typeof b) d = b;
                else if (b instanceof Date) d = new Date, d.setTime(b.getTime());
                else if (b instanceof Array) {
                    d = [];
                    for (var e = 0, f = b.length; f > e; e++) d[e] = a.clone(b[e])
                } else if (b instanceof Object) {
                    d = {};
                    for (var g in b) b.hasOwnProperty(g) && (!c || c.indexOf(g) > -1) && (d[g] = a.clone(b[g]))
                } else console.warn("Unable to copy obj! Its type isn't supported.");
                return d
            }, a.signature = function (a) {
                var b = "";
                if (a instanceof Array)
                    for (var c = 0, d = a.length; d > c; c++) b += a[c] && a[c].toString();
                else if (a instanceof Object)
                    for (var e in a) a.hasOwnProperty(e) && (b += a[e] && a[e].toString());
                return b
            }, a.extend = function (a) {
                var b, c, d, e, f = Object.create(a);
                for (c = 1, d = arguments.length; d > c; c++) {
                    e = arguments[c];
                    for (b in e) f[b] = e[b]
                }
                return "function" == typeof f._init && f._init(), f
            }, a.include = function (a, b) {
                for (var c in b) a[c] = b[c];
                return a
            }, a.compare = function (a, b, c) {
                return c.filter(function (c) {
                    return a[c] !== b[c]
                })
            }, a
        }), /*! */
        W.define("Class", [], function () {
            var a = {};
            return a.extend = function () {
                var a, b, c, d, e = Object.create(this);
                for (b = 0, c = arguments.length; c > b; b++) {
                    d = arguments[b];
                    for (a in d) e[a] = d[a]
                }
                return "function" == typeof e._init && e._init.call(e), e
            }, a
        }),
        /*!
            Copyright(c) 2011 Daniel Lamb <daniellmb.com> MIT Licensed */
        W.define("Evented", ["Class"], function (a) {
            return a.extend({
                _init: function () {
                    this.id = 0, this.cache = {}
                },
                emit: function (a, b, c, d, e) {
                    var f, g, h;
                    if (f = this.cache[a])
                        for (g = f.length; g--;) h = f[g], h.callback.call(this, b, c, d, e), h.once && this.off(h.id)
                },
                on: function (a, b, c) {
                    return this.cache[a] || (this.cache[a] = []), this.cache[a].push({
                        callback: b,
                        id: ++this.id,
                        once: c || !1
                    }), this.id
                },
                once: function (a, b) {
                    return this.on(a, b, !0)
                },
                off: function (a, b) {
                    var c, d;
                    if ("number" == typeof a) {
                        for (var e in this.cache)
                            if (c = this.cache[e]) {
                                for (d = c.length; d--;) c[d].id === a && c.splice(d, 1);
                                0 === c.length && delete this.cache[e]
                            }
                    } else {
                        if ((c = this.cache[a]) && (c = this.cache[a]))
                            for (d = c.length; d--;) c[d].callback === b && c.splice(d, 1);
                        0 === c.length && delete this.cache[a]
                    }
                }
            })
        }), /*! */
        W.define("blurWorker", ["log"], function (a) {
            function b() {
                function a(a) {
                    i = new Uint16Array(a), d = new Uint16Array(a), e = new Uint16Array(a)
                }

                function b(a) {
                    j = new Uint32Array(a), f = new Uint32Array(a)
                }

                function c(c, k, l, m, n, o, p, q) {
                    q = q || 3, q |= 0;
                    var r = o * p;
                    r > i.length && a(r), r = Math.max(o, p), r > j.length && b(r);
                    var s, t, u, v, w, x, y, z, A, B, C, w, D, x, y, z, E, D = 0,
                        F = 0,
                        G = 0,
                        H = o - 1,
                        I = p - 1,
                        J = q + 1,
                        K = g[q],
                        L = h[q],
                        M = (1e7 * K >>> L) / 1e7,
                        N = j,
                        O = f,
                        P = i,
                        Q = d,
                        R = e,
                        S = c.data;
                    for (B = 0; o > B; B++) N[B] = ((x = B + J) < H ? x : H) << 2, O[B] = (x = B - q) > 0 ? x << 2 : 0;
                    for (v = 0; p > v; v++) {
                        for (s = S[G] * J, t = S[G + 1] * J, u = S[G + 2] * J, w = 1; q >= w; w++) x = G + ((w > H ? H : w) << 2), s += S[x], t += S[x + 1], u += S[x + 2];
                        for (D = 0; o > D; D++) P[F] = s, Q[F] = t, R[F] = u, y = G + N[D], z = G + O[D], s += S[y] - S[z], t += S[y + 1] - S[z + 1], u += S[y + 2] - S[z + 2], F++;
                        G += o << 2
                    }
                    for (C = 0; p > C; C++) N[C] = ((x = C + J) < I ? x : I) * o, O[C] = (x = C - q) > 0 ? x * o : 0;
                    for (D = 0; o > D; D++) {
                        for (A = D, s = P[A] * J, t = Q[A] * J, u = R[A] * J, w = 1; q >= w; w++) A += w > I ? 0 : o, s += P[A], t += Q[A], u += R[A];
                        for (F = D << 2, E = o << 2, v = 0; p > v; v++) S[F] = s * M, S[F + 1] = t * M, S[F + 2] = u * M, y = D + N[v], z = D + O[v], s += P[y] - P[z], t += Q[y] - Q[z], u += R[y] - R[z], F += E
                    }
                    return c
                }
                var d, e, f, g = [1, 57, 41, 21, 203, 34, 97, 73, 227, 91, 149, 62, 105, 45, 39, 137, 241, 107, 3, 173, 39, 71, 65, 238, 219, 101, 187, 87, 81, 151, 141, 133],
                    h = [0, 9, 10, 10, 14, 12, 14, 14, 16, 15, 16, 15, 16, 15, 15, 17, 18, 17, 12, 18, 16, 17, 17, 19, 19, 18, 19, 18, 18, 19, 19, 19, 20, 19, 20, 20, 20, 20, 20, 20],
                    i = [],
                    j = [];
                self.onmessage = function (a) {
                    postMessage(c(a.data.imageData, a.data.x0, a.data.y0, a.data.xMax, a.data.yMax, a.data.width, a.data.height, a.data.radius))
                }
            }
            var c, d, e = null,
                f = window.URL || window.webkitURL;
            if (!window.Worker) return a.event("Web Worker not supported"), null;
            try {
                d = "(" + b.toString() + ")()";
                try {
                    c = new Blob([d], {
                        type: "application/javascript"
                    })
                } catch (g) {
                    window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder, c = new BlobBuilder, c.append(d), c = blob.getBlob(), a.event("Using old version of BlobBuilder, just for info")
                }
                try {
                    e = new Worker(f.createObjectURL(c))
                } catch (g) {
                    return a.event("Unable to createObjectURL " + g), null
                }
            } catch (g) {
                return a.event("Failed to stringyfy blurFunction " + g), null
            }
            return e
        }), /*! */
        W.define("particles", ["rootScope", "Class"], function (a, b) {
            function c(a) {
                return 12 > a ? 0 : 25 > a ? 1 : 37 > a ? 2 : 62 > a ? 3 : 75 > a ? 2 : 85 > a ? 1 : 0
            }

            function d(a) {
                return Math.min(3, Math.floor(a / 40))
            }
            var e = {
                surface: 1,
                "975h": 1,
                "950h": 1,
                "925h": .98,
                "900h": .9,
                "850h": .8,
                "750h": .75,
                "700h": .7,
                "550h": .65,
                "450h": .6,
                "350h": .55,
                "300h": .5,
                "250h": .45,
                "200h": .4,
                "150h": .35
            };
            W.Particles = {
                maps: b.extend({
                    animation: "dot",
                    styles: ["rgba(200,200,200,1)", "rgba(215,215,215,1)", "rgba(235,235,235,1)", "rgba(255,255,255,1)"],
                    stylesBlue: ["rgba(200,0,150,1)", "rgba(200,0,150,1)", "rgba(200,0,150,1)", "rgba(200,0,150,1)"],
                    lineWidth: [.6, .6, .6, 1, 1.2, 1.6, 1.8, 2, 2.2, 2.4, 2.4, 2.4, 2.4, 2.6, 2.8, 3, 3, 3, 3, 3, 3, 3, 3, 3],
                    level2reduce: e,
                    getIntensityFun: function (a) {
                        return d
                    },
                    getVelocity: function (a) {
                        return this.level2reduce[a.grid.level] / (this.velocity.constant * Math.pow(this.velocity.pow, a.map.zoom - this.velocity.zoom))
                    },
                    getAmount: function (a) {
                        var b = 1 / (this.multiplier.constant * Math.pow(this.multiplier.pow, a.map.zoom - this.multiplier.zoom));
                        return Math.min(15e3, Math.round(a.map.width * a.map.height * b))
                    },
                    getLineWidth: function (a) {
                        return this.lineWidth[a.map.zoom]
                    },
                    getStyles: function (a) {
                        return a.map.zoom >= 12 ? this.stylesBlue : this.styles
                    },
                    getMaxAge: function (a) {
                        return 100
                    },
                    getBlendingAlpha: function (a) {
                        return .9
                    }
                }),
                globe: b.extend({
                    animation: "dot",
                    level2reduce: e,
                    styles: ["rgba(255,255,255,0.2)", "rgba(255,255,255,0.4)", "rgba(255,255,255,0.6)", "rgba(255,255,255,0.8)"],
                    getIntensityFun: function (a) {
                        var b = a.map.scale,
                            c = a.map.width / 2,
                            d = a.map.height / 2;
                        return function (a, e, f) {
                            var g = (Math.pow(c - e, 2) + Math.pow(d - f, 2)) / Math.pow(b, 2),
                                h = Math.min(3, Math.floor(a / 3));
                            return g > .75 ? h - 1 : g > .85 ? h - 2 : h
                        }
                    },
                    getVelocity: function (a) {
                        return 1 / (this.velocity.a * a.map.scale + this.velocity.b) * this.level2reduce[a.grid.level]
                    },
                    getAmount: function (a) {
                        return this.multiplier.a * Math.pow(a.map.scale, 2) + this.multiplier.b
                    },
                    getLineWidth: function (b) {
                        var c = a.isMobile ? .4 : 0,
                            d = b.map.scale;
                        return d > 300 ? 1 + c : d > 200 ? .8 + c : .6 + c
                    },
                    getStyles: function (a) {
                        return this.styles
                    },
                    getMaxAge: function (a) {
                        return 100
                    },
                    getBlendingAlpha: function (a) {
                        var b = a.map.scale;
                        return 500 > b ? .96 : 600 > b ? .94 : .92
                    }
                })
            };
            var f = {};
            return f.wind = {
                maps: W.Particles.maps.extend({
                    multiplier: {
                        constant: 50,
                        pow: 1.6,
                        zoom: 2
                    },
                    velocity: {
                        constant: 70,
                        pow: 1.6,
                        zoom: 3
                    }
                }),
                globe: W.Particles.globe.extend({
                    multiplier: {
                        a: .028,
                        b: 700
                    },
                    velocity: {
                        a: .166666,
                        b: 20
                    }
                })
            }, f.currents = {
                maps: W.Particles.maps.extend({
                    multiplier: {
                        constant: 50,
                        pow: 1.5,
                        zoom: 2
                    },
                    velocity: {
                        constant: 10,
                        pow: 1.4,
                        zoom: 3
                    },
                    getBlendingAlpha: function (a) {
                        return .96
                    }
                }),
                globe: W.Particles.globe.extend({
                    multiplier: {
                        a: .04,
                        b: 700
                    },
                    velocity: {
                        a: .01,
                        b: 1.2
                    },
                    getIntensityFun: function (a) {
                        return function (a, b, c) {
                            return Math.min(3, Math.floor(4 * a))
                        }
                    }
                })
            }, f.waves = {
                maps: W.Particles.maps.extend({
                    animation: "wavecle",
                    styles: ["rgba(100,100,100,0.1)", "rgba(150,150,150,0.15)", "rgba(200,200,200,0.2)", "rgba(255,255,255,0.3)"],
                    lineWidth: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                    multiplier: {
                        constant: 50,
                        pow: 1.3,
                        zoom: 2
                    },
                    velocity: {
                        constant: 150,
                        pow: 1.6,
                        zoom: 2
                    },
                    getIntensityFun: function () {
                        return c
                    }
                }),
                globe: W.Particles.globe.extend({
                    animation: "wavecle",
                    getIntensityFun: function () {
                        return c
                    },
                    getStyles: function (a) {
                        return ["rgba(100,100,100,0.1)", "rgba(150,150,150,0.15)", "rgba(200,200,200,0.2)", "rgba(255,255,255,0.3)"]
                    },
                    getBlendingAlpha: function (a) {
                        return .9
                    },
                    multiplier: {
                        a: .08,
                        b: 1e3
                    },
                    velocity: {
                        a: 1,
                        b: 0
                    }
                })
            }, f.windDetailed = {
                maps: W.Particles.maps.extend({
                    lineWidth: [1, 1, 1, 1, 1.4, 1.6, 1.8, 2, 2.2, 2.4, 2.4, 2.4, 2.4, 2.6, 2.8, 3, 3, 3, 3, 3, 3, 3, 3, 3],
                    multiplier: {
                        constant: 50,
                        pow: 1.5,
                        zoom: 2
                    },
                    velocity: {
                        constant: 70,
                        pow: 1.7,
                        zoom: 3
                    }
                }),
                globe: f.wind.globe
            }, f
        }),
        /*!	
            Copyright (c) 2014 Cameron Beccario - The MIT License (MIT) 
            Copyright (c) 2014 - 2015 Citationtech, S.E. all rights reserved */
        W.define("interpolation", ["rootScope", "interFunctions", "animation", "mapsCtrl", "blurWorker", "object", "broadcast", "globe", "maps"], function (a, b, c, d, e, f, g, h, i) {
            "use strict";

            function j() {
                return w && v
            }

            function k(a) {
                return a - a % 4
            }

            function l(a, c) {
                if (!w || !v) return null;
                var d, e = w.dx,
                    f = w.dy,
                    g = Math.max(w.la1, w.la2),
                    h = w.lo1,
                    i = [];
                return d = b.interpolatePoint(a, c, g, h, e, f, w.destWidth), v(i, w.data, x && x.data, d[0], d[1], d[2], d[3], d[4], d[5]), {
                    wind: Math.sqrt(i[0] * i[0] + i[1] * i[1]),
                    angle: 10 * Math.floor(18 + 18 * Math.atan2(i[0], i[1]) / Math.PI),
                    overlayName: x && x.overlay || w.overlay,
                    overlayValue: i[2]
                }
            }

            function m(a, g) {
                function j(c) {
                    var d, e, f, g, i, j, k = K,
                        m = r,
                        n = t,
                        o = q,
                        p = ea,
                        u = K,
                        v = ja,
                        w = s,
                        x = b.distort,
                        y = T,
                        z = h.isVisible.bind(h),
                        A = c / Z,
                        B = A * Math.ceil(N / 4),
                        D = 3 * B,
                        F = 6 * B,
                        G = 4 * B,
                        J = [130, 130, 130, 120, 130, 130, 130, 120, 130, 130, 130, 120, 130, 130, 130, 120],
                        M = a.interpolate;
                    if (l)
                        for (D += C / Z * 3, d = C; E >= d; d += Z, D += 3, F += 6, G += 4)
                            if (z(d, c)) {
                                if (ga) {
                                    if (j = y.invert([d, c]), e = j[0], f = j[1], isNaN(f) || !isFinite(f)) continue;
                                    V(f, e, d, c, n, G), U(f, e, F)
                                }
                                M(p, H, I, m[F], m[F + 1], m[F + 2], m[F + 3], m[F + 4], m[F + 5]), x(p, k, n[G], n[G + 1], n[G + 2], n[G + 3]), i = p[2], o[D] = p[0], o[D + 1] = p[1], o[D + 2] = i, g = W[Math.floor((i - X) / Y)] || J, v(Math.max(0, d - 2), Math.max(0, c - 2), g)
                            } else o[D] = 0, o[D + 1] = 0, o[D + 2] = -1;
                    else
                        for (f = $ * (2 * Math.atan(Math.exp((da - c) / ba)) - _), k = ga ? w[A] = (1 - .01 * Math.abs(f)) * u : w[A], d = 0; N >= d; d += Z, D += 3, F += 6, G += 4) ga && (e = L + d / N * aa, V(f, e, d, c, n, G), U(f, e, F)), M(p, H, I, m[F], m[F + 1], m[F + 2], m[F + 3], m[F + 4], m[F + 5]), x(p, k, n[G], n[G + 1], n[G + 2], n[G + 3]), i = p[2], o[D] = p[0], o[D + 1] = p[1], o[D + 2] = i, g = W[Math.floor((i - X) / Y)] || J, v(d, c, g)
                }
                window.clearTimeout(y), A = !1;
                var l = "globe" === a.map.source,
                    m = d.getCanvas(),
                    n = m.overlayCanvas,
                    p = [n[0].getContext("2d"), n[1].getContext("2d")],
                    B = m.actualCanvas,
                    C = k(a.map.x),
                    D = k(a.map.y),
                    E = a.map.xMax,
                    F = a.map.yMax,
                    G = a.grid,
                    H = G.data,
                    I = a.overlay && a.overlay.data,
                    J = a.map,
                    K = a.particles ? a.particles.getVelocity(a) : 0,
                    L = (J.westRad, J.west),
                    M = J.height,
                    N = J.width,
                    O = Math.abs(G.dx),
                    P = Math.abs(G.dy),
                    Q = G.destWidth,
                    R = Math.max(G.la1, G.la2),
                    S = G.lo1,
                    T = l ? h.projection : null,
                    U = b.interpolationFunction(R, S, O, P, Q, r),
                    V = b.distortionFunction(T, N, M, J.northRad, J.southRad, J.eastRad, J.westRad),
                    W = a.colors.colorsArray,
                    X = a.colors.startingValue,
                    Y = a.colors.step,
                    Z = 4,
                    $ = 180 / Math.PI,
                    _ = Math.PI / 2,
                    aa = J.east - J.west,
                    ba = N / aa * 360 / (2 * Math.PI),
                    ca = ba / 2 * Math.log((1 + Math.sin(J.southRad)) / (1 - Math.sin(J.southRad))),
                    da = M + ca,
                    ea = new Float32Array(5),
                    fa = f.signature([a.product, J.lat, J.lon, J.zoom, J.width, J.height, O, P, Q, R, S]),
                    ga = !!a.mapDirty || fa !== u;
                (l || !a.mapDirty) && (B = B ? 0 : 1), a.disableOverlay ? (p[0].clearRect(0, 0, N, M), p[1].clearRect(0, 0, N, M)) : l && p[B].clearRect(0, 0, N, M);
                var ha = p[B].getImageData(0, 0, N, M),
                    ia = ha.data,
                    ja = a.disableOverlay ? function () {} : b.colorizeFunction(ia, N, M),
                    ka = ga ? 300 : 50,
                    la = 0 | D;
                ! function ma() {
                    for (var b = Date.now(); F > la;)
                        if (j(la), la += Z, z++, z > 20 && (z = 0, Date.now() - b > ka)) return void(y = setTimeout(ma, 50));
                    v = a.interpolate, w = a.grid, x = a.overlay, u = fa, m.actualCanvas = B, e && !a.disableOverlay && (e.postMessage({
                        imageData: ha,
                        width: N,
                        height: M,
                        radius: a.blur
                    }), e.onmessage = function (a) {
                        A || p[B].putImageData(a.data, 0, 0)
                    }), !l && a.mapDirty && i.resetCanvas(), a.disableOverlay || p[B].putImageData(ha, 0, 0), (l || !a.mapDirty) && (n[B].style.opacity = 1, n[B ? 0 : 1].style.opacity = 0), l && a.mapDirty && (m.particleCanvas.style.opacity = 1), (ga || a.particles && a.particles.name !== o) && (c.stop(), a.particles ? (m.particleCanvas.style.opacity = 1, c.run(q, a, m.particleCanvas), o = a.particles.name) : (m.particleCanvas.style.opacity = 0, o = null)), g()
                }()
            }

            function n() {
                window.clearTimeout(y), A = !0
            }
            var o, p = parseInt(a.maxPixels / 16) + 4500,
                q = new Float32Array(3 * p),
                r = new Float32Array(6 * p),
                s = new Float32Array(screen.height || 700),
                t = new Float32Array(4 * p),
                u = "",
                v = null,
                w = null,
                x = null,
                y = null,
                z = 0,
                A = !1;
            return {
                hasGrid: j,
                interpolateValues: l,
                interpolate: m,
                cancel: n
            }
        }),
        /*!	
            Copyright (c) 2014 Cameron Beccario - The MIT License (MIT) 
            Copyright (c) 2014 - 2015 Citationtech, S.E. all rights reserved */
        W.define("interFunctions", [], function () {
            function a(a, b) {
                var c = a - b * Math.floor(a / b);
                return c === b ? 0 : c
            }

            function b(a, b, c, d, e, f, g, h, i) {
                var j, k;
                j = b[d] * f + b[d + 3] * g + b[e] * h + b[e + 3] * i, k = b[d + 1] * f + b[d + 4] * g + b[e + 1] * h + b[e + 4] * i, a[0] = j, a[1] = k, a[2] = c ? c[d] * f + c[d + 3] * g + c[e] * h + c[e + 3] * i : Math.sqrt(j * j + k * k)
            }

            function c(a, b, c, d, e, f, g, h, i) {
                a[2] = b[d] * f + b[d + 3] * g + b[e] * h + b[e + 3] * i
            }

            function d(a, b, c, d, e, f, g, h, i) {
                a[0] = b[d] * f + b[d + 3] * g + b[e] * h + b[e + 3] * i, a[1] = b[d + 1] * f + b[d + 4] * g + b[e + 1] * h + b[e + 4] * i, a[2] = b[d + 2] * f + b[d + 5] * g + b[e + 2] * h + b[e + 5] * i
            }

            function e(a, b, c, d, e, f, g, h, i) {
                var j = b[d],
                    k = b[d + 3],
                    l = b[e],
                    m = b[e + 3];
                isNaN(j) || isNaN(k) || isNaN(l) || isNaN(m) ? a[2] = NaN : a[2] = j * f + k * g + l * h + m * i
            }

            function f(b, c, d, e, f, g) {
                return function (h, i, j) {
                    var k = a(i - c, 360) / d,
                        l = (b - h) / e,
                        m = Math.floor(k),
                        n = Math.floor(l),
                        o = k - m,
                        p = l - n,
                        q = 1 - o,
                        r = 1 - p;
                    g[j] = 3 * (n * f + m), g[j + 1] = 3 * ((n + 1) * f + m), g[j + 2] = q * r, g[j + 3] = o * r, g[j + 4] = q * p, g[j + 5] = o * p
                }
            }

            function g(b, c, d, e, f, g, h) {
                var i = a(c - e, 360) / f,
                    j = (d - b) / g,
                    k = Math.floor(i),
                    l = Math.floor(j),
                    m = i - k,
                    n = j - l,
                    o = 1 - m,
                    p = 1 - n,
                    q = o * p,
                    r = m * p,
                    s = o * n,
                    t = m * n;
                return [3 * (l * h + k), 3 * ((l + 1) * h + k), q, r, s, t]
            }

            function h(a, b, c, d, e, f, g) {
                function h(a) {
                    return Math.log(Math.tan(a / 2 + i))
                }
                var i = Math.PI / 4,
                    j = h(e),
                    k = h(d),
                    l = b / (f - g),
                    m = c / (k - j),
                    n = a ? function (b, c) {
                        return a([c, b])
                    } : function (a, b) {
                        var c = (Math.deg2rad(b) - g) * l,
                            d = (k - h(Math.deg2rad(a))) * m;
                        return [c, d]
                    };
                return function (a, b, c, d, e, f) {
                    var g = 0 > b ? 36e-6 : -36e-6,
                        h = 0 > a ? 36e-6 : -36e-6,
                        i = n(a, b + g),
                        j = n(a + h, b),
                        k = Math.cos(a / 720 * Math.PI);
                    e[f] = (i[0] - c) / g / k, e[f + 1] = (i[1] - d) / g / k, e[f + 2] = (j[0] - c) / h, e[f + 3] = (j[1] - d) / h
                }
            }

            function i(a, b, c, d, e, f) {
                var g = a[0] * b,
                    h = a[1] * b;
                return a[0] = c * g + d * h, a[1] = e * g + f * h, a
            }

            function j(a, b, c) {
                var d = c - 4 | 0,
                    e = b - 4 | 0;
                return a.set ? function (f, g, h) {
                    var i = f - e;
                    if (i > 0 && (h = h.slice(0, 4 * (4 - i))), g >= d)
                        for (; c > g; g++) a.set(h, 4 * (g * b + f));
                    else a.set(h, 4 * (g * b + f)), a.set(h, 4 * ((g + 1) * b + f)), a.set(h, 4 * ((g + 2) * b + f)), a.set(h, 4 * ((g + 3) * b + f))
                } : function (c, d, e) {
                    var f, g, h, i, j = e[0],
                        k = e[1],
                        l = e[2],
                        m = e[3];
                    g = 4;
                    do {
                        h = 4, i = c;
                        do f = 4 * (d * b + i), a[f] = j, a[f + 1] = k, a[f + 2] = l, a[f + 3] = m, i++; while (h--);
                        d++
                    } while (g--)
                }
            }
            return {
                floorMod: a,
                interpolateOverlay: c,
                interpolateAll: b,
                interpolateWaves: d,
                interpolateSea: e,
                interpolationFunction: f,
                interpolatePoint: g,
                distortionFunction: h,
                distort: i,
                colorizeFunction: j
            }
        }), /*! */
        W.define("animation", ["broadcast", "object", "globe"], function (a, b, c) {
            function d() {
                window.clearTimeout(p)
            }

            function e(a, b, c, d) {
                var e = m;
                e[c] = a, e[c + 1] = b, e[c + 2] = 0, e[c + 3] = 0, e[c + 4] = Math.floor(Math.random() * d), e[c + 5] = 0
            }

            function f(a, b, d, f) {
                var g = c.dummy([150 * Math.random() - 75, 150 * Math.random() - 75]),
                    h = g[0],
                    i = g[1];
                return h >= 0 && i >= 0 && a >= h && b >= i ? void e(h, i, d, f) : !0
            }

            function g(a, b, c, d) {
                for (; f(a, b, c, d););
            }

            function h(a, b, d, f) {
                var g = c.dummy([150 * Math.random() - 75, 150 * Math.random() - 75]);
                e(g[0], g[1], d, f)
            }

            function i(a, b, c, d) {
                e(Math.random() * a, Math.random() * b, c, d)
            }

            function j(a, c, d) {
                function e() {
                    var b, c, d, e, f, g, h, i, j, k, o, p, q = Math.ceil(y / 4),
                        r = l,
                        s = m,
                        t = n,
                        u = 6 * B,
                        w = a,
                        x = y,
                        G = z,
                        H = E;
                    if (D)
                        for (d = 0; u > d; d += 6) s[d + 4] > C && A(y, z, d, C), b = s[d], c = s[d + 1], p = 3 * (Math.round(c / 4) * q + Math.round(b / 4)), v && -1 === w[p + 2] || b > x || c > G || 0 > b || 0 > c ? (s[d + 4] = C + 1, t[d + 5] = 10) : (f = w[p], g = w[p + 1], h = b + f, i = c + g, s[d] = h, s[d + 1] = i, s[d + 4]++, j = Math.sqrt(f * f + g * g) / 2.5, k = f / j, o = g / j, t[d] = b - o, t[d + 1] = c + k, t[d + 2] = b + o, t[d + 3] = c - k, t[d + 5] = F(s[d + 4]));
                    else
                        for (d = 0; u > d; d += 6) s[d + 4] > C && A(y, z, d, C), b = s[d], c = s[d + 1], p = 3 * (Math.round(c / 4) * q + Math.round(b / 4)), v && -1 === w[p + 2] || b > x || c > G || 0 > b || 0 > c ? (s[d + 4] = C + 1, s[d + 5] = 10) : (s[d + 2] = b + w[p], s[d + 3] = c + w[p + 1], s[d + 4]++, s[d + 5] = F(w[p + 2], b, c));
                    if (r.globalCompositeOperation = "destination-in", r.fillRect(0, 0, y, z), r.globalCompositeOperation = "source-over", D)
                        for (d = 0; 4 > d; d++) {
                            for (r.beginPath(), r.strokeStyle = H[d], e = 0; u > e; e += 6) t[e + 5] === d && (r.moveTo(t[e], t[e + 1]), r.lineTo(t[e + 2], t[e + 3]));
                            r.stroke()
                        } else
                            for (d = 0; 4 > d; d++) {
                                for (r.beginPath(), r.strokeStyle = H[d], e = 0; u > e; e += 6) s[e + 5] === d && (r.moveTo(s[e], s[e + 1]), r.lineTo(s[e + 2], s[e + 3]), s[e] = s[e + 2], s[e + 1] = s[e + 3]);
                                r.stroke()
                            }
                }
                var j;
                window.clearTimeout(p), d && (k = d, l = d.getContext("2d")), l.clearRect(0, 0, k.width, k.height), a ? (j = b.clone(c, ["map"]), j.particles = c.particles, o.rows = a, o.params = j) : (a = o.rows, j = o.params);
                var q = j.particles;
                if (!r) {
                    var s, t, u, v = "globe" === j.map.source,
                        w = j.map.x,
                        x = j.map.y,
                        y = j.map.width,
                        z = j.map.height,
                        A = (j.map.xMax - w, j.map.yMax - x, v ? f : i),
                        B = q.getAmount.call(q, j),
                        C = q.getMaxAge(),
                        D = "wavecle" === q.animation,
                        E = q.getStyles.call(q, j);
                    for (s = 0, t = 0; B > s; s++) A(y, z, t, C) || (t += 6);
                    u = t / 6, v && (B = 0 | u, A = B > u ? g : h), l.lineWidth = q.getLineWidth.call(q, j), l.fillStyle = "rgba(0, 0, 0," + q.getBlendingAlpha.call(q, j) + ")";
                    var F = q.getIntensityFun(j);
                    ! function G() {
                        p = setTimeout(function () {
                            e(), G()
                        }, 40)
                    }()
                }
            }
            var k, l, m = new Float32Array(9e4),
                n = new Float32Array(9e4),
                o = {},
                p = null,
                q = null,
                r = !1;
            return a.on("particlesAnimation", function (a) {
                "off" === a ? (k.style.opacity = 0, r = !0, q = setTimeout(d, 1500)) : (r = !1, clearTimeout(q), j(), k.style.opacity = 1)
            }), c.on("movestart", d), {
                run: j,
                stop: d
            }
        }), /*! */
        W.define("rootScope", [], function () {
            "undefined" == typeof API_MODE && (API_MODE = !1), "undefined" == typeof EMBED_MODE && (EMBED_MODE = !1);
            var a = window.navigator,
                b = {
                    server: "https://www.windytv.com/",
                    server2: "https://www.windytv.com/",
                    tileServer: "https://tiles{s}.windytv.com/tiles/",
                    version: W.version,
                    levels: ["surface", "975h", "950h", "925h", "900h", "850h", "750h", "700h", "550h", "450h", "350h", "300h", "250h", "200h", "150h"],
                    overlays: ["wind", "temp", "pressure", "clouds", "rh", "gust", "snow", "lclouds", "rain", "snowcover", "waves", "swell", "wwaves", "swellperiod", "sst", "sstanom", "currents"],
                    acTimes: ["past3d", "past24h", "next24h", "next3d", "next"],
                    localModels: ["mbeurope", "namConus", "namHawaii", "namAlaska"],
                    browser: L.Browser,
                    isTouch: L.Browser.touch,
                    isMobile: L.Browser.mobile || window.screen && window.screen.width < 701,
                    maxZoom: EMBED_MODE || API_MODE ? 11 : 17,
                    isRetina: L.Browser.retina,
                    maxPixels: window.screen && window.screen.width * window.screen.height || 364e4,
                    prefLang: a.languages ? a.languages[0] : a.language || a.browserLanguage || a.systemLanguage || a.userLanguage || "en",
                    params: {
                        overlay: "wind",
                        level: "surface",
                        acTime: "next24h",
                        product: "gfs",
                        model: "gfs"
                    },
                    setLang: "en",
                    hereMapsID: "app_id=8d70J5U3FIr56AaYUPtD&app_code=MqhlkYGq9_i_t4RIbeX3RQ"
                };
            return b
        }), /*! */
        W.define("settings", ["storage", "broadcast", "rootScope", "geolocation"], function (a, b, c) {
            var d = {
                    map: {
                        def: "esritopo",
                        allowed: ["hereterrain", "heresat", "esritopo"]
                    },
                    retina: {
                        def: !1,
                        allowed: [!0, !1]
                    },
                    "3d": {
                        def: !0,
                        allowed: [!0, !1]
                    },
                    graticule: {
                        def: !1,
                        allowed: [!0, !1]
                    },
                    weatherv2: {
                        def: !0,
                        allowed: [!0, !1]
                    },
                    wasDragged: {
                        def: !1,
                        allowed: [!0, !1]
                    }
                },
                e = c.geoIP && c.geoIP.country ? c.geoIP.country : "other";
            return {
                defaults: /US|MY|LR/.test(e) ? "imperial" : "metric",
                set: function (c, e) {
                    var f = d[c];
                    f && f.allowed.indexOf(e) > -1 && (a.put("settings_" + c, e), b.emit("settingsChanged", c, e))
                },
                get: function (b) {
                    var c = d[b],
                        e = a.get("settings_" + b);
                    return c && c.allowed.indexOf(e) > -1 ? e : c ? c.def : null
                },
                getHoursFunction: function () {
                    return /US|UK|PH|CA|AU|NZ|IN|EG|SA|CO|PK|MY/.test(e) ? function (a) {
                        return (a + 11) % 12 + 1 + (a >= 12 ? " PM" : " AM")
                    } : function (a) {
                        return a + ":00"
                    }
                }
            }
        }), /*! */
        W.define("calendar", ["prototypes", "settings", "object", "log", "trans"], function (a, b, c, d, e) {
            function f(a) {
                this.calendarDays = a.calendarDays || 12, this.numOfDays = a.numOfDays || 12, this.midnight = (new Date).midnight(), this.startOfTimeline = a.startOfTimeline || this.midnight, this.start = this.startOfTimeline.getTime(), this.days = [], this.endOfcalendar = this.startOfTimeline.add(this.calendarDays, "days"), this.endOfCal = this.endOfcalendar.getTime(), this.maxTimestamp = this.endOfcalendar.getTime(), this.longWeekdays = this.calendarDays < 8, this.type = this.endOfcalendar < this.midnight ? "historical" : this.startOfTimeline < this.midnight ? "mixed" : "forecast", this.timestamps = [], this.paths = [], this.interTimestamps = [];
                for (var b, c, d, e, f, h = this.startOfTimeline.add(12), i = 0; i < this.calendarDays; i++) e = this.startOfTimeline.add(i, "days").getTime(), f = this.startOfTimeline.add(24).add(i, "days").getTime(), b = h.add(i, "days"), c = b.getTime(), d = g[b.getDay()], this.days[i] = {
                    display: "historical" === this.type ? null : this.longWeekdays ? d : d + "2",
                    displayLong: d,
                    displayShort: d + "2",
                    day: b.getDate(),
                    middayTs: c,
                    start: e,
                    end: f,
                    clickable: i < this.numOfDays,
                    month: b.getMonth() + 1,
                    year: b.getFullYear()
                };
                for (a.minifest ? this.createTimestampsFromMinifest(a.minifest) : this.createTimestamps(), i = 1; i < this.paths.length; i++) this.interTimestamps.push(this.timestamps[i - 1] + Math.floor((this.timestamps[i] - this.timestamps[i - 1]) / 2));
                return this.end = Math.min(this.timestamps[this.timestamps.length - 1], this.endOfCal), this
            }
            var g = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"],
                h = b.getHoursFunction();
            return ("object" != typeof minifest || Object.keys(minifest).length < 10) && (minifest = function () {
                    for (var a, b = {}, c = (new Date).add(-18, "hours"), d = c.getDate().pad() + "XX", e = 0; 15 > e; e++) {
                        a = c.add(e, "days").getDate().pad();
                        for (var f = 0; 24 > f; f += 3)(10 > e || 6 === f || 18 === f) && (b[a + f.pad()] = d)
                    }
                    return b
                }(), d.event("Minifest missing!!!")), f.prototype = {
                    createTimestamps: function () {
                        var a, b, c = this.startOfTimeline.getUTCHours() % 3;
                        for (c && (this.startOfTimeline = this.startOfTimeline.add(3 - c, "hours")), b = 0; b < 24 * this.numOfDays; b += 3) a = this.startOfTimeline.add(b, "hours"), this.paths.push(this.date2path(a)), this.timestamps.push(a.getTime())
                    },
                    createTimestampsFromMinifest: function (a) {
                        var b, c, d, e, f = this.startOfTimeline.add(12, "days").getTime();
                        for (c = 0; c <= 24 * (1 + this.numOfDays); c++)
                            if (d = this.startOfTimeline.add(c), b = d.getUTCDate().pad(2) + d.getUTCHours().pad(2), a[b]) {
                                if (e = d.getTime(), e > f) break;
                                this.timestamps.push(e), this.paths.push(this.date2path(d))
                            }
                    },
                    date2path: function (a) {
                        return [a.getUTCFullYear(), (a.getUTCMonth() + 1).pad(2), a.getUTCDate().pad(2), a.getUTCHours().pad(2)].join("/")
                    },
                    ts2path: function (a) {
                        var b, c = this.interTimestamps;
                        for (b = 0; b < c.length; b++)
                            if (a < c[b]) return this.paths[b];
                        return this.paths[c.length - 1]
                    },
                    path2date: function (a) {
                        var b = a.split("/");
                        return new Date(Date.UTC(b[0], b[1] - 1, b[2], b[3], 0, 0))
                    },
                    path2string: function (a) {
                        var b = this.path2date(a),
                            c = b.getDay(),
                            d = b.getDate(),
                            f = h(b.getHours());
                        return e[g[c]] + " " + d + " - " + f
                    }
                },
                function (a) {
                    return new f(a)
                }
        }), /*! */
        W.define("overlays", ["Class", "storage", "broadcast", "settings", "colors", "interFunctions"], function (a, b, c, d, e, f) {
            var g = {},
                h = [3, 3, 3, 3, 5, 5, 7, 8, 9, 10, 11, 12, 12, 12, 12, 12, 12, 12],
                i = [4, 4, 4, 4, 4, 4, 5, 6, 7, 8, 10, 10, 10, 10, 10, 10, 10, 10],
                j = "metric" === d.defaults ? 0 : 1;
            return g.trans = {
                wind: "WIND",
                gust: "GUST",
                temp: "TEMP",
                pressure: "PRESS",
                clouds: "CLOUDS",
                lclouds: "LCLOUDS",
                rain: "RACCU",
                snow: "SNOW",
                rh: "RH",
                waves: "WAVES",
                swell: "SWELL",
                wwaves: "WWAVES",
                swellperiod: "SWELLPER",
                snowcover: "SNOWCOVER",
                sst: "SST2",
                sstanom: "SSTA2",
                currents: "CURRENT",
                sstavg: "SST2"
            }, W.Overlay = a.extend({
                conv: {},
                defaults: [],
                separator: " ",
                dataLoading: -1,
                filename: null,
                sea: null,
                interpolate: f.interpolateAll,
                _init: function () {
                    var a = b.get("settings_" + this.ident);
                    a && this.conv[a] ? this.metric = a : this.metric = this.defaults[j], this.gradient && this.prepareColors()
                },
                prepareColors: function () {
                    var a, b, c = e.segmentedColorScale(this.gradient);
                    for (this.preparedColors = [], this.colorsArray = [], this.startingValue = this.bounds[0], this.step = (this.bounds[1] - this.startingValue) / this.steps, a = 0; a < this.steps; a++) b = c(this.startingValue + this.step * a), this.preparedColors[a] = b, this.colorsArray[a] = b.concat(b).concat(b).concat(b)
                },
                convertValue: function (a) {
                    var b = this.conv[this.metric];
                    return "undefined" == typeof a ? "" : b.conversion(a).toFixed(b.precision) + this.separator + (b.label || this.metric)
                },
                convertNumber: function (a) {
                    var b = this.conv[this.metric];
                    return parseFloat(b.conversion(a).toFixed(b.precision))
                },
                setMetric: function (a) {
                    this.conv[a] && this.metric !== a && (this.metric = a, b.put("settings_" + this.ident, a), c.emit("metricChanged", this.ident, a), c.emit("log", "settings/" + this.ident + "/" + a))
                },
                color: function (a, b) {
                    var c = this.colorsArray[Math.floor((a - this.startingValue) / this.step)];
                    return "rgba(" + c[0] + "," + c[1] + "," + c[2] + "," + (b || c[3]) + ")"
                },
                paintLegend: function () {
                    if (!this.description) return "";
                    var a, b, c, d, e = "",
                        f = this.description.indexOf(this.metric);
                    for (a = 0; a < this.lines.length; a++) b = this.lines[a], c = this.preparedColors[Math.floor((b[0] - this.startingValue) / this.step)], d = "rgba(" + c[0] + "," + c[1] + "," + c[2] + "," + c[3] / 200 + ")", e || (e = '<div style="background-color:' + d + ';">' + this.metric + "</div>"), e += '<div style="background-color:' + d + ';">' + this.lines[a][1 + f] + "</div>";
                    return e
                }
            }), g.temp = W.Overlay.extend({
                ident: "temp",
                pois: "cities",
                metric: null,
                separator: "",
                defaults: ["°C", "°F"],
                conv: {
                    "°C": {
                        conversion: function (a) {
                            return a - 273.15
                        },
                        precision: 0
                    },
                    "°F": {
                        conversion: function (a) {
                            return 9 * a / 5 - 459.67
                        },
                        precision: 0
                    }
                },
                bounds: [193, 328],
                steps: 200,
                blur: i,
                gradient: [
                    [193, [37, 4, 42, 120]],
                    [206, [41, 10, 130, 120]],
                    [219, [81, 40, 40, 120]],
                    [233.15, [192, 37, 149, 120]],
                    [255.372, [70, 215, 215, 120]],
                    [273.15, [21, 84, 187, 120]],
                    [275.15, [24, 132, 14, 120]],
                    [291, [247, 251, 59, 120]],
                    [298, [235, 167, 21, 120]],
                    [311, [230, 71, 39, 120]],
                    [328, [88, 27, 67, 120]]
                ],
                description: ["°C", "°F"],
                lines: [
                    [237, -35, -31],
                    [242, -30, -22],
                    [247, -25, -13],
                    [252, -20, -4],
                    [257, -15, 5],
                    [262, -10, 14],
                    [267, -5, 23],
                    [272, 0, 32],
                    [277, 5, 41],
                    [282, 10, 50],
                    [287, 15, 59],
                    [292, 20, 68],
                    [297, 25, 77],
                    [302, 30, 86],
                    [307, 35, 95]
                ]
            }), g.wind = W.Overlay.extend({
                ident: "wind",
                pois: "metars",
                defaults: ["kt", "kt"],
                conv: {
                    kt: {
                        conversion: function (a) {
                            return 1.943844 * a
                        },
                        precision: 0
                    },
                    bft: {
                        conversion: function (a) {
                            return .3 > a ? 0 : 1.5 > a ? 1 : 3.3 > a ? 2 : 5.5 > a ? 3 : 8 > a ? 4 : 10.8 > a ? 5 : 13.9 > a ? 6 : 17.2 > a ? 7 : 20.7 > a ? 8 : 24.5 > a ? 9 : 28.4 > a ? 10 : 32.6 > a ? 11 : 12
                        },
                        precision: 0
                    },
                    "m/s": {
                        conversion: function (a) {
                            return a
                        },
                        precision: 1
                    },
                    "km/h": {
                        conversion: function (a) {
                            return 3.6 * a
                        },
                        precision: 0
                    },
                    mph: {
                        conversion: function (a) {
                            return 2.236936 * a
                        },
                        precision: 0
                    }
                },
                bounds: [0, 100],
                steps: 300,
                blur: i,
                gradient: [
                    [0, [37, 74, 255, 80]],
                    [1, [0, 100, 254, 80]],
                    [3, [0, 200, 254, 80]],
                    [5, [37, 193, 146, 80]],
                    [7, [0, 230, 0, 80]],
                    [9, [0, 250, 0, 80]],
                    [11, [254, 225, 0, 80]],
                    [13, [254, 174, 0, 80]],
                    [15, [220, 74, 29, 80]],
                    [17, [180, 0, 50, 80]],
                    [19, [254, 0, 150, 80]],
                    [21, [151, 50, 222, 80]],
                    [24, [86, 54, 222, 80]],
                    [27, [42, 132, 222, 80]],
                    [29, [64, 199, 222, 80]],
                    [100, [150, 0, 254, 80]]
                ],
                description: ["kt", "bft", "m/s", "mph", "km/h"],
                lines: [
                    [0, 0, 0, 0, 0, 0],
                    [2, 4, 2, 2, 4, 7],
                    [4, 8, 3, 4, 9, 14],
                    [6, 12, 4, 6, 13, 22],
                    [8, 16, 5, 8, 18, 29],
                    [10, 20, 5, 10, 22, 36],
                    [12, 24, 6, 12, 27, 43],
                    [14, 28, 7, 14, 31, 50],
                    [16, 32, 7, 16, 36, 58],
                    [18, 36, 8, 18, 40, 65],
                    [20, 44, 9, 20, 45, 72],
                    [24, 48, 9, 24, 55, 88],
                    [27, 52, 10, 27, 60, 96],
                    [29, 56, 11, 29, 64, 103]
                ],
                bgcolor: function (a) {
                    return a /= .514, 2 > a ? "rgba(37, 74, 255, 0.01)" : 6 > a ? "rgba(0, 150, 254, 0.1)" : 10 > a ? "rgba(18, 196, 200, 0.25)" : 14 > a ? "rgba(18, 211, 73, 0.4)" : 18 > a ? "rgba(0, 240, 0, 0.5)" : 22 > a ? "rgba(127, 237, 0, 0.5)" : 26 > a ? "rgba(254, 199, 0, 0.5)" : 30 > a ? "rgba(237, 124, 14, 0.5)" : 34 > a ? "rgba(200, 37, 39, 0.5)" : 38 > a ? "rgba(217, 0, 100, 0.5)" : 46 > a ? "rgba(202, 25, 186, 0.5)" : 50 > a ? "rgba(86, 54, 222, 0.5)" : "rgba(42, 132, 222, 0.5)"
                }
            }), g.gust = g.wind, g.rh = W.Overlay.extend({
                ident: "rh",
                pois: "metars",
                defaults: ["%", "%"],
                conv: {
                    "%": {
                        conversion: function (a) {
                            return a
                        },
                        precision: 0
                    }
                },
                bounds: [0, 110],
                steps: 200,
                blur: i,
                gradient: [
                    [0, [0, 0, 0, 80]],
                    [30, [0, 0, 0, 80]],
                    [40, [127, 127, 127, 80]],
                    [50, [255, 255, 255, 90]],
                    [60, [255, 255, 255, 90]],
                    [70, [230, 240, 255, 90]],
                    [75, [0, 108, 192, 90]],
                    [80, [0, 188, 0, 90]],
                    [83, [156, 220, 0, 90]],
                    [87, [224, 220, 0, 90]],
                    [90, [252, 132, 0, 90]],
                    [93, [252, 0, 0, 90]],
                    [97, [160, 0, 0, 90]],
                    [100, [160, 0, 0, 90]]
                ],
                description: ["%"],
                lines: [
                    [75, 75],
                    [80, 80],
                    [85, 85],
                    [90, 90],
                    [95, 95],
                    [100, 100]
                ]
            }), g.pressure = W.Overlay.extend({
                ident: "pressure",
                pois: "pressure",
                defaults: ["hPa", "inHg"],
                conv: {
                    hPa: {
                        conversion: function (a) {
                            return a / 100
                        },
                        precision: 0
                    },
                    mmHg: {
                        conversion: function (a) {
                            return a / 133.322387415
                        },
                        precision: 0
                    },
                    inHg: {
                        conversion: function (a) {
                            return a / 3386.389
                        },
                        precision: 2
                    }
                },
                bounds: [92e3, 108e3],
                steps: 200,
                blur: i,
                gradient: [
                    [99e3, [37, 4, 42, 120]],
                    [99500, [41, 10, 130, 120]],
                    [1e5, [81, 40, 40, 120]],
                    [100300, [192, 37, 149, 120]],
                    [100600, [70, 215, 215, 120]],
                    [100900, [21, 84, 187, 120]],
                    [101500, [24, 132, 14, 120]],
                    [101900, [247, 251, 59, 120]],
                    [102200, [235, 167, 21, 120]],
                    [102500, [230, 71, 39, 120]],
                    [103e3, [88, 27, 67, 120]]
                ],
                description: ["hPa", "inHg"],
                lines: [
                    [99500, 995, 29.38],
                    [99800, 998, 29.47],
                    [100100, 1001, 29.56],
                    [100400, 1004, 29.64],
                    [100700, 1007, 29.73],
                    [101e3, 1010, 29.82],
                    [101300, 1013, 29.91],
                    [101600, 1016, 30],
                    [101900, 1019, 30.09],
                    [102200, 1022, 30.17],
                    [102500, 1025, 30.27],
                    [102800, 1028, 30.36]
                ]
            }), g.clouds = W.Overlay.extend({
                ident: "clouds",
                pois: "metars",
                defaults: ["mm/h", "in/h"],
                conv: {
                    "in/h": {
                        conversion: function (a) {
                            return (a - 200) / 60 * .039
                        },
                        label: "in/h",
                        precision: 2
                    },
                    "mm/h": {
                        conversion: function (a) {
                            return (a - 200) / 60
                        },
                        label: "mm/h",
                        precision: 1
                    }
                },
                bounds: [0, 2e3],
                steps: 1e3,
                blur: h,
                gradient: [
                    [0, [0, 0, 0, 80]],
                    [10, [0, 0, 0, 80]],
                    [30, [127, 127, 127, 80]],
                    [100, [255, 255, 255, 90]],
                    [180, [255, 255, 255, 90]],
                    [200, [230, 240, 255, 90]],
                    [240, [0, 108, 192, 90]],
                    [270, [0, 188, 0, 90]],
                    [300, [156, 220, 0, 90]],
                    [350, [224, 220, 0, 90]],
                    [400, [252, 132, 0, 90]],
                    [500, [252, 0, 0, 90]],
                    [700, [160, 0, 0, 90]],
                    [2e3, [160, 0, 0, 90]]
                ],
                description: ["mm/h", "in/h"],
                lines: [
                    [230, .5, ".02"],
                    [260, 1, ".04"],
                    [290, 1.5, ".06"],
                    [320, 2, ".08"],
                    [380, 3, ".12"],
                    [440, 4, ".16"],
                    [500, 5, ".2"],
                    [620, 7, ".3"],
                    [800, 10, ".4"]
                ]
            }), g.snow = W.Overlay.extend({
                ident: "snow",
                pois: "empty",
                defaults: ["cm", "in"],
                conv: {
                    "in": {
                        conversion: function (a) {
                            return .039 * a
                        },
                        precision: 1
                    },
                    cm: {
                        conversion: function (a) {
                            return a / 10
                        },
                        precision: 1
                    }
                },
                intterpolate: f.interpolateOverlay,
                bounds: [0, 8e3],
                dataLoading: 0,
                steps: 8e3,
                blur: i,
                gradient: [
                    [0, [0, 0, 0, 80]],
                    [40, [0, 0, 0, 80]],
                    [100, [107, 63, 180, 90]],
                    [200, [27, 160, 223, 100]],
                    [300, [0, 225, 158, 120]],
                    [500, [165, 242, 76, 120]],
                    [800, [231, 178, 18, 120]],
                    [1500, [255, 112, 67, 120]],
                    [3e3, [238, 61, 150, 120]],
                    [8e3, [116, 58, 174, 120]]
                ],
                description: ["cm", "in"],
                lines: [
                    [80, 8, 3.1],
                    [100, 10, 3.9],
                    [200, 20, 8],
                    [300, 30, 11],
                    [500, 50, 20],
                    [1e3, "1m", "3ft"],
                    [2e3, "2m", "6ft"],
                    [3e3, "3m", "9ft"]
                ]
            }), g.rain = g.snow.extend({
                ident: "rain",
                pois: "empty",
                defaults: ["mm", "in"],
                conv: {
                    "in": {
                        conversion: function (a) {
                            return .039 * a
                        },
                        precision: 1
                    },
                    mm: {
                        conversion: function (a) {
                            return a
                        },
                        precision: 1
                    }
                },
                intterpolate: f.interpolateOverlay,
                bounds: [0, 8e3],
                steps: 8e3,
                blur: i,
                gradient: [
                    [0, [0, 0, 0, 80]],
                    [1, [0, 0, 0, 80]],
                    [5, [107, 63, 180, 90]],
                    [10, [27, 160, 223, 100]],
                    [30, [0, 225, 158, 120]],
                    [40, [165, 242, 76, 120]],
                    [80, [231, 178, 18, 120]],
                    [120, [255, 112, 67, 120]],
                    [500, [238, 61, 150, 120]],
                    [8e3, [116, 58, 174, 120]]
                ],
                description: ["mm", "in"],
                lines: [
                    [5, 5, ".2"],
                    [10, 10, ".4"],
                    [20, 20, ".8"],
                    [30, 30, "1.2"],
                    [40, 40, 1.5],
                    [100, 100, 3.9],
                    [1e3, "1m", "3ft"],
                    [3e3, "3m", "9ft"]
                ]
            }), g.snowcover = g.snow.extend({
                bounds: [0, 3],
                steps: 30,
                blur: i,
                intterpolate: f.interpolateOverlay,
                gradient: [
                    [0, [0, 0, 0, 100]],
                    [1, [0, 212, 255, 100]],
                    [3, [0, 212, 255, 100]]
                ],
                description: null,
                lines: null
            }), g.lclouds = g.clouds.extend({
                pois: "metars",
                bounds: [0, 200],
                steps: 50,
                blur: h,
                gradient: [
                    [0, [0, 0, 0, 80]],
                    [10, [0, 0, 0, 80]],
                    [30, [255, 255, 255, 20]],
                    [100, [255, 255, 255, 90]]
                ],
                lines: null,
                description: null
            }), g.waves = W.Overlay.extend({
                ident: "waves",
                pois: "empty",
                defaults: ["m", "ft"],
                conv: {
                    m: {
                        conversion: function (a) {
                            return a
                        },
                        precision: 1
                    },
                    ft: {
                        conversion: function (a) {
                            return 3.28 * a
                        },
                        precision: 0
                    }
                },
                bounds: [0, 30],
                steps: 400,
                dataLoading: 5,
                interpolate: f.interpolateWaves,
                sea: !0,
                blur: i,
                gradient: [
                    [0, [198, 244, 255, 100]],
                    [1, [0, 194, 243, 100]],
                    [2, [0, 89, 166, 100]],
                    [3, [13, 100, 255, 100]],
                    [4, [247, 74, 255, 100]],
                    [5, [188, 0, 184, 100]],
                    [6, [255, 4, 83, 100]],
                    [7, [255, 98, 69, 100]],
                    [10, [255, 255, 255, 100]],
                    [50, [188, 141, 190, 100]]
                ],
                description: ["m", "ft"],
                lines: [
                    [.5, .5, 1.6],
                    [1, 1, 3.3],
                    [1.5, 1.5, 5],
                    [2, 2, 6.6],
                    [3, 3, 10],
                    [4, 4, 13],
                    [5, 5, 16],
                    [6, 6, 20],
                    [7, 7, 23],
                    [8, 8, 26],
                    [9, 9, 30]
                ]
            }), g.swell = g.waves, g.wwaves = g.waves, g.swellperiod = W.Overlay.extend({
                ident: "swellperiod",
                filename: "swell",
                pois: "empty",
                defaults: ["sec.", "sec."],
                conv: {
                    "sec.": {
                        conversion: function (a) {
                            return a
                        },
                        precision: 1
                    }
                },
                bounds: [0, 30],
                steps: 400,
                dataLoading: 5,
                sea: !0,
                blur: i,
                gradient: [
                    [0, [37, 4, 42, 120]],
                    [2, [41, 10, 130, 120]],
                    [4, [81, 40, 40, 120]],
                    [6, [192, 37, 149, 120]],
                    [8, [70, 215, 215, 120]],
                    [10, [21, 84, 187, 120]],
                    [12, [24, 132, 14, 120]],
                    [14, [247, 251, 59, 120]],
                    [16, [235, 167, 21, 120]],
                    [18, [230, 71, 39, 120]],
                    [29, [88, 27, 67, 120]]
                ],
                description: ["sec."],
                lines: [
                    [2, 2],
                    [4, 4],
                    [6, 6],
                    [8, 8],
                    [12, 12],
                    [14, 14],
                    [16, 16],
                    [18, 18],
                    [20, 20]
                ]
            }), g.sst = W.Overlay.extend({
                ident: "sst",
                filename: "sstcombined",
                pois: "empty",
                metric: null,
                separator: "",
                defaults: ["°C", "°F"],
                conv: {
                    "°C": {
                        conversion: function (a) {
                            return a
                        },
                        precision: 1
                    },
                    "°F": {
                        conversion: function (a) {
                            return 1.8 * a + 32
                        },
                        precision: 1
                    }
                },
                dataLoading: 5,
                sea: !0,
                interpolate: f.interpolateWaves,
                bounds: [-2, 40],
                steps: 1e3,
                blur: i,
                gradient: [
                    [-2, [37, 4, 42, 120]],
                    [0, [41, 10, 130, 120]],
                    [1, [81, 40, 40, 120]],
                    [2, [192, 37, 149, 120]],
                    [5, [70, 215, 215, 120]],
                    [9, [21, 84, 187, 120]],
                    [16, [24, 132, 14, 120]],
                    [19, [247, 251, 59, 120]],
                    [22, [235, 167, 21, 120]],
                    [25, [230, 71, 39, 120]],
                    [28, [192, 37, 149, 120]],
                    [31, [41, 10, 130, 120]],
                    [40, [255, 255, 255, 120]]
                ],
                description: ["°C", "°F"],
                lines: [
                    [28, 28, 82],
                    [26, 26, 78],
                    [24, 24, 75],
                    [22, 22, 71],
                    [20, 20, 68],
                    [18, 18, 64],
                    [16, 16, 60],
                    [14, 14, 57],
                    [12, 12, 53],
                    [10, 10, 50],
                    [8, 8, 46],
                    [6, 6, 42],
                    [4, 4, 39],
                    [2, 2, 35],
                    [0, 0, 32]
                ]
            }), g.sstanom = W.Overlay.extend({
                ident: "sstanom",
                pois: "empty",
                metric: null,
                separator: "",
                defaults: ["°C"],
                conv: {
                    "°C": {
                        conversion: function (a) {
                            return a
                        },
                        precision: 2
                    }
                },
                bounds: [-10, 10],
                steps: 200,
                blur: i,
                interpolate: f.interpolateOverlay,
                dataLoading: 4,
                sea: !0,
                gradient: [
                    [-10, [255, 255, 255, 120]],
                    [-3, [9, 31, 246, 120]],
                    [-1, [9, 221, 246, 120]],
                    [0, [130, 130, 130, 120]],
                    [1, [246, 238, 9, 120]],
                    [2, [246, 9, 9, 120]],
                    [2.5, [246, 9, 244, 120],
                        [10, [255, 255, 255, 120]]
                    ]
                ],
                description: ["°C"],
                lines: [
                    [3, 3],
                    [2, 2],
                    [1, 1],
                    [0, 0],
                    [-1, -1],
                    [-2, -2],
                    [-3, -3]
                ]
            }), g.sstavg = g.sst.extend({
                filename: null,
                dataLoading: 4,
                products: ["sstavg"],
                interpolate: f.interpolateOverlay
            }), g.currents = W.Overlay.extend({
                ident: "currents",
                filename: "sstcombined",
                pois: "empty",
                separator: " ",
                dataLoading: 5,
                sea: !0,
                defaults: ["kt", "kt"],
                conv: {
                    kt: {
                        conversion: function (a) {
                            return 1.943844 * a
                        },
                        precision: 1
                    },
                    "m/s": {
                        conversion: function (a) {
                            return a
                        },
                        precision: 2
                    },
                    "km/h": {
                        conversion: function (a) {
                            return 3.6 * a
                        },
                        precision: 1
                    },
                    mph: {
                        conversion: function (a) {
                            return 2.236936 * a
                        },
                        precision: 1
                    }
                },
                products: ["sea"],
                bounds: [0, 4],
                steps: 300,
                blur: i,
                gradient: [
                    [0, [37, 74, 255, 80]],
                    [.02, [0, 100, 254, 80]],
                    [.06, [0, 200, 254, 80]],
                    [.1, [37, 193, 146, 80]],
                    [.15, [0, 230, 0, 80]],
                    [.2, [0, 250, 0, 80]],
                    [.3, [254, 225, 0, 80]],
                    [.4, [254, 174, 0, 80]],
                    [.5, [220, 74, 29, 80]],
                    [.6, [180, 0, 50, 80]],
                    [.7, [254, 0, 150, 80]],
                    [.8, [151, 50, 222, 80]],
                    [.85, [86, 54, 222, 80]],
                    [.9, [42, 132, 222, 80]],
                    [1, [64, 199, 222, 80]],
                    [1.5, [255, 255, 255, 80]],
                    [4, [255, 255, 255, 80]]
                ],
                description: ["kt", "m/s", "mph", "km/h"],
                lines: [
                    [0, 0, 0, 0, 0],
                    [.2, .4, .2, .4, .7],
                    [.4, .8, .4, .9, 1.4],
                    [.6, 1.2, .6, 1.3, 2.2],
                    [.8, 1.6, .8, 1.8, 2.9],
                    [1, 2, 1, 2.2, 3.6],
                    [1.2, 2.4, 1.2, 2.7, 4.3],
                    [1.4, 2.8, 1.4, 3.1, 5],
                    [1.6, 3.2, 1.6, 3.6, 5.8]
                ]
            }), g
        }),
        /*! 
            Copyright (c) 2014 Cameron Beccario - The MIT License (MIT) */
        W.define("colors", [], function () {
            function a(a) {
                function b(a, b) {
                    var c = a[0],
                        d = a[1],
                        e = a[2],
                        f = a[3],
                        g = b[0] - c,
                        h = b[1] - d,
                        i = b[2] - e,
                        j = b[3] - f;
                    return function (a) {
                        return [Math.floor(c + a * g), Math.floor(d + a * h), Math.floor(e + a * i), Math.floor(f + a * j)]
                    }
                }

                function c(a, b, c) {
                    return (Math.max(b, Math.min(a, c)) - b) / (c - b)
                }
                for (var d = [], e = [], f = [], g = 0; g < a.length - 1; g++) d.push(a[g + 1][0]), e.push(b(a[g][1], a[g + 1][1])), f.push([a[g][0], a[g + 1][0]]);
                return function (a) {
                    var b;
                    for (b = 0; b < d.length - 1 && !(a <= d[b]); b++);
                    var g = f[b];
                    return e[b](c(a, g[0], g[1]))
                }
            }
            return {
                segmentedColorScale: a
            }
        }), /*! */
        W.define("loader", ["http", "dataStore", "object", "jsonLoader", "imgLoader"], function (a, b, c, d, e) {
            function f(a) {
                var c, f, g = [],
                    h = /\.jpg|\.png/.test(a.fullPath) ? e : d,
                    i = b.get(),
                    j = h.getRequiredTiles(a.map, a.tileZoom);
                for (c = 0; c < j.tiles.length; c++) g.push(h.loadTile(i, j, a, c));
                return f = new Promise(function (b, c) {
                    Promise.all(g).then(function (c) {
                        b(h.composeObject(i, c, a, j))
                    })["catch"](c)
                }), f.cancel = function () {
                    for (c = 0; c < g.length; c++) "function" == typeof g[c].cancel && g[c].cancel()
                }, f
            }

            function g(a, b, c) {
                return a.self.checkTiles(a, b, c)
            }
            return {
                load: f,
                checkTiles: g
            }
        }), /*! */
        W.define("jsonLoader", ["http", "lruCache", "object"], function (a, b, c) {
            var d = c.extend({}, {
                tilesCache: new b(30),
                emptyGrid: null,
                tilePrefix: "t",
                tileParams: [{
                    size: 360,
                    width: 1,
                    tileSize: 360,
                    resolution: 1
                }, {
                    size: 30,
                    width: 12,
                    tileSize: 120,
                    resolution: .25
                }, {
                    size: 15,
                    width: 24,
                    tileSize: 120,
                    resolution: .125
                }, {
                    size: 7.5,
                    width: 48,
                    tileSize: 120,
                    resolution: .0625
                }, {
                    size: 3.75,
                    width: 96,
                    tileSize: 120,
                    resolution: .03125
                }, {
                    size: 1.875,
                    width: 192,
                    tileSize: 120,
                    resolution: .015625
                }, {}, {}, {
                    size: 60,
                    width: 6,
                    tileSize: 120,
                    resolution: .5
                }],
                _init: function () {
                    for (var a = [], b = 0; 14400 > b; b++) a[b] = null;
                    this.emptyGrid = [{
                        data: a
                    }, {
                        data: a
                    }]
                },
                getRequiredTiles: function (a, b) {
                    if (0 == b) return {
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0,
                        width: 1,
                        height: 1,
                        tileZoom: 0,
                        tileSize: 360,
                        size: 360,
                        tiles: [{
                            x: 0,
                            y: 0
                        }],
                        paths: [""],
                        wrapped: !0,
                        resolution: 1,
                        self: this
                    };
                    var c, d, e, f, g = [],
                        h = [],
                        i = this.tilePrefix + b,
                        j = this.tileParams[b],
                        k = Math.floor(a.west / j.size),
                        l = Math.floor(a.east / j.size),
                        m = Math.floor((90 - a.north) / j.size),
                        n = Math.floor((90 - a.south) / j.size);
                    for (k = 0 > k ? j.width + k : k, l = 0 > l ? j.width + l : l, k > l && (l += j.width), c = m, f = 0; n >= c; c++, f++)
                        for (d = k, e = 0; l >= d; d++, e++) g.push({
                            y: f,
                            x: e
                        }), h.push(i + "/" + c + "/" + (d > j.width - 1 ? d - j.width : d) + "/");
                    return {
                        left: k,
                        right: l,
                        top: m,
                        bottom: n,
                        width: l - k + 1,
                        height: n - m + 1,
                        tileZoom: b,
                        tileSize: j.tileSize,
                        size: j.size,
                        tiles: g,
                        paths: h,
                        wrapped: !1,
                        resolution: j.resolution,
                        self: this
                    }
                },
                checkTiles: function (a, b, c) {
                    var d, e = a.paths,
                        f = this.getRequiredTiles(b, c).paths;
                    for (d = 0; d < f.length; d++)
                        if (-1 === e.indexOf(f[d])) return !1;
                    return !0
                },
                composeObject: function (a, b, d, e) {
                    var f = {
                        tiles: e,
                        tileZoom: d.tileZoom,
                        overlay: d.gridName,
                        product: d.product,
                        level: d.level,
                        lastModified: b[0].lastModified,
                        data: a,
                        destWidth: e.tileSize * e.width + 1
                    };
                    if (0 === d.tileZoom) c.include(f, b[0]);
                    else {
                        var g = (1 + e.right) * e.size - e.resolution;
                        c.include(f, {
                            lo1: e.left * e.size,
                            lo2: g > 360 ? g - 360 : g,
                            la2: 90 - e.top * e.size,
                            la1: 90 - (1 + e.bottom) * e.size - e.resolution,
                            dx: e.resolution,
                            dy: e.resolution
                        })
                    }
                    return f
                },
                loadTile: function (b, c, d, e) {
                    var f, g, h, i, j = this,
                        k = c.tiles[e],
                        l = d.fullPath.replace(/<tiles>/, c.paths[e]),
                        m = {
                            cache: this.tilesCache,
                            parseHeaders: 0 === e
                        };
                    return c.tileZoom && (m.substituteData = this.emptyTable), g = new Promise(function (g, n) {
                        f = a.get(l, m).then(function (a) {
                            if (h = j.injectData(a.data, b, d, k.x, k.y, c), 0 === e) try {
                                i = new Date(a.headers["last-modified"]), h.lastModified = i.getTime()
                            } catch (f) {}
                            g(h)
                        })
                    }), g.cancel = function () {
                        "function" == typeof f.cancel && f.cancel()
                    }, g
                },
                injectData: function (a, b, c, d, e, f) {
                    var g, h, i, j, k, l, m, n, o = a[0].data || a[0],
                        p = a[1] && (a[1].data || a[1]),
                        q = a[2] && (a[2].data || a[2]),
                        r = 0,
                        s = 0,
                        t = c.gridName;
                    for (0 === f.tileZoom ? (i = a[0].header, j = i.nx, k = i.ny, l = j + 1) : (j = k = f.tileSize, l = j * f.width + 1), g = 0; k > g; g++) {
                        for (r = 3 * ((k * e + g) * l + j * d), m = r, h = 0; j > h; h++) {
                            switch (t) {
                            case "gust":
                                b[r] = o[s] / 10;
                                break;
                            case "wind":
                                b[r] = o[s] / 10, b[r + 1] = p[s] / 10;
                                break;
                            case "waves":
                            case "swell":
                            case "wwaves":
                            case "swellperiod":
                            case "wwavesperiod":
                                n = .0174 * q[s], b[r] = -p[s] * Math.sin(n), b[r + 1] = -p[s] * Math.cos(n), b[r + 2] = o[s];
                                break;
                            default:
                                b[r] = o[s]
                            }
                            s++, r += 3
                        }
                        f.wrapped ? (b[r] = b[m], b[r + 1] = b[m + 1], b[r + 2] = b[m + 2]) : (b[r] = b[r - 3], b[r + 1] = b[r - 2], b[r + 2] = b[r - 1])
                    }
                    return i || {}
                }
            });
            return d
        }), /*! */
        W.define("imgLoader", ["object", "jsonLoader"], function (a, b) {
            var c = a.extend(b, {
                canvas: document.getElementById("jpg_decoder"),
                context: document.getElementById("jpg_decoder").getContext("2d"),
                tilePrefix: "j",
                tileParams: [{
                    size: 360,
                    width: 1,
                    tileSize: 360,
                    resolution: 1
                }, {
                    size: 60,
                    width: 6,
                    tileSize: 240,
                    resolution: .25
                }, {
                    size: 30,
                    width: 12,
                    tileSize: 240,
                    resolution: .125
                }, {
                    size: 15,
                    width: 24,
                    tileSize: 240,
                    resolution: .0625
                }, {
                    size: 7.5,
                    width: 48,
                    tileSize: 240,
                    resolution: .03125
                }, {
                    size: 3.75,
                    width: 96,
                    tileSize: 240,
                    resolution: .015625
                }, {}, {}, {
                    size: 90,
                    width: 4,
                    tileSize: 180,
                    resolution: .5
                }],
                _init: function () {},
                loadTile: function (a, b, c, d) {
                    var e, f = this,
                        g = !1,
                        h = b.tiles[d],
                        i = c.fullPath.replace(/<tiles>/, b.paths[d]);
                    return e = new Promise(function (d, e) {
                        var j, k, l, m;
                        j = new Image, j.crossOrigin = "Anonymous", j.onload = function () {
                            g || (f.canvas.width = j.width, f.canvas.height = j.height, f.context.drawImage(j, 0, 0, j.width, j.height), m = f.context.getImageData(0, 0, j.width, j.height), k = f.decodeHeader(m.data, j.width), l = f.injectData(m.data, a, c, h.x, h.y, b, k, j.width, j.height - 8), l.lastModified = parseInt(k[6]), d(l))
                        }, j.onerror = function () {
                            d({})
                        }, j.src = i, (j.complete || void 0 === j.complete) && (j.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==", j.src = i)
                    }), e.cancel = function () {
                        g = !0
                    }, e
                },
                decodeHeader: function (a, b) {
                    for (var c, d, e, f, g, h = new ArrayBuffer(28), i = new Uint8Array(h), j = new Float32Array(h), g = 4 * (4 * b) + 8, f = 0; 28 > f; f++) c = a[g], d = a[g + 1], e = a[g + 2], c = Math.round(c / 64), d = Math.round(d / 16), e = Math.round(e / 64), i[f] = (c << 6) + (d << 2) + e, g += 16;
                    return j
                },
                injectData: function (a, b, c, d, e, f, g, h, i) {
                    var j, e, k, l, m, n, o, p, q, r, s, t, u, v, w, x = 0,
                        y = 0,
                        z = 0;
                    c.gridName;
                    for (0 === f.tileZoom ? (n = h, o = i, k = n + 1) : (n = o = f.tileSize, k = n * f.width + 1), j = 0; 3 > j; j++)
                        if (l = g[2 * j], m = g[2 * j + 1], l || m) {
                            switch (j) {
                            case 0:
                                r = l, s = (m - l) / 255;
                                break;
                            case 1:
                                t = l, u = (m - l) / 255;
                                break;
                            case 2:
                                v = l, w = (m - l) / 255
                            }
                            x = j
                        }
                    for (c.dataLoading > -1 ? x = c.dataLoading : 1 >= x && /\.png/.test(c.fullPath) && (x += 10), z = 8 * (4 * h), j = 0; o > j; j++) {
                        switch (y = 3 * ((o * e + j) * k + n * d), p = y, x) {
                        case 4:
                            for (q = 0; n > q; q++) 0 === a[z + 3] ? b[y] = NaN : b[y] = a[z] * s + r, z += 4, y += 3;
                            break;
                        case 5:
                            for (q = 0; n > q; q++) 0 === a[z + 3] ? (b[y] = NaN, b[y + 1] = 0, b[y + 2] = 0) : (b[y] = a[z] * s + r, b[y + 1] = a[z + 1] * u + t, b[y + 2] = a[z + 2] * w + v), z += 4, y += 3;
                            break;
                        case 1:
                            for (q = 0; n > q; q++) b[y] = a[z] * s + r, b[y + 1] = a[z + 1] * u + t, z += 4, y += 3;
                            break;
                        case 0:
                            for (q = 0; n > q; q++) b[y] = a[z] * s + r, z += 4, y += 3;
                            break;
                        case 11:
                            for (q = 0; n > q; q++) 0 === a[z + 3] ? (b[y] = NaN, b[y + 1] = NaN) : (b[y] = a[z] * s + r, b[y + 1] = a[z + 1] * u + t), z += 4, y += 3;
                            break;
                        case 10:
                            for (q = 0; n > q; q++) 0 === a[z + 3] ? b[y] = NaN : b[y] = a[z] * s + r, z += 4, y += 3
                        }
                        f.wrapped ? (b[y] = b[p], b[y + 1] = b[p + 1], b[y + 2] = b[p + 2]) : (b[y] = b[y - 3], b[y + 1] = b[y - 2], b[y + 2] = b[y - 1])
                    }
                    return 0 === f.tileZoom ? {
                        nx: h,
                        ny: i,
                        dx: 1,
                        dy: 1,
                        la1: 90,
                        la2: 90 - i,
                        lo1: 0,
                        lo2: 359
                    } : {}
                }
            });
            return c
        }), /*! */
        W.define("products", ["productClasses", "rootScope", "loader", "interpolation", "interFunctions", "http", "broadcast", "object", "calendar", "particles", "log"], function (a, b, c, d, e, f, g, h, i, j, k) {
            var l = {},
                m = (new Date).toISOString().replace(/^\d+-(\d+)-(\d+)T.*$/, "$1$2");
            return l.getProductString = function (a, b) {
                var c, d, e = [];
                for (c in l)(d = l[c].overlays) && d.indexOf(a) > -1 && e.push(c);
                return 1 === e.length ? e[0] : e.indexOf(b) > -1 ? b : e[0]
            }, l.gfs = W.Product.extend({
                minifest: minifest,
                zoom2zoom: [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                animation: !0,
                calendar: i({
                    minifest: this.minifest
                }),
                model: "GFS 13km",
                provider: "NOAA",
                interval: "6h",
                directory: "gfs",
                fileSuffix: "jpg",
                particles: j.wind,
                disableOverlayZoom: 12,
                productReady: !0,
                levels: ["surface", "975h", "950h", "925h", "900h", "850h", "750h", "700h", "550h", "450h", "350h", "300h", "250h", "200h", "150h"],
                overlays: ["wind", "temp", "pressure", "clouds", "rh", "gust", "lclouds"]
            }), l.mbeurope = W.ProductLocal.extend({
                model: "NEMS 4km",
                provider: "Meteoblue.com",
                interval: "12h",
                particles: j.windDetailed,
                directory: "mbeurope",
                forecastSize: 3,
                pathGenerators: {
                    wind: "{server}mbeurope/{path}/<tiles>wind-{level}.png",
                    overlay: function (a) {
                        return "wind" === a.overlay ? null : "{server}mbeurope/{path}/<tiles>{overlay}-surface.png"
                    }
                },
                bounds: {
                    west: -19,
                    east: 33,
                    north: 57,
                    south: 33
                },
                levels: ["surface", "975h", "950h", "925h", "900h", "850h", "750h"],
                overlays: ["wind", "temp", "clouds", "rh", "gust", "lclouds"]
            }), l.namConus = W.ProductLocal.extend({
                model: "NAM 5km",
                provider: "NOAA",
                interval: "6h",
                particles: j.windDetailed,
                directory: "nam-conus",
                forecastSize: 3,
                animationSpeed: 2e3,
                bounds: {
                    west: -137,
                    east: -55,
                    north: 53,
                    south: 20
                },
                levels: ["surface", "975h", "950h", "925h", "900h", "850h", "750h", "700h", "550h", "450h", "350h", "300h", "250h", "200h", "150h"],
                overlays: ["wind", "temp", "clouds", "rh", "gust", "lclouds", "pressure"]
            }), l.namHawaii = l.namConus.extend({
                model: "NAM 3km",
                directory: "nam-hawaii",
                bounds: {
                    west: -167,
                    east: -147,
                    north: 30,
                    south: 14
                }
            }), l.namAlaska = l.namConus.extend({
                model: "NAM 6km",
                directory: "nam-alaska",
                bounds: {
                    west: -179,
                    east: -129,
                    north: 80,
                    south: 53
                }
            }), l.accumulations = l.gfs.extend({
                interval: "12h",
                animation: !1,
                pathGenerators: {
                    overlay: "{server}accumulations/<tiles>{overlay}-{acTime}.jpg"
                },
                betterFcst: null,
                productReady: !0,
                calendar: null,
                particles: {},
                refTime: function () {
                    return "?" + m
                },
                levels: ["surface"],
                overlays: ["snow", "rain"]
            }), l.snowcover = l.accumulations.extend({
                zoom2zoom: [0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
                model: "NSIDC 1x1km",
                provider: "NSIDC (nsidc.org)",
                interval: "24h",
                disableOverlayZoom: 15,
                overlays: ["snowcover"],
                levels: ["surface"],
                pathGenerators: {
                    overlay: "{server}snowcover/latest/<tiles>snowcover.png"
                },
                checkCoverage: function (a, b) {
                    return this.zoom2zoom[b.map.zoom] > 0 && b.map.south < -29 ? "out-of-bounds" : this.checkData(a[0], b)
                }
            }), l.waves = W.Product.extend({
                zoom2zoom: [0, 0, 0, 0, 0, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
                minifest: minifest,
                model: "Wavewatch 3",
                provider: "NOAA",
                interval: "6h",
                disableOverlayZoom: 12,
                animation: !0,
                overlays: ["waves", "swell", "wwaves", "swellperiod"],
                levels: ["surface"],
                productReady: !0,
                calendar: i({
                    numOfDays: 7
                }),
                pathGenerators: {
                    overlay: "{server}waves/{path}/<tiles>{filename}-surface.png"
                },
                betterFcst: null,
                particles: j.waves
            }), l.sea = l.accumulations.extend({
                zoom2zoom: [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                model: "NESDIS",
                provider: "NOAA",
                interval: "48h",
                disableOverlayZoom: 15,
                overlays: ["sst", "sstanom", "currents"],
                levels: ["surface"],
                animation: !1,
                particles: j.currents,
                pathGenerators: {
                    overlay: "{server}sst/latest/<tiles>{filename}.png"
                }
            }), l.sstavg = l.sea.extend({
                particles: {},
                interval: "1year",
                overlays: ["sstavg"],
                levels: ["surface"],
                pathGenerators: {
                    overlay: "{server}sst/{sstTime}/<tiles>{filename}.png"
                }
            }), l
        }), /*! */
        W.define("dataStore", [], function () {
            function a() {
                return d++, d >= b && (d = 0), e[d]
            }
            for (var b = 10, c = 1036800, d = -1, e = [], f = 0; b > f; f++) e[f] = new Float32Array(c);
            return {
                get: a
            }
        }), /*! */
        W.define("task", ["interpolation", "broadcast", "products", "rootScope", "object", "Class"], function (a, b, c, d, e, f) {
            function g(a) {
                "cancelled" !== a && console.warn("task cancelled was called")
            }
            return W.Task = f.extend({
                    params: null,
                    product: null,
                    mapDirty: !1,
                    _init: function () {
                        this.status = "init", this.data = null, this.loadingTasks = [], this.antiCycleCounter = 0
                    },
                    setStatus: function (a) {
                        this.status = a
                    },
                    load: function (a) {
                        var b = this;
                        return this.loadingTasks = this.product.load(this.params), this.setStatus("loading"), Promise.all(this.loadingTasks).then(function (c) {
                            b.setStatus("loaded"), b.loadingTasks = [], b.data = c, b.display(a)
                        }, g), this
                    },
                    cancel: function () {
                        "loading" === this.status ? this.loadingTasks.map(function (a) {
                            "function" == typeof a.cancel && a.cancel()
                        }) : "interpolation" === this.status && a.cancel()
                    },
                    display: function (a) {
                        var f = "ok",
                            g = this;
                        switch (this.mapDirty && (this.params.map = e.clone(d.map), this.params.mapDirty = !0, f = this.product.checkData(this.data[0], this.params)), f) {
                        case "ok":
                            this.setStatus("interpolation"), this.product.display(this.data, this.params, function () {
                                g.params.lastModified = g.data[0].lastModified, g.setStatus("finished"), g.antiCycleCounter = 0, b.emit("redrawFinished", g.params, g.mapDirty), g.mapDirty = !1, g.params.mapDirty = !1, "function" == typeof a && a()
                            });
                            break;
                        case "no-data":
                            this.antiCycleCounter++ > 10 ? console.error("displayAnimation was cycled") : this.load();
                            break;
                        case "out-of-timeline":
                        case "not-supported-data":
                            this.params.model = this.params.product = "gfs", this.product = c.gfs, b.emit("modelChanged", "gfs"), this.load()
                        }
                    }
                }),
                function (a) {
                    return W.Task.extend(a)
                }
        }), /*! */
        W.define("geolocation", ["rootScope", "http", "broadcast", "storage"], function (a, b, c, d) {
            function e() {
                return navigator.geolocation ? new Promise(function (b, c) {
                    navigator.geolocation.getCurrentPosition(function (a) {
                        b({
                            lat: a.coords.latitude,
                            lon: a.coords.longitude
                        })
                    }, function (c) {
                        b(a.geoIP)
                    })
                }) : getIPlocation()
            }

            function f(c, e, f) {
                var g, h = parseFloat(c.lat).toFixed(2) + ", " + parseFloat(c.lon).toFixed(2);
                if (e.fromStartup && (g = d.get("initReverseName")) && c.lat == g.lat && g.lon == g.lon) return f(g), Promise.resolve();
                var i = b.get(a.server2 + "node/reverse/" + c.lat + "/" + c.lon + "?version=2.0&lang=" + a.prefLang);
                return i.then(function (a) {
                    var b;
                    (b = a.data && a.data.address) ? ("village" === e.detailLevel ? c.name = b.hamlet || b.suburb || b.quarter || b.village || b.town || b.city : c.name = b.town || b.village || b.city || b.hamlet || b.suburb || b.quarter, c.region = b.county || b.district || b.state || "", c.country = b.country || "", !c.name && e.mustBeDefined && (c.name = c.region + " " + h), e.fromStartup && d.put("initReverseName", c), f(c)) : f({
                        name: h
                    })
                }, f.bind(null, {
                    name: h
                })), i
            }
            c.on("locationRqstd", function () {
                e().then(function (a) {
                    a.zoom = 9, c.emit("mapsCenter", a), c.emit("mapsPopupRequested", a)
                })
            });
            var g, h = document.querySelector('meta[name="geoip"]');
            if (sameCountry = function () {
                    return !1
                }, h && h.content) {
                var i = h.content.split(",");
                a.hash = parseInt(i[0].replace(/\./g, "")).toString(20), i[1] && i[2] && (a.geoIP = {
                    lat: parseFloat(i[1]),
                    lon: parseFloat(i[2]),
                    country: i[3],
                    zoom: 1
                }, a.geoIP.name = i[4] || a.geoIP.lat.toFixed(3) + ", " + a.geoIP.lon.toFixed(3), g = i[3].toLowerCase(), sameCountry = function (a) {
                    return g === a
                })
            }
            return {
                sameCountry: sameCountry,
                getGPSlocation: e,
                getReverseName: f
            }
        }), W.define("productClasses", ["rootScope", "loader", "interpolation", "http", "overlays", "broadcast", "object", "calendar", "log"], function (a, b, c, d, e, f, g, h, i) {
            W.Product = W.Class.extend({
                animationSpeed: 4200,
                refTime: function (a) {
                    var b = a.path.replace(/^\d+\/\d+\/(\d+)\/(\d+)$/, "$1$2");
                    return "?" + this.minifest[b]
                },
                load: function (c) {
                    var d, f, h = e[c.overlay],
                        i = [];
                    c.server = this.server || a.server, c.tileZoom = this.getTileZoom(c), c.dataLoading = h.dataLoading, c.filename = h.filename || c.overlay;
                    for (var j in this.pathGenerators) f = this.pathGenerators[j], d = "function" == typeof f ? f.call(this, c) : f, d && (c.fullPath = d.template(c) + this.refTime(c), c.gridName = "overlay" === j ? c.overlay : j, i.push(b.load(g.clone(c))));
                    return i
                },
                display: function (a, b, d) {
                    var f = e[b.overlay];
                    c.interpolate({
                        map: b.map,
                        grid: a[0],
                        overlay: a[1],
                        mapDirty: b.mapDirty,
                        colors: f,
                        disableOverlay: b.map.zoom >= this.disableOverlayZoom,
                        interpolate: f.interpolate,
                        particles: this.particles[b.map.source],
                        blurAmount: f.blur[b.map.zoom],
                        product: b.product
                    }, function () {
                        f.sea ? document.body.classList.add("sea") : document.body.classList.remove("sea"), d()
                    })
                },
                getTileZoom: function (a) {
                    return a.historical ? 0 : this.zoom2zoom[a.map.zoom]
                },
                checkData: function (a, c) {
                    return a ? -1 === this.levels.indexOf(c.level) || -1 === this.overlays.indexOf(c.overlay) ? "not-supported-data" : a.tileZoom === this.getTileZoom(c) && b.checkTiles(a.tiles, c.map, a.tileZoom) ? "ok" : "no-data" : "no-data"
                },
                pathGenerators: {
                    wind: function (a) {
                        return "{server}" + this.directory + "/{path}/<tiles>wind-{level}." + this.fileSuffix
                    },
                    overlay: function (a) {
                        switch (a.overlay) {
                        case "wind":
                            return null;
                        case "temp":
                        case "rh":
                            return "{server}" + this.directory + "/{path}/<tiles>{overlay}-{level}." + this.fileSuffix;
                        case "pressure":
                            return "{server}" + this.directory + "/{path}/<tiles>{overlay}-surface.png";
                        default:
                            return "{server}" + this.directory + "/{path}/<tiles>{overlay}-surface." + this.fileSuffix
                        }
                    }
                }
            }), W.ProductLocal = W.Product.extend({
                zoom2zoom: [0, 0, 0, 0, 0, 0, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
                animation: !0,
                disableOverlayZoom: 12,
                fileSuffix: "png",
                _init: function () {
                    this.minifest = null, this.calendar = null, this.productReady = !1
                },
                init: function (b) {
                    var c = this;
                    d.get(a.server + this.directory + "/minifest.json?timestamp=" + Date.now()).then(function (a) {
                        c.minifest = a.data, c.calendar = h({
                            numOfDays: c.forecastSize,
                            minifest: c.minifest
                        })
                    })["catch"](function () {
                        c.minifest = minifest, c.calendar = h({
                            numOfDays: c.forecastSize
                        }), i.event("Error: failed to load minifest")
                    }).then(function () {
                        c.productReady = !0, b()
                    })
                },
                isInBounds: function (a) {
                    return a.west > this.bounds.west && a.east < this.bounds.east && a.north < this.bounds.north && a.south > this.bounds.south
                },
                pointIsInBounds: function (a) {
                    return a.lon > this.bounds.west && a.lon < this.bounds.east && a.lat < this.bounds.north && a.lat > this.bounds.south
                }
            })
        }), /*! */
        W.define("legend", ["overlays", "broadcast"], function (a, b) {
            function c(a, b, c) {
                var d = a.indexOf(b) + (c ? 1 : -1);
                return d === a.length ? d = 0 : 0 > d && (d = a.length - 1), a[d]
            }

            function d(a) {
                if (!a.description) return void(i.innerHTML = "");
                var b, c, d, e, f = "",
                    g = a.lines,
                    j = a.description,
                    k = a.preparedColors,
                    l = a.startingValue,
                    m = a.step,
                    n = a.metric;
                for (h = j.indexOf(n), 0 > h && (h = 0), b = 0; b < g.length; b++) c = g[b], d = k[Math.floor((c[0] - l) / m)], e = "rgba(" + d[0] + "," + d[1] + "," + d[2] + "," + d[3] / 200 + ")", f || (f = '<div style="background-color:' + e + ';">' + j[h] + "</div>"), f += '<div style="background-color:' + e + ';">' + g[b][1 + h] + "</div>";
                i.innerHTML = f
            }

            function e(b) {
                i.classList.add("animate"), setTimeout(function () {
                    g = b, f = a[b], d(f), i.classList.remove("animate")
                }, 400)
            }
            var f, g, h, i = document.getElementById("legend");
            i.onclick = function (a) {
                var b, d;
                (b = f.description) && (d = c(b, b[h], !0), f.setMetric(d))
            }, b.on("metricChanged", function (a) {
                a === f.ident && e(a)
            }), b.on("redrawFinished", function (a) {
                a.overlay !== g && e(a.overlay)
            })
        }), /*! */
        W.define("windytyUI", ["calendar", "rootScope", "broadcast", "products", "Class"], function (a, b, c, d, e) {
            var f = {
                ident: "UIparams",
                overlay: b.params.overlay,
                level: b.params.level,
                acTime: b.params.acTime,
                model: b.params.model,
                start: d.gfs.calendar.start,
                path: d.gfs.calendar.ts2path(Date.now()),
                timestamp: b.params.timestamp || Date.now(),
                product: "gfs",
                productObj: d.gfs,
                historical: !1,
                sstTime: "2015/01",
                calendar: d.gfs.calendar,
                histCalendar: null,
                emitTimer: null,
                timestampTimer: null,
                setTimestamp: function (a) {
                    this.timestamp = a, this.set("path", this.calendar.ts2path(a))
                },
                setOverlay: function (a) {
                    this.set("overlay", a)
                },
                setLevel: function (a) {
                    this.set("level", a)
                },
                createHistCalendar: function (b) {
                    var c = a({
                        numOfDays: 10,
                        calendarDays: 10,
                        startOfTimeline: new Date(b - 432e6).midnight()
                    });
                    (this.timestamp > c.end || this.timestamp < c.start) && (this.timestamp = (c.end - c.start) / 2 + c.start), this.histCalendar = c, this.historical = !0, this.model = "gfs", this.switchProduct("gfs", function () {}), document.body.classList.add("historical")
                },
                set: function (a, b) {
                    if (this[a] !== b) {
                        if (this[a] = b, "overlay" !== a && "model" !== a) return void this.emitOut(a);
                        var c = d.getProductString(this.overlay, this.model);
                        c !== this.product ? this.switchProduct(c, this.emitOut.bind(this, "overlay")) : this.emitOut("overlay")
                    }
                },
                switchProduct: function (a, b) {
                    var c = this;
                    document.body.classList.remove("product-" + this.product), document.body.classList.add("product-" + a), this.product = a, this.productObj = d[a], this._initProduct(a, function () {
                        var a = c.histCalendar || c.productObj.calendar;
                        a && (c.calendar = a, c.path = a.ts2path(c.timestamp)), b()
                    })
                },
                hasCalendar: function () {
                    return !!this.productObj.calendar
                },
                emitOut: function (a) {
                    var b = this;
                    this.emitTimer && clearTimeout(this.emitTimer), this.emitTimer = setTimeout(function () {
                        c.emit("paramsChanged", b, a)
                    }, 100)
                },
                _initProduct: function (a, b) {
                    var c = d[a];
                    c.productReady ? b() : c.init(b)
                }
            };
            return c.once("mapChanged", function () {
                c.emit("paramsChanged", f)
            }), f
        }), /*! */
        W.define("windytyCtrl", ["task", "windytyUI", "broadcast", "rootScope", "object", "products", "progressBar", "log", "calendarUI"], function (a, b, c, d, e, f, g, h, i) {
            function j(a) {
                l ? (l.mapDirty = !0, "interpolation" === l.status && (l.cancel(), l.display())) : m ? (m.cancel(), m.mapDirty = !0, m.display()) : k(b)
            }

            function k(b) {
                var c = !1;
                l && "finished" !== l.status && (c = l.mapDirty, l.cancel()), m && "finished" !== m.status && (c = !0, m.cancel()), l = a({
                    mapDirty: c,
                    params: e.clone(b, ["path", "timestamp", "acTime", "level", "overlay", "product", "model", "historical", "sstTime"]),
                    product: f[b.product]
                }), l.params.map = e.clone(d.map), n.isRunning && (l.params.fromAnimation = !0), l.load(function () {
                    m = l, l = null, n.isRunning && (n.semaphore = !1)
                })
            }
            var l = null,
                m = null,
                n = {
                    isRunning: !1,
                    semaphore: !1,
                    timer: null,
                    tick: 50,
                    button: document.getElementById("playpause"),
                    buttonMobile: document.getElementById("playpause-mobile"),
                    pbWrapper: document.getElementById("progress-bar-wrapper"),
                    start: function () {
                        return m && m.product ? (this.isRunning = !0, 
												 this.button.className = "pause", this.buttonMobile.className = "pause", this.pbWrapper.className = "onanimation", 
												 this.run(), 
												 void c.emit("animationStarted")) : void h.event("tried to run animation on void finisheTask")
                    },
                    stop: function () {
                        this.semaphore = !1, 
						this.isRunning = !1, 
						this.button.className = "play", 
						this.buttonMobile.className = "play", 
						this.pbWrapper.className = "", 
						clearTimeout(this.timer), 
						c.emit("animationStopped")
                    },
                    toggle: function () {
                        this.isRunning ? this.stop() : this.start()
                    },
                    run: function () {
                        var a = m.product,
                            c = +b.timestamp + this.tick * a.animationSpeed;
                        a.animation && c < a.calendar.end ? (i.setMobileUI(c), g.set(c), this.timer = setTimeout(this.run.bind(this), this.tick)) : this.stop()
                    }
                };
            Promise.all([new Promise(function (a, b) {
                c.once("paramsChanged", a)
            }), new Promise(function (a, b) {
                c.once("mapChanged", a)
            })]).then(function () {
                c.emit("windytyInitalized"), c.on("paramsChanged", k), c.on("mapChanged", j), c.on("playPauseClicked", n.toggle.bind(n)), k(b)
            })
        }),
        /*!
            (c)  Stanislav Sumbera, April , 2014, Licenced under MIT */
        L.CanvasOverlay = L.Class.extend({
            canvas: function () {
                return [this._canvas1, this._canvas2, this._canvas3]
            },
            redraw: function () {
                return this._frame || (this._frame = L.Util.requestAnimFrame(this._redraw, this)), this
            },
            reset: function () {
                this._reset()
            },
            onAdd: function (a) {
                this._map = a,
				this._canvas1 = L.DomUtil.create("canvas", "leaflet-canvas1"), 
				this._canvas2 = L.DomUtil.create("canvas", "leaflet-canvas2"), 
				this._canvas3 = L.DomUtil.create("canvas", "leaflet-canvas3");
				
                var b = this._map.getSize();
				
                this._canvas1.width = this._canvas2.width = this._canvas3.width = b.x, 
				this._canvas1.height = this._canvas2.height = this._canvas3.height = b.y;
				
                var c = this._map.options.zoomAnimation && L.Browser.any3d;
				
                L.DomUtil.addClass(this._canvas1, "leaflet-zoom-" + (c ? "animated" : "hide")), 
				L.DomUtil.addClass(this._canvas2, "leaflet-zoom-" + (c ? "animated" : "hide")), 
				L.DomUtil.addClass(this._canvas3, "leaflet-zoom-" + (c ? "animated" : "hide")), a._panes.overlayPane.appendChild(this._canvas1), a._panes.overlayPane.appendChild(this._canvas2), a._panes.overlayPane.appendChild(this._canvas3), 
				a.on("moveend", this._redraw, this), 
				a.on("resize", this._resize, this), 
				a.options.zoomAnimation && L.Browser.any3d && a.on("zoomanim", this._animateZoom, this), 
				this._reset(), this._redraw()
            },
            addTo: function (a) {
                return a.addLayer(this), this
            },
            _resize: function (a) {
                this._canvas1.width = this._canvas2.width = this._canvas3.width = a.newSize.x, this._canvas1.height = this._canvas2.height = this._canvas3.height = a.newSize.y
            },
            _reset: function () {
                var a = this._map.containerPointToLayerPoint([0, 0]);
                L.DomUtil.setPosition(this._canvas1, a), L.DomUtil.setPosition(this._canvas2, a), L.DomUtil.setPosition(this._canvas3, a)
            },
            _redraw: function () {
                var a = this._map.getSize(),
                    b = this._map.getBounds();
                180 * a.x / (20037508.34 * (b.getEast() - b.getWest())), this._map.getZoom();
                this._frame = null
            },
            _animateZoom: function (a) {
                var b = this._map.getZoomScale(a.zoom),
                    c = this._map._getCenterOffset(a.center)._multiplyBy(-b).subtract(this._map._getMapPanePos());
                this._canvas1.style[L.DomUtil.TRANSFORM] = L.DomUtil.getTranslateString(c) + " scale(" + b + ")", this._canvas2.style[L.DomUtil.TRANSFORM] = L.DomUtil.getTranslateString(c) + " scale(" + b + ")", this._canvas3.style[L.DomUtil.TRANSFORM] = L.DomUtil.getTranslateString(c) + " scale(" + b + ")"
            }
        }), L.canvasOverlay = function () {
            return new L.CanvasOverlay
        }, /*! */
        W.define("mapsCtrl", ["rootScope", "storage", "settings", "storage", "broadcast", "http", "globe", "maps", "object", "log", "location", "geolocation"], function (a, b, c, b, d, e, f, g, h, i, j, k) {
            function l(a) {
                s = c.get("3d"), q = g, m(q, a)
            }

            function m(a, b) {
                b.lat = parseFloat(b.lat).bound(-80, 80), b.lon = parseFloat(b.lon), a.init(b).then(function (b) {
                    q = a, a === g ? (r.style.opacity = 0, r.style["pointer-events"] = "none", setTimeout(function () {
                        r.style.display = "none"
                    }, 1e3)) : (r.style.display = "block", r.style["pointer-events"] = "auto", r.style.opacity = 1), d.emit("projectionChanged", q.ident), o(b)
                })["catch"](function () {
                    a === f && (i.event("Failed to install globe"), s = !1, m(g, b))
                })
            }

            function n(a) {
                o(a)
            }

            function o(b) {
                a.map.zoom !== b.zoom && (document.body.classList.remove("zoom" + a.map.zoom), document.body.classList.add("zoom" + b.zoom)), a.map = h.clone(b, ["source", "lat", "lon", "south", "north", "east", "west", "width", "height", "x", "y", "xMax", "yMax", "zoom", "scale"]), h.include(a.map, {
                    southRad: Math.deg2rad(b.south),
                    northRad: Math.deg2rad(b.north),
                    eastRad: Math.deg2rad(b.east),
                    westRad: Math.deg2rad(b.west)
                }), d.emit("mapChanged", a.map)
            }

            function p(a) {
                q !== g ? m(g, a) : g.center(a, !0)
            }
            var q = null,
                r = document.getElementById("globe_container");
            a.useRetina = a.isRetina && c.get("retina");
            var s;
            a.map = {};
            var t;
            if ((t = b.get("homeLocation")) && c.get("weather")) l(t);
            else if (a.sharedCoords) l(a.sharedCoords);
            else if (a.geoIP) l(a.geoIP);
            else {
                var u = (new Date).getTimezoneOffset() / 4;
                l({
                    lat: 0,
                    lon: 0 > u ? -u : -180 + u,
                    zoom: 6
                }), i.event("GeoIP missing !!!")
            }
            var v = d.emit.bind(d, "movestart");
            return f.on("movestart", v), g.on("click dragstart", v), f.on("globeMoveend", n), g.on("mapsMoveend", n), d.on("settingsChanged", function (b) {
                "3d" === b && l(a.map)
            }), d.on("popupRequested", function (a, b) {
                d.emit((q === f ? "globe" : "maps") + "PopupRequested", a, b)
            }), d.on("mapsCenter", p), {
                getCanvas: function () {
                    return q.canvases
                },
                center: p,
                ensureLeaflet: function () {
                    if (s = !1, q === f) {
                        var a = f.info();
                        a.zoom = 5, m(g, a)
                    }
                },
                stopEnsureLeaflet: function () {
                    l(q.info())
                }
            }
        }), /*! */
        W.define("maps", ["rootScope", "settings", "object", "broadcast"], function (a, b, c, d) {
            L.Map.addInitHook(function () {
                function a(a) {
                    function e() {
                        d.fire("singleclick", L.Util.extend(a, {
                            type: "singleclick"
                        }))
                    }
                    b(), c = setTimeout(e, 500)
                }

                function b() {
                    c && (clearTimeout(c), c = null)
                }
                var c, d = this;
                d.on && (d.on("click", a), d.on("dblclick", function () {
                    setTimeout(b, 0)
                }))
            });
            var e = L.map("map_container", {
                zoomControl: !1,
                keyboard: !1,
                worldCopyJump: !1,
            });
            return c.include(e, {
                ident: "maps",
                isInit: !1,
                minZoom: 4,
                graticule: [],
                myMarkers: {
                    webcam: L.icon({
                        iconUrl: "img/marker-webcam.png",
                        shadowUrl: "img/marker-shadow.png",
                        shadowSize: [41, 41],
                        shadowAnchor: [15, 41],
                        iconSize: [26, 36],
                        iconAnchor: [13, 36]
                    }),
                    icon: L.divIcon({
                        className: "icon-dot",
                        html: '<div class="pulsating-icon"></div>',
                        iconSize: [10, 10],
                        iconAnchor: [5, 5]
                    })
                },
                init: function (c) {
                    return this.isInit ? this.center(c) : (this.center(c, !1), this.initTiles(), this.initCanvas(), this.drawGraticule(), this.on("moveend", this.moveEnd.bind(this)), this.on("resize", this.resizeEnd.bind(this)), this.on("contextmenu", function () {
                        e.zoomOut()
                    }), d.on("settingsChanged", function (c) {
                        switch (c) {
                        case "map":
                            e.initTiles();
                            break;
                        case "retina":
                            a.useRetina = a.isRetina && b.get("retina"), e.initTiles(), e.rescaleCanvas();
                            break;
                        case "graticule":
                            e.drawGraticule()
                        }
                    }), this.isInit = !0), Promise.resolve(this.info())
                },
                drawGraticule: function () {
                    if (b.get("graticule")) {
                        for (var a = {
                                stroke: !0,
                                color: "#a0a0a0",
                                opacity: .8,
                                weight: .8,
                                clickable: !1
                            }, c = -80; 81 > c; c += 10) e.graticule.push(L.polyline([
                            [c, -180],
                            [c, 180]
                        ], a).addTo(e));
                        for (var d = -180; 181 > d; d += 10) e.graticule.push(L.polyline([
                            [-90, d],
                            [90, d]
                        ], a).addTo(e))
                    } else
                        for (var f = 0; f < e.graticule.length; f++) e.removeLayer(e.graticule[f])
                },
                initCanvas: function () {
                    var a = L.canvasOverlay().addTo(e),
                        b = a.canvas();
                    this.canvases = {
                        particleCanvas: b[0],
                        overlayCanvas: [b[1], b[2]],
                        actualCanvas: 0
                    }, this.resetCanvas = a.reset.bind(a), b[2].style.opacity = 0, this.rescaleCanvas()
                },
                initTiles: function () {
                    var c = {
                            hereterrain: "https://{s}.aerial.maps.cit.api.here.com/maptile/2.1/maptile/newest/terrain.day/{z}/{x}/{y}/256/png8?" + a.hereMapsID,
                            heresat: "https://{s}.aerial.maps.cit.api.here.com/maptile/2.1/maptile/newest/satellite.day/{z}/{x}/{y}/256/png8?" + a.hereMapsID,
                            esritopo: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
                        },
                        d = c[b.get("map")];
                    L.TileLayer.multi({
                        11: {
                            url: a.tileServer + "v6/{z}/{x}/{y}.jpg",
                            subdomains: "1234"
                        },
                        17: {
                            url: d,
                            subdomains: "1234"
                        }
                    }, {
                        detectRetina: !1,
                        minZoom: 3,
                        maxZoom: a.maxZoom
                    }).addTo(e)
                },
                center: function (a, b) {
                    var c = a.zoom ? a.zoom.bound(e.minZoom, 20) : e.getZoom();
                    if (a.paddingLeft) {
                        var d = e.project([a.lat, a.lon], c).subtract([a.paddingLeft / 2, 0]),
                            f = e.unproject(d, c);
                        e.setView(f, c, {
                            animate: b
                        })
                    } else e.setView([a.lat, a.lon], c, {
                        animate: b
                    })
                },
                moveEnd: function () {
                    this.fire("mapsMoveend", this.info())
                },
                resizeEnd: function () {
                    e.rescaleCanvas(), this.fire("mapsMoveend", this.info())
                },
                rescaleCanvas: function () {
                    var b = e.canvases.particleCanvas,
                        c = a.useRetina ? window.devicePixelRatio || 1 : 1,
                        d = e.getSize(),
                        f = d.x,
                        g = d.y;
                    b.width = f * c, b.height = g * c, b.style.width = f + "px", b.style.height = g + "px", b.getContext("2d").scale(c, c)
                },
                info: function () {
                    var a = e.getCenter(),
                        b = e.getBounds(),
                        c = e.getSize();
                    return {
                        source: "maps",
                        lat: a.lat,
                        lon: a.wrap().lng,
                        south: b._southWest.lat,
                        north: b._northEast.lat,
                        east: b._northEast.lng,
                        west: b._southWest.lng,
                        width: c.x,
                        height: c.y,
                        x: 0,
                        y: 0,
                        xMax: c.x,
                        yMax: c.y,
                        zoom: e.getZoom()
                    }
                }
            }), e
        }), W.emptyFun = function () {}, /*! Copyright (c) Windyty SE, 2016 all rights reserved */
        W.define("globe", [], function () {
            return {
                on: W.emptyFun,
                isVisible: function () {
                    return W.emptyFun
                }
            }
        }), W.define("progressBar", [], W.emptyFun), W.define("calendarUI", [], W.emptyFun), W.define("location", ["rootScope"], function (a) {
            if (a.disableGeoIp = !0, a.drawGraticule = !1, "undefined" != typeof windytyInit) {
                var b = windytyInit;
                isNaN(b.lat) || isNaN(b.lon) || (a.sharedCoords = {
                    lat: b.lat,
                    lon: b.lon,
                    zoom: b.zoom
                })
            }
        }), W.define("trans", [], function () {
            return {}
        }), W.define("log", [], function () {
            return {
                page: W.emptyFun,
                event: W.emptyFun
            }
        });