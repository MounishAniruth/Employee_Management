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
-- Table structure for table `point_casing_details`
--

DROP TABLE IF EXISTS `point_casing_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `point_casing_details` (
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
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `point_casing_details`
--

LOCK TABLES `point_casing_details` WRITE;
/*!40000 ALTER TABLE `point_casing_details` DISABLE KEYS */;
INSERT INTO `point_casing_details` (`id`, `point_id`, `pipe_size`, `casing_depth`, `rate_per_ft`, `created_at`) VALUES (6,3,'5 inch',20.00,350.00,'2026-08-21 05:46:56'),(7,3,'5 inch',15.00,400.00,'2026-08-21 05:46:56'),(10,4,'5 inch',20.00,300.00,'2026-08-21 07:28:51'),(11,4,'7 inch',17.00,400.00,'2026-08-21 07:28:51'),(12,5,'5 inch',12.00,350.00,'2026-08-23 14:10:45'),(13,5,'7 inch',10.00,450.00,'2026-08-23 14:10:45');
/*!40000 ALTER TABLE `point_casing_details` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-08-28 11:59:40
