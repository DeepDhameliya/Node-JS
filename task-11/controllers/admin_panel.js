import bcrypt from "bcrypt";
import db from "../config/db.js";

const adminlogin = async(req, res) => {
    const alertMessage = req.query.alert;
    let user = await db.query("SELECT * FROM users");
    res.render("admin_panel.ejs", { usersData : user.rows});
};

// const authenticateUser = async(req, res) => {
//     try {
//         let authenticationData = await db.query(
//             "SELECT * FROM users WHERE email=$1", [req.body.email]
//         );
//         console.log(authenticationData.rows[0]);
//         if (authenticationData.rowCount == "") {
//             res.redirect(`/?alert=Inavlid user register yourself first`);
//         } else if (bcrypt.compareSync(req.body.password, authenticationData.rows[0].password))
//             {
//             res.redirect(`/timing?userid=${authenticationData.rows[0].user_id}`);
//         } else {
//             res.redirect(`/?alert=Wrong password`);
//         }
//     } catch (err) {
//         console.error(err);
//         res.status(500).send("Internal Server Error");
//     }
// };

export { adminlogin };