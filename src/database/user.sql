CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL COMMENT '用户名',
  `sex` int(11) NOT NULL DEFAULT '-1' COMMENT '性别 0: 男, 1: 女, -1: 未知',
  `role` int(11) NOT NULL COMMENT '用户角色',
  `status` int(11) NOT NULL DEFAULT '0' COMMENT '用户状态 -1: 删除, 0: 锁定, 1: 正常',
  `email` varchar(32) NOT NULL,
  `createAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updateAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `password` varchar(32) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户表';
