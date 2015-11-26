# -*- coding: UTF-8 -*-
from datetime import datetime
import numpy as np
import requests
import json
import xlrd


# #从excel中获取数据
# def getData(fileName):
# 	excel = xlrd.open_workbook(fileName)
# 	table = excel.sheets()[0]
# 	#获取单元格的行数和列数
# 	nrows = table.nrows
# 	ncols = table.ncols
# 	#建立一个矩阵
# 	data = np.zeros((nrows-6,13))
# 	#遍历单元格
# 	for i in xrange(4,nrows-2):
# 		for j in xrange(3,ncols-1):
# 			#获取单元格的值
# 			cell = table.cell(i,j).value
# 			if cell == u'+' or cell == u'-':
# 				setValue(i,j,cell,data)
# 	return data


#从数据库中获取所有的数据，并将数据形成一个可以进行训练的
def getData():
	#获取所有猜测数据以及,用户数,和最新的数据
	guesses = requestDate('/api/guesses')
	num = int(requestDate('/api/users/totalNum'))
	results = requestDate('/api/results')
	today = todayTime()
	#设置历史数据和当天的数据
	preDate =[0]*num
	dataSet = {}
	trainData =[]
	#遍历所有的结果
	for i in xrange(0,len(results)-1):
		time = results[i]['time']
		#建立当前时间对应的序列
		dataSet[time] = [0]*(num+1)
		dataSet[time][num] = results[i]['trueValue']
	#遍历所有的用户数据
	for i in xrange(0,len(guesses)):
		t = guesses[i]['time']
		id = guesses[i]['UserId']
		result = guesses[i]['result']
		if t == today:
			#为序列赋值
			preDate[id-1] = result
		else:
			dataSet[t][id-1] = result
	#将数据保存成numpy的矩阵样式
	for i in dataSet:
		trainData.append(dataSet[i])
	return np.array(trainData),preDate,num

# #从数据库中获取相应时间的数据
# def getTimeData(time):
# 	newGuesses = requestDate('/api/guesses/'+time)
# 	num = int(requestDate('/api/users/totalNum'))
# 	data = [0]*num
# 	for t in newGuesses:
# 		data[t['id']-1]=t['result']
# 	return data,num


#将预测结果保存到数据库中
def save(preValue,time):
	c = config()
	data ={'time':time,'preValue':preValue}
	url = c['url']+'/api/results'
	r = requests.post(url,data=data)
	print r.text.encode('utf8')
# #为矩阵赋值
# def setValue(i,j,cell,data):
# 	if j == 3:
# 		if cell == u'+':
# 			data[i-4,12] = 1
# 		elif cell == u'-':
# 			data[i-4,12] = -1
# 	else:
# 		if cell == u'+':
# 			data[i-4,(j-4)/2] = 1
# 		elif cell == u'-':
# 			data[i-4,(j-4)/2] = -1

#读取配置信息
def config():
	f = file("../config.json")
	s = json.load(f)
	return s['analyse']

#请求数据
def requestDate(path):
	c = config()
	url = c['url']+path
	r = requests.get(url)
	text = json.loads(r.text)
	return text
#获取当天的时间
def todayTime():
	now = datetime.now()
	year = str(now.year)
	month = str(now.month)
	day = str(now.day)
	return year+month+day
if __name__ =='__main__':
	# data = getData('../spider/history.xlsx')
	# r = getTimeData('20151122')
	save(1,'20151122')