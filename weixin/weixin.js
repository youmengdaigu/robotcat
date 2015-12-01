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
    //判断消息事件是否是关注和点击事件
    if (message.MsgType === "event"){
      if(message.Event === "subscribe"){
        var openID = message.FromUserName;
        //判断用户是否注册如果没有注册则注册用户
        weixinLogin(openID,function(user){
          req.session.user = user;
          console.log(req.session.user);
          console.log('登陆成功！');
        });
      }
    }

    if (message.FromUserName === 'ojFjxwPPT21s-J-50L8w86a-IJDQ') {
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

//当用户关注时执行注册
function weixinLogin(openID,callback){
  weixin.getUserInfo(openID,function(userInfo){
    var username = userInfo.nickname;
    User.findOrCreate({where:{username:username},defaults:{username:username,password:'123456'}})
    .spread(function(user){
      callback(user);
    });
  })
}



