import * as post from "../controllers/posts.controller";
import express from "express";
import { upload } from "../multer";

const postRouter: express.Router = express.Router();

//post
postRouter.post("/createPost", upload, post.createPost);
postRouter.post("/comment", post.comment);
postRouter.post("/responseComment", post.responseComment);



//get
postRouter.get("/getAllPostByCommunity/:community", post.getAllPostByCommunity);
postRouter.get("/userProfile/_id", post.userProfile);
postRouter.get("/timeLine/_id", post.timeLine);


//put
postRouter.put("/updatePost/:id", post.updatePost);
postRouter.put("/like/_id", post.like);


//delete
postRouter.delete("/deletePost/:id", post.deletePost);



export default postRouter;
