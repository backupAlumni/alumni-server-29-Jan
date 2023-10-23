import { db } from "./../../database/database.js";

module.exports = class Admin {
  constructor( name, surname, email, password) {
    this.name = name;
    this.surname = surname;
    this.email = email;
    this.password = password;
  }

  static find(email) {
    return db.execute('SELECT * FROM admin WHERE email = ?', [email]);
  }

  static save(admin) {
    
    return db.execute(
      'INSERT INTO admin (name, surname, email, password) VALUES (?, ?, ?)',
      [admin.name, admin.surname, admin.email, admin.password]
    );
  }
};