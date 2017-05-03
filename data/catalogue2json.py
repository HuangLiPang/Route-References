import io
import os
import json
from math import radians, cos, sin, asin, sqrt

def haversine(lon1, lat1, lon2, lat2):
    """
    Calculate the great circle distance between two points 
    on the earth (specified in decimal degrees)
    """
    # convert decimal degrees to radians 
    lon1, lat1, lon2, lat2 = map(radians, [lon1, lat1, lon2, lat2])

    # haversine formula 
    dlon = lon2 - lon1 
    dlat = lat2 - lat1 
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2 * asin(sqrt(a)) 
    r = 6371 # Radius of earth in kilometers. Use 3956 for miles
    return c * r
def distanceSum(file):
    with open(file[5:]) as geojsonFile:
        geojson = json.load(geojsonFile)
    coordinates = []
    distance = 0
    for feature in geojson['features']:
        if feature["geometry"]["type"] == "LineString":
            coordinates.append(feature['geometry']['coordinates'])
            distance += haversine(feature['geometry']['coordinates'][0][0],
                                  feature['geometry']['coordinates'][0][1],
                                  feature['geometry']['coordinates'][1][0],
                                  feature['geometry']['coordinates'][0][1])
    distance /= 1.852
    return distance

geojson = '.geojson'
fileName = ''
routeName = ''
shipName = ''
outFile = io.open('Route_Catalogue.json', 'w', encoding = 'utf-8')

json_head = '''
{
  "route references": ['''
json_tail = '''
    ]
  }'''
routes_head = '''
    {
     "route": "%s",
     "lines": ['''
     
routes_tail = '''
        ]
      },'''
     
ship_head = '''
        {
         "ship": "%s",
         "from-destination": ['''    
                              
ship_tail = '''        
            ]
          },'''
            
harbor_head = '''
              {
               "start": "%s",
               "end": "%s",
               "harbor": "%s",
               "path": "%s",
               "distanceInNM": %s
              },'''
output = json_head

for root, dirs, files in os.walk("Catalogue"):
    for file in files:
        inFile = open(os.path.join(root, file), 'r')
        routeName = file.replace('.txt', '')
        output += routes_head % (routeName)
        for line in inFile.readlines():
            if line[0:17] == "'<optgroup label=":
                if inFile.name == fileName:
                    if line[18:22] != shipName:
                        output = output[:-1] + ship_tail
                else:
                    fileName = inFile.name
                shipName = line[18:22]
                output += ship_head % (line[18:22])
            if (line[1:15] == "<option value=") & (line[16] == '/'):
                harbors = line[line.find('-') + 1 : line.find(geojson)]
                start = harbors[0:3]
                end = harbors[4:]
                paths = 'data/GeoJSON/' + routeName + line[16 : line.find(geojson) + 8]
                output += harbor_head % (start, end, harbors, paths, round(distanceSum(paths), 3))
        output = output[:-1] + ship_tail
        output = output[:-1] + routes_tail
output = output[:-1] + json_tail
print(output)
outFile.write(output)