var mysql=require("mysql");  
var crypto = require('./crypto');

var pool = null;

function nop(a,b,c,d,e,f,g){

}
  
function query(sql,callback){  
    pool.getConnection(function(err,conn){  
        if(err){  
            callback(err,null,null);  
        }else{  
            conn.query(sql,function(qerr,vals,fields){  
                //释放连接  
                conn.release();  
                //事件驱动回调  
                callback(qerr,vals,fields);  
            });  
        }  
    });  
};

exports.init = function(config){
    pool = mysql.createPool({  
        host: config.HOST,
        user: config.USER,
        password: config.PSWD,
        database: config.DB,
        port: config.PORT,
    });
};

exports.is_account_exist = function(account,callback){
    callback = callback == null? nop:callback;
    if(account == null){
        callback(false);
        return;
    }

    var sql = 'SELECT * FROM t_accounts WHERE account = "' + account + '"';
    query(sql, function(err, rows, fields) {
        if (err) {
            callback(false);
            throw err;
        }
        else{
            if(rows.length > 0){
                callback(true);
            }
            else{
                callback(false);
            }
        }
    });
};

exports.create_account = function(account,password,callback){
    callback = callback == null? nop:callback;
    if(account == null || password == null){
        callback(false);
        return;
    }

    var psw = crypto.md5(password);
    var sql = 'INSERT INTO t_accounts(account,password) VALUES("' + account + '","' + psw + '")';
    query(sql, function(err, rows, fields) {
        if (err) {
            if(err.code == 'ER_DUP_ENTRY'){
                callback(false);
                return;         
            }
            callback(false);
            throw err;
        }
        else{
            callback(true);            
        }
    });
};

exports.get_account_info = function(account,password,callback){
    callback = callback == null? nop:callback;
    if(account == null){
        callback(null);
        return;
    }  

    var sql = 'SELECT * FROM t_accounts WHERE account = "' + account + '"';
    query(sql, function(err, rows, fields) {
        if (err) {
            callback(null);
            throw err;
        }
        
        if(rows.length == 0){
            callback(null);
            return;
        }
        
        if(password != null){
            var psw = crypto.md5(password);
            if(rows[0].password == psw){
                callback(null);
                return;
            }    
        }

        callback(rows[0]);
    }); 
};

exports.is_user_exist = function(account,callback){
    callback = callback == null? nop:callback;
    if(account == null){
        callback(false);
        return;
    }

    var sql = 'SELECT userid FROM t_users WHERE account = "' + account + '"';
    query(sql, function(err, rows, fields) {
        if (err) {
            throw err;
        }

        if(rows.length == 0){
            callback(false);
            return;
        }

        callback(true);
    });  
}


exports.get_user_data = function(account,callback){
    callback = callback == null? nop:callback;
    if(account == null){
        callback(null);
        return;
    }

    var sql = 'SELECT userid,account,name,lv,exp,coins,gems,roomid,dealer_level FROM t_users WHERE account = "' + account + '"';
    query(sql, function(err, rows, fields) {
        if (err) {
            callback(null);
            throw err;
        }

        if(rows.length == 0){
            callback(null);
            return;
        }
        rows[0].name = crypto.fromBase64(rows[0].name);
        callback(rows[0]);
    });
};

exports.get_user_data_ex = function(account,callback){
    callback = callback == null? nop:callback;
    if(account == null){
        callback(null);
        return;
    }

    var sql = 'SELECT userid,account,name,lv,exp,coins,gems,roomid,dealer_level,token FROM t_users WHERE account = "' + account + '"';
    query(sql, function(err, rows, fields) {
        if (err) {
            callback(null);
            throw err;
        }

        if(rows.length == 0){
            callback(null);
            return;
        }

        if(rows[0].name){
            rows[0].name = crypto.fromBase64(rows[0].name);
        }
        
        callback(rows[0]);
    });
};

exports.get_user_data_by_userid = function(userid,callback){
    callback = callback == null? nop:callback;
    if(userid == null){
        callback(null);
        return;
    }

    //var sql = 'SELECT userid,account,name,lv,exp,coins,gems,roomid,token FROM t_users WHERE userid = ' + userid;
    var sql = 'SELECT * FROM t_users WHERE userid = ' + userid;
    query(sql, function(err, rows, fields) {
        if (err) {
            callback(null);
            throw err;
        }

        if(rows.length == 0){
            callback(null);
            return;
        }
        rows[0].name = crypto.fromBase64(rows[0].name);
        callback(rows[0]);
    });
};

//为当前用户设置推荐人的ID
exports.set_suggest_id_by_userid = function(userid,suggest_id,callback){
    callback = callback == null? nop:callback;
    if(userid == null){
        callback(null);
        return;
    }
    var sql = 'UPDATE t_users SET suggest_user = ' + suggest_id + ' WHERE userid = ' + userid;
    query(sql,function(err,rows,fiels){
        if(err){
            callback(false);
            throw err;
        }
        if(rows.length == 0){
            callback(false);
            return;
        }
        callback(true);
    });
};

//设置代理账户
exports.set_dealer_user = function(userid,dealer_account,dealer_level,callback){
    callback = callback == null? nop:callback;
    if(userid == null){
        callback(null);
        return;
    }
    var sql = 'UPDATE t_users SET dealer_account="{0}",dealer_level={1} WHERE userid={2}';
    sql = sql.format(dealer_account,dealer_level,userid);
    console.log(sql);
    query(sql, function(err, rows, fields) {
        if (err) {
            throw err;
        }
        callback(true);
    });
};

//更新数据库token
exports.update_user_token = function(account,token,callback){
    callback = callback == null? nop:callback;
    var sql = 'UPDATE t_users SET token = "' + token + '" WHERE account = "' + account + '"';
    console.log(sql);
    query(sql, function(err, rows, fields) {
        if(err){
            callback(false);
            throw err;
        }
        else{
            callback(true);
        }
    });
};

//查询用户的代理info
exports.get_dealer_info = function(userid,callback){
    callback = callback == null? nop:callback;
    if(userid == null){
        callback(null);
        return;
    }
    var sql = 'SELECT * FROM t_users WHERE userid = ' + userid;
    query(sql,function(err,rows,fields){
        if(err){
            callback(null);
            throw err;
        }
        else{
            if(rows.length > 0){
                rows[0].name = crypto.fromBase64(rows[0].name);
                callback(rows[0]);
            }
            else{
                callback(null);
            }
        }
    });
};

exports.get_dealer_account_info = function(dealer_account,callback){
    callback = callback == null? nop:callback;
    if(dealer_account == null){
        callback(null);
        return;
    }
    var sql = 'SELECT * FROM t_users WHERE dealer_account = "' + dealer_account + '"';
    console.log(sql);
    query(sql,function(err,rows,fields){
        if(err){
            callback(null);
            throw err;
        }
        else{
            if(rows.length > 0){
                callback(rows[0]);
            }
            else{
                callback(null);
            }
        }
    });
};

/**增加玩家房卡 */
exports.add_user_gems = function(userid,gems,callback){
    callback = callback == null? nop:callback;
    if(userid == null){
        callback(false);
        return;
    }
    
    var sql = 'UPDATE t_users SET gems = gems +' + gems + ' WHERE userid = ' + userid;
    console.log(sql);
    query(sql,function(err,rows,fields){
        if(err){
            console.log(err);
            callback(false);
            return;
        }
        else{
            callback(rows.affectedRows > 0);
            return; 
        } 
    });
};


//---
//获取用户每天的转盘操作信息
exports.get_user_slyder_info = function(userId,callback){
    callback = callback == null? nop:callback;

    var sql = 'SELECT * FROM t_user_info_perday WHERE uid ='+ userId;
      console.log(sql);
    query(sql, function(err, rows, fields) {
        if (err) {
            callback(null);
            throw err;
        }

        if(rows.length == 0){
            callback(null);
            return;
        }
        callback(rows[0]);
    });
};

exports.get_user_slyder_count = function(token,callback){
    callback = callback == null? nop:callback;
    var userId=0;
    var sql = 'SELECT userid FROM t_users WHERE token = "' + token + '"';
    console.log(sql);
    query(sql, function(err, rows, fields) {
        if(rows.length > 0){   
              console.log("get_user_slyder_count  367");
            userId = rows[0].userid;

            var slyder_total_number=0;
            var slyder_number=slyder_total_number;
            var slyder_used_number=0;
        
            var myDate = new Date(); 
            var year1=myDate.getFullYear(); 
            var moonth=myDate.getMonth()+1; 
            var day=myDate.getDate(); 
            var date=year1+"-"+moonth+"-"+day;

            var sql2 = 'SELECT slyder_total_number, slyder_used_number FROM t_user_info_perday WHERE uid = '+ userId +' AND date = "'+date+'"';
            console.log(sql2);
            query(sql2, function(err, rows, fields) {
           
                if (err) {
                    console.log("get_user_slyder_count  385");
                    throw err;
                }
                if(rows.length == 0){
          
                    var sql3 = 'INSERT INTO t_user_info_perday(uid,slyder_number,slyder_total_number,slyder_used_number,date) VALUES({0},{1},{2},{3},"{4}")';
                        sql3 = sql3.format(userId,slyder_number,slyder_total_number,slyder_used_number,date);
                        console.log(sql3);
                        query(sql3, function(err, rows, fields) {
                            if (err) {
                                throw err;
                            }
                            callback(slyder_total_number);
                        });
                }else{ 
                    console.log("get_user_slyder_count  400");
                    //var count = rows[0].slyder_total_number - rows[0].slyder_number;
                    var count =  rows[0].slyder_total_number - rows[0].slyder_used_number;
         
                    callback(count);    
                }   
            });
        
     }
    });
  
};

exports.get_user_slyder_count_openroom = function(userId){
    //callback = callback == null? nop:callback;
    //var userId=0;
    //var sql = 'SELECT userid FROM t_users WHERE token = "' + token + '"';
    //console.log(sql);
    //query(sql, function(err, rows, fields) {
    //    if(rows.length > 0){   
           
            //userId = rows[0].userid;

            console.log("get_user_slyder_count_openroom  423");
        
            var myDate = new Date(); 
            var year1=myDate.getFullYear(); 
            var moonth=myDate.getMonth()+1; 
            var day=myDate.getDate(); 
            var date=year1+"-"+moonth+"-"+day;

            var sql2 = 'SELECT slyder_number FROM t_user_info_perday WHERE uid = '+ userId +' AND date = "'+date+'"';
            console.log(sql2);
            query(sql2, function(err, rows, fields) {
             
                if (err) {
                    console.log("get_user_slyder_count_openroom  438");
                    throw err;
                }
                console.log("rows.length"+rows.length);
                if(rows.length == 0){
          
                    var slyder_total_number=1;
                    var slyder_number=slyder_total_number;
                    var slyder_used_number=0;

                    var sql3 = 'INSERT INTO t_user_info_perday(uid,slyder_number,slyder_total_number,slyder_used_number,date) VALUES({0},{1},{2},{3},"{4}")';
                        console.log(sql3);
                        sql3 = sql3.format(userId,slyder_number,slyder_total_number,slyder_used_number,date);
                        query(sql3, function(err, rows, fields) {
                            if (err) {
                                 console.log("get_user_slyder_count_openroom  448");
                                throw err;
                            }
                        });
                }else{ 
                    
                    var sql4 = 'UPDATE t_user_info_perday SET slyder_total_number =  '+ 1 +' WHERE uid =  "' + userId + '" AND date = "'+date+'"';
                    console.log(sql4);
                    query(sql4,function(err,rows,fields){
                        if(err){
                            //callback(false);
                              console.log("get_user_slyder_count_openroom  460");
                            throw err;
                        }
                        else{
                               console.log("get_user_slyder_count_openroom  463");
                            //callback(true);
                        }
                    });
                }   
            });
        
     //}
      console.log("get_user_slyder_count_openroom  471");
       //callback(slyder_total_number);
    //});
};

//更新用户操作的转盘信息
exports.update_user_slyder_info = function(token,callback){
    callback = callback == null? nop:callback;

    var userId=0;
    var sql = 'SELECT userid FROM t_users WHERE token = "' + token + '"';
    console.log(sql);
    query(sql, function(err, rows, fields) {
 
        if(rows.length > 0){
            userId = rows[0].userid;

            var myDate = new Date(); 
            var year1=myDate.getFullYear(); 
            var moonth=myDate.getMonth()+1; 
            var day=myDate.getDate(); 
            var date=year1+"-"+moonth+"-"+day;

               var sql2 = 'SELECT slyder_used_number FROM t_user_info_perday WHERE uid = "' + userId + '" AND date = "' + date + '"';
                  console.log(sql2);
                query(sql2, function(err, rows, fields) {
                   
                    if(rows.length == 0){

                        var slyder_number=0;
                        var slyder_total_number=0;
                        var slyder_used_number=0;
              

                    var sql3 = 'INSERT INTO t_user_info_perday(uid,slyder_number,slyder_total_number,slyder_used_number,date) VALUES({0},{1},{2},{3},{4})';
                        sql3 = sql3.format(userId,slyder_number,slyder_total_number,slyder_used_number,date);
                        console.log(sql3);
                        query(sql3, function(err, rows, fields) {
                            if (err) {
                                throw err;
                            }
                            callback(true);
                        });
                
                     } else{
                        var sql4 = 'UPDATE t_user_info_perday SET slyder_number = slyder_number + '+ 1 +',slyder_used_number = slyder_used_number + '+ 1 +' WHERE uid =  "' + userId + '" AND date = "'+date+'"';
                         console.log(sql4);
                         query(sql4,function(err,rows,fields){
                            if(err){
                                callback(false);
                                throw err;
                            }
                            else{
                                callback(true);
                            }
                        });
                    } 
                });
        }
        else{
          
            callback(false);
             return;
        }   
    });
};


exports.getcoins_and_gems = function(token,callback){
    callback = callback == null? nop:callback;
  
    if(token == null){
        callback(false);
        return;
    }
    
    var sql = 'SELECT coins,gems FROM t_users WHERE token = "' + token + '"';
    query(sql, function(err, rows, fields) {
     
        if(rows.length > 0){
            var coins = rows[0].coins;
            var gems = rows[0].gems;
            callback({coins:coins,gems:gems});
        }
        else{
            callback(false);
             return;
        }
      
    });
};

exports.get_mission = function(token,callback){
   callback = callback == null? nop:callback;
  
    if(token == null){
        callback(false);
        return;
    }
    
    var sql = 'SELECT userid FROM t_users WHERE token = "' + token + '"';//token
    query(sql, function(err, rows, fields) {
        console.log(sql);
        if (err) {
            
            throw err;
        }
        if(rows.length > 0){
            var userid = rows[0].userid;   
            var myDate = new Date(); 
            var year1=myDate.getFullYear(); 
            var moonth=myDate.getMonth()+1; 
            var day=myDate.getDate(); 
            var date=year1+"-"+moonth+"-"+day;

            var sql2 = 'SELECT * FROM t_mission WHERE userid = '+ userId +' AND date = "'+date+'"';//是不是新的玩家
            console.log(sql2);
            query(sql2, function(err, rows, fields) {

                if (err) {
                   
                    throw err;
                }       
                
                if(rows.length > 0) {
                    var data={
                    mission_one_state:rows[0].mission_one_state,
                    mission_one:rows[0].mission_one,
                    complete_one:rows[0].complete_one,
                    mission_two_state:rows[0].mission_two_state,
                    mission_two:rows[0].mission_two,
                    complete_two:rows[0].complete_two,
                    mission_three_state:rows[0].mission_three_state,
                    mission_three:rows[0].mission_three,
                    complete_three:rows[0].complete_three,
                    };
                  callback(data);
                }
            });
        }
    });
};

exports.get_mission_state = function(token,missionid,callback){
    callback = callback == null? nop:callback;

    if(token == null){
        callback(false);
        return;
    }
    
    var sql = 'SELECT userid FROM t_users WHERE token = "' + token + '"';//token
    query(sql, function(err, rows, fields) {
        console.log(sql);
        if (err) {
            
            throw err;
        }
        if(rows.length > 0){
            var userid = rows[0].userid;   
            var myDate = new Date(); 
            var year1=myDate.getFullYear(); 
            var moonth=myDate.getMonth()+1; 
            var day=myDate.getDate(); 
            var date=year1+"-"+moonth+"-"+day;

            var sql2 = 'SELECT userid FROM t_mission WHERE userid = '+ userId +' AND date = "'+date+'"';//是不是新的玩家
            query(sql2, function(err, rows, fields) {
                console.log(sql2);
                if (err) {
                
                    throw err;
                }        
                    var sql3=null;
                    switch(missionid){
                        case 1:
                         sql3 = 'UPDATE t_mission SET mission_one_state =  '+ 1 + ' WHERE userid =' + userId;
                        break;
                        case 2:
                         sql3 = 'UPDATE t_mission SET mission_two_state = '+ 1 + ' WHERE userid =' + userId;
                        break;
                        case 3:
                         sql3 = 'UPDATE t_mission SET mission_three_state =  '+ 1 + ' WHERE userid =' + userId;
                        break;
                        default:
                         callback(false);
                    }
                    console.log(sql3);
                    query(sql3, function(err, rows, fields) {
                        if(err){
                            console.log(err);
                            callback(false);
                            throw err;
                        }
                        else{
                            callback(true);
                        }
                    });             
            });
         }
     });
};

exports.mission_accepting_award = function(token,missionid,callback){
    callback = callback == null? nop:callback;
 
    if(token == null){
        callback(false);
        return;
    }
    
    var sql = 'SELECT userid FROM t_users WHERE token = "' + token + '"';//token
    query(sql, function(err, rows, fields) {
        console.log(sql);
        if (err) {
    
            throw err;
        }
        if(rows.length > 0){
            var userid = rows[0].userid;   
            var myDate = new Date(); 
            var year1=myDate.getFullYear(); 
            var moonth=myDate.getMonth()+1; 
            var day=myDate.getDate(); 
            var date=year1+"-"+moonth+"-"+day;

            var sql2 = 'SELECT userid FROM t_mission WHERE userid = '+ userId +' AND date = "'+date+'"';//是不是新的玩家
            query(sql2, function(err, rows, fields) {
                console.log(sql2);
                if (err) {
             
                    throw err;
                }        
                    var sql3=null;
                    switch(missionid){
                        case 1:
                         sql3 = 'UPDATE t_mission SET mission_one_state =  '+ 1 + ' WHERE userid =' + userId;
                        break;
                        case 2:
                         sql3 = 'UPDATE t_mission SET mission_two_state = '+ 1 + ' WHERE userid =' + userId;
                        break;
                        case 3:
                         sql3 = 'UPDATE t_mission SET mission_three_state =  '+ 1 + ' WHERE userid =' + userId;
                        break;
                        default:
                         callback(false);
                    }
                
                    query(sql3, function(err, rows, fields) {
                        if(err){
                       
                            callback(false);
                            throw err;
                        }
                        else{
                            callback(true);
                        }
                    });             
            });
         }
     });
};

exports.get_mission_list = function(token,missionid,callback){
    callback = callback == null? nop:callback;

    if(token == null){
        callback(false);
        return;
    }
    
    var sql = 'SELECT userid FROM t_users WHERE token = "' + token + '"';//token
    query(sql, function(err, rows, fields) {
        console.log(sql);
        if (err) {
            
            throw err;
        }
        if(rows.length > 0){
            var userid = rows[0].userid;   
            var myDate = new Date(); 
            var year1=myDate.getFullYear(); 
            var moonth=myDate.getMonth()+1; 
            var day=myDate.getDate(); 
            var date=year1+"-"+moonth+"-"+day;

            var sql4 = 'SELECT userid FROM t_mission WHERE userid = '+ userId +' AND date = "'+date+'"';//是不是新的玩家
            query(sql4, function(err, rows, fields) {
                console.log(sql4);
                if (err) {
               
                    throw err;
                }       
                if(rows.length == 0){//missionid
                   
                    var sql2 = 'INSERT INTO t_mission(userid,mission_one_state,mission_one,complete_one,\
                                                             mission_two_state,mission_two,complete_two,\
                                                             mission_three_state,mission_three,complete_three,time_data)\
                                                              VALUES({0},"{1}","{2}","{3}","{4}","{5}","{6}","{7}","{8}","{9}","{10}")';
                        sql2 = sql2.format(userId,0,0,1,0,0,1,0,0,32,date);
                        console.log(sql2);
                        query(sql2, function(err, rows, fields) {
                            if (err) {
                                throw err;
                            }
                            callback(true);
                        });
                }else{ 

                    var sql3=null;
                    switch(missionid){
                        case 1:
                         sql3 = 'UPDATE t_mission SET mission_one = mission_one + '+ 1 + ' WHERE userid =' + userId;
                        break;
                        case 2:
                         sql3 = 'UPDATE t_mission SET mission_two = mission_two + '+ 1 + ' WHERE userid =' + userId;
                        break;
                        case 3:
                         sql3 = 'UPDATE t_mission SET mission_three = mission_three + '+ 1 + ' WHERE userid =' + userId;
                        break;
                        default:
                         callback(false);
                    }
        
                    query(sql3, function(err, rows, fields) {
                        if(err){
                    
                            callback(false);
                            throw err;
                        }
                        else{
                            callback(true);
                        }
                    });       
                }   
            });
         }
     });
};


//生成用户转盘结果
exports.create_slyder_result = function(token,result,result_des,callback){
    callback = callback == null? nop:callback;

   
    // '0':"10张礼卷",
    // '1':"10张房卡",
    // '2':"30张礼卷",
    // '3':"5张房卡",
    // '4':"50张礼卷",
    // '5':"100张礼卷",
    // '6':"3张房卡",
    // '7':"1张房卡"
    var sql_1 = null;
    if(result==6){
       result=5;
    }
    switch(result){
        case 1:  sql_1= 'UPDATE t_users SET coins = coins +' + 10 + ' WHERE token = "' + token+ '"';break;
        case 2:  sql_1= 'UPDATE t_users SET gems = gems +' + 10 + ' WHERE token = "' + token+ '"';break;
        case 3:  sql_1= 'UPDATE t_users SET coins = coins +' + 30 + ' WHERE token = "' + token+ '"';break;
        case 4:  sql_1= 'UPDATE t_users SET gems = gems +' + 5 + ' WHERE token = "' + token+ '"';break;
        case 5:  sql_1= 'UPDATE t_users SET coins = coins +' + 50 + ' WHERE token = "' + token+ '"';break;
        case 6:  sql_1= 'UPDATE t_users SET coins = coins +' + 100 + ' WHERE token = "' + token+ '"';break;
        case 7:  sql_1= 'UPDATE t_users SET gems = gems +' + 3 + ' WHERE token = "' + token+ '"';break;
        case 8:  sql_1= 'UPDATE t_users SET gems = gems +' + 1 + ' WHERE token = "' + token+ '"';break;
    }
    query(sql_1,function(err,rows,fields){
        if(err){           
            return;
        }
    });


    var sql = 'SELECT userid FROM t_users WHERE token = "' + token + '"';
    query(sql, function(err, rows, fields) {
        var uid=0;
        if(rows.length > 0){
            userId = rows[0].userid;
            var myDate = new Date(); 
            var year1=myDate.getFullYear(); 
            var moonth=myDate.getMonth()+1; 
            var day=myDate.getDate(); 
            var hours = myDate.getHours(); 
            var minutes = myDate.getMinutes();
            var second = myDate.getSeconds(); 
            var s=year1+"-"+moonth+"-"+day+" "+hours  +":"+minutes  +":"+second;
      
            var operator_time=s;
            var sql = "INSERT INTO t_slyder_result(uid,result,result_des,operator_time) VALUES({0},{1},'{2}','{3}')";
          
            sql = sql.format(userId,result,result_des,operator_time);
            query(sql,function(err,rows,fields){
                if(err){
                    callback(false);
                    throw err;
                }
                else{
                    
                    callback(result);
                }
            });


        }
        else{
            callback(false);
             return;
        }
      
    });
};

exports.get_prize = function(callback){
    callback = callback == null? nop:callback;
    var sql = 'SELECT *  FROM t_trade_direct';   
    query(sql, function(err, rows, fields) {
        if(rows.length > 0){       
            callback(rows);
        }    
        else{
            callback(false);
        }   
    });
};

exports.get_turntable_prize = function(callback){
    callback = callback == null? nop:callback;
    var sql = 'SELECT * FROME t_slyder_result';
    query(sql, function(err, rows, fields) {
        if(rows.length > 0){
            callback(rows);
        }
        else{
            callback(false);
        }
    });
};

exports.setgetslyder_result = function(token,coins,callback){
    callback = callback == null? nop:callback;

    var userId=0;
    var sql = 'SELECT userid FROM t_users WHERE token = "' + token + '"';
    query(sql, function(err, rows, fields) {
     
        if(rows.length > 0){
            userId = rows[0].userid;
        }
        else{
            callback(false);
             return;
        }
      
    });

    if(userid == null){
        callback(false);
        return;
    }
    
    var sql = 'UPDATE t_users SET coins = coins +' + coins + ' WHERE userid = ' + userid;
    console.log(sql);
    query(sql,function(err,rows,fields){
        if(err){
       
            callback(false);
            return;
        }
        else{
            callback(coins);
            return; 
        } 
    });
};

exports.add_gameover_lijuan = function(token,coins,callback){
    callback = callback == null? nop:callback;
    if(token == null){
        callback(false);
        return;
    }
    
    var sql = 'UPDATE t_users SET coins = coins +' + coins + ' WHERE token = "' + token + '"';
    console.log(sql);
    query(sql,function(err,rows,fields){
        if(err){

            callback(false);
            return;
        }
        else{
            callback(coins);
            return; 
        } 
    });
};


/**减少玩家房卡 */
exports.reduce_user_gems = function(userid,gems,callback){
    callback = callback == null? nop:callback;
    if(userid == null){
        callback(false);
        return;
    }

    var sql = 'UPDATE t_users SET gems = gems - ' + gems + ' WHERE userid = ' + userid;
    console.log(sql);
    query(sql,function(err,rows,fields){
        if(err){
            callback(false);
            return;
        }
        else{
            callback(rows.affectedRows > 0);
            return; 
        } 
    });
};

/*玩家礼券兑换 */
exports.reduce_user_giftcer = function(data,callback){
    var token =  data.token;
    var sql1 = 'SELECT userid FROM t_users WHERE token = "' + token + '"';
    query(sql1, function(err, rows, fields) {   
        if(rows.length > 0){
            var id = rows[0].userid;
            var golds_payment =  data.goodsprice;
            var goods_code =  data.goodscode;

     

            callback = callback == null? nop:callback;
            if(id == null){
           
                callback(false);
                return;
            }

            var sql2 = 'UPDATE t_users SET coins = coins - ' + golds_payment + ' WHERE userid = ' + id;
       
            query(sql2,function(err,rows,fields){
                if(err){
               
                    callback(false);
                    return;
                }
                else{   
                    callback = callback == null? nop:callback;
                    var sql3 = 'SELECT coins FROM t_users WHERE userid = ' + id;
                    query(sql3, function(err, rows, fields) {
                        if(err){
                            callback(null);
                          
                            throw err;
                        }
                        else{
                            if(rows.length > 0){
                                var coinscount = rows[0].coins;
                       
                                var myDate = new Date(); 
                                var year1=myDate.getFullYear(); 
                                var moonth=myDate.getMonth()+1; 
                                var day=myDate.getDate(); 
                                var hours = myDate.getHours(); 
                                var minutes = myDate.getMinutes();
                                var second = myDate.getSeconds(); 
                                var s=year1+"-"+moonth+"-"+day+"_"+hours  +":"+minutes  +":"+second;
                              

                                var  trade_serial_no='',goods_num=0,goods_name='',goods_send_status='',trade_time=s,  goods_send_remark='',goods_send_operator_user=0,goods_send_time=s;
                                var sql4 = "INSERT INTO t_trade_direct(id,trade_serial_no,golds_payment,goods_num,goods_name,goods_code,goods_send_status,trade_time,goods_send_remark,goods_send_operator_user,goods_send_time) \
                                            VALUES({0},'{1}',{2},{3},'{4}','{5}','{6}','{7}','{8}',{9},'{10}')";

                                sql4 = sql4.format(id,trade_serial_no,golds_payment,goods_num,goods_name,goods_code,goods_send_status,trade_time,goods_send_remark,goods_send_operator_user,goods_send_time);
                        
                                query(sql4, function(err, rows, fields) {
                                    if (err) {
                         
                                        throw err;
                                    }
                                    callback(coinscount);
                                });
                            }
                            else{
                  
                                callback(null);
                            }
                        }
                    });
                } 
            });
        }
        else{
           
            callback(false);
             return;
        }
      
    });
};


exports.get_gems = function(account,callback){
    callback = callback == null? nop:callback;
    if(account == null){
        callback(null);
        return;
    }

    var sql = 'SELECT gems FROM t_users WHERE account = "' + account + '"';
    query(sql, function(err, rows, fields) {
        if (err) {
            callback(null);
            throw err;
        }

        if(rows.length == 0){
            callback(null);
            return;
        }

        callback(rows[0]);
    });
}; 

exports.get_user_history = function(userId,callback){
    callback = callback == null? nop:callback;
    if(userId == null){
        callback(null);
        return;
    }

    var sql = 'SELECT history FROM t_users WHERE userid = "' + userId + '"';
    query(sql, function(err, rows, fields) {
        if (err) {
            callback(null);
            throw err;
        }

        if(rows.length == 0){
            callback(null);
            return;
        }
        var history = rows[0].history;
        if(history == null || history == ""){
            callback(null);    
        }
        else{
  
            history = JSON.parse(history);
            callback(history);
        }        
    });
};

exports.update_user_history = function(userId,history,callback){
    callback = callback == null? nop:callback;
    if(userId == null || history == null){
        callback(false);
        return;
    }

    history = JSON.stringify(history);
    var sql = 'UPDATE t_users SET roomid = null, history = \'' + history + '\' WHERE userid = "' + userId + '"';
    //console.log(sql);
    query(sql, function(err, rows, fields) {
        if (err) {
            callback(false);
            throw err;
        }

        if(rows.length == 0){
            callback(false);
            return;
        }

        callback(true);
    });
};

exports.get_games_of_room = function(room_uuid,callback){
    callback = callback == null? nop:callback;
    if(room_uuid == null){
        callback(null);
        return;
    }

    var sql = 'SELECT game_index,create_time,result FROM t_games_archive WHERE room_uuid = "' + room_uuid + '"';
    //console.log(sql);
    query(sql, function(err, rows, fields) {
        if (err) {
            callback(null);
            throw err;
        }

        if(rows.length == 0){
            callback(null);
            return;
        }

        callback(rows);
    });
};

//查询用户的级别
exports.get_level_by_token = function(token,callback){
    callback = callback == null? nop:callback;
    if(token == null){
        callback(null);
        return;
    }
    var sql = 'SELECT dealer_level FROM t_users WHERE token = "' + token + '"';
    query(sql,function(err,rows,fields){
        if(err){
            callback(null);
            throw err;
        }
        else{
            if(rows.length > 0){
                callback(rows[0]);
            }
            else{
                callback(null);
            }
        }
    });
};

exports.get_detail_of_game = function(room_uuid,index,id,callback){
    callback = callback == null? nop:callback;
    if(room_uuid == null || index == null){
        callback(null);
        return;
    }
    var sql = 'SELECT base_info,action_records FROM t_games_archive WHERE id = ' + id ;//回放分享嘛
    //console.log(sql);
    query(sql, function(err, rows, fields) {
        if (err) {
            callback(null);
            throw err;
        }

        if(rows.length == 0){
            callback(null);
            return;
        }
        callback(rows[0]);
    });
}

exports.create_user = function(account,name,coins,gems,sex,headimg,token,dealer_level,callback){
    callback = callback == null? nop:callback;
    if(account == null || name == null || coins==null || gems==null){
        callback(false);
        return;
    }
    if(headimg){
        headimg = '"' + headimg + '"';
    }
    else{
        headimg = 'null';
    }
    name = crypto.toBase64(name);
    var sql = 'INSERT INTO t_users(account,name,coins,gems,sex,headimg,token,dealer_level) VALUES("{0}","{1}",{2},{3},{4},{5},"{6}",{7})';
    sql = sql.format(account,name,coins,gems,sex,headimg,token,dealer_level);
    console.log(sql);
    query(sql, function(err, rows, fields) {
        if (err) {
            throw err;
        }
        callback(true);
    });
};

exports.update_user_info = function(userid,name,headimg,sex,token,callback){
    callback = callback == null? nop:callback;
    if(userid == null){
        callback(null);
        return;
    }
 
    if(headimg){
        headimg = '"' + headimg + '"';
    }
    else{
        headimg = 'null';
    }
    name = crypto.toBase64(name);
    var sql = 'UPDATE t_users SET name="{0}",headimg={1},sex={2},token="{3}" WHERE account="{4}"';
    sql = sql.format(name,headimg,sex,token,userid);
    console.log(sql);
    query(sql, function(err, rows, fields) {
        if (err) {
            throw err;
        }
        callback(rows);
    });
};

exports.get_user_base_info = function(userid,callback){
    callback = callback == null? nop:callback;
    if(userid == null){
        callback(null);
        return;
    }
    var sql = 'SELECT name,sex,headimg FROM t_users WHERE userid={0}';
    sql = sql.format(userid);
    console.log(sql);
    query(sql, function(err, rows, fields) {
        if (err) {
            throw err;
        }
        rows[0].name = crypto.fromBase64(rows[0].name);
        callback(rows[0]);
    });
};

exports.is_room_exist = function(roomId,callback){
    callback = callback == null? nop:callback;
    var sql = 'SELECT * FROM t_rooms WHERE id = "' + roomId + '"';
    query(sql, function(err, rows, fields) {
        if(err){
            callback(false);
            throw err;
        }
        else{
            callback(rows.length > 0);
        }
    });
};

exports.cost_gems = function(userid,cost,callback){
    callback = callback == null? nop:callback;
    var sql = 'UPDATE t_users SET gems = gems -' + cost + ' WHERE userid = ' + userid;
    console.log(sql);
    query(sql, function(err, rows, fields) {
        if(err){
            callback(false);
            throw err;
        }
        else{
            callback(rows.length > 0);
        }
    });
};

exports.set_room_id_of_user = function(userId,roomId,callback){
    callback = callback == null? nop:callback;
    if(roomId != null){
        roomId = '"' + roomId + '"';
    }
    var sql = 'UPDATE t_users SET roomid = '+ roomId + ' WHERE userid = "' + userId + '"';
    console.log(sql);
    query(sql, function(err, rows, fields) {
        if(err){
            console.log(err);
            callback(false);
            throw err;
        }
        else{
            callback(rows.length > 0);
        }
    });
};

exports.update_room_status = function(roomId,status,callback){
    callback = callback == null? nop:callback;
    if(roomId != null){
        roomId = '"' + roomId + '"';
    }
    var sql = 'UPDATE t_rooms SET status = '+ status + ' WHERE id = '+ roomId;
    console.log(sql);
    query(sql,function(err,rows,fields){
        if(err){
            callback(false);
            throw err;
        }
        else{
            callback(true);
        }
    });
    
};

exports.get_room_id_of_user = function(userId,callback){
    callback = callback == null? nop:callback;
    var sql = 'SELECT roomid FROM t_users WHERE userid = "' + userId + '"';
    query(sql, function(err, rows, fields) {
        if(err){
            callback(null);
            throw err;
        }
        else{
            if(rows.length > 0){
                callback(rows[0].roomid);
            }
            else{
                callback(null);
            }
        }
    });
};

exports.get_rooms_data_of_creator = function(userId,callback){
    callback = callback == null? nop:callback;
    var sql = 'SELECT * FROM t_rooms WHERE user_create = "' + userId +'"';
    query(sql, function(err, rows, fields) {
        if(err){
            callback(null);
            throw err;
        }
        if(rows.length > 0){
            callback(rows);
        }
        else{
            callback(null);
        }
    });
};

exports.get_room_data_of_roomId = function(roomId,callback){
    callback = callback == null? nop:callback;
    var sql = 'SELECT * FROM t_rooms WHERE id = "' + roomId +'"';
    query(sql, function(err, rows, fields) {
        if(err){
            callback(null);
            throw err;
        }
        if(rows.length > 0){
            callback(rows[0]);
        }
        else{
            callback(null);
        }
    });
};

exports.get_history_rooms_of_creator = function(userId,callback){
    callback = callback == null? nop:callback;
    var sql = 'SELECT * FROM t_history_room WHERE user_create = "' + userId +'"';
    query(sql, function(err,rows,fields){
        if(err){
            callback(null);
            throw err;
        }
        if(rows.length > 0){
            callback(rows);
        }
        else{
            callback(null);
        }
    });
};

exports.get_expired_time_of_room = function(roomId,callback){
    callback = callback == null? nop:callback;
    var sql = 'SELECT expired_time FROM t_rooms WHERE id = "' + roomId +'"';
    query(sql,function(err,rows,fields){
        if(err){
            callback(null);
            throw err;
        }
        else{
            callback(rows[0].expired_time);
        }
    });
};

exports.get_expired_rooms = function(callback){
    callback = callback == null? nop:callback;
    var nowTime = Math.ceil(Date.now()/1000);
    var sql = 'SELECT id FROM t_rooms WHERE expired_time <= ' + nowTime ;
    query(sql,function(err,rows,fields){
        if(err){
            callback(null);
            throw err;
        }
        else{
            callback(rows);
        }
    });
}

exports.create_room = function(roomId,conf,ip,port,create_time,user_create,account,expired_time,cost_gems,status,room_create_type,callback){
    callback = callback == null? nop:callback;
    var sql = "INSERT INTO t_rooms(uuid,id,base_info,ip,port,create_time,user_create,user_createname,expired_time,cost_gems,status,room_create_type) \
                VALUES('{0}','{1}','{2}','{3}',{4},{5},{6},'{7}',{8},{9},{10},{11})";
    var uuid = Date.now() + roomId;
    var baseInfo = JSON.stringify(conf);
    sql = sql.format(uuid,roomId,baseInfo,ip,port,create_time,user_create,account,expired_time,cost_gems,status,room_create_type);
    console.log(sql);
    query(sql,function(err,row,fields){
        if(err){
            callback(null);
            throw err;
        }
        else{
            callback(uuid);
        }
    });
};

exports.get_room_uuid = function(roomId,callback){
    callback = callback == null? nop:callback;
    var sql = 'SELECT uuid FROM t_rooms WHERE id = "' + roomId + '"';
    query(sql,function(err,rows,fields){
        if(err){
            callback(null);
            throw err;
        }
        else{
            callback(rows[0].uuid);
        }
    });
};

exports.update_seat_info = function(roomId,seatIndex,userId,icon,name,callback){
    callback = callback == null? nop:callback;
    var sql = 'UPDATE t_rooms SET user_id{0} = {1},user_icon{0} = "{2}",user_name{0} = "{3}" WHERE id = "{4}"';
    name = crypto.toBase64(name);
    sql = sql.format(seatIndex,userId,icon,name,roomId);
    //console.log(sql);
    query(sql,function(err,row,fields){
        if(err){
            callback(false);
            throw err;
        }
        else{
            callback(true);
        }
    });
}

exports.update_num_of_turns = function(roomId,numOfTurns,callback){
    callback = callback == null? nop:callback;
    var sql = 'UPDATE t_rooms SET num_of_turns = {0} WHERE id = "{1}"'
    sql = sql.format(numOfTurns,roomId);
    //console.log(sql);
    query(sql,function(err,row,fields){
        if(err){
            callback(false);
            throw err;
        }
        else{
            callback(true);
        }
    });
};


exports.update_next_button = function(roomId,nextButton,callback){
    callback = callback == null? nop:callback;
    var sql = 'UPDATE t_rooms SET next_button = {0} WHERE id = "{1}"'
    sql = sql.format(nextButton,roomId);
    //console.log(sql);
    query(sql,function(err,row,fields){
        if(err){
            callback(false);
            throw err;
        }
        else{
            callback(true);
        }
    });
};

exports.get_room_addr = function(roomId,callback){
    callback = callback == null? nop:callback;
    if(roomId == null){
        callback(false,null,null);
        return;
    }

    var sql = 'SELECT ip,port FROM t_rooms WHERE id = "' + roomId + '"';
    query(sql, function(err, rows, fields) {
        if(err){
            callback(false,null,null);
            throw err;
        }
        if(rows.length > 0){
            callback(true,rows[0].ip,rows[0].port);
        }
        else{
            callback(false,null,null);
        }
    });
};

exports.get_room_data = function(roomId,callback){
    callback = callback == null? nop:callback;
    if(roomId == null){
        callback(null);
        return;
    }

    var sql = 'SELECT * FROM t_rooms WHERE id = "' + roomId + '"';
    query(sql, function(err, rows, fields) {
        if(err){
            callback(null);
            throw err;
        }
        if(rows.length > 0){
            if(rows[0].user_name0)
                rows[0].user_name0 = crypto.fromBase64(rows[0].user_name0);
            if(rows[0].user_name1)
                rows[0].user_name1 = crypto.fromBase64(rows[0].user_name1);
            if(rows[0].user_name2)
                rows[0].user_name2 = crypto.fromBase64(rows[0].user_name2);
            if(rows[0].user_name3)
                rows[0].user_name3 = crypto.fromBase64(rows[0].user_name3);
            callback(rows[0]);
        }
        else{
            callback(null);
        }
    });
};

exports.delete_room = function(roomId,callback){
    callback = callback == null? nop:callback;
    if(roomId == null){
        callback(false);
    }


    var sql_0 = 'SELECT * FROM t_rooms WHERE id = "' + roomId + '"';
    query(sql_0,function(err,rows,fields){
        if(err){
            callback(false);
            throw err;
        }
        else{
            if(rows.length > 0){
                var sql_1 = "INSERT INTO t_history_room(uuid,id,user_id0,user_icon0,user_name0,user_score0,user_id1,user_icon1,user_name1,user_score1,user_id2,user_icon2,user_name2,user_score2,user_id3,user_icon3,user_name3,user_score3) \
                VALUES('{0}','{1}',{2},'{3}','{4}',{5},{6},'{7}','{8}',{9},{10},'{11}','{12}',{13},{14},'{15}','{16}',{17})";
                sql_1 = sql_1.format(rows[0].uuid,rows[0].id,rows[0].user_id0,rows[0].user_icon0,rows[0].user_name0,rows[0].user_score0,rows[0].user_id1,rows[0].user_icon1,rows[0].user_name1,rows[0].user_score1,rows[0].user_id2,rows[0].user_icon2,rows[0].user_name2,rows[0].user_score2,rows[0].user_id3,rows[0].user_icon3,rows[0].user_name3,rows[0].user_score3);
                query(sql_1,function(err,rows,fields){
                    if(err){
                        callback(false);
                        throw err;
                    }
                    else{
                        callback(true);
                    }
                }); 
            }
            else{
                callback(false);
            }
        }

        var sql = "DELETE FROM t_rooms WHERE id = '{0}'";
        sql = sql.format(roomId);
        console.log(sql);
        query(sql,function(err,rows,fields){
            if(err){
                callback(false);
                throw err;
            }
            else{
                callback(true);
            }
        });
    });
}

exports.create_game = function(room_uuid,index,base_info,callback){
    callback = callback == null? nop:callback;
    var sql = "INSERT INTO t_games(room_uuid,game_index,base_info,create_time) VALUES('{0}',{1},'{2}',unix_timestamp(now()))";
    sql = sql.format(room_uuid,index,base_info);
    console.log(sql);
    query(sql,function(err,rows,fields){
        if(err){
           
            callback(null);
            throw err;
        }
        else{
           
            callback(rows.insertId);
        }
    });
};

exports.delete_games = function(room_uuid,callback){
    callback = callback == null? nop:callback;
    if(room_uuid == null){
        callback(false);
    }    
    var sql = "DELETE FROM t_games WHERE room_uuid = '{0}'";
    sql = sql.format(room_uuid);
    console.log(sql);
    query(sql,function(err,rows,fields){
        if(err){
            callback(false);
            throw err;
        }
        else{
            callback(true);
        }
    });
}

exports.archive_games = function(room_uuid,callback){
    callback = callback == null? nop:callback;
    if(room_uuid == null){
        callback(false);
    }
    var sql = "INSERT INTO t_games_archive(SELECT * FROM t_games WHERE room_uuid = '{0}')";
    sql = sql.format(room_uuid);
    console.log(sql);
    query(sql,function(err,rows,fields){
        if(err){
            callback(false);
            throw err;
        }
        else{
            exports.delete_games(room_uuid,function(ret){
                callback(ret);
            });
        }
    });
}

exports.update_game_action_records = function(room_uuid,index,actions,callback){
    callback = callback == null? nop:callback;
    var sql = "UPDATE t_games SET action_records = '"+ actions +"' WHERE room_uuid = '" + room_uuid + "' AND game_index = " + index ;
    //console.log(sql);
    query(sql,function(err,rows,fields){
        if(err){
            callback(false);
            throw err;
        }
        else{
            callback(true);
        }
    });
};

exports.update_game_result = function(room_uuid,index,result,callback){
    callback = callback == null? nop:callback;
    if(room_uuid == null || result){
        callback(false);
    }
    
    result = JSON.stringify(result);
    var sql = "UPDATE t_games SET result = '"+ result +"' WHERE room_uuid = '" + room_uuid + "' AND game_index = " + index ;
    //console.log(sql);
    query(sql,function(err,rows,fields){
        if(err){
            callback(false);
            throw err;
        }
        else{
            callback(true);
        }
    });
};


exports.get_message = function(type,version,callback){
    callback = callback == null? nop:callback;
    
    var sql = 'SELECT * FROM t_message WHERE type = "'+ type + '"';
    
    if(version == "null"){
        version = null;
    }
    
    if(version){
        version = '"' + version + '"';
        sql += ' AND version != ' + version;   
    }
     
    query(sql, function(err, rows, fields) {
        if(err){
            callback(false);
            throw err;
        }
        else{
            if(rows.length > 0){
                callback(rows[0]);    
            }
            else{
                callback(null);
            }
        }
    });
};

exports.query = query;