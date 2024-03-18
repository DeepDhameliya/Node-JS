import express from "express";
import bodyParser from "body-parser";
import login from "./routes/login.js";
import register from "./routes/register.js";
import userpassword from "./routes/forgotpassword.js";
import admin from "./routes/admin_panel.js";
import user from "./routes/user_panel.js";
import quiz from "./routes/quiz.js";
import result from "./routes/userresult.js";
import resultpage from "./routes/resultpage.js";
import email from  "./routes/emailResult.js";

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
app.use("/admin_panel",admin);
app.use("/user_panel",user);
app.use("/quiz",quiz);
app.use("/viewUsersResult",result);
app.use("/result-page",resultpage);
app.use("/emailResult",email);

app.get("/favicon.ico", (req, res) => {
  res.status(204).end(); // Respond with No Content status code
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
