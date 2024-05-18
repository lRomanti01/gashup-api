import { Router } from "express";

import userRouter from "./routes/user.routes";
import authRouter from "./routes/auth.routes";
import roleRouter from "./routes/role.routes";

const router: Router = Router();

router.use("/role", roleRouter);
router.use("/user", userRouter);
router.use("/auth", authRouter);

export default router;
