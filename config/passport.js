// CODE BY BRAD TRAVERSY (with extra comments by me)
// ref: https://github.com/bradtraversy/node_passport_login
// passport-local docs: http://www.passportjs.org/packages/passport-local/

const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

// Load User model
const User = require('../models/User');

// This function will evaluate with the passport module defined in app.js passed in as an argument
module.exports = function(passport) {
  passport.use(

    // This will take a verify callback 
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      // Match user
      User.findOne({
        email: email
      }).then(user => {
        if (!user) {
          return done(null, false, { message: 'That email is not registered' });
        }

        // Match password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: 'Password incorrect' });
          }
        });
      });
    })
  );

  // This will save user information into the current session.
  // The user object can be accessed with req.user
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
};