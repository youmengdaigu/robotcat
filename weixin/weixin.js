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
        weixinLogin(req,openID);
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
function weixinLogin(req,openID){
  weixin.getUserInfo(openID,function(userInfo){
    var username = userInfo.nickname;
    User.findOrCreate({where:{username:username},defaults:{username:username,password:'123456'}})
    .spread(function(user){
      req.session.user = user;{
          // The tab key will cycle through the settings when first created
          // Visit http://wbond.net/sublime_packages/sftp/settings for help
          
          // sftp, ftp or ftps
          "type": "sftp",
      
          "sync_down_on_open": true,
          "sync_same_age": true,
          
          "host": "example.com",
          "user": "username",
          //"password": "password",
          //"port": "22",
          
          "remote_path": "/example/path/",
          //"file_permissions": "664",
          //"dir_permissions": "775",
          
          //"extra_list_connections": 0,
      
          "connect_timeout": 30,
          //"keepalive": 120,
          //"ftp_passive_mode": true,
          //"ftp_obey_passive_host": false,
          //"ssh_key_file": "~/.ssh/id_rsa",
          //"sftp_flags": ["-F", "/path/to/ssh_config"],
          
          //"preserve_modification_times": false,
          //"remote_time_offset_in_hours": 0,
          //"remote_encoding": "utf-8",
          //"remote_locale": "C",
          //"allow_config_upload": false,
      }
      
      console.log('登陆成功！');
    });
  })
}







