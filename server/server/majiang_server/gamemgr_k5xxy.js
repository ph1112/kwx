var roomMgr = require("./roommgr");
var userMgr = require("./usermgr");
var mjutils = require('./mjutillaizi');
var db = require("../utils/db");
var crypto = require("../utils/crypto");
var games = {};
var gamesIdBase = 0;
var PLAYCOUNT = 3;
var ACTION_CHUPAI = 1;
var ACTION_MOPAI = 2;
var ACTION_PENG = 3;
var ACTION_GANG = 4;
var ACTION_HU = 5;
var ACTION_ZIMO = 6;
var ACTION_LIANG = 7;

var flag_se = 0x00000004;
var flag_win = 0x00000040;
var flag_xiao_san_yuan = 0x00001000;
var flag_da_san_yuan = 0x00002000;
var flag_k5xin = 0x00004000;
var flag_ming_si_gui = 0x00008000;
var flag_an_si_gui = 0x00010000;

var gameSeatsOfUsers = {};
function getMJType(id) {
    if (id >= 0 && id < 9) {
        //筒
        return 0;
    }
    else if (id >= 9 && id < 18) {
        //条
        return 1;
    }
    else if (id >= 18 && id < 27) {
        //万
        return 2;
    }
}

function shuffle(game) {

    var mahjongs = game.mahjongs;
	/*
    var idx = 0;
    for(var i = 0; i < 12; ++i){
        game.mahjongs[idx++] = 0;
    }

    for(var i = 0; i < 12; ++i){
        game.mahjongs[idx++] = 1;
    }

    for(var i = 0; i < 12; ++i){
        game.mahjongs[idx++] = 2;
    }

    for(var i = 0; i < 12; ++i){
        game.mahjongs[idx++] = 3;
    }


    for(var i = idx; i < game.mahjongs.length; ++i){
        game.mahjongs[i] = 4;
    }
    return;
 
    */
    //筒 0 ~ 8 表示筒子
     var index = 0;
     for (var i = 0; i < 9; ++i) {
         for (var c = 0; c < 4; ++c) {
             mahjongs[index] = i;
             index++;
         }
     }

    // //条 9 ~ 17表示条子
     for (var i = 9; i < 18; ++i) {
         for (var c = 0; c < 4; ++c) {
             mahjongs[index] = i;
             index++;
         }
     }

    // //箭 18 ~ 20
     for (var i = 18; i < 21; ++i) {
         for (var c = 0; c < 4; ++c) {
             mahjongs[index] = i;
             index++;
         }
     }

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // // //测试用例>>>
    // //前13张都是手牌
    // var temp1 = [
    //    18, 18, 18, 19, 19, 19, 20, 20, 20, 4, 4, 4, 5
    // ];
    // //temp2 最后一张是
    // var temp2 = [
    //    1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 6, 6, 6
    // ];

    // var temp3 = [
    //    1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 3, 3, 3
    // ];

    // var j= 0;
    // for(var i = 0; i < 13; i++){
    //     mahjongs[j] = temp1[i];
    //     mahjongs[j+1] = temp2[i];
    //     mahjongs[j+2] = temp3[i];
    //     j+=3;
    // }

    // mahjongs[40] = 1;
    // mahjongs[41] = 1;
    // mahjongs[42] = 1;
    // mahjongs[43] = 2;
    // mahjongs[44] = 2;
    // mahjongs[45] = 2;
    // mahjongs[46] = 3;
    // mahjongs[47] = 3;
    // mahjongs[48] = 4;
    // mahjongs[48] = 4;

    //测试用例<<<

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
    for (var i = 0; i < mahjongs.length; ++i) {
        var lastIndex = mahjongs.length - 1 - i;
        var index = Math.floor(Math.random() * lastIndex);
        var t = mahjongs[index];
        mahjongs[index] = mahjongs[lastIndex];
        mahjongs[lastIndex] = t;
    }
}

function mopai(game, seatIndex) {
    if (game.currentIndex == game.mahjongs.length) {
        return -1;
    }
    var data = game.gameSeats[seatIndex];
    var mahjongs = data.holds;
    var pai = game.mahjongs[game.currentIndex];
    mahjongs.push(pai);
    //统计牌的数目 ，用于快速判定（空间换时间）
    var c = data.countMap[pai];
    if (c == null) {
        c = 0;
    }
    data.countMap[pai] = c + 1;
    game.currentIndex++;
    return pai;
}

function maima(game) {
    if (game.currentIndex == game.mahjongs.length) {
        return -1;
    }
    var pai = game.mahjongs[game.currentIndex];
    game.currentIndex++;
    game.maimapai = pai;
}

function domaimafen(game, seatIndex) {
    var pai = game.maimapai;
    if (pai >= 0 && pai < 9) {
        countPoint = pai + 1;
    }
    else if (pai >= 9 && pai < 18) {
        countPoint = pai - 8;
    }
    else {
        countPoint = 10;
    }
    var sd = game.gameSeats[seatIndex];
    for (var t = 0; t < 3; ++t) {
        if (t == seatIndex) {
            continue;;
        }
        var td = game.gameSeats[t];
        sd.mafen += countPoint;
        td.mafen -= countPoint;
    }
}
function deal(game) {
    //强制清0
    game.currentIndex = 0;
    //每人13张 一共 13*4 ＝ 52张 庄家多一张 53张
    //每人13张 一共 13*3 ＝ 39张 庄家多一张 40张
    var seatIndex = game.button;
    for (var i = 0; i < 39; ++i) {
        var mahjongs = game.gameSeats[seatIndex].holds;
        if (mahjongs == null) {
            mahjongs = [];
            game.gameSeats[seatIndex].holds = mahjongs;
        }
        mopai(game, seatIndex);
        seatIndex++;
        seatIndex %= PLAYCOUNT;
    }
    //庄家多摸最后一张
    mopai(game, game.button);
    //当前轮设置为庄家
    game.turn = game.button;
    game.shouliang = -1;

}

//检查是否可以碰
function checkCanPeng(game, seatData, targetPai) {
    var count = seatData.countMap[targetPai];
    if (count != null && count >= 2) {
        if (!seatData.isliang) {
            seatData.canPeng = true;
        }
    }
}

//检查是否可以点杠
function checkCanDianGang(game, seatData, targetPai) {
    //检查玩家手上的牌
    //如果没有牌了，则不能再杠
    if (game.mahjongs.length <= game.currentIndex) {
        return;
    }

    var count = seatData.countMap[targetPai];
    if (count != null && count >= 3) {
        seatData.canGang = true;
        seatData.guogang.push(targetPai);
         if(seatData.isliang){
            seatData.canGang = false;
            for(var i=0;i<seatData.koucard.length;i++){
                if(seatData.koucard[i]==targetPai){
                    seatData.canGang = true;
                }
            }
        }

        if(!seatData.canGang){
            return;
        }

        seatData.gangPai.push(targetPai);

        var lastmahjongscount = game.mahjongs.length - game.currentIndex;
        var count=0;
        var gangshang = game.gangshanggang;
            if(gangshang[gangshang.length-1] ==  lastmahjongscount+1){
                count++;
                for(var o=1;o<gangshang.length-2;o++){
                    if(gangshang[gangshang.length-1-o]==gangshang[gangshang.length-o]-1){
                        count++;
                        continue;
                    }
                    break;
                }
                seatData.gangshanggang.push(count);
            }
        game.gangshanggang.push(lastmahjongscount);
    }
}

//检查是否可以暗杠
function checkCanAnGang(game, seatData) {
    //如果没有牌了，则不能再杠
    if (game.mahjongs.length <= game.currentIndex) {
        return;
    }
    for (var key in seatData.countMap) {
        var pai = parseInt(key);

        var c = seatData.countMap[key];
        if (c != null && c == 4) {
            seatData.canGang = true;
             if(seatData.isliang){
                    seatData.canGang = false;
                    for(var i=0;i<seatData.koucard.length;i++){
                        if(seatData.koucard[i]==c){
                            seatData.canGang = true;
                        }
                    }
                }

                if(!seatData.canGang){
                    return;
                }

            seatData.gangPai.push(pai);
             var lastmahjongscount = game.mahjongs.length - game.currentIndex;
                var count=0;
                var gangshang = game.gangshanggang;
                    if(gangshang[gangshang.length-1] == (lastmahjongscount+1)){
                        count++;
                        for(var o=1;o<gangshang.length;o++){
                               
                            if(gangshang[gangshang.length-1-o]-1==gangshang[gangshang.length-o]){
                                count++;
                               
                                continue;
                            }
                            break;
                        }
                       
                         seatData.gangshanggang.push(count);
                    }
                   
                game.gangshanggang.push(lastmahjongscount);
        }
    }
}

//检查是否可以弯杠(自己摸起来的时候)
function checkCanWanGang(game, seatData, targetPai) {
    //如果没有牌了，则不能再杠
    if (game.mahjongs.length <= game.currentIndex) {
        return;
    }
    //从碰过的牌中选
    var guogang=false;
    for (var i = 0; i < seatData.pengs.length; ++i) {
        var pai = seatData.pengs[i];

        for (var j = 0; j< seatData.guogang.length; ++j) {
  
            if(seatData.guogang[j]==pai){
                guogang=true;
                seatData.canGang = false;
  
                break;
            }
        }
        //console.log("seatData.guogang[]"+seatData.guogang[]);
        if(!guogang){
       
            if (seatData.countMap[pai] == 1) {
                seatData.canGang = true;             
                seatData.guogang.push(pai);
                if(seatData.isliang){
                    seatData.canGang = false;
                    for(var i=0;i<seatData.koucard.length;i++){
                        if(seatData.koucard[i]==targetPai){
                            seatData.canGang = true;
                        }
                    }
                }

                if(!seatData.canGang){
                    return;
                }
                seatData.gangPai.push(pai);
       
                var lastmahjongscount = game.mahjongs.length - game.currentIndex;
                var count=0;
                var gangshang = game.gangshanggang;
                    if(gangshang[gangshang.length-1] ==  lastmahjongscount+1){
                        count++;
                        for(var o=1;o<gangshang.length-2;o++){           
                            if(gangshang[gangshang.length-1-o]==gangshang[gangshang.length-o]-1){
                                count++;
                                continue;
                            }
                            break;
                        }
                         seatData.gangshanggang.push(count);
                    }
                game.gangshanggang.push(lastmahjongscount);
            }
        }
    }
}

function checkCanHu(game, seatData, targetPai) {
   
    seatData.canHu = false;
    for (var k in seatData.tingMap) {
        if (targetPai == k) {
            console.log("checkCanHu k "+k);
             console.log("checkCanHu targetPai "+targetPai);
            seatData.canHu = true;
            seatData.targetPai = targetPai;
        }
    }

    var roomId = roomMgr.getUserRoom(seatData.userId);
    if (roomId == null) {  
        return;
    }
    var roomInfo = roomMgr.getRoom(roomId);
    if (roomInfo == null) {
        return;
    }
}

function clearAllOptions(game, seatData) {
    var fnClear = function (sd) {
        sd.canPeng = false;
        sd.canGang = false;
        sd.gangPai = [];
        sd.canHu = false;
        sd.lastFangGangSeat = -1;
    }
    if (seatData) {
        fnClear(seatData);
    }
    else {
        game.qiangGangContext = null;
        for (var i = 0; i < PLAYCOUNT; ++i) {
            fnClear(game.gameSeats[i]);
        }
    }
}

//检查听牌
function checkCanTingPai(game, seatData) {
    seatData.tingMap = {};
    //检查是否是七对 前提是没有碰，也没有杠 ，即手上拥有13张牌
    if (seatData.holds.length == 13) {
        //有5对牌
        var hu = false;
        var danPai = -1;
        var pairCount = 0;
        for (var k in seatData.countMap) {
            var c = seatData.countMap[k];
            if (c == 2 || c == 3) {
                pairCount++;
            }
            else if (c == 4) {
                pairCount += 2;
            }

            if (c == 1 || c == 3) {
                //如果已经有单牌了，表示不止一张单牌，并没有下叫。直接闪
                if (danPai >= 0) {
                    break;
                }
                danPai = k;
            }
        }
        //检查是否有6对 并且单牌是不是目标牌
        if (pairCount == 6) {
            //七对只能和一张，就是手上那张单牌
            //七对的番数＝ 2番+N个4个牌（即龙七对）
            seatData.tingMap[danPai] = {
                fan: 2,
                pattern: "7pairs"
            };
       
            //如果是，则直接返回咯
        }

    }
    //检查是否是对对胡  由于四川麻将没有吃，所以只需要检查手上的牌
    //对对胡叫牌有两种情况
    //1、N坎 + 1张单牌
    //2、N-1坎 + 两对牌
    var singleCount = 0;
    var colCount = 0;
    var pairCount = 0;
    var arr = [];
    for (var k in seatData.countMap) {
        var c = seatData.countMap[k];
        if (c == 1) {
            singleCount++;
            arr.push(k);
        }
        else if (c == 2) {
            pairCount++;
            arr.push(k);
        }
        else if (c == 3) {
            colCount++;
        }
        else if (c == 4) {
            //手上有4个一样的牌，在四川麻将中是和不了对对胡的 随便加点东西
            singleCount++;
            pairCount += 2;
        }
    }
    if ((pairCount == 2 && singleCount == 0) || (pairCount == 0 && singleCount == 1)) {
        for (var i = 0; i < arr.length; ++i) {
            var p = arr[i];
            if (seatData.tingMap[p] == null) {
                seatData.tingMap[p] = {
                    pattern: "duidui",
                    fan: 2
                };
            }
        }
    }

    mjutils.checkTingPai(seatData, 0, 21);
    var sd = seatData;
    //var lastcard = sd.targetPai;
    for (var k in sd.tingMap) {
        var ret = sd.tingMap[k].ret;
        if (0 != (ret & flag_k5xin)) {
            sd.tingMap[k].pattern = "kawuxing";
            sd.tingMap[k].fan = 2;
            console.log("   kawuxing   ");
           
        }
        if (0 != (ret & flag_da_san_yuan)) {
            sd.tingMap[k].pattern = "DaSanYuan";
            sd.tingMap[k].fan = 8;
            console.log("   k   "+k);
            console.log("   DaSanYuan   ");
          
        }
        if ("xiaosanyuan" == issanyuan(sd)) {
            sd.tingMap[k].pattern = "xiaosanyuan";
            sd.tingMap[k].fan = 4;
             console.log("   xiaosanyuan   ");
           
        }
        if (ret & flag_win) {
            if ("mingsigui" == issigui(sd)) {
                sd.tingMap[k].pattern = "mingsigui";
                
                sd.tingMap[k].fan = 2;
                  console.log("   mingsigui   ");
            }
            if ("ansigui" == issigui(sd) && sd.tingMap[k].pattern != "7pairs") {
                sd.tingMap[k].pattern = "ansigui";
               
                sd.tingMap[k].fan = 4;
                   console.log("   ansigui   ");
            }
        }
    }

    //检查是不是平胡
    //if(seatData.que != 0){
    //    C(seatData,0,9);        
    //}
    /*
     if(seatData.que != 1){
         mjutils.checkTingPai(seatData,9,18);        
     }
 
     if(seatData.que != 2){
         mjutils.checkTingPai(seatData,18,21);        
     }
     */
}
function issigui(seatData) {

    for (var j = 0; j < 21; j++) {
        var count = seatData.countMap[j];
        if (count == 4) {
            return "ansigui";
        }
    }
    for (var i = 0; i < seatData.pengs.length; i++) {
        var peng = seatData.pengs[i];
        for (var j = 0; j < seatData.holds.length; j++) {
            if (peng == seatData.holds[j]) {
                return "mingsigui";
            }
        }
    }
}
function issanyuan(seatData) {

    var sanyuancount = 0;
    for (var j = 0; j < seatData.pengs.length; j++) {
        if (17 < seatData.pengs[j]) {
            sanyuancount++;
        }
    }
    for (var j = 0; j < seatData.wangangs.length; j++) {
        if (17 < seatData.wangangs[j]) {
            sanyuancount++;
        }
    }
    for (var j = 0; j < seatData.diangangs.length; j++) {
        if (17 < seatData.diangangs[j]) {
            sanyuancount++;
        }
    }
    for (var j = 0; j < seatData.angangs.length; j++) {
        if (17 < seatData.angangs[j]) {
            sanyuancount++;
        }
    }

    for (var i; i < seatData.countMap.length; i++) {
        if (seatData.countMap[i] >= 3) {
            if (i > 17) {
                sanyuancount++;
            }
        }
    }

    if (sanyuancount == 2) {
        for (var j = 18; j < 21; j++) {
            var count = seatData.countMap[j];
            if (count == 2) {
                return "xiaosanyuan";
            }
        }

    }
    //if(sanyuancount==3){
    //    return "DaSanYuan";
    //}   

}

function getSeatIndex(userId) {
    var seatIndex = roomMgr.getUserSeat(userId);
    if (seatIndex == null) {
        return null;
    }
    return seatIndex;
}

function getGameByUserID(userId) {
    var roomId = roomMgr.getUserRoom(userId);
    if (roomId == null) {
        return null;
    }
    var game = games[roomId];
    return game;
}

function hasOperations(seatData) {
    if (seatData.canGang || seatData.canPeng || seatData.canHu) {
        return true;
    }
    return false;
}

function sendOperations(game, seatData, pai) {
    if (hasOperations(seatData)) {
        if (pai == -1) {
            pai = seatData.holds[seatData.holds.length - 1];
        }

        var data = {
            pai: pai,
            hu: seatData.canHu,
            peng: seatData.canPeng,
            gang: seatData.canGang,
            gangpai: seatData.gangPai
        };

        //如果可以有操作，则进行操作
        //if(seatData.isliang){
        // userMgr.sendMsg(seatData.userId,'game_action_push');
        //}
        // else{
        userMgr.sendMsg(seatData.userId, 'game_action_push', data);
        data.si = seatData.seatIndex;
        //}

    }
    else {
        userMgr.sendMsg(seatData.userId, 'game_action_push');
    }
}

function moveToNextUser(game, nextSeat) {
    game.fangpaoshumu = 0;
    //找到下一个没有和牌的玩家
    if (nextSeat == null) {
        while (true) {
            game.turn++;
            game.turn %= 3;
            var turnSeat = game.gameSeats[game.turn];
            if (turnSeat.hued == false) {
                return;
            }
        }
    }
    else {
        game.turn = nextSeat;
    }
}

function doUserMoPai(game) {
    game.chuPai = -1;
    var turnSeat = game.gameSeats[game.turn];
    turnSeat.lastFangGangSeat = -1;
    //turnSeat.guoHuFan = -1;
    var pai = mopai(game, game.turn);
    //牌摸完了，结束
    if (pai == -1) {
        doGameOver(game, turnSeat.userId);
        return;
    }
    else {
        var numOfMJ = game.mahjongs.length - game.currentIndex;
        userMgr.broacastInRoom('mj_count_push', numOfMJ, turnSeat.userId, true);
    }

    recordGameAction(game, game.turn, ACTION_MOPAI, pai);
    //通知前端新摸的牌
    userMgr.sendMsg(turnSeat.userId, 'game_mopai_push', pai);

    //检查是否可以暗杠或者胡
    //检查胡，直杠，弯杠
    checkCanAnGang(game, turnSeat);
    checkCanWanGang(game, turnSeat, pai);

    //检查看是否可以和
    checkCanHu(game, turnSeat, pai);

    //广播通知玩家出牌方
    turnSeat.canChuPai = true;

    for (var i = 0; i < PLAYCOUNT; i++) {
        var Seats = game.gameSeats[i];
        userMgr.broacastInRoom('game_holds_notify_push', { userId: Seats.userId, holds: Seats.holds }, Seats.userId, true);
    }
    userMgr.broacastInRoom('game_chupai_push', turnSeat.userId, turnSeat.userId, true);

    //通知玩家做对应操作
    sendOperations(game, turnSeat, game.chuPai);

    if (turnSeat.isliang == true) {
        // if (turnSeat.canHu == true) {
        //     exports.hu(turnSeat.userId);
        // }
        // else {
        //    exports.chuPai(turnSeat.userId, pai);
        //}
    }
 
}

function isSameType(type, arr) {
    for (var i = 0; i < arr.length; ++i) {
        var t = getMJType(arr[i]);
        if (type != -1 && type != t) {
            return false;
        }
        type = t;
    }
    return true;
}

function isQingYiSe(gameSeatData) {
    var type = getMJType(gameSeatData.holds[0]);
    //检查手上的牌
    if (isSameType(type, gameSeatData.holds) == false) {
        return false;
    }
    //检查杠下的牌
    if (isSameType(type, gameSeatData.angangs) == false) {
        return false;
    }
    if (isSameType(type, gameSeatData.wangangs) == false) {
        return false;
    }
    if (isSameType(type, gameSeatData.diangangs) == false) {
        return false;
    }
    //检查碰牌
    if (isSameType(type, gameSeatData.pengs) == false) {
        return false;
    }
    return true;
}

function isMenQing(gameSeatData) {
    return (gameSeatData.pengs.length + gameSeatData.wangangs.length + gameSeatData.diangangs.length) == 0;
}


function isTinged(seatData) {
    for (var k in seatData.tingMap) {
        return true;
    }
    return false;
}

function computeFanScore(game, fan) {
    console.log("game.conf.maxFan"+game.conf.maxFan);
    if (fan > game.conf.maxFan) {
        fan = game.conf.maxFan;
    }
    return fan;//(1 << fan) * game.conf.baseScore;
}

function findMaxFanTingPai(ts) {
    //找出最大番
    var cur = null;
    for (var k in ts.tingMap) {
        var tpai = ts.tingMap[k];
        if (cur == null || tpai.fan > cur.fan) {
            cur = tpai;
        }
    }
    return cur;
}
/*
function findUnTingedPlayers(game){
    var arr = [];
    for(var i = 0; i < PLAYCOUNT; ++i){
        var ts = game.gameSeats[i];
        //如果没有胡，且没有听牌
        if(!ts.hued && !isTinged(ts)){
            arr.push(i);
            recordUserAction(game,ts,"beichadajiao",-1);
        }
    }
    return arr;
}

function chaJiao(game){
    var arr = findUnTingedPlayers(game);
    for(var i = 0; i < game.gameSeats.length; ++i){
        var ts = game.gameSeats[i];
        //如果没有胡，但是听牌了，则未叫牌的人要给钱
        if(!ts.hued && isTinged(ts)){
            var cur = findMaxFanTingPai(ts);
             sendOperations(game,turnSeat,game.chuPai);
            ts.fan = cur.fan;
            ts.pattern = cur.pattern;
            recordUserAction(game,ts,"chadajiao",arr);
        }
    }
}
*/
function liujuxiangyang(game, roomInfo) {
    var j = game.shouliang;
    var baseScore = game.conf.baseScore;

    var peifu = baseScore;
    if (2 == roomInfo.conf.zimo) {
    
        var isting = [false, false, false];
        var tingcnt = 0;
        for (var i = 0; i < PLAYCOUNT; i++) {
            for (var k in game.gameSeats[i].tingMap) {
                isting[i] = true;
                tingcnt++;
                break;
            }
        }
        if (tingcnt < PLAYCOUNT && tingcnt > 0) {
            for (var i = 0; i < PLAYCOUNT; i++) {
                if (isting[i] == true) {
                    game.gameSeats[i].score += peifu * (3 - tingcnt);
                } else {
                    game.gameSeats[i].score -= peifu * tingcnt;
                }
            }
        }
    }

    if (3 == roomInfo.conf.zimo) {
        peifu = baseScore * 2;
    }

    for (var i = 0; i < PLAYCOUNT; ++i) {
        if (i == j) {
            continue;
        }
        if (j >= 0) {
            game.gameSeats[j].score -= peifu;
            game.gameSeats[i].score += peifu;
        }
    }
}

function liuju_xiaogan_3ting(game) {
    var baseScore = game.conf.baseScore;
    for (var i = 0; i < PLAYCOUNT; ++i) {
        var liangcnt = 0;
        if (game.gameSeats[i].isliang) {
            liangcnt++;
        }
    }
    if (3 == liangcnt) {

    } else {
        var xiaoganlostfan = 0;
        for (var i = 0; i < 3; i++) {
            var xiaoganmaxfan = 0;
            var finallyscore = game.gameSeats[i];
            if (!finallyscore.isliang) {
                for (var k in game.gameSeats[i].tingMap) {
                  
                    if (xiaoganmaxfan < game.gameSeats[i].tingMap[k].fan) {
                        xiaoganmaxfan = game.gameSeats[i].tingMap[k].fan;
                    
                    }
                }
                finallyscore.score += xiaoganmaxfan * baseScore * liangcnt;
             
                xiaoganlostfan += xiaoganmaxfan * baseScore;
               
            }
        }
        for (var i = 0; i < 3; i++) {
            var finallyscore = game.gameSeats[i];
           
            if (finallyscore.isliang) {
  
                finallyscore.score -= xiaoganlostfan;

            }
        }
    }

}
function liuju_xiaogan_meiquanting(game, isxiaoganting, xiaogantingcnt) {
    var baseScore = game.conf.baseScore;
    var lostfan = 0;
    for (var i = 0; i < PLAYCOUNT; i++) {

        if (isxiaoganting[i] == true) {
           
            var maxfan = 0;
            for (var k in game.gameSeats[i].tingMap) {
            
                if (maxfan < game.gameSeats[i].tingMap[k].fan) {
                    maxfan = game.gameSeats[i].tingMap[k].fan;
                  
                }
            }
          
            game.gameSeats[i].score += baseScore * maxfan * (3 - xiaogantingcnt);
       
            lostfan += baseScore * maxfan;
        }
    }
   
    for (var i = 0; i < PLAYCOUNT; i++) {
        if (isxiaoganting[i] == true) {
         
            continue;
        }
        else {
            game.gameSeats[i].score -= lostfan;
    
        }
    }

}

function liujuxiaogan(game, roomInfo) {
    var baseScore = game.conf.baseScore;
   
    var isxiaoganting = [false, false, false];
    var xiaogantingcnt = 0;
    for (var i = 0; i < PLAYCOUNT; i++) {
        for (var k in game.gameSeats[i].tingMap) {
            isxiaoganting[i] = true;
            xiaogantingcnt++;
            break;
        }
    }
 

    if (xiaogantingcnt < PLAYCOUNT && xiaogantingcnt > 0) {//有人未听
        liuju_xiaogan_meiquanting(game, isxiaoganting, xiaogantingcnt);

    } else if (xiaogantingcnt == PLAYCOUNT) {//3人全听
        liuju_xiaogan_3ting(game);
    }
}

function liuju(game, roomInfo) {
    var baseScore = game.conf.baseScore;
 
    if (1 == roomInfo.conf.zimo || 2 == roomInfo.conf.zimo || 3 == roomInfo.conf.zimo) {//襄阳
        liujuxiangyang(game, roomInfo);
    } else if (4 == roomInfo.conf.zimo) {
        liujuxiaogan(game, roomInfo);
    }
    for (var i = 0; i < 3; i++) {
        var finallyscore = game.gameSeats[i];
        finallyscore.piaoscore = 0;
        finallyscore.mafen = 0;
        finallyscore.fan = 0;
    }
    for (var i = 0; i < 3; i++) {
        var finallyscore = game.gameSeats[i];
    }
}

function calculateResult(game, roomInfo) {

 
    var baseScore = game.conf.baseScore;
    var hu = false;
    for (var i = 0; i < PLAYCOUNT; ++i) {
        //doGangFen(game, i);
        //对所有胡牌的玩家进行统计
        //if(isTinged(sd)){   
    
        var sd = game.gameSeats[i];
        for(var j=0;j<sd.curgangfenlist.length;j++){
          sd.gangfen += sd.curgangfenlist[j];
     
        }

        if (sd.hued) {
            hu = true;
            doSuanFen(game, i);
            
            fanfenjiesuan(game, i, roomInfo);
        }
    }

    if (hu) {
      
        for (var i = 0; i < 3; i++) {
            var finallyscore = game.gameSeats[i];
            finallyscore.score += finallyscore.piaoscore * baseScore;
            finallyscore.score += finallyscore.mafen * baseScore;
            finallyscore.score += finallyscore.fan * baseScore;
        }
    }
    else {

        liuju(game, roomInfo);
    }

    // for (var i = 0; i < 3; i++) {
    //     game.gameSeats[i].score += game.gameSeats[i].gangfen * baseScore;
    // }

    for (var i = 0; i < 3; i++) {
        var finallyscore = game.gameSeats[i];
        for (var i = 0; i < 3; i++) {
            var finallyscore = game.gameSeats[i];
            console.log("//-----------------859----");
            console.log("baseScore " + baseScore);
            console.log("finallyscore.piao " + finallyscore.piao);
            console.log("finallyscore.piaoscore " + finallyscore.piaoscore);
            //console.log("finallyscore.gangfen " + finallyscore.gangfen);
            console.log("finallyscore.fan " + finallyscore.fan);
            console.log("finallyscore.shukan " + finallyscore.shukan);
            console.log("finallyscore.mafen " + finallyscore.mafen);
            console.log("finallyscore.score " + finallyscore.score);
            console.log("//--------------------");
        }
    }
}



function fanfenjiesuan(game, i, roomInfo) {
    var sd = game.gameSeats[i];
    var fan = sd.fan;
    sd.fan = 0;
    for (var a = 0; a < sd.actions.length; ++a) {
        var ac = sd.actions[a];
        if (ac.type == "zimo" || ac.type == "hu" || ac.type == "ganghua" ||
            ac.type == "gangpaohu" || ac.type == "qiangganghu") {
            //var extraScore = baseScore;
            if(ac.type == "maozhuanyu"||ac.type == "gangpaohu"||ac.type =="ganghua"){
                fan*=2;
                console.log(" ac.type  "+ac.type);
            }

            if (ac.iszimo) {
         
                var maimaxuanze = roomInfo.conf.menqing;

                if (maimaxuanze == 1) {
                    var maimapai = maima(game, i, fan);
                    userMgr.broacastInRoom('game_MaiMa_notify_push', { pai: maimapai }, sd.userId, true);
                    domaimafen(game, i);
                }
                else if (maimaxuanze == 2) {
                    if (sd.isliang) {
                        var maimapai = maima(game, i, fan);
                        userMgr.broacastInRoom('game_MaiMa_notify_push', { pai: maimapai }, sd.userId, true);
                        domaimafen(game, i);
                    } else {
                        userMgr.broacastInRoom('game_MaiMa_notify_push', { pai: -1 }, sd.userId, true);
                    }
                }
                else {
                    userMgr.broacastInRoom('game_MaiMa_notify_push', { pai: -1 }, sd.userId, true);
                }

                for (var t = 0; t < 3; ++t) {
                    if (t == i) {
                        continue;;
                    }
                    var liangDaoFan = 0;
                    liangDaoFan = fan;
                    var td = game.gameSeats[t];
                    if (sd.isliang || td.isliang) {
                        liangDaoFan = fan * 2;
                
                    }

                    sd.fan += liangDaoFan;
                    td.fan -= liangDaoFan;

                    sd.piaoscore += sd.piao + td.piao;
                    td.piaoscore -= sd.piao + td.piao;

                    sd.score += sd.shukan + td.shukan;
                    td.score -= sd.shukan + td.shukan;
                }
            }
            else {
                var six = ac.targets[0];
                var td = game.gameSeats[six];
                if (sd.isliang || td.isliang) {
                    fan *= 2;
             
                }
                 
                sd.fan += fan;
                td.fan -= fan;
                sd.piaoscore += sd.piao + td.piao;
                td.piaoscore -= sd.piao + td.piao;
                sd.score += sd.shukan + td.shukan;
                td.score -= sd.shukan + td.shukan;
                
                userMgr.broacastInRoom('game_MaiMa_notify_push', { pai: -1 ,paixing:sd.pattern}, sd.userId, true);
                td.numDianPao++;
            }
        }
    }
}

function doGangFen(game, i) {
      
    var sd = game.gameSeats[i];
    //统计杠的数目
    sd.numAnGang = sd.angangs.length;
    sd.numMingGang = sd.wangangs.length + sd.diangangs.length;

    for (var a = 0; a < sd.actions.length; ++a) {
        var ac = sd.actions[a];
        if (ac.type == "fanggang") {
            //var ts = game.gameSeats[ac.targets[0]];
            //sd.score-=baseScore;
        }

        else if (ac.type == "angang" || ac.type == "wangang" || ac.type == "diangang") {
            if (ac.state != "nop") {
                var GangScroe = 2;
                if (ac.type == "wangang") {
                    GangScroe = 1;
                }
                //GangScroe*=ac.targets.length;
                if (ac.type == "angang" || ac.type == "wangang") {
                    //for(var t = 0; t < ac.targets.length; ++t){
                    //    var six = ac.targets[t];
                    //    game.gameSeats[six].score -= GangScroe;
                    //}     
                    for (var t = 0; t < 3; t++) {
                        if (t == i) {
                            continue;;
                        }
                        var td = game.gameSeats[t];
                        sd.gangfen += GangScroe;
                        td.gangfen -= GangScroe;
                  
                    }
                }
                else {

                    var td = game.gameSeats[ac.targets[0]];
                    sd.gangfen += GangScroe;
                    td.gangfen -= GangScroe;
                    
                }
            }
        }
    }
}

function doSuanFen(game, i) {

    var fan = 1;
    var pinghu = true;
    var sd = game.gameSeats[i];
    var patterns = [];
    var roomId = roomMgr.getUserRoom(sd.userId);
    if (roomId == null) {
        return;
    }
    var roomInfo = roomMgr.getRoom(roomId);
    if (roomInfo == null) {
        return;
    }
    var pindao = roomInfo.conf.jiangdui;
    //mjutils.checkTingPai(sd,0,21); 
    if (isQingYiSe(sd)) {
        sd.qingyise = true;
        fan *= 4;
      
        patterns.push("QingYiSe");
              console.log("QingYiSe");
        pinghu = false;
    }
    if (sd.holds.length == 1 || sd.holds.length == 2) {
        fan *= 4;
       
        sd.isJinGouHu = true;

        patterns.push("JinGouHu");
             console.log("JinGouHu");
        pinghu = false;
    }
    if (sd.isHaiDiHu) {
       
        fan *= 2;
        pinghu = false;
        patterns.push("HaiDiHu");
         console.log("HaiDiHu");
    }
    if (sd.isQiangGangHu) {
        fan *= 2;
    
        patterns.push("QiangGangHu");
         console.log("QiangGangHu");
        pinghu = false;
    }
    var ret = sd.tingMap[sd.targetPai].ret;
    if (0 != (ret & flag_k5xin)) {
        var kawuxingteshu = 2;
        if (3 == roomInfo.conf.zimo) {
            kawuxingteshu = 4
        }

        fan *= kawuxingteshu;
        sd.isKaWuXIng = true;
    
        pinghu = false;
    }
    var lastcard = sd.targetPai;
    if ("mingsigui" == issigui(sd)) {
        if (pindao == 1) {
            for (var i = 0; i < sd.pengs.length; ++i) {
                var pai = sd.pengs[i];
                if (pai == lastcard) {
                    //sd.pattern = "MingSiGui";
                    patterns.push("MingSiGui");
                     console.log("MingSiGui");
                    sd.isMingSiGui = true;
                }
            }
        }
        else {
            //fan *= 2;
            //sd.pattern = "MingSiGui";
            patterns.push("MingSiGui");
              console.log("MingSiGui");
            sd.isMingSiGui = true;
        }
        pinghu = false;
    }
    if ("ansigui" == issigui(sd)) {
        if (pindao == 1) {
            for (var key in sd.countMap) {
                if (4 == sd.countMap[key] && key == lastcard) {
                    //sd.pattern = "AnSiGui";
                    patterns.push("AnSiGui");
                      console.log("AnSiGui");
                    sd.isAnSiGui = true;
                }
            }
        }
        else {
            //sd.pattern = "AnSiGui";
            patterns.push("AnSiGui");
              console.log("AnSiGui");
            sd.isAnSiGui = true;
        }
        pinghu = false;
    }
    var xiaosanyuan=false;
    if ("xiaosanyuan" == issanyuan(sd)) {
        fan *= 4;
        //sd.pattern = "XiaoSanYuan";
        patterns.push("XiaoSanYuan");
        sd.isXiaoSanYuan = true;
        xiaosanyuan=true;
        console.log("XiaoSanYuan suanfen");
        pinghu = false;
    }
    var dasanyuan=false;
    if (0 != (ret & flag_da_san_yuan)) {
        fan *= 8;
        //sd.pattern = "DaSanYuan";
        sd.isDaSanYuan = true;
        dasanyuan=true;
        patterns.push("DaSanYuan");
        console.log("DaSanYuan suanfen");
        pinghu = false;
    }
    if (!sd.isJinGouHu && !dasanyuan  && !xiaosanyuan && sd.pattern == "duidui") {
        fan *= 2;
        patterns.push("duidui");
        console.log("duidui suanfen");
        pinghu = false;
    }
    if (sd.isMingSiGui) {
        fan *= 2;
        pinghu = false;
        console.log("pinghu");
    }
    if (sd.isAnSiGui) {
        fan *= 4;  
        pinghu = false;
        console.log("isAnSiGui");
    }
    if (sd.pattern == "7pairs") {
        fan *= 4;
        pinghu = false;
        console.log("7pairs");
    }
    if(sd.isGangHu){
        fan *= 2;
        patterns.push("GangHu");
        console.log("GangHu");
    } 

    if (pinghu == true && sd.pattern == "normal") {
         console.log("normal");
        //fan = 1;
    } 
    //sd.isMenQing = isMenQing(sd);
    //if(sd.isMenQing){
    //    fan += 1;
    //    console.log("门清+1    ");  
    //}     
    fan = computeFanScore(game,fan);

    if (roomInfo.conf.hsz) {
        console.log("roomInfo.conf.hs");
        fan+=sd.numAnGang + sd.numMingGang;   
        sd.shukan+=sd.numAnGang + sd.numMingGang; 
        for (var i = 0; i < 21; i++) {
            var kanzi = sd.countMap[i];
            if (kanzi >= 3) {
                sd.shukan+=1;
            }
        }
    }

    sd.fan = fan;
  
    return fan;
    //var numOfGangs = sd.diangangs.length + sd.wangangs.length + sd.angangs.length;
    //for(var j = 0; j < sd.pengs.length; ++j){
    //    var pai = sd.pengs[j];
    //    if(sd.countMap[pai] == 1){
    //        numOfGangs++;
    //    }
    //}
    //for(var k in sd.countMap){
    //    if(sd.countMap[k] == 4){
    //        numOfGangs++;
    //    }
    //}
    //sd.numofgen = numOfGangs;   
    //fan += sd.numofgen;
    //if(sd.isGangHu){
    //    fan += 1;
    //}     
}

function doGangFenNoTing(game, i) {

    // var sd = game.gameSeats[i];
    // for (var a = sd.actions.length - 1; a >= 0; --a) {
    //     var ac = sd.actions[a];
    //     if (ac.type == "angang" || ac.type == "wangang" || ac.type == "diangang") {
    //         var GangScore = 0;
    //         if (ac.type == "angang") {
    //             GangScore = 2;
    //         }
    //         if (ac.type == "wangang" || ac.type == "diangang") {
    //             GangScore = 1;
    //         }
    //         if (ac.state != "nop") {
    //             var acscore = ac.score;
    //             sd.score += ac.targets.length * GangScore;
    //             //扣掉目标方的分
    //             for (var t = 0; t < ac.targets.length; ++t) {
    //                 var six = ac.targets[t];
    //                 game.gameSeats[six].score -= GangScore;
    //             }
    //         }
    //     }
    // }
}

function doGameOver(game, userId, forceEnd) {

    var roomId = roomMgr.getUserRoom(userId);
    if (roomId == null) {
        return;
    }
    var roomInfo = roomMgr.getRoom(roomId);
    if (roomInfo == null) {
        return;
    }

    var maimaxuanze = roomInfo.conf.menqing;

    var fnNoticeResult = function (isEnd) {
        var endinfo = null;
        if (isEnd) {
            endinfo = [];
            for (var i = 0; i < PLAYCOUNT; ++i) {
                var rs = roomInfo.seats[i];
                endinfo.push({
                    numzimo: rs.numZiMo,
                    numjiepao: rs.numJiePao,
                    numdianpao: rs.numDianPao,
                    numangang: rs.numAnGang,
                    numminggang: rs.numMingGang,
                    numchadajiao: rs.numChaJiao,
                });
            }
        }

        if(!forceEnd || game != null){//
           userMgr.broacastInRoom('game_over_push',{results:results,endinfo:endinfo},userId,true);
        }

        //如果局数已够，则进行整体结算，并关闭房间
        if (isEnd) {
            setTimeout(function () {
                if (roomInfo.numOfGames > 1) {
                    store_history(roomInfo);
                }

                userMgr.kickAllInRoom(roomId);
                roomMgr.destroy(roomId);
                db.archive_games(roomInfo.uuid);
            }, 1500);
        }
      
        //calculateResult(game,roomInfo);    
        // if(results && endinfo && results.length>2){
        //     console.log("game_over_push ----");
        //     console.log("results " + results);
        //     console.log("results[0] " + results[0].score + "  gangfen" + results[0].gangfen + "  fan" + results[0].fan);
        //     console.log("results[0] " + results[1].score + "  gangfen" + results[1].gangfen + "  fan" + results[1].fan);
        //     console.log("results[0] " + results[2].score + "  gangfen" + results[2].gangfen + "  fan" + results[2].fan);
        //     console.log("endinfo " + endinfo);
        // }
     
    }

    var results = [];
    var endinfo = null;
    var dbresult = [0, 0, 0, 0];

    if (game != null) {
        maima(game);

        if(!forceEnd){
     
            calculateResult(game, roomInfo);
        
        }
        for (var i = 0; i < PLAYCOUNT; ++i) {
            var rs = roomInfo.seats[i];
            var sd = game.gameSeats[i];

            rs.ready = false;
            rs.score += sd.score;
            rs.numZiMo += sd.numZiMo;
            rs.numJiePao += sd.numJiePao;
            rs.numDianPao += sd.numDianPao;
            rs.numAnGang += sd.numAnGang;
            rs.numMingGang += sd.numMingGang;
            rs.numChaJiao += sd.numChaJiao;

            var userRT = {
                userId: sd.userId,
                pengs: sd.pengs,
                actions: [],
                wangangs: sd.wangangs,
                diangangs: sd.diangangs,
                angangs: sd.angangs,
                numofgen: sd.numofgen,
                holds: sd.holds,
                fan: sd.fan,
                que: sd.que,
                shukan:sd.shukan,
                score: sd.score,
                piaoscore: sd.piaoscore,
                piao: sd.piao,
                totalscore: rs.score,
                qingyise: sd.qingyise,
                pattern: sd.pattern,
                isganghu: sd.isGangHu,
                menqing: sd.isMenQing,
                zhongzhang: sd.isZhongZhang,
                jingouhu: sd.isJinGouHu,
                DaSanYuan: sd.isDaSanYuan,
                XiaoSanYuan: sd.isXiaoSanYuan,
                sanYuanCount: sd.issanYuanCount,
                MingSiGui: sd.isMingSiGui,
                AnSiGui: sd.isAnSiGui,
                haidihu: sd.isHaiDiHu,
                tianhu: sd.isTianHu,
                gangfen: sd.gangfen,
                dihu: sd.isDiHu,
                KaWuXIng: sd.isKaWuXIng,
                maimapai: game.maimapai,
                maima: game.mahjongs[game.currentIndex],
                huinfo: '',
                huorder: game.hupaiList.indexOf(i),
            };

            for (var k in sd.actions) {
                userRT.actions[k] = {
                    type: sd.actions[k].type,
                };
            }
            results.push(userRT);
            dbresult[i] = sd.score;
            delete gameSeatsOfUsers[sd.userId];
        }
        delete games[roomId];
     
        var old = roomInfo.nextButton;
        if (game.yipaoduoxiang >= 0) {
            roomInfo.nextButton = game.yipaoduoxiang;
        }
        else if (game.firstHupai >= 0) {
            roomInfo.nextButton = game.firstHupai;
        }
        else {
            roomInfo.nextButton = (game.turn + 1) % PLAYCOUNT;
        }
  
        if (old != roomInfo.nextButton) {
            db.update_next_button(roomId, roomInfo.nextButton);
        }
       
    }



    if (forceEnd || game == null) {
        fnNoticeResult(true);
    
    }
    else {
        //保存游戏
        store_game(game, function (ret) {

            db.update_game_result(roomInfo.uuid, game.gameIndex, dbresult);

            //记录打牌信息
            var str = JSON.stringify(game.actionList);
            db.update_game_action_records(roomInfo.uuid, game.gameIndex, str);

            //保存游戏局数
            db.update_num_of_turns(roomId, roomInfo.numOfGames);

            //如果是第一次，并且不是强制解散 则扣除房卡
            if (roomInfo.numOfGames == 1) {
                var cost = 1;
                if (roomInfo.conf.maxGames == 8) {
                    cost = 2;
                }
                db.cost_gems(game.gameSeats[0].userId, cost);
                console.log("get_user_slyder_count_openroom  game.gameSeats[0].userId"+game.gameSeats[0].userId);
                db.get_user_slyder_count_openroom(game.gameSeats[0].userId);
                // cc.vv.http.sendRequest("/get_user_slyder_count_openroom",data);
            }

            var isEnd = (roomInfo.numOfGames >= roomInfo.conf.maxGames);
            fnNoticeResult(isEnd);
           
        });
         
    }
   
}

function recordUserAction(game, seatData, type, target) {
    var d = { type: type, targets: [] };
    if (target != null) {
        if (typeof (target) == 'number') {
            d.targets.push(target);
        }
        else {
            d.targets = target;
        }
    }
    else {
        for (var i = 0; i < PLAYCOUNT; ++i) {
            var s = game.gameSeats[i];
            if (i != seatData.seatIndex && s.hued == false) {
                d.targets.push(i);
            }
        }
    }

    seatData.actions.push(d);
    return d;
}

function recordGameAction(game, si, action, pai) {
    game.actionList.push(si);
    game.actionList.push(action);
    if (pai != null) {
        game.actionList.push(pai);
    }
}

exports.setReady = function (userId, callback) {
    var roomId = roomMgr.getUserRoom(userId);
    if (roomId == null) {
        return;
    }
    var roomInfo = roomMgr.getRoom(roomId);
    if (roomInfo == null) {
        return;
    }
    roomMgr.setReady(userId, true);

    var game = games[roomId];
    if (game == null) {
        if (roomInfo.seats.length >= PLAYCOUNT) {
            for (var i = 0; i < PLAYCOUNT; ++i) {
                var s = roomInfo.seats[i];
                if (s.ready == false || userMgr.isOnline(s.userId) == false) {
                    return;
                }
            }
            //4个人到齐了，并且都准备好了，则开始新的一局
            exports.begin(roomId);
        }
    }
    else {
        var numOfMJ = game.mahjongs.length - game.currentIndex;
        var remainingGames = roomInfo.conf.maxGames - roomInfo.numOfGames;

        var data = {
            state: game.state,
            numofmj: numOfMJ,
            button: game.button,
            turn: game.turn,
            chuPai: game.chuPai,
        };

        data.seats = [];
        var seatData = null;
        for (var i = 0; i < PLAYCOUNT; ++i) {
            var sd = game.gameSeats[i];

            var s = {
                userid: sd.userId,
                folds: sd.folds,
                angangs: sd.angangs,
                diangangs: sd.diangangs,
                wangangs: sd.wangangs,
                pengs: sd.pengs,
                que: sd.que,
                hued: sd.hued,
                iszimo: sd.iszimo,
                liangDao: sd.isliang,
                koudao: sd.koucard,
                gangshanggang:sd.gangshanggang,
            }
            if (sd.userId == userId || sd.isliang) {
                s.holds = sd.holds;

                seatData = sd;
            }
            data.seats.push(s);
        }

        //同步整个信息给客户端
        userMgr.sendMsg(userId, 'game_sync_push', data);
        for (var i = 0; i < PLAYCOUNT; ++i) {
            var sd = data.seats[i];
            if (sd.isliang) {
                userMgr.broacastInRoom('ting_notify_push', { seatindex: sd.seatIndex, index: sd.koucard, holds: sd.holds }, sd.userId, true);
                var koupaicount = 0;
                for (var i = 0; seatData.koucard.length; i++) {
                    koupaicount += seatData.koucard[i] * Math.pow(100, i);
                }
                recordGameAction(game, seatData.seatIndex, ACTION_LIANG, koupaicount);
            }

        }
        sendOperations(game, seatData, game.chuPai);
    }
}

function store_single_history(userId, history) {
    db.get_user_history(userId, function (data) {
        if (data == null) {
            data = [];
        }
        while (data.length >= 10) {
            data.shift();
        }
        data.push(history);
        db.update_user_history(userId, data);
    });
}

function store_history(roomInfo) {
    var seats = roomInfo.seats;
    var history = {
        uuid: roomInfo.uuid,
        id: roomInfo.id,
        time: roomInfo.createTime,
        seats: new Array(PLAYCOUNT)
    };

    for (var i = 0; i < PLAYCOUNT; ++i) {
        var rs = seats[i];
        var hs = history.seats[i] = {};
        hs.userid = rs.userId;
        hs.name = crypto.toBase64(rs.name);
        hs.score = rs.score;
    }

    for (var i = 0; i < PLAYCOUNT; ++i) {
        var s = seats[i];
        store_single_history(s.userId, history);
    }
}

function construct_game_base_info(game) {
    var baseInfo = {
        type: game.conf.type,
        button: game.button,
        index: game.gameIndex,
        mahjongs: game.mahjongs,
        game_seats: new Array(PLAYCOUNT),
        que: new Array(PLAYCOUNT)
    }

    for (var i = 0; i < PLAYCOUNT; ++i) {
        baseInfo.game_seats[i] = game.gameSeats[i].holds;
        baseInfo.que[i]=game.gameSeats[i].que;
    }
    game.baseInfoJson = JSON.stringify(baseInfo);
}

function store_game(game, callback) {

    db.create_game(game.roomInfo.uuid, game.gameIndex, game.baseInfoJson, callback);
  
}

//开始新的一局
exports.begin = function (roomId) {
   
    var roomInfo = roomMgr.getRoom(roomId);
    if (roomInfo == null) {
        return;
    }
    
    if(!roomInfo.nextButton){
        roomInfo.nextButton = 0;
    }
    var seats = roomInfo.seats;
    if (roomInfo.status == 0) {
        db.update_room_status(roomId, roomInfo.status, function (sts) {
            roomInfo.status = 1;
            // console.log("status" + sts);
            // if(sts){
            //     console.log("update room status ok");
            // }
            // else{
            //     console.log("update room status fail");
            // }
        });
    }
    var game = {
        conf: roomInfo.conf,
        roomInfo: roomInfo,
        gameIndex: roomInfo.numOfGames,

        button: roomInfo.nextButton,
        mahjongs: new Array(84),
        currentIndex: 0,
        gameSeats: new Array(PLAYCOUNT),

        numOfQue: 0,
        turn: 0,
        chuPai: -1,
        state: "idle",
        firstHupai: -1,
        yipaoduoxiang: -1,
        fangpaoshumu: -1,
        actionList: [],
        hupaiList: [],
        chupaiCnt: 0,
        maimapai: -1,
        piaofen: {},
        gangshanggang:[],
    };
    roomInfo.numOfGames++;
   
    for (var i = 0; i < PLAYCOUNT; ++i) {
        var data = game.gameSeats[i] = {};
        data.game = game;
        data.seatIndex = i;
        data.userId = seats[i].userId;
        //持有的牌
        data.holds = [];
        //打出的牌
        data.folds = [];
        data.folds.length = 0;
        //暗杠的牌
        data.angangs = [];
        data.angangs.length = 0;
        //点杠的牌
        data.diangangs = [];
        data.diangangs.length = 0;
        //弯杠的牌
        data.wangangs = [];
        data.wangangs.length = 0;
        //碰了的牌
        data.pengs = [];
        data.pengs.length = 0;

        data.gangshanggang = [];

        data.curGangScore=0;

        data.piao = 0;

        if (roomInfo.numOfGames == 1) {
            data.que = -1;
        }
        //玩家手上的牌的数目，用于快速判定碰杠
        data.countMap = {};
        //玩家听牌，用于快速判定胡了的番数
        data.tingMap = {};
        data.pattern = "";
        //是否可以杠
        data.canGang = false;
        //用于记录玩家可以杠的牌
        data.gangPai = [];

        data.guogang = [];

        //是否可以碰
        data.canPeng = false;
        //是否可以胡
        data.canHu = false;
        //是否可以出牌
        data.canChuPai = true;

        //如果guoHuFan >=0 表示处于过胡状态，
        //如果过胡状态，那么只能胡大于过胡番数的牌
        //data.guoHuFan = -1;

        //是否胡了
        data.hued = false;
        data.shukan = 0;
        //是否是自摸
        data.iszimo = false;
        data.isGangHu = false;
        data.isliang = false;
        //
        data.piaoscore = 0;
        data.mafen = 0;
        data.fan = 0;
        data.gangfen = 0;
        data.curgangfenlist = [];

        data.actions = [];
        data.koucard = [];
        data.score = 0;
        data.lastFangGangSeat = -1;
        //统计信息
        data.numZiMo = 0;
        data.numJiePao = 0;
        data.numDianPao = 0;
        data.numAnGang = 0;
        data.numMingGang = 0;

        gameSeatsOfUsers[data.userId] = data;
    }

    games[roomId] = game;
    for (var i = 0; i < PLAYCOUNT; ++i) {
        var seatData = gameSeatsOfUsers[i];
        //清除所有的操作
        clearAllOptions(game, seatData);
    }
    //洗牌
    shuffle(game);
    //发牌
    deal(game);
    var numOfMJ = game.mahjongs.length - game.currentIndex;
  
    var quanpindao = roomInfo.conf.jiangdui;//全频道 半频道
    var liangdaozimomaima = roomInfo.conf.menqing;//自摸买码  亮倒自摸买码 
    var shukan = roomInfo.conf.hsz;//数坎
    var shierzhang = roomInfo.conf.tiandihu;//少于12张不可明//???> 
    var diqu = roomInfo.conf.zimo;//地区//???> 
    var maxFan =roomInfo.conf.maxFan;//封顶
    var maxGames =roomInfo.conf.maxGames;//
    // console.log("------------------------------------------");
    // console.log("quanpindao " + quanpindao);
    // console.log("liangdaozimomaima " + liangdaozimomaima);
    // console.log("shukan " + shukan);
    // console.log("shierzhang " + shierzhang);
    // console.log("diqu " + diqu);
     console.log("maxFan " + maxFan);
     console.log("maxGames " + maxGames);
     console.log("------------------------------------------");

    for (var i = 0; i < PLAYCOUNT; ++i) {
        //开局时，通知前端必要的数据
        var s = seats[i];
        //通知玩家手牌
        userMgr.sendMsg(s.userId, 'game_holds_push', game.gameSeats[i].holds);
        userMgr.broacastInRoom('game_holds_notify_push', { userId: s.userId, holds: game.gameSeats[i].holds }, s.userId, true);
        //通知还剩多少张牌
        userMgr.sendMsg(s.userId, 'mj_count_push', numOfMJ);
        //通知还剩多少局
        userMgr.sendMsg(s.userId, 'game_num_push', roomInfo.numOfGames);
        //通知游戏开始
        userMgr.sendMsg(s.userId, 'game_begin_push', game.button);

        var seatData = gameSeatsOfUsers[s.userId];

        if (s.que == -1) {
            game.state = "dingque";
            userMgr.sendMsg(s.userId, 'game_dingque_push');
        } else {
            game.state = "dingque";
            exports.dingQue(s.userId, roomInfo.piaofen[s.userId]);
        }
    }
}

/*
exports.huanSanZhang = function(userId,p1,p2,p3){
    var seatData = gameSeatsOfUsers[userId];
    if(seatData == null){
        console.log("can't find user game data.");
        return;
    }

    var game = seatData.game;
    if(game.state != "huanpai"){
        console.log("can't recv huansanzhang when game.state == " + game.state);
        return;
    }

    if(seatData.huanpais != null){
        console.log("player has done this action.");
        return;
    }

    if(seatData.countMap[p1] == null || seatData.countMap[p1] == 0){
        return;
    }
    seatData.countMap[p1]--;

    if(seatData.countMap[p2] == null || seatData.countMap[p2] == 0){
        seatData.countMap[p1]++;
        return;
    }
    seatData.countMap[p2]--;

    if(seatData.countMap[p3] == null || seatData.countMap[p3] == 0){
        seatData.countMap[p1]++;
        seatData.countMap[p2]++;
        return;
    }

    seatData.countMap[p1]++;
    seatData.countMap[p2]++;

    seatData.huanpais = [p1,p2,p3];
    
    for(var i = 0; i < seatData.huanpais.length; ++i){
        var p = seatData.huanpais[i];
        var idx = seatData.holds.indexOf(p);
        seatData.holds.splice(idx,1);
        seatData.countMap[p] --;
    }
    userMgr.sendMsg(seatData.userId,'game_holds_push',seatData.holds);
    
    for(var i = 0; i < game.gameSeats.length; ++i){
        var sd = game.gameSeats[i];
        if(sd == seatData){
            var rd = {
                si:seatData.userId,
                huanpais:seatData.huanpais
            };
            userMgr.sendMsg(sd.userId,'huanpai_notify',rd);            
        }
        else{
            var rd = {
                si:seatData.userId,
                huanpais:[]
            };
            userMgr.sendMsg(sd.userId,'huanpai_notify',rd);
        }
    }

    //如果还有未换牌的玩家，则继承等待
    for(var i = 0; i < game.gameSeats.length; ++i){
        if(game.gameSeats[i].huanpais == null){
            return;
        }
    }


    //换牌函数
    var fn = function(s1,huanjin){
        for(var i = 0; i < huanjin.length; ++i){
            var p = huanjin[i];
            s1.holds.push(p);
            if(s1.countMap[p] == null){
                s1.countMap[p] = 0;    
            }
            s1.countMap[p] ++;
        }
    }

    //开始换牌
    var f = Math.random();
    var s = game.gameSeats;
    var huanpaiMethod = 0;
    //对家换牌
    if(f < 0.33){
        fn(s[0],s[2].huanpais);
        fn(s[1],s[3].huanpais);
        fn(s[2],s[0].huanpais);
        fn(s[3],s[1].huanpais);
        huanpaiMethod = 0;
    }
    //换下家的牌
    else if(f < 0.66){
        fn(s[0],s[1].huanpais);
        fn(s[1],s[2].huanpais);
        fn(s[2],s[3].huanpais);
        fn(s[3],s[0].huanpais);
        huanpaiMethod = 1;
    }
    //换上家的牌
    else{
        fn(s[0],s[3].huanpais);
        fn(s[1],s[0].huanpais);
        fn(s[2],s[1].huanpais);
        fn(s[3],s[2].huanpais);
        huanpaiMethod = 2;
    }
    
    var rd = {
        method:huanpaiMethod,
    }
    game.huanpaiMethod = huanpaiMethod;

    game.state = "dingque";
    for(var i = 0; i < s.length; ++i){
        var userId = s[i].userId;
        userMgr.sendMsg(userId,'game_huanpai_over_push',rd);

        userMgr.sendMsg(userId,'game_holds_push',s[i].holds);
        //通知准备定缺
        userMgr.sendMsg(userId,'game_dingque_push');
    }
};
*/
exports.dingQue = function (userId, type) {

    var roomId = roomMgr.getUserRoom(userId);
    if (roomId == null) {
        return;
    }
    var roomInfo = roomMgr.getRoom(roomId);
    if (roomInfo == null) {
        return;
    }
    var seatIndex = getSeatIndex(userId);
    var seatData = gameSeatsOfUsers[userId];

    if (seatData == null) {
        console.log("dingQue can't find user game data.");
        return;
    }

    var game = seatData.game;
    if (game.state != "dingque") {
        console.log("can't recv dingQue when game.state == " + game.state);
        return;
    }
    

    roomInfo.seats[seatIndex].que = type;
    seatData.que = type;
    seatData.piao = parseInt(type);
    roomInfo.piaofen[userId] = parseInt(type);

    if (seatData.piao > -1) {
        game.numOfQue++;
    }
    //检查玩家可以做的动作
    //如果4个人都定缺了，通知庄家出牌

    if (game.numOfQue == 3) {
        construct_game_base_info(game);
        var arr = [1, 1, 1];
        for (var i = 0; i < game.gameSeats.length; ++i) {
            arr[i] = game.gameSeats[i].piao;
        }
        userMgr.broacastInRoom('game_dingque_finish_push', arr, seatData.userId, true);
        userMgr.broacastInRoom('game_playing_push', null, seatData.userId, true);

        //进行听牌检查
        for (var i = 0; i < game.gameSeats.length; ++i) {
            var duoyu = -1;
            var gs = game.gameSeats[i];
            checkCanTingPai(game, gs);
        }

        var turnSeat = game.gameSeats[game.turn];
        game.state = "playing";
        //通知玩家出牌方
        turnSeat.canChuPai = true;
        userMgr.broacastInRoom('game_chupai_push', turnSeat.userId, turnSeat.userId, true);
        //检查是否可以暗杠或者胡
        //直杠
        checkCanAnGang(game, turnSeat);
        //检查胡 用最后一张来检查
        checkCanHu(game, turnSeat, turnSeat.holds[turnSeat.holds.length - 1]);
        //通知前端
        sendOperations(game, turnSeat, game.chuPai);
    }
    else {
        userMgr.broacastInRoom('game_dingque_notify_push', seatData.userId, seatData.userId, true);
    }
}

exports.tingpai = function (userId, data) {

    seatData = gameSeatsOfUsers[userId];
    if (seatData == null) {
        return;
    }
    if (false == isTinged(seatData)) {
        return;
    }
    if(data)
        seatData.koucard = data;
    else{
        seatData.koucard = []
    }
    seatData.isliang = true;
    var game = seatData.game;
    if (game.shouliang == null) {
        game.shouliang = seatData.seatIndex;
    }
    else {
        game.shouliang = -1;
    }
    userMgr.broacastInRoom('ting_notify_push', { seatindex: seatData.seatIndex, index: data, holds: seatData.holds }, userId, true);
  
    if (seatData.koucard != null && seatData.koucard != "undefined" && seatData.koucard.length>0) {
        var koupaicount = 0;
        
        for (var i = 0; i < seatData.koucard.length; i++) {
            koupaicount += seatData.koucard[i] * Math.pow(100, i);
        }
        recordGameAction(game, seatData.seatIndex, ACTION_LIANG, koupaicount);
    }else{
        recordGameAction(game, seatData.seatIndex, ACTION_LIANG, 0);
    }
}

exports.chuPai = function (userId, pai) {

    pai = Number.parseInt(pai);
    var seatData = gameSeatsOfUsers[userId];
    if (seatData == null) {
        console.log("chuPai can't find user game data.");
        return;
    }
    var game = seatData.game;
    var seatIndex = seatData.seatIndex;
    //如果不该他出，则忽略
    if (game.turn != seatData.seatIndex) {
        console.log("not your turn.");
        return;
    }
    if (seatData.canChuPai == false) {
        console.log('no need chupai.');
        return;
    }

    if (hasOperations(seatData)) {
        console.log('plz guo before you chupai.');
        return;
    }
    //从此人牌中扣除
    var index = seatData.holds.indexOf(pai);
    if (index == -1) {
        console.log("can't find mj." + pai);
        return;
    }
    seatData.canChuPai = false;
    game.chupaiCnt++;
    //seatData.guoHuFan = -1;

    seatData.holds.splice(index, 1);
    seatData.countMap[pai]--;
    game.chuPai = pai;
    recordGameAction(game, seatData.seatIndex, ACTION_CHUPAI, pai);
    checkCanTingPai(game, seatData);
    userMgr.broacastInRoom('game_chupai_notify_push', { userId: seatData.userId, pai: pai }, seatData.userId, true);

    //如果出的牌可以胡，则算过胡
    //if(seatData.tingMap[game.chuPai]){
    //    seatData.guoHuFan = seatData.tingMap[game.chuPai].fan;
    // }
    //检查是否有人要胡，要碰 要杠
    var hasActions = false;
    for (var i = 0; i < PLAYCOUNT; ++i) {
        //玩家自己不检查
        if (game.turn == i) {
            continue;
        }
        var ddd = game.gameSeats[i];
        //已经和牌的不再检查
        if (ddd.hued) {
            continue;
        }

        checkCanPeng(game, ddd, pai);
        checkCanDianGang(game, ddd, pai);
        checkCanHu(game, ddd, pai);
        if (!ddd.isliang && !seatData.isliang && seatData.lastFangGangSeat < 0) {
            
            if (ddd.canHu == true && ddd.tingMap[pai].pattern == "normal") {
                var lastmahjongscount = game.mahjongs.length - game.currentIndex;
                if (isQingYiSe(seatData) || lastmahjongscount==0) {
                    ddd.canHu = true;
                }
                else{
                    ddd.canHu = false;
                   
                }
            }
        }
    
        if (hasOperations(ddd)) {
            sendOperations(game, ddd, game.chuPai);
            hasActions = true;
        }

        // if (ddd.isliang == true) {
        //     if (ddd.canHu == true) {
        //         console.log("ddd.userId    "+ddd.userId);
        //         exports.hu(ddd.userId);
        //     }
        // }

    }
    //如果没有人有操作，则向下一家发牌，并通知他出牌
    if (!hasActions) {
        setTimeout(function () {
            userMgr.broacastInRoom('guo_notify_push', { userId: seatData.userId, pai: game.chuPai }, seatData.userId, true);
            seatData.folds.push(game.chuPai);
            game.chuPai = -1;
            moveToNextUser(game);
            doUserMoPai(game);
        }, 500);
    }
};

exports.peng = function (userId) {
    var seatData = gameSeatsOfUsers[userId];
    if (seatData == null) {
        console.log("peng can't find user game data.");
        return;
    }
    var game = seatData.game;
    //如果是他出的牌，则忽略
    if (game.turn == seatData.seatIndex) {
        console.log("it's your turn.");
        return;
    }
    //如果没有碰的机会，则不能再碰
    if (seatData.canPeng == false) {
        console.log("seatData.peng == false");
        return;
    }
    //和的了，就不要再来了
    if (seatData.hued) {
        console.log('you have already hued. no kidding plz.');
        return;
    }
    //如果有人可以胡牌，则需要等待
    var i = game.turn;
    while (true) {
        var i = (i + 1) % PLAYCOUNT;
        if (i == game.turn) {
            break;
        }
        else {
            var ddd = game.gameSeats[i];
            if (ddd.canHu && i != seatData.seatIndex) {
                return;
            }
        }
    }
    clearAllOptions(game);

    //验证手上的牌的数目
    var pai = game.chuPai;
    var c = seatData.countMap[pai];
    if (c == null || c < 2) {
        return;
    }
    //进行碰牌处理
    //扣掉手上的牌
    //从此人牌中扣除
    for (var i = 0; i < 2; ++i) {
        var index = seatData.holds.indexOf(pai);
        if (index == -1) {
            console.log("can't find mj.");
            return;
        }
        seatData.holds.splice(index, 1);
        seatData.countMap[pai]--;
    }
    seatData.pengs.push(pai);
    game.chuPai = -1;

    recordGameAction(game, seatData.seatIndex, ACTION_PENG, pai);

    //广播通知其它玩家
    userMgr.broacastInRoom('peng_notify_push', { userid: seatData.userId, pai: pai }, seatData.userId, true);

    //碰的玩家打牌
    moveToNextUser(game, seatData.seatIndex);

    //广播通知玩家出牌方
    seatData.canChuPai = true;
    userMgr.broacastInRoom('game_chupai_push', seatData.userId, seatData.userId, true);
};

exports.isPlaying = function (userId) {
    var seatData = gameSeatsOfUsers[userId];
    if (seatData == null) {
        return false;
    }

    var game = seatData.game;

    if (game.state == "idle") {
        return false;
    }
    return true;
}

function checkCanQiangGang(game, turnSeat, seatData, pai) {
    var hasActions = false;
    for (var i = 0; i < PLAYCOUNT; ++i) {
        //杠牌者不检查
        if (seatData.seatIndex == i) {
            continue;
        }
        var ddd = game.gameSeats[i];
        //已经和牌的不再检查
        if (ddd.hued) {
            continue;
        }

        checkCanHu(game, ddd, pai);
        if (ddd.canHu) {
            sendOperations(game, ddd, pai);
            hasActions = true;
        }
    }
    if (hasActions) {
        game.qiangGangContext = {
            turnSeat: turnSeat,
            seatData: seatData,
            pai: pai,
            isValid: true,
        }
    }
    else {
        game.qiangGangContext = null;
    }
    return game.qiangGangContext != null;
}

_CCC = {
    extend: function (deep, target, options) {
        for (name in options) {
            copy = options[name];
            if (deep && copy instanceof Array) {
                target[name] = _CCC.extend(deep, [], copy);
            } else if (deep && copy instanceof Object) {
                target[name] = _CCC.extend(deep, {}, copy);
            } else {
                target[name] = options[name];
            }
        }
        return target;
    }
};

//计算杠时：该收的钱，该给的钱
function calculateGangScore(game,seatData,gangtype){

    seatData.curGangScore = 0;
    var baseScore = game.conf.baseScore;
    var totalGet = 0;
    for(var i = 0; i < game.gameSeats.length; ++i){
        var seat = game.gameSeats[i];
        if(seat.userId == seatData.userId){
            continue;
        }
        seat.curGangScore = 0;        
        if(gangtype == "angang"){
            var totalGive = 2; 
            for(var j=0;j < seatData.gangshanggang.length;j++){
                if(seatData.gangshanggang[j]>=1){
                    totalGive *= Math.pow(2,seatData.gangshanggang[j]); 
                }
            }
            seat.curGangScore = 0 - totalGive;
            seat.curgangfenlist.push(0 - totalGive);
            totalGet += totalGive;     
            console.log("  angang ");  
            console.log("  seat.score "+  seat.score);
            seat.score -= totalGive;     
            console.log("  seat.score "+  seat.score);  
            console.log("  seat.curGangScore "+  seat.curGangScore);
        }
        if(gangtype == "wangang"){
            var totalGive = 1;
            console.log("  seat.gangfen "+  seat.gangfen);
            for(var j=0;j < seatData.gangshanggang.length;j++){
                if(seatData.gangshanggang[j]>=1){
                    totalGive *= Math.pow(2,seatData.gangshanggang[j]);
                }
            }
            seat.curGangScore = 0 - totalGive;
            seat.curgangfenlist.push(0 - totalGive);
            totalGet += totalGive;
            console.log("  wangang ");  
            console.log("  seat.score "+  seat.score);
            seat.score -= totalGive;   
            console.log("  seat.score "+  seat.score);    
            console.log("  seat.curGangScore "+  seat.curGangScore);
        }
    }
    
    seatData.curgangfenlist.push(totalGet);
    seatData.curGangScore = totalGet;
    console.log("  seatData.score "+  seatData.score);
    seatData.score += totalGet;
    console.log("  seatData.score "+  seatData.score);
    seatData.gangshanggang=[];
}

//计算点杠时：该收的钱，该给的钱
function calculateDianGangScore(game,seatData,gangtype,gameTurn){
    seatData.curGangScore = 0;
    var baseScore = game.conf.baseScore;
    var seat = game.gameSeats[gameTurn];
    //console.log("  seat.gangfen "+  seat.gangfen); 
    var totalGive = 2;//Math.pow(2,seat.laizifoldCnt + seatData.laizifoldCnt) * baseScore;
    for(var j=0;j < seatData.gangshanggang.length;j++){
        if(seatData.gangshanggang[j]>=1){
            totalGive *= Math.pow(2,seatData.gangshanggang[j]);
        }
    }
    seat.curGangScore = 0 - totalGive;
    seat.curgangfenlist.push(0 - totalGive); 
    console.log("  seat.curGangScore "+  seat.curGangScore);
    console.log("  seat.score "+  seat.score);
    seat.score -= totalGive;
    console.log("  seat.score "+  seat.score);

    seatData.curgangfenlist.push(totalGive);    
    seatData.curGangScore = totalGive;
    console.log("  seatData.score "+  seatData.score);
    seatData.score += totalGive; 
    console.log("  seatData.score "+  seatData.score);
    seatData.gangshanggang=[];

}

function doGang(game, turnSeat, seatData, gangtype, numOfCnt, pai) {
    var seatIndex = seatData.seatIndex;
    var gameTurn = turnSeat.seatIndex;

    var isZhuanShouGang = false;
    if (gangtype == "wangang") {
        var idx = seatData.pengs.indexOf(pai);
        if (idx >= 0) {
            seatData.pengs.splice(idx, 1);
        }

        //如果最后一张牌不是杠的牌，则认为是转手杠
        // if (seatData.holds[seatData.holds.length - 1] != pai) {
        //     isZhuanShouGang = true;
        // }
    }
    //进行碰牌处理
    //扣掉手上的牌
    //从此人牌中扣除
    for (var i = 0; i < numOfCnt; ++i) {
        var index = seatData.holds.indexOf(pai);
        if (index == -1) {
            return;
        }
        seatData.holds.splice(index, 1);
        seatData.countMap[pai]--;
    }

    recordGameAction(game, seatData.seatIndex, ACTION_GANG, pai);

    //记录下玩家的杠牌
    if (gangtype == "angang") {
        seatData.angangs.push(pai);
        var ac = recordUserAction(game, seatData, "angang");
        ac.score = 2;//game.conf.baseScore * 2;

        calculateGangScore(game,seatData,gangtype);
    }
    else if (gangtype == "diangang") {
        seatData.diangangs.push(pai);
        var ac = recordUserAction(game, seatData, "diangang", gameTurn);
        ac.score = 2;//game.conf.baseScore * 2;
        var fs = turnSeat;
        recordUserAction(game, fs, "fanggang", seatIndex);
        calculateDianGangScore(game,seatData,gangtype,gameTurn);
    }
    else if (gangtype == "wangang") {
        seatData.wangangs.push(pai);
        if (isZhuanShouGang == false) {
            var ac = recordUserAction(game, seatData, "wangang");
            ac.score = 1;//game.conf.baseScore;
        }
        else {
            recordUserAction(game, seatData, "zhuanshougang");
        }
        calculateGangScore(game,seatData,gangtype);
    }

    checkCanTingPai(game, seatData);
     //计算给前端的分
    var retData = [];   
    for(var j = 0; j < 3; ++j){
        var ret ={
            userId:0,
            changeScore:0,
            finalScore:0
        }; 
        ret.userId = game.gameSeats[j].userId;
        ret.changeScore = game.gameSeats[j].curGangScore;  
        ret.finalScore = game.gameSeats[j].score;
        console.log("game.gameSeats[j].score  gang"+game.gameSeats[j].score);
        retData.push(ret);
    }
    //通知其他玩家，有人杠了牌 
    console.log();
    userMgr.broacastInRoom('gang_notify_push',{userid:seatData.userId,pai:pai,gangtype:gangtype,gangScore:retData},seatData.userId,true);

    //变成自己的轮子
    moveToNextUser(game, seatIndex);
    //再次摸牌
    doUserMoPai(game);

    //只能放在这里。因为过手就会清除杠牌标记
    seatData.lastFangGangSeat = gameTurn;
}

exports.gang = function (userId, pai) {
    var seatData = gameSeatsOfUsers[userId];
    if (seatData == null) {
        console.log("gang can't find user game data.");
        return;
    }

    var seatIndex = seatData.seatIndex;
    var game = seatData.game;

    //如果没有杠的机会，则不能再杠
    if (seatData.canGang == false) {
        console.log("seatData.gang == false");
        return;
    }

    //和的了，就不要再来了
    if (seatData.hued) {
        console.log('you have already hued. no kidding plz.');
        return;
    }

    if (seatData.gangPai.indexOf(pai) == -1) {
        console.log("the given pai can't be ganged.");
        return;
    }

    //如果有人可以胡牌，则需要等待
    var i = game.turn;
    while (true) {
        var i = (i + 1) % PLAYCOUNT;
        if (i == game.turn) {
            break;
        }
        else {
            var ddd = game.gameSeats[i];
            if (ddd.canHu && i != seatData.seatIndex) {
                return;
            }
        }
    }

    var numOfCnt = seatData.countMap[pai];

    var gangtype = ""
    //弯杠 去掉碰牌
    if (numOfCnt == 1) {
        gangtype = "wangang"
    }
    else if (numOfCnt == 3) {
        gangtype = "diangang"
    }
    else if (numOfCnt == 4) {
        gangtype = "angang";
    }
    else {
        return;
    }

    game.chuPai = -1;
    clearAllOptions(game);
    seatData.canChuPai = false;



    //如果是弯杠，则需要检查是否可以抢杠
    var turnSeat = game.gameSeats[game.turn];
    if (numOfCnt == 1) {
        var canQiangGang = checkCanQiangGang(game, turnSeat, seatData, pai);
        if (canQiangGang) {
            return;
        }
    }

    doGang(game, turnSeat, seatData, gangtype, numOfCnt, pai);
};

exports.hu = function (userId) {
    var seatData = gameSeatsOfUsers[userId];
    if (seatData == null) {
        console.log("hu can't find user game data.");
        return;
    }

    var seatIndex = seatData.seatIndex;
    var game = seatData.game;

    //如果他不能和牌，那和个啥啊
    if (seatData.canHu == false) {
        console.log("invalid request.");
        return;
    }

    //和的了，就不要再来了
    if (seatData.hued) {
        console.log('you have already hued. no kidding plz.');
        return;
    }

    //标记为和牌
    seatData.hued = true;
    var hupai = game.chuPai;
    var isZimo = false;

    var turnSeat = game.gameSeats[game.turn];
    seatData.isGangHu = turnSeat.lastFangGangSeat >= 0;
    var notify = -1;

    if (game.qiangGangContext != null) {
        var gangSeat = game.qiangGangContext.seatData;
        hupai = game.qiangGangContext.pai;
        notify = hupai;
        var ac = recordUserAction(game, seatData, "qiangganghu", gangSeat.seatIndex);
        ac.iszimo = false;
        recordGameAction(game, seatIndex, ACTION_HU, hupai);
        seatData.isQiangGangHu = true;
        game.qiangGangContext.isValid = false;


        var idx = gangSeat.holds.indexOf(hupai);
        if (idx != -1) {
            gangSeat.holds.splice(idx, 1);
            gangSeat.countMap[hupai]--;
            userMgr.sendMsg(gangSeat.userId, 'game_holds_push', gangSeat.holds);
        }
        //将牌添加到玩家的手牌列表，供前端显示
        seatData.holds.push(hupai);
        if (seatData.countMap[hupai]) {
            seatData.countMap[hupai]++;
        }
        else {
            seatData.countMap[hupai] = 1;
        }

        recordUserAction(game, gangSeat, "beiqianggang", seatIndex);
    }
    else if (game.chuPai == -1) {
        hupai = seatData.holds[seatData.holds.length - 1];
        notify = -1;
        if (seatData.isGangHu) {
            if (turnSeat.lastFangGangSeat == seatIndex) {
                var ac = recordUserAction(game, seatData, "ganghua");
                ac.iszimo = true;
            }
            else {
                var diangganghua_zimo = game.conf.dianganghua == 1;
                if (diangganghua_zimo) {
                    var ac = recordUserAction(game, seatData, "dianganghua");
                    ac.iszimo = true;
                }
                else {
                    var ac = recordUserAction(game, seatData, "dianganghua", turnSeat.lastFangGangSeat);
                    ac.iszimo = false;
                }
            }
        }
        else {
            var ac = recordUserAction(game, seatData, "zimo");
            ac.iszimo = true;
        }

        isZimo = true;
        recordGameAction(game, seatIndex, ACTION_ZIMO, hupai);
    }
    else {
        notify = game.chuPai;
        //将牌添加到玩家的手牌列表，供前端显示
        seatData.holds.push(game.chuPai);
        if (seatData.countMap[game.chuPai]) {
            seatData.countMap[game.chuPai]++;
        }
        else {
            seatData.countMap[game.chuPai] = 1;
        }

        var at = "hu";
        //炮胡
        if (turnSeat.lastFangGangSeat >= 0) {
            at = "gangpaohu";
        }
        var ac = recordUserAction(game, seatData, at, game.turn);
        ac.iszimo = false;

        //毛转雨
        if (turnSeat.lastFangGangSeat >= 0) {
            for (var i = turnSeat.actions.length - 1; i >= 0; --i) {
                var t = turnSeat.actions[i];
                if (t.type == "diangang" || t.type == "wangang" || t.type == "angang") {
                    t.state = "nop";
                    t.payTimes = 0;

                    var nac = {
                        type: "maozhuanyu",
                        owner: turnSeat,
                        ref: t
                    }
                    seatData.actions.push(nac);
                    break;
                }
            }
        }

        //记录玩家放炮信息
        var fs = game.gameSeats[game.turn];
        recordUserAction(game, fs, "fangpao", seatIndex);
        recordGameAction(game, seatIndex, ACTION_HU, hupai);
        game.fangpaoshumu++;
        if (game.fangpaoshumu > 1) {
            game.yipaoduoxiang = seatIndex;
        }
    }

    if (game.firstHupai < 0) {
        game.firstHupai = seatIndex;
    }

    //保存番数
    var ti = seatData.tingMap[hupai];
    seatData.fan = ti.fan;
    seatData.pattern = ti.pattern;
    seatData.iszimo = isZimo;
    //如果是最后一张牌，则认为是海底胡
    seatData.isHaiDiHu = game.currentIndex == game.mahjongs.length;
    game.hupaiList.push(seatData.seatIndex);

    clearAllOptions(game, seatData);

    //通知前端，有人和牌了
    userMgr.broacastInRoom('hu_push', { seatindex: seatIndex, iszimo: isZimo, hupai: notify }, seatData.userId, true);

    //
    if (game.lastHuPaiSeat == -1) {
        game.lastHuPaiSeat = seatIndex;
    }
    else {
        var lp = (game.lastFangGangSeat - game.turn + PLAYCOUNT) % PLAYCOUNT;
        var cur = (seatData.seatIndex - game.turn + PLAYCOUNT) % PLAYCOUNT;
        if (cur > lp) {
            game.lastHuPaiSeat = seatData.seatIndex;
        }
    }

    //如果还有人可以胡牌，则等待
    for (var i = 0; i < PLAYCOUNT; ++i) {
        var ddd = game.gameSeats[i];
        if (ddd.canHu && i != seatIndex) {
            return;
        }
    }

    //如果只有一家没有胡，则结束
    var numOfHued = 0;
    for (var i = 0; i < PLAYCOUNT; ++i) {
        var ddd = game.gameSeats[i];
        if (ddd.hued) {
            numOfHued++;
        }
    }
    //和了
    if (numOfHued >= 1) {
        var sd = game.gameSeats[i];
         
        doGameOver(game, seatData.userId);
       
        return;
    }

    //清空所有非胡牌操作
    for (var i = 0; i < PLAYCOUNT; ++i) {
        var ddd = game.gameSeats[i];
        ddd.canPeng = false;
        ddd.canGang = false;
        ddd.canChuPai = false;
        sendOperations(game, ddd, hupai);
    }



    //和牌的下家继续打
    //clearAllOptions(game);
    //game.turn = game.lastHuPaiSeat;
    //moveToNextUser(game);
    //doUserMoPai(game);
};

exports.guo = function (userId) {
    var seatData = gameSeatsOfUsers[userId];
    if (seatData == null) {
        console.log("guo can't find user game data.");
        return;
    }

    var seatIndex = seatData.seatIndex;
    var game = seatData.game;

    //如果玩家没有对应的操作，则也认为是非法消息
    if ((seatData.canGang || seatData.canPeng || seatData.canHu) == false) {
        console.log("no need guo.");
        return;
    }

    //如果是玩家自己的轮子，不是接牌，则不需要额外操作
    var doNothing = game.chuPai == -1 && game.turn == seatIndex;

    userMgr.sendMsg(seatData.userId, "guo_result");
    clearAllOptions(game, seatData);

    //这里还要处理过胡的情况
    //if(game.chuPai >= 0 && seatData.canHu){
    //   seatData.guoHuFan = seatData.tingMap[game.chuPai].fan;
    //}
    //seatData.guoHuFan=1000;
    if (doNothing) {
        return;
    }

    //如果还有人可以操作，则等待
    for (var i = 0; i < game.gameSeats.length; ++i) {
        var ddd = game.gameSeats[i];
        if (hasOperations(ddd)) {
            return;
        }
    }

    //如果是已打出的牌，则需要通知。
    if (game.chuPai >= 0) {
        var uid = game.gameSeats[game.turn].userId;
        userMgr.broacastInRoom('guo_notify_push', { userId: uid, pai: game.chuPai }, seatData.userId, true);
        seatData.folds.push(game.chuPai);
        game.chuPai = -1;
    }


    var qiangGangContext = game.qiangGangContext;
    //清除所有的操作
    clearAllOptions(game);

    if (qiangGangContext != null && qiangGangContext.isValid) {
        doGang(game, qiangGangContext.turnSeat, qiangGangContext.seatData, "wangang", 1, qiangGangContext.pai);
    }
    else {
        //下家摸牌
        moveToNextUser(game);
        doUserMoPai(game);
    }
};

exports.hasBegan = function (roomId) {
    var game = games[roomId];
    if (game != null) {
        return true;
    }
    var roomInfo = roomMgr.getRoom(roomId);
    if (roomInfo != null) {
        return roomInfo.numOfGames > 0;
    }
    return false;
};


var dissolvingList = [];

exports.doDissolve = function (roomId) {
    var roomInfo = roomMgr.getRoom(roomId);
    if (roomInfo == null) {
        return null;
    }

    var game = games[roomId];
    doGameOver(game, roomInfo.seats[0].userId, true);
};

exports.dissolveRequest = function (roomId, userId) {
    var roomInfo = roomMgr.getRoom(roomId);
    if (roomInfo == null) {
        return null;
    }

    if (roomInfo.dr != null) {
        return null;
    }

    var seatIndex = roomMgr.getUserSeat(userId);
    if (seatIndex == null) {
        return null;
    }

    roomInfo.dr = {
        endTime: Date.now() + 30000,
        states: [false, false, false, false]
    };
    roomInfo.dr.states[seatIndex] = true;

    dissolvingList.push(roomId);

    return roomInfo;
};

exports.dissolveAgree = function (roomId, userId, agree) {
    var roomInfo = roomMgr.getRoom(roomId);
    if (roomInfo == null) {
        return null;
    }

    if (roomInfo.dr == null) {
        return null;
    }

    var seatIndex = roomMgr.getUserSeat(userId);
    if (seatIndex == null) {
        return null;
    }

    if (agree) {
        roomInfo.dr.states[seatIndex] = true;
    }
    else {
        roomInfo.dr = null;
        var idx = dissolvingList.indexOf(roomId);
        if (idx != -1) {
            dissolvingList.splice(idx, 1);
        }
    }
    return roomInfo;
};

function clearRooms(){
    
}

function update() {
    for (var i = dissolvingList.length - 1; i >= 0; --i) {
        var roomId = dissolvingList[i];

        var roomInfo = roomMgr.getRoom(roomId);
        if (roomInfo != null && roomInfo.dr != null) {
            if (Date.now() > roomInfo.dr.endTime) {
                exports.doDissolve(roomId);
                dissolvingList.splice(i, 1);
            }
        }
        else {
            dissolvingList.splice(i, 1);
        }
    }
}

setInterval(update, 1000);

