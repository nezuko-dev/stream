const Franchise = require("../models/franchise");
const Content = require("../models/content");
const Genre = require("../models/genre");
const Title = require("../models/title");
exports.index = async (req, res) => {
  // latest
  const latest = await Title.find({})
    .select("-episodes")
    .sort({ created: -1 })
    .limit(10);
  return res.json({
    status: true,
    data: [
      {
        name: "Сүүлд нэмэгдсэн",
        items: latest,
      },
    ],
  });
};
