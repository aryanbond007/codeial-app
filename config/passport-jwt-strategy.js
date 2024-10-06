const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

const User = require('../models/user');

let opts = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.jwtkey
}


passport.use(
    new JWTStrategy(opts, async (jwtPayLoad, done) => {
        try {
            // someone find out key and make fake token sowe are use here id
            //id also can found by someone but if user details including token also is correct but id is not then user is not able to loging 

            const user = await User.findById(jwtPayLoad._id);
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        } catch (error) {
            return done(error, false);
        }
    })

)

module.exports = passport;

