-- ====================================================================
-- SRI MURUGAN RIG OPERATIONS - COMPLETE DATABASE SCHEMA FOR TiDB / MySQL
-- ====================================================================

CREATE DATABASE IF NOT EXISTS `transport_db`;
USE `transport_db`;

-- --------------------------------------------------------------------
-- 1. USERS TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `user_type` enum('owner','manager','lorry_manager') NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `phone` (`phone`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------------------
-- 2. LORRIES TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `lorries` (
  `id` int NOT NULL AUTO_INCREMENT,
  `owner_id` int NOT NULL,
  `lorry_manager_id` int DEFAULT NULL,
  `registration_number` varchar(20) NOT NULL,
  `model` varchar(100) NOT NULL,
  `year_built` int NOT NULL,
  `owner_name` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `status` enum('active','maintenance','inactive') DEFAULT 'active',
  `insurance_expiry` date DEFAULT NULL,
  `fc_expiry` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `registration_number` (`registration_number`),
  KEY `fk_owner_id` (`owner_id`),
  KEY `fk_lorry_manager_id` (`lorry_manager_id`),
  CONSTRAINT `fk_owner_id` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_lorry_manager_id` FOREIGN KEY (`lorry_manager_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------------------
-- 3. EMPLOYEES TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `employees` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `lorry_id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `phone` varchar(30) NOT NULL,
  `role` enum('driver','driller','manager','worker') NOT NULL,
  `fixed_salary` decimal(10,2) DEFAULT NULL,
  `id_proof_urls` JSON DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `phone` (`phone`),
  KEY `fk_employees_lorry` (`lorry_id`),
  KEY `fk_employees_user` (`user_id`),
  CONSTRAINT `fk_employees_lorry` FOREIGN KEY (`lorry_id`) REFERENCES `lorries` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_employees_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------------------
-- 4. EMPLOYEE SALARIES TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `employee_salaries` (
  `id` int NOT NULL AUTO_INCREMENT,
  `employee_id` int NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `days_worked` int GENERATED ALWAYS AS (((to_days(`end_date`) - to_days(`start_date`)) + 1)) STORED,
  `expense_paid` decimal(10,2) DEFAULT '0.00',
  `expense_payment_method` enum('Phone Pay','Google Pay','Cash','Bank','Office Cash','Site Cash') NOT NULL,
  PRIMARY KEY (`id`),
  KEY `employee_id` (`employee_id`),
  CONSTRAINT `employee_salaries_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------------------
-- 5. EMPLOYEE SALARY HISTORY TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `employee_salary_history` (
  `id` int NOT NULL AUTO_INCREMENT,
  `employee_id` int NOT NULL,
  `fixed_salary` decimal(10,2) NOT NULL,
  `effective_from` date NOT NULL,
  `effective_to` date DEFAULT NULL,
  `created_by` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_salary_history_employee` (`employee_id`),
  KEY `fk_salary_history_created_by` (`created_by`),
  CONSTRAINT `fk_salary_history_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_salary_history_employee` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------------------
-- 6. FUEL TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `fuel` (
  `id` int NOT NULL AUTO_INCREMENT,
  `lorry_id` int NOT NULL,
  `date_filled` date NOT NULL,
  `bunk_name` varchar(255) NOT NULL,
  `litres_filled` decimal(10,2) NOT NULL,
  `price_per_litre` decimal(10,2) NOT NULL,
  `total_amount` decimal(10,2) GENERATED ALWAYS AS ((`litres_filled` * `price_per_litre`)) STORED,
  `amount_paid` decimal(10,2) NOT NULL,
  `remaining_amount` decimal(10,2) GENERATED ALWAYS AS ((`total_amount` - `amount_paid`)) STORED,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `km_reading_before` int DEFAULT NULL,
  `km_reading_after` int DEFAULT NULL,
  `status` enum('pending','cleared') NOT NULL DEFAULT 'pending',
  `bill_image_url` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_fuel_lorry` (`lorry_id`),
  CONSTRAINT `fk_fuel_lorry` FOREIGN KEY (`lorry_id`) REFERENCES `lorries` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------------------
-- 7. POINT DETAILS (BOREWELL OPERATIONS) TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `point_details` (
  `id` int NOT NULL AUTO_INCREMENT,
  `lorry_id` int NOT NULL,
  `point_date` date NOT NULL,
  `broker_name` varchar(255) NOT NULL,
  `broker_location` varchar(255) NOT NULL,
  `broker_phone` varchar(30) NOT NULL,
  `party_name` varchar(255) NOT NULL,
  `party_location` varchar(255) NOT NULL,
  `party_mobile` varchar(30) NOT NULL,
  `total_depth` decimal(10,2) NOT NULL,
  `starting_rpm` decimal(10,2) NOT NULL,
  `closing_rpm` decimal(10,2) NOT NULL,
  `running_rpm` decimal(10,2) GENERATED ALWAYS AS ((`closing_rpm` - `starting_rpm`)) STORED,
  `avg_depth_per_rpm` decimal(10,4) GENERATED ALWAYS AS ((case when ((`closing_rpm` - `starting_rpm`) = 0) then NULL else (`total_depth` / (`closing_rpm` - `starting_rpm`)) end)) STORED,
  `drilling_amount` decimal(12,2) NOT NULL DEFAULT '0.00',
  `casing_amount` decimal(12,2) NOT NULL DEFAULT '0.00',
  `total_amount` decimal(12,2) GENERATED ALWAYS AS ((`drilling_amount` + `casing_amount`)) STORED,
  `given_amount` decimal(12,2) NOT NULL DEFAULT '0.00',
  `balance` decimal(12,2) GENERATED ALWAYS AS ((`total_amount` - `given_amount`)) STORED,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_point_details_lorry` (`lorry_id`),
  CONSTRAINT `fk_point_details_lorry` FOREIGN KEY (`lorry_id`) REFERENCES `lorries` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------------------
-- 8. POINT DEPTH RATES TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `point_depth_rates` (
  `id` int NOT NULL AUTO_INCREMENT,
  `point_id` int NOT NULL,
  `from_depth` decimal(10,2) NOT NULL,
  `to_depth` decimal(10,2) NOT NULL,
  `rate_per_ft` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_point_depth_rates_point` (`point_id`),
  CONSTRAINT `fk_point_depth_rates_point` FOREIGN KEY (`point_id`) REFERENCES `point_details` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------------------
-- 9. POINT CASING DETAILS TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `point_casing_details` (
  `id` int NOT NULL AUTO_INCREMENT,
  `point_id` int NOT NULL,
  `pipe_size` enum('5 inch','7 inch','8 inch','10 inch') NOT NULL,
  `casing_depth` decimal(10,2) NOT NULL,
  `rate_per_ft` decimal(10,2) NOT NULL,
  `amount` decimal(12,2) GENERATED ALWAYS AS ((`casing_depth` * `rate_per_ft`)) STORED,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_point_casing_details_point` (`point_id`),
  CONSTRAINT `fk_point_casing_details_point` FOREIGN KEY (`point_id`) REFERENCES `point_details` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
