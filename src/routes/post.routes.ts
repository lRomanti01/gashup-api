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
postRouter.get("/getPostById/:_id", post.getPostById);
postRouter.get("/userProfile/:_id", post.userProfile);
postRouter.get("/timeLine/:_id", post.timeLine);
postRouter.get("/getCommentsByPost/:_id", post.getCommentsByPost);
postRouter.get("/getSubCommentsByComment/:_id", post.getSubCommentsByComment);

//put
postRouter.put("/updatePost/:id", post.updatePost);
postRouter.put("/likePost/:_id", post.likePost);
postRouter.put("/likeComment/:_id", post.likeComment);

//delete
postRouter.delete("/deletePost/:_id", post.deletePost);



export default postRouter;
