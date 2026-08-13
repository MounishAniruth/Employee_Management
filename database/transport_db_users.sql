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
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
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
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (6,'Thangavelu','9443769338','srimurugan3749@gmail.com','$2b$10$8QRsQvMijuDHX/BohU5rn.KlzdiWrB6K2l1fblThl38a2aG7JPGLO','owner','2024-12-25 00:33:46','2024-12-25 00:33:46'),(12,'Suganthi','9865055838','suganthi1708@gmail.com','$2b$10$/SsMFWtj8/ZhKeRPN/2ZPu5nLrp0iKodiAUSVUbVEH8Oy251KInve','owner','2024-12-25 15:35:16','2024-12-25 15:35:16'),(16,'Joshitha','9865588358','joshitha3749@gmail.com','$2b$10$wWqV70qq77RDFdWlL1scc.4JXyalKrtDpsI91SinbSn2GS8xV9l0y','lorry_manager','2025-10-07 03:53:20','2025-10-07 03:53:20'),(17,'Mounish','7010684519','Mounishaniruth1708@gmail.com','$2b$10$C1J/M7try6AEAiMyOpZxWeAGGveogi5lJz0glbM4oGtQGx4s.29rW','owner','2025-10-07 04:15:42','2025-10-07 04:15:42'),(18,'Rohith','1234567890','rohit12@gmail.com','$2a$10$ohMuF2WzWUwh714cQgufGuMapyUmT22YD8flUrH7EevBuV4FGVwIy','owner','2026-08-12 07:13:57','2026-08-12 07:13:57'),(19,'Mounish','7010684518','mounish1708@gmail.com','$2a$10$E51k52ib5u2va3o0jdXqZegN8Cg4ixbXwj1lSAomv1JKb9EpL/v1a','manager','2026-08-12 08:36:43','2026-08-12 08:36:43'),(20,'Sanjai ','9865588359','sanjai12@gmail.com','$2a$10$2.iP/4XO46.2h5cJixl3Hu8c3qFDGUeOzgHKA5D9Fo77sbqmiaz6e','owner','2026-08-13 07:29:06','2026-08-13 07:29:06');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
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
