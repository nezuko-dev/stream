const User = require("../models/user");
const passport = require("passport");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const mailer = require("../lib/mailer");
exports.index = (req, res) => res.json({ status: true, user: req.user });
exports.auth = (req, res, next) => {
  passport.authenticate("local", (err, user, message) => {
    if (!user || err) {
      return res.status(400).json({
        errors: [
          {
            param: "password",
            msg: message ? message.message : "Failed to login",
          },
        ],
      });
    }
    req.logIn(user, (err) => {
      if (err)
        return res.status(400).json({
          errors: [
            {
              param: "password",
              msg: message ? message.message : "Failed to login",
            },
          ],
        });
      return res.json({ status: true });
    });
  })(req, res, next);
};
exports.logout = (req, res) => {
  req.logout();
  return res.json({ status: true });
};
exports.forgot = (req, res) => {
  const errors = validationResult(req);
  const { email } = req.body;
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: false, errors: errors.array() });
  } else {
    User.findOne({ email: email.toLowerCase() })
      .then((doc) => {
        if (doc) {
          User.findById(doc._id).then(async (user) => {
            var token = crypto.randomBytes(18).toString("hex");
            // Email хаяг руу илгээх мэдээлэл
            mailer.send({
              to: doc.email,
              subject: "Нууц үг сэргээх",
              text: `Сайн байна уу<br> 
                  Доорх товч дээр дарж нууц үгээ сэргээнэ үү.<br><a href="${
                    process.env.NODE_ENV === "development"
                      ? "http://localhost:3000/auth/reset/" + token
                      : process.env.URL + "/auth/reset/" + token
                  }">Нууц үг сэргээх</a><br>
                  <span>Хүсэлт гаргасан IP хаяг: ${
                    req.headers["x-forwarded-for"] ||
                    req.connection.remoteAddress
                  }</span>`,
            });
            user.reset_password_token = token;
            user.reset_password_expires = Date.now() + 86400000;
            let result = await user.save();
            console.log(
              `User : ${
                result._id
              } is requested password reset token at ${Date.now()}`
            );
          });
        }
      })
      .catch((err) => res.json({ status: false }));
    return res.json({ status: true });
  }
};
exports.reset = (req, res) => {
  const errors = validationResult(req);
  const { password, token } = req.body;
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: false, errors: errors.array() });
  } else {
    User.findOne({
      reset_password_token: token,
      reset_password_expires: { $gt: Date.now() },
    }).then((doc) => {
      if (doc) {
        if (bcrypt.compareSync(password, doc.password)) {
          return res.status(400).json({
            errors: [
              {
                param: "password",
                msg: "Tа өмнө нь ашиглаж байгаагүй нууц үг оруулна уу.",
              },
            ],
          });
        } else {
          doc.password = password;
          doc.reset_password_token = null;
          doc.reset_password_expires = null;
          doc.save(() => {
            req.logIn(doc, (err) => {
              if (err)
                return res.json({
                  status: false,
                  message: "Failed to login",
                });
              return res.json({ status: true });
            });
          });
        }
      } else
        return res.status(400).json({
          errors: [
            {
              param: "token",
              msg: "Нууц үг солих холбоос хүчингүй байна.",
            },
          ],
        });
    });
  }
};
exports.password = (req, res) => {
  const { current_password, new_password, confirm_password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: false, errors: errors.array() });
  } else {
    if (new_password !== confirm_password) {
      return res.status(400).json({
        status: false,
        errors: [
          { param: "confirm_password", msg: "Шинэ нууц үг таарсангүй." },
        ],
      });
    } else {
      Admin.findById(req.user.id).then((admin) => {
        if (bcrypt.compareSync(current_password, admin.password)) {
          var duplicate = bcrypt.compareSync(confirm_password, admin.password);
          admin.password = confirm_password;
          admin.save(() => res.json({ status: true, duplicate }));
        } else
          return res.status(400).json({
            status: false,
            errors: [
              { param: "current_password", msg: "Нууц үг буруу байна." },
            ],
          });
      });
    }
  }
};
exports.create = async (req, res) => {
  const { email, password, confirm_password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: false, errors: errors.array() });
  } else {
    if (password !== confirm_password) {
      return res.status(400).json({
        status: false,
        errors: [{ param: "confirm_password", msg: "Нууц үг тохирсонгүй." }],
      });
    } else {
      var found = await User.findOne({ email: email.toLowerCase() });
      if (found) {
        return res.status(400).json({
          status: false,
          errors: [
            {
              param: "email",
              msg: "Энэ имэйл хаягыг ашиглах боломжгүй байна.",
            },
          ],
        });
      } else
        User.create({ email, password }).then((data) =>
          res.json({ status: true })
        );
    }
  }
};
