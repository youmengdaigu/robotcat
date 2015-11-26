var express = require('express');
var User = require('../db/models').User;
var Result = require('../db/models').Result;
var router = express.Router();

//竞猜页面
///////////////////////////////////////////////////
router.get('/', function(req, res) {
  if (!req.session.user) {
    res.redirect('/login');
  }else{
    var time = today();
    Result.findOrCreate({where:{time:time},defaults:{time:time}})
    .spread(function(result){
      res.render('index', {
        title: '竞猜页',
        preValue:result.preValue,
        trueValue:result.trueValue,
        user:req.session.user
      });
    });
  }
});

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




//获取今天的时间
function today(){
  var d = new Date();
  var year = d.getFullYear().toString();
  var month = (d.getMonth()+1).toString();
  var day = d.getDate().toString();
  var time = year+month+day;
  return time;
}


module.exports = router;
