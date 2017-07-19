var roommgr = require('./roommgr')
var db = require('../utils/db');

//起始id,同房卡房分开
var roomId_g = 90000000;

function create_room(roomConf, roomId, callback){
    var createTime = Math.ceil(Date.now()/1000);
    var roomInfo = {
        uuid:"",
        id:roomId,
        numOfGames:0,
        createTime:createTime,
        nextButton:0,
        seats:[],
        conf:{
            type:'k5xxy',//roomConf.type,
            baseScore:DI_FEN[roomConf.difen],
            zimo:roomConf.zimo,
            jiangdui:roomConf.jiangdui,
            hsz:roomConf.huansanzhang,
            dianganghua:parseInt(roomConf.dianganghua),
            menqing:roomConf.menqing,
            tiandihu:roomConf.tiandihu,
            maxFan:100,
            maxGames:99999999999,
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
    db.create_room(roomInfo.id,roomInfo.conf,ip,port,createTime,function(uuid){
        if(uuid != null){
            roomInfo.uuid = uuid;
            roommgr.add_room(roomId, roomInfo);
            callback(2, roomInfo);
        }
        else{
            callback(3,null);
        }
    });
}

function add_user(roomInfo, creator){
    for(var i = 0; i < PLAYCOUNT; ++i){
        var seat = roomInfo.seats[i];
        if(seat.userId == 0){
            seat.userId = creator;
            seat.score = 3000;
            seat.ready = false;
            seat.numZiMo = 0;
            seat.numJiePao = 0;
            seat.numDianPao = 0;
            seat.numAnGang = 0;
            seat.numMingGang = 0;
            seat.numChaJiao = 0;
            break;
        }
    }
}

function remove_user(roomInfo, user){
    for(var i = 0; i < PLAYCOUNT; ++i){
        var seat = roomInfo.seats[i];
        if(seat.userId == user){
            seat.userId = 0;
            break;
        }
    }
}

exports.user_join = function(creator, callback){
    var rooms = roommgr.get_extern_room();
    //进入差一人的房间
    for(var i=0; i<rooms.length; ++i){
        var room = rooms[i]
        if(room.user_count == 3){
            add_user(room, creator);
            return;
        }
    }

    //进入第一个有空位的房间
    for(var i=0; i<rooms.length; ++i){
        var room = rooms[i]
        if(room.user_count < 4){
            room.add_user(room, creator);
            return;
        }
    }

    //创建新房间
    var new_room_id = roomId_g++;
    if( roogId_g < 9000000){
        roogId_g = 9000000;
        new_room_id = roomId_g++;
    }
    room = create_room({}, new_room_id);
    add_user(room, creator);
    return;
}

exports.user_leave = function(user, callback){
    var room = roommgr.getUserRoom(user);
    remove_user(room, user);
}

