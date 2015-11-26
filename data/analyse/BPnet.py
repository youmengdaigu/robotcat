# -*- coding: UTF-8 -*-
from datetime import datetime
import getData as g
from pybrain.structure import *
from pybrain.datasets import SupervisedDataSet
from pybrain.supervised.trainers import BackpropTrainer
#######################################################
#构造神经网络
#######################################################
def createBP(il,hl,ol):
	n = FeedForwardNetwork()
	#定义神经网络结构，输入层、隐藏层、输出层
	inLayer = LinearLayer(il)
	hiddenLayer = SigmoidLayer(hl)
	outLayer = LinearLayer(ol)
	#使用该层
	n.addInputModule(inLayer)
	n.addModule(hiddenLayer)
	n.addOutputModule(outLayer)
	#建立三层之间的链接
	in_to_hidden = FullConnection(inLayer,hiddenLayer)
	hidden_to_out = FullConnection(hiddenLayer,outLayer)
	#将连接加入神经网络
	n.addConnection(in_to_hidden)
	n.addConnection(hidden_to_out)
	#让神经网络可用
	n.sortModules()
	return n
#######################################################
#构造数据集
#######################################################
#定义数据集的格式
def getDS(il,ol,trainData):
	DS = SupervisedDataSet(il,ol)
	# 网数据集里面加样本点
	r = trainData.shape[0]
	for i in xrange(0,r-1):
		DS.addSample(trainData[i,:il],trainData[i,il])
	return DS

#######################################################
#训练并预测TIME时间的神经网络
#######################################################
#训练采用BP算法 verbose = True 即训练时会把Total error 打印出来，默认的训练集和验证集是4：1
def predict(netWork,DS,preData):
	trainer = BackpropTrainer(netWork,DS,verbose = True,learningrate = 0.01)
	#maxEpochs 即需要的最大收敛迭代次数
	trainer.trainUntilConvergence(maxEpochs = 1000)
	#获取预测结果
	preValue = n.activate(preData)
	#设置预测值
	if preValue > 0:
		v = 1
	else:
		v = -1
	#将预测结果保存到数据库中
	g.save(v,time)


if __name__ =='__main__':
	#获取当天时间
	time = g.todayTime()
	#获取最新的训练数据和预测数据
	trainData,preData,num = g.getData()
	#构建神经网络和数据集
	n = createBP(num,num+1,1)
	DS = getDS(num,1,trainData)
	#训练并预测神经网络
	predict(n,DS,preData)















