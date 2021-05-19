const Rent = require("../models/rent");
const Title = require("../models/title");
const Invoice = require("../models/invoice");
const axios = require("axios");
exports.index = (req, res) => {
  return res.json({ status: true });
};
exports.monpay = async (req, res) => {
  const { title } = req.body;
  var io = req.app.get("io");
  io.sockets.on("connection", (socket) => {
    socket.on("uuid", (uuid) => {
      socket.join(uuid);
    });
  });

  const check = (uuid, id) => {
    var socket = io.to(uuid);
    var check_uuid = setInterval(async () => {
      //10 секунд болгон төлөгдсөн эсэхийн шалгах
      socket.emit("monpay", {
        state: "Төлөгдөөгүй",
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
        .then(async (response) => {
          let { code, result, info } = response.data;
          if (code === 0) {
            var duration = await Title.findById(title);
            Rent.create({
              title,
              user: req.user.id,
              expires: Date.now() + duration.price.duration * 60 * 60 * 1000,
            });
            Invoice.findOneAndUpdate(
              { uuid },
              { status: true, paid: Date.now() }
            ).then(() => {
              socket.emit("monpay", {
                state: "Төлөгдсөн",
                code: true,
              });
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
                Invoice.create({
                  user: req.user.id,
                  title,
                  uuid: result.uuid,
                  amount: data.price.amount,
                });
                return res.json({
                  status: true,
                  data: result.qrcode,
                  uuid: result.uuid,
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
