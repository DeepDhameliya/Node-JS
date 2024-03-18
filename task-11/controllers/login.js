import bcrypt from "bcrypt";
import db from "../config/db.js";

const loginpage = async(req, res) => {
    const alertMessage = req.query.alert;
    res.render("login.ejs", { alertMessage });
};

const authenticateUser = async(req, res) => {
    try {
        if (
            req.body.password == process.env.ADMIN_PASS &&
            req.body.email == process.env.ADMIN_EMAIL
          ) {
            res.redirect(`/admin?alert=Welcome ADMIN`);
          } else {
        let authenticationData = await db.query(
            "SELECT * FROM users WHERE email=$1", [req.body.email]
        );
        console.log(authenticationData.rows[0]);
        if (authenticationData.rowCount == "") {
            res.redirect(`/?alert=Inavlid user register yourself first`);
        } else if (bcrypt.compareSync(req.body.password, authenticationData.rows[0].password))
            {
            res.redirect(`/timing?userid=${authenticationData.rows[0].user_id}`);
        } else {
            res.redirect(`/?alert=Wrong password`);
        }
    }
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
};

export { loginpage, authenticateUser };