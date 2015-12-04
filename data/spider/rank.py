# -*- coding: UTF-8 -*-
from datetime import datetime
import json
import requests


#更新排名当天的数据
def updateRank():
	num = int(requestDate('/api/users/totalNum'))
	for id in xrange(1,num+1):
		guesses = requestDate('/api/user/'+str(id)+'/guesses')
		save(id,rate(guesses))

#计算用户的准确率
def rate(guesses):
	rate = 0
	correct = 0
	length = len(guesses)
	for guess in guesses:
		if guess["trueValue"] == guess["preValue"]:
			correct = correct + 1
		else:next
	return round(float(correct)/length,2)


#将准确率保存到数据库中
def save(id,rate):
	c = config()
	print rate
	data ={"rate":rate}
	url = c['url']+'/api/users/'+str(id)
	r = requests.post(url,data=data)
	print r.text.encode("utf8")


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

#请求数据
def requestDate(path):
	c = config()
	url = c['url']+path
	r = requests.get(url)
	text = json.loads(r.text)
	return text


if __name__ == '__main__':
	updateRank()