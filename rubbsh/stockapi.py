#!/usr/bin/env python
# -*- coding: utf-8 -*-
import json
import time
from dataapiclient import Client
client = Client()
client.init('925d3d1fa72df1e083f80e1e4153c18151d16763583e87bd194e724a09b0bb16')

class Stock:
	#获得沪深300的每日行情
	def getHS300(self,time):
		url = '/api/market/getMktIdxd.json?field=&beginDate=&endDate=&indexID=&ticker=399300&tradeDate='+time
		code, result = client.getData(url)
		a = json.loads(result)
		return a