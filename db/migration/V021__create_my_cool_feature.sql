CREATE TABLE `my_cool_feature_v1` (
  `id` BIGINT,
  `principal_id` BIGINT,
  `page_number` INT,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);

INSERT INTO `my_cool_feature_v1` (`id`, `principal_id`, `page_number`) VALUES (1, 3, 1);
