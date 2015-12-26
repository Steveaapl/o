

var mongodb=require('mongodb').MongoClient;


var mongoose=require('mongoose');
mongoose.connect('mongodb://localhost:27017/omoyo');

var Schema=mongoose.Schema;
 var tokenArray=new Array();
var GCM = require('gcm').GCM;
var apiKey = 'AIzaSyDDktt4Gs4qFm8ln7HNLDETpaL_vn_-IzE';
var gcm = new GCM(apiKey);
//AIzaSyDDktt4Gs4qFm8ln7HNLDETpaL_vn_-IzE
//AIzaSyCIenYCeE6sqcfWg6VcXhpCyTxsQOPH-HE
var gcmtoken=new Schema({
	token_id:Number,token_number:String,location_id:Number,date:String
});

var GcmToken=mongoose.model("GcmToken",gcmtoken);

GcmToken.find({}).select({token_number:1,_id:0}).exec(function(error,doc){
  for(var i=0;i<doc.length;i++){
     
var message = {
   "to":doc[i].token_number, // required
  "collapseKey":"applice",
  "data":{
    "message":"My message","title":"My Title"
    }
};

gcm.send(message, function(err, messageId){
    if (err) {
        console.log("Something has gone wrong!");
    } else {
        console.log("Sent with message ID: ", messageId);
    }
});
  }
});

