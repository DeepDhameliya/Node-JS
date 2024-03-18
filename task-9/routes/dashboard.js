import { Router } from 'express';
import db from "../config/db.js";

const router = new Router();

router.get("/", async(req, res) => {
    // console.log(req.query.userId);
    const alertMessage = req.query.alert;
    let result = await db.query("SELECT * FROM users  WHERE userid=$1;", [req.query.userId]);
    res.render("dashboard.ejs", { user: result.rows[0], alert: alertMessage })
});


export default router;