var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://root:fimongodbwid1!@3.14.130.182:27017/';
var dbName = 'NoteBookLent';

var mongoClient = new Object();

mongoClient.connect = function(callback){
    MongoClient.connect(url,{useNewUrlParser:true}, function(err, client){
        const db = client.db(dbName);
        callback(err,db,client);
    });
}

mongoClient.getUserByUserId = function(UserId, callback){
    mongoClient.connect((err, db, client)=>{
        db.collection("User").findOne({UserId : UserId},(err,user) => {
            callback(user)
        });
    });
}


module.exports = mongoClient;