-- MySQL dump 10.13  Distrib 8.0.43, for macos15 (x86_64)
--
-- Host: 127.0.0.1    Database: transport_db
-- ------------------------------------------------------
-- Server version	9.3.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `fuel`
--

DROP TABLE IF EXISTS `fuel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fuel` (
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
  PRIMARY KEY (`id`),
  KEY `fk_fuel_lorry` (`lorry_id`),
  CONSTRAINT `fk_fuel_lorry` FOREIGN KEY (`lorry_id`) REFERENCES `lorries` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fuel`
--

LOCK TABLES `fuel` WRITE;
/*!40000 ALTER TABLE `fuel` DISABLE KEYS */;
INSERT INTO `fuel` (`id`, `lorry_id`, `date_filled`, `bunk_name`, `litres_filled`, `price_per_litre`, `amount_paid`, `created_at`, `updated_at`, `km_reading_before`, `km_reading_after`, `status`) VALUES (16,43,'2026-08-12','Indian oil',1000.00,100.40,10000.00,'2026-08-12 08:13:22','2026-08-12 08:30:57',NULL,NULL,'cleared'),(17,43,'2026-08-09','Indian oil',2000.00,100.50,20000.00,'2026-08-12 08:30:45','2026-08-12 08:30:57',NULL,NULL,'cleared'),(18,43,'2026-08-10','HP',1000.00,100.40,20000.00,'2026-08-12 08:34:31','2026-08-12 08:34:49',NULL,NULL,'cleared'),(19,43,'2026-08-05','Indian oil',2000.00,100.40,50000.00,'2026-08-12 08:35:24','2026-08-12 08:35:41',NULL,NULL,'cleared');
/*!40000 ALTER TABLE `fuel` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-08-13 13:17:11
