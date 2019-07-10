var express = require('express');
var router = express.Router();
var mongoClient = require('../models/mongoClient');

var _status_=[6];

mongoClient.connect((err,db,client)=>{
  client.close();
})

router.get('/', (req, res, next)=>{
  res.render("index");
});

router.get('/login_check', (req, res, next)=>{
  var Id = req.query.UserId;
  var Password = req.query.UserPassword;
  var _name =[6];
  var _class=[6];
  var _grade=[6];
  var _num = [6];


  mongoClient.connect((err,db,client)=>{
    db.collection('User').find({UserId : Id, UserPassword : Password}).toArray((err, result)=>{
      if(result.length != 1){
        res.render("login_check",{pass : true});
      }else{
        db.collection('seatNumber').find({}).toArray(function(err,result){
          for(var i=0;i<6;i++){
            _name[i]=result[i].id;
            _grade[i]=result[i].grade;
            _class[i]=result[i].class;
            _num[i]=result[i].num;
          }
          obj={_name:_name,_grade:_grade,_class:_class,_num:_num}
          res.render('notebookCheck.ejs',obj);
        });
      }
      client.close();
    });
  });
});

router.get('/login_lent', (req, res, next)=>{
  var Id = req.query.UserId;
  var Password = req.query.UserPassword;
  
  mongoClient.connect((err,db,client)=>{
    db.collection('User').find({UserId : Id, UserPassword : Password}).toArray((err, result)=>{
      if(result.length != 1){
        res.render("login_lent",{pass : true});
      }else{
        console.log('check');
        db.collection('seatNumber').find({}).toArray(function(err,result){
          for(var i=0;i<6;i++){
            _status_[i]=parseInt(result[i].status);
            console.log(`${i+1}_status : `+_status_[i]);
          }
          var status_check=0;
          var obj = {_status_:_status_,status_check:status_check}
          res.render('notebookLent',obj);
        });
        //res.render("notebookLent")
      }
      client.close();
    });
  });
});


router.get('/update', (req, res, next)=>{
  var Id = req.query.UserId;
  var Password = req.query.UserPassword;
  
  mongoClient.connect((err,db,client)=>{
    db.collection('User').find({UserId : Id, UserPassword : Password}).toArray((err, result)=>{
      if(result.length != 1){
        res.render("update",{pass : true});
      }else{
        console.log('check');
        db.collection('seatNumber').find({}).toArray(function(err,result){
          for(var i=0;i<6;i++){
            _status_[i]=parseInt(result[i].status);
            console.log(`${i+1}_status : `+_status_[i]);
          }
          var status_check=0;
          var obj = {_status_:_status_,status_check:status_check}
          res.render('notebookLent',obj);
        });
        //res.render("notebookLent")
      }
      client.close();
    });
  });
});

router.get('/create', function(req, res, next) {
  
  mongoClient.connect(function(err,db,client){
    const query = req.query;

    var userObject = {UserId : query.UserId, UserPassword : query.UserPassword, UserName : query.UserName,
       Grade : query.Grade, Class : query.Class, Number : query.Number, UserType : query.UserType};
    db.collection('User').insertOne(userObject, (err,recode)=>{
      if(err){
        res.send("값을 입력하는데 실패했습니다. : " + err);
      }
      res.send("값을 성공적으로 입력했습니다.");
      client.close();
    });
  });
});



module.exports = router;
