mysqldump: [Warning] Using a password on the command line interface can be insecure.
-- MySQL dump 10.13  Distrib 8.0.45, for Linux (x86_64)
--
-- Host: localhost    Database: hexa_vims_db_development
-- ------------------------------------------------------
-- Server version	8.0.45

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
-- Table structure for table `SequelizeMeta`
--

DROP TABLE IF EXISTS `SequelizeMeta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SequelizeMeta` (
  `name` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  PRIMARY KEY (`name`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SequelizeMeta`
--

LOCK TABLES `SequelizeMeta` WRITE;
/*!40000 ALTER TABLE `SequelizeMeta` DISABLE KEYS */;
INSERT INTO `SequelizeMeta` VALUES ('20221129184012-create-user.js'),('20230401132541-create-token.js'),('20241231000001-create-discount.js'),('20250101000001-create-customeraddress.js'),('20250101000002-create-customer.js'),('20250101000003-create-category.js'),('20250101000004-create-supplier.js'),('20250101000005-create-warehouselocation.js'),('20250101000006-create-product.js'),('20250101000007-create-purchaseorder.js'),('20250101000008-create-salesorder.js'),('20250101000009-create-purchaseorderdetail.js'),('20250101000010-create-salesorderdetail.js'),('20250101000011-create-productstorage.js'),('20250101000012-create-inventorytransaction.js'),('20250101000013-create-orderstatushistory.js'),('20250101000014-create-deliverydetails.js'),('20250101000015-create-warehousetransfers.js'),('20250101000016-create-returnorders.js'),('20250101000017-create-returnorderitems.js'),('20250216000001-create-user-security-preferences.js');
/*!40000 ALTER TABLE `SequelizeMeta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `CategoryID` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) DEFAULT NULL,
  `Description` text,
  `isActive` tinyint(1) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`CategoryID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customeraddresses`
--

DROP TABLE IF EXISTS `customeraddresses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customeraddresses` (
  `AddressID` int NOT NULL AUTO_INCREMENT,
  `AddressType` varchar(255) DEFAULT NULL,
  `Street` varchar(255) DEFAULT NULL,
  `City` varchar(255) DEFAULT NULL,
  `State` varchar(255) DEFAULT NULL,
  `PostalCode` varchar(255) DEFAULT NULL,
  `Country` varchar(255) DEFAULT NULL,
  `IsDefault` tinyint DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`AddressID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customeraddresses`
--

LOCK TABLES `customeraddresses` WRITE;
/*!40000 ALTER TABLE `customeraddresses` DISABLE KEYS */;
/*!40000 ALTER TABLE `customeraddresses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customers` (
  `CustomerID` int NOT NULL AUTO_INCREMENT,
  `CustomerAddressID` int DEFAULT NULL,
  `Name` varchar(255) DEFAULT NULL,
  `CompanyName` varchar(255) DEFAULT NULL,
  `Phone` varchar(255) DEFAULT NULL,
  `Email` varchar(255) DEFAULT NULL,
  `Note` text,
  `isActive` tinyint(1) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`CustomerID`),
  KEY `CustomerAddressID` (`CustomerAddressID`),
  CONSTRAINT `customers_ibfk_1` FOREIGN KEY (`CustomerAddressID`) REFERENCES `customeraddresses` (`AddressID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customers`
--

LOCK TABLES `customers` WRITE;
/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
/*!40000 ALTER TABLE `customers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `deliverydetails`
--

DROP TABLE IF EXISTS `deliverydetails`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `deliverydetails` (
  `DeliveryID` int NOT NULL AUTO_INCREMENT,
  `CustomerID` int DEFAULT NULL,
  `DeliveryAddressID` int DEFAULT NULL,
  `OrderID` int DEFAULT NULL,
  `DeliveryDate` datetime DEFAULT NULL,
  `DeliveryTimeSlot` varchar(255) DEFAULT NULL,
  `DeliveryStatus` varchar(255) DEFAULT NULL,
  `TrackingNumber` varchar(255) DEFAULT NULL,
  `Carrier` varchar(255) DEFAULT NULL,
  `EstimatedDeliveryDate` datetime DEFAULT NULL,
  `ActualDeliveryDate` datetime DEFAULT NULL,
  `PaymentStatus` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`DeliveryID`),
  KEY `CustomerID` (`CustomerID`),
  KEY `DeliveryAddressID` (`DeliveryAddressID`),
  KEY `OrderID` (`OrderID`),
  CONSTRAINT `deliverydetails_ibfk_1` FOREIGN KEY (`CustomerID`) REFERENCES `customers` (`CustomerID`),
  CONSTRAINT `deliverydetails_ibfk_2` FOREIGN KEY (`DeliveryAddressID`) REFERENCES `customeraddresses` (`AddressID`),
  CONSTRAINT `deliverydetails_ibfk_3` FOREIGN KEY (`OrderID`) REFERENCES `salesorders` (`OrderID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `deliverydetails`
--

LOCK TABLES `deliverydetails` WRITE;
/*!40000 ALTER TABLE `deliverydetails` DISABLE KEYS */;
/*!40000 ALTER TABLE `deliverydetails` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `discounts`
--

DROP TABLE IF EXISTS `discounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `discounts` (
  `DiscountID` int NOT NULL AUTO_INCREMENT,
  `Amount` varchar(255) DEFAULT NULL,
  `PurchaseOrders` tinyint(1) DEFAULT NULL,
  `SalesOrders` tinyint(1) DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`DiscountID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `discounts`
--

LOCK TABLES `discounts` WRITE;
/*!40000 ALTER TABLE `discounts` DISABLE KEYS */;
/*!40000 ALTER TABLE `discounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inventorytransactions`
--

DROP TABLE IF EXISTS `inventorytransactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventorytransactions` (
  `TransactionID` int NOT NULL AUTO_INCREMENT,
  `SalesOrderID` int DEFAULT NULL,
  `PurchaseOrderID` int DEFAULT NULL,
  `ProductID` int DEFAULT NULL,
  `Quantity` decimal(10,2) DEFAULT NULL,
  `TransactionDate` datetime DEFAULT NULL,
  `TransactionType` enum('FULFILL','RETURN','EXCHANGE') DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`TransactionID`),
  KEY `SalesOrderID` (`SalesOrderID`),
  KEY `PurchaseOrderID` (`PurchaseOrderID`),
  KEY `ProductID` (`ProductID`),
  CONSTRAINT `inventorytransactions_ibfk_1` FOREIGN KEY (`SalesOrderID`) REFERENCES `salesorders` (`OrderID`),
  CONSTRAINT `inventorytransactions_ibfk_2` FOREIGN KEY (`PurchaseOrderID`) REFERENCES `purchaseorders` (`OrderID`),
  CONSTRAINT `inventorytransactions_ibfk_3` FOREIGN KEY (`ProductID`) REFERENCES `products` (`ProductID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventorytransactions`
--

LOCK TABLES `inventorytransactions` WRITE;
/*!40000 ALTER TABLE `inventorytransactions` DISABLE KEYS */;
/*!40000 ALTER TABLE `inventorytransactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orderstatushistories`
--

DROP TABLE IF EXISTS `orderstatushistories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orderstatushistories` (
  `StatusID` int NOT NULL AUTO_INCREMENT,
  `purchaseorderOrderID` int DEFAULT NULL,
  `salesorderOrderID` int DEFAULT NULL,
  `OldStatus` varchar(255) DEFAULT NULL,
  `NewStatus` varchar(255) DEFAULT NULL,
  `StatusChangeDate` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`StatusID`),
  KEY `purchaseorderOrderID` (`purchaseorderOrderID`),
  KEY `salesorderOrderID` (`salesorderOrderID`),
  CONSTRAINT `orderstatushistories_ibfk_1` FOREIGN KEY (`purchaseorderOrderID`) REFERENCES `purchaseorders` (`OrderID`),
  CONSTRAINT `orderstatushistories_ibfk_2` FOREIGN KEY (`salesorderOrderID`) REFERENCES `salesorders` (`OrderID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orderstatushistories`
--

LOCK TABLES `orderstatushistories` WRITE;
/*!40000 ALTER TABLE `orderstatushistories` DISABLE KEYS */;
/*!40000 ALTER TABLE `orderstatushistories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `ProductID` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(100) DEFAULT NULL,
  `Description` varchar(255) DEFAULT NULL,
  `SellingPrice` decimal(10,2) DEFAULT NULL,
  `BuyingPrice` decimal(10,2) DEFAULT NULL,
  `QuantityInStock` decimal(10,2) DEFAULT NULL,
  `CategoryID` int DEFAULT NULL,
  `SupplierID` int DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`ProductID`),
  KEY `CategoryID` (`CategoryID`),
  KEY `SupplierID` (`SupplierID`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`CategoryID`) REFERENCES `categories` (`CategoryID`),
  CONSTRAINT `products_ibfk_2` FOREIGN KEY (`SupplierID`) REFERENCES `suppliers` (`SupplierID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productstorages`
--

DROP TABLE IF EXISTS `productstorages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `productstorages` (
  `ProductID` int NOT NULL,
  `LocationID` int NOT NULL,
  `Quantity` decimal(10,2) DEFAULT NULL,
  `LastUpdated` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`ProductID`,`LocationID`),
  KEY `LocationID` (`LocationID`),
  CONSTRAINT `productstorages_ibfk_1` FOREIGN KEY (`ProductID`) REFERENCES `products` (`ProductID`),
  CONSTRAINT `productstorages_ibfk_2` FOREIGN KEY (`LocationID`) REFERENCES `warehouselocations` (`LocationID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productstorages`
--

LOCK TABLES `productstorages` WRITE;
/*!40000 ALTER TABLE `productstorages` DISABLE KEYS */;
/*!40000 ALTER TABLE `productstorages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `purchaseorderdetails`
--

DROP TABLE IF EXISTS `purchaseorderdetails`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `purchaseorderdetails` (
  `id` int NOT NULL AUTO_INCREMENT,
  `OrderID` int DEFAULT NULL,
  `ProductID` int DEFAULT NULL,
  `Quantity` int DEFAULT NULL,
  `UnitPrice` decimal(10,0) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `OrderID` (`OrderID`),
  KEY `ProductID` (`ProductID`),
  CONSTRAINT `purchaseorderdetails_ibfk_1` FOREIGN KEY (`OrderID`) REFERENCES `purchaseorders` (`OrderID`),
  CONSTRAINT `purchaseorderdetails_ibfk_2` FOREIGN KEY (`ProductID`) REFERENCES `products` (`ProductID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `purchaseorderdetails`
--

LOCK TABLES `purchaseorderdetails` WRITE;
/*!40000 ALTER TABLE `purchaseorderdetails` DISABLE KEYS */;
/*!40000 ALTER TABLE `purchaseorderdetails` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `purchaseorders`
--

DROP TABLE IF EXISTS `purchaseorders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `purchaseorders` (
  `OrderID` int NOT NULL AUTO_INCREMENT,
  `OrderDate` datetime DEFAULT NULL,
  `TotalAmount` decimal(10,0) DEFAULT NULL,
  `Status` varchar(255) DEFAULT NULL,
  `Discount` decimal(10,0) DEFAULT NULL,
  `DiscountID` int DEFAULT NULL,
  `NetAmount` decimal(10,0) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`OrderID`),
  KEY `DiscountID` (`DiscountID`),
  CONSTRAINT `purchaseorders_ibfk_1` FOREIGN KEY (`DiscountID`) REFERENCES `discounts` (`DiscountID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `purchaseorders`
--

LOCK TABLES `purchaseorders` WRITE;
/*!40000 ALTER TABLE `purchaseorders` DISABLE KEYS */;
/*!40000 ALTER TABLE `purchaseorders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `returnorderitems`
--

DROP TABLE IF EXISTS `returnorderitems`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `returnorderitems` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ReturnID` int NOT NULL,
  `ProductID` int DEFAULT NULL,
  `Quantity` int DEFAULT NULL,
  `Note` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `ReturnID` (`ReturnID`),
  KEY `ProductID` (`ProductID`),
  CONSTRAINT `returnorderitems_ibfk_1` FOREIGN KEY (`ReturnID`) REFERENCES `returnorders` (`ReturnID`),
  CONSTRAINT `returnorderitems_ibfk_2` FOREIGN KEY (`ProductID`) REFERENCES `products` (`ProductID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `returnorderitems`
--

LOCK TABLES `returnorderitems` WRITE;
/*!40000 ALTER TABLE `returnorderitems` DISABLE KEYS */;
/*!40000 ALTER TABLE `returnorderitems` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `returnorders`
--

DROP TABLE IF EXISTS `returnorders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `returnorders` (
  `ReturnID` int NOT NULL AUTO_INCREMENT,
  `SalesOrderID` int DEFAULT NULL,
  `PurchaseOrderID` int DEFAULT NULL,
  `ReturnDate` datetime NOT NULL,
  `Reason` text NOT NULL,
  `CreatedBy` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`ReturnID`),
  KEY `SalesOrderID` (`SalesOrderID`),
  KEY `PurchaseOrderID` (`PurchaseOrderID`),
  KEY `CreatedBy` (`CreatedBy`),
  CONSTRAINT `returnorders_ibfk_1` FOREIGN KEY (`SalesOrderID`) REFERENCES `salesorders` (`OrderID`),
  CONSTRAINT `returnorders_ibfk_2` FOREIGN KEY (`PurchaseOrderID`) REFERENCES `purchaseorders` (`OrderID`),
  CONSTRAINT `returnorders_ibfk_3` FOREIGN KEY (`CreatedBy`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `returnorders`
--

LOCK TABLES `returnorders` WRITE;
/*!40000 ALTER TABLE `returnorders` DISABLE KEYS */;
/*!40000 ALTER TABLE `returnorders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `salesorderdetails`
--

DROP TABLE IF EXISTS `salesorderdetails`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `salesorderdetails` (
  `OrderID` int NOT NULL AUTO_INCREMENT,
  `ProductID` int NOT NULL,
  `Quantity` decimal(10,2) DEFAULT NULL,
  `UnitPrice` decimal(10,2) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`OrderID`,`ProductID`),
  KEY `ProductID` (`ProductID`),
  CONSTRAINT `salesorderdetails_ibfk_1` FOREIGN KEY (`OrderID`) REFERENCES `salesorders` (`OrderID`),
  CONSTRAINT `salesorderdetails_ibfk_2` FOREIGN KEY (`ProductID`) REFERENCES `products` (`ProductID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `salesorderdetails`
--

LOCK TABLES `salesorderdetails` WRITE;
/*!40000 ALTER TABLE `salesorderdetails` DISABLE KEYS */;
/*!40000 ALTER TABLE `salesorderdetails` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `salesorders`
--

DROP TABLE IF EXISTS `salesorders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `salesorders` (
  `OrderID` int NOT NULL AUTO_INCREMENT,
  `CustomerID` int DEFAULT NULL,
  `OrderDate` datetime DEFAULT NULL,
  `TotalAmount` decimal(10,2) DEFAULT NULL,
  `Status` varchar(255) DEFAULT NULL,
  `Discount` decimal(10,0) DEFAULT NULL,
  `DiscountID` int DEFAULT NULL,
  `LocationID` int DEFAULT NULL,
  `PaymentStatus` enum('UNPAID','PAID') DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`OrderID`),
  KEY `CustomerID` (`CustomerID`),
  KEY `DiscountID` (`DiscountID`),
  KEY `LocationID` (`LocationID`),
  CONSTRAINT `salesorders_ibfk_1` FOREIGN KEY (`CustomerID`) REFERENCES `customers` (`CustomerID`),
  CONSTRAINT `salesorders_ibfk_2` FOREIGN KEY (`DiscountID`) REFERENCES `discounts` (`DiscountID`),
  CONSTRAINT `salesorders_ibfk_3` FOREIGN KEY (`LocationID`) REFERENCES `warehouselocations` (`LocationID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `salesorders`
--

LOCK TABLES `salesorders` WRITE;
/*!40000 ALTER TABLE `salesorders` DISABLE KEYS */;
/*!40000 ALTER TABLE `salesorders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `suppliers`
--

DROP TABLE IF EXISTS `suppliers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `suppliers` (
  `SupplierID` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) NOT NULL,
  `CompanyName` varchar(255) DEFAULT NULL,
  `ContactTitle` varchar(255) DEFAULT NULL,
  `Phone` varchar(255) DEFAULT NULL,
  `Email` varchar(255) DEFAULT NULL,
  `Address` varchar(255) DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`SupplierID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `suppliers`
--

LOCK TABLES `suppliers` WRITE;
/*!40000 ALTER TABLE `suppliers` DISABLE KEYS */;
/*!40000 ALTER TABLE `suppliers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tokens`
--

DROP TABLE IF EXISTS `tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tokens` (
  `id` int NOT NULL AUTO_INCREMENT,
  `token` varchar(255) DEFAULT NULL,
  `user_id` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `expire_at` datetime DEFAULT NULL,
  `black_listed` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tokens`
--

LOCK TABLES `tokens` WRITE;
/*!40000 ALTER TABLE `tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_security_preferences`
--

DROP TABLE IF EXISTS `user_security_preferences`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_security_preferences` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `pin_enabled` tinyint(1) NOT NULL DEFAULT '0',
  `biometric_enabled` tinyint(1) NOT NULL DEFAULT '0',
  `is_first_login` tinyint(1) NOT NULL DEFAULT '1',
  `pin_failed_attempts` int NOT NULL DEFAULT '0',
  `pin_lockout_until` datetime DEFAULT NULL,
  `device_id` varchar(255) DEFAULT NULL COMMENT 'Unique device identifier for security tracking',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_security_preferences_user_id_unique` (`user_id`),
  KEY `user_security_preferences_device_id_index` (`device_id`),
  CONSTRAINT `user_security_preferences_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_security_preferences`
--

LOCK TABLES `user_security_preferences` WRITE;
/*!40000 ALTER TABLE `user_security_preferences` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_security_preferences` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `firstname` varchar(255) DEFAULT NULL,
  `lastname` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `gender` varchar(255) DEFAULT NULL,
  `active` int DEFAULT NULL,
  `deleted` int DEFAULT NULL,
  `token` varchar(255) DEFAULT NULL,
  `token_expire` varchar(255) DEFAULT NULL,
  `birthday` datetime DEFAULT NULL,
  `role` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `warehouselocations`
--

DROP TABLE IF EXISTS `warehouselocations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `warehouselocations` (
  `LocationID` int NOT NULL AUTO_INCREMENT,
  `WarehouseName` varchar(255) DEFAULT NULL,
  `Address` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`LocationID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `warehouselocations`
--

LOCK TABLES `warehouselocations` WRITE;
/*!40000 ALTER TABLE `warehouselocations` DISABLE KEYS */;
/*!40000 ALTER TABLE `warehouselocations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `warehousetransfers`
--

DROP TABLE IF EXISTS `warehousetransfers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `warehousetransfers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ProductID` int DEFAULT NULL,
  `sourceWarehouseId` int DEFAULT NULL,
  `targetWarehouseId` int DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `transferDate` datetime DEFAULT NULL,
  `transferBy` int DEFAULT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `ProductID` (`ProductID`),
  KEY `sourceWarehouseId` (`sourceWarehouseId`),
  KEY `targetWarehouseId` (`targetWarehouseId`),
  KEY `transferBy` (`transferBy`),
  CONSTRAINT `warehousetransfers_ibfk_1` FOREIGN KEY (`ProductID`) REFERENCES `products` (`ProductID`),
  CONSTRAINT `warehousetransfers_ibfk_2` FOREIGN KEY (`sourceWarehouseId`) REFERENCES `warehouselocations` (`LocationID`),
  CONSTRAINT `warehousetransfers_ibfk_3` FOREIGN KEY (`targetWarehouseId`) REFERENCES `warehouselocations` (`LocationID`),
  CONSTRAINT `warehousetransfers_ibfk_4` FOREIGN KEY (`transferBy`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `warehousetransfers`
--

LOCK TABLES `warehousetransfers` WRITE;
/*!40000 ALTER TABLE `warehousetransfers` DISABLE KEYS */;
/*!40000 ALTER TABLE `warehousetransfers` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-02-25  3:41:27
