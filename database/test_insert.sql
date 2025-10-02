-- 测试字符长度和编码问题
USE gamehub_db;

-- 检查当前表结构
DESCRIBE users;

-- 测试插入不同长度的用户名
-- 测试1: 短用户名
INSERT INTO users (id, username, email, password, role, user_type, is_active, is_guest) 
VALUES ('test1', 'admin', 'admin@test.com', '123', 'user', 'regular', TRUE, FALSE);

-- 测试2: 中文用户名
INSERT INTO users (id, username, email, password, role, user_type, is_active, is_guest) 
VALUES ('test2', '测试用户', 'test@test.com', '123', 'user', 'regular', TRUE, FALSE);

-- 测试3: 长用户名
INSERT INTO users (id, username, email, password, role, user_type, is_active, is_guest) 
VALUES ('test3', 'very_long_username_that_might_cause_problems_if_not_properly_handled', 'long@test.com', '123', 'user', 'regular', TRUE, FALSE);

-- 查看插入结果
SELECT id, username, CHAR_LENGTH(username) as char_length, LENGTH(username) as byte_length FROM users;
