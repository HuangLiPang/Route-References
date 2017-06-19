#!/usr/bin/python
# -*- coding: utf-8 -*-
"""
csv2geojson.py
Modified on Fri Jun 16 16:09 2017
Created on Thu Feb 23 11:22 2016
@author: eddie@robodock.net
"""

import os
import csv
import math
import LatLon
import errno
import random

# import sys
# ipath = sys.argv[1]
# opath = ipath.rsplit('.')[0]+'.geojson'

csvDir = 'CSV'
geojsonDir = 'GeoJSON'


# 轉換特定經緯度輸出格式
def latlonConv(latStr, lonStr):

    latlon = LatLon.LatLon(latStr, lonStr)
    latDeg = latlon.to_string('%d%')[0]
    latMin = latlon.to_string('%m%')[0]
    # latSec = latlon.to_string('%S%')[0][:4]
    latSec = latlon.to_string('%S%')[0]
    latHemi = latlon.to_string('%H%')[0]
    lonDeg = latlon.to_string('%d%')[1]
    lonMin = latlon.to_string('%m%')[1]
    # lonSec = latlon.to_string('%S%')[1][:4]
    lonSec = latlon.to_string('%S%')[1]
    lonHemi = latlon.to_string('%H%')[1]
    # latFmt = latDeg+'°'+latMin+','+latSec+' '+latHemi
    latFmt = latDeg + '°' + latMin + '.' + \
        str(round(float(latSec)/60.0, 3)).split('.')[1]+"' "+latHemi
    # lonFmt = lonDeg+'°'+lonMin+','+lonSec+' '+lonHemi
    lonFmt = lonDeg + '°' + lonMin + '.' + \
        str(round(float(lonSec)/60.0, 3)).split('.')[1]+"' "+lonHemi

    return latFmt, lonFmt


def limitlonlat(lonfloat, latfloat):
    # 座標範圍限制在經度 -30 ~ 330 間
    if lonfloat < -30:
        lonfloat += 360
    return lonfloat, latfloat


def getRandomColor():
    r = (lambda: random.randint(0, 255))
    return ('#%02X%02X%02X' % (r(), r(), r()))

for root, dirs, files in os.walk(csvDir):
    for eachfile in files:
        color = getRandomColor()
        if eachfile.endswith(".csv"):
            inputfilepath = os.path.join(root, eachfile)
            print inputfilepath
            outputfilepath = geojsonDir + \
                inputfilepath.split(csvDir)[1].rsplit('.csv')[0]+'.geojson'
            fi = open(inputfilepath, 'rb')
            rawData = csv.reader(fi, dialect='excel')

            output = '''{ "type" : "FeatureCollection",
    "features" : [
'''

            template_point = '''
    { "type": "Feature",
      "properties": {
         "title": "WPT#%s",
         "description": "%s, %s",
         "marker-symbol": "%s",
         "marker-color": "%s"
      },
      "geometry": {
          "type": "Point",
          "coordinates": [%s,%s]
      }
    },
    '''

            template_firstpoint = '''
    { "type": "Feature",
      "properties": {
         "title": "WPT#%s",
         "description": "%s, %s",
         "marker-symbol": "star",
         "marker-color": "%s",
         "marker-size": "large"
      },
      "geometry": {
          "type": "Point",
          "coordinates": [%s,%s]
      }
    },
    '''

            template_line = '''
    { "type": "Feature",
      "properties": {
          "title": "#%s=>#%s COG:%s",
          "stroke": "%s",
          "stroke-width": "5"
       },
      "geometry": {
          "type": "LineString",
          "coordinates": [
          [%s,%s],[%s, %s]
          ]
       }
     },'''

            template_line_tail = '''
    ]
 }
            '''


# 處理 Point Marker

            iter = 0
            for row in rawData:
                iter += 1
                if iter == 2:
                    coord = limitlonlat(float(row[2]), float(row[1]))
                    startLatStr = coord[1]
                    startLonStr = coord[0]
                    startLatRad = math.radians(float(startLatStr))
                    startLonRad = math.radians(float(startLonStr))

                    pointStr = latlonConv(startLatStr, startLonStr)
                    output += template_firstpoint % (row[0], pointStr[0],
                                                     pointStr[1], color,
                                                     startLonStr, startLatStr)

                if iter > 2:
                    coord = limitlonlat(float(row[2]), float(row[1]))
                    endLatStr = coord[1]
                    endLonStr = coord[0]
                    endLatRad = math.radians(float(endLatStr))
                    endLonRad = math.radians(float(endLonStr))

                    dLon = endLonRad - startLonRad
                    # dPhi = math.log(math.tan(endLatRad/2.0 + math.pi / 4.0)/
                    #        math.tan(startLatRad/2.0 + math.pi/4.0))

                    if abs(dLon) > math.pi:
                        if dLon > 0.0:
                            dLon = -(2.0 * math.pi - dLon)
                        else:
                            dLon = (2.0 * math.pi + dLon)
                        endLonRad = startLonRad + dLon
                        endLonStr = str(math.degrees(endLonRad))

                    pointStr = latlonConv(endLatStr, endLonStr)
                    output += template_point % (row[0], pointStr[0],
                                                pointStr[1], iter-1,
                                                color, endLonStr, endLatStr)

# 處理 Line Marker

            fi.seek(0)
            iter = 0

            for row in rawData:
                iter += 1
                if iter == 2:
                    coord = limitlonlat(float(row[2]), float(row[1]))
                    startLatStr = coord[1]
                    startLonStr = coord[0]
                    startLatRad = math.radians(float(startLatStr))
                    startLonRad = math.radians(float(startLonStr))

                if iter > 2:
                    coord = limitlonlat(float(row[2]), float(row[1]))
                    endLatStr = coord[1]
                    endLonStr = coord[0]
                    endLatRad = math.radians(float(endLatStr))
                    endLonRad = math.radians(float(endLonStr))

                    dLon = endLonRad - startLonRad
                    dPhi = math.log(math.tan(endLatRad / 2.0 + math.pi / 4.0) /
                                    math.tan(startLatRad / 2.0 + math.pi / 4.0)
                                    )

                    if abs(dLon) > math.pi:
                        if dLon > 0.0:
                            dLon = -(2.0 * math.pi - dLon)
                        else:
                            dLon = (2.0 * math.pi + dLon)
                        endLonRad = startLonRad + dLon
                        endLonStr = str(math.degrees(endLonRad))

                    bearing = (math.degrees(math.atan2(dLon, dPhi)) +
                               360.0) % 360.0

                    output += template_line % (iter-2, iter-1, round(bearing),
                                               color, startLonStr, startLatStr,
                                               endLonStr, endLatStr)

                    startLatStr = endLatStr
                    startLonStr = endLonStr
                    startLatRad = endLatRad
                    startLonRad = endLonRad

            output = output[:-1]+template_line_tail


# opens an geoJSON file to write the output to
            if not os.path.exists(os.path.dirname(outputfilepath)):
                try:
                    os.makedirs(os.path.dirname(outputfilepath))
                except OSError as exc:
                    if exc.errno != errno.EEXIST:
                        raise
            with open(outputfilepath, "w") as fo:
                # print outputfilepath
                fo.write(output)
            fi.close()
            # os.remove(inputfilepath)


# 航向與距離計算公式
# bearing formula:
# Δψ = ln( tan(π/4 + φ2/2) / tan(π/4 + φ1/2) )(‘projected’ latitude difference)
# θ = atan2(Δλ, Δψ)
# where φ is latitude, λ is longitude, Δλ is taking shortest route (<180°),
# R is the earth’s radius, ln is natural log

# distance formula:
# δ = d/R	(angular distance)
# Δψ = ln( tan(π/4 + φ2/2) / tan(π/4 + φ1/2))(‘projected’ latitude difference)
# q = Δφ/Δψ (or cos φ for E-W line)
# Δλ = δ ⋅ sin θ / q
# φ2 = φ1 + δ ⋅ cos θ
# λ2 = λ1 + Δλ
# where φ is latitude, λ is longitude, Δλ is taking shortest route (<180°),
# ln is natural log, R is the earth’s radius
