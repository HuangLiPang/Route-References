//ECA geojson layergroup
var ECAlayerGroup = L.layerGroup();

//ECA geojson layer
var ECAsNOxLayer = L.mapbox.featureLayer()
                    .loadURL("ECA/eca.geojson").on('ready', function(){
									this.setStyle({
										"color": "white",
										"weight": "2"
								    })
								}).addTo(ECAlayerGroup);
            
ECAsNOxLayer.on('mouseover', function(){this.setStyle({
                                                "color": "#ff0000",
                                                "weight": "5"
                                            })
						                 });
ECAsNOxLayer.on('mouseout', function(){this.setStyle({
                                                "color": "white",
                                                "weight": "2"
                                            })
                                        });