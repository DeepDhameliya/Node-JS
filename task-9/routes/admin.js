import { Router } from 'express';
import db from "../config/db.js";

const router = new Router();


router.get("/", async(req, res) => {
    const alertMessage = req.query.alert;
    res.render("admin.ejs", { alertMessage });
});

router.post('/', async(req, res) => {
    console.log(req.body);
    try {
        const { question, options, type } = req.body;
        console.log(options);
        const query = 'INSERT INTO survey_questions (question, options, type) VALUES ($1, $2, $3)';
        db.query(query, [question, options, type], (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error adding question');
            } else {
                res.redirect('/admin?alert=Question has been added');
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
})

export default router;