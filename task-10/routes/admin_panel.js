import { Router } from "express";
import db from "../config/db.js";

const router = new Router();

router.get("/", async (req, res) => {
  const alertMessage = req.query.alert;
  res.render("admin_panel.ejs", { alertMessage });
});

router.post("/", async (req, res) => {
    try {
        const { question, options, correctAnswer } = req.body;

    await db.query(
      "INSERT INTO questions (question, options, correct_answer) VALUES ($1, $2, $3);",
      [question, options, correctAnswer]
    );
      res.redirect(`/admin_panel?alert=Question added successfully!`);
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  });

export default router;