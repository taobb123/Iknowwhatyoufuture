// 数据库连接配置
const mysql = require('mysql2/promise');
require('dotenv').config();

// 数据库配置
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'guox123123',
  database: process.env.DB_NAME || 'gamehub_db',
  charset: 'utf8mb4',
  timezone: '+08:00',
  connectionLimit: 10,
  queueLimit: 0
};

// 创建连接池
const pool = mysql.createPool(dbConfig);

// 测试数据库连接
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ 数据库连接成功');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ 数据库连接失败:', error.message);
    return false;
  }
}

// 执行查询
async function query(sql, params = []) {
  try {
    console.log('执行SQL查询:', sql);
    console.log('查询参数:', params);
    
    // 确保使用UTF8MB4字符集
    const connection = await pool.getConnection();
    await connection.execute('SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci');
    await connection.execute('SET character_set_client = utf8mb4');
    await connection.execute('SET character_set_connection = utf8mb4');
    await connection.execute('SET character_set_results = utf8mb4');
    
    const [rows] = await connection.execute(sql, params);
    connection.release();
    
    console.log('查询结果行数:', rows.length);
    return rows;
  } catch (error) {
    console.error('数据库查询错误:', error);
    console.error('SQL:', sql);
    console.error('参数:', params);
    throw error;
  }
}

// 执行事务
async function transaction(callback) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

module.exports = {
  pool,
  query,
  transaction,
  testConnection
};
