import bcrypt from "bcrypt";
import db from "../config/db.js";

const saltno=10;

const registerget = async (req,res)=>{
    const alertMessage = req.query.alert;
    res.render("register.ejs", { alertMessage });
}

const registerpost = async (req, res) => {
    try {
      const hash = bcrypt.hashSync(req.body.password, saltno);
      console.log(req.body.fname);
      await db.query(
        "INSERT INTO users (first_name,last_name, mobile_number, email, password) VALUES ($1,$2,$3,$4,$5);",
        [req.body.fname,req.body.lname, req.body.mobileNumber, req.body.email, hash]
      );
      res.redirect(
        "/?alert=Registeration has been done successfully and now you can login with your Credentials!!!"
      );
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  }

  export {registerget,registerpost}