var express = require('express');
var router = express.Router();
var MongoClient = require('../models/mongoClient');

//var MongoClient = require('mongodb').MongoClient;
//var url = 'mongodb://localhost:27017';
//var dbName = 'NoteBookLent';
var status_check=0;
var _status_ = [6];
var _name =[6];
var _class=[6];
var _grade=[6];
var _num = [6];
var myid = '이민준';
var mygrade = 2 
var myclass = 3
var mynumber = 11
var pass = 0;
var cpass =0;

var name;
var number;

var cancel = 'NULL';

var obj={_name:_name,_grade:_grade,_class:_class,_num:_num};
var sobj ={};

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', null);
});

router.get('/Demerit',(req,res,next)=>{
  res.render('Demerit');
});

router.get('/giveDemerit',(req,res,next)=>{
  res.render('giveDemerit');
});

router.get('/mySeat',(req,res,next)=>{
  var UserId = res.query.UserId;
  MongoClient.connect(function(err,db,client){
    MongoClient.getUserByUserId(UserId,(user)=>{
      db.collection('seatNumber').findOne({grade : user.Grade, class : user.Class, number : user.Number}, (err,result)=>{
        //console.log(result);
        name = myid;
        if(result==null){
          number = 0;
        }else{
          //console.log(result);
          //console.log(result.number);
          number = result.number;
        }
        sobj ={name:user.UserName,number:number};
        res.render('mySeat.ejs',sobj);
      });
    });
    client.close();
  });
});

router.get('/notebookCheck',(req,res,next)=>{
  MongoClient.connect(function(err,db, client){
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
    client.close();
  });
});

router.get('/notebookLent', (req, res, next)=>{
  MongoClient.connect(function(err,db, client) {
    db.collection('seatNumber').find({}).toArray(function(err,result){
      for(var i=0;i<6;i++){
        _status_[i]=parseInt(result[i].status);
        //console.log(`${i+1}_status : `+_status_[i]);
      }
      status_check=0;
      obj = {_status_:_status_,status_check:status_check}
      res.render('notebookLent.ejs',obj);
    });
    client.close();
  });
});



router.get('/notebookCancel', (req, res, next)=>{
  MongoClient.connect(function(err,db, client) {
    db.collection('seatNumber').find({}).toArray(function(err,result){
      for(var i=0;i<6;i++){
        _status_[i]=parseInt(result[i].status);
        //console.log(`${i+1}_status : `+_status_[i]);
      }
      status_check=0;
      obj = {_status_:_status_,status_check:status_check}
      res.render('notebookCancel.ejs',obj);
    });
    client.close();
  });
});


router.post('/notebookLent_process',function(req,res){
  MongoClient.connect(function(err,db, client) {
    const snum = parseInt(req.body.seat);
    db.collection('seatNumber').find({}).toArray(function(err,result){  
      if(result[snum-1].status==1) {
        status_check=3;
        pass=1;
        obj = {_status_:_status_,status_check:status_check,num:snum}
        //res.render('notebookLent.ejs',obj);
      }else{
        for(var i=0;i<6;i++){
          if(result[i].id==myid){
            //console.log('fuck my id');
            status_check=5;
            pass=1;
            obj = {_status_:_status_,status_check:status_check,num:snum}
          }
        }
      }
      if(pass==1){
        res.render('notebookLent.ejs',obj);
        //console.log('이거 출력되면 시발');
        //console.log(`pass : `+pass);
      }
      else if(pass==0){
        db.collection('seatNumber').updateMany({ number:snum }, 
          { $set: { status: 1 ,id: myid,grade:mygrade,class:myclass,num:mynumber} },function(err,result){
          if(err)console.log(err.message);
        });

        db.collection('seatNumber').find({}).toArray(function(err,result){
          //console.log(result);
          for(var i=0;i<6;i++){
            _status_[i]=parseInt(result[i].status);
          }
          status_check=1;
          obj = {_status_:_status_,status_check:status_check,num:snum}
          res.render('notebookLent.ejs',obj);
        });
      }
      pass=0;
      client.close();
    });
  });
});



router.post('/notebookLent_Cancel',function(req,res){
  MongoClient.connect(function(err,db,client) {  
    const snum = parseInt(req.body.seat);
    db.collection('seatNumber').find({}).toArray(function(err,result){  
      if(result[snum-1].status==0) {
        status_check=4;
        cpass=1;
        obj = {_status_:_status_,status_check:status_check,num:snum}
        //res.render('notebookLent.ejs',obj);
      }else{
        //for(var i=0;i<6;i++){
          if(result[snum-1].id!=myid){
            //console.log('fuck my id');
            console.log('this is not my id !');
            status_check=6;
            cpass=1;
            obj = {_status_:_status_,status_check:status_check,num:snum}
          }
        //}
      }
      if(cpass==1){
        res.render('notebookCancel.ejs',obj);
        //console.log('이거 출력되면 시발');
        console.log(`cpass : `+cpass);
      }
      else if(cpass==0){
        console.log(`cpass : `+cpass);
        db.collection('seatNumber').updateMany({ number:snum }, 
          { $set: { id: cancel,status: 0,grade:0,class:0,num:0 } },function(err,result){
          if(err)console.log(err.message);
          console.log('update is successed');
        });
        
        db.collection('seatNumber').find({}).toArray(function(err,result){

          console.log('여기는 된다');
          console.log(result);

          for(var i=0;i<6;i++){
            _status_[i]=parseInt(result[i].status);
            console.log(_status_[i]);
          }
          status_check=2;
          obj = {_status_:_status_,status_check:status_check,num:snum}
          res.render('notebookCancel.ejs',obj);
        });
      }
      cpass=0;
      client.close();
    }); //console.log('cpass :'+cpass);
  });
});


module.exports = router;
