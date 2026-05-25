-- MySQL Script for BookStore Database
-- Version: 1.0
-- Date: April 26, 2026
-- This script creates all tables according to JPA entity definitions

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';
SET NAMES utf8mb4 COLLATE utf8mb4_0900_ai_ci;
SET character_set_client = utf8mb4;
SET character_set_connection = utf8mb4;
SET character_set_results = utf8mb4;

-- Drop old schema if exists
DROP SCHEMA IF EXISTS `db_bookstore`;

-- Create new schema
CREATE SCHEMA IF NOT EXISTS `db_bookstore` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE `db_bookstore`;

-- =====================================================
-- Table: roles
-- =====================================================
CREATE TABLE `roles` (
  `role_id` INT NOT NULL AUTO_INCREMENT,
  `role_name` VARCHAR(255) NULL,
  `created_at` DATETIME(6) NULL,
  `updated_at` DATETIME(6) NULL,
  `deleted_at` DATETIME(6) NULL,
  PRIMARY KEY (`role_id`),
  UNIQUE KEY `UK_role_name` (`role_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =====================================================
-- Table: permissions
-- =====================================================
CREATE TABLE `permissions` (
  `permission_id` BIGINT NOT NULL AUTO_INCREMENT,
  `permission_name` VARCHAR(255) NULL,
  `description` VARCHAR(255) NULL,
  PRIMARY KEY (`permission_id`),
  UNIQUE KEY `UK_permission_name` (`permission_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =====================================================
-- Table: role_permission
-- =====================================================
CREATE TABLE `role_permission` (
  `role_id` INT NOT NULL,
  `permission_id` BIGINT NOT NULL,
  PRIMARY KEY (`role_id`, `permission_id`),
  KEY `FK_permission_id` (`permission_id`),
  CONSTRAINT `FK_role_permission_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`),
  CONSTRAINT `FK_role_permission_permission` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`permission_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =====================================================
-- Table: users
-- =====================================================
CREATE TABLE `users` (
  `user_id` BIGINT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(255) NULL,
  `password` VARCHAR(255) NULL,
  `name` VARCHAR(255) NULL,
  `email` VARCHAR(255) NULL,
  `phone` VARCHAR(255) NULL,
  `status` BIT(1) NULL DEFAULT 1,
  `gender` VARCHAR(255) NULL,
  `is_change_account` BIT(1) NULL DEFAULT 0,
  `tier` VARCHAR(255) NULL DEFAULT 'BRONZE',
  `point` BIGINT NULL DEFAULT 0,
  `dob` DATETIME(6) NULL,
  `avatar_url` VARCHAR(255) NULL,
  `auth_provider` VARCHAR(255) NULL,
  `provider_id` VARCHAR(255) NULL,
  `email_verified` BIT(1) NULL DEFAULT 0,
  `public_id_avatar` VARCHAR(255) NULL,
  `role_id` INT NULL,
  `created_at` DATETIME(6) NULL,
  `updated_at` DATETIME(6) NULL,
  `deleted_at` DATETIME(6) NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `UK_username` (`username`),
  UNIQUE KEY `UK_email` (`email`),
  UNIQUE KEY `UK_phone` (`phone`),
  KEY `FK_user_role` (`role_id`),
  CONSTRAINT `FK_user_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =====================================================
-- Table: addresses
-- =====================================================
CREATE TABLE `addresses` (
  `address_id` BIGINT NOT NULL AUTO_INCREMENT,
  `customer_name` VARCHAR(255) NULL,
  `customer_phone` VARCHAR(255) NULL,
  `detail_address` VARCHAR(255) NULL,
  `ward` VARCHAR(255) NULL,
  `district` VARCHAR(255) NULL,
  `province` VARCHAR(255) NULL,
  `is_default` BIT(1) NULL DEFAULT 0,
  `user_id` BIGINT NULL,
  `created_at` DATETIME(6) NULL,
  `updated_at` DATETIME(6) NULL,
  `deleted_at` DATETIME(6) NULL,
  PRIMARY KEY (`address_id`),
  KEY `FK_address_user` (`user_id`),
  CONSTRAINT `FK_address_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =====================================================
-- Table: authors
-- =====================================================
CREATE TABLE `authors` (
  `author_id` INT NOT NULL AUTO_INCREMENT,
  `alias` VARCHAR(255) NOT NULL,
  `author_name` VARCHAR(200) NOT NULL,
  `created_at` DATETIME(6) NULL,
  `updated_at` DATETIME(6) NULL,
  `deleted_at` DATETIME(6) NULL,
  PRIMARY KEY (`author_id`),
  UNIQUE KEY `UK_alias` (`alias`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =====================================================
-- Table: publishers
-- =====================================================
CREATE TABLE `publishers` (
  `publisher_id` INT NOT NULL AUTO_INCREMENT,
  `publisher_name` VARCHAR(255) NULL,
  `created_at` DATETIME(6) NULL,
  `updated_at` DATETIME(6) NULL,
  `deleted_at` DATETIME(6) NULL,
  PRIMARY KEY (`publisher_id`),
  UNIQUE KEY `UK_publisher_name` (`publisher_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =====================================================
-- Table: categories
-- =====================================================
CREATE TABLE `categories` (
  `category_id` BIGINT NOT NULL AUTO_INCREMENT,
  `category_name` VARCHAR(255) NULL,
  `parent_id` BIGINT NULL,
  `created_at` DATETIME(6) NULL,
  `updated_at` DATETIME(6) NULL,
  `deleted_at` DATETIME(6) NULL,
  PRIMARY KEY (`category_id`),
  KEY `FK_category_parent` (`parent_id`),
  CONSTRAINT `FK_category_parent` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =====================================================
-- Table: books
-- =====================================================
CREATE TABLE `books` (
  `book_id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `isbn` VARCHAR(255) NULL,
  `language` VARCHAR(255) NULL,
  `description` TEXT NULL,
  `page_count` INT NULL DEFAULT 0,
  `cover_type` VARCHAR(255) NULL,
  `cover_image_url` VARCHAR(255) NULL,
  `stock_quantity` INT NULL DEFAULT 0,
  `price` DECIMAL(38,2) NULL,
  `avg_rating` FLOAT NULL DEFAULT 0,
  `sale_percent` INT NULL DEFAULT 0,
  `is_active` BIT(1) NULL DEFAULT 1,
  `width` INT NULL,
  `length` INT NULL,
  `height` INT NULL,
  `weight` DOUBLE NULL,
  `public_id_cover_image` VARCHAR(255) NULL,
  `publisher_id` INT NULL,
  `created_at` DATETIME(6) NULL,
  `updated_at` DATETIME(6) NULL,
  `deleted_at` DATETIME(6) NULL,
  PRIMARY KEY (`book_id`),
  UNIQUE KEY `UK_isbn` (`isbn`),
  KEY `FK_book_publisher` (`publisher_id`),
  CONSTRAINT `FK_book_publisher` FOREIGN KEY (`publisher_id`) REFERENCES `publishers` (`publisher_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =====================================================
-- Table: book_author
-- =====================================================
CREATE TABLE `book_author` (
  `book_id` INT NOT NULL,
  `author_id` INT NOT NULL,
  PRIMARY KEY (`book_id`, `author_id`),
  KEY `FK_author_id` (`author_id`),
  CONSTRAINT `FK_book_author_book` FOREIGN KEY (`book_id`) REFERENCES `books` (`book_id`),
  CONSTRAINT `FK_book_author_author` FOREIGN KEY (`author_id`) REFERENCES `authors` (`author_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =====================================================
-- Table: book_category
-- =====================================================
CREATE TABLE `book_category` (
  `book_id` INT NOT NULL,
  `category_id` BIGINT NOT NULL,
  PRIMARY KEY (`book_id`, `category_id`),
  KEY `FK_category_id` (`category_id`),
  CONSTRAINT `FK_book_category_book` FOREIGN KEY (`book_id`) REFERENCES `books` (`book_id`),
  CONSTRAINT `FK_book_category_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =====================================================
-- Table: book_imgs
-- =====================================================
CREATE TABLE `book_imgs` (
  `book_img_id` INT NOT NULL AUTO_INCREMENT,
  `img_url` VARCHAR(255) NULL,
  `public_id` VARCHAR(255) NULL,
  `book_id` INT NULL,
  `created_at` DATETIME(6) NULL,
  `updated_at` DATETIME(6) NULL,
  `deleted_at` DATETIME(6) NULL,
  PRIMARY KEY (`book_img_id`),
  KEY `FK_book_img_book` (`book_id`),
  CONSTRAINT `FK_book_img_book` FOREIGN KEY (`book_id`) REFERENCES `books` (`book_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =====================================================
-- Table: carts
-- =====================================================
CREATE TABLE `carts` (
  `cart_id` BIGINT NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT NULL,
  `created_at` DATETIME(6) NULL,
  `updated_at` DATETIME(6) NULL,
  `deleted_at` DATETIME(6) NULL,
  PRIMARY KEY (`cart_id`),
  UNIQUE KEY `UK_cart_user` (`user_id`),
  CONSTRAINT `FK_cart_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =====================================================
-- Table: book_cart
-- =====================================================
CREATE TABLE `book_cart` (
  `book_cart_id` BIGINT NOT NULL AUTO_INCREMENT,
  `quantity` INT NOT NULL DEFAULT 1,
  `book_id` INT NULL,
  `cart_id` BIGINT NULL,
  `created_at` DATETIME(6) NULL,
  `updated_at` DATETIME(6) NULL,
  `deleted_at` DATETIME(6) NULL,
  PRIMARY KEY (`book_cart_id`),
  KEY `FK_book_cart_book` (`book_id`),
  KEY `FK_book_cart_cart` (`cart_id`),
  CONSTRAINT `FK_book_cart_book` FOREIGN KEY (`book_id`) REFERENCES `books` (`book_id`),
  CONSTRAINT `FK_book_cart_cart` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`cart_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =====================================================
-- Table: vouchers
-- =====================================================
CREATE TABLE `vouchers` (
  `voucher_id` BIGINT NOT NULL AUTO_INCREMENT,
  `voucher_code` VARCHAR(255) NOT NULL,
  `title` VARCHAR(255) NULL,
  `description` TEXT NULL,
  `type` ENUM('FIXED', 'PERCENTAGE') NULL,
  `discount_value` DECIMAL(19,2) NULL,
  `max_discount_amount` DECIMAL(19,2) NULL,
  `min_order_value` DECIMAL(19,2) NULL,
  `min_point` BIGINT NULL,
  `start_date` DATETIME(6) NULL,
  `end_date` DATETIME(6) NULL,
  `total_limit` INT NULL,
  `limit_per_user` INT NULL,
  `used_count` INT NULL DEFAULT 0,
  `is_active` BIT(1) NULL DEFAULT 1,
  `created_at` DATETIME(6) NULL,
  `updated_at` DATETIME(6) NULL,
  `deleted_at` DATETIME(6) NULL,
  PRIMARY KEY (`voucher_id`),
  UNIQUE KEY `UK_voucher_code` (`voucher_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =====================================================
-- Table: user_voucher
-- =====================================================
CREATE TABLE `user_voucher` (
  `user_id` BIGINT NOT NULL,
  `voucher_id` BIGINT NOT NULL,
  PRIMARY KEY (`user_id`, `voucher_id`),
  KEY `FK_voucher_id` (`voucher_id`),
  CONSTRAINT `FK_user_voucher_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `FK_user_voucher_voucher` FOREIGN KEY (`voucher_id`) REFERENCES `vouchers` (`voucher_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =====================================================
-- Table: orders
-- =====================================================
CREATE TABLE `orders` (
  `order_id` BIGINT NOT NULL AUTO_INCREMENT,
  `status` VARCHAR(255) NULL DEFAULT 'PENDING',
  `vat_rate` DECIMAL(5,2) NOT NULL DEFAULT 0.05,
  `vat_amount` DECIMAL(12,2) NULL,
  `reward_point_applied` BIT(1) NULL DEFAULT 0,
  `delivered_at` DATETIME(6) NULL,
  `reward_eligible_at` DATETIME(6) NULL,
  `tier_rate` DECIMAL(38,2) NULL,
  `customer_id` BIGINT NULL,
  `staff_id` BIGINT NULL,
  `voucher_id` BIGINT NULL,
  `created_at` DATETIME(6) NULL,
  `updated_at` DATETIME(6) NULL,
  `deleted_at` DATETIME(6) NULL,
  PRIMARY KEY (`order_id`),
  KEY `FK_order_customer` (`customer_id`),
  KEY `FK_order_staff` (`staff_id`),
  KEY `FK_order_voucher` (`voucher_id`),
  CONSTRAINT `FK_order_customer` FOREIGN KEY (`customer_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `FK_order_staff` FOREIGN KEY (`staff_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `FK_order_voucher` FOREIGN KEY (`voucher_id`) REFERENCES `vouchers` (`voucher_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =====================================================
-- Table: book_order
-- =====================================================
CREATE TABLE `book_order` (
  `book_order_id` BIGINT NOT NULL AUTO_INCREMENT,
  `quantity` INT NOT NULL DEFAULT 1,
  `unit` VARCHAR(255) NULL,
  `rate` INT NULL,
  `content` TEXT NULL,
  `book_id` INT NULL,
  `order_id` BIGINT NULL,
  `created_at` DATETIME(6) NULL,
  `updated_at` DATETIME(6) NULL,
  `deleted_at` DATETIME(6) NULL,
  PRIMARY KEY (`book_order_id`),
  KEY `FK_book_order_book` (`book_id`),
  KEY `FK_book_order_order` (`order_id`),
  CONSTRAINT `FK_book_order_book` FOREIGN KEY (`book_id`) REFERENCES `books` (`book_id`),
  CONSTRAINT `FK_book_order_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =====================================================
-- Table: shipments
-- =====================================================
CREATE TABLE `shipments` (
  `shipment_id` BIGINT NOT NULL AUTO_INCREMENT,
  `tracking_number` VARCHAR(255) NULL,
  `carrier_name` VARCHAR(255) NULL,
  `status` VARCHAR(255) NULL DEFAULT 'PENDING',
  `weight` INT NULL,
  `length` INT NULL,
  `width` INT NULL,
  `height` INT NULL,
  `estimated_delivery_date` DATETIME(6) NULL,
  `actual_delivery_date` DATETIME(6) NULL,
  `order_id` BIGINT NULL,
  `address_id` BIGINT NULL,
  `created_at` DATETIME(6) NULL,
  `updated_at` DATETIME(6) NULL,
  `deleted_at` DATETIME(6) NULL,
  PRIMARY KEY (`shipment_id`),
  UNIQUE KEY `UK_shipment_order` (`order_id`),
  KEY `FK_shipment_address` (`address_id`),
  CONSTRAINT `FK_shipment_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`),
  CONSTRAINT `FK_shipment_address` FOREIGN KEY (`address_id`) REFERENCES `addresses` (`address_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =====================================================
-- Table: payments
-- =====================================================
CREATE TABLE `payments` (
  `payment_id` BIGINT NOT NULL AUTO_INCREMENT,
  `amount` DECIMAL(38,2) NULL,
  `method` ENUM('COD', 'VNPAY') NULL COMMENT 'Phương thức thanh toán: COD (Tiền mặt khi nhận), VNPAY (VNPay)',
  `status` ENUM('PENDING', 'SUCCESS', 'FAILED', 'CANCELLED') NULL DEFAULT 'PENDING',
  `transaction_id` VARCHAR(255) NULL,
  `paid_at` DATETIME(6) NULL,
  `order_id` BIGINT NULL,
  `created_at` DATETIME(6) NULL,
  `updated_at` DATETIME(6) NULL,
  PRIMARY KEY (`payment_id`),
  UNIQUE KEY `UK_payment_order` (`order_id`),
  CONSTRAINT `FK_payment_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =====================================================
-- Table: interact_events
-- =====================================================
CREATE TABLE `interact_events` (
  `interact_event_id` BIGINT NOT NULL AUTO_INCREMENT,
  `event_type` VARCHAR(255) NULL,
  `value` INT NOT NULL DEFAULT 0,
  `event_time` DATETIME(6) NULL,
  `book_id` INT NULL,
  `user_id` BIGINT NULL,
  `created_at` DATETIME(6) NULL,
  `updated_at` DATETIME(6) NULL,
  `deleted_at` DATETIME(6) NULL,
  PRIMARY KEY (`interact_event_id`),
  KEY `FK_interact_event_book` (`book_id`),
  KEY `FK_interact_event_user` (`user_id`),
  CONSTRAINT `FK_interact_event_book` FOREIGN KEY (`book_id`) REFERENCES `books` (`book_id`),
  CONSTRAINT `FK_interact_event_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =====================================================
-- Table: invalidated_token
-- =====================================================
CREATE TABLE `invalidated_token` (
  `id` VARCHAR(255) NOT NULL,
  `expiry_time` DATETIME(6) NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

-- =====================================================
-- NOTE: Trigger check_order_not_empty bị remove vì Spring init scripts
-- không hỗ trợ DELIMITER statement.
-- Để sử dụng trigger, chạy file trigger riêng hoặc dùng MySQL client.
-- =====================================================


