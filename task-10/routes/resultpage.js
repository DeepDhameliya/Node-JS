import { Router } from "express";
import nodemailer from "nodemailer";
import db from "../config/db.js";

const router = new Router();

router.get("/", async (req, res) => {
  const alertMessage = req.query.alert;
  const answerData = await db.query(
    `SELECT questions.correct_answer,user_answers.selected_option FROM questions JOIN user_answers ON questions.question= user_answers.question WHERE userid=${req.query.userid};`
  );
  let answers = answerData.rows;
  let score = 0;

  // Loop through each answer
  answers.forEach((answer) => {
    // Check if the answer_text matches the correct_answer
    if (answer.selected_option === answer.correct_answer) {
      // Increase the score if the answer is correct
      score++;
    }
  });
  const questions = await db.query(
    `SELECT questions.question,questions.correct_answer,user_answers.selected_option FROM questions JOIN user_answers ON questions.question = user_answers.question WHERE userid=${req.query.userid};`
  );

  let totalQuestions = await db.query("SELECT question FROM questions");
  await db.query("UPDATE users  SET score=$1 WHERE user_id=$2;", [
    score,
    req.query.userid,
  ]);

  res.render("resultpage.ejs", {
    questions: questions.rows,
    score,
    totalQuestions: totalQuestions.rowCount,
    userid: req.query.userid,
    alertMessage,
  });
});

router.post("/", async (req, res) => {
  try {
    let userEmail = await db.query(
      `SELECT email FROM users WHERE user_id=${req.body.userid}`
    );
    let email = userEmail.rows[0].email;
    console.log(email);
    const transporter = nodemailer.createTransport({
      service: "gmail",
      secure: false,
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const resultlink = `http://localhost:3000/emailResult?userid=${req.body.userid}`;

    const mailOptions = {
      from: process.env.ADMIN_EMAIL,
      to: email,
      subject: "Quiz Result",
      text: `Hello \n\nClick the following link to view your quiz result:\n${resultlink}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });
    res.redirect(
      `/result-page?userid=${req.body.userid}&alert=Result has been sent to the user!`
    );
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

export default router;
