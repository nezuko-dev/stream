import React, { useEffect, useState } from "react";
import { message, Spin } from "antd";
import axios from "axios";
import "./style.scss";
import Title from "components/title";
const Home = () => {
  const [state, setState] = useState(null);
  useEffect(() => {
    axios
      .get("/api/content")
      .then((response) => {
        setState(response.data.data);
      })
      .catch((err) => message.error("Хүсэлт амжилтгүй"));
  }, []);
  return (
    <div className="main">
      {state ? (
        state.map((group, index) => (
          <div key={index} className="title-group">
            <div className="group-title">
              <p>{group.name}</p>
            </div>
            <div className="title-slider">
              <div className="slider-padding"></div>
              {group.items.map((title) => (
                <Title key={title._id} {...title} />
              ))}
              <div className="slider-padding"></div>
            </div>
          </div>
        ))
      ) : (
        <div className="loading">
          <Spin />
        </div>
      )}
    </div>
  );
};
export default Home;
