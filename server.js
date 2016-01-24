var express=require('express');
var http=require('https');
var parser=require('body-parser');
var mongodb=require('mongodb').MongoClient;
var multer  = require('multer')
var fs =require('fs')
var gcloud = require('gcloud');
var app =express();
var url="mongodb://localhost:27017/omoyo";
var json =new Array();
var parse=require('url');
var mongoose=require('mongoose');
mongoose.connect('mongodb://localhost:27017/omoyo');
app.use(parser.json({limit: '50mb'}));
app.use(parser.urlencoded({limit: '50mb',extended:true}));
var globalCounter=0,subcount=0,ref=1,ref2=1;
var flag=true,flag1=true,flag2=true,flag3=true;
var urlBase="http://192.168.0.109/bitmap/ads/"
var Schema=mongoose.Schema;
var global1=0,global2=0,global3=0;
var flagForConnection=false;
var userdataflag = false;
var userObjectStore = new Array();
var user ;
var UserInfoCollection ;
var collecton_name ;

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



var product=new Schema({
	product_id:Number,product_name:String,product_shop_id:Number,product_price:String,product_description:String,product_bitmap_url:String,
	product_offer:String,date:String
});

var Product = mongoose.model("Product",product);

var searchquery=new Schema({query_id:Number,query_name:String,type_of:String,type_id:Number,type_keyword:[{keyword:String}],date:String});

var SearchQuery= mongoose.model("SearchQuery",searchquery);


var faq = new Schema({faq_id:Number,faq_question:String,faq_answer:String,date:String});

var Faq = mongoose.model("Faq",faq);


var coordinateOfShop = new Schema({coordinate_id:Number,location_id:Number,shop_id:Number,shop_longitude:String,shop_latitude:String});

var CoordinateOfShop = mongoose.model("coordinateofshop",coordinateOfShop);



var kk=function(){
	faqInsert("faq",Faq);
};
//kk();

var user_query = new Schema({query_id:Number,user_id:Number,user_query:String,date:String});

var User_Query = mongoose.model('User_Query',user_query);

app.post('/userSubmitingQuery/',function(req,res){
   var user_id = req.body.user_id;
   var user_query = req.body.user_query;
   var collectionName = 'user_query';
    IncCounter.update({collection_name:collectionName},{$inc:{counter:1}},{multi:false},function(error,c){

if(c.nModified==1){
	IncCounter.findOne({collection_name:collectionName},function(error,dbb){
		 var data = new User_Query({query_id:dbb.counter,user_id:(Number)(user_id),user_query:user_query
    ,date:currentDate()});
    data.save(function(error,doc){
       if(error){
           console.log("Error %s",error);
           return;
       } 
       else{
           console.log("Done inserting 1");
           res.send("O.K");
       }
    });
	});
}
	});
});


function faqInsert(collectionName,Object){
    
    IncCounter.update({collection_name:collectionName},{$inc:{counter:1}},{multi:false},function(error,c){

if(c.nModified==1){
	IncCounter.findOne({collection_name:collectionName},function(error,dbb){
		faqTemp(Object,dbb.counter);
	});
}
 if(c.nModified==0)
		{
			var data=new IncCounter({collection_name:collectionName,counter:1007});
			data.save(function(error,co){
				if(error)return console.log(error);
				console.log("Collection %s saved",collectionName);
			   //
			});
	
		}
	});
    
    
   
}

function faqTemp(Object , faq_id){
    var data = new Object({faq_id:faq_id,faq_question:"Who we can use the app ?",
    faq_answer:"Just click the app and Ya after intalling it from Google play store"
    ,date:currentDate()});
    data.save(function(error,doc){
       if(error){
           console.log("Error %s",error);
           return;
       } 
       else{
           console.log("Done inserting 1");
       }
    });
}

//incrementcounteroftheapp

function queryInsert(collectionName,Object){
	IncCounter.update({collection_name:collectionName},{$inc:{counter:1}},{multi:false},function(error,c){

if(c.nModified==1){
	IncCounter.findOne({collection_name:collectionName},function(error,dbb){
		queryTemp(Object,dbb.counter);
	});
}

	});
}

function queryTemp(Object,query_id){
    
    var keyword =[{keyword:'milk'},{keyword:'strong'}]

var data = new Object({
	query_id:query_id,query_name:'milk',type_of:'product',type_id:query_id,type_keyword:keyword,date:currentDate()
});

Object.count({query_id:query_id},function(error,count){
   if(error) return console.log(error)
   if(count==0){
       data.save(function(error,da){
          if(error)return console.log(error);
          console.log("Query Inserted"); 
       });
   } 
});

}

function productInsert(collectionName,Object){
	IncCounter.update({collection_name:collectionName},{$inc:{counter:1}},{multi:false},function(error,c){

if(c.nModified==1){
	IncCounter.findOne({collection_name:collectionName},function(error,dbb){
		productTemp(Object,dbb.counter);
	});
}

	});
}

function productTemp(Object,product_id){
    

var data = new Object({
	product_id:product_id,product_name:"smartphone",product_shop_id:product_id,product_price:"5015",product_description:"Awesome android OS",product_bitmap_url:"null"
    ,product_offer:"No offer",date:currentDate()
});

Object.count({product_id:product_id},function(error,count){
   if(error) return console.log(error)
   if(count==0){
       data.save(function(error,da){
          if(error)return console.log(error);
          console.log("Product Inserted"); 
       });
   } 
});

}


//Registration_id
var gcmtoken=new Schema({
	token_id:Number,token_number:String,date:String
});

var GcmToken=mongoose.model("GcmToken",gcmtoken);

app.post('/gcmtoken/',function(req,res){
	var token_number=req.body.token_number;
    res.end("DONE");
    console.log("DONE");
	tokenInsert('gcmtoken',GcmToken,token_number);
});



function tokenInsert(collectionName,Object,token_number){
       Object.find({token_number:token_number},function(error,dock){
		if(error)return console.log(error);
	if(dock.length == 0)
	{
        IncCounter.update({collection_name:collectionName},{$inc:{counter:1}},{multi:false},function(error,c){
		if(c.nModified==1){
			IncCounter.findOne({collection_name:collectionName},function(error,collection){
                var data=new Object({token_id:collection.counter,token_number:token_number,date:currentDate()
	});
		data.save(function(error,data){
			if(error)return console.log(error);
            var json = {type_of:1,data:{token_id:collection.counter}};
            gcmForUserId(json,token_number);
            console.log("Sended and Saved");
		});
			});
		}
	});
    
	}
	else{
	     var json = {type_of:1,data:{token_id:dock[0].token_id}};
            gcmForUserId(json,token_number);
            console.log("Re Sended");
	}
	});
    
    
}

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

//requist for search 
app.post('/searchquery/',function(req,res){
    var query=req.body.query.trim();
    var dataArray=new Array();
    allSearch(query);
    function allSearch(searchquery){
        SearchQuery.find({},function(error,doc){
            if(error)return console.log("Error %s " ,error);
            
            if(global1<doc.length){
                if(global2 < doc[global1].type_keyword.length){
                    if(searchquery == doc[global1].type_keyword[global2].keyword){
                        if(doc[global1].type_of=="product"){
                            Product.findOne({product_id:doc[global1].type_id},function(errp,docc){
                                if(errp)return console.log("Error %s",errp);
                                dataArray.push(docc);
                             //   console.log("DATA1");
                            });
                        }
                        else{
                            Shop.findOne({shop_id:doc[global1].type_id},function(errs,doccc){
                               if(errs)return console.log("Error %s",errs);
                               dataArray.push(doccc); 
                              // console.log("DATA2");
                            });
                        }
                        global2=doc[global1].type_keyword.length;
                    }
                    global2++;
                    if(global2 < doc[global1].type_keyword.length){
                       allSearch(searchquery);
                    }
                    else{
                        global2=0;
                        global1++;
                        allSearch(searchquery);
                    }
                    
                }
               
            }
            else{
                if(flagForConnection || dataArray.length == 0)
                {
                    global1=0;
                    global2=0;
                   
                   if(query.indexOf(" ") != -1){
                       var queryArray = query.split(" ");
                       if(global3<queryArray.length){
                       	   if(global3 == queryArray.length-1)
                       	   	flagForConnection=false;
                       	   else
                       	   	flagForConnection=true;
                           allSearch(queryArray[global3]);
                           global3++;
                           console.log(global3);
                       }
                       else{
                           flagForConnection = false;
                           res.send("No data");
                           global3=0;
                       }
                   }
                   
                    //allSearch();
                }
                else{
                    global1=0;
                    global2=0;
                    res.json(dataArray);
                    global3=0;
                    console.log(dataArray);
                }
                
            }
        })
    }
});

app.post('/locationthroughgps/',function(req,res){


var locationOfUser = req.body.location;

console.log(locationOfUser);

Area.find({},function(error,doc){

for(var i=0;i<doc.length;i++){

var str = locationOfUser.toLowerCase();

var area = doc[i].area_name.toLowerCase().trim();

var result = str.search(area);

if(result != -1){
    var json = {city_id:doc[i].city_id,area_id:doc[i].area_id,location:locationOfUser,success:1};
    res.json(json);
    return ;
}
else{
    if(i == doc.length-1){
        var jsonp = {location:locationOfUser,success:0};
        res.json(jsonp);
        console.log("No data");
    }
}

}

});
1
});

//requestforuserNameDataEntry
app.post('/userNameDataEntry/',function(req,res){
   var user_id = req.body.user_id;
   var user_name = req.body.user_name;
   var user_email= req.body.user_email;
   console.log("%s%s%s",user_id,user_email,user_name);
   
   res.send("Hello");
   
   //username
     
       if(userdataflag){
     
              
                   user = userObjectStore[0].user;
                   UserInfoCollection = userObjectStore[0].userinfocollection;   
                   console.log("Hipo");    
               
           
       }
       else{
          user = new Schema({
            data:String,type_of:String
       });
        collecton_name = "User"+user_id ;
       UserInfoCollection  = mongoose.model(collecton_name,user);       
       var dd={user:user,userinfocollection:UserInfoCollection};
       userObjectStore.push(dd);
       userdataflag=true;
       }   
   
     UserInfoCollection.findOne({type_of:'user_name'},function(er,doc){
     if(doc == null){
       UserInfoCollection.update({type_of:'user_name'},{data:user_name},{multi:true},function(error,c){
       if(error)return console.log("Error::%s",error);
      if(c.nModified==0){
          var data = new UserInfoCollection({data:user_name,type_of:'user_name'});
          data.save(function(err){
             if(err)return console.log("Error:%s",err);
             console.log("Saved User Name"); 
          });
      }
      else{
          console.log("Updated:%s User Name",c.nModified);
      }
   });
     }
     else{
         if(doc.data == user_name)
         {
             console.log("Same Name");
         }
         else{
          UserInfoCollection.update({type_of:'user_name'},{data:user_name},{multi:true},function(error,c){
       if(error)return console.log("Error::%s",error);
      if(c.nModified==0){
          var data = new UserInfoCollection({data:user_name,type_of:'user_name'});
          data.save(function(err){
             if(err)return console.log("Error:%s",err);
             console.log("Saved User Name"); 
          });
      }
      else{
          console.log("Updated:%s User Name",c.nModified);
      }
   });
         }
     }
     
       
   });
   
   
if(user_email.length > 4 )
{
    
     //useremail
      if(userdataflag){
     
              
                   user = userObjectStore[0].user;
                   UserInfoCollection = userObjectStore[0].userinfocollection;   
                   console.log("Hipo");    
               
           
       }
       else{
          user = new Schema({
            data:String,type_of:String
       });
       collecton_name = "User"+user_id ;
       UserInfoCollection  = mongoose.model(collecton_name,user);       
       var ddd={user:user,userinfocollection:UserInfoCollection};
       userObjectStore.push(ddd);
       userdataflag=true;
       }
   UserInfoCollection.findOne({type_of:'user_email'},function(er,doc){
       
     if(doc == null){
          UserInfoCollection.update({type_of:'user_email'},{data:user_email},{multi:true},function(error,c){
       if(error)return console.log("Error::%s",error);
      if(c.nModified == 0){
          var data = new UserInfoCollection({data:user_email,type_of:'user_email'});
          data.save(function(err){
             if(err)return console.log("Error:%s",err);
             console.log("Saved User Email"); 
          });
      }
      else{
          console.log("Updated:%s User Email",c.nModified);
      }
   });
     }
     else{
         if(doc.data == user_email){
             console.log("Same Email");
         }
         else{
              UserInfoCollection.update({type_of:'user_email'},{data:user_email},{multi:true},function(error,c){
       if(error)return console.log("Error::%s",error);
      if(c.nModified == 0){
          var data = new UserInfoCollection({data:user_email,type_of:'user_email'});
          data.save(function(err){
             if(err)return console.log("Error:%s",err);
             console.log("Saved User Email"); 
          });
      }
      else{
          console.log("Updated:%s User Email",c.nModified);
      }
   });
         }
     }
     
       
   });
  

}

GcmToken.findOne({token_id:user_id},function(error,doc){
   
    var json = {type_of:2,data:{user_email:user_email,user_name:user_name}};
            gcmForUserId(json,doc.token_number);
    
});


   
   
});

//reqforprofilepic
app.post('/userProfilePicDataEntry/',function(req,res){
   var binary64Encoded = req.body.user_profile_pic_binary64encoded;
   var user_id = req.body.user_id;
    if(userdataflag){
     
              
                   user = userObjectStore[0].user;
                   UserInfoCollection = userObjectStore[0].userinfocollection;   
                   console.log("Hipo");    
               
           
       }
       else{
          user = new Schema({
            data:String,type_of:String
       });
       collecton_name = "User"+user_id ;
       UserInfoCollection  = mongoose.model(collecton_name,user);       
       var ddd={user:user,userinfocollection:UserInfoCollection};
       userObjectStore.push(ddd);
       userdataflag=true;
       }
       
       UserInfoCollection.update({type_of:'user_profile_pic'},{data:binary64Encoded},{multi:false},function(error,c){
           if(c.nModified == 0){
               var data = new UserInfoCollection({data:binary64Encoded,type_of:'user_profile_pic'});
               data.save(function(err,doc){
                   console.log("Profile Pic Saved !")
                   res.send("O.K");
               });
           }
           else{
               console.log("Profile Pic Updated!");
               res.send("O.K");
           }
       })
       
       
});


app.post('/userMobileNumberDataEntry/',function(req,res){
   
   var user_id =req.body.user_id;
   var user_mobile_number=req.body.user_mobile_number;
   res.send("O.K");
    if(userdataflag){
     
              
                   user = userObjectStore[0].user;
                   UserInfoCollection = userObjectStore[0].userinfocollection;   
                   console.log("Hipo");    
               
           
       }
       else{
          user = new Schema({
            data:String,type_of:String
       });
       collecton_name = "User"+user_id ;
       UserInfoCollection  = mongoose.model(collecton_name,user);       
       var ddd={user:user,userinfocollection:UserInfoCollection};
       userObjectStore.push(ddd);
       userdataflag=true;
       }
   
    UserInfoCollection.findOne({type_of:'user_mobile_number'},function(er,doc){
       
     if(doc == null){
                        
               var data = new UserInfoCollection({data:user_mobile_number,type_of:'user_mobile_number'});
               data.save(function(err,doc){
                   console.log("Mobile Number Saved!")
               });
        
     }
     else{
         if(doc.data == user_mobile_number){
             console.log("Same Mobile Number");
         }
         else{
         UserInfoCollection.update({type_of:'user_mobile_number'},{data:user_mobile_number},{multi:false},function(error,c){
           if(c.nModified == 0){
              
           }
           else{
               console.log("Mobile Number Updated!");
               res.send("O.K");
           }
       })
         }
     }
     
       
   });
   
    
});
//Offer_pic_upload
app.post('/offerDataEntry/', function (req, res) {
    var description_of_offer;
    var offer_code;
    var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname+'/bitmap/')
  },
  filename: function (req, file, cb) {
      description_of_offer = req.body.description_of_offer
      offer_code = req.body.offer_code
    cb(null, req.body.user_id+"#"+req.body.offer_code+file.originalname)
  }
})

var upload = multer({ storage: storage }).single('offerpic');
    
  upload(req, res, function (err) {
    if (err) {
      console.log("ERROR WHILE UPLOADING ... %s",err)
      return
    }
    offerPicUploadToGCS(__dirname+"/bitmap/"+req.body.user_id+"#"+offer_code+req.file.originalname , req.body.user_id , req.body.description_of_offer , req.body.offer_code)
   console.log(req.file.filename);
  //  console.log(req.file.mimetype);
  //  console.log(req.file.fieldname);
  //  console.log(req.file.originalname);
   // console.log(req.file.encoding);
   // console.log(req.file.size);
   // console.log(req.file.destination);
   //// console.log(req.file.path);
  //  console.log(req.file.buffer);
    res.send("O.K");
    console.log("pic uploaded to server");
  })
})


function offerPicUploadToGCS(filename , user_id ,description_of_offer , offer_code){
    var gcs = gcloud.storage({
  projectId: 'omoyo-1168',
  keyFilename: __dirname+'/keyfile.json'
});

var bucket = gcs.bucket('offerpicupload');

bucket.upload(filename, function(err, file) {
  if (err) {
    console.log("Error uploading ! %s",err) ;
     fs.unlink(filename,function(error){
      if(error){
          console.log("Deletion to done due to %s",error);
          return
      } 
      console.log("Done Deletion !");
     //2
      save_offer_description(filename,user_id,description_of_offer,offer_code)
   });
    return
  }
   console.log("File Uploaded To GCS") ;
 
   fs.unlink(filename,function(error){
      if(error){
          console.log("Deletion to done due to %s",error);
          return
      } 
      console.log("Done Deletion !");
     //2
      save_offer_description(filename,user_id,description_of_offer,offer_code)
   });
   
});
}

//2

function save_offer_description(filename,user_id,offer_description,offer_code){
    if(userdataflag){
     
              
                   user = userObjectStore[0].user;
                   UserInfoCollection = userObjectStore[0].userinfocollection;   
                   console.log("Hipo");    
               
           
       }
       else{
          user = new Schema({
            data:String,type_of:String
       });
       collecton_name = "User"+user_id ;
       UserInfoCollection  = mongoose.model(collecton_name,user);       
       var ddd={user:user,userinfocollection:UserInfoCollection};
       userObjectStore.push(ddd);
       userdataflag=true;
       }
       
       var json = {offer_file_url:'https://console.cloud.google.com/m/cloudstorage/b/offerpicupload/o/'+filename,offer_code:offer_code,offer_description:offer_description,date:currentDate}
       var data = new UserInfoCollection({data:JSON.stringify(json),type_of:'offer_upload'});
               data.save(function(err,doc){
                   if(err){
                       console.log("Error in saving %s",err);
                       return
                   }
                   console.log("Offer  Saved!")
               });
       
}

//quick_search
app.post('/quickSearch/',function(req,res){
   var quick_query = req.body.quick_query.trim();
   console.log(quick_query);
   var quick_result = new Array();
   var filter_result = new Array();
   SearchQuery.find({},function(error,doc){
      if(error){
          console.log("Error: %s",error);
          return ;
      }
      for(var i =0 ; i<doc.length ; i++){
          for(var j =0 ;j<doc[i].type_keyword.length;j++){
              var keyword = doc[i].type_keyword[j].keyword ;
         //     console.log(keyword)
              if(keyword.indexOf(quick_query) != -1){
              //  console.log(keyword);
                 if(filter_result.indexOf(keyword.toLowerCase()) == -1){
                     filter_result.push(keyword);
                     console.log(keyword);
                 }
                  
              //    
               //   quick_result.push(json);
                //  console.log(json)
              }
              
          }
          
          
   
          
          if(i==doc.length-1){
              if(filter_result.length>0)
              for(var t = 0 ; t<filter_result.length ; t++){
                  var json ={result:filter_result[t]};
                  quick_result.push(json);
                  if(t == filter_result.length-1){
                  res.json(quick_result);
             //     console.log(quick_result);
                  }
              }   
              else{
                  quick_result.push({result:'No result \n Use other Keyword'});
                  res.json(quick_result);
                //  console.log(quick_result);
              }    
          }
          
      }
   });
});


//cooordinate
app.post("/coordinateOfShop/",function(req,res){
    var location_id = req.body.location_id;
    CoordinateOfShop.find({location_id:location_id},{_id:0,coordinate_id:0},function(err,doc){
       res.json(doc); 
    });
});



//gcmForSendingUserId

function gcmForUserId(datatobesended,token){
var data = {
  "collapseKey":"applice",
  "delayWhileIdle":true,
  'priority':'high',
  'collapse_key':'non-collapsible',
  "data":{
          "data":datatobesended
    },
    "notification":{
      'body':"Hello Richie",
      'title':'Yupo'
    },
  "to":token
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

var arrayForToken = new Array();
GcmToken.find({}).select({token_number:1,_id:0}).exec(function(error,doc){
  for(var i=0;i<doc.length;i++){
   arrayForToken.push(doc[i].token_number);
      if(i== doc.length-1){
          var json = {type_of:3,data:{smswtf:'MM'}};
    // gcmForSmswtf(json)
         var   json1 = {type_of:4,data:{contact_number_of_OMOYoo:'9897433253'}};
          
         //  gcmForOmoyoContactNumber(json1)
         
         var   json2 = {type_of:5,data:{license_description:'Really you want the license.'}};
          
         // gcmForOmoyoLicenseDescription(json2)
         
       // sendingFaqToUser();
         
      }
  }
});

function sendingFaqToUser(){
    Faq.find({},{faq_id:1,faq_question:1,faq_answer:1},function(error,doc){
       var   json2 = {type_of:6,data:{data_for_faq:doc}};
           gcmForOmoyoFaqUpload(json2);
    });
}

function gcmForSmswtf(json){
    
var data = {
  "collapseKey":"applice",
  "delayWhileIdle":true,
  'priority':'high',
  'collapse_key':'non-collapsible',
  "data":{
          "data":json
    },
  "registration_ids":arrayForToken
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



function gcmForOmoyoContactNumber(json){
    
var data = {
  "collapseKey":"applice",
  "delayWhileIdle":true,
  'priority':'high',
  'collapse_key':'non-collapsible',
  "data":{
          "data":json
    },
  "registration_ids":arrayForToken
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

function gcmForOmoyoLicenseDescription(json){
    
var data = {
  "collapseKey":"applice",
  "delayWhileIdle":true,
  'priority':'high',
  'collapse_key':'non-collapsible',
  "data":{
          "data":json
    },
  "registration_ids":arrayForToken
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


function gcmForOmoyoFaqUpload(json){
    
var data = {
  "collapseKey":"applice",
  "delayWhileIdle":true,
  'priority':'high',
  'collapse_key':'non-collapsible',
  "data":{
          "data":json
    },
  "registration_ids":arrayForToken
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

app.listen(15437,function(){
	console.log("Server Created .....");
});