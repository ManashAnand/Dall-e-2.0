import express from "express";
import * as dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import PostSchema from "../mongodb/models/post.js";

dotenv.config();

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.NAME,
  api_key: process.env.APIKEY,
  api_secret: process.env.APISECRET,
});

// GET ALL POSTS
router.route("/").get(async (req, res) => {
  try {
    const posts = await PostSchema.find({});

    res.status(200).json({ success: true, data: posts });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
});

// CREATE A POST
router.route("/").post(async (req, res) => {
  try {
    const { name, prompt, photo } = req.body;
    // console.log(process.env.NAME+" "+process.env.APIKEY+" "+process.env.APISECRET)
    const photoUrl = await cloudinary.uploader.upload(photo);

    const newPost = await PostSchema.create({
        name,
        prompt,
        photo: photoUrl.url,
      });

    res.status(201).json({ success: true, data: newPost });
  } catch (error) {
    res.status(501).json({ success: false, message: error });
  }
});

export default router;
