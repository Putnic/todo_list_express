const mysql = require('mysql');

const config = {
	connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: '1',
  database: 'my_db'
};

if (module.parent) {
  const pool = mysql.createPool(config, function(err) {
    if (err) console.log(err);
  }); 
  
  module.exports = pool;  
} else {
  const connection = mysql.createConnection(config); 

  connection.connect(function (err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }
    console.log('connected as id ' + connection.threadId);
  });

  // connection.query("CREATE DATABASE my_db", function (err, result) {
  //   if (err) throw err;
  //   console.log("Database created: ", result);
  // });

  let sql = "CREATE TABLE IF NOT EXISTS items\
    (id INT AUTO_INCREMENT PRIMARY KEY,\
    name VARCHAR(255) NOT NULL,\
    description TINYTEXT,\
    completed BOOL DEFAULT false)";

  let sql_1 = "ALTER TABLE items ADD COLUMN\
    (creation_time DATETIME DEFAULT CURRENT_TIMESTAMP,\
    modification_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)";
  
  // "ALTER TABLE items\
  // RENAME COLUMN creation_time TO created_at,\
  // RENAME COLUMN modification_time TO updated_at"
  let sql_3 = "ALTER TABLE items\
    CHANGE created_at created_at DATETIME DEFAULT CURRENT_TIMESTAMP,\
    CHANGE modification_time updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP";

  connection.query(sql_3, function (error, results, fields) {
    // Handle error after the release.
    if (error) throw error;

    // And done with the connection.
    console.log('The solution is: ', results);
    
    connection.end(function(err) {
      // The connection is terminated now
    });

  });
}

// TABLE items:
//   id INT AUTO_INCREMENT PRIMARY KEY,\
//   name VARCHAR(255) NOT NULL,\
//   description TINYTEXT,\
//   completed BOOL DEFAULT false,\
//   created_at DATETIME DEFAULT CURRENT_TIMESTAMP,\
//   updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP