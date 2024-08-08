import * as post from "../controllers/posts.controller";
import express from "express";
import { upload } from "../multer";

const postRouter: express.Router = express.Router();

//post
postRouter.post("/createPost", upload, post.createPost);
postRouter.post("/comment", post.comment);
postRouter.post("/responseComment", post.responseComment);//documentar


//get
postRouter.get("/getAllPostByCommunity/:community", post.getAllPostByCommunity);
postRouter.get("/getPostById/:_id", post.getPostById);
postRouter.get("/userProfile/:_id", post.userProfile);
postRouter.get("/timeLine", post.timeLine);
postRouter.get("/getCommentsByPost/:_id", post.getCommentsByPost);
postRouter.get("/getSubCommentsByComment/:_id", post.getSubCommentsByComment);
postRouter.get("/popularPost/", post.popularPost);



//put
postRouter.put("/updatePost/:_id", post.updatePost);
postRouter.put("/updateComment/:commentId", post.updateComment);//documentar
postRouter.put("/updateResponseComment/:responseCommentId", post.updateResponseComment);//documentar
postRouter.put("/likePost/:_id", post.likePost);
postRouter.put("/likeComment/:_id", post.likeComment);
postRouter.put("/likeSubComment/:_id", post.likeSubComment);


//delete
postRouter.delete("/deletePost/:_id", post.deletePost);
postRouter.delete("/deleteComment/:commentId", post.deleteComment);//documentar
postRouter.delete("/deleteResponseComment/:responseCommentId", post.deleteResponseComment);//documentar





export default postRouter;
