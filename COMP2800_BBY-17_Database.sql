CREATE DATABASE IF NOT EXISTS `COMP2800`;

use COMP2800;
show tables;

CREATE TABLE IF NOT EXISTS `BBY_17_accounts` (
    `id` INT Primary Key AUTO_INCREMENT,
    `email` VARCHAR(50) UNIQUE NOT NULL,
    `first_name` VARCHAR(30) NOT NULL,
    `last_name` VARCHAR(30) NOT NULL, 
    `password` VARCHAR(30) NOT NULL,
    `is_admin` BOOL NULL, 
    `dob` DATE NOT NULL);
    
INSERT into `BBY_17_accounts` (`email`, `first_name`, `last_name`, `password`, `is_admin`, `dob`) 
	VALUES ("admin@test.ca", "Ramil", "Garipov", "123456",  TRUE, 19930401);
INSERT into `BBY_17_accounts` (`email`, `first_name`, `last_name`, `password`, `is_admin`, `dob`) 
	VALUES ("royxavier@yahoo.com", "Roy Xavier", "Pimentel", "123456", TRUE, 19880330);
INSERT into `BBY_17_accounts` (`email`, `first_name`, `last_name`, `password`, `is_admin`, `dob`) 
	VALUES ("joshuachenyyc@gmail.com", "Joshua", "Chen", "123456", TRUE, 20030101);
INSERT into `BBY_17_accounts` (`email`, `first_name`, `last_name`, `password`, `is_admin`, `dob`) 
	VALUES ("rkong360@hotmail.com", "Randall", "Kong", "123456",  TRUE, 20030423);
INSERT into `BBY_17_accounts` (`email`, `first_name`, `last_name`, `password`, `is_admin`, `dob`) 
	VALUES ("user@test.com", "Tobey", "Maguire", "123456", FALSE, 19750627);
INSERT into `BBY_17_accounts` (`email`, `first_name`, `last_name`, `password`, `is_admin`, `dob`) 
	VALUES ("aunt@may.com", "May", "Parker-Jameson", "123456", FALSE, 19641204);

SELECT * 
FROM BBY_17_accounts;
    
    