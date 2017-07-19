var localutil = require('bindings')('mjhuutil.node')

//var flag_k5xin = 0x00008000;
//var flag_win = 0x00000040;
//var flag_an_si_gui =	0x00010000;

var flag_se = 0x00000004;
var flag_win = 0x00000040;
var flag_xiao_san_yuan = 0x00001000;
var flag_da_san_yuan = 0x00002000;
var flag_k5xin = 0x00004000;
var flag_ming_si_gui =	0x00008000;
var flag_an_si_gui =	0x00010000;

var pai_map_map = [0x01, 0x02, 0x03, 0x04,0x05, 0x06, 0x07, 0x08, 0x09,
                   0x11, 0x12, 0x13, 0x14,0x15, 0x16, 0x17, 0x18, 0x19,
                   0x35, 0x36, 0x37];

function pai_transfer(i){
    return pai_map_map[i];
}

function pai_array_transfer(ar){
    var kk = [];
    for(var i in ar){
        //console.log(ar[i]);
        kk.push(pai_map_map[ar[i]]);
    }
    return kk;
}

function checkTingPai(seatData, begin,end, laizi){
    var pai_array = pai_array_transfer(seatData.holds);
    if(!laizi){
        laizi=0;
    }else{
        laizi = pai_transfer(laizi);
    }
    var pengs = pai_array_transfer(seatData.pengs);
    var an_gangs = pai_array_transfer(seatData.angangs);
    var wan_gangs = pai_array_transfer(seatData.wangangs);
    var dian_gangs = pai_array_transfer(seatData.diangangs);
    var gangs = []
    if(an_gangs){
        for(var k in an_gangs){
            gangs.push(an_gangs[k]);
        }
    }
    if(wan_gangs){
        for(var k in wan_gangs){
            gangs.push(wan_gangs[k]);
        }
    }
    if(dian_gangs){
        for(var k in dian_gangs){
            gangs.push(dian_gangs[k]);
        }
    }
    
	for(var i = begin; i < end; ++i){
		//如果这牌已经在和了，就不用检查了
		if(seatData.tingMap[i] != null){
			continue;
		}
        var c = pai_transfer(i);
        var s={magicCard:laizi, currentCard:c, cards:pai_array, pengs:pengs, gangs:gangs}
        
        var ret = localutil.CheckChiHu(JSON.stringify(s), "")
        if(ret){
			//平胡 0番
            //console.log(JSON.stringify(s));
            //console.log(i);
            seatData.tingMap[i] = {
                pattern:"normal",
                ret:ret,
                fan:1
            }
            
		}
      
	}	
}

exports.checkTingPai = checkTingPai;

/*
var flag_se = 0x00000004;
var flag_win = 0x00000040;
var flag_xiao_san_yuan = 0x00001000;
var flag_da_san_yuan = 0x00002000;
var flag_k5xin = 0x00004000;
var flag_ming_si_gui =	0x00008000;
var flag_an_si_gui =	0x00010000;
seatData = {tingMap:[], holds:[0x02, 0x02, 0x02, 0x02, 0x03, 20, 20], pengs:[18, 19]}
checkTingPai(seatData, 0, 21, 0)
console.log(JSON.stringify(seatData.tingMap));
console.log(69696&flag_ming_si_gui)
console.log(69696&flag_an_si_gui)
*/





