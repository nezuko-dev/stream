import React, { useEffect, useState } from "react";
import { Spin, Input } from "antd";
import Title from "components/title";

import axios from "axios";

import "./style.scss";
const Browse = () => {
  const [state, setState] = useState(null);
  const [search, setSearch] = useState(null);
  useEffect(() => {
    axios.get("/api/content/browse").then((response) => {
      if (response.data.status) {
        setState(response.data.data);
      }
    });
  }, []);
  return (
    <div className="browse">
      <h2 style={{ marginTop: 10 }}>Нийт үзвэрүүд</h2>
      <Input
        placeholder="Хайх..."
        size="large"
        disabled={Boolean(!state)}
        onChange={(e) => {
          var value = e.target.value;
          if (value) {
            setSearch(
              state.filter((data) =>
                data.name.toLowerCase().includes(value.toLowerCase())
              )
            );
          } else {
            setSearch(null);
          }
        }}
      />
      {state ? (
        <div className="items">
          {search
            ? [...search].map((title) => <Title key={title._id} {...title} />)
            : [...state].map((title) => <Title key={title._id} {...title} />)}
        </div>
      ) : (
        <div className="loading">
          <Spin />
        </div>
      )}
    </div>
  );
};
export default Browse;
