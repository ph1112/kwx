var crypto = require('../utils/crypto');
var express = require('express');
var db = require('../utils/db');
var http = require("../utils/http");

var app = express();

function send(res,ret){
	var str = JSON.stringify(ret);
	res.send(str)
}


exports.start = function(config){
	app.listen(config.DEALDER_API_PORT,config.DEALDER_API_IP);
	console.log("dealer api is listening on " + config.DEALDER_API_IP + ":" + config.DEALDER_API_PORT);
};

//设置跨域访问
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

app.get('/get_user_info',function(req,res){
	var userid = req.query.userid;
	db.get_user_data_by_userid(userid,function (data) {
		if(data){
			var ret = {
				userid:userid,
				name:data.name,
				gems:data.gems,
				headimg:data.headimg
			}
			http.send(res,0,"ok",ret);
		}
		else{
			http.send(res,1,"null");
		}
	});
});

//充值房卡
app.get('/add_user_gems',function(req,res){
	var data = req.query;
	var addGems = data.gems;
	var dealer_account = data.dealer;  //代理账户account
	var userId = data.userid;   //被充值人的账户ID
	console.log("dealer_account" + dealer_account);
	db.get_dealer_account_info(dealer_account,function(data){
		if(data == null){
			http.send(res,-1,"system error");
			return;
		}
		if(data.gems < addGems){
			http.send(res,1,"dealer has no enough gems");
			return;
		}
		var reduceId = data.userid;
		//增加被充值账户房卡
		db.add_user_gems(userId,addGems,function(ret){
			if(ret == false){
				http.send(res,2,"add gems failed");
			}
			else{
				db.reduce_user_gems(reduceId,addGems,function(ret){
					if(ret == false){
						db.reduce_user_gems(userId,addGems,function(){
							//todo
							
						});
					}
					else{
						var ret = 0;//data.gems - addGems; 
						http.send(res,0,"add gems ok",ret);
					}
				});
			}
		});
	});
});