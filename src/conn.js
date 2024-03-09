import mysql from 'mysql2/promise'

const pool = mysql.createPool({
  host: 'localhost',
  user: 'estebanz',
  database: 'blog_db',
  password: 'Luna3Sol#2024',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

export default pool
