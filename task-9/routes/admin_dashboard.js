import { Router } from "express";
import db from "../config/db.js";

const router = new Router();

router.get("/", async (req, res) => {
  let user = await db.query("SELECT * FROM users");
  res.render("admin_dashboard.ejs", { user: user.rows });
});

export default router;
