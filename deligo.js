var express=require('express');
var http=require('https');
var parser=require('body-parser');
var mongodb=require('mongodb').MongoClient;
var multer  = require('multer')
var fs =require('fs')
var gcloud = require('gcloud');
var Jimp = require("jimp");
var app =express();
var parse=require('url');
var mongoose=require('mongoose');
mongoose.connect('mongodb://localhost:27017/deligo');
app.use(parser.json({limit: '50mb'}));
app.use(parser.urlencoded({limit: '50mb',extended:true}));
var Schema=mongoose.Schema;

//Current Date;
function currentDate(){
	var date=new Date();
	return date.getDate()+":"+date.getMonth()+":"+date.getFullYear()+":"+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
}

//ParentCollection
var parentcollection = new Schema({collection_name:String , count: Number ,  date:String }) ;
var ParentCollection = mongoose.model("parentcollection",parentcollection);

//Category
var category = new Schema({category_id:Number,category_name:String,category_bitmap_url:String,category_symbol:String,date:String,category_item:[{item_name:String}]});
var Category = mongoose.model("category",category);

//City
var city = new Schema({city_id:Number,city_name:Number,date:String});
var City = mongoose.model("city",city);

//Area
var area = new Schema({area_id:Number,city_id:Number,area_name:String,date:String});
var Area = mongoose.model("area",area);

//Location
var location = new Schema({location_id:Number,city_id:Number,area_id:Number,location_name:String,date:String});
var Location = mongoose.model("location",location);

//GcmToken
var gcmtoken = new Schema({gcm_token_id:Number,gcm_token_number:String,date:String});
var GcmToken = mongoose.model("gcmtoken",gcmtoken);

//Ads
var ads = new Schema({ads_id:Number,location_id:Number,shop_id:Number,category_id:Number,ads_description:String,ads_in_time:String , ads_out_time:String ,shop_name:String,
ads_status:Boolean,ads_bitmap_url:String , ads_item:[{item_name:String,item_offer:String,item_price:String}] ,date:String
});
var Ads = mongoose.model("ads",ads);

//shop
var shop = new Schema({shop_id:Number, category_id:Number , location_id:Number , shop_name :String ,shop_timing:String , shop_status:Boolean , 
shop_contact_number:[{contact_number:String}], shop_address:String , shop_description:String ,
 shop_bitmap_gallery :[{url:String}],shop_item:[{item_name:String}],date:String
});
var Shop = mongoose.model("shop",shop);

//Faq
var faq = new Schema({faq_id:Number,faq_question:String,faq_answer :String , date:String});
var Faq = mongoose.model("faq",faq);

//Product
var product = new Schema({product_id:Number,location_id:Number,shop_id:Number,category_id:Number,product_name:String,product_offer:String,
product_description:String,product_bitmap_url:String,product_price:String,date:String
});
var Product = mongoose.model("product",product);

//SearchQuery
var searchquery = new Schema({query_id:Number,query_name:String,type_of:String,type_id:Number,type_keyword:[{keyword:String}],date:String});
var SearchQuery = mongoose.model("searchquery",searchquery);

//UserQuery
var userquery = new Schema({query_id:Number,user_id:Number,user_query:String,query_timing:String,date:String});
var UserQuery = mongoose.model("userquery",userquery);

//GpsPosition
var gpsposition = new Schema({gps_position_id:Number,location_id:Number,shop_id:Number,latitude:Number,longitude:Number,date:String});
var GpsPosition = mongoose.model("gpsposition",gpsposition);


//collection_insertion function 
function collectionInsertion(){
    var collection_name ="gpsposition"

ParentCollection.update({collection_name:collection_name},{$inc:{count:1}},{multi:false},function(error,c){

 if(c.nModified==0)
		{
			var data=new ParentCollection({collection_name:collection_name,count:1007});
			data.save(function(error,co){
				if(error)return console.log(error);
				console.log("Collection %s saved",collection_name);
			});
	
		}
	});
}    

///
Jimp.read("./un.jpg", function (err, lenna) {
    if (err) return console.log("ERROR %s",err)
    var width = lenna.bitmap.width
     var height = lenna.bitmap.height
    lenna.resize(width/2,height/2)            // resize 
         .quality(40)   
                .cover(width/2,height/2)      // set JPEG quality 
           .brightness(0.0)       // set greyscale 
         .write("doo.jpg"); // save 
});


//Category Insertion
function categoryInsertion(req,res){
    var cate
}


//Server Creation For Admin
app.listen(15477,function(){
	console.log("Server Created .....");
});