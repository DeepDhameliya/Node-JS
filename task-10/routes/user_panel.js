import { Router } from "express";
import db from "../config/db.js";

const router = new Router();

router.get("/", async (req, res) => {
    console.log(req.query.userid);
    const userdata = await db.query(
      `SELECT * FROM users WHERE user_id=${req.query.userid}`
    );
    console.log(userdata.rows);
    res.render("user_panel.ejs", { user: userdata.rows[0] });
  });
export default router;