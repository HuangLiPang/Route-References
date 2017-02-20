import io
import os

geojson = '.geojson'

outfile = io.open('Route_Catalogue.json', 'w', encoding = 'utf-8')

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
             "harbor": "%s",
             "path": "%s"
             },'''
output = json_head
filename = ''
routename = ''
shipname = ''
for root, dirs, files in os.walk("Catalogue"):
    for f in files:
        infile = open(os.path.join(root, f), 'r')
        routename = f.replace('.txt', '')
        output += routes_head % (routename)
        for line in infile.readlines():
            if line[0:17] == "'<optgroup label=":
                if infile.name == filename:
                  if line[18:22] != shipname:
                    output = output[:-1] + ship_tail
                else:
                    filename = infile.name
                shipname = line[18:22]
                output += ship_head % (line[18:22])
            if (line[1:15] == "<option value=")&(line[16] == '/'):
                a = line[line.find('-') + 1:line.find(geojson)]
                b = 'GeoJSON/' + routename + line[16:line.find(geojson) + 8]
                output += harbor_head % (a, b)
        output = output[:-1] + ship_tail
        output = output[:-1] + routes_tail
output = output[:-1] + json_tail
print(output)
outfile.write(output)
