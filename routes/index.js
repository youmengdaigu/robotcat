var express = require('express');
var User = require('../db/models').User;
var Result = require('../db/models').Result;
var Guess = require('../db/models').Guess;
var weixin = require('../weixin');
var router = express.Router();




//竞猜页面
///////////////////////////////////////////////////
router.get('/', function(req, res) {
  if (!req.session.user) {
    //获取url
    var url = weixin.getOathUrl();
    res.redirect(url);
  }else{
    var time = today();
    var tradeAble = tradeTime(time);
    Result.findOrCreate({where:{time:time},defaults:{time:time}})
    .spread(function(result){
      preValue = toStr(result.preValue);
      trueValue = toStr(result.trueValue);
      res.render('index', {
        title: '竞猜页',
        time :time,
        tradeAble:tradeAble,
        preValue:preValue,
        trueValue:trueValue,
        user:req.session.user
      });
    });
  }
});

//用户个人主页，他人访问
///////////////////////////////////////////////////
router.get('/guesses/:userId',function(req,res){
  if (!req.session.user) {
    //获取url
    var url = weixin.getOathUrl();
    res.redirect(url);
  }else{
    var time = today();
    var tradeAble = tradeTime(time);
    var id = req.params.userId;
    Guess.findOrCreate({where:{time:time,UserId:id},defaults:{time:time,UserId:id}})
    .spread(function(guess){
      preValue = toStr(guess.preValue);
      trueValue = toStr(guess.trueValue);
      res.render('self', {
        title: '个人主页',
        time :time,
        tradeAble:tradeAble,
        preValue:preValue,
        trueValue:trueValue,
        user:req.session.user
      });
    });
  }
});

//用户个人主页，自己访问
///////////////////////////////////////////////////
router.get('/me',function(req,res){
  var time = today();
  var tradeAble = tradeTime(time);
  var user = req.session.user;
  var id = user.id;
  Guess.findOrCreate({where:{time:time,UserId:id},defaults:{time:time,UserId:id}})
  .spread(function(guess){
    preValue = toStr(guess.preValue);
    trueValue = toStr(guess.trueValue);
    res.render('self', {
      title: '个人主页',
      time :time,
      tradeAble:tradeAble,
      preValue:preValue,
      trueValue:trueValue,
      user:req.session.user
    });
  });
});


//琅琊榜页面
///////////////////////////////////////////////////
router.get('/ranklist',function(req,res){
  if (!req.session.user) {
    //获取url
    var url = weixin.getOathUrl();
    res.redirect(url);
  }else{
    var time = today();
    User.findAll().then(function(users){
      res.render('ranklist',{
        users:users,
        user:req.session.user,
        title:'琅琊榜',
        time:time
      })
    });
  }
});




//OAUTH验证
///////////////////////////////////////////////////
router.get('/oauth',function(req,res){
  var code = req.query.code;
  //获取用户信息
  weixin.getUserInfo(code,function(user){
    User.findOrCreate({where:{username:user.nickname},defaults:{username:user.nickname,password:"123456"}})
    .spread(function(user){
      req.session.user = user;
      res.redirect('/');
    });
  });
});




function toStr(value){
  if (value>0){
      return '涨';
    }else if (value<0){
      return '跌';
    }else{
      return '无';
  }
}


//获取今天的时间
function today(){
  var d = new Date();
  var year = d.getFullYear().toString();
  var month = (d.getMonth()+1).toString();
  var day = d.getDate().toString();
  var time = year+month+day;
  return time;
}

//判断当天是否是交易时间
function tradeTime(time){
  var config = require('../config');
  var list = config["analyse"]["untradeTime"];
  if (list.indexOf(time)=== -1){
    return true;
  }else{
    return false;
  }
}


module.exports = router;
