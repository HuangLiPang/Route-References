#!/usr/bin/python
# -*- coding: utf-8 -*-
"""
csv2gpx.py
modified on Fri Jun 16 16:35 2017
convert csv route to gpx for SEAiq
Created on Tue May 10 10:12 2016
@author: eddie@robodock.net
"""

import os
import csv
import errno

sp = os.path.sep

csvDir = 'CSV'
gpxDir = 'GPX'

gpxHead = '''<?xml version="1.0" encoding="utf-8" ?>
<gpx version="1.1" creator="ESTC"
xmlns="http://www.topografix.com/GPX/1/1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">
'''
gpxTail = '</gpx>'


for root, dirs, files in os.walk(csvDir):
    for eachfile in files:
        if eachfile.endswith(".csv"):
            inputfilepath = os.path.join(root, eachfile)
            routeName = eachfile.rsplit('.csv')[0]
            print inputfilepath
            outputfilepath = gpxDir + \
                inputfilepath.split(csvDir)[1].rsplit('.csv')[0]+'.gpx'
            fi = open(inputfilepath, 'rb')
            rawData = csv.reader(fi, dialect='excel')

            template_wpt = '''
<wpt lat="%s" lon="%s"><name>%s</name></wpt>'''

            template_rte = '''
    <rtept lat="%s" lon="%s"><name>%s</name></rtept>'''

            # 處理 wpt
            wptoutput = ''
            iter = 0
            for row in rawData:
                iter += 1
                if iter > 1:

                    wptStr = row[0]
                    latStr = row[1]
                    lonStr = row[2]

                    wptoutput += template_wpt % (latStr, lonStr, wptStr)

            # 處理 rte
            fi.seek(0)
            rteoutput = ''
            iter = 0
            for row in rawData:
                iter += 1
                if iter > 1:

                    wptStr = row[0]
                    latStr = row[1]
                    lonStr = row[2]

                    rteoutput += template_rte % (latStr, lonStr, wptStr)

            output = gpxHead
            output += wptoutput
            output += '\n\n<rte>\n'
            output += '<name>'+routeName+'</name>'
            output += rteoutput
            output += '\n</rte>\n'
            output += '</gpx>'

# opens an gpx file to write the output
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
