import { Router } from "express";
import db from "../config/db.js";


const router = new Router();

router.get("/", async (req, res) => {
  try {
    let questionPerPage = 3;
    let userid = req.query.userid;

    let currentPage = req.query.page;
    const count = await db.query("SELECT * FROM survey_questions ; ");
    let totalPages = Math.ceil(count.rowCount / questionPerPage) + 1;

    const result = await db.query(
      `SELECT * FROM survey_questions ORDER BY id  LIMIT ${questionPerPage} OFFSET ${
        (currentPage - 1) * questionPerPage
      };`
    );
    const questions = result.rows;
    res.render("survey.ejs", { questions, currentPage, totalPages, userid });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/", async (req, res) => {
  const surveyData = req.body;
  console.log(surveyData);
  if (!surveyData.lastpage == "") {
    // User's input fields
    try {
      const values = [
        surveyData.lastpage,
        surveyData.surveyResponse,
        surveyData.suggestion,
        surveyData.email,
      ];
      await db.query(
        "INSERT INTO feedback (userid, surveyResponse, suggestion, email) VALUES ($1, $2, $3, $4) ON CONFLICT (userid) DO UPDATE SET surveyResponse = EXCLUDED.surveyResponse,suggestion = EXCLUDED.suggestion,email = EXCLUDED.email;",
        values
      );
      res.status(200);
      res.redirect("/?alert=Survey has been completed thank you");
    } catch (error) {
      console.error("Error saving survey data:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    let userid = req.body.userid;
    delete surveyData.userid;
    try {
      // Insert survey data into the database
      const query = `INSERT INTO survey_responses (user_id, question_id, response) VALUES ($1, $2, $3) ON CONFLICT (user_id,question_id) DO UPDATE SET response = EXCLUDED.response;`;

      for (const questionId in surveyData) {
        const response = Array.isArray(surveyData[questionId])
          ? surveyData[questionId].join(", ")
          : surveyData[questionId];
          

        await db.query(query, [userid, parseInt(questionId), response]);
      }
      res.status(200);
    } catch (error) {
      console.error("Error saving survey data:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

export default router;
