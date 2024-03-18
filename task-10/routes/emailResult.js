import { Router } from "express";
import bcrypt from "bcrypt";
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

    res.render("emailResult.ejs", {
      questions: questions.rows,
      score,
      totalQuestions: totalQuestions.rowCount,
      userid: req.query.userid,
      alertMessage,
    });
  });

export default router;
