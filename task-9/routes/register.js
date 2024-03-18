import { Router } from 'express';
import db from "../config/db.js";
import bcrypt from "bcrypt";

const router = new Router();
const saltRounds = 10;


router.get("/", async(req, res) => {
    res.render("register.ejs");
});

router.post('/', async(req, res) => {

    const firstName = req.body.fname;
    const middleName = req.body.mname;
    const lastName = req.body.lname;
    const mobileNumber = req.body.mobileNumber;
    const email = req.body.email;
    const password = req.body.password;

    const hashpassword = bcrypt.hashSync(password, saltRounds);

    try {
        const checkResult = await db.query("SELECT * FROM users WHERE email=$1", [email]);
        if (checkResult.rows.length > 0) {
            res.redirect('/?alert=user already exists');

        } else {
            await db.query("INSERT INTO users (fname, mname, lname, mobilenumber, email, password) VALUES ($1,$2,$3,$4,$5,$6);", [firstName, middleName, lastName, mobileNumber, email, hashpassword]);
            res.redirect('/?alert=Registration has been done now you can login with your credentials');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }

})

export default router;