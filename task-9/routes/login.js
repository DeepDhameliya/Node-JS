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
      res.redirect(`/admin?alert=Welcome ADMIN`);
    } else {
      let result = await db.query("SELECT * FROM users WHERE email=$1", [
        req.body.email,
      ]);
      if (result.rows.length === 0) {
        res.redirect("/?alert=user not found you need to register first");
      } else if (
        bcrypt.compareSync(req.body.password, result.rows[0].password)
      ) {
        res.redirect(`/dashboard?userId=${result.rows[0].userid}`);
      } else {
        res.redirect("/?alert=Password invalid try again");
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

export default router;
