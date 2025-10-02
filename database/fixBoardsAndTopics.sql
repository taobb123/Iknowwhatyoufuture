-- 数据库修复脚本 - 修复boards和topics表的问题
-- 用于修复重复数据和外键约束问题

USE gamehub_db;

-- 1. 查看当前数据状态
SELECT '=== 当前数据状态 ===' as info;

SELECT '用户数据:' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT '板块数据:', COUNT(*) FROM boards
UNION ALL
SELECT '主题数据:', COUNT(*) FROM topics
UNION ALL
SELECT '文章数据:', COUNT(*) FROM articles;

-- 2. 查看重复数据
SELECT '=== 重复数据检查 ===' as info;

-- 检查重复的板块ID
SELECT '重复板块ID:' as check_type;
SELECT id, COUNT(*) as count 
FROM boards 
GROUP BY id 
HAVING COUNT(*) > 1;

-- 检查重复的板块名称
SELECT '重复板块名称:' as check_type;
SELECT name, COUNT(*) as count 
FROM boards 
GROUP BY name 
HAVING COUNT(*) > 1;

-- 检查重复的主题ID
SELECT '重复主题ID:' as check_type;
SELECT id, COUNT(*) as count 
FROM topics 
GROUP BY id 
HAVING COUNT(*) > 1;

-- 检查重复的主题名称
SELECT '重复主题名称:' as check_type;
SELECT name, COUNT(*) as count 
FROM topics 
GROUP BY name 
HAVING COUNT(*) > 1;

-- 3. 检查外键约束问题
SELECT '=== 外键约束检查 ===' as info;

-- 检查引用了不存在板块的主题
SELECT '引用了不存在板块的主题:' as check_type;
SELECT t.id, t.name, t.board_id, b.id as board_exists
FROM topics t
LEFT JOIN boards b ON t.board_id = b.id
WHERE t.board_id IS NOT NULL AND b.id IS NULL;

-- 4. 修复重复数据
SELECT '=== 开始修复数据 ===' as info;

-- 清理重复的板块ID（保留最早的记录）
DELETE b1 FROM boards b1
INNER JOIN boards b2 
WHERE b1.id = b2.id AND b1.created_at > b2.created_at;

-- 清理重复的板块名称（保留最早的记录）
DELETE b1 FROM boards b1
INNER JOIN boards b2 
WHERE b1.name = b2.name AND b1.id != b2.id AND b1.created_at > b2.created_at;

-- 清理重复的主题ID（保留最早的记录）
DELETE t1 FROM topics t1
INNER JOIN topics t2 
WHERE t1.id = t2.id AND t1.created_at > t2.created_at;

-- 清理重复的主题名称（保留最早的记录）
DELETE t1 FROM topics t1
INNER JOIN topics t2 
WHERE t1.name = t2.name AND t1.id != t2.id AND t1.created_at > t2.created_at;

-- 5. 修复外键约束问题
-- 将引用了不存在板块的主题的board_id设置为NULL
UPDATE topics t
LEFT JOIN boards b ON t.board_id = b.id
SET t.board_id = NULL
WHERE t.board_id IS NOT NULL AND b.id IS NULL;

-- 6. 添加缺失的板块（如果需要）
-- 检查是否有主题引用了board_3但该板块不存在
INSERT IGNORE INTO boards (id, name, description, icon, color, sort_order, is_active, topic_count, created_at, updated_at)
SELECT 'board_3', '社区活动', '社区活动和用户交流', '🎉', 'from-orange-600 to-red-600', 3, TRUE, 0, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM boards WHERE id = 'board_3');

-- 7. 更新主题的board_id引用
UPDATE topics 
SET board_id = 'board_3' 
WHERE name IN ('活动公告', '用户交流') AND board_id IS NULL;

-- 8. 查看修复后的数据
SELECT '=== 修复后的数据状态 ===' as info;

SELECT '用户数据:' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT '板块数据:', COUNT(*) FROM boards
UNION ALL
SELECT '主题数据:', COUNT(*) FROM topics
UNION ALL
SELECT '文章数据:', COUNT(*) FROM articles;

-- 9. 验证外键约束
SELECT '=== 外键约束验证 ===' as info;

-- 检查是否还有引用了不存在板块的主题
SELECT '剩余外键问题:' as check_type;
SELECT COUNT(*) as problem_count
FROM topics t
LEFT JOIN boards b ON t.board_id = b.id
WHERE t.board_id IS NOT NULL AND b.id IS NULL;

-- 10. 显示最终数据
SELECT '=== 最终数据展示 ===' as info;

SELECT '板块列表:' as info;
SELECT id, name, description, topic_count FROM boards ORDER BY sort_order;

SELECT '主题列表:' as info;
SELECT t.id, t.name, t.description, t.board_id, b.name as board_name 
FROM topics t
LEFT JOIN boards b ON t.board_id = b.id
ORDER BY t.board_id, t.sort_order;
