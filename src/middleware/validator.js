const { check } = require("express-validator");

exports.email = [
  check("email").isEmail().withMessage("Email хаяг аа зөв оруулна уу!"),
];
exports.password = [
  check("password")
    .isLength({ min: 6, max: 64 })
    .withMessage("Нууц үг доод тал нь 6 оронтой байна."),
  check("token")
    .isLength({ min: 36 })
    .withMessage("Алдаатай token илгээсэн байна."),
];
exports.passwords = [
  check("current_password")
    .isLength({ min: 6, max: 32 })
    .withMessage("6 - 32 тэмдэгтийн хооронд оруулна уу."),
  check("new_password")
    .isLength({ min: 6, max: 32 })
    .withMessage("6 - 32 тэмдэгтийн хооронд оруулна уу."),
  check("confirm_password")
    .isLength({ min: 6, max: 32 })
    .withMessage("6 - 32 тэмдэгтийн хооронд оруулна уу."),
];
exports.create = [
  check("email").isEmail().withMessage("Email хаяг аа зөв оруулна уу!"),
  check("password")
    .isLength({ min: 6, max: 64 })
    .withMessage("Нууц үг доод тал нь 6 оронтой байна."),
  check("confirm_password")
    .isLength({ min: 6, max: 32 })
    .withMessage("6 - 32 тэмдэгтийн хооронд оруулна уу."),
];
