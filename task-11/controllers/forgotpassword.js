import bcrypt from "bcrypt";
import db from "../config/db.js";
import nodemailer from "nodemailer";

const saltno=10;

const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: false,
    auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    },
});

const forgotget = (req, res) => {
    res.render('forgotpassword.ejs', { showResetForm: false, error: null });
}

const emailpost = async (req, res) => {
    const email = req.body.email;
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
        res.render('forgotpassword.ejs', { showResetForm: false, error: 'Email not found' });
    } else {
        const randomString = generateRandomString();
        await db.query('UPDATE users SET tokenno= $1 WHERE email = $2',
            [randomString,email]);
        const mailOptions = {
            from: process.env.ADMIN_EMAIL,
            to: email,
            subject: 'Password Reset',
            text: `To reset your password, enter this token number ${randomString}`,
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
        // Email found, proceed to the next step (show reset password form)
        res.render('forgotpassword.ejs', { showResetForm: true, email, error: null });
    }
}

function generateRandomString() {
    const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    const getRandomSymbol = () => {
      const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
      return symbols.charAt(getRandomInt(0, symbols.length - 1));
    };
  
    const getRandomLetter = () => {
      const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
      return letters.charAt(getRandomInt(0, letters.length - 1));
    };
  
    const integerPart = getRandomInt(0, 9);
    const symbolPart = getRandomSymbol();
    const letterPart = Array.from({ length: 4 }, () => getRandomLetter()).join('');
  
    return `${integerPart}${symbolPart}${letterPart}`;
  }
  
  // Generate a random string
 


const passwordpost = async (req, res) => {
    const email = req.body.email;
    const newPassword = req.body.newPassword;
    const confirmPassword = req.body.confirmPassword;
    const token = req.body.resetToken;
    // Check if passwords match
    const check = await db.query("select tokenno from users where email=$1", [email]);
    const equal = check.rows[0];
    console.log(equal);
    if (equal.tokenno == token && newPassword == confirmPassword) {
        try {
            const hashedPassword = await bcrypt.hash(newPassword, saltno);
            const updateResult = await db.query('UPDATE users SET password = $1 WHERE email = $2', [hashedPassword, email]);

            if (updateResult.rowCount > 0) {
                // Password updated successfully, you can redirect to a login page or send a success message
                res.redirect("/?alert=password change succesfully");
            } else {
                // No rows were updated, indicate that the email wasn't found
                return res.render('forgotpassword.ejs', { showResetForm: false, error: 'Email not found' });
            }
        } catch (error) {
            console.error('Error updating password:', error);
            return res.status(500).send('Internal server error');
        }

    }
    else {
        return res.render('forgotpassword.ejs', { showResetForm: false, error: 'token not' });
    }
    if (newPassword !== confirmPassword) {
        return res.render('forgotpassword.ejs', { showResetForm: true, email, error: 'Passwords do not match' });
    }
}

export {forgotget,emailpost,passwordpost}