import React, { useEffect, useState } from "react";
import "./style.scss";
import { Link } from "react-router-dom";
const Title = (props) => {
  const [type, setType] = useState(
    window.innerWidth > 768 ? "cover" : "poster"
  );
  const { _id } = props;
  useEffect(() => {
    window.addEventListener("resize", () => {
      setType(window.innerWidth > 768 ? "cover" : "poster");
    });
  });
  return (
    <Link className="title" to={`/titles/${_id}`}>
      <div className="container">
        <div className="image">
          <div className="image-wrapper">
            {type === "poster" ? (
              <img src={props.images.poster.md} alt={props.name}></img>
            ) : (
              <img src={props.images.cover.md} alt={props.name}></img>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};
export default Title;
