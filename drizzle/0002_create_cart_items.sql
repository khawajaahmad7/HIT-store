-- 0002: cart_items for online store
CREATE TABLE IF NOT EXISTS `cart_items` (
  `cart_item_id` INT NOT NULL AUTO_INCREMENT,
  `customer_id` INT NOT NULL,
  `variant_id` INT NOT NULL,
  `quantity` INT NOT NULL DEFAULT 1,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`cart_item_id`),
  UNIQUE KEY `cart_items_customer_variant_key` (`customer_id`, `variant_id`),
  KEY `cart_items_customer_idx` (`customer_id`),
  KEY `cart_items_variant_idx` (`variant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
