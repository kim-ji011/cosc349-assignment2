const mysql2 = require('mysql2');

/* 
 * Database Connection pool
 * allows multiple connections to be used efficiently
 */
const pool = mysql2.createPool({
    host: 'birdsdb.c5wqegsmc0cs.us-east-1.rds.amazonaws.com',
    user: 'birduser',
    password: 'birdpass',
    database: 'birdsdb',
    port: 3306,
    charset: 'utf8mb4',
    waitForConnections: false,
    connectionLimit: 10,
    queueLimit: 0,
    multipleStatements: true,
});

pool.on('error', (err) => {
    console.error('Error with the database connection pool:', err);
})

module.exports = pool;

