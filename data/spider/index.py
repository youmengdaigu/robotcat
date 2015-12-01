# -*- coding: UTF-8 -*-
from datetime import datetime
import json
import requests


#更新HS300当天的数据
def updateHS300():
	time = todayTime()
	a = getHS300()
	if a < 0:
		save(-1,time)
	elif a > 0:
		save(1,time)
	elif a == 0:
		save(0,time)

#将HS300数据存储到数据库中
def save(trueValue,time):
	c = config()
	data ={'trueValue':trueValue,'time':time}
	url = c['url']+'/api/results'
	r = requests.post(url,data=data)
	print r.text.encode('utf8')

#获取HS300的数据
def getHS300():
	url = "http://cjhq.baidu.com/quote?s4=399300.sz"
	r = requests.get(url)
	rlist = r.text.split('"')
	op =float(rlist[7])
	la = float(rlist[17])
	time = datetime.strptime(rlist[21], "%Y-%m-%d %H:%M:%S").date()
	now = datetime.now()
	if op>la:
		hs300 = -1
	else:
		hs300 = 1
	if time.day == now.day:
		return hs300
	else:
		return 0

#读取配置信息
def config():
	f = file("../config.json")
	s = json.load(f)
	return s['analyse']

#获取当天的时间
def todayTime():
	now = datetime.now()
	year = str(now.year)
	month = str(now.month)
	day = str(now.day)
	return year+month+day

if __name__ == '__main__':
	# getHS300()
	updateHS300()