import { Router } from "express";
import { adminlogin } from "../controllers/admin_panel.js";

const router=new Router();

router.route("/").get(adminlogin);

export default router;