var express = require('express');
var User = require('../db/models').User;
var Result = require('../db/models').Result;
var weixin = require('../weixin');
var router = express.Router();



//竞猜页面
///////////////////////////////////////////////////
router.get('/', function(req, res) {
  console.log(req.session.user);
  if (!req.session.user) {
    res.redirect('/login');
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

//注册页面
router.post('/reg',function(req,res){
  var name = req.body.name,
      password = req.body.password
})

//登陆页面
///////////////////////////////////////////////////
router.get('/login', function(req, res, next) {
  res.render('login', { title: '首页' });
});

//注册登陆模块
///////////////////////////////////////////////////
router.post('/login', function (req, res) {
  //检查用户是否存在
  User.findOne({where:{username:req.body.username}}).then(function (user) {
    if (!user) {
      res.redirect('/login');
    }
    //检查密码是否一致
    if (user['dataValues'].password != req.body.password) {
      res.redirect('/login');
    }
    //用户名密码都匹配后，将用户信息存入 session
    req.session.user = user;
    res.redirect('/');//登陆成功后跳转到竞猜页
  });
});

router.get('/logout', function(req, res){
  req.session.user = null;
  res.redirect('/login');//返回首页
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
//判断session中是否保存了用户的信息
function checkSession(){
  weixin.get
}



module.exports = router;
