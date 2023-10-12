import { db } from "../../model/alumni_space_db.js";



export const getPosts = (req, res) => {
  const q = 
     "SELECT * FROM userstory";

  db.query(q, (err, data) => {
    if (err) return res.status(500).send(err);

    return res.status(200).json(data);
  });
};

export const getPost = (req, res) => {

  const q ="SELECT * FROM userstory WHERE user_id = ?";

  db.query(q, [req.params.id], (err, data) => {
    
    if (err) return res.status(500).json(err);

    return res.status(200).json(data[0]);
  });
};

export const addPost = (req, res) => {
 
    const q = "INSERT INTO userstory (`user_id`, `alumni_id`, `story_type`, `story_text`, `date_posted`) VALUES (?);";

    const values = [
      req.body.user_id,
      req.body.alumni_id,
      req.body.story_type,
      req.body.story_text,
      req.body.date_posted,
    ];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.json("Post has been created.");
    });

};

export const deletePost = (req, res) => {

    const postId = req.params.id;
    const q = "DELETE FROM userstory WHERE user_id = ?";

    db.query(q, [postId], (err, data) => {
      if (err) return res.status(403).json("You can delete only your post!");

      return res.json("Post has been deleted!");
    });
};

export const updatePost = (req, res) => {

    const postId = req.params.id;
    const q = "UPDATE userstory SET `story_type`=?, `story_text`=? WHERE `user_id` = ?";

    const values = [
      req.body.story_type,
      req.body.story_text
    ];

    db.query(q, [...values, postId], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.json("Post has been updated.");
    });
};
