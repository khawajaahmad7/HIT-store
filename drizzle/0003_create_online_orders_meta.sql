-- 0003: online_orders_meta — tracks online-specific state alongside sales
CREATE TABLE IF NOT EXISTS `online_orders_meta` (
  `online_order_id` INT NOT NULL AUTO_INCREMENT,
  `sale_id` INT NOT NULL,
  `delivery_address` TEXT,
  `delivery_city` VARCHAR(100),
  `customer_notes` TEXT,
  `whatsapp_sent` TINYINT(1) DEFAULT 0,
  `status` VARCHAR(30) DEFAULT 'pending',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`online_order_id`),
  KEY `online_orders_sale_idx` (`sale_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
