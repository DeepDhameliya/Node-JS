import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import env from "dotenv";
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
// import { chownSync } from "fs";
import nodemailer from "nodemailer";
import moment from "moment";


const __filename = fileURLToPath(
    import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;
const saltRounds = 10;

env.config();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

const db = new pg.Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
});
db.connect();

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
      cb(null, "c:/nodejs/personal project/task-8/public/images");
  },
  filename: function(req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + ".jpg");
  }
});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  secure: false,
  auth: {
      user: process.env.ADMIN_EMAIL,
      pass: process.env.EMAIL_PASSWORD,
  },
});

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

const upload = multer({ storage })

app.get("/", (req, res) => {
    res.render("home.ejs");
});

app.get("/register", (req, res) => {
    const alertMessage = req.query.alert;

    // Render your login page and pass the alert message to the template
    res.render('register.ejs', { alertMessage });
});

app.get("/addUser", (req, res) => {
    res.render("register.ejs");
});

app.get('/forgotpassword', (req, res) => {
  res.render('forgotpassword.ejs', { showResetForm: false, error: null });
});

app.post('/resetpassword', async (req, res) => {
  const email = req.body.email;
  const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);

  if (result.rows.length === 0) {
      res.render('forgotpassword.ejs', { showResetForm: false, error: 'Email not found' });
  } else {
      const randomString = generateRandomString();
      await db.query('UPDATE users SET token_no= $1 WHERE email = $2',
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
});


app.post('/updatepassword', async (req, res) => {
  const email = req.body.email;
  const newPassword = req.body.newPassword;
  const confirmPassword = req.body.confirmPassword;
  const token = req.body.resetToken;
  // Check if passwords match
  const check = await db.query("select token_no from users where email=$1", [email]);
  const equal = check.rows[0];

  if (equal.token_no == token && newPassword == confirmPassword) {
      try {
          const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
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
});

app.post("/register", upload.single('profileImage'), async(req, res) => {
    const firstName = req.body.firstName;
    const middleName = req.body.middleName;
    const lastName = req.body.lastName;
    const dob = req.body.dob;
    const mobileNumber = req.body.mobileNumber;
    const email = req.body.email;
    const password = req.body.password;
    const profileImage = req.file.filename;
    console.log(req.file)

    const hashpassword = bcrypt.hashSync(password, saltRounds);

    try {
        const checkResult = await db.query("SELECT * FROM users WHERE email=$1", [email]);
        if (checkResult.rows.length > 0) {
            res.redirect('/login?alert=user already exists');

        } else {
            const result = await db.query("INSERT INTO users (firstname, middlename, lastname, dob, mobilenumber, email, password, profileimage) VALUES ($1,$2,$3,$4,$5,$6,$7,$8);", [firstName, middleName, lastName, dob, mobileNumber, email, hashpassword, profileImage]);
            res.render("login.ejs");
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});

app.get("/login", (req, res) => {
    const alertMessage = req.query.alert;

    // Render your login page and pass the alert message to the template
    res.render('login.ejs', { alertMessage });
})

app.post("/login", async(req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    try {
        const result = await db.query("SELECT * FROM users WHERE email = $1", [
            email,
        ]);
        if (result.rows.length > 0) {
            const user = result.rows[0];
            const hash = user.password;
            if (bcrypt.compareSync(password, hash)) {
                sendEmail(email);
                const result = await db.query("SELECT firstname,middlename,lastname,TO_CHAR(dob,'DD-MM-YYYY,Day'),mobilenumber,email,profileimage FROM users");
                const users = result.rows;
                // Render the HTML dashboard with user data
                res.render('dashboard.ejs', { users });
            } else {
                res.redirect('/login?alert=invalid Password try again');
            }
        } else {
            res.redirect('/register?alert=user not found you need to register first');

        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});

function sendEmail(email) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        secure: false,
        auth: {
            user: process.env.ADMIN_EMAIL,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.ADMIN_EMAIL,
        to: email,
        subject: 'Login Successful',
        text: 'You have successfully logged in.',
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
}


app.post("/update", async(req, res) => {
    // console.log(req.body.userId)
    const result = await db.query("SELECT * FROM users WHERE userid=$1", [req.body.userId]);
    const user = result.rows[0];
    let date = moment(user.dob).utc().format('YYYY-MM-DD')
    res.render("update.ejs", { user, date })
})

app.post("/updateUser", upload.single('profileImage'), async(req, res) => {
    let data = req.body;
    if (data.profileImage == "") {
        delete data.profileImage;
    } else {
        data.profileImage = req.file.filename;
    }
    const userId = req.body.userId;
    const updateFields = data; // User's input fields
    try {
        const queryParameters = [];
        const setClause = Object.keys(updateFields).map((key, index) => {
            queryParameters.push(updateFields[key]);
            return `${key} = $${index + 1}`;
        }).join(', ');

        await db.query(`UPDATE users SET ${setClause} WHERE userid = $${Object.keys(updateFields).length + 1}`, [...queryParameters, userId]);
        const result = await db.query('SELECT * FROM users');
        const users = result.rows;
        res.render('dashboard.ejs', { users });

    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).send('Internal Server Error');
    }

})

app.post("/delete", async(req, res) => {
    await db.query("DELETE FROM users WHERE userid = $1;", [req.body.userId]);
    const result = await db.query('SELECT * FROM users');
    const users = result.rows;
    res.render('dashboard.ejs', { users });

})

app.post("/logout", (req, res) => {
    res.redirect("/")
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});