import bodyParser from "body-parser";
import express from "express";
import login from "./routes/login.js";
import register from "./routes/register.js";
import forgotpassword from "./routes/forgotpassword.js";
import admin_dashboard from "./routes/admin_dashboard.js";
import admin from "./routes/admin.js";
import dashboard from "./routes/dashboard.js";
import editprofile from "./routes/editprofile.js";
import survey from "./routes/survey.js";
import survey_response from "./routes/survey_response.js";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.use("/", login);
app.use("/register",register);
app.use("/forgotpassword",forgotpassword.router1);
app.use("/resetpassword", forgotpassword.router2);
app.use("/updatepassword", forgotpassword.router3);
app.use("/admin_dashboard", admin_dashboard);
app.use("/admin", admin);
app.use("/dashboard",dashboard);
app.use("/editprofile",editprofile);
app.use("/survey", survey);
app.use("/survey_response", survey_response);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
