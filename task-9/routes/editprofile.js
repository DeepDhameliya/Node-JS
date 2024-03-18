import { Router } from "express";
import db from "../config/db.js";
import bcrypt from "bcrypt";

const router = new Router();
const saltno = 10;

router.get("/", async (req, res) => {
    
    res.render("editprofile.ejs",{ userid: req.query.userid });
});

router.post("/", async (req, res) => {
    try {
        const { fname, mname, lname,password} = req.body;
        const pass = await bcrypt.hash(password, saltno);
        await db.query("update users set fname=$1,mname=$2,lname=$3,password=$4 where userid=$5", [fname, mname, lname, pass, req.body.userid]);
        res.redirect(`/dashboard?userId=${req.body.userid}&alert=profile has been updated`);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }

});

export default router;