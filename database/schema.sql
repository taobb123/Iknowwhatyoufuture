-- 游戏中心数据库表结构设计
-- 从浏览器localStorage迁移到MySQL数据库

-- 创建数据库
CREATE DATABASE IF NOT EXISTS gamehub_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE gamehub_db;

-- 1. 用户管理表 (user_management)
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
    name VARCHAR(100) NOT NULL UNIQUE COMMENT '主题名称',
    description TEXT COMMENT '主题描述',
    board_id VARCHAR(50) NOT NULL COMMENT '所属板块ID',
    icon VARCHAR(10) DEFAULT '🌟' COMMENT '主题图标',
    color VARCHAR(50) DEFAULT 'from-yellow-500 to-orange-500' COMMENT '主题颜色主题',
    sort_order INT NOT NULL DEFAULT 0 COMMENT '排序顺序',
    is_active BOOLEAN NOT NULL DEFAULT TRUE COMMENT '是否激活',
    article_count INT NOT NULL DEFAULT 0 COMMENT '文章数量',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    
    FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE,
    INDEX idx_name (name),
    INDEX idx_board_id (board_id),
    INDEX idx_sort_order (sort_order),
    INDEX idx_is_active (is_active),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='主题管理表';

-- 4. 文章管理表 (article_management)
CREATE TABLE articles (
    id VARCHAR(50) PRIMARY KEY COMMENT '文章ID',
    title VARCHAR(200) NOT NULL COMMENT '文章标题',
    content LONGTEXT NOT NULL COMMENT '文章内容',
    author VARCHAR(100) NOT NULL COMMENT '作者名称',
    author_id VARCHAR(50) DEFAULT NULL COMMENT '作者用户ID',
    author_type ENUM('guest', 'regular', 'admin', 'superAdmin') DEFAULT 'regular' COMMENT '作者类型',
    category VARCHAR(100) NOT NULL COMMENT '文章分类',
    board_id VARCHAR(50) DEFAULT NULL COMMENT '所属板块ID',
    topic_id VARCHAR(50) DEFAULT NULL COMMENT '所属主题ID',
    tags JSON DEFAULT NULL COMMENT '文章标签(JSON数组)',
    likes INT NOT NULL DEFAULT 0 COMMENT '点赞数',
    views INT NOT NULL DEFAULT 0 COMMENT '浏览次数',
    comments INT NOT NULL DEFAULT 0 COMMENT '评论数',
    status ENUM('published', 'draft') NOT NULL DEFAULT 'published' COMMENT '发布状态',
    game_id INT DEFAULT NULL COMMENT '关联游戏ID',
    game_title VARCHAR(100) DEFAULT NULL COMMENT '关联游戏标题',
    article_id VARCHAR(100) DEFAULT NULL COMMENT '文章唯一标识',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE SET NULL,
    FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE SET NULL,
    INDEX idx_title (title),
    INDEX idx_author (author),
    INDEX idx_author_id (author_id),
    INDEX idx_category (category),
    INDEX idx_board_id (board_id),
    INDEX idx_topic_id (topic_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    INDEX idx_likes (likes),
    INDEX idx_views (views),
    FULLTEXT idx_content (title, content)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='文章管理表';

-- 5. 主题管理表 (theme_management) - 用于UI主题管理
CREATE TABLE themes (
    id VARCHAR(50) PRIMARY KEY COMMENT '主题ID',
    name VARCHAR(100) NOT NULL UNIQUE COMMENT '主题名称',
    description TEXT COMMENT '主题描述',
    theme_data JSON NOT NULL COMMENT '主题配置数据(JSON)',
    is_default BOOLEAN NOT NULL DEFAULT FALSE COMMENT '是否为默认主题',
    is_active BOOLEAN NOT NULL DEFAULT TRUE COMMENT '是否激活',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    
    INDEX idx_name (name),
    INDEX idx_is_default (is_default),
    INDEX idx_is_active (is_active),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='主题管理表';

-- 6. 系统配置表 (system_config)
CREATE TABLE system_config (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '配置ID',
    config_key VARCHAR(100) NOT NULL UNIQUE COMMENT '配置键',
    config_value TEXT COMMENT '配置值',
    config_type ENUM('string', 'number', 'boolean', 'json') NOT NULL DEFAULT 'string' COMMENT '配置类型',
    description TEXT COMMENT '配置描述',
    updated_by VARCHAR(50) DEFAULT NULL COMMENT '更新者',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    
    INDEX idx_config_key (config_key),
    INDEX idx_updated_by (updated_by)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='系统配置表';

-- 7. 数据迁移记录表 (migration_log)
CREATE TABLE migration_log (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '迁移记录ID',
    table_name VARCHAR(100) NOT NULL COMMENT '迁移的表名',
    migration_type ENUM('create', 'migrate', 'rollback') NOT NULL COMMENT '迁移类型',
    status ENUM('pending', 'running', 'completed', 'failed') NOT NULL DEFAULT 'pending' COMMENT '迁移状态',
    source_data_count INT DEFAULT 0 COMMENT '源数据数量',
    migrated_data_count INT DEFAULT 0 COMMENT '已迁移数据数量',
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

-- 插入默认主题配置
INSERT INTO themes (id, name, description, theme_data, is_default, is_active, created_at, updated_at) VALUES
('theme_1', '默认主题', '系统默认主题', '{"primary": "#3B82F6", "secondary": "#8B5CF6", "background": "#FFFFFF", "text": "#1F2937"}', TRUE, TRUE, NOW(), NOW()),
('theme_2', '深色主题', '深色模式主题', '{"primary": "#60A5FA", "secondary": "#A78BFA", "background": "#1F2937", "text": "#F9FAFB"}', FALSE, TRUE, NOW(), NOW());

-- 插入默认系统配置
INSERT INTO system_config (config_key, config_value, config_type, description, updated_by) VALUES
('allow_guest_anonymous_post', 'true', 'boolean', '是否允许游客匿名发表文章', 'system'),
('max_article_length', '10000', 'number', '文章最大长度限制', 'system'),
('enable_user_registration', 'true', 'boolean', '是否启用用户注册', 'system');

-- 创建视图：用户统计信息
CREATE VIEW user_stats AS
SELECT 
    COUNT(*) as total_users,
    COUNT(CASE WHEN is_active = TRUE THEN 1 END) as active_users,
    COUNT(CASE WHEN role = 'admin' THEN 1 END) as admin_users,
    COUNT(CASE WHEN role = 'superAdmin' THEN 1 END) as super_admin_users,
    COUNT(CASE WHEN user_type = 'regular' THEN 1 END) as regular_users,
    COUNT(CASE WHEN is_guest = TRUE THEN 1 END) as guest_users
FROM users;

-- 创建视图：社区统计信息
CREATE VIEW community_stats AS
SELECT 
    (SELECT COUNT(*) FROM boards WHERE is_active = TRUE) as total_boards,
    (SELECT COUNT(*) FROM topics WHERE is_active = TRUE) as total_topics,
    (SELECT COUNT(*) FROM articles WHERE status = 'published') as total_articles,
    (SELECT SUM(views) FROM articles) as total_views,
    (SELECT SUM(likes) FROM articles) as total_likes;

-- 创建存储过程：更新板块主题数量
DELIMITER //
CREATE PROCEDURE UpdateBoardTopicCount(IN board_id VARCHAR(50))
BEGIN
    UPDATE boards 
    SET topic_count = (
        SELECT COUNT(*) 
        FROM topics 
        WHERE topics.board_id = boards.id AND topics.is_active = TRUE
    )
    WHERE boards.id = board_id;
END //
DELIMITER ;

-- 创建存储过程：更新主题文章数量
DELIMITER //
CREATE PROCEDURE UpdateTopicArticleCount(IN topic_id VARCHAR(50))
BEGIN
    UPDATE topics 
    SET article_count = (
        SELECT COUNT(*) 
        FROM articles 
        WHERE articles.topic_id = topics.id AND articles.status = 'published'
    )
    WHERE topics.id = topic_id;
END //
DELIMITER ;

-- 创建触发器：自动更新板块主题数量
DELIMITER //
CREATE TRIGGER tr_topics_after_insert
AFTER INSERT ON topics
FOR EACH ROW
BEGIN
    CALL UpdateBoardTopicCount(NEW.board_id);
END //

CREATE TRIGGER tr_topics_after_update
AFTER UPDATE ON topics
FOR EACH ROW
BEGIN
    IF OLD.board_id != NEW.board_id THEN
        CALL UpdateBoardTopicCount(OLD.board_id);
        CALL UpdateBoardTopicCount(NEW.board_id);
    END IF;
END //

CREATE TRIGGER tr_topics_after_delete
AFTER DELETE ON topics
FOR EACH ROW
BEGIN
    CALL UpdateBoardTopicCount(OLD.board_id);
END //
DELIMITER ;

-- 创建触发器：自动更新主题文章数量
DELIMITER //
CREATE TRIGGER tr_articles_after_insert
AFTER INSERT ON articles
FOR EACH ROW
BEGIN
    IF NEW.topic_id IS NOT NULL THEN
        CALL UpdateTopicArticleCount(NEW.topic_id);
    END IF;
END //

CREATE TRIGGER tr_articles_after_update
AFTER UPDATE ON articles
FOR EACH ROW
BEGIN
    IF OLD.topic_id != NEW.topic_id THEN
        IF OLD.topic_id IS NOT NULL THEN
            CALL UpdateTopicArticleCount(OLD.topic_id);
        END IF;
        IF NEW.topic_id IS NOT NULL THEN
            CALL UpdateTopicArticleCount(NEW.topic_id);
        END IF;
    END IF;
END //

CREATE TRIGGER tr_articles_after_delete
AFTER DELETE ON articles
FOR EACH ROW
BEGIN
    IF OLD.topic_id IS NOT NULL THEN
        CALL UpdateTopicArticleCount(OLD.topic_id);
    END IF;
END //
DELIMITER ;


