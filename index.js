//imports
import express from "express";
import cors from "cors";

import { db } from './model/alumni_space_db.js';

//Routes
import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/alumni/posts.js";


const app = express();


app.use(cors({
  origin: '*',
  methods: ['GET', 'PUT', 'DELETE', 'PATCH', 'POST'],
  allowedHeaders: 'Content-Type, Authorization, Origin, X-Requested-With, Accept'
}));
app.use(express.json())



app.use("/auth", authRoutes);

app.use("/alumni/posts", postRoutes);



  
db.connect(function(err) {
    if (err) throw err;
    console.log("DB Connected!");
  });


  
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});