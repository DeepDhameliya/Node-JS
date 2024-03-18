import { Router } from "express";
import {userinfo,userinfopost} from "../controllers/userinfo.js";

const router= new Router();

router.route("/").get(userinfo).post(userinfopost);

export  default router;