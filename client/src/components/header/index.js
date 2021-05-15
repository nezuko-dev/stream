import React, { useContext, useEffect, useState } from "react";
import { Row, Col, Menu, Button, Spin, Modal, Dropdown } from "antd";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import {
  PlaySquareOutlined,
  AppstoreOutlined,
  SearchOutlined,
  UserOutlined,
  ExclamationCircleOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { User } from "context/user";
import Cookie from "js-cookie";
import "./style.scss";
const Header = () => {
  const location = useLocation();
  const [current] = useState(location.pathname);
  const { user, setUser } = useContext(User);
  const [classes, setClasses] = useState("");
  const token = Cookie.get("stream-token");

  useEffect(() => {
    window.onscroll = () => {
      if (
        document.documentElement.scrollTop > 56 &&
        location.pathname === "/"
      ) {
        setClasses(" scrolled");
      } else if (
        document.documentElement.scrollTop < 56 &&
        location.pathname === "/"
      ) {
        setClasses("");
      }
    };
  });
  const settings = (
    <Menu>
      <Menu.Item icon={<UserOutlined />}>
        <Link to="/account">Mиний хаяг</Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item icon={<LogoutOutlined />}>
        <Link
          to="/logout"
          onClick={(e) => {
            e.preventDefault();
            return Modal.confirm({
              title: "Анхааруулга",
              icon: <ExclamationCircleOutlined />,
              content: "Та системээс гарахдаа итгэлтэй байна уу?",
              okText: "Tийм",
              cancelText: "Буцах",
              onOk: () => {
                axios.get("/api/account/logout").then((response) => {
                  if (response.data.status) {
                    Cookie.remove("stream-token");
                    setUser(false);
                  }
                });
              },
            });
          }}
        >
          Системээс гарах
        </Link>
      </Menu.Item>
    </Menu>
  );
  return (
    <div
      id="header"
      className={`${location.pathname === "/" ? "home" : ""}` + classes}
    >
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
            {token && !user ? (
              <Spin />
            ) : user ? (
              <Dropdown overlay={settings} placement="bottomCenter">
                <Button>{user.email}</Button>
              </Dropdown>
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
