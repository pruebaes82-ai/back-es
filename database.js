const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.MYSQLHOST ?? 'localhost',
  user: process.env.MYSQLUSER ?? 'root',
  database: process.env.MYSQLDATABASE ?? 'easyshop',
  password: process.env.MYSQLPASSWORD ?? '',
  port: process.env.MYSQLPORT ?? 3306,
  waitForConnections: true
  
});

module.exports = pool;