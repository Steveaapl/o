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
var globalCounter=0,subcount=0,ref=1,ref2=1;
var flag=true,flag1=true,flag2=true,flag3=true;
var urlBase="http://192.168.0.109/bitmap/ads/"
var Schema=mongoose.Schema;
//require('./gcm.js')
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


//subshopcount
var subcategoryshopcount=new Schema({
subcategoryshopcount_id:Number,subcategory_id:Number,count:Number,date:String
});

var SubCategoryShopCount=mongoose.model("SubCategoryShopCount",subcategoryshopcount);


var inccount=new Schema({
	collection_name:String,counter:Number
});

var IncCounter=mongoose.model("IncCounter",inccount);


//Shop 
var shop=new Schema({
	shop_id:Number,shop_name:String,shop_timing:String,shop_status:Boolean,shop_mobile_number:Number,shop_address:String,location_id:Number,shop_description:String,
	shop_item:[{item:String}],shop_rate:Number,shop_bitmap_url:String,category_id:Number,sub_category_id:Number,date:String
});

var Shop=mongoose.model("Shop",shop);



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
	ads_id:Number,location_id:Number,shop_id:Number,category_id:Number,sub_category_id:Number,ads_description:String,
	ads_item:[{item:String}],ads_status:Boolean,ads_bitmap_url:String,
	ads_time_in:String,ads_time_out:String,date:String
});

var Ads=mongoose.model("Ads",ads);


//Registration_id
var gcmtoken=new Schema({
	token_id:Number,token_number:String,location_id:Number,date:String
});

var GcmToken=mongoose.model("GcmToken",gcmtoken);

var kk=function(){
	tokenInsert("gcmtoken",GcmToken);
};
//kk();


//incrementcounteroftheapp

function tokenInsert(collectionName,Object,location_id,token_number){
	IncCounter.update({collection_name:collectionName},{$inc:{counter:1}},{multi:false},function(error,c){
		if(c.nModified==1){
			IncCounter.findOne({collection_name:collectionName},function(error,collection){
				tokenTemp(Object,collection.counter,location_id,token_number);
			});
		}
		
	});
}

function tokenTemp(Object,token_id,location_id,token_number){

	var data=new Object({token_id:token_id,token_number:token_number,location_id:location_id,date:currentDate()
	});
         Object.count({token_number:token_number},function(error,count){
		if(error)return console.log(error);
	if(count == 0)
	{
		data.save(function(error,data){
			if(error)return console.log(error);
			console.log("saved");
			
		});
	}
	else{
		console.log("Already present");
	}
	});
	
	
}

app.post('/gcmtoken/',function(req,res){
	
	var location_id=req.body.location_id;
	var token_number=req.body.token_number;
	tokenInsert('gcmtoken',GcmToken,location_id,token_number);
	
});



function counterOfTheAppForSub(collectionType , Object ){

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
				tempForSub(Object,collarray[globalCounter].category_id,collection.counter,"sub_name"+subcount,urlBase+"sub.jpg","Su",[{item:'1'}]);
				
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


function counterOfTheApp(collectionType , Object ){

				  IncCounter.update({collection_name:collectionType},{$inc:{counter:1}},{multi:false},function(error,c){
		if(c.nModified==1)
		{
		IncCounter.findOne({collection_name:collectionType},function(error,collection){
			
			
	Category.find({},function(error,doc){
		flag3=false;
		if(doc[globalCounter].sub_category){
			SubCategory.find({category_id:doc[globalCounter].category_id},function(error,docc){
				SubCategoryShopCount.findOne({subcategory_id:docc[subcount].sub_category_id},function(e,da){
					temp(Object,collection.counter,"Apple","10 Am to 9PM Monday-Saturday Sunday Close",true,9935018328,"126 park vanue hall road",1009,"Apple need really description",[{item:"iphone"}],
					2,urlBase+"shop.jpg",doc[globalCounter].category_id,docc[subcount].sub_category_id);
					if(ref == da.count)
					{
						flag1=false;
					//	console.log(docc.length);
						if(subcount == docc.length-1 )
			{
				flag=false;
				//console.log("1");
			}
					}
				});
			
			});
			if(globalCounter == doc.length-1){
				flag2=false;
				console.log("2");
			}
		}
		else{
			CategoryShopCount.findOne({category_id:doc[globalCounter].category_id},function(eo,dd){
				
temp(Object,collection.counter,"Apple","10 Am to 9PM Monday-Saturday Sunday Close",true,9935018328,"126 park vanue hall road",1009,"Apple need really description",[{item:"iphone"}],
2,urlBase+"shop.jpg",doc[globalCounter].category_id,0);
				
				flag3=true;
			//	console.log("Ho!!!");
				
			    flag1=false;
				flag=false;
				if(ref2 == dd.count){
				flag3=false;
				console.log("false");
				if(globalCounter == doc.length-1){
				flag2=false;
				console.log("2");
			}
			}				
		
			});
		}
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
function temp(Object,shop_id,shop_name,shop_timing,shop_status,shop_mobile_number,shop_address,location_id,shop_description,shop_item,shop_rate,shop_bitmap_url,category_id,sub_category_id){
	var data=new Object({shop_id:shop_id,shop_name:shop_name,shop_timing:shop_timing,shop_status:shop_status,shop_mobile_number:shop_mobile_number,shop_address:shop_address,location_id:location_id
	,shop_description:shop_description,shop_item:shop_item,shop_rate:shop_rate,shop_bitmap_url:shop_bitmap_url,category_id:category_id,sub_category_id:sub_category_id,date:currentDate()
	});
	//console.log("DATA %s",data);
         Object.count({shop_id:shop_id},function(error,count){
		if(error)return console.log(error);
	if(count == 0)
	{
		data.save(function(error,data){
			if(error)return console.log(error);
			//console.log("saved");
			if(flag1){
				kk();
				ref++;
			}
			else{
				ref=1;
				flag1=true;
				if(flag)
				{
					kk();
					subcount++;
				}
				else{
					subcount=0;
					flag=true;
					if(flag2){
						if(flag3){
							kk();
							ref2++;
						}
						else{
							ref2=1;
							globalCounter++;
					kk();	
						}
					}
					else{
						
					}
				}
			}
		});
	}
	});
}
function tempForSub(Object,category_id,sub_category_id,sub_category_name,sub_category_bitmap_url,sub_category_symbol,sub_category_item){
	var data=new Object({category_id:category_id,sub_category_id:sub_category_id,sub_category_name:sub_category_name,sub_category_bitmap_url:sub_category_bitmap_url
	,sub_category_symbol:sub_category_symbol,sub_category_item:sub_category_item,date:currentDate()
	});
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

//Get for city name // first hit shot
app.get('/getcity/',function(req,res){
City.find({}).select({city_name:1,_id:0,city_id:1,date:1}).sort({city_name:1}).exec(function(error,data){
	res.json(data);
	//console.log(data);
});
});

//Post for area name // second hit shot
app.post("/getarea/",function(req,res){
	Area.find({city_id:(Number)(req.body.city_id)}).select({_id:0}).exec(function(error,data){
	res.json(data);
	//console.log(data);
	});
});



//Post for laction id // third hit shot
app.post("/location/",function(req,res){
	var city_id=(Number)(req.body.city_id);
	var area_id=(Number)(req.body.area_id);
	
	Location.findOne({city_id:city_id,area_id:area_id}).select({_id:0}).exec(function(error,data){
		res.json(data);
		//console.log(data);
	});
	
});

app.get("/category/",function(req,res){
	Category.find({},function(error,data){
		res.json(data);
		//console.log(data);
	});
});

//request for category images
app.get('/bitmap/category/category.jpg',function(req,res,next){
	var options={root:__dirname+'/bitmap/category/',
		dotfiles:'allow',
		headers:{
			'x-timestamp':Date.now(),
			'x-sent':true
		}
		};
		res.sendFile('category.jpg',options,function(error){
			if(error)
			{
				console.log('Error occured in downloading index.js file due to:'+error);
			}
			else{
				console.log("File delivered....");
			}
		});
		
});

//request for category shop count
app.post("/categoryshopcount/",function(req,res){
	CategoryShopCount.findOne({category_id:(Number)(req.body.category_id)},function(error,doc){
		res.json(doc);
		//console.log(doc);
	});
});

//request for ads 
app.post("/ads/",function(req,res){
	Ads.find({},function(error,doc){
		res.json(doc);
		//console.log(doc);
	});
});

//request for ads bitmap
app.get('/bitmap/ads/ads.jpg',function(req,res,next){
	var options={root:__dirname+'/bitmap/ads/',
		dotfiles:'allow',
		headers:{
			'x-timestamp':Date.now(),
			'x-sent':true
		}
		};
		res.sendFile('ads.jpg',options,function(error){
			if(error)
			{
				console.log('Error occured in downloading index.js file due to:'+error);
			}
			else{
				console.log("File delivered....");
			}
		});
		
});

//reqquest for shop
app.post("/shop/",function(req,res){
	Shop.find({shop_id:(Number)(req.body.shop_id)},function(error,data){
		res.json(data);
		//console.log("Shop json : %s",data);
	});
});

//request for shop image
app.get('/bitmap/shop/shop.jpg',function(req,res,next){
	var options={root:__dirname+'/bitmap/shop/',
		dotfiles:'allow',
		headers:{
			'x-timestamp':Date.now(),
			'x-sent':true
		}
		};
		res.sendFile('shop.jpg',options,function(error){
			if(error)
			{
				console.log('Error occured in downloading index.js file due to:'+error);
			}
			else{
				console.log("File delivered....");
			}
		});
		
});
//request foe subcategory
app.post('/subcategory/',function(req,res){
	SubCategory.find({category_id:(Number)(req.body.category_id)},function(error,doc){
		res.json(doc);
	});
});

//request for suncategoryshopcount
app.post('/subcategoryshopcount/',function(req,res){
	SubCategoryShopCount.findOne({subcategory_id:(Number)(req.body.subcategory_id)},function(error,doc){
		res.json(doc);
		//console.log(doc);
	});
});

//request for shoplist
app.post('/shoplist/',function(req,res){
	Shop.find({category_id:(Number)(req.body.category_id)},function(error,doc){
		res.json(doc);
		//console.log(doc);
	});
});

//request for shop list by sub category
app.post('/subshoplist',function(req,res){
	Shop.find({sub_category_id:(Number)(req.body.sub_category_id)},function(error,doc){
		res.json(doc);
		//console.log(doc);
	});
});

app.listen(15437,function(){
	console.log("Server Created .....");
});