CREATE DATABASE test;

USE test;

DROP TABLE IF EXISTS `doctors`;
CREATE TABLE `doctors` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `doctorname` varchar(45) DEFAULT NULL,
  `address` varchar(45) DEFAULT NULL,
  `contact` int(11) DEFAULT NULL,
  `email` varchar(45) DEFAULT NULL,
  `speciality` varchar(45) DEFAULT NULL,
  `docregid` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `institutes`;
CREATE TABLE `institutes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `institutename` varchar(45) DEFAULT NULL,
  `address` varchar(45) DEFAULT NULL,
  `contact` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(5) NOT NULL AUTO_INCREMENT,
  `first_name` text NOT NULL,
  `last_name` text NOT NULL,
  `mob_no` int(11) NOT NULL,
  `user_name` varchar(20) NOT NULL,
  `password` varchar(15) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;