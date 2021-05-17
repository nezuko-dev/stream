const Franchise = require("../models/franchise");
const Content = require("../models/content");
const Genre = require("../models/genre");
const Title = require("../models/title");
const Rent = require("../models/rent");
const ObjectId = require("mongoose").Types.ObjectId;
exports.index = async (req, res) => {
  // latest
  const latest = await Title.find({})
    .select("-episodes")
    .sort({ created: -1 })
    .limit(10);
  // for demo
  Franchise.find({})
    .then((data) => {
      var titles = data.map(async (franchise) => ({
        name: franchise.name,
        items: await Title.find({ franchise: franchise._id }).select(
          "-episodes"
        ),
      }));
      Promise.all(titles).then(async (render) => {
        return res.json({
          status: true,
          data: [{ name: "Сүүлд нэмэгдсэн", items: latest }, ...render],
        });
      });
    })
    .catch((err) => res.json({ status: false }));
};
exports.titles = (req, res) => {
  const { id } = req.params;
  if (ObjectId.isValid(id)) {
    Title.findById(id)
      .populate({
        path: "franchise",
        populate: { path: "genre", model: "genre", select: "name" },
      })
      .populate({
        path: "episodes.content",
        model: "content",
        select: "-editor -status -size",
      })
      .then(async (data) => {
        if (data) {
          var titles = await Title.find({ franchise: data.franchise }).select(
            "label name thumbnail"
          );
          var rent = await Rent.findOne({
            user: req.user.id,
            title: id,
            expires: { $gt: Date.now() },
          });
          return res.json({
            status: true,
            data: { ...data._doc, rent },
            titles,
          });
        } else res.status(404).json({ msg: "Үзвэр олдсонгүй" });
      })
      .catch((err) =>
        res
          .status(500)
          .json({ msg: "Алдаа гарлаа та дараа дахин оролдоно уу." })
      );
  } else res.status(404).json({ msg: "Үзвэр олдсонгүй" });
};
