var express=require('express');
var parser=require('body-parser');
var mongodb=require('mongodb').MongoClient;
var app =express();
var url="mongodb://localhost:27017/omoyo";
var json =new Array();
var parse=require('url');
var mongoose=require('mongoose');
mongoose.connect('mongodb://localhost:27017/omoyo');
var jsonparser=parser.json();
app.use(jsonparser);
app.use(parser.urlencoded({extended:true}));
var globalCounter=0,subcount=1,ref=0;;
var flag=true;
var urlBase="http://192.168.0.109/bitmap/subcategorybitmap/"
var Schema=mongoose.Schema;


var shop=new Schema({
	shop_id:Number,shop_name:String,shop_status:Boolean,shop_mobile_number:Number,shop_address:String,location_id:Number,shop_description:String,
	shop_item:[{item:String}],shop_rate:Number,shop_bitmap_url:String,category_id:Number,sub_category_id:Number,date:Date
});

var Shop=mongoose.model("Shop",shop);

//Category  //Done
var category=new Schema({
category_id:Number,category_name:String,category_bitmap_url:String,category_symbol:String,category_item:[{item:String}],sub_category:Boolean,date:String
});

var Category = mongoose.model("Category",category); 


//ShopCount
var categoryshopcount=new Schema({
	categoryshopcount_id:Number,category_id:Number,count:Number,date:String
});

var CategoryShopCount=mongoose.model("CategoryShopCount",categoryshopcount);

//SubShop
var subcategory=new Schema({
	category_id:Number,sub_category_id:Number,sub_category_name:String,sub_category_bitmap_url:String,sub_category_symbol:String,sub_category_item:[{item:String}],date:String
});

var SubCategory=mongoose.model("SubCategory",subcategory);


var kk=function(){
	counterOfTheApp("subcategory",SubCategory);
};
kk();


//subshopcount
var subcategoryshopcount=new Schema({
sub_category_id:Number,count:Number,date:Date
});

var SubCategoryShopCount=mongoose.model("SubCategoryShopCount",subcategoryshopcount);





//location // done 
var location=new Schema({
  location_name:String,location_id:Number,city_id:Number,area_id:Number,date:String
});

var Location=mongoose.model("Location",location);

// Area  //done
var area= new  Schema({
	city_id:Number,
	area_id:Number,
	area_name:String,
	date:String
});

var Area=mongoose.model('Area',area);

var inccount=new Schema({
	collection_name:String,counter:Number
});

var IncCounter=mongoose.model("IncCounter",inccount);

//Category //done







//City  // Done
var city=new  Schema({
	city_name:String,
	city_id:Number,
	date:String
});

var City=mongoose.model('City',city);






//Ads

var ads=new Schema({
	ads_id:Number,location_id:Number,shop_id:Number,category_id:Number,description:String,time_in:Date,tme_out:Date,ads_status:Boolean,item:[{item:String}],date:Date
});

var Ads=mongoose.model("Ads",ads);




//incrementcounteroftheapp





function counterOfTheApp(collectionType , Object ){

	Category.find({},function(error,collarray){
				if(collarray[globalCounter].sub_category)
			{
				ref=collarray.length;
				
				  IncCounter.update({collection_name:collectionType},{$inc:{counter:1}},{multi:false},function(error,c){
		if(c.nModified==1)
		{
		IncCounter.findOne({collection_name:collectionType},function(error,collection){
			CategoryShopCount.findOne({category_id:collarray[globalCounter].category_id},function(err,doc){
				if(subcount == doc.count)
				{
					flag=false;
				}
				temp(Object,collarray[globalCounter].category_id,collection.counter,"sub_name"+subcount,urlBase+"sub.jpg","Su",[{item:'1'}]);
				
			});
			
		});
		}
		if(c.nModified==0)
		{
			var data=new IncCounter({collection_name:collectionType,counter:1007});
			data.save(function(error,co){
				if(error)return console.log(error);
				//console.log("Collection %s saved",collectionType);
			   //
			});
	
		}
		
	});
			}
			else{
				if( globalCounter<ref-1)
			{
				console.log("Glob false %s",globalCounter);
					kk();
					globalCounter++;
			}
			}
			});
	
	
	
};





function temp(Object,category_id,sub_category_id,sub_category_name,sub_category_bitmap_url,sub_category_symbol,sub_category_item){
	var data=new Object({category_id:category_id,sub_category_id:sub_category_id,sub_category_name:sub_category_name,sub_category_bitmap_url:sub_category_bitmap_url
	,sub_category_symbol:sub_category_symbol,sub_category_item:sub_category_item,date:currentDate()
	});
	//console.log("DATA %s",data);
         Object.count({sub_category_id:sub_category_id},function(error,count){
		if(error)return console.log(error);
	if(count == 0)
	{
		data.save(function(error,data){
			if(error)return console.log(error);
			if(flag)
			{
					kk();
					subcount++;
					console.log("Saved");
			}
			else{
				subcount=1;
				if( globalCounter <ref-1){
					 kk();
					globalCounter++;
					flag=true;	
				console.log("Glog %s , %s",ref-1,globalCounter);
				}
				else{
					console.log(ref-1);
				}
			}
		});
	}
	});
}

function currentDate(){
	var date=new Date();
	return date.getDate()+":"+date.getUTCMonth()+":"+date.getUTCFullYear()+":"+date.getUTCHours()+":"+date.getUTCMinutes()+":"+date.getUTCSeconds();
}


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