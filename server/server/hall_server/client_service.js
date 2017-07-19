var crypto = require('../utils/crypto');
var express = require('express');
var db = require('../utils/db');
var http = require('../utils/http');
var room_service = require("./room_service");
//var co = require('co');

var app = express();
var config = null;

var user_token = {};

function check_account(req,res){
	var account = req.query.account;
	var sign = req.query.sign;
	var userToken = req.query.token;
	if(account == null || sign == null || userToken == null){
		http.send(res,1,"unknown error");
		return false;
	}

	var serverToken = user_token[account];	
	if(userToken != serverToken){
		http.send(res,2,"login user token illegal.")
		return false;

	}
	/*
	var serverSign = crypto.md5(account + req.ip + config.ACCOUNT_PRI_KEY);
	if(serverSign != sign){
		http.send(res,2,"login failed.");
		return false;
	}
	*/
	return true;
}


app.use(function (req, res, next) {
  var account = req.query.account;
  if(!account){
	  next();
	  return;
  }
  if(account in user_token){
	next();
  }else{
	  db.get_user_data_ex(account, function(result){
		if(result){
			user_token[account] = result.token
		}else{
			
		}
		next();
	  })
  }
});

//设置跨域访问
app.all('*', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
	res.header("X-Powered-By",' 3.2.1');
	res.header("Content-Type", "application/json;charset=utf-8");
	next();
});

app.get('/set_user_token',function(req, res){
	var account = req.query.account;
	var token = req.query.token;

	user_token[account] = token;
    http.send(res,0,"ok");
});

//同步房卡数据
app.get('/sync_gems_info',function(req,res){
	var account = req.query.account;
	db.get_user_data(account,function(data){
		if(data == null){
			http.send(res,0,"ok");
			return;
		}

		//先判断，登录账户是否是代理账户,如果是，则更新房卡信息到t_dealer数据表中
		db.get_dealer_info(data.userid,function(dealer){
			if(dealer == null){
				http.send(res,1,"system error");
				return;
			}
			if(dealer.dealer_level != null && dealer.dealer_level > 0){
				http.post(config.DEALDER_API_IP,config.DEALDER_API_PORT,"/set_dealer_account_token",{account:dealer.dealer_account,token:req.query.token,gems:data.gems},function(data){
					if(data.length > 0){
					//console.log('update dealer ok...');
						http.send(res,0,"sync dealer data ok");
					}
					else{
						http.send(res,-1,"sync dealer data failed");
					}							
				});
			}
		});
	});
});


app.get('/login',function(req,res){

	
	if(!check_account(req,res)){
		return;
	}
	
	var ip = req.ip;
	if(ip.indexOf("::ffff:") != -1){
		ip = ip.substr(7);
	}
	
	var account = req.query.account;
	db.get_user_data(account,function(data){
		if(data == null){
			http.send(res,0,"ok");
			return;
		}

		var ret = {
			account:data.account,
			userid:data.userid,
			name:data.name,
			lv:data.lv,
			exp:data.exp,
			coins:data.coins,
			gems:data.gems,
			ip:ip,
			sex:data.sex,
			dealer_level:data.dealer_level,
		};

		//先判断，登录账户是否是代理账户,如果是，则更新房卡信息到t_dealer数据表中
		db.get_dealer_info(ret.userid,function(dealer){
			if(dealer == null){
				http.send(res,1,"system error");
				return;
			}
			if(dealer.dealer_level != null && dealer.dealer_level > 0){
	
				http.post(config.DEALDER_API_IP,config.DEALDER_API_PORT,"/set_dealer_account_token",{account:dealer.dealer_account,token:req.query.token,gems:data.gems},function(data){
					if(data.length > 0){
						//http.send(res,0,"sync dealer data ok");
					}
					else{
						//http.send(res,-1,"sync dealer data failed");
					}							
				});
			}
		});
		

		db.get_room_id_of_user(data.userid,function(roomId){
			//如果用户处于房间中，则需要对其房间进行检查。 如果房间还在，则通知用户进入
			if(roomId != null){
				//检查房间是否存在于数据库中
				db.is_room_exist(roomId,function (retval){
					if(retval){
						ret.roomid = roomId;
					}
					else{
						//如果房间不在了，表示信息不同步，清除掉用户记录
						db.set_room_id_of_user(data.userid,null);
					}
					http.send(res,0,"ok",ret);
				});
			}
			else {
				http.send(res,0,"ok",ret);
			}
		});
	});
});

app.get('/create_user',function(req,res){
	if(!check_account(req,res)){
		return;
	}
	var account = req.query.account;
	var name = req.query.name;
	var coins = 1000;
	var gems = 21;


	db.is_user_exist(account,function(ret){
		if(!ret){
			//db.create_user(account,name,coins,gems,0,null,function(ret){
				db.create_user(account,name,coins,gems,0,null,req.query.token,0,function(ret){
				if (ret == null) {
					http.send(res,2,"system error.");
				}
				else{
					http.send(res,0,"ok");					
				}
			});
		}
		else{
			http.send(res,1,"account have already exist.");
		}
	});
});

//查询代理信息
app.get('/query_dealer_info',function(req,res){
	var data = req.query;
	if(!check_account(req,res)){
		return;
	}
	var token = data.token;
	var dealerId = data.dealerId;

	db.get_level_by_token(token,function(ret){
		if(ret == null){
			http.send(res,1,"token not exist");
		}
		else{
			if(ret.dealer_level < 3){
				http.send(res,2,"not super administrator");
			}
			else{
				db.get_dealer_info(dealerId,function(ret){
					if(ret == null){
						http.send(res,-1,"id not exist");
						return;
					}
					else{
						var data ={
							name:ret.name,
							gems:ret.gems,
							dealer_level:ret.dealer_level,
						};
						http.send(res,0,"ok",data);
					}					
				});
			}			
		}
	});	
});

//设置代理账户(id,level)
app.get('/set_user_as_dealer',function(req,res){
	var data = req.query;
	if(!check_account(req,res)){
		return;
	}
	var userId = data.userId; //账户的ID
	var dealerId = data.dealerId;  //代理账户的ID
	var dealer_level = data.dealer_level; //被设账户的级别
	var token = data.token;
	var dealer_account = "wx_" + dealerId;
	if(dealerId == null || dealer_level == null ){
		http.send(res,5,"dealer info is null");
		return;
	}
	db.get_dealer_info(userId,function(userdata){
		if(userdata == null || userdata.dealer_level == null || userdata.dealer_level == 0){
			http.send(res,6,"system error");
			return;
		}
		if(userdata.dealer_level <= dealer_level){
			http.send(res,2,"user level is too low");
			return;
		}
		//账户是否存在
		db.get_user_data_by_userid(dealerId,function(data){
			if(data == null){
				
				http.send(res,1,"userId is not exist");
				return;
			}
			db.set_dealer_user(dealerId,dealer_account,dealer_level,function(ret){
				if(ret){
					console.log("dealer set ok:" + config.DEALDER_API_PORT);
					http.post(config.DEALDER_API_IP,config.DEALDER_API_PORT,"/set_dealer_account_token",{account:dealer_account,token:token,gems:data.gems},function(data){
					
						if(data.length > 0){
					
							http.send(res,0,"set ok");
						}
						else{
							dealer_account = '';
							dealer_level = 0;
							db.set_dealer_user(dealerId,dealer_account,dealer_level,function(errData){
								http.send(res,3,"set failed");
							});							
						}	
						return;							
					});					
				}
				else{
	
					http.send(res,4,"dealer set failed");
					return;
				}
			});
		});
	});
});

//设置推荐码
app.get('/set_suggest_user',function(req,res){
	var data = req.query;
	if(!check_account(req,res)){
		return;
	}
	var account = data.account;
	var suggest_Id = data.suggest_id; //推荐人的ID
	var userId = data.userid;
	db.get_user_data_by_userid(userId,function(data){
		if(data == null){
			http.send(res,1,"system error");
			return;
		}
		if(data.suggest_user != null){
			http.send(res,3,"you have already used the suggest code");
			return;
		}

		db.get_user_data_by_userid(suggest_Id,function(sData){
			if(sData == null){
				http.send(res,4,"suggest user not exist.");
				return;
			}
			db.set_suggest_id_by_userid(userId,suggest_Id,function(ret){
				if (ret == null) {
					http.send(res,2,"system error.");
					return;
				}
				else{
					//add gems
					var retData = {
						gems:3,
					};
					//var gems = 3;
					db.add_user_gems(userId,retData.gems,function(suc){
						db.add_user_gems(suggest_Id,retData.gems,function(suc){
							http.send(res,0,"add gems ok",retData);
						});
					});								
				}
			});
		});
	});
});

//查询当前用户相关的房间（包括用户创建并存在的房间，用户所在的房间）
app.get('/list_user_rooms',function(req,res){
	var data = req.query;
	if(!check_account(req,res)){
		return;
	}
	
	var account = data.account;
	db.get_user_data(account,function(data){
		if(data == null){
			http.send(res,1,"system error");
			return;
		}
		var userId = data.userid;
		var roomlist = [];
		//检验玩家状态
		db.get_room_id_of_user(userId,function(roomId){
			//获取玩家所创建的房间号
			db.get_rooms_data_of_creator(userId,function(roomData){
				if(roomData != null){
					for(var i = 0;i < roomData.length; ++i){
						roomlist.push(roomData[i]);
					}
				}
				//玩家正在房间玩,获取房间号
				db.get_room_data_of_roomId(roomId,function(roomdata){
					if(roomdata != null){
						roomlist.push(roomdata);
					}
				
					var ret = {
						roomList:roomlist
					};
					if(roomlist.length > 0){
						http.send(res,0,"ok",ret);
					}else{
						http.send(res,-1,"error");
					}					
					// http.post(config.GAME_SERVER_IP,config.GAME_SERVER_PORT,"/query_rooms_status",{roomlist:roomlist},function(data){
					// 	console.log("query_rooms_status",data);
					// 	if(data != null){
					// 		var ret = {
					// 			data:data,
					// 		}
					// 		http.send(res,0,"ok",ret);
					// 		console.log("get user rooms list ok.");	
					// 	}
					// 	else{
					// 		http.send(res,-1,"error");
					// 	}
					// });						
				});						
			});	
		});
	});
});

//查询用户创建的所有房间的结果
app.get('/query_room_results',function(req,res){
	var data = req.query;
	if(!check_account(req,res)){
		return;
	}

	var account = data.account;
	db.get_user_data(account,function(data){
		if(data == null){
			http.send(res,1,"system error");
			return;
		}
		var historyRooms = [];
		var userId = data.userid;
		db.get_history_rooms_of_creator(userId,function(historyData){
			if(historyData != null){
				for(var i = 0;i < historyData.length; ++i){
					historyRooms.push(historyData[i]);
				}
				var ret ={
					historyRoomList:historyRooms
				};
				http.send(res,0,"ok",ret);
		
			}
		});
	})
});

//替别人创建房间
app.get('/create_private_room_for_others',function(req,res){
	var data = req.query;
	if(!check_account(req,res)){
		return;
	}

	var account = data.account;
	data.account = null;
	var conf = data.conf;
	db.get_user_data(account,function(data){
		if(data == null){
			http.send(res,1,"system error");
			return;
		}
		var userId = data.userid;
		var name = data.name;
		//验证玩家状态
		db.get_room_id_of_user(userId,function(roomId){
			// if(roomId != null){
			// 	http.send(res,-1,"user is playing in room now.");
			// 	return;
			// }
			//计算玩家已经消耗的gems yxh
			var cost_total = 0;
			db.get_rooms_data_of_creator(userId,function(roomData){
				if(roomData != null){
					for(var i = 0;i < roomData.length; ++i){
						cost_total += roomData[i].cost_gems;
					}
				}
				//创建房间
				var room_create_type = 1;
				room_service.createRoom(account,userId,conf,cost_total,room_create_type,function(err,roomId){
					if(err == 0 && roomId != null){
						var ret = {
									roomid:roomId,
									//ip:enterInfo.ip,
									//port:enterInfo.port,
									//token:enterInfo.token,
									time:Date.now()
								};
						//ret.sign = crypto.md5(ret.roomid + ret.token + ret.time + config.ROOM_PRI_KEY);
						ret.sign = crypto.md5(ret.roomid + ret.time + config.ROOM_PRI_KEY);
						http.send(res,0,"ok",ret);
					
					}
					else{
						http.send(res,err,"create failed.");					
					}
				});
			});			
		});
	});
});

app.get('/create_private_room',function(req,res){
	//验证参数合法性
	var data = req.query;



	//验证玩家身份
	if(!check_account(req,res)){
		return;
	}

	var account = data.account;

	data.account = null;
	data.sign = null;
	var conf = data.conf;
	db.get_user_data(account,function(data){
		if(data == null){
			http.send(res,1,"system error");
			return;
		}
		var userId = data.userid;
		var name = data.name;
		//验证玩家状态
		db.get_room_id_of_user(userId,function(roomId){
			if(roomId != null){
				http.send(res,-1,"user is playing in room now.");
				return;
			}
			//计算玩家已经消耗的gems yxh
			var cost_total = 0;
			db.get_rooms_data_of_creator(userId,function(roomData){
				if(roomData != null){
					for(var i = 0;i < roomData.length; ++i){
						cost_total += roomData[i].cost_gems;
					}
				}
				//创建房间
				var room_create_type = 0;
				room_service.createRoom(account,userId,conf,cost_total,room_create_type,function(err,roomId){
					if(err == 0 && roomId != null){
						room_service.enterRoom(userId,name,roomId,function(errcode,enterInfo){
							if(enterInfo){
								db.get_room_data_of_roomId(roomId,function(roomdata){
									
									if(roomdata == null){
										http.send(res,2,"room doesn't exist.");
										return;
									}
									var ret = {
										roomid:roomId,
										ip:enterInfo.ip,
										port:enterInfo.port,
										token:enterInfo.token,
										time:Date.now(),
										creator:roomdata.user_create,
										room_create_type:roomdata.room_create_type,
									};
									ret.sign = crypto.md5(ret.roomid + ret.token + ret.time + config.ROOM_PRI_KEY);
									http.send(res,0,"ok",ret);
								});							
							}
							else{
								http.send(res,errcode,"room doesn't exist.");
							}
						});
					}
					else{
						http.send(res,err,"create failed.");					
					}
				});
			});			
		});
	});
});

app.get('/enter_private_room',function(req,res){
	var data = req.query;
	var roomId = data.roomid;
	if(roomId == null){
		http.send(res,-1,"parameters don't match api requirements.");
		return;
	}
	if(!check_account(req,res)){
		return;
	}

	var account = data.account;

	db.get_user_data(account,function(data){
		if(data == null){
			http.send(res,-1,"system error");
			return;
		}
		var userId = data.userid;
		var name = data.name;

		//验证玩家状态
		//todo
		//进入房间
		room_service.enterRoom(userId,name,roomId,function(errcode,enterInfo){
			if(enterInfo){
				db.get_room_data_of_roomId(roomId,function(roomdata){
				
					if(roomdata == null){
						http.send(res,2,"room doesn't exist.");
						return;
					}
					var ret = {
						roomid:roomId,
						ip:enterInfo.ip,
						port:enterInfo.port,
						token:enterInfo.token,
						time:Date.now(),
						creator:roomdata.user_create,
						room_create_type:roomdata.room_create_type,
					};
					ret.sign = crypto.md5(ret.roomid + ret.token + ret.time + config.ROOM_PRI_KEY);
					http.send(res,0,"ok",ret);
				});
			}
			else{
				http.send(res,errcode,"enter room failed.");
			}
		});
	});
});

app.get('/get_history_list',function(req,res){
	var data = req.query;
	if(!check_account(req,res)){
		return;
	}
	var account = data.account;
	db.get_user_data(account,function(data){
		if(data == null){
			http.send(res,-1,"system error");
			return;
		}
		var userId = data.userid;
		db.get_user_history(userId,function(history){
			http.send(res,0,"ok",{history:history});
		});
	});
});

app.get('/get_giftcer_of_user',function(req,res){

	var data = req.query;
	//if(!check_account(req,res)){
		//return;
	//}
		
	var token = data.token;
    var goodscode =data.goods_code;
	var goodsprice = 0;



	switch(goodscode)
	{
		case "1":goodsprice=100;break;
		case "2":goodsprice=200;break;
		case "3":goodsprice=300;break;
		case "4":goodsprice=400;break;
		case "5":goodsprice=500;break;
		case "6":goodsprice=600;break;
	}



	db.reduce_user_giftcer({token,goodsprice,goodscode},function(residuecoins){

		http.send(res,0,"ok",{residuecoins:residuecoins});
	});
});

app.get('/set_add_gameover_lijuan',function(req,res){

	var data = req.query;
    var addcoins = Math.floor(Math.random() * 15)+5;
	var token = data.token;


	db.add_gameover_lijuan(token,addcoins,function(addcoins){
	
		http.send(res,0,"ok",{addcoins:addcoins});
	});
});


app.get('/coins_and_gems',function(req,res){
   var data = req.query;
   var token = data.token;
  
   db.getcoins_and_gems(token,function(data){		
		
		http.send(res,0,"ok",{data:data});
	});   
});

app.get('/get_mission_list',function(req,res){
   var data = req.query;
   var token = data.token;
   var missionid=data.missionid;
   db.get_mission_list(token,missionid,function(data){

		http.send(res,0,"ok",{data:data});
	});   
});
app.get('/mission_accepting_award',function(req,res){
   var data = req.query;
   var token = data.token;
   var missionid=data.missionid;
   db.mission_accepting_award(token,missionid,function(data){

		http.send(res,0,"ok",{data:data});
	});   
});
app.get('/get_mission_state',function(req,res){
   var data = req.query;
   var token = data.token;
   var missionid=data.missionid;
   db.get_mission_state(token,missionid,function(data){
	
		http.send(res,0,"ok",{data:data});
	});   
});
app.get('/get_mission',function(req,res){
   var data = req.query;
   var token = data.token;
 
   db.get_mission(token, function(data){
	
		http.send(res,0,"ok",{data:data});
	});   
});
app.get('/getslyder_result',function(req,res){
   var data = req.query;
   var token = data.token;
   var result = Math.floor(Math.random() * 8)+1;
   var result_des="物品";
   db.create_slyder_result(token,result,result_des,function(result){
	
		http.send(res,0,"ok",{result:result});
		
	});

   db.update_user_slyder_info(token,function(result){
	
		//http.send(res,0,"ok",{result:result});
	});    
});

app.get('/get_slyder_count',function(req,res){
	var data = req.query;
   var token = data.token;

	db.get_user_slyder_count(token,function(count){
	
		http.send(res,0,"ok",{count:count});
	});
});
//app.get('/get_user_slyder_count_openroom',function(req,res){
// 	var data = req.query;
//    var token = data.token;

// 	db.get_user_slyder_count_openroom(token,function(count){
	
// 		http.send(res,0,"ok",{count:count});
// 	});
//});


app.get('/get_games_of_room',function(req,res){
	var data = req.query;
	var uuid = data.uuid;
	if(uuid == null){
		http.send(res,-1,"parameters don't match api requirements.");
		return;
	}
	if(!check_account(req,res)){
		return;
	}
	db.get_games_of_room(uuid,function(data){
	
		http.send(res,0,"ok",{data:data});
	});
});

app.get('/get_detail_of_game',function(req,res){
	var data = req.query;
	var uuid = data.uuid;
	var index = data.index;
	var id = data.id;
	if(uuid == null || index == null){
		http.send(res,-1,"parameters don't match api requirements.");
		return;
	}
	if(!check_account(req,res)){
		return;
	}
	db.get_detail_of_game(uuid,index,id,function(ret){
		http.send(res,0,"ok",{data:ret});
	});
});

app.get('/get_user_status',function(req,res){
	if(!check_account(req,res)){
		return;
	}
	var account = req.query.account;
	db.get_gems(account,function(data){
		if(data != null){
			http.send(res,0,"ok",{gems:data.gems});	
		}
		else{
			http.send(res,1,"get gems failed.");
		}
	});
});

app.get('/get_message',function(req,res){
	//if(!check_account(req,res)){
	//	return;
//	}
	var type = req.query.type;
	
	if(type == null){
		http.send(res,-1,"parameters don't match api requirements.");
		return;
	}
	
	var version = req.query.version;
	db.get_message(type,version,function(data){
		if(data != null){
			http.send(res,0,"ok",{msg:data.msg,version:data.version});	
		}
		else{
			http.send(res,1,"get message failed.");
		}
	});
});

app.get('/is_server_online',function(req,res){
	if(!check_account(req,res)){
		return;
	}
	var ip = req.query.ip;
	var port = req.query.port;
	room_service.isServerOnline(ip,port,function(isonline){
		var ret = {
			isonline:isonline
		};
		http.send(res,0,"ok",ret);
	}); 
});

app.get('/get_prize',function(res){
	db.get_prize(function(data){
         http.send(res,0,"ok",data);
	});
});
app.get('/get_turntable_prize',function(res){
	db.get_turntable_prize(function(data){
         http.send(res,0,"ok",data);
	});
});

exports.start = function($config){
	config = $config;
	app.listen(config.CLEINT_PORT);
	console.log("client service is listening on port " + config.CLEINT_PORT);
};