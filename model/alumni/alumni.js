import { db } from "./../../database/database.js";

export class Alumni {
  constructor( name, surname, email, password) {
    this.name = name;
    this.surname = surname;
    this.email = email;
    this.password = password;
  }

  static find(email) {
    return db.execute('SELECT * FROM alumni WHERE email = ?', [email]);
  }

  static save(alumni) {

    return db.execute(
      'INSERT INTO alumni (name, surname, email, password) VALUES (?, ?, ?, ?)',
      [alumni.name, alumni.surname, user.email, user.password]
    );
  }
};