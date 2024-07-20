import { Router } from "express";

import userRouter from "./routes/user.routes";
import authRouter from "./routes/auth.routes";
import roleRouter from "./routes/role.routes";
import communityRouter from "./routes/community.routes";
import postRouter from "./routes/post.routes";
import chatRouter from "./routes/chat.routes";


const router: Router = Router();

router.use("/role", roleRouter);
router.use("/user", userRouter);
router.use("/auth", authRouter);
router.use("/community", communityRouter);
router.use("/post", postRouter);
router.use("/chat", chatRouter);


export default router;
