import * as post from "../controllers/posts.controller";
import express from "express";
import { upload } from "../multer";

const postRouter: express.Router = express.Router();

//post
postRouter.post("/createPost", upload.array('img'), post.createPost);

//get
postRouter.get("/getAllPostByCommunity/:community", post.getAllPostByCommunity);

//put
postRouter.put("/updatePost/:id", post.updatePost);

//delete
postRouter.delete("/deletePost/:id", post.deletePost);


export default postRouter;
