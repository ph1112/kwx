/*
Navicat MySQL Data Transfer

Source Server         : jjhh
Source Server Version : 50717
Source Host           : localhost:3306
Source Database       : k5xnewa

Target Server Type    : MYSQL
Target Server Version : 50717
File Encoding         : 65001

Date: 2017-04-28 10:49:52
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for t_accounts
-- ----------------------------
DROP TABLE IF EXISTS `t_accounts`;
CREATE TABLE `t_accounts` (
  `account` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`account`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of t_accounts
-- ----------------------------

-- ----------------------------
-- Table structure for t_games
-- ----------------------------
DROP TABLE IF EXISTS `t_games`;
CREATE TABLE `t_games` (
  `room_uuid` char(20) NOT NULL,
  `game_index` smallint(6) NOT NULL,
  `base_info` varchar(1024) NOT NULL,
  `create_time` int(11) DEFAULT NULL,
  `snapshots` char(255) DEFAULT NULL,
  `action_records` varchar(2048) DEFAULT NULL,
  `result` char(255) DEFAULT NULL,
  PRIMARY KEY (`room_uuid`,`game_index`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of t_games
-- ----------------------------

-- ----------------------------
-- Table structure for t_games_archive
-- ----------------------------
DROP TABLE IF EXISTS `t_games_archive`;
CREATE TABLE `t_games_archive` (
  `room_uuid` char(20) NOT NULL,
  `game_index` smallint(6) NOT NULL,
  `base_info` varchar(1024) NOT NULL,
  `create_time` int(11) DEFAULT NULL,
  `snapshots` char(255) DEFAULT NULL,
  `action_records` varchar(2048) DEFAULT NULL,
  `result` char(255) DEFAULT NULL,
  PRIMARY KEY (`room_uuid`,`game_index`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of t_games_archive
-- ----------------------------
INSERT INTO `t_games_archive` VALUES ('1490945868985922936', '0', '{\"type\":\"xthh\",\"button\":0,\"index\":0,\"mahjongs\":[17,10,8,7,8,4,19,23,22,24,22,5,26,15,0,25,11,17,7,6,24,21,17,8,23,25,20,20,2,26,21,22,14,19,16,21,15,10,14,23,1,16,17,6,5,15,26,18,4,2,19,18,20,13,9,3,3,16,24,11,9,12,19,11,2,9,1,24,26,12,3,25,7,18,22,12,3,4,25,10,14,1,18,6,4,0,13,0,9,15,11,20,12,13,8,1,0,7,6,5,14,21,10,5,13,16,23,2],\"laizi\":[13,14],\"game_seats\":[[17,8,22,26,11,24,23,2,14,15,1,5,4,20],[10,4,24,15,17,21,25,26,19,10,16,15,2],[8,19,22,0,7,17,20,21,16,14,17,26,19],[7,23,5,25,6,8,20,22,21,23,6,18,18]]}', '1490945998', null, '[0,1,8,1,2,9,1,1,9,2,2,3,2,1,0,3,2,3,3,1,25,0,2,16,0,1,11,1,2,24,1,1,15,2,2,11,2,1,11,3,2,9,3,1,9,0,2,12,0,1,12,1,2,19,1,1,21,2,2,11,2,1,3,3,2,2,3,1,23,0,2,9,0,1,9,1,2,1,1,1,4,2,2,24,2,1,11,3,2,26,3,1,26,0,2,12,0,1,12,1,2,3,1,1,24,2,2,25,2,1,16,3,2,7,3,1,23,0,2,18,0,1,1,3,5,1]', '[-1,0,0,1]');
INSERT INTO `t_games_archive` VALUES ('1490946333341744320', '0', '{\"type\":\"xthh\",\"button\":0,\"index\":0,\"mahjongs\":[9,3,25,15,22,12,17,11,1,24,19,20,10,5,9,12,4,6,14,8,22,7,26,2,20,5,9,0,12,2,13,17,20,25,12,13,19,17,23,7,14,6,2,18,26,9,14,5,20,8,18,16,10,21,2,11,13,6,10,21,3,4,23,10,8,0,23,21,15,8,18,1,23,14,11,26,0,25,5,3,4,25,16,21,11,1,0,18,15,13,22,24,3,17,22,15,19,7,26,16,4,24,19,24,16,6,1,7],\"laizi\":[21,22],\"game_seats\":[[9,22,1,10,4,22,20,12,20,19,14,26,20,10],[3,12,24,5,6,7,5,2,25,17,6,9,8],[25,17,19,9,14,26,9,13,12,23,2,14,18],[15,11,20,12,8,2,0,17,13,7,18,5,16]]}', '1490946425', null, '[0,1,26,1,2,2,1,1,9,2,3,9,2,1,2,1,3,2,1,1,17,2,2,11,2,1,17,3,2,13,3,1,0,0,2,6,0,1,1,1,2,10,1,1,10,0,3,10,0,1,9,1,2,21,1,1,21,2,2,3,2,1,3,3,2,4,3,1,2,0,2,23,0,1,23,1,2,10,1,1,10,2,2,8,2,1,8,3,2,0,3,1,0,0,2,23,0,1,23,1,2,21,1,1,12,2,2,15,2,1,26,3,2,8,3,1,7,0,2,18,0,6,18]', '[6,-2,-2,-2]');
INSERT INTO `t_games_archive` VALUES ('1490946333341744320', '1', '{\"type\":\"xthh\",\"button\":0,\"index\":1,\"mahjongs\":[12,1,24,13,11,16,19,18,2,8,6,20,7,1,22,14,13,26,2,18,1,8,11,0,6,17,3,7,13,26,15,26,21,25,24,21,15,3,19,11,16,12,22,21,16,17,14,4,9,19,6,2,9,25,15,11,5,16,2,14,12,10,4,9,23,21,5,24,22,19,0,4,13,4,25,8,7,9,22,3,20,8,10,12,23,1,25,18,15,0,10,26,7,17,10,20,23,23,5,24,17,3,6,18,5,14,20,0],\"laizi\":[25,26],\"game_seats\":[[12,11,2,7,13,1,6,13,21,15,16,16,9,9],[1,16,8,1,26,8,17,26,25,3,12,17,19],[24,19,6,22,2,11,3,15,24,19,22,14,6],[13,18,20,14,18,0,7,26,21,11,21,4,2]]}', '1490946533', null, '[0,1,21,3,3,21,3,1,0,0,2,15,0,1,13,1,2,11,1,1,16,0,3,16,0,1,1,1,3,1,1,1,3,2,2,5,2,1,15,0,3,15,0,1,2,1,2,16,1,1,8,0,5,8]', '[7,-3,-2,-2]');
INSERT INTO `t_games_archive` VALUES ('1491370508415731749', '0', '{\"type\":\"xthh\",\"button\":0,\"index\":0,\"mahjongs\":[1,0,0,0,1,1,1,1,1,2,1,1,1,10,10,10,11,11,11,11,13,12,13,13,18,19,18,18,18,20,18,18,19,21,19,19,22,22,22,22,23,23,23,23,24,24,24,24,26,26,26,26,5,13,13,13,14,14,14,14,15,15,15,15,16,16,16,16,17,17,17,17,18,18,18,18,19,19,19,19,20,20,20,20,21,21,21,21,22,22,22,22,23,23,23,23,24,24,24,24,25,25,25,25,26,26,26,26],\"laizi\":[13,14],\"game_seats\":[[1,1,1,1,11,13,18,18,19,22,23,24,26,5],[0,1,2,10,11,12,19,20,21,22,23,24,26],[0,1,1,10,11,13,18,18,19,22,23,24,26],[0,1,1,10,11,13,18,18,19,22,23,24,26]]}', '1491370560', null, '[0,1,5,1,2,13,1,1,13,2,2,13,2,1,13,3,2,14,3,1,13,0,2,14,0,1,26,1,5,26]', '[-2,2,0,0]');
INSERT INTO `t_games_archive` VALUES ('1491553143886478014', '0', '{\"type\":\"xthh\",\"button\":0,\"index\":0,\"mahjongs\":[11,20,25,7,18,22,6,4,5,5,16,13,26,12,3,11,17,21,23,15,9,7,16,23,21,15,7,18,22,8,12,26,25,1,18,17,24,6,2,5,8,8,11,9,23,15,21,22,10,25,20,20,14,21,24,1,12,3,23,2,19,26,2,13,10,24,13,5,18,2,24,20,7,3,22,17,13,9,19,3,17,10,10,12,26,0,1,0,11,8,16,4,6,19,15,6,14,9,0,25,4,14,4,16,14,19,0,1],\"laizi\":[21,22],\"game_seats\":[[11,18,5,26,17,9,21,22,25,24,8,23,10,14],[20,22,5,12,21,7,15,8,1,6,8,15,25],[25,6,16,3,23,16,7,12,18,2,11,21,20],[7,4,13,11,15,23,18,26,17,5,9,22,20]]}', '1491553359', null, '[0,1,17,1,2,24,1,1,12,2,2,1,2,1,18,3,2,12,3,1,9,0,2,3,0,1,14,1,2,23,1,1,1,2,2,2,2,1,2,3,2,19,3,1,26,0,2,26,0,1,18,1,2,2,1,1,2,2,2,13,2,1,25,3,2,10,3,1,17,0,2,24,0,1,8,1,3,8,1,1,20,2,2,13,2,1,23,3,2,5,3,1,7,0,2,18,0,1,18,1,2,2,1,1,2,2,2,24,2,1,24,0,3,24,0,1,25,1,2,20,1,6,20]', '[-2,6,-2,-2]');
INSERT INTO `t_games_archive` VALUES ('1491553566149120259', '0', '{\"type\":\"xthh\",\"button\":0,\"index\":0,\"mahjongs\":[2,2,12,22,19,25,8,11,10,19,21,20,22,25,18,19,18,2,5,15,23,25,25,9,3,1,9,13,6,10,16,10,1,24,4,17,8,18,16,2,24,12,24,19,21,22,23,6,3,3,18,5,21,26,9,7,20,14,21,16,0,4,20,15,11,22,17,7,13,17,6,12,23,3,8,0,6,26,4,14,10,15,24,16,14,0,15,13,17,8,5,20,23,11,11,1,9,7,0,5,14,4,7,26,1,26,12,13],\"laizi\":[26,18],\"game_seats\":[[2,19,10,22,18,23,3,6,1,8,24,21,3,21],[2,25,19,25,2,25,1,10,24,18,12,22,3],[12,8,21,18,5,25,9,16,4,16,24,23,18],[22,11,20,19,15,9,13,10,17,2,19,6,5]]}', '1491553730', null, '[0,1,10,1,2,9,1,1,19,3,3,19,3,1,2,1,3,2,1,1,9,2,2,7,2,1,9,3,2,20,3,1,17,0,2,14,0,1,19,1,2,21,1,1,10,2,2,16,2,1,12,3,2,0,3,1,0,0,2,4,0,1,8,1,2,20,1,1,12,2,2,15,2,1,16,3,2,11,3,1,15,0,2,22,0,1,14,1,2,17,1,1,17,2,2,7,2,1,8,3,2,13,3,1,22,0,3,22,0,1,6,1,2,17,1,1,17,2,2,6,2,1,21,0,3,21,0,1,3,1,2,12,1,1,12,2,2,23,2,1,15,3,2,3,3,1,3,0,2,8,0,1,8,1,2,0,1,1,0,2,2,6,2,1,23,3,2,26,3,1,26,0,2,4,0,6,4]', '[6,-2,-2,-2]');
INSERT INTO `t_games_archive` VALUES ('1491554002717846542', '0', '{\"type\":\"xthh\",\"button\":0,\"index\":0,\"mahjongs\":[1,20,9,11,12,0,25,14,6,7,26,4,6,17,1,4,0,24,16,1,23,13,8,3,26,2,23,19,20,25,23,19,5,12,11,15,22,6,11,4,5,24,25,21,10,16,9,14,13,19,17,22,14,2,15,4,15,26,10,10,22,18,10,25,7,2,9,18,7,7,20,26,0,9,13,18,24,0,8,3,22,17,5,13,8,21,17,12,5,3,24,8,21,16,12,11,1,19,15,18,23,21,20,6,2,3,14,16],\"laizi\":[2,3],\"game_seats\":[[1,12,6,6,0,23,26,20,5,22,5,10,13,14],[20,0,7,17,24,13,2,25,12,6,24,16,19],[9,25,26,1,16,8,23,23,11,11,25,9,17],[11,14,4,4,1,3,19,19,15,4,21,14,22]]}', '1491554156', null, '[0,1,10,1,2,15,1,1,0,2,2,4,2,1,8,3,2,15,3,1,1,0,2,26,0,1,0,1,2,10,1,1,10,2,2,10,2,1,1,3,2,22,3,1,11,2,3,11,2,1,10,3,2,18,3,1,18,0,2,10,0,1,10,1,2,25,1,1,2,2,2,7,2,1,7,3,2,2,3,1,2,0,2,9,0,1,9,2,3,9,2,1,4,3,4,4,3,2,18,3,1,18,0,2,7,0,1,1,1,2,7,1,1,6,0,3,6,0,1,7,1,3,7,1,1,19,3,3,19,3,1,21,0,2,20,0,1,22,3,3,22,3,1,15,0,2,26,0,1,23,2,3,23,2,1,26,0,4,26,0,2,0,0,1,0,1,2,9,1,1,20,0,5,20]', '[3,-2,-2,1]');
INSERT INTO `t_games_archive` VALUES ('1491554442190814797', '0', '{\"type\":\"xthh\",\"button\":0,\"index\":0,\"mahjongs\":[26,5,8,17,18,26,24,13,16,0,6,23,11,20,8,12,21,16,20,12,9,5,1,11,25,3,15,14,3,13,19,8,19,4,12,10,11,18,18,24,5,11,4,26,25,7,17,24,21,14,10,2,10,6,18,16,21,25,6,10,1,9,22,14,23,8,16,0,26,17,2,24,9,19,6,4,1,19,9,4,1,15,25,13,20,23,13,0,20,14,12,7,7,22,17,0,15,22,2,3,23,21,7,2,5,15,22,3],\"laizi\":[6,7],\"game_seats\":[[26,18,16,11,21,9,25,3,19,11,5,25,21,10],[5,26,0,20,16,5,3,13,4,18,11,7,14],[8,24,6,8,20,1,15,19,12,18,4,17,10],[17,13,23,12,12,11,14,8,10,24,26,24,2]]}', '1491554546', null, '[0,1,16,1,2,18,1,1,26,2,2,16,2,1,1,3,2,21,3,1,26,0,2,25,0,1,26,1,2,6,1,1,0,2,2,10,2,1,24,3,3,24,3,1,17,0,2,1,0,1,1,1,2,9,1,1,9,2,2,22,2,1,12,3,3,12,3,1,8,2,3,8,2,1,22,3,2,14,3,1,2,0,2,23,0,1,5,2,5,5]', '[-2,0,2,0]');
INSERT INTO `t_games_archive` VALUES ('1491558111658192705', '0', '{\"type\":\"xthh\",\"button\":0,\"index\":0,\"mahjongs\":[5,1,24,25,13,6,16,4,16,23,23,24,0,15,25,11,25,2,6,13,26,19,23,3,18,4,22,20,10,19,21,11,7,17,11,22,10,20,18,21,14,17,19,19,14,11,15,14,2,8,12,5,10,24,6,12,18,9,0,10,17,9,22,20,21,4,15,4,8,26,3,20,15,12,12,26,3,16,3,13,25,7,7,16,17,6,9,24,0,14,2,9,23,5,0,26,8,21,22,18,1,7,13,8,1,1,2,5],\"laizi\":[24,25],\"game_seats\":[[5,13,16,0,25,26,18,10,7,10,14,14,2,10],[1,6,23,15,2,19,4,19,17,20,17,11,8],[24,16,23,25,6,23,22,21,11,18,19,15,12],[25,4,24,11,13,3,20,11,22,21,19,14,5]]}', '1491558206', null, '[0,1,18,1,2,6,1,1,8,2,2,12,2,1,6,1,3,6,1,1,4,2,2,18,2,1,19,1,3,19,1,1,20,2,2,9,2,1,9,3,2,0,3,1,0,0,2,10,0,4,10,0,2,17,0,1,26,1,2,9,1,1,9,2,2,22,2,1,11,3,3,11,3,1,24,0,2,20,0,1,20,1,2,21,1,1,11,2,2,4,2,1,4,3,2,15,3,6,15]', '[4,-4,-4,4]');
INSERT INTO `t_games_archive` VALUES ('1491639535578755249', '0', '{\"type\":\"xthh\",\"button\":0,\"index\":0,\"mahjongs\":[1,0,0,0,1,1,1,1,1,2,1,1,1,10,10,10,11,11,11,11,13,12,13,13,18,19,18,18,18,20,18,18,19,21,19,19,22,22,22,22,23,23,23,23,24,24,24,24,26,26,26,26,5,13,13,13,14,14,14,14,15,15,15,15,16,16,16,16,17,17,17,17,18,18,18,18,19,19,19,19,20,20,20,20,21,21,21,21,22,22,22,22,23,23,23,23,24,24,24,24,25,25,25,25,26,26,26,26],\"laizi\":[2,3],\"game_seats\":[[1,1,1,1,11,13,18,18,19,22,23,24,26,5],[0,1,2,10,11,12,19,20,21,22,23,24,26],[0,1,1,10,11,13,18,18,19,22,23,24,26],[0,1,1,10,11,13,18,18,19,22,23,24,26]]}', '1491639631', null, '[0,1,5,1,2,13,1,1,13,2,2,13,2,1,13,3,2,14,3,1,14,0,2,14,0,1,11,1,2,14,1,1,14,2,2,14,2,1,14,3,2,15,3,1,15,0,2,15,0,1,1,2,3,1,2,1,0,3,2,15,3,1,26,1,5,26]', '[0,2,0,-2]');
INSERT INTO `t_games_archive` VALUES ('1491640920874338955', '0', '{\"type\":\"xthh\",\"button\":0,\"index\":0,\"mahjongs\":[1,0,0,0,1,1,1,1,1,2,1,1,1,10,10,10,11,11,11,11,13,12,13,13,18,19,18,18,18,20,18,18,19,21,19,19,22,22,22,22,23,23,23,23,24,24,24,24,26,26,26,26,5,13,13,13,14,14,14,14,15,15,15,15,16,16,16,16,17,17,17,17,18,18,18,18,19,19,19,19,20,20,20,20,21,21,21,21,22,22,22,22,23,23,23,23,24,24,24,24,25,25,25,25,26,26,26,26],\"laizi\":[25,26],\"game_seats\":[[1,1,1,1,11,13,18,18,19,22,23,24,26,5],[0,1,2,10,11,12,19,20,21,22,23,24,26],[0,1,1,10,11,13,18,18,19,22,23,24,26],[0,1,1,10,11,13,18,18,19,22,23,24,26]]}', '1491641552', null, '[0,1,5,1,2,13,1,6,13]', '[-2,6,-2,-2]');
INSERT INTO `t_games_archive` VALUES ('1491641726841925306', '0', '{\"type\":\"xthh\",\"button\":0,\"index\":0,\"mahjongs\":[1,0,0,0,1,1,1,1,1,2,1,1,1,10,10,10,11,13,11,11,13,13,13,13,18,19,18,18,18,20,18,18,19,21,19,19,22,22,22,22,23,23,23,23,24,24,24,24,26,26,26,26,5,13,13,13,14,14,14,14,15,15,15,15,16,16,16,16,17,17,17,17,18,18,18,18,19,19,19,19,20,20,20,20,21,21,21,21,22,22,22,22,23,23,23,23,24,24,24,24,25,25,25,25,26,26,26,26],\"laizi\":[25,26],\"game_seats\":[[1,1,1,1,11,13,18,18,19,22,23,24,26,5],[0,1,2,10,13,13,19,20,21,22,23,24,26],[0,1,1,10,11,13,18,18,19,22,23,24,26],[0,1,1,10,11,13,18,18,19,22,23,24,26]]}', '1491641785', null, '[0,1,13,1,3,13,1,1,10,2,2,13,2,1,10,3,2,13,3,1,10,0,2,14,0,1,11,1,2,14,1,6,14]', '[-2,6,-2,-2]');
INSERT INTO `t_games_archive` VALUES ('1491641726841925306', '1', '{\"type\":\"xthh\",\"button\":1,\"index\":1,\"mahjongs\":[1,0,0,0,1,1,1,1,1,2,1,1,1,10,10,10,11,14,11,11,14,14,13,13,18,19,18,18,18,20,18,18,19,21,19,19,22,22,22,22,23,23,23,23,24,24,24,24,26,26,26,26,5,13,13,13,14,14,14,14,15,15,15,15,16,16,16,16,17,17,17,17,18,18,18,18,19,19,19,19,20,20,20,20,21,21,21,21,22,22,22,22,23,23,23,23,24,24,24,24,25,25,25,25,26,26,26,26],\"laizi\":[25,26],\"game_seats\":[[0,1,1,10,11,13,18,18,19,22,23,24,26],[1,1,1,1,11,14,18,18,19,22,23,24,26,5],[0,1,2,10,14,14,19,20,21,22,23,24,26],[0,1,1,10,11,13,18,18,19,22,23,24,26]]}', '1491641969', null, '[1,1,14,2,3,14,2,1,10,3,2,13,3,1,13,0,2,13,0,1,13,1,2,14,1,1,11,2,2,14,2,4,14,2,2,14,2,6,14]', '[-5,-5,15,-5]');

-- ----------------------------
-- Table structure for t_guests
-- ----------------------------
DROP TABLE IF EXISTS `t_guests`;
CREATE TABLE `t_guests` (
  `guest_account` varchar(255) NOT NULL,
  PRIMARY KEY (`guest_account`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of t_guests
-- ----------------------------

-- ----------------------------
-- Table structure for t_history_room
-- ----------------------------
DROP TABLE IF EXISTS `t_history_room`;
CREATE TABLE `t_history_room` (
  `uuid` char(20) NOT NULL,
  `id` char(8) NOT NULL,
  `base_info` varchar(256) NOT NULL DEFAULT '0',
  `create_time` int(11) DEFAULT NULL,
  `num_of_turns` int(11) DEFAULT '0',
  `next_button` int(11) DEFAULT NULL,
  `user_id0` int(11) DEFAULT '0',
  `user_icon0` varchar(128) DEFAULT NULL,
  `user_name0` varchar(32) DEFAULT NULL,
  `user_score0` int(11) DEFAULT '0',
  `user_id1` int(11) DEFAULT '0',
  `user_icon1` varchar(128) DEFAULT NULL,
  `user_name1` varchar(32) DEFAULT NULL,
  `user_score1` int(11) DEFAULT '0',
  `user_id2` int(11) DEFAULT '0',
  `user_icon2` varchar(128) DEFAULT NULL,
  `user_name2` varchar(32) DEFAULT NULL,
  `user_score2` int(11) DEFAULT '0',
  `user_id3` int(11) DEFAULT '0',
  `user_icon3` varchar(128) DEFAULT NULL,
  `user_name3` varchar(32) DEFAULT NULL,
  `user_score3` int(11) NOT NULL DEFAULT '0',
  `ip` varchar(16) DEFAULT NULL,
  `port` int(11) DEFAULT '0',
  `user_create` int(11) DEFAULT NULL COMMENT '房间创建者ID',
  `user_createname` varchar(64) DEFAULT NULL COMMENT '房间创建者名字',
  `expired_time` int(11) DEFAULT NULL COMMENT '房间过期时间',
  PRIMARY KEY (`uuid`),
  UNIQUE KEY `uuid` (`uuid`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of t_history_room
-- ----------------------------
INSERT INTO `t_history_room` VALUES ('1491009086521225852', '225852', '0', null, '0', null, '16', '', '5a6H5paH56iz6LWi', '0', '17', '', '5qyn6Ziz5aW96L+Q', '0', '18', '', '54us5a2k6LWM5L6g', '0', '19', '', '5Y+46ams5aW96L+Q', '0', null, '0', null, null, null);
INSERT INTO `t_history_room` VALUES ('1491363170628218872', '218872', '0', null, '0', null, '19', '', '5Y+46ams5aW96L+Q', '0', '18', '', '54us5a2k6LWM5L6g', '0', '17', '', '5qyn6Ziz5aW96L+Q', '0', '16', '', '5a6H5paH56iz6LWi', '0', null, '0', null, null, null);
INSERT INTO `t_history_room` VALUES ('1491363643527920913', '920913', '0', null, '0', null, '16', '', '5a6H5paH56iz6LWi', '0', '17', '', '5qyn6Ziz5aW96L+Q', '0', '18', '', '54us5a2k6LWM5L6g', '0', '19', '', '5Y+46ams5aW96L+Q', '0', null, '0', null, null, null);
INSERT INTO `t_history_room` VALUES ('1491364592622602011', '602011', '0', null, '0', null, '16', '', '5a6H5paH56iz6LWi', '0', '17', '', '5qyn6Ziz5aW96L+Q', '0', '18', '', '54us5a2k6LWM5L6g', '0', '19', '', '5Y+46ams5aW96L+Q', '0', null, '0', null, null, null);
INSERT INTO `t_history_room` VALUES ('1491364893241429495', '429495', '0', null, '0', null, '16', '', '5a6H5paH56iz6LWi', '0', '17', '', '5qyn6Ziz5aW96L+Q', '0', '18', '', '54us5a2k6LWM5L6g', '0', '19', '', '5Y+46ams5aW96L+Q', '0', null, '0', null, null, null);
INSERT INTO `t_history_room` VALUES ('1491365079700558985', '558985', '0', null, '0', null, '16', '', '5a6H5paH56iz6LWi', '0', '17', '', '5qyn6Ziz5aW96L+Q', '0', '18', '', '54us5a2k6LWM5L6g', '0', '19', '', '5Y+46ams5aW96L+Q', '0', null, '0', null, null, null);
INSERT INTO `t_history_room` VALUES ('1491370508415731749', '731749', '0', null, '0', null, '16', '', '5a6H5paH56iz6LWi', '0', '17', '', '5qyn6Ziz5aW96L+Q', '0', '18', '', '54us5a2k6LWM5L6g', '0', '19', '', '5Y+46ams5aW96L+Q', '0', null, '0', null, null, null);
INSERT INTO `t_history_room` VALUES ('1491552989647114885', '114885', '0', null, '0', null, '25', '', '5qyn6Ziz6LWM5L6g', '0', '0', '{7}', '{8}', '0', '0', '{11}', '{12}', '0', '0', '{15}', '{16}', '0', null, '0', null, null, null);
INSERT INTO `t_history_room` VALUES ('1491553005455814828', '814828', '0', null, '0', null, '25', '', '5qyn6Ziz6LWM5L6g', '0', '0', '{7}', '{8}', '0', '0', '{11}', '{12}', '0', '0', '{15}', '{16}', '0', null, '0', null, null, null);
INSERT INTO `t_history_room` VALUES ('1491553143886478014', '478014', '0', null, '0', null, '19', '', '5Y+46ams5aW96L+Q', '0', '18', '', '54us5a2k6LWM5L6g', '0', '17', '', '5qyn6Ziz5aW96L+Q', '0', '16', '', '5a6H5paH56iz6LWi', '0', null, '0', null, null, null);
INSERT INTO `t_history_room` VALUES ('1491553566149120259', '120259', '0', null, '0', null, '19', '', '5Y+46ams5aW96L+Q', '0', '18', '', '54us5a2k6LWM5L6g', '0', '17', '', '5qyn6Ziz5aW96L+Q', '0', '16', '', '5a6H5paH56iz6LWi', '0', null, '0', null, null, null);
INSERT INTO `t_history_room` VALUES ('1491554002717846542', '846542', '0', null, '0', null, '19', '', '5Y+46ams5aW96L+Q', '0', '18', '', '54us5a2k6LWM5L6g', '0', '17', '', '5qyn6Ziz5aW96L+Q', '0', '16', '', '5a6H5paH56iz6LWi', '0', null, '0', null, null, null);
INSERT INTO `t_history_room` VALUES ('1491554401384613383', '613383', '0', null, '0', null, '25', '', '5qyn6Ziz6LWM5L6g', '0', '0', '{7}', '{8}', '0', '0', '{11}', '{12}', '0', '0', '{15}', '{16}', '0', null, '0', null, null, null);
INSERT INTO `t_history_room` VALUES ('1491554442190814797', '814797', '0', null, '0', null, '16', '', '5a6H5paH56iz6LWi', '0', '17', '', '5qyn6Ziz5aW96L+Q', '0', '18', '', '54us5a2k6LWM5L6g', '0', '19', '', '5Y+46ams5aW96L+Q', '0', null, '0', null, null, null);
INSERT INTO `t_history_room` VALUES ('1491558111658192705', '192705', '0', null, '0', null, '19', '', '5Y+46ams5aW96L+Q', '0', '18', '', '54us5a2k6LWM5L6g', '0', '17', '', '5qyn6Ziz5aW96L+Q', '0', '16', '', '5a6H5paH56iz6LWi', '0', null, '0', null, null, null);
INSERT INTO `t_history_room` VALUES ('1491562142488636470', '636470', '0', null, '0', null, '16', '', '5a6H5paH56iz6LWi', '0', '17', '', '5qyn6Ziz5aW96L+Q', '0', '18', '', '54us5a2k6LWM5L6g', '0', '19', '', '5Y+46ams5aW96L+Q', '0', null, '0', null, null, null);
INSERT INTO `t_history_room` VALUES ('1491630618676809224', '809224', '0', null, '0', null, '16', '', '5a6H5paH56iz6LWi', '0', '17', '', '5qyn6Ziz5aW96L+Q', '0', '18', '', '54us5a2k6LWM5L6g', '0', '19', '', '5Y+46ams5aW96L+Q', '0', null, '0', null, null, null);
INSERT INTO `t_history_room` VALUES ('1491639535578755249', '755249', '0', null, '0', null, '19', '', '5Y+46ams5aW96L+Q', '0', '18', '', '54us5a2k6LWM5L6g', '0', '17', '', '5qyn6Ziz5aW96L+Q', '0', '16', '', '5a6H5paH56iz6LWi', '0', null, '0', null, null, null);
INSERT INTO `t_history_room` VALUES ('1491640920874338955', '338955', '0', null, '0', null, '17', '', '5qyn6Ziz5aW96L+Q', '0', '18', '', '54us5a2k6LWM5L6g', '0', '19', '', '5Y+46ams5aW96L+Q', '0', '16', '', '5a6H5paH56iz6LWi', '0', null, '0', null, null, null);
INSERT INTO `t_history_room` VALUES ('1491641726841925306', '925306', '0', null, '0', null, '19', '', '5Y+46ams5aW96L+Q', '0', '18', '', '54us5a2k6LWM5L6g', '0', '17', '', '5qyn6Ziz5aW96L+Q', '0', '16', '', '5a6H5paH56iz6LWi', '0', null, '0', null, null, null);
INSERT INTO `t_history_room` VALUES ('1491642086806185854', '185854', '0', null, '0', null, '19', '', '5Y+46ams5aW96L+Q', '0', '18', '', '54us5a2k6LWM5L6g', '0', '17', '', '5qyn6Ziz5aW96L+Q', '0', '16', '', '5a6H5paH56iz6LWi', '0', null, '0', null, null, null);
INSERT INTO `t_history_room` VALUES ('1491642407062501762', '501762', '0', null, '0', null, '16', '', '5a6H5paH56iz6LWi', '0', '16', '', '5a6H5paH56iz6LWi', '0', '0', '{11}', '{12}', '0', '0', '{15}', '{16}', '0', null, '0', null, null, null);
INSERT INTO `t_history_room` VALUES ('1491642418731122601', '122601', '0', null, '0', null, '17', '', '5qyn6Ziz5aW96L+Q', '0', '16', '', '5a6H5paH56iz6LWi', '0', '0', '{11}', '{12}', '0', '0', '{15}', '{16}', '0', null, '0', null, null, null);
INSERT INTO `t_history_room` VALUES ('1491642598945793444', '793444', '0', null, '0', null, '17', '', '5qyn6Ziz5aW96L+Q', '0', '16', '', '5a6H5paH56iz6LWi', '0', '0', '{11}', '{12}', '0', '0', '{15}', '{16}', '0', null, '0', null, null, null);
INSERT INTO `t_history_room` VALUES ('1491787438308823741', '823741', '0', null, '0', null, '25', '', '5qyn6Ziz6LWM5L6g', '0', '0', '{7}', '{8}', '0', '0', '{11}', '{12}', '0', '0', '{15}', '{16}', '0', null, '0', null, null, null);
INSERT INTO `t_history_room` VALUES ('1491872454784306017', '306017', '0', null, '0', null, '25', '', '5qyn6Ziz6LWM5L6g', '0', '0', '{7}', '{8}', '0', '0', '{11}', '{12}', '0', '0', '{15}', '{16}', '0', null, '0', null, null, null);
INSERT INTO `t_history_room` VALUES ('1491872964073871630', '871630', '0', null, '0', null, '25', '', '5qyn6Ziz6LWM5L6g', '0', '0', '{7}', '{8}', '0', '0', '{11}', '{12}', '0', '0', '{15}', '{16}', '0', null, '0', null, null, null);
INSERT INTO `t_history_room` VALUES ('1491872968835408700', '408700', '0', null, '0', null, '25', '', '5qyn6Ziz6LWM5L6g', '0', '25', '', '5qyn6Ziz6LWM5L6g', '0', '0', '{11}', '{12}', '0', '0', '{15}', '{16}', '0', null, '0', null, null, null);
INSERT INTO `t_history_room` VALUES ('1491873291088442958', '442958', '0', null, '0', null, '25', '', '5qyn6Ziz6LWM5L6g', '0', '0', '{7}', '{8}', '0', '0', '{11}', '{12}', '0', '0', '{15}', '{16}', '0', null, '0', null, null, null);
INSERT INTO `t_history_room` VALUES ('1491873316935865045', '865045', '0', null, '0', null, '25', '', '5qyn6Ziz6LWM5L6g', '0', '25', '', '5qyn6Ziz6LWM5L6g', '0', '0', '{11}', '{12}', '0', '0', '{15}', '{16}', '0', null, '0', null, null, null);
INSERT INTO `t_history_room` VALUES ('1491873318737577016', '577016', '0', null, '0', null, '25', '', '5qyn6Ziz6LWM5L6g', '0', '25', '', '5qyn6Ziz6LWM5L6g', '0', '0', '{11}', '{12}', '0', '0', '{15}', '{16}', '0', null, '0', null, null, null);
INSERT INTO `t_history_room` VALUES ('1491873325573106497', '106497', '0', null, '0', null, '25', '', '5qyn6Ziz6LWM5L6g', '0', '25', '', '5qyn6Ziz6LWM5L6g', '0', '0', '{11}', '{12}', '0', '0', '{15}', '{16}', '0', null, '0', null, null, null);
INSERT INTO `t_history_room` VALUES ('1491873372484939774', '939774', '0', null, '0', null, '25', '', '5qyn6Ziz6LWM5L6g', '0', '0', '{7}', '{8}', '0', '0', '{11}', '{12}', '0', '0', '{15}', '{16}', '0', null, '0', null, null, null);
INSERT INTO `t_history_room` VALUES ('1491875326535665389', '665389', '0', null, '0', null, '25', '', '5qyn6Ziz6LWM5L6g', '0', '0', '{7}', '{8}', '0', '0', '{11}', '{12}', '0', '0', '{15}', '{16}', '0', null, '0', null, null, null);
INSERT INTO `t_history_room` VALUES ('1491876071758557191', '557191', '0', null, '0', null, '25', '', '5qyn6Ziz6LWM5L6g', '0', '25', '', '5qyn6Ziz6LWM5L6g', '0', '25', '', '5qyn6Ziz6LWM5L6g', '0', '25', '', '5qyn6Ziz6LWM5L6g', '0', null, '0', null, null, null);
INSERT INTO `t_history_room` VALUES ('1491876077630510779', '510779', '0', null, '0', null, '25', '', '5qyn6Ziz6LWM5L6g', '0', '25', '', '5qyn6Ziz6LWM5L6g', '0', '25', '', '5qyn6Ziz6LWM5L6g', '0', '0', '{15}', '{16}', '0', null, '0', null, null, null);
INSERT INTO `t_history_room` VALUES ('1491876346573147236', '147236', '0', null, '0', null, '25', '', '5qyn6Ziz6LWM5L6g', '0', '25', '', '5qyn6Ziz6LWM5L6g', '0', '25', '', '5qyn6Ziz6LWM5L6g', '0', '0', '{15}', '{16}', '0', null, '0', null, null, null);
INSERT INTO `t_history_room` VALUES ('1491893016928083782', '083782', '0', null, '0', null, '25', '', '5qyn6Ziz6LWM5L6g', '0', '0', '{7}', '{8}', '0', '0', '{11}', '{12}', '0', '0', '{15}', '{16}', '0', null, '0', null, null, null);
INSERT INTO `t_history_room` VALUES ('1491903549098570263', '570263', '0', null, '0', null, '27', '', '5a2Q6L2m6Ieq5pG4', '0', '0', '{7}', '{8}', '0', '0', '{11}', '{12}', '0', '0', '{15}', '{16}', '0', null, '0', null, null, null);
INSERT INTO `t_history_room` VALUES ('1491903790589419458', '419458', '0', null, '0', null, '27', '', '5a2Q6L2m6Ieq5pG4', '0', '0', '{7}', '{8}', '0', '0', '{11}', '{12}', '0', '0', '{15}', '{16}', '0', null, '0', null, null, null);
INSERT INTO `t_history_room` VALUES ('1491904067893138464', '138464', '0', null, '0', null, '27', '', '5a2Q6L2m6Ieq5pG4', '0', '0', '{7}', '{8}', '0', '0', '{11}', '{12}', '0', '0', '{15}', '{16}', '0', null, '0', null, null, null);
INSERT INTO `t_history_room` VALUES ('1491904084198696201', '696201', '0', null, '0', null, '27', '', '5a2Q6L2m6Ieq5pG4', '0', '0', '{7}', '{8}', '0', '0', '{11}', '{12}', '0', '0', '{15}', '{16}', '0', null, '0', null, null, null);
INSERT INTO `t_history_room` VALUES ('1491905386593790037', '790037', '0', null, '0', null, '27', '', '5a2Q6L2m6Ieq5pG4', '0', '0', '{7}', '{8}', '0', '0', '{11}', '{12}', '0', '0', '{15}', '{16}', '0', null, '0', null, null, null);
INSERT INTO `t_history_room` VALUES ('1491906222903718474', '718474', '0', null, '0', null, '27', '', '5a2Q6L2m6Ieq5pG4', '0', '0', '{7}', '{8}', '0', '0', '{11}', '{12}', '0', '0', '{15}', '{16}', '0', null, '0', null, null, null);
INSERT INTO `t_history_room` VALUES ('1491906240360287798', '287798', '0', null, '0', null, '27', '', '5a2Q6L2m6Ieq5pG4', '0', '0', '{7}', '{8}', '0', '0', '{11}', '{12}', '0', '0', '{15}', '{16}', '0', null, '0', null, null, null);
INSERT INTO `t_history_room` VALUES ('1491906248824080702', '080702', '0', null, '0', null, '27', '', '5a2Q6L2m6Ieq5pG4', '0', '19', '', '5Y+46ams5aW96L+Q', '0', '0', '{11}', '{12}', '0', '0', '{15}', '{16}', '0', null, '0', null, null, null);
INSERT INTO `t_history_room` VALUES ('1491906495010560623', '560623', '0', null, '0', null, '27', '', '5a2Q6L2m6Ieq5pG4', '0', '0', '{7}', '{8}', '0', '0', '{11}', '{12}', '0', '0', '{15}', '{16}', '0', null, '0', null, null, null);
INSERT INTO `t_history_room` VALUES ('1491907969406172500', '172500', '0', null, '0', null, '28', '', '5LiK5a6Y5aW96L+Q', '0', '0', '{7}', '{8}', '0', '0', '{11}', '{12}', '0', '0', '{15}', '{16}', '0', null, '0', null, null, null);
INSERT INTO `t_history_room` VALUES ('1491909256914589928', '589928', '0', null, '0', null, '31', '', '5Y+46ams6LWM5L6g', '0', '0', '{7}', '{8}', '0', '0', '{11}', '{12}', '0', '0', '{15}', '{16}', '0', null, '0', null, null, null);
INSERT INTO `t_history_room` VALUES ('1491910934504767077', '767077', '0', null, '0', null, '30', '', '54us5a2k6ZuA5Zyj', '0', '19', '', '5Y+46ams5aW96L+Q', '0', '18', '', '54us5a2k6LWM5L6g', '0', '17', '', '5qyn6Ziz5aW96L+Q', '0', null, '0', null, null, null);
INSERT INTO `t_history_room` VALUES ('1491911043528681501', '681501', '0', null, '0', null, '19', '', '5Y+46ams5aW96L+Q', '0', '18', '', '54us5a2k6LWM5L6g', '0', '17', '', '5qyn6Ziz5aW96L+Q', '0', '16', '', '5a6H5paH56iz6LWi', '0', null, '0', null, null, null);
INSERT INTO `t_history_room` VALUES ('1491911278218314105', '314105', '0', null, '0', null, '18', '', '54us5a2k6LWM5L6g', '0', '0', '{7}', '{8}', '0', '0', '{11}', '{12}', '0', '0', '{15}', '{16}', '0', null, '0', null, null, null);
INSERT INTO `t_history_room` VALUES ('1491911321256514025', '514025', '0', null, '0', null, '30', '', '54us5a2k6ZuA5Zyj', '0', '0', '{7}', '{8}', '0', '0', '{11}', '{12}', '0', '0', '{15}', '{16}', '0', null, '0', null, null, null);

-- ----------------------------
-- Table structure for t_log_trade
-- ----------------------------
DROP TABLE IF EXISTS `t_log_trade`;
CREATE TABLE `t_log_trade` (
  `id` int(11) NOT NULL,
  `order_code` varchar(64) DEFAULT NULL COMMENT '订单号',
  `uid` int(11) DEFAULT NULL COMMENT '用户ID',
  `order_status` varchar(64) DEFAULT NULL COMMENT '订单状态',
  `pay_type` varchar(64) DEFAULT NULL COMMENT '支付类型：微信支付',
  `log_time` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of t_log_trade
-- ----------------------------

-- ----------------------------
-- Table structure for t_message
-- ----------------------------
DROP TABLE IF EXISTS `t_message`;
CREATE TABLE `t_message` (
  `type` varchar(32) NOT NULL,
  `msg` varchar(1024) NOT NULL,
  `version` varchar(32) NOT NULL,
  PRIMARY KEY (`type`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of t_message
-- ----------------------------
INSERT INTO `t_message` VALUES ('notice', '近日有不法分子利用本团队产品进行销售诈骗，希望大家小心提防，本团队唯一联系方式 123456789@qq.com  本品为团队产品的测试版本，无限房卡。游戏中所用美术资源均来自网络。如有疑问，请邮件联系 123456789@qq.com !!!!!', '20161128');
INSERT INTO `t_message` VALUES ('fkgm', '淘宝店铺：https://shop123456789.taobao.com/<newline>唯一联系方式 123456789@qq.com', '20161128');

-- ----------------------------
-- Table structure for t_mission
-- ----------------------------
DROP TABLE IF EXISTS `t_mission`;
CREATE TABLE `t_mission` (
  `userid` int(30) NOT NULL,
  `mission_one_state` varchar(255) DEFAULT NULL,
  `mission_one` varchar(255) DEFAULT NULL,
  `complete_one` varchar(255) DEFAULT NULL,
  `mission_two` varchar(255) DEFAULT NULL,
  `mission_two_state` varchar(255) DEFAULT NULL,
  `complete_two` varchar(255) DEFAULT NULL,
  `mission_three` varchar(255) DEFAULT NULL,
  `mission_three_state` varchar(255) DEFAULT NULL,
  `complete_three` varchar(255) DEFAULT NULL,
  `time_data` date DEFAULT '2015-01-01'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of t_mission
-- ----------------------------

-- ----------------------------
-- Table structure for t_mission_copy
-- ----------------------------
DROP TABLE IF EXISTS `t_mission_copy`;
CREATE TABLE `t_mission_copy` (
  `userid` int(30) NOT NULL,
  `mission_one_state` varchar(255) DEFAULT NULL,
  `mission_one` varchar(255) DEFAULT NULL,
  `complete_one` varchar(255) DEFAULT NULL,
  `mission_two` varchar(255) DEFAULT NULL,
  `mission_two_state` varchar(255) DEFAULT NULL,
  `complete_two` varchar(255) DEFAULT NULL,
  `mission_three` varchar(255) DEFAULT NULL,
  `mission_three_state` varchar(255) DEFAULT NULL,
  `complete_three` varchar(255) DEFAULT NULL,
  `time_data` date DEFAULT '2015-01-01'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of t_mission_copy
-- ----------------------------

-- ----------------------------
-- Table structure for t_mission_copy1
-- ----------------------------
DROP TABLE IF EXISTS `t_mission_copy1`;
CREATE TABLE `t_mission_copy1` (
  `userid` int(30) NOT NULL,
  `mission_one_state` varchar(255) DEFAULT NULL,
  `mission_one` varchar(255) DEFAULT NULL,
  `complete_one` varchar(255) DEFAULT NULL,
  `mission_two` varchar(255) DEFAULT NULL,
  `mission_two_state` varchar(255) DEFAULT NULL,
  `complete_two` varchar(255) DEFAULT NULL,
  `mission_three` varchar(255) DEFAULT NULL,
  `mission_three_state` varchar(255) DEFAULT NULL,
  `complete_three` varchar(255) DEFAULT NULL,
  `time_data` date DEFAULT '2015-01-01'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of t_mission_copy1
-- ----------------------------

-- ----------------------------
-- Table structure for t_rooms
-- ----------------------------
DROP TABLE IF EXISTS `t_rooms`;
CREATE TABLE `t_rooms` (
  `uuid` char(20) NOT NULL,
  `id` char(8) NOT NULL,
  `base_info` varchar(256) NOT NULL DEFAULT '0',
  `create_time` int(11) DEFAULT NULL,
  `num_of_turns` int(11) DEFAULT '0',
  `next_button` int(11) DEFAULT NULL,
  `user_id0` int(11) DEFAULT '0',
  `user_icon0` varchar(128) DEFAULT NULL,
  `user_name0` varchar(32) DEFAULT NULL,
  `user_score0` int(11) DEFAULT '0',
  `user_id1` int(11) DEFAULT '0',
  `user_icon1` varchar(128) DEFAULT NULL,
  `user_name1` varchar(32) DEFAULT NULL,
  `user_score1` int(11) DEFAULT '0',
  `user_id2` int(11) DEFAULT '0',
  `user_icon2` varchar(128) DEFAULT NULL,
  `user_name2` varchar(32) DEFAULT NULL,
  `user_score2` int(11) DEFAULT '0',
  `user_id3` int(11) DEFAULT '0',
  `user_icon3` varchar(128) DEFAULT NULL,
  `user_name3` varchar(32) DEFAULT NULL,
  `user_score3` int(11) DEFAULT '0',
  `ip` varchar(16) DEFAULT NULL,
  `port` int(11) DEFAULT '0',
  `user_create` int(11) DEFAULT NULL COMMENT '房间创建者ID',
  `user_createname` varchar(64) DEFAULT NULL COMMENT '房间创建者名字',
  `expired_time` int(11) DEFAULT NULL COMMENT '房间过期时间',
  `cost_gems` int(11) DEFAULT '0',
  `status` int(11) DEFAULT '0',
  `room_create_type` int(11) DEFAULT '0' COMMENT '是否是为他人开房',
  PRIMARY KEY (`uuid`),
  UNIQUE KEY `uuid` (`uuid`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of t_rooms
-- ----------------------------

-- ----------------------------
-- Table structure for t_slyder_result
-- ----------------------------
DROP TABLE IF EXISTS `t_slyder_result`;
CREATE TABLE `t_slyder_result` (
  `uid` int(11) NOT NULL COMMENT '用户ID',
  `result` int(11) DEFAULT NULL COMMENT '结果',
  `result_des` varchar(256) DEFAULT NULL COMMENT '结果描述',
  `operator_time` datetime DEFAULT NULL COMMENT '时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of t_slyder_result
-- ----------------------------
INSERT INTO `t_slyder_result` VALUES ('32', '4', '物品', '2017-04-26 15:50:25');
INSERT INTO `t_slyder_result` VALUES ('32', '7', '物品', '2017-04-26 15:51:36');
INSERT INTO `t_slyder_result` VALUES ('32', '6', '物品', '2017-04-26 15:51:54');
INSERT INTO `t_slyder_result` VALUES ('32', '5', '物品', '2017-04-26 15:52:33');
INSERT INTO `t_slyder_result` VALUES ('19', '7', '物品', '2017-04-26 15:53:03');
INSERT INTO `t_slyder_result` VALUES ('18', '5', '物品', '2017-04-26 15:55:00');
INSERT INTO `t_slyder_result` VALUES ('18', '2', '物品', '2017-04-26 15:55:08');
INSERT INTO `t_slyder_result` VALUES ('32', '4', '物品', '2017-04-26 17:18:29');
INSERT INTO `t_slyder_result` VALUES ('32', '3', '物品', '2017-04-26 17:20:02');
INSERT INTO `t_slyder_result` VALUES ('19', '3', '物品', '2017-04-26 17:20:35');
INSERT INTO `t_slyder_result` VALUES ('32', '8', '物品', '2017-04-26 17:27:02');
INSERT INTO `t_slyder_result` VALUES ('32', '3', '物品', '2017-04-26 17:29:10');
INSERT INTO `t_slyder_result` VALUES ('32', '4', '物品', '2017-04-26 17:31:15');
INSERT INTO `t_slyder_result` VALUES ('19', '4', '物品', '2017-04-26 17:32:43');
INSERT INTO `t_slyder_result` VALUES ('18', '4', '物品', '2017-04-26 17:33:26');
INSERT INTO `t_slyder_result` VALUES ('18', '4', '物品', '2017-04-26 17:34:23');
INSERT INTO `t_slyder_result` VALUES ('32', '7', '物品', '2017-04-26 17:36:57');
INSERT INTO `t_slyder_result` VALUES ('32', '8', '物品', '2017-04-26 17:37:39');

-- ----------------------------
-- Table structure for t_task
-- ----------------------------
DROP TABLE IF EXISTS `t_task`;
CREATE TABLE `t_task` (
  `id` int(11) NOT NULL,
  `task_name` varchar(256) DEFAULT NULL,
  `task_des` varchar(64) DEFAULT NULL COMMENT '任务描述',
  `task_reward_type` int(11) DEFAULT NULL COMMENT '奖励类型',
  `task_reward_num` int(11) DEFAULT NULL COMMENT '奖励数量',
  `limit_time_per_day` int(11) DEFAULT NULL COMMENT '每天限制数',
  `add_time` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of t_task
-- ----------------------------

-- ----------------------------
-- Table structure for t_trade_direct
-- ----------------------------
DROP TABLE IF EXISTS `t_trade_direct`;
CREATE TABLE `t_trade_direct` (
  `id` int(11) NOT NULL,
  `trade_serial_no` varchar(64) DEFAULT NULL,
  `golds_payment` int(11) DEFAULT NULL COMMENT '支付金额',
  `goods_num` int(11) DEFAULT NULL COMMENT '货物数量',
  `goods_name` varchar(64) DEFAULT NULL COMMENT '商品名称',
  `goods_code` varchar(64) DEFAULT NULL COMMENT '商品代码',
  `goods_send_status` varchar(64) DEFAULT NULL COMMENT '货物发货状态',
  `trade_time` datetime DEFAULT NULL COMMENT '交易时间',
  `goods_send_remark` varchar(32) DEFAULT NULL COMMENT '商品发货说明',
  `goods_send_operator_user` int(11) DEFAULT NULL COMMENT '发货人',
  `goods_send_time` datetime DEFAULT NULL COMMENT '商品发货时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of t_trade_direct
-- ----------------------------
INSERT INTO `t_trade_direct` VALUES ('32', '', '200', '0', '', '2', '', '2017-04-27 10:13:49', '', '0', '2017-04-27 10:13:49');
INSERT INTO `t_trade_direct` VALUES ('32', '', '200', '0', '', '2', '', '2017-04-27 10:41:14', '', '0', '2017-04-27 10:41:14');
INSERT INTO `t_trade_direct` VALUES ('32', '', '200', '0', '', '2', '', '2017-04-27 10:42:30', '', '0', '2017-04-27 10:42:30');
INSERT INTO `t_trade_direct` VALUES ('32', '', '200', '0', '', '2', '', '2017-04-27 10:42:35', '', '0', '2017-04-27 10:42:35');
INSERT INTO `t_trade_direct` VALUES ('32', '', '500', '0', '', '5', '', '2017-04-27 10:45:07', '', '0', '2017-04-27 10:45:07');
INSERT INTO `t_trade_direct` VALUES ('32', '', '200', '0', '', '2', '', '2017-04-27 10:45:09', '', '0', '2017-04-27 10:45:09');
INSERT INTO `t_trade_direct` VALUES ('32', '', '300', '0', '', '3', '', '2017-04-27 10:45:11', '', '0', '2017-04-27 10:45:11');
INSERT INTO `t_trade_direct` VALUES ('32', '', '600', '0', '', '6', '', '2017-04-27 10:45:13', '', '0', '2017-04-27 10:45:13');
INSERT INTO `t_trade_direct` VALUES ('32', '', '400', '0', '', '4', '', '2017-04-27 10:45:16', '', '0', '2017-04-27 10:45:16');
INSERT INTO `t_trade_direct` VALUES ('32', '', '200', '0', '', '2', '', '2017-04-27 10:45:17', '', '0', '2017-04-27 10:45:17');
INSERT INTO `t_trade_direct` VALUES ('32', '', '200', '0', '', '2', '', '2017-04-27 10:52:00', '', '0', '2017-04-27 10:52:00');
INSERT INTO `t_trade_direct` VALUES ('32', '', '300', '0', '', '3', '', '2017-04-27 10:52:01', '', '0', '2017-04-27 10:52:01');

-- ----------------------------
-- Table structure for t_trade_order
-- ----------------------------
DROP TABLE IF EXISTS `t_trade_order`;
CREATE TABLE `t_trade_order` (
  `id` int(11) NOT NULL,
  `order_code` varchar(64) DEFAULT NULL COMMENT '订单号',
  `uid` int(11) DEFAULT NULL COMMENT '用户ID',
  `goods_name` varchar(64) DEFAULT NULL COMMENT '商品名称',
  `pay_money` int(11) DEFAULT NULL COMMENT '支付金额',
  `order_status` varchar(64) DEFAULT NULL COMMENT '订单状态',
  `pay_type` varchar(64) DEFAULT NULL COMMENT '支付类型：微信支付',
  `suggest_uid` int(11) DEFAULT NULL COMMENT '推荐人ID',
  `gems` int(11) DEFAULT NULL COMMENT '购买的宝石数量',
  `suggest_name` varchar(32) DEFAULT NULL COMMENT '推荐人名称'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of t_trade_order
-- ----------------------------

-- ----------------------------
-- Table structure for t_users
-- ----------------------------
DROP TABLE IF EXISTS `t_users`;
CREATE TABLE `t_users` (
  `userid` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `account` varchar(64) NOT NULL DEFAULT '' COMMENT '账号',
  `name` varchar(32) DEFAULT NULL COMMENT '用户昵称',
  `sex` int(1) DEFAULT NULL,
  `headimg` varchar(256) DEFAULT NULL,
  `lv` smallint(6) DEFAULT '1' COMMENT '用户等级',
  `exp` int(11) DEFAULT '0' COMMENT '用户经验',
  `coins` int(11) DEFAULT '0' COMMENT '用户金币',
  `gems` int(11) DEFAULT '0' COMMENT '用户宝石',
  `roomid` varchar(8) DEFAULT NULL,
  `history` varchar(4096) DEFAULT NULL,
  `token` varchar(256) DEFAULT NULL COMMENT '验证登录合法性',
  `suggest_user` int(11) DEFAULT NULL COMMENT '推荐人ID',
  `dealer_level` int(8) DEFAULT NULL COMMENT '是否是代理',
  `dealer_account` varchar(64) DEFAULT NULL COMMENT '绑定的代理帐号',
  `unionid` varchar(64) DEFAULT NULL COMMENT '微信总ID',
  PRIMARY KEY (`userid`),
  UNIQUE KEY `account` (`account`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of t_users
-- ----------------------------
INSERT INTO `t_users` VALUES ('16', 'guest_asdf4', '5a6H5paH56iz6LWi', '0', null, '1', '0', '1000', '58', '865446', '[{\"uuid\":\"1490946333341744320\",\"id\":\"744320\",\"time\":1490946334,\"seats\":[{\"userid\":19,\"name\":\"5Y+46ams5aW96L+Q\",\"score\":0},{\"userid\":18,\"name\":\"54us5a2k6LWM5L6g\",\"score\":0},{\"userid\":17,\"name\":\"5qyn6Ziz5aW96L+Q\",\"score\":0},{\"userid\":16,\"name\":\"5a6H5paH56iz6LWi\",\"score\":0}]},{\"uuid\":\"1491370508415731749\",\"id\":\"731749\",\"time\":1491370509,\"seats\":[{\"userid\":16,\"name\":\"5a6H5paH56iz6LWi\",\"score\":-2},{\"userid\":17,\"name\":\"5qyn6Ziz5aW96L+Q\",\"score\":2},{\"userid\":18,\"name\":\"54us5a2k6LWM5L6g\",\"score\":0},{\"userid\":19,\"name\":\"5Y+46ams5aW96L+Q\",\"score\":0}]},{\"uuid\":\"1491553143886478014\",\"id\":\"478014\",\"time\":1491553144,\"seats\":[{\"userid\":19,\"name\":\"5Y+46ams5aW96L+Q\",\"score\":-2},{\"userid\":18,\"name\":\"54us5a2k6LWM5L6g\",\"score\":6},{\"userid\":17,\"name\":\"5qyn6Ziz5aW96L+Q\",\"score\":-2},{\"userid\":16,\"name\":\"5a6H5paH56iz6LWi\",\"score\":-2}]},{\"uuid\":\"1491553566149120259\",\"id\":\"120259\",\"time\":1491553567,\"seats\":[{\"userid\":19,\"name\":\"5Y+46ams5aW96L+Q\",\"score\":6},{\"userid\":18,\"name\":\"54us5a2k6LWM5L6g\",\"score\":-2},{\"userid\":17,\"name\":\"5qyn6Ziz5aW96L+Q\",\"score\":-2},{\"userid\":16,\"name\":\"5a6H5paH56iz6LWi\",\"score\":-2}]},{\"uuid\":\"1491554002717846542\",\"id\":\"846542\",\"time\":1491554003,\"seats\":[{\"userid\":19,\"name\":\"5Y+46ams5aW96L+Q\",\"score\":3},{\"userid\":18,\"name\":\"54us5a2k6LWM5L6g\",\"score\":-2},{\"userid\":17,\"name\":\"5qyn6Ziz5aW96L+Q\",\"score\":-2},{\"userid\":16,\"name\":\"5a6H5paH56iz6LWi\",\"score\":1}]},{\"uuid\":\"1491554442190814797\",\"id\":\"814797\",\"time\":1491554443,\"seats\":[{\"userid\":16,\"name\":\"5a6H5paH56iz6LWi\",\"score\":-2},{\"userid\":17,\"name\":\"5qyn6Ziz5aW96L+Q\",\"score\":0},{\"userid\":18,\"name\":\"54us5a2k6LWM5L6g\",\"score\":2},{\"userid\":19,\"name\":\"5Y+46ams5aW96L+Q\",\"score\":0}]},{\"uuid\":\"1491558111658192705\",\"id\":\"192705\",\"time\":1491558112,\"seats\":[{\"userid\":19,\"name\":\"5Y+46ams5aW96L+Q\",\"score\":4},{\"userid\":18,\"name\":\"54us5a2k6LWM5L6g\",\"score\":-4},{\"userid\":17,\"name\":\"5qyn6Ziz5aW96L+Q\",\"score\":-4},{\"userid\":16,\"name\":\"5a6H5paH56iz6LWi\",\"score\":4}]},{\"uuid\":\"1491639535578755249\",\"id\":\"755249\",\"time\":1491639536,\"seats\":[{\"userid\":19,\"name\":\"5Y+46ams5aW96L+Q\",\"score\":0},{\"userid\":18,\"name\":\"54us5a2k6LWM5L6g\",\"score\":2},{\"userid\":17,\"name\":\"5qyn6Ziz5aW96L+Q\",\"score\":0},{\"userid\":16,\"name\":\"5a6H5paH56iz6LWi\",\"score\":-2}]},{\"uuid\":\"1491640920874338955\",\"id\":\"338955\",\"time\":1491640921,\"seats\":[{\"userid\":17,\"name\":\"5qyn6Ziz5aW96L+Q\",\"score\":-2},{\"userid\":18,\"name\":\"54us5a2k6LWM5L6g\",\"score\":6},{\"userid\":19,\"name\":\"5Y+46ams5aW96L+Q\",\"score\":-2},{\"userid\":16,\"name\":\"5a6H5paH56iz6LWi\",\"score\":-2}]},{\"uuid\":\"1491641726841925306\",\"id\":\"925306\",\"time\":1491641727,\"seats\":[{\"userid\":19,\"name\":\"5Y+46ams5aW96L+Q\",\"score\":-5},{\"userid\":18,\"name\":\"54us5a2k6LWM5L6g\",\"score\":-5},{\"userid\":17,\"name\":\"5qyn6Ziz5aW96L+Q\",\"score\":15},{\"userid\":16,\"name\":\"5a6H5paH56iz6LWi\",\"score\":-5}]}]', 'df6d3bc0-1f1d-11e7-ad1f-f3b245209025', null, '0', 'wx_16', null);
INSERT INTO `t_users` VALUES ('17', 'guest_asdf3', '5qyn6Ziz5aW96L+Q', '0', null, '1', '0', '1000', '19', '865446', '[{\"uuid\":\"1490946333341744320\",\"id\":\"744320\",\"time\":1490946334,\"seats\":[{\"userid\":19,\"name\":\"5Y+46ams5aW96L+Q\",\"score\":0},{\"userid\":18,\"name\":\"54us5a2k6LWM5L6g\",\"score\":0},{\"userid\":17,\"name\":\"5qyn6Ziz5aW96L+Q\",\"score\":0},{\"userid\":16,\"name\":\"5a6H5paH56iz6LWi\",\"score\":0}]},{\"uuid\":\"1491370508415731749\",\"id\":\"731749\",\"time\":1491370509,\"seats\":[{\"userid\":16,\"name\":\"5a6H5paH56iz6LWi\",\"score\":-2},{\"userid\":17,\"name\":\"5qyn6Ziz5aW96L+Q\",\"score\":2},{\"userid\":18,\"name\":\"54us5a2k6LWM5L6g\",\"score\":0},{\"userid\":19,\"name\":\"5Y+46ams5aW96L+Q\",\"score\":0}]},{\"uuid\":\"1491553143886478014\",\"id\":\"478014\",\"time\":1491553144,\"seats\":[{\"userid\":19,\"name\":\"5Y+46ams5aW96L+Q\",\"score\":-2},{\"userid\":18,\"name\":\"54us5a2k6LWM5L6g\",\"score\":6},{\"userid\":17,\"name\":\"5qyn6Ziz5aW96L+Q\",\"score\":-2},{\"userid\":16,\"name\":\"5a6H5paH56iz6LWi\",\"score\":-2}]},{\"uuid\":\"1491553566149120259\",\"id\":\"120259\",\"time\":1491553567,\"seats\":[{\"userid\":19,\"name\":\"5Y+46ams5aW96L+Q\",\"score\":6},{\"userid\":18,\"name\":\"54us5a2k6LWM5L6g\",\"score\":-2},{\"userid\":17,\"name\":\"5qyn6Ziz5aW96L+Q\",\"score\":-2},{\"userid\":16,\"name\":\"5a6H5paH56iz6LWi\",\"score\":-2}]},{\"uuid\":\"1491554002717846542\",\"id\":\"846542\",\"time\":1491554003,\"seats\":[{\"userid\":19,\"name\":\"5Y+46ams5aW96L+Q\",\"score\":3},{\"userid\":18,\"name\":\"54us5a2k6LWM5L6g\",\"score\":-2},{\"userid\":17,\"name\":\"5qyn6Ziz5aW96L+Q\",\"score\":-2},{\"userid\":16,\"name\":\"5a6H5paH56iz6LWi\",\"score\":1}]},{\"uuid\":\"1491554442190814797\",\"id\":\"814797\",\"time\":1491554443,\"seats\":[{\"userid\":16,\"name\":\"5a6H5paH56iz6LWi\",\"score\":-2},{\"userid\":17,\"name\":\"5qyn6Ziz5aW96L+Q\",\"score\":0},{\"userid\":18,\"name\":\"54us5a2k6LWM5L6g\",\"score\":2},{\"userid\":19,\"name\":\"5Y+46ams5aW96L+Q\",\"score\":0}]},{\"uuid\":\"1491558111658192705\",\"id\":\"192705\",\"time\":1491558112,\"seats\":[{\"userid\":19,\"name\":\"5Y+46ams5aW96L+Q\",\"score\":4},{\"userid\":18,\"name\":\"54us5a2k6LWM5L6g\",\"score\":-4},{\"userid\":17,\"name\":\"5qyn6Ziz5aW96L+Q\",\"score\":-4},{\"userid\":16,\"name\":\"5a6H5paH56iz6LWi\",\"score\":4}]},{\"uuid\":\"1491639535578755249\",\"id\":\"755249\",\"time\":1491639536,\"seats\":[{\"userid\":19,\"name\":\"5Y+46ams5aW96L+Q\",\"score\":0},{\"userid\":18,\"name\":\"54us5a2k6LWM5L6g\",\"score\":2},{\"userid\":17,\"name\":\"5qyn6Ziz5aW96L+Q\",\"score\":0},{\"userid\":16,\"name\":\"5a6H5paH56iz6LWi\",\"score\":-2}]},{\"uuid\":\"1491640920874338955\",\"id\":\"338955\",\"time\":1491640921,\"seats\":[{\"userid\":17,\"name\":\"5qyn6Ziz5aW96L+Q\",\"score\":-2},{\"userid\":18,\"name\":\"54us5a2k6LWM5L6g\",\"score\":6},{\"userid\":19,\"name\":\"5Y+46ams5aW96L+Q\",\"score\":-2},{\"userid\":16,\"name\":\"5a6H5paH56iz6LWi\",\"score\":-2}]},{\"uuid\":\"1491641726841925306\",\"id\":\"925306\",\"time\":1491641727,\"seats\":[{\"userid\":19,\"name\":\"5Y+46ams5aW96L+Q\",\"score\":-5},{\"userid\":18,\"name\":\"54us5a2k6LWM5L6g\",\"score\":-5},{\"userid\":17,\"name\":\"5qyn6Ziz5aW96L+Q\",\"score\":15},{\"userid\":16,\"name\":\"5a6H5paH56iz6LWi\",\"score\":-5}]}]', 'c5a9ed50-1f1d-11e7-ad1f-f3b245209025', null, '3', null, null);
INSERT INTO `t_users` VALUES ('18', 'guest_asdf2', '54us5a2k6LWM5L6g', '0', null, '1', '0', '1026', '41', null, '[{\"uuid\":\"1490946333341744320\",\"id\":\"744320\",\"time\":1490946334,\"seats\":[{\"userid\":19,\"name\":\"5Y+46ams5aW96L+Q\",\"score\":0},{\"userid\":18,\"name\":\"54us5a2k6LWM5L6g\",\"score\":0},{\"userid\":17,\"name\":\"5qyn6Ziz5aW96L+Q\",\"score\":0},{\"userid\":16,\"name\":\"5a6H5paH56iz6LWi\",\"score\":0}]},{\"uuid\":\"1491370508415731749\",\"id\":\"731749\",\"time\":1491370509,\"seats\":[{\"userid\":16,\"name\":\"5a6H5paH56iz6LWi\",\"score\":-2},{\"userid\":17,\"name\":\"5qyn6Ziz5aW96L+Q\",\"score\":2},{\"userid\":18,\"name\":\"54us5a2k6LWM5L6g\",\"score\":0},{\"userid\":19,\"name\":\"5Y+46ams5aW96L+Q\",\"score\":0}]},{\"uuid\":\"1491553143886478014\",\"id\":\"478014\",\"time\":1491553144,\"seats\":[{\"userid\":19,\"name\":\"5Y+46ams5aW96L+Q\",\"score\":-2},{\"userid\":18,\"name\":\"54us5a2k6LWM5L6g\",\"score\":6},{\"userid\":17,\"name\":\"5qyn6Ziz5aW96L+Q\",\"score\":-2},{\"userid\":16,\"name\":\"5a6H5paH56iz6LWi\",\"score\":-2}]},{\"uuid\":\"1491553566149120259\",\"id\":\"120259\",\"time\":1491553567,\"seats\":[{\"userid\":19,\"name\":\"5Y+46ams5aW96L+Q\",\"score\":6},{\"userid\":18,\"name\":\"54us5a2k6LWM5L6g\",\"score\":-2},{\"userid\":17,\"name\":\"5qyn6Ziz5aW96L+Q\",\"score\":-2},{\"userid\":16,\"name\":\"5a6H5paH56iz6LWi\",\"score\":-2}]},{\"uuid\":\"1491554002717846542\",\"id\":\"846542\",\"time\":1491554003,\"seats\":[{\"userid\":19,\"name\":\"5Y+46ams5aW96L+Q\",\"score\":3},{\"userid\":18,\"name\":\"54us5a2k6LWM5L6g\",\"score\":-2},{\"userid\":17,\"name\":\"5qyn6Ziz5aW96L+Q\",\"score\":-2},{\"userid\":16,\"name\":\"5a6H5paH56iz6LWi\",\"score\":1}]},{\"uuid\":\"1491554442190814797\",\"id\":\"814797\",\"time\":1491554443,\"seats\":[{\"userid\":16,\"name\":\"5a6H5paH56iz6LWi\",\"score\":-2},{\"userid\":17,\"name\":\"5qyn6Ziz5aW96L+Q\",\"score\":0},{\"userid\":18,\"name\":\"54us5a2k6LWM5L6g\",\"score\":2},{\"userid\":19,\"name\":\"5Y+46ams5aW96L+Q\",\"score\":0}]},{\"uuid\":\"1491558111658192705\",\"id\":\"192705\",\"time\":1491558112,\"seats\":[{\"userid\":19,\"name\":\"5Y+46ams5aW96L+Q\",\"score\":4},{\"userid\":18,\"name\":\"54us5a2k6LWM5L6g\",\"score\":-4},{\"userid\":17,\"name\":\"5qyn6Ziz5aW96L+Q\",\"score\":-4},{\"userid\":16,\"name\":\"5a6H5paH56iz6LWi\",\"score\":4}]},{\"uuid\":\"1491639535578755249\",\"id\":\"755249\",\"time\":1491639536,\"seats\":[{\"userid\":19,\"name\":\"5Y+46ams5aW96L+Q\",\"score\":0},{\"userid\":18,\"name\":\"54us5a2k6LWM5L6g\",\"score\":2},{\"userid\":17,\"name\":\"5qyn6Ziz5aW96L+Q\",\"score\":0},{\"userid\":16,\"name\":\"5a6H5paH56iz6LWi\",\"score\":-2}]},{\"uuid\":\"1491640920874338955\",\"id\":\"338955\",\"time\":1491640921,\"seats\":[{\"userid\":17,\"name\":\"5qyn6Ziz5aW96L+Q\",\"score\":-2},{\"userid\":18,\"name\":\"54us5a2k6LWM5L6g\",\"score\":6},{\"userid\":19,\"name\":\"5Y+46ams5aW96L+Q\",\"score\":-2},{\"userid\":16,\"name\":\"5a6H5paH56iz6LWi\",\"score\":-2}]},{\"uuid\":\"1491641726841925306\",\"id\":\"925306\",\"time\":1491641727,\"seats\":[{\"userid\":19,\"name\":\"5Y+46ams5aW96L+Q\",\"score\":-5},{\"userid\":18,\"name\":\"54us5a2k6LWM5L6g\",\"score\":-5},{\"userid\":17,\"name\":\"5qyn6Ziz5aW96L+Q\",\"score\":15},{\"userid\":16,\"name\":\"5a6H5paH56iz6LWi\",\"score\":-5}]}]', '60fa3a30-2a63-11e7-8144-1735b2b1fc8f', null, '3', null, null);
INSERT INTO `t_users` VALUES ('19', 'guest_asdf1', '5Y+46ams5aW96L+Q', '0', null, '1', '0', '1000', '878', null, '[{\"uuid\":\"1490946333341744320\",\"id\":\"744320\",\"time\":1490946334,\"seats\":[{\"userid\":19,\"name\":\"5Y+46ams5aW96L+Q\",\"score\":0},{\"userid\":18,\"name\":\"54us5a2k6LWM5L6g\",\"score\":0},{\"userid\":17,\"name\":\"5qyn6Ziz5aW96L+Q\",\"score\":0},{\"userid\":16,\"name\":\"5a6H5paH56iz6LWi\",\"score\":0}]},{\"uuid\":\"1491370508415731749\",\"id\":\"731749\",\"time\":1491370509,\"seats\":[{\"userid\":16,\"name\":\"5a6H5paH56iz6LWi\",\"score\":-2},{\"userid\":17,\"name\":\"5qyn6Ziz5aW96L+Q\",\"score\":2},{\"userid\":18,\"name\":\"54us5a2k6LWM5L6g\",\"score\":0},{\"userid\":19,\"name\":\"5Y+46ams5aW96L+Q\",\"score\":0}]},{\"uuid\":\"1491553143886478014\",\"id\":\"478014\",\"time\":1491553144,\"seats\":[{\"userid\":19,\"name\":\"5Y+46ams5aW96L+Q\",\"score\":-2},{\"userid\":18,\"name\":\"54us5a2k6LWM5L6g\",\"score\":6},{\"userid\":17,\"name\":\"5qyn6Ziz5aW96L+Q\",\"score\":-2},{\"userid\":16,\"name\":\"5a6H5paH56iz6LWi\",\"score\":-2}]},{\"uuid\":\"1491553566149120259\",\"id\":\"120259\",\"time\":1491553567,\"seats\":[{\"userid\":19,\"name\":\"5Y+46ams5aW96L+Q\",\"score\":6},{\"userid\":18,\"name\":\"54us5a2k6LWM5L6g\",\"score\":-2},{\"userid\":17,\"name\":\"5qyn6Ziz5aW96L+Q\",\"score\":-2},{\"userid\":16,\"name\":\"5a6H5paH56iz6LWi\",\"score\":-2}]},{\"uuid\":\"1491554002717846542\",\"id\":\"846542\",\"time\":1491554003,\"seats\":[{\"userid\":19,\"name\":\"5Y+46ams5aW96L+Q\",\"score\":3},{\"userid\":18,\"name\":\"54us5a2k6LWM5L6g\",\"score\":-2},{\"userid\":17,\"name\":\"5qyn6Ziz5aW96L+Q\",\"score\":-2},{\"userid\":16,\"name\":\"5a6H5paH56iz6LWi\",\"score\":1}]},{\"uuid\":\"1491554442190814797\",\"id\":\"814797\",\"time\":1491554443,\"seats\":[{\"userid\":16,\"name\":\"5a6H5paH56iz6LWi\",\"score\":-2},{\"userid\":17,\"name\":\"5qyn6Ziz5aW96L+Q\",\"score\":0},{\"userid\":18,\"name\":\"54us5a2k6LWM5L6g\",\"score\":2},{\"userid\":19,\"name\":\"5Y+46ams5aW96L+Q\",\"score\":0}]},{\"uuid\":\"1491558111658192705\",\"id\":\"192705\",\"time\":1491558112,\"seats\":[{\"userid\":19,\"name\":\"5Y+46ams5aW96L+Q\",\"score\":4},{\"userid\":18,\"name\":\"54us5a2k6LWM5L6g\",\"score\":-4},{\"userid\":17,\"name\":\"5qyn6Ziz5aW96L+Q\",\"score\":-4},{\"userid\":16,\"name\":\"5a6H5paH56iz6LWi\",\"score\":4}]},{\"uuid\":\"1491639535578755249\",\"id\":\"755249\",\"time\":1491639536,\"seats\":[{\"userid\":19,\"name\":\"5Y+46ams5aW96L+Q\",\"score\":0},{\"userid\":18,\"name\":\"54us5a2k6LWM5L6g\",\"score\":2},{\"userid\":17,\"name\":\"5qyn6Ziz5aW96L+Q\",\"score\":0},{\"userid\":16,\"name\":\"5a6H5paH56iz6LWi\",\"score\":-2}]},{\"uuid\":\"1491640920874338955\",\"id\":\"338955\",\"time\":1491640921,\"seats\":[{\"userid\":17,\"name\":\"5qyn6Ziz5aW96L+Q\",\"score\":-2},{\"userid\":18,\"name\":\"54us5a2k6LWM5L6g\",\"score\":6},{\"userid\":19,\"name\":\"5Y+46ams5aW96L+Q\",\"score\":-2},{\"userid\":16,\"name\":\"5a6H5paH56iz6LWi\",\"score\":-2}]},{\"uuid\":\"1491641726841925306\",\"id\":\"925306\",\"time\":1491641727,\"seats\":[{\"userid\":19,\"name\":\"5Y+46ams5aW96L+Q\",\"score\":-5},{\"userid\":18,\"name\":\"54us5a2k6LWM5L6g\",\"score\":-5},{\"userid\":17,\"name\":\"5qyn6Ziz5aW96L+Q\",\"score\":15},{\"userid\":16,\"name\":\"5a6H5paH56iz6LWi\",\"score\":-5}]}]', '5c464f10-2a63-11e7-8144-1735b2b1fc8f', null, '3', 'wx_19', null);
INSERT INTO `t_users` VALUES ('30', 'guest_1488870521738', '54us5a2k6ZuA5Zyj', '0', null, '1', '0', '1000', '21', null, null, 'bcbd6190-1f1d-11e7-ad1f-f3b245209025', null, '0', null, null);
INSERT INTO `t_users` VALUES ('31', 'guest_1488267300790', '5Y+46ams6LWM5L6g', '0', null, '1', '0', '1000', '21', null, null, 'fa6cb750-1ea7-11e7-a435-7b00ed904637', null, '0', null, null);
INSERT INTO `t_users` VALUES ('32', 'guest_1491037736675', '5a2Q6L2m6LWM5Zyj', '0', null, '1', '0', '-2674', '120', null, null, '506f9940-2af3-11e7-a308-5937123adffa', null, '0', null, null);

-- ----------------------------
-- Table structure for t_user_do_task
-- ----------------------------
DROP TABLE IF EXISTS `t_user_do_task`;
CREATE TABLE `t_user_do_task` (
  `uid` int(11) NOT NULL COMMENT '用户id',
  `task_id` int(11) DEFAULT NULL COMMENT '任务id',
  `operator_time` int(11) DEFAULT NULL COMMENT '时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of t_user_do_task
-- ----------------------------

-- ----------------------------
-- Table structure for t_user_info_perday
-- ----------------------------
DROP TABLE IF EXISTS `t_user_info_perday`;
CREATE TABLE `t_user_info_perday` (
  `uid` int(11) NOT NULL COMMENT '用户ID',
  `slyder_number` int(11) DEFAULT '0' COMMENT '当前可用转盘数量',
  `slyder_total_number` int(11) DEFAULT '0' COMMENT '天获取的转盘总数',
  `slyder_used_number` int(11) DEFAULT '0' COMMENT '今天使用的转盘数量',
  `date` date DEFAULT '2015-01-01' COMMENT '有效时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of t_user_info_perday
-- ----------------------------
INSERT INTO `t_user_info_perday` VALUES ('32', '0', '1', '1', '2017-04-25');
INSERT INTO `t_user_info_perday` VALUES ('19', '0', '1', '1', '2017-04-26');
INSERT INTO `t_user_info_perday` VALUES ('18', '-1', '1', '2', '2017-04-25');
INSERT INTO `t_user_info_perday` VALUES ('18', '0', '1', '1', '2017-04-26');
INSERT INTO `t_user_info_perday` VALUES ('32', '0', '1', '1', '2017-04-24');
INSERT INTO `t_user_info_perday` VALUES ('32', '0', '1', '1', '2017-04-26');
