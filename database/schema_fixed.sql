-- 游戏中心数据库表结构设计（修复版）
-- 从浏览器localStorage迁移到MySQL数据库

-- 创建数据库
CREATE DATABASE IF NOT EXISTS gamehub_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE gamehub_db;

-- 1. 用户管理表 (user_management) - 修复username字段长度
CREATE TABLE users (
    id VARCHAR(50) PRIMARY KEY COMMENT '用户ID',
    username VARCHAR(100) NOT NULL UNIQUE COMMENT '用户名',
    email VARCHAR(100) DEFAULT '' COMMENT '邮箱',
    password VARCHAR(255) NOT NULL COMMENT '密码(加密存储)',
    role ENUM('user', 'admin', 'superAdmin') NOT NULL DEFAULT 'user' COMMENT '用户角色',
    user_type ENUM('guest', 'regular', 'admin', 'superAdmin') NOT NULL DEFAULT 'regular' COMMENT '用户类型',
    is_active BOOLEAN NOT NULL DEFAULT TRUE COMMENT '是否激活',
    is_guest BOOLEAN NOT NULL DEFAULT FALSE COMMENT '是否为游客',
    guest_id VARCHAR(50) DEFAULT NULL COMMENT '游客唯一标识',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    last_login_at TIMESTAMP NULL COMMENT '最后登录时间',
    
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_user_type (user_type),
    INDEX idx_is_active (is_active),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户管理表';

-- 2. 板块管理表 (board_management)
CREATE TABLE boards (
    id VARCHAR(50) PRIMARY KEY COMMENT '板块ID',
    name VARCHAR(100) NOT NULL UNIQUE COMMENT '板块名称',
    description TEXT COMMENT '板块描述',
    icon VARCHAR(10) DEFAULT '🎮' COMMENT '板块图标',
    color VARCHAR(50) DEFAULT 'from-blue-600 to-purple-600' COMMENT '板块颜色主题',
    sort_order INT NOT NULL DEFAULT 0 COMMENT '排序顺序',
    is_active BOOLEAN NOT NULL DEFAULT TRUE COMMENT '是否激活',
    topic_count INT NOT NULL DEFAULT 0 COMMENT '主题数量',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    
    INDEX idx_name (name),
    INDEX idx_sort_order (sort_order),
    INDEX idx_is_active (is_active),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='板块管理表';

-- 3. 主题管理表 (topic_management)
CREATE TABLE topics (
    id VARCHAR(50) PRIMARY KEY COMMENT '主题ID',
    name VARCHAR(100) NOT NULL COMMENT '主题名称',
    description TEXT COMMENT '主题描述',
    board_id VARCHAR(50) NOT NULL COMMENT '所属板块ID',
    icon VARCHAR(10) DEFAULT '🌟' COMMENT '主题图标',
    color VARCHAR(50) DEFAULT 'from-yellow-500 to-orange-500' COMMENT '主题颜色主题',
    sort_order INT NOT NULL DEFAULT 0 COMMENT '排序顺序',
    is_active BOOLEAN NOT NULL DEFAULT TRUE COMMENT '是否激活',
    article_count INT NOT NULL DEFAULT 0 COMMENT '文章数量',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    
    INDEX idx_name (name),
    INDEX idx_board_id (board_id),
    INDEX idx_sort_order (sort_order),
    INDEX idx_is_active (is_active),
    INDEX idx_created_at (created_at),
    FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='主题管理表';

-- 4. 文章管理表 (article_management)
CREATE TABLE articles (
    id VARCHAR(50) PRIMARY KEY COMMENT '文章ID',
    title VARCHAR(200) NOT NULL COMMENT '文章标题',
    content LONGTEXT NOT NULL COMMENT '文章内容',
    author VARCHAR(100) NOT NULL COMMENT '作者名称',
    author_id VARCHAR(50) DEFAULT NULL COMMENT '作者ID',
    author_type ENUM('guest', 'regular', 'admin', 'superAdmin') NOT NULL DEFAULT 'regular' COMMENT '作者类型',
    category VARCHAR(50) DEFAULT '' COMMENT '文章分类',
    board_id VARCHAR(50) DEFAULT NULL COMMENT '所属板块ID',
    topic_id VARCHAR(50) DEFAULT NULL COMMENT '所属主题ID',
    tags JSON DEFAULT NULL COMMENT '文章标签(JSON格式)',
    likes INT NOT NULL DEFAULT 0 COMMENT '点赞数',
    views INT NOT NULL DEFAULT 0 COMMENT '浏览数',
    comments INT NOT NULL DEFAULT 0 COMMENT '评论数',
    status ENUM('draft', 'published', 'archived', 'deleted') NOT NULL DEFAULT 'published' COMMENT '文章状态',
    game_id VARCHAR(50) DEFAULT NULL COMMENT '关联游戏ID',
    game_title VARCHAR(100) DEFAULT NULL COMMENT '关联游戏标题',
    article_id VARCHAR(50) DEFAULT NULL COMMENT '原始文章ID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    
    INDEX idx_title (title),
    INDEX idx_author (author),
    INDEX idx_author_id (author_id),
    INDEX idx_board_id (board_id),
    INDEX idx_topic_id (topic_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    INDEX idx_likes (likes),
    INDEX idx_views (views),
    FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE SET NULL,
    FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='文章管理表';

-- 5. 系统配置表 (theme_management)
CREATE TABLE system_config (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '配置ID',
    config_key VARCHAR(100) NOT NULL UNIQUE COMMENT '配置键',
    config_value TEXT NOT NULL COMMENT '配置值',
    config_type ENUM('string', 'number', 'boolean', 'json') NOT NULL DEFAULT 'string' COMMENT '配置类型',
    description TEXT COMMENT '配置描述',
    updated_by VARCHAR(100) DEFAULT 'system' COMMENT '更新者',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    
    INDEX idx_config_key (config_key),
    INDEX idx_config_type (config_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='系统配置表';

-- 6. 数据迁移记录表
CREATE TABLE migration_logs (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '迁移记录ID',
    table_name VARCHAR(50) NOT NULL COMMENT '表名',
    migration_type ENUM('create', 'update', 'delete', 'migrate') NOT NULL COMMENT '迁移类型',
    status ENUM('pending', 'running', 'completed', 'failed') NOT NULL DEFAULT 'pending' COMMENT '状态',
    records_processed INT DEFAULT 0 COMMENT '处理记录数',
    records_success INT DEFAULT 0 COMMENT '成功记录数',
    records_failed INT DEFAULT 0 COMMENT '失败记录数',
    error_message TEXT DEFAULT NULL COMMENT '错误信息',
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '开始时间',
    completed_at TIMESTAMP NULL COMMENT '完成时间',
    
    INDEX idx_table_name (table_name),
    INDEX idx_status (status),
    INDEX idx_started_at (started_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='数据迁移记录表';

-- 插入默认数据

-- 插入默认超级管理员
INSERT INTO users (id, username, email, password, role, user_type, is_active, is_guest, created_at, updated_at) 
VALUES ('admin_1', '吕国祥', 'luguoxiang@gamehub.com', '123123', 'superAdmin', 'superAdmin', TRUE, FALSE, NOW(), NOW());

-- 插入默认板块
INSERT INTO boards (id, name, description, icon, color, sort_order, is_active, created_at, updated_at) VALUES
('board_1', '游戏攻略', '分享各种游戏的攻略和技巧', '🎮', 'from-blue-600 to-purple-600', 1, TRUE, NOW(), NOW()),
('board_2', '技术讨论', '讨论游戏开发和技术相关话题', '💻', 'from-green-600 to-teal-600', 2, TRUE, NOW(), NOW()),
('board_3', '社区活动', '社区活动和用户交流', '🎉', 'from-orange-600 to-red-600', 3, TRUE, NOW(), NOW());

-- 插入默认主题
INSERT INTO topics (id, name, description, board_id, icon, color, sort_order, is_active, created_at, updated_at) VALUES
('topic_1', '新手入门', '适合新手的游戏攻略', 'board_1', '🌟', 'from-yellow-500 to-orange-500', 1, TRUE, NOW(), NOW()),
('topic_2', '高级技巧', '高级玩家分享的技巧', 'board_1', '⚡', 'from-purple-500 to-pink-500', 2, TRUE, NOW(), NOW()),
('topic_3', '前端开发', '前端技术讨论', 'board_2', '🎨', 'from-cyan-500 to-blue-500', 1, TRUE, NOW(), NOW()),
('topic_4', '后端开发', '后端技术讨论', 'board_2', '⚙️', 'from-gray-500 to-slate-500', 2, TRUE, NOW(), NOW()),
('topic_5', '活动公告', '社区活动公告', 'board_3', '📢', 'from-red-500 to-pink-500', 1, TRUE, NOW(), NOW()),
('topic_6', '用户交流', '用户之间的交流讨论', 'board_3', '💬', 'from-green-500 to-teal-500', 2, TRUE, NOW(), NOW());

-- 插入默认系统配置
INSERT INTO system_config (config_key, config_value, config_type, description, updated_by) VALUES
('allow_guest_anonymous_post', 'true', 'boolean', '是否允许游客匿名发表文章', 'system'),
('max_article_length', '10000', 'number', '文章最大长度', 'system'),
('enable_article_likes', 'true', 'boolean', '是否启用文章点赞功能', 'system'),
('enable_article_comments', 'true', 'boolean', '是否启用文章评论功能', 'system'),
('default_board_icon', '🎮', 'string', '默认板块图标', 'system'),
('default_topic_icon', '🌟', 'string', '默认主题图标', 'system');

-- 显示创建结果
SELECT 'Database and tables created successfully!' as message;
SHOW TABLES;

