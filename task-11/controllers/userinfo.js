import bcrypt from "bcrypt";
import db from "../config/db.js";

const userinfo = async(req, res) => {
    let users = await db.query("SELECT * FROM users");
    const alertMessage = req.query.alert;
    res.render("userinfo.ejs",{userData:users.rows,alertMessage});
};

const userinfopost=async (req,res)=>{
try {
    
}catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
}

};

export {userinfo,userinfopost}