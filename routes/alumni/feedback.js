import express from "express";
import {
  addfeedback
  
} from "../../controllers/alumni/feedbackController.js";

const router = express.Router()


router.post("/", addfeedback);