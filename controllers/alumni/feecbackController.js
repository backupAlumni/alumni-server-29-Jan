import { db } from "../../model/alumni_space_db.js";

export const addfeedback = (req, res) => {
 
    const q = "INSERT INTO  (``, ``, ``, ``, ``) VALUES (?);";

    const values = [
     
    ];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.json("Feedback has been sent.");
    });

};