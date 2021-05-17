const Rent = require("../models/rent");
const Title = require("../models/title");
const axios = require("axios");
const { compareSync } = require("bcryptjs");
exports.index = (req, res) => {
  return res.json({ status: true });
};
exports.monpay = async (req, res) => {
  const { title } = req.body;
  var io = req.app.get("io");
  io.on("connection", (socket) => {
    socket.emit("monpay", {
      state: "Төлөгдөөгүй",
      connected: true,
    });
  });
  const check = (uuid, id) => {
    var check_uuid = setInterval(async () => {
      //10 секунд болгон төлөгдсөн эсэхийн шалгах
      io.emit("monpay", {
        state: "Төлөгдөөгүй",
        connected: true,
      });
      axios
        .get(
          `https://wallet.monpay.mn/rest/branch/qrpurchase/check?uuid=${uuid}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
            auth: {
              username: process.env.MONPAY_BRANCH_USERNAME,
              password: process.env.MONPAY_ACCOUNT_ID,
            },
          }
        )
        .then((response) => {
          let { code, result, info } = response.data;
          if (code === 0) {
            io.emit("monpay", {
              state: "Төлөгдсөн",
              code: true,
              connected: true,
            });
            clearInterval(check_uuid);
          }
        })
        .catch((err) => {
          console.log("INVOICE: MONPAY ERROR " + err);
          clearInterval(check_uuid);
        });
    }, 10000);

    setTimeout(() => {
      console.log(`INVOICE: MONPAY TIMEDOUT 'uuid': ${uuid}, 'user': ${id}`);
      clearInterval(check_uuid);
    }, 600000); //stop after 10 mins( 600000 ms)
  };

  Title.findOne({ _id: title, "price.amount": { $gt: 0 } })
    .then(async (data) => {
      if (data) {
        var rented = await Rent.findOne({
          user: req.user.id,
          title,
          expires: { $gt: Date.now() },
        });

        if (rented)
          return res.status(400).json({
            status: false,
            msg: "Tа энэ контентыг түрээсэлсэн байна.",
          });
        else {
          axios
            .post(
              "https://wallet.monpay.mn/rest/branch/qrpurchase/generate",
              {
                amount: data.price.amount,
                displayName: "Nezuko Streaming",
                generateUuid: true,
              },
              {
                headers: {
                  "Content-Type": "application/json",
                },
                auth: {
                  username: process.env.MONPAY_BRANCH_USERNAME,
                  password: process.env.MONPAY_ACCOUNT_ID,
                },
              }
            )
            .then((response) => {
              let { code, result, info } = response.data;

              if (code === 0) {
                check(result.uuid, req.user.id);
                return res.json({
                  status: true,
                  data: result.qrcode,
                });
              } else {
                return res
                  .status(500)
                  .json({ status: false, msg: "Monpay хүсэлт амжилтгүй" });
              }
            })
            .catch((err) => {
              console.log(err);
              return res
                .status(500)
                .json({ status: false, msg: "Monpay холболт амжилтгүй" });
            });
        }
      } else
        return res
          .status(404)
          .json({ status: false, msg: "Контент олдсонгүй" });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({ status: false, msg: "Хүсэлт амжилтгүй" });
    });
};
