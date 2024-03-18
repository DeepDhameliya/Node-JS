import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { compare } from 'bcrypt';
import db from '../config/db.js'; // Create this file to configure your PostgreSQL database

function initializePassport(passport) {
    const authenticateUser = async(email, password, cb) => {
        try {
            const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);

            if (result.rows.length > 0) {
                const user = result.rows[0];

                // Compare hashed password
                if (await compare(password, user.password)) {
                    return cb(null, user);
                } else {
                    return cb(null, false, { message: 'Incorrect password' });
                }
            } else {
                return  cb(null, false, { message: 'User not found' });
            }
        } catch (error) {
            return cb(error);
        }
    }

    passport.use("local",new LocalStrategy({ usernameField: 'email' }, authenticateUser));

    passport.serializeUser((user, done) => {
        cb(null, user.id);
    });

    passport.deserializeUser(async(id, done) => {
        try {
            const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
            const user = result.rows[0];
            cb(null, user);
        } catch (error) {
            cb(error);
        }
    });
}

export default initializePassport;