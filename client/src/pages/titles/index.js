import React, { useState, useEffect } from "react";
import axios from "axios";
import { PlayCircleOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { Spin, Button, Dropdown, Menu } from "antd";
import "./style.scss";
const Titles = (props) => {
  const { id } = props.match.params;
  const [state, setState] = useState(null);
  const [titles, setTitles] = useState(null);
  const [type, setType] = useState(
    window.innerWidth > 576 ? "cover" : "poster"
  );
  useEffect(() => {
    axios.get("/api/content/titles/" + id).then((response) => {
      if (response.data.status) {
        setState(response.data.data);
        setTitles(response.data.titles);
      }
    });
  }, [id]);
  useEffect(() => {
    window.addEventListener("resize", () => {
      setType(window.innerWidth > 576 ? "cover" : "poster");
    });
  });
  return (
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
                      <Link to={`/stream/${state.episodes[0].content._id}`}>
                        <Button
                          icon={<PlayCircleOutlined />}
                          size="large"
                          type="primary"
                        >
                          Шууд үзэх
                        </Button>
                      </Link>
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
                  <div>
                    {state.episodes.map((episode) => (
                      <div className="episode" key={episode._id}>
                        <Link to={`/stream/${episode.content._id}`}>
                          <div className="thumbnail"></div>
                        </Link>
                      </div>
                    ))}
                  </div>
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
  );
};

export default Titles;
