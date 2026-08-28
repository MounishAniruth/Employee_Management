-- MySQL dump 10.13  Distrib 9.3.0, for macos15.2 (arm64)
--
-- Host: localhost    Database: transport_db
-- ------------------------------------------------------
-- Server version	9.3.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `point_details`
--

DROP TABLE IF EXISTS `point_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `point_details` (
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
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `point_details`
--

LOCK TABLES `point_details` WRITE;
/*!40000 ALTER TABLE `point_details` DISABLE KEYS */;
INSERT INTO `point_details` (`id`, `lorry_id`, `point_date`, `broker_name`, `broker_location`, `broker_phone`, `party_name`, `party_location`, `party_mobile`, `total_depth`, `starting_rpm`, `closing_rpm`, `drilling_amount`, `casing_amount`, `given_amount`, `created_at`, `updated_at`) VALUES (3,44,'2026-08-21','Nagesh','Barshi','9876543212','Raja','Town Barshi','987593021',650.00,1320.00,1328.00,69000.00,13000.00,10000.00,'2026-08-21 05:46:56','2026-08-21 05:46:56'),(4,44,'2026-08-20','Nagesh','Barshi','9876543212','Rama','Town Barshi','987593023',230.00,200.00,203.00,18550.00,12800.00,5000.00,'2026-08-21 07:27:36','2026-08-21 07:28:51'),(5,44,'2026-08-23','Nagesh','Barshi','9876543212','Ramaa','Town Barshi','987593023',700.00,130.00,136.00,78000.00,8700.00,10000.00,'2026-08-23 14:10:45','2026-08-23 14:10:45');
/*!40000 ALTER TABLE `point_details` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-08-28 11:59:55
