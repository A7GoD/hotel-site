drop database hotel;
create database hotel;
use hotel;

CREATE TABLE `users`(
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) PRIMARY KEY ,
    `password` VARCHAR(255) NOT NULL
);
CREATE TABLE `rooms`(
    `id` INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    `beds` INT NOT NULL,
    `price` INT NOT NULL
);
CREATE TABLE `booked_rooms`(
    `id` INT UNSIGNED,
    `booked_by` VARCHAR(255) NOT NULL,
    `booked_for` DATE NOT NULL,
    `booked_on` DATE NOT NULL,
    `booking_id` VARCHAR(255) NOT NULL
);
CREATE TABLE `transactions` (
  `sno` int NOT NULL AUTO_INCREMENT,
  `booking_id` varchar(255) NOT NULL,
  `trans_date` date NOT NULL,
  `trans_type` varchar(255) NOT NULL,
  `price` int NOT NULL,
  `email` varchar(255) NOT NULL,
  PRIMARY KEY (`sno`)
)

ALTER TABLE
    `booked_rooms` ADD CONSTRAINT `booked_rooms_booked_by_foreign` FOREIGN KEY(`booked_by`) REFERENCES `users`(`email`);