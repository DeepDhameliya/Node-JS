import { Router } from "express";
import bcrypt from "bcrypt";
import db from "../config/db.js";

const router = new Router();

router.get("/", async (req, res) => {
    let quizData = await db.query("SELECT * FROM questions;");
    console.log(req.query);
    res.render("quiz.ejs", {
      questions: quizData.rows,
      userid: req.query.userid,
    });
  });

  router.post("/", async (req,res)=>{
try {
    console.log(req.body);
    let userid = req.body.userid;
    let userData = req.body;
    delete userData.userid;

    for (const [key, value] of Object.entries(userData)) {
        let query =
          "INSERT INTO user_answers (userid, question, selected_option) VALUES ($1,$2,$3) ON CONFLICT (userid, question) DO UPDATE SET selected_option= $3;";
        const values = [userid, key, value];//values for one question
        await db.query(query, values);//it will give all question with answer
      } 
      const answerData = await db.query(
        `SELECT questions.correct_answer,user_answers.selected_option FROM questions JOIN user_answers ON questions.question = user_answers.question  WHERE userid=${userid};`
      );
      let answers = answerData.rows;
      let score = 0;
  
      // Loop through each answer
      await answers.forEach((answer) => {
        // Check if the answer_text matches the correct_answer
        if (answer.selected_option === answer.correct_answer) {
          // Increase the score if the answer is correct
          score++;
        }
      });
      await db.query("UPDATE users  SET score=$1 WHERE user_id=$2;", [
        score,
        userid,
      ]);
  
      res.redirect(
        `/user_panel?userid=${userid}&alert=Quiz is compeleted and thank you for taking the Quiz!!!`
      );
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  });

  export default router;