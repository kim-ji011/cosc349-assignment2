const mysql2 = require('mysql2');

/* 
 * Database Connection pool
 * allows multiple connections to be used efficiently
 */
const pool = mysql2.createPool({
    host: '192.168.56.12',
    user: 'birduser',
    password: 'birdpass',
    database: 'birds_db',
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

