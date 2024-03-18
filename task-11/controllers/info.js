import bcrypt from "bcrypt";
import db from "../config/db.js";

const info = async(req, res) => {
    const alertMessage = req.query.alert;
    //const dates =req.query.date;
    const users= await db.query("SELECT t.currenttime,t.breaktime,TO_CHAR(t.date,'DD-MM-YYYY,Day'),u.first_name,u.last_name,u.email FROM timing t join users u on t.user_id=u.user_id WHERE u.user_id=$1",[req.query.userid]);// and t.date=$2,dates 
    res.render("info.ejs", { alertMessage, user:users.rows });
};

export { info };