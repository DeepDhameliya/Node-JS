import { Router } from "express";
import { loginpage, authenticateUser } from "../controllers/login.js";
import initializePassport from "../config/passport.js";
import passport from "passport";
import { Strategy } from "passport-local";

const router = new Router();

router.route("/").get(loginpage).post(authenticateUser);

export default router;
