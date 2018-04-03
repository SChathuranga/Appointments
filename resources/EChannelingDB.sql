create database echannelingDB;
use echannelingDB;

CREATE TABLE `echannelingdb`.`users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `first_name` VARCHAR(45) NULL,
  `last_name` VARCHAR(45) NULL,
  `mob_no` INT NULL,
  `user_name` VARCHAR(45) NOT NULL,
  `password` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`));

CREATE TABLE `echannelingdb`.`adminusers` (
  `adminid` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(45) NOT NULL,
  `password` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`adminid`),
  UNIQUE INDEX `username_UNIQUE` (`username` ASC));

CREATE TABLE `echannelingdb`.`institutes` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `institutename` VARCHAR(45) NULL,
  `address` VARCHAR(45) NULL,
  PRIMARY KEY (`id`));

CREATE TABLE `echannelingdb`.`doctors` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `doctorname` VARCHAR(45) NULL,
  `address` VARCHAR(45) NULL,
  `contact` INT NULL,
  `email` VARCHAR(45) NULL,
  `speciality` VARCHAR(45) NULL,
  `docregid` VARCHAR(45) NULL,
  `instituteid` INT NULL,
  PRIMARY KEY (`id`),
  INDEX `InsKey_idx` (`instituteid` ASC),
  CONSTRAINT `InsKey`
    FOREIGN KEY (`instituteid`)
    REFERENCES `echannelingdb`.`institutes` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

CREATE TABLE `echannelingdb`.`myappointments` (
  `appid` INT NOT NULL AUTO_INCREMENT,
  `userid` INT NULL,
  `doctorname` VARCHAR(45) NULL,
  `institutename` VARCHAR(45) NULL,
  `speciality` VARCHAR(45) NULL,
  `date` VARCHAR(45) NULL,
  PRIMARY KEY (`appid`),
  INDEX `userkey_idx` (`userid` ASC),
  CONSTRAINT `userkey`
    FOREIGN KEY (`userid`)
    REFERENCES `echannelingdb`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);
