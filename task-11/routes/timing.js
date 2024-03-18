import { Router } from "express";       
import {timingget,timingpost} from "../controllers/timing.js";

const router = new Router();

router.route("/").get(timingget).post(timingpost);

export default router;