import db from "../config/db.js";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: false,
    auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    },
});

const timingget = async(req,res)=>{
    res.render("timing.ejs", { userid: req.query.userid });
}

const timingpost = async (req, res) => {
    try {
        console.log(req.body);
        await db.query("INSERT INTO timing (user_id, currenttime, breaktime, date) VALUES ($1, $2, $3, $4)", [req.body.userid, req.body.currentTime, req.body.breakTime, req.body.currentDate]);

        // Retrieve email for the given user_id and date
        const emailQuery = `SELECT users.email FROM timing JOIN users ON timing.user_id = users.user_id WHERE timing.date = $1 AND timing.user_id = $2`;

        const emailResult = await db.query(emailQuery, [req.body.currentDate, req.body.userid]);

        const userEmail = emailResult.rows[0]?.email;
        console.log(userEmail);
        const mailOptions = {
            from: process.env.ADMIN_EMAIL,
            to: userEmail,
            subject: 'your timing',
            text: `Just a quick note to say thanks for your hard work. Your dedication during work hours ${req.body.currentTime} and break hours ${req.body.breakTime} on Date:${req.body.currentDate} `,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                res.send('Error sending reset email');
            } else {
                console.log('Reset email sent:', info.response);
                res.send('Reset email sent. Check your inbox.');
            }
        });

        res.redirect("/?alert=Your time has been stored");
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};


export {timingget,timingpost}