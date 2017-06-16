#!/usr/bin/python
# -*- coding: utf-8 -*-
"""
create Catalogue & initial_line.txt from GeoJSON
Created on Tue Mar 29 22:00:28 2016
@author: eddie@robodock.net
"""

import os
import glob
import errno

sp = os.path.sep

# geojsonDir = 'P:\\Voyage Waypoint\\03_GeoJSON'
# catDir = 'P:\\Voyage Waypoint\\04_Catalogue'
# webDir = 'P:\\Voyage Waypoint\\06_Web'
geojsonDir = 'GeoJSON'
catDir = 'Catalogue'
webDir = '.'

if not os.path.exists(catDir):
    try:
        os.makedirs(catDir)
    except OSError as exc:
        if exc.errno != errno.EEXIST:
            raise

if not os.path.exists(webDir):
    try:
        os.makedirs(webDir)
    except OSError as exc:
        if exc.errno != errno.EEXIST:
            raise

cat_header = '\'<option value="#">Route</option>\'+'
optgroup_head = '\'<optgroup label="'
optgroup_tail = '">\'+'
optvalue_head = '\'<option value="/'
optvalue_tail = '</option>\'+'

initial_header = '<option value="#">Pick A Route</option>'
initial_head = '<option value="'
initial_tail = '</option>'
initial_count = 1

outputInitial = initial_header + '\n'
initialfilepath = webDir + sp + 'initial_line.txt'

# firstLevel = glob.glob(geojsonDir+'/*')
firstLevel = sorted(glob.glob(geojsonDir + sp + '*'))

for eachdir in firstLevel:
    catfilepath = catDir + eachdir.split(geojsonDir)[1] + '.txt'
    # print catfilepath
    outputCat = cat_header + '\n'
    secondLevel = sorted(glob.glob(eachdir + sp + '*'))
    for eachsecdir in secondLevel:
        outputCat += optgroup_head + eachsecdir.split(sp)[-1] \
            + optgroup_tail + '\n'
        for root, dirs, files in os.walk(eachsecdir):
            for f in sorted(files):
                outputCat += optvalue_head + eachsecdir.split(sp)[-1] \
                    + '/' + f + '">' + f.split('.')[0] + optvalue_tail + '\n'
    with open(catfilepath, "w") as fo:
        print catfilepath
        fo.write(outputCat[:-3])
    outputInitial += initial_head + str(initial_count) + '">' \
        + eachdir.rsplit(sp, 1)[-1] + initial_tail + '\n'
    initial_count += 1

with open(initialfilepath, "w") as fo:
    print initialfilepath
    fo.write(outputInitial)
