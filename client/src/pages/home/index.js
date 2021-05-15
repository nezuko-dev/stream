import React, { useEffect, useState } from "react";
import { Spin } from "antd";
import axios from "axios";
import "./style.scss";
const Home = () => {
  const [items, setItems] = useState(null);
  const [banner, setBanner] = useState(null);
  useEffect(() => {
    axios.get("/api/content").then((response) => {
      setBanner(response.data.banner);
      setItems(response.data.items);
    });
  }, []);
  return (
    <div className="main">
      {items && banner ? (
        <div className="banner">
          <div className="img-container">
            <div
              className="banner-img"
              style={{ backgroundImage: `url(${banner.images.banner})` }}
            ></div>
          </div>
        </div>
      ) : (
        <div className="loading">
          <Spin />
        </div>
      )}
    </div>
  );
};
export default Home;
