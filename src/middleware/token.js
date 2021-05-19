const User = require("../models/user");
const token = async (req, res, next) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  if (!req.user)
    res.status(401).json({ msg: "Хүчингүй токен дахин нэвтрэнэ үү" });
  else {
    const current = await User.findById(req.user.id);
    if (ip !== current.ip) {
      req.logout();
      return res.status(401).json({ msg: "Дахин нэвтрэнэ үү" });
    } else next();
  }
};
module.exports = token;
