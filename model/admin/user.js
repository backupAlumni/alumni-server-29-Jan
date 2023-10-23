
import { db } from "../alumni_space_db.js";

export class User {
  constructor( email, password, role) {

    this.email = email;
    this.password = password;
    this.role = role;
  }

  static find(email) {
    return db.execute('SELECT * FROM user WHERE email = ?', [email]);
  }

  static save(user) {

    return db.execute(
      'INSERT INTO user (email, password, role) VALUES (?, ?, ?)',
      [user.email, user.password, user.role]
    );
  }
};