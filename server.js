var express=require('express');
var parser=require('body-parser');
var mongodb=require('mongodb').MongoClient;
var app =express();
var url="mongodb://localhost:27017/omoyo";
var json=new Array();
var parse=require('url');
var mongoose=require('mongoose');
mongoose.connect('mongodb://localhost:27017/omoyo');
var jsonparser=parser.json();
app.use(jsonparser);
app.use(parser.urlencoded({extended:true}));

var Schema=mongoose.Schema;

//Shop
var shop=new Schema({
	shop_id:Number,shop_name:String,shop_status:Boolean,shop_mobile_number:Number,shop_address:String,location_id:Number,shop_description:String,
	shop_item:[{item:String}],shop_rate:Number,shop_bitmap_url:String,category_id:Number,sub_category_id:Number,date:Date
});

var Shop=mongoose.model("Shop",shop);

//SubShop
var subcategory=new Schema({
	category_id:Number,sub_category_id:Number,sub_category_name:String,sub_category_bitmap_url:String,sub_category_symbol:String,sub_category_item:[{item:String}],date:Date
});

var SubCategory=mongoose.model("SubCategory",subcategory);

//subshopcount
var subcategorycount=new Schema({
sub_category_id:Number,count:Number,date:Date
});

var SubCategoryShopCount=mongoose.model("SubCategoryShopCount",subcategorycount);

//location
var location=new Schema({
  location_name:String,location_id:Number,city_id:Number,area_id:Number,date:Date
});

var Location=mongoose.model("Location",location);

//Category
var category=new Schema({
category_id:Number,category_name:String,category_bitmap_url:String,category_symbol:String,category_item:[{item:String}],sub_category_shop:Boolean,date:Date
});

var Category = mongoose.model("Category",category); 

//ShopCount
var shopcount=new Schema({
	category_id:Number,count:Number,date:Date
});

var CategoryShopCount=mongoose.model("CategoryShopCount",shopcount);


//City
var city=new  Schema({
	city_name:String,
	city_id:Number,
	date:Date
});

var City=mongoose.model('City',city);



// Area
var area= new  Schema({
	city_id:Number,
	area_id:Number,
	area_name:String,
	date:Date
});

var Area=mongoose.model('Area',area);

//Ads

var ads=new Schema({
	ads_id:Number,location_id:Number,shop_id:Number,category_id:Number,description:String,time_in:Date,tme_out:Date,ads_status:Boolean,item:[{item:String}],date:Date
});

var Ads=mongoose.model("Ads",ads);

//incrementcounteroftheapp
var inccount=new Schema({
	collection_name:String,counter:Number
});

var IncCounter=mongoose.model("IncCounter",inccount);

var k= function(collectionType){
	IncCounter.update({collection_name:collectionType},{$inc:{counter:1}},{multi:false},function(error,c){
		if(c.nModified==1)
		IncCounter.findOne({collection_name:collectionType},function(error,collection){
			console.log(collection.counter);
			return collection.counter;
		});
		if(c.nModified==0)
		{
			var data=new IncCounter({collection_name:collectionType,counter:1007});
			data.save(function(error,co){
				if(error)return console.log(error);
				console.log("Collection %s saved",collectionType);
			});
		}
	});
};

var count=k("shop");
count=k("category");
count=k("subcategory");
count=k("subcategoryshopcount");
count=k("location");
count=k("categoryshopcount");
count=k("city");
count=k("area");
count=k("ads")


app.get('/getcity/',function(req,res){
console.log("Hello City");
City.find().select({city:1,_id:0}).sort({city:1}).exec(function(error,data){
	res.json(data);
	console.log(data);
});
});



app.post("/getarea/",function(req,res){
	Area.find({city:req.body.city}).select({area:1,_id:0}).exec(function(error,data){
	res.json(data);
	console.log(data);
	});
});



app.listen(15437,function(){
	console.log("Server Created .....");
});