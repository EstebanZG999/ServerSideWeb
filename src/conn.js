import mysql from 'mysql2/promise'

const pool = mysql.createPool({
  host: 'localhost',
  user: 'estebanz',
  database: 'blog_esteban',
  password: 'estebanz',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

export default pool
