import { Router } from "express";
import bcrypt from "bcrypt";
import db from "../config/db.js";

const router = new Router();

router.get("/", async (req, res) => {
  const alertMessage = req.query.alert;
  res.render("login.ejs", { alertMessage });
});

router.post("/", async (req, res) => {
  try {
    if (
      req.body.password == process.env.ADMIN_PASS &&
      req.body.email == process.env.ADMIN_EMAIL
    ) {
      res.redirect(`/admin_panel?alert=Welcome ADMIN`);
    } else {
      let userid = await db.query("SELECT user_id FROM users WHERE email=$1", [
        req.body.email,
      ]);
      res.redirect(`/user_panel?userid=${userid.rows[0].user_id}`);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

export default router;
