-- 0001: Add password_hash to customers for online auth (PIN/pin_hash stays for POS)
ALTER TABLE `customers`
  ADD COLUMN `password_hash` VARCHAR(255) NULL AFTER `is_active`;
