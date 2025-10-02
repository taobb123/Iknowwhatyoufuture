-- 检查表结构和数据格式的脚本
-- 1. 查看users表结构
DESCRIBE users;

-- 2. 查看表创建语句
SHOW CREATE TABLE users;

-- 3. 检查字符集设置
SHOW VARIABLES LIKE 'character_set%';

-- 4. 检查SQL模式
SHOW VARIABLES LIKE 'sql_mode';

-- 5. 查看当前数据库字符集
SELECT DEFAULT_CHARACTER_SET_NAME, DEFAULT_COLLATION_NAME 
FROM information_schema.SCHEMATA 
WHERE SCHEMA_NAME = 'gamehub_db';

