
import { db } from "../../model/alumni_space_db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = (req, res) => {
    // CHECK EXISTING USER
    const sql = "SELECT * alumni_space_account FROM account_id WHERE email = ? OR account_id = ?";
  
    db.query( sql, [req.body.email, req.body.username], (err, data) => {
      if (err) return res.status(500).json(err);
      if (data.length) return res.status(409).json("User already exists!");
  
    //Hash the password and create a user
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(req.body.password, salt);
  
      const sql = "INSERT INTO alumni_space_account(`account_id`,`email`,`password`) VALUES (?)";
      const values = [req.body.username, req.body.email, hash];
    


      db.query( sql, [values], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("User has been created.");
      });
    });
};


export const login = (req, res) => {
    //CHECK USER
    const sql = "SELECT * FROM alumni_space_account WHERE account_id = ?";
  
    db.query( sql, [req.body.username], (err, data) => {

      if (err) return res.status(500).json(err);
      if (data.length === 0) return res.status(404).json("User not found!");
  
      //Check password
      const isPasswordCorrect = bcrypt.compareSync(
        req.body.password,
        data[0].password
      );
  
      if (!isPasswordCorrect)
        return res.status(400).json("Wrong account_id or password!");
  
      const token = jwt.sign({ id: data[0].id }, "jwtkey");
      const { password, ...other } = data[0];
  
      res.cookie("access_token", token, {
          httpOnly: true,
        })
        .status(200)
        .json(other);
    });
};
  
export const logout = (req, res) => {
res.clearCookie("access_token",{
    sameSite:"none",
    secure:true
    }).status(200).json("User has been logged out.")
};
  