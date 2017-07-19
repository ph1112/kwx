exports.mysql = function(){
	return {
		HOST:'192.168.0.189',
		USER:'root',
		PSWD:'111111',
		DB:'db_dealers',
		PORT:3306,
	}
}

exports.port = 12580;

exports.users = function(){
	return {
		HOST:'192.168.0.189',
		PORT:12581,
		GET_PATH:'/get_user_info',
		ADD_PATH:'/add_user_gems',
		SAFE:false,		
	}
}