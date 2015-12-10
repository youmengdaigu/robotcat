# -*- coding: UTF-8 -*-
import xlrd
from datetime import datetime
import requests
import json
import numpy as np

######################################################################
#核心函数
######################################################################

#从excel中获取数据
def getData(fileName):
	excel = xlrd.open_workbook(fileName)
	table = excel.sheets()[0]
	#获取单元格的行数和列数
	nrows = table.nrows
	ncols = table.ncols
	#建立一个矩阵和时间标签
	data = np.zeros((nrows-6,13))
	timelabel = [0]*(nrows-6)
	#遍历单元格
	for i in xrange(4,nrows-2):
		time =timeToStr(table.cell(i,0).value,excel)
		timelabel[i-4] = time
		for j in xrange(3,ncols-1):
			#获取单元格的值
			cell = table.cell(i,j).value
			if cell == u'+' or cell == u'-':
				setValue(i,j,cell,data)
	return data,timelabel

def saveData(data,timelabel):
	for i in xrange(0,len(timelabel)):
		location = len(timelabel)-i-1
		time = timelabel[location]
		guesses = data[location,1:]
		trueValue = data[location,0]
		#更新result数据
		preData = {'time':time,'trueValue':trueValue}
		postData('/api/results',preData)
		#更新guesses数据
		for j in xrange(0,len(guesses)):
			UserId = j+1
			print UserId
			preValue = guesses[j]
			print preValue
			guessData = {'UserId':UserId,'preValue':preValue,'trueValue':trueValue,'time':time}
			postData('/api/guesses',guessData)

######################################################################
#辅助函数
######################################################################
#读取配置信息
def config():
	f = file("../config.json")
	s = json.load(f)
	return s['analyse']

#POST数据
def postData(path,data):
	c = config()
	url = c['url']+path
	r = requests.post(url,data)
	print r.text.encode('utf8')

#为矩阵赋值
def setValue(i,j,cell,data):
	if j == 3:
		if cell == u'+':
			data[i-4,12] = 1
		elif cell == u'-':
			data[i-4,12] = -1
	else:
		if cell == u'+':
			data[i-4,(j-4)/2] = 1
		elif cell == u'-':
			data[i-4,(j-4)/2] = -1

#将时间转换为字符串
def timeToStr(time,excel):
	year, month, day,hour, minute, second  = xlrd.xldate_as_tuple(time,excel.datemode)
	year = str(year)
	month = str(month)
	day = str(day)
	return year+month+day

######################################################################
#测试
######################################################################

if __name__ == '__main__':
	a,b = getData('../data/spider/history.xlsx')
	saveData(a,b)