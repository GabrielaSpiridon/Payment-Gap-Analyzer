import mariadb from 'mariadb';

const pool = mariadb.createPool({
  host: 'localhost',
  user: 'root',
  password: 'gabriela2003',
  database: 'payment_gap_db',
  connectionLimit: 5
});

export default pool;
