import { Router } from "express";
const router = Router();

import emailFunction from "../controllers/routerForgetPassword/sendEmail.js";
import passwordFunction from "../controllers/routerForgetPassword/verifyPassword.js";

router.post("/email", emailFunction);

router.post("/password", passwordFunction);

export default router;
