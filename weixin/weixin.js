var express = require('express');
var wechat = require('wechat');
var weixinCon = require('../config')["weixin"];
var weixin = require('./index');
var User = require('../db/models').User;
var config = {
  token: weixinCon["token"],
  appid: weixinCon["appID"],
  // encodingAESKey: 'encodinAESKey'
};
module.exports = function(app){
  app.use(express.query());
  app.use('/api/weixin/confirm', wechat(config, function (req, res, next) {
    // 微信输入信息都在req.weixin上
    var message = req.weixin;
    console.log(message);
    if (message.Event ==='subscribe'){
      // 用户首次登陆时发消息提示
      res.reply('欢迎使用CIA云投研系统，当前推出【沪深300猜涨跌】活动，您可以点击菜单中猜涨跌选项参与；点击琅琊榜可以看到自己的排名；点击个人主页可以查看竞猜历史。')

    }else if (message.FromUserName === 'ojFjxwPPT21s-J-50L8w86a-IJDQ') {
      // 回复屌丝(普通回复)
      res.reply('hehe');
    } else if (message.FromUserName === 'text') {
      //你也可以这样回复text类型的信息
      res.reply({
        content: 'text object',
        type: 'text'
      });
    } else if (message.FromUserName === 'hehe') {
      // 回复一段音乐
      res.reply({
        type: "music",
        content: {
          title: "来段音乐吧",
          description: "一无所有",
          musicUrl: "http://mp3.com/xx.mp3",
          hqMusicUrl: "http://mp3.com/xx.mp3",
          thumbMediaId: "thisThumbMediaId"
        }
      });
    } else {
      // 回复高富帅(图文回复)
      res.reply([
        {
          title: '你来我家接我吧',
          description: '这是女神与高富帅之间的对话',
          picurl: 'http://nodeapi.cloudfoundry.com/qrcode.jpg',
          url: 'http://nodeapi.cloudfoundry.com/'
        }
      ]);
    }
  }));
}


// weixin.createMenu(function(r){
//   console.log(r);
// })

