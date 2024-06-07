import { Router } from "express";

import userRouter from "./routes/user.routes";
import authRouter from "./routes/auth.routes";
import roleRouter from "./routes/role.routes";
import communityRouter from "./routes/community.routes";


const router: Router = Router();

router.use("/role", roleRouter);
router.use("/user", userRouter);
router.use("/auth", authRouter);
router.use("/community", communityRouter);


export default router;
