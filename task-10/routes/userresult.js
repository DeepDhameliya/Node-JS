import { Router } from "express";
import db from "../config/db.js";

const router = new Router();

router.get("/", async (req, res) => {
  let userData = await db.query("SELECT * FROM  users");
  let totalUser = userData.rowCount;
  let Questions = await db.query("SELECT question FROM questions");
  let totalQuestions = Questions.rowCount;
  let totalscore = totalUser * totalQuestions;
  let score = await db.query("SELECT SUM(score) FROM users;");
  console.log(score.rows[0].sum);
  res.render("userresult.ejs", {
    userData: userData.rows,
    correct: score.rows[0].sum,
    incorrect: totalscore - score.rows[0].sum,
  });
});

router.post("/", async (req, res) => {
  try {
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

export default router;
