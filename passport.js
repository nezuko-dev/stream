// passport.init.js
const User = require("./src/models/user");
const passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
  User.findById(id)
    .select("-password")
    .then((user) => done(null, user))
    .catch(() => done(new Error("Failed to deserialize an user")));
});
passport.use(
  new LocalStrategy({ usernameField: "email" }, (username, password, done) => {
    var message = { message: "Email эсвэл нууц үг буруу байна." };
    User.findOne({
      email: username.toLowerCase(),
    }).then((user) => {
      if (!user) {
        return done(null, false, message);
      } else if (!bcrypt.compareSync(password, user.password))
        return done(null, false, message);
      else {
        user.reset_password_expires = null;
        user.reset_password_token = null;
        user.save();
        return done(null, user);
      }
    });
  })
);
