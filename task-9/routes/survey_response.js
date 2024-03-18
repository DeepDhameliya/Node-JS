import { Router } from "express";
import db from "../config/db.js";

const router = new Router();

router.get("/", async (req, res) => {
  console.log(req.query);
  let user = await db.query(
    `SELECT u.userid, u.fname, sq.question, sr.response FROM users u JOIN survey_questions sq ON u.userid = u.userid LEFT JOIN survey_responses sr ON sq.id = sr.question_id AND u.userid = sr.user_id WHERE u.userid = ${req.query.userid};`
  );
  let feeback = await db.query(
    `SELECT surveyresponse,suggestion,email FROM feedback WHERE userid=${req.query.userid}`
  );
  res.render("survey_response.ejs", {
    data: user.rows,
    feedback: feeback.rows[0],
  });
});

export default router;
