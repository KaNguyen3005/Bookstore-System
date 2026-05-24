-- Docker-only database privileges for the application user.
-- This file is executed by the MySQL container as root during first database initialization.
-- Local development keeps using root from application-dev.yaml.

REVOKE ALL PRIVILEGES, GRANT OPTION FROM 'app'@'%';

GRANT USAGE ON *.* TO 'app'@'%';

GRANT SELECT, INSERT, UPDATE, DELETE ON `db_bookstore`.`roles` TO 'app'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE ON `db_bookstore`.`permissions` TO 'app'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE ON `db_bookstore`.`role_permission` TO 'app'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE ON `db_bookstore`.`users` TO 'app'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE ON `db_bookstore`.`addresses` TO 'app'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE ON `db_bookstore`.`authors` TO 'app'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE ON `db_bookstore`.`publishers` TO 'app'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE ON `db_bookstore`.`categories` TO 'app'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE ON `db_bookstore`.`books` TO 'app'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE ON `db_bookstore`.`book_author` TO 'app'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE ON `db_bookstore`.`book_category` TO 'app'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE ON `db_bookstore`.`book_imgs` TO 'app'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE ON `db_bookstore`.`carts` TO 'app'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE ON `db_bookstore`.`book_cart` TO 'app'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE ON `db_bookstore`.`vouchers` TO 'app'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE ON `db_bookstore`.`user_voucher` TO 'app'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE ON `db_bookstore`.`orders` TO 'app'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE ON `db_bookstore`.`book_order` TO 'app'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE ON `db_bookstore`.`shipments` TO 'app'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE ON `db_bookstore`.`payments` TO 'app'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE ON `db_bookstore`.`interact_events` TO 'app'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE ON `db_bookstore`.`invalidated_token` TO 'app'@'%';

FLUSH PRIVILEGES;
