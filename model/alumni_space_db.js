import mysql from "mysql";

export const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  port:"3306",
  password: 'root@2580',
  database: 'alumni_space',
});



