# -*- coding: UTF-8 -*-
import MySQLdb

db=MySQLdb.connect(host="windfof2014.mysql.rds.aliyuncs.com",user="readuser",passwd="user123",db="wind")

def getEodPrices(ticker,time):
	cursor = db.cursor()
	sql = "SELECT * FROM aindexeodprices WHERE S_INFO_WINDCODE = %s and TRADE_DT = %s"%(ticker,time)
	try:
		cursor.execute(sql)
		result = cursor.fetchall()
		return result
		db.commit()
	except:
		print "Error: unable to fecth data"


if __name__ == '__main__':
	print getEodPrices('399300.SZ','20151124')