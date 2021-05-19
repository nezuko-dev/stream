import React, { useEffect, useState } from "react";
import { Row, Col, Card, message, Spin, Table } from "antd";
import { useHistory, Link } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import "./style.scss";

const Invoice = (props) => {
  var rent = props.location.search === "?rent" || false;
  const location = useHistory();
  const [state, setState] = useState(null);
  const load = () => {
    setState(null);
    axios
      .get(`/api/invoice?rent=${rent ? true : false}`)
      .then((response) => {
        if (response.data.status) {
          setState(response.data.data);
        }
      })
      .catch((err) => {
        if (err.response.data) {
          message.error(err.response.data.msg);
        }
      });
  };
  const columns = rent
    ? [
        {
          title: "Үзвэр",
          dataIndex: "title",
          key: "title",
          render: (text) => <Link to={`/titles/${text._id}`}>{text.name}</Link>,
        },
        {
          title: "Үнэ",
          dataIndex: "amount",
          key: "amount",
          render: (text, record) => record.title.price.amount,
        },

        {
          title: "Үүсгэсэн",
          dataIndex: "created",
          key: "created",
          render: (text) => moment(text).fromNow(),
        },
        {
          title: "Дуусах хугацаа",
          dataIndex: "expires",
          key: "expires",
          render: (text) => moment({}).to(text),
        },
      ]
    : [
        {
          title: "Үзвэр",
          dataIndex: "title",
          key: "title",
          render: (text) => <Link to={`/titles/${text._id}`}>{text.name}</Link>,
        },
        {
          title: "Үнэ",
          dataIndex: "amount",
          key: "amount",
        },

        {
          title: "Үүсгэсэн",
          dataIndex: "created",
          key: "created",
          render: (text) => moment(text).fromNow(),
        },
        {
          title: "Tөлсөн",
          dataIndex: "paid",
          key: "paid",
          render: (text) => (text ? moment(text).fromNow() : null),
        },
        {
          title: "Tөлөв",
          dataIndex: "status",
          key: "status",
          render: (text) => (text ? "Tөлсөн" : "Tөлөгдөөгүй"),
        },
      ];
  // eslint-disable-next-line
  useEffect(() => load(), [rent]);
  return (
    <div className="invoice">
      <Row justify="center">
        <Col xs={24} sm={20} md={20} lg={16} xl={18} xxl={16}>
          <Card
            activeTabKey={rent ? "rent" : "invoice"}
            onTabChange={(key) => {
              if (key === "invoice") {
                location.push("/invoice");
              } else if (key === "rent") {
                location.push("/invoice?rent");
              }
              setState(null);
            }}
            tabList={[
              {
                key: "invoice",
                tab: "Нихэмжлэлүүд",
              },
              {
                key: "rent",
                tab: "Tүрээслэсэн контентууд",
              },
            ]}
          >
            {state ? (
              <Table
                dataSource={state}
                rowKey={(data) => data._id}
                columns={columns}
              />
            ) : (
              <div className="loading">
                <Spin />
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};
export default Invoice;
