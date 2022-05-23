ALTER TABLE github_users ADD COLUMN full_name VARCHAR(255);

CREATE TABLE social_networks (
    `id` bigint NOT NULL AUTO_INCREMENT,
    `network_name` VARCHAR(255) NOT NULL,
    `base_url` VARCHAR(255) NOT NULL,
    `icon_name` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `unique_network_name` (`network_name`)
) ENGINE=InnoDB charset=utf8mb4;

CREATE TABLE principal_social (
    `id` bigint NOT NULL AUTO_INCREMENT,
    `principal_id` bigint,
    `network_id` bigint,
    `data` VARCHAR(255),
    PRIMARY KEY (`id`),
    CONSTRAINT `principal_social_1` FOREIGN KEY (`principal_id`) REFERENCES `principals` (`id`),
    CONSTRAINT `principal_social_2` FOREIGN KEY (`network_id`) REFERENCES `social_networks` (`id`)
) ENGINE=InnoDB charset=utf8mb4;

INSERT INTO `social_networks` (`id`, `network_name`, `base_url`)
VALUES
    (1, 'github', 'github.com', 'github.svg'),
    (2, 'linkedin', 'linkedin.com/in', 'linkedin.svg');
