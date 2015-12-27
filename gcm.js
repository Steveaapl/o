var http=require('https');
var mongodb=require('mongodb').MongoClient;
var mongoose=require('mongoose');
mongoose.connect('mongodb://localhost:27017/omoyo');
var Schema=mongoose.Schema;
var tokenArray=new Array();
var gcmtoken=new Schema({
	token_id:Number,token_number:String,location_id:Number,date:String
});

var GcmToken=mongoose.model("GcmToken",gcmtoken);

GcmToken.find({}).select({token_number:1,_id:0}).exec(function(error,doc){
  for(var i=0;i<doc.length;i++){
      tokenArray.push(doc[i].token_number);
      if(i== doc.length-1){
        gcmserver();
      }
  }
});

function gcmserver(){
var data = {
  "collapseKey":"applice",
  "delayWhileIdle":true,
  'priority':'high',
  'collapse_key':'non-collapsible',
  "data":{
          "offerDescription":"This is an offer on Apple iphone 5s,Hurry up offer is for limited time",
          "offerPosterUri":"http://192.168.0.113:15437/bitmap/shop/shop.jpg",
          "offerContent":"Love is Awesome",
          "offerTitle":"Apple Inc. is an American multinational technology company headquartered in Cupertino ,"
    },
    "notification":{
      'body':"Hello Richie",
      'title':'Yupo'
    },
  "registration_ids":tokenArray
};  
var dataString =  JSON.stringify(data);

var headers = {
  'Host':'android.googleapis.com' ,
  'Authorization' : 'key=AIzaSyDDktt4Gs4qFm8ln7HNLDETpaL_vn_-IzE',
  'Content-Type' : 'application/json',
  'Content-Length' : dataString.length
};

        
var options = {
        host: 'android.googleapis.com',
        port: 443,
        path: '/gcm/send',
        method: 'POST',
        headers: headers
};

var req=http.request(options , function(res){
  res.setEncoding('utf-8');
 
    var data = '';

         

            function respond() {
                var error = null, id = null;

                if (data.indexOf('Error=') === 0) {
                    error = data.substring(6).trim();
                }
                else if (data.indexOf('id=') === 0) {
                    id = data.substring(3).trim();
                }
                else {
                    // No id nor error?
                    error = 'InvalidServerResponse';
                }
                        //console.log("Error:%s And Id:%s And Data:%s",error,id,data);
            }

            res.on('data', function(chunk) {
                data += chunk;
              //  console.log(chunk);
            });
            res.on('end', respond);
            res.on('close', respond);

                console.log('Status:%s',res.statusCode);
              //   console.log('Headers:%s',JSON.stringify(res.headers));
});

req.write(dataString);
req.end();

}
