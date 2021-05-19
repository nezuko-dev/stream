import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import QRCode from "qrcode";
import { PlayCircleOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { Spin, Button, Dropdown, Menu, message, Modal, Row, Col } from "antd";
import io from "socket.io-client";

import "./style.scss";
const Titles = (props) => {
  const { id } = props.match.params;

  const [status, setStatus] = useState(null);
  const [countdown, setCountDown] = useState(600);

  const [state, setState] = useState(null);
  const [rent, openRent] = useState(null);
  const [titles, setTitles] = useState(null);
  const [type, setType] = useState(
    window.innerWidth > 576 ? "cover" : "poster"
  );
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    axios
      .get("/api/content/titles/" + id)
      .then((response) => {
        if (response.data.status) {
          setState(response.data.data);
          setTitles(response.data.titles);
        }
      })
      .catch((err) => {
        if (err.response.data) {
          message.error(err.response.data.msg);
        }
      });
  }, [id]);

  useEffect(() => {
    const resize = () => {
      setType(window.innerWidth > 576 ? "cover" : "poster");
    };
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
    };
  });
  const Counter = () => {
    useEffect(() => {
      if (!countdown) return;
      const interval = setInterval(() => {
        setCountDown(countdown - 1);
      }, 1000);
      return () => clearInterval(interval);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [countdown]);
    return (
      <p
        className={status.code ? "d-none" : ""}
        style={{ color: countdown < 300 ? "#dc3545" : "" }}
      >
        Цуцлагдах хугацаа {moment.unix(countdown).utc().format("mm[:]ss []")}
      </p>
    );
  };

  return (
    <>
      <main className="main-preview">
        <section className="titles">
          {state ? (
            <div className="preview">
              <section className="image-wrapper">
                <div className="image-container">
                  {type === "cover" ? (
                    <div
                      className="background"
                      style={{
                        backgroundImage: `url(${state.images.cover.original})`,
                      }}
                    />
                  ) : (
                    <div
                      className="background"
                      style={{
                        backgroundImage: `url(${state.images.poster.original})`,
                      }}
                    />
                  )}
                </div>
                <div className="shadows">
                  <div className="shadow-wrapper" />
                  <div className="shadow-top" />
                  <div className="shadow-bottom" />
                </div>
                <div className="">
                  <div className="action-wrapper"></div>
                  <div className="actions">
                    <div className="info">
                      <div className="stream">
                        {state.rent === null && state.price.amount > 0 ? (
                          <Button
                            type="primary"
                            size="large"
                            loading={loading}
                            onClick={() => {
                              setLoading(true);
                              axios
                                .post("/api/invoice/monpay", {
                                  title: id,
                                })
                                .then((response) => {
                                  if (response.data.status) {
                                    QRCode.toDataURL(
                                      response.data.data,
                                      {
                                        width: 200,
                                        height: 200,
                                        margin: 2,
                                        color: {
                                          dark: "#000",
                                          light: "#fff",
                                        },
                                      },
                                      (err, url) => {
                                        if (err)
                                          message.error(
                                            "QR код үүсгэхэд алдаа гарлаа"
                                          );
                                        else {
                                          openRent(url);
                                        }
                                      }
                                    );
                                    const socket = io();
                                    socket.on("connect", (e) => {
                                      setStatus({ state: "Шалгаж байна." });
                                      socket.emit("uuid", response.data.uuid);
                                      socket.on("monpay", (data) => {
                                        setStatus(data);
                                        if (data.code) {
                                          setLoading(false);
                                          setState({
                                            ...state,
                                            rent: {
                                              expires: moment({}).add(
                                                state.price.duration,
                                                "hours"
                                              ),
                                            },
                                          });
                                          openRent(null);
                                          socket.close();
                                        }
                                      });
                                    });
                                  } else
                                    message.error(
                                      "Tүрээслэх хүсэлт амжилтгүй боллоо."
                                    );
                                })
                                .catch((err) => {
                                  console.log(err);
                                });
                            }}
                          >
                            Tүрээслэх
                          </Button>
                        ) : (
                          <div>
                            <Link to={`/stream/${id}/${state.episodes[0]._id}`}>
                              <Button
                                icon={<PlayCircleOutlined />}
                                size="large"
                                type="primary"
                              >
                                Шууд үзэх
                              </Button>
                            </Link>
                            <p>
                              {state.rent
                                ? `Tүрээсийн дуусах хугацаа ${moment({}).to(
                                    state.rent.expires
                                  )}`
                                : null}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="meta">
                        <div className="age">{state.franchise.age_rating}+</div>
                        {state.franchise.genre.map((genre) => (
                          <div className="genre" key={genre._id}>
                            {genre.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              <div className="title-body">
                <div className="plot">{state.plot}</div>
                <div className="title-info">
                  <div className="titles-switch">
                    {titles?.length > 1 ? (
                      <Dropdown
                        trigger={["click"]}
                        overlay={() => (
                          <Menu selectedKeys={state._id}>
                            {titles.map((title) => (
                              <Menu.Item key={title._id}>
                                <Link to={`/titles/${title._id}`}>
                                  {title.label}
                                </Link>
                              </Menu.Item>
                            ))}
                          </Menu>
                        )}
                      >
                        <Button size="large">{state.name}</Button>
                      </Dropdown>
                    ) : null}
                  </div>
                  <div className="title-meta">
                    <div className="meta-field">
                      <p className="meta-title">Ангилал</p>
                      <p className="meta-subtitle">
                        {state.franchise.type === "movie" ? "Кино" : "Цуврал"}
                      </p>
                    </div>
                    {state.franchise.type !== "movie" ? (
                      <>
                        <div className="meta-field">
                          <p className="meta-title">Нийт анги</p>
                          <p className="meta-subtitle">{state.total_episode}</p>
                        </div>
                        <div className="meta-field">
                          <p className="meta-title">Төлөв</p>
                          <p className="meta-subtitle">
                            {state.status === "finished"
                              ? "Дууссан"
                              : "Гарч байгаа"}
                          </p>
                        </div>
                      </>
                    ) : null}
                  </div>
                </div>
                <div className="title-episodes">
                  <div className="episodes-wrapper">
                    {state.episodes.length > 1
                      ? state.episodes.map((episode, index) => (
                          <div className="episode" key={episode._id}>
                            <Link to={`/stream/${id}/${episode._id}`}>
                              <div className="thumbnail">
                                <img
                                  src={episode.content.thumbnail.sm}
                                  alt={episode.name}
                                />
                                <div className="episode-label">
                                  <span>{index + 1}-р анги</span>
                                </div>
                                <div className="thumbnail-overlay">
                                  <PlayCircleOutlined />
                                </div>
                              </div>
                            </Link>
                            <div className="episode-body">{episode.name}</div>
                          </div>
                        ))
                      : null}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="loading">
              <Spin />
            </div>
          )}
        </section>
      </main>
      <Modal
        closable={false}
        footer={null}
        visible={Boolean(rent)}
        className="rent-modal"
        centered
      >
        {state ? (
          <>
            <div className="rent-info">
              <p>
                Tа доорх QR кодыг Monpay application ээр уншуулан төлбөрөө төлнө
                үү. Tүрээсийн хугацаа: <b>{state.price.duration}цаг</b>
              </p>
            </div>
            <div className="qr-placeholder">
              <img src={rent} alt="Rent QR" />
            </div>
            {status ? (
              <Row justify="space-between">
                <Col>
                  <Counter />
                </Col>
                <Col style={{ textAlign: "rigth" }}>{status?.state}</Col>
              </Row>
            ) : (
              <Spin />
            )}
          </>
        ) : (
          <div className="loading">
            <Spin />
          </div>
        )}
      </Modal>
    </>
  );
};

export default Titles;
