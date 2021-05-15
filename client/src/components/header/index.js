import React, { useContext, useState } from "react";
import { Row, Col, Menu, Button } from "antd";
import { Link, useLocation } from "react-router-dom";
import {
  PlaySquareOutlined,
  AppstoreOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { User } from "context/user";
import Cookie from "js-cookie";
import "./style.scss";
const Header = () => {
  const location = useLocation();
  const [current] = useState(location.pathname);
  const { user } = useContext(User);
  const token = Cookie.get("stream-token");

  console.log(user);
  return (
    <div id="header">
      <Row justify="space-between">
        <Col>
          <h1>
            <div className="logo">
              <Link to="/">
                <PlaySquareOutlined />
              </Link>
            </div>
          </h1>
        </Col>
        <Col className="header-row">
          <div className="menu-item">
            <Menu mode="horizontal" activeKey={current}>
              <Menu.Item key="/browse" icon={<AppstoreOutlined />}>
                <Link to="/browse">Үзвэрүүд</Link>
              </Menu.Item>
              <Menu.Item key="/search" icon={<SearchOutlined />}>
                <Link to="/search">Хайх</Link>
              </Menu.Item>
            </Menu>
          </div>
          <div className="menu-item">
            {user ? (
              <Link to="/account">
                <Button>{user.email}</Button>
              </Link>
            ) : (
              <Link to="/auth">
                <Button type="primary">Нэвтрэх</Button>
              </Link>
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
};
export default Header;
