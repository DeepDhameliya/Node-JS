import express from "express";
import bodyParser from "body-parser";
import login from "./routes/login.js";
import register from "./routes/register.js";
import userpassword from "./routes/forgotpassword.js";
import timing from "./routes/timing.js";
import admin from "./routes/admin_panel.js";
import userinfo from "./routes/userinfo.js";
import info from "./routes/info.js";
import passport from "passport";
import session from "express-session";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));


app.use("/", login);
app.use("/register",register);
app.use("/forgotpassword",userpassword.router1);
app.use("/resetpassword", userpassword.router2);
app.use("/updatepassword", userpassword.router3);
app.use("/timing",timing);
app.use("/admin",admin);
app.use("/userinfo",userinfo);
app.use("/info",info);

// app.get("/favicon.ico", (req, res) => {
//     res.status(204).end();
// });

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});