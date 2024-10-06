const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');


passport.use(new googleStrategy({
    clientID: "679397652296-lvvi4i2j6rone7rb5gmbqkubemglnkmg.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "http://localhost:8000/users/auth/google/callback",
},
async function(accessToken, refresh, profile, done){
    // User.findOne({email: profile.emails[0].value}).exec(function(err, user){
        // if(err){console.log('error in google-strategy-passport', err); return;}

        console.log(profile);
        try {
            const user = await User.findOne({ email: profile.emails[0].value }).exec();
            //profile.emails give all emails that user contains
            
         //    console.log(profile);
            
            if (user) {
             // if user found set it to user as req.user
                return done(null, user);
            } else {
             // if not found,create user and set it to new user or req.user
                const newUser = await User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex')
                });
 
                return done(null, newUser);
            }
        } catch (err) {
            console.log("error in google strategy passport", err);
            return done(err);
        }
 
 
     }
 ))
 
 module.exports = passport;

//         if(user){
//             return done(null, user);
//         }else{
//             User.create({
//                 name: profile.displayName,
//                 email: profile.emails[0].value,
//                 password: crypto.randomBytes(20).toString('hex')
//             })
//         }
//     })
// }
// ))