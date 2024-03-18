import { Router } from "express";
import { registerget,registerpost } from "../controllers/register.js";

const  router = Router();

router.route("/").get(registerget).post(registerpost);

export default router;