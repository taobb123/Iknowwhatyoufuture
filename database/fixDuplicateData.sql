-- 数据修复脚本
-- 用于修复重复数据和优化表结构

USE gamehub_db;

-- 1. 查看当前重复数据
SELECT '=== 重复用户ID检查 ===' as info;
SELECT id, COUNT(*) as count 
FROM users 
GROUP BY id 
HAVING COUNT(*) > 1;

SELECT '=== 重复用户名检查 ===' as info;
SELECT username, COUNT(*) as count 
FROM users 
GROUP BY username 
HAVING COUNT(*) > 1;

-- 2. 清理重复的用户ID（保留最早的记录）
DELETE u1 FROM users u1
INNER JOIN users u2 
WHERE u1.id = u2.id AND u1.created_at > u2.created_at;

-- 3. 清理重复的用户名（保留最早的记录）
DELETE u1 FROM users u1
INNER JOIN users u2 
WHERE u1.username = u2.username AND u1.id != u2.id AND u1.created_at > u2.created_at;

-- 4. 优化表结构 - 添加唯一索引
ALTER TABLE users ADD UNIQUE INDEX idx_username_unique (username);
ALTER TABLE users ADD UNIQUE INDEX idx_email_unique (email);

-- 5. 查看修复后的数据
SELECT '=== 修复后的用户数据 ===' as info;
SELECT id, username, email, role, user_type, created_at 
FROM users 
ORDER BY created_at;

SELECT '=== 数据统计 ===' as info;
SELECT 
  COUNT(*) as total_users,
  COUNT(DISTINCT username) as unique_usernames,
  COUNT(DISTINCT email) as unique_emails
FROM users;

