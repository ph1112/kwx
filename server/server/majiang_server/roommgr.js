var db = require('../utils/db');

var rooms = {};
var creatingRooms = {};

var userLocation = {};
var totalRooms = 0;

var DI_FEN = [1,2,5];
var MAX_FAN = [8,16];
var JU_SHU = [8,16];
var JU_SHU_COST = [2,3];
var PLAYCOUNT = 3;
function generateRoomId(){
	var roomId = "";
	for(var i = 0; i < 6; ++i){
		roomId += Math.floor(Math.random()*10);
	}
	return roomId;
}

function constructRoomFromDb(dbdata){
	var roomInfo = {
		uuid:dbdata.uuid,
		id:dbdata.id,
		numOfGames:dbdata.num_of_turns,
		createTime:dbdata.create_time,
		nextButton:dbdata.next_button,
		piaofen:{},
		seats:new Array(3),
		conf:JSON.parse(dbdata.base_info)
	};

	roomInfo.gameMgr = require("./gamemgr_k5xxy");

	var roomId = roomInfo.id;

	for(var i = 0; i < PLAYCOUNT; ++i){ 
		var s = roomInfo.seats[i] = {};
		s.userId = dbdata["user_id" + i];
		s.score = dbdata["user_score" + i];
		s.name = dbdata["user_name" + i];
		s.ready = false;
		s.seatIndex = i;
		s.numZiMo = 0;
		s.numJiePao = 0;
		s.numDianPao = 0;
		s.numAnGang = 0;
		s.numMingGang = 0;
		s.numChaJiao = 0;
		s.que = 1;
		if(s.userId > 0){
			userLocation[s.userId] = {
				roomId:roomId,
				seatIndex:i
			};
		}
	}
	rooms[roomId] = roomInfo;
	totalRooms++;
	return roomInfo;
}

exports.createRoom = function(account,creator,roomConf,gems,ip,port,cost_total,room_create_type,callback){
	if(roomConf.zimo==null || roomConf.zimo==undefined||roomConf.zimo==0){
		roomConf.zimo=1;
	}
	
	if(
		roomConf.type == null
		|| roomConf.zimo == null
		|| roomConf.difen == null	
		|| roomConf.jiangdui == null
		|| roomConf.huansanzhang == null
		|| roomConf.zuidafanshu == null
		|| roomConf.jushuxuanze == null
		|| roomConf.menqing == null
		|| roomConf.tiandihu == null){
		callback(1,null);
		return;
	}

	if(roomConf.difen < 0 || roomConf.difen > DI_FEN.length){
		callback(1,null);
		return;
	}

	if(roomConf.zimo < 0 || roomConf.zimo > 4){
		callback(1,null);
		return;
	}

	if(roomConf.zuidafanshu < 0 || roomConf.zuidafanshu > MAX_FAN.length){
		callback(1,null);
		return;
	}

	if(roomConf.jushuxuanze < 0 || roomConf.jushuxuanze > JU_SHU.length){
		callback(1,null);
		return;
	}
	
	var cost = JU_SHU_COST[roomConf.jushuxuanze];
	if(cost > gems){
		callback(2222,null);
		return;
	}

	var fnCreate = function(){
		var roomId = generateRoomId();
		if(rooms[roomId] != null || creatingRooms[roomId] != null){
			fnCreate();
		}
		else{
			creatingRooms[roomId] = true;
			db.is_room_exist(roomId, function(ret) {

				if(ret){
					delete creatingRooms[roomId];
					fnCreate();
				}
				else{
					var createTime = Math.ceil(Date.now()/1000);
					var expired_time = createTime + 24 * 60 * 60;
					var status = 0;
					var roomInfo = {
						uuid:"",
						id:roomId,
						numOfGames:0,
						createTime:createTime,
						nextButton:0,
						piaofen:{},
						seats:[],
						status:status,
						room_create_type:room_create_type,
						conf:{
							type:'k5xxy',//roomConf.type,
							baseScore:DI_FEN[roomConf.difen],
						    zimo:roomConf.zimo,//玩法
						    jiangdui:roomConf.jiangdui,//频道
						    hsz:roomConf.huansanzhang,//数坎
						    dianganghua:parseInt(roomConf.dianganghua),// 
						    menqing:roomConf.menqing,//亮倒自摸
						    tiandihu:roomConf.tiandihu,//不可明
						    maxFan:MAX_FAN[roomConf.zuidafanshu],//倍数封顶
						    maxGames:JU_SHU[roomConf.jushuxuanze],
						    creator:creator,
						}
					};
					
					//roomConf.type
                    roomInfo.gameMgr = require("./gamemgr_k5xxy");
				
					
					for(var i = 0; i < PLAYCOUNT; ++i){
						roomInfo.seats.push({
							userId:0,
							score:0,
							name:"",
							que:-1,
							ready:false,
							seatIndex:i,
							numZiMo:0,
							numJiePao:0,
							numDianPao:0,
							numAnGang:0,
							numMingGang:0,
							numChaJiao:0,
						});
					}
					

					//写入数据库
					var conf = roomInfo.conf;
					db.create_room(roomInfo.id,roomInfo.conf,ip,port,createTime,creator,account,expired_time,cost,status,room_create_type,function(uuid){
						delete creatingRooms[roomId];
						if(uuid != null){
							roomInfo.uuid = uuid;
						
							rooms[roomId] = roomInfo;
							totalRooms++;
							callback(0,roomId);
						}
						else{
							callback(3,null);
						}
					});
				}
			});
		}
	}

	fnCreate();
};

exports.destroy = function(roomId){
	var roomInfo = rooms[roomId];
	if(roomInfo == null){
		return;
	}

	for(var i = 0; i < PLAYCOUNT; ++i){
		var userId = roomInfo.seats[i].userId;
		if(userId > 0){
			delete userLocation[userId];
			db.set_room_id_of_user(userId,null);
		}
	}
	
	delete rooms[roomId];
	totalRooms--;
	db.delete_room(roomId);
}

exports.getTotalRooms = function(){
	return totalRooms;
}

exports.getRoom = function(roomId){
	return rooms[roomId];
};

exports.isCreator = function(roomId,userId){
	var roomInfo = rooms[roomId];
	if(roomInfo == null){
		return false;
	}
	return roomInfo.conf.creator == userId;
};

exports.enterRoom = function(roomId,userId,userName,callback){
	var fnTakeSeat = function(room){

		if(exports.getUserRoom(userId) == roomId){
			//已存在
			return 0;
		}
	
		for(var i = 0; i < PLAYCOUNT; ++i){
			var seat = room.seats[i];
			if(seat.userId <= 0){
				seat.userId = userId;
				seat.name = userName;
				userLocation[userId] = {
					roomId:roomId,
					seatIndex:i
				};
				//console.log(userLocation[userId]);
				db.update_seat_info(roomId,i,seat.userId,"",seat.name);
				//正常
				return 0;
			}
		}	
		//房间已满
		return 1;	
	}
	var room = rooms[roomId];
	if(room){
		var ret = fnTakeSeat(room);
		callback(ret);
	}
	else{
		db.get_room_data(roomId,function(dbdata){
	
			if(dbdata == null){
				//找不到房间
				callback(2);
			}
			else{
				//construct room.
				room = constructRoomFromDb(dbdata);
		
		
				//
				var ret = fnTakeSeat(room);
				callback(ret);
			}
		});
	}
};

exports.setReady = function(userId,value){
	
	var roomId = exports.getUserRoom(userId);
	if(roomId == null){
		return;
	}

	var room = exports.getRoom(roomId);
	if(room == null){
		return;
	}

	var seatIndex = exports.getUserSeat(userId);
	if(seatIndex == null){
		return;
	}

	var s = room.seats[seatIndex];
	s.ready = value;

	
}

exports.isReady = function(userId){
	var roomId = exports.getUserRoom(userId);
	if(roomId == null){
		return;
	}

	var room = exports.getRoom(roomId);
	if(room == null){
		return;
	}

	var seatIndex = exports.getUserSeat(userId);
	if(seatIndex == null){
		return;
	}

	var s = room.seats[seatIndex];
	return s.ready;	
}


exports.getUserRoom = function(userId){
	var location = userLocation[userId];
	if(location != null){
		return location.roomId;
	}
	return null;
};

exports.getUserSeat = function(userId){
	var location = userLocation[userId];
	//console.log(userLocation[userId]);
	if(location != null){
		return location.seatIndex;
	}
	return null;
};

exports.getUserLocations = function(){
	return userLocation;
};

exports.exitRoom = function(userId){
	var location = userLocation[userId];
	if(location == null)
		return;

	var roomId = location.roomId;
	var seatIndex = location.seatIndex;
	var room = rooms[roomId];
	delete userLocation[userId];
	if(room == null || seatIndex == null) {
		return;
	}

	var seat = room.seats[seatIndex];
	seat.userId = 0;
	seat.name = "";

	var numOfPlayers = 0;
	for(var i = 0; i < room.seats.length; ++i){
		if(room.seats[i].userId > 0){
			numOfPlayers++;
		}
	}
	
	db.set_room_id_of_user(userId,null);

	// if(numOfPlayers == 0){
	// 	exports.destroy(roomId);
	// }


};

exports.add_room = function(roomId, room){
	rooms[roomId] = room;
	return room;
}

exports.get_extern_room = function(){
	var results = [];
	for( var k in rooms){
		var r = rooms[k];
		if(int(k)> 1000000){
			results.push(r);
		}
	}
	return results;
}

 setInterval(function(){
     db.get_expired_rooms(function(rooms){
 
         if(rooms){
             for(var i = 0; i < rooms.length; i++){
                 var id = rooms[i].id;
       
                 var r = exports.getRoom(id);
                 if(r){
                    exports.destroy(id);
                 }else{
                    db.delete_room(id);  
                 }
             }
         }           
     });
 }, 60*60*1000);
 