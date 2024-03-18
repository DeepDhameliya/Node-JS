import { Router } from "express";
import { info } from "../controllers/info.js";

const router = new Router();

router.route("/").get(info);

export default router;
