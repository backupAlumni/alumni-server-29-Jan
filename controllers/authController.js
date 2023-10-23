
import { db } from "../model/alumni_space_db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";



export const register = (req, res) => {
    // CHECK EXISTING USER
    const sql = 'SELECT * FROM user WHERE email = ?';
    const email = req.body.email;
    const password = req.body.password;
 

   
    
  
    db.query( sql, [email], (err, data) => {
      if (err) return res.status(500).json(err);
      if (data.length) return res.status(409).json("User already exists!");


      const hash = bcrypt.hash(password, 12)
      const sql = 'INSERT INTO user (`email`, `password`) VALUES (?)';
      const values = [email, hash];
    


      db.query( sql, [values], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("User has been created.");
      });

      
    });
};


export const login = (req, res) => {
    //CHECK USER
    const sql = "SELECT * FROM user WHERE email = ?";

    const email = req.body.email;
  
    db.query( sql, [email], (err, data) => {

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
  