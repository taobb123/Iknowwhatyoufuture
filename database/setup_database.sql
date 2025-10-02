-- 创建数据库（如果不存在）
CREATE DATABASE IF NOT EXISTS gamehub_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 使用数据库
USE gamehub_db;

-- 显示数据库列表
SHOW DATABASES;

-- 显示当前数据库
SELECT DATABASE() as current_database;

-- 显示表列表（导入schema.sql后）
SHOW TABLES;

