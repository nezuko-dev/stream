import React, { useContext, useState } from "react";
import {
  Card,
  Row,
  Col,
  Form,
  Input,
  Spin,
  Button,
  message,
  Divider,
} from "antd";
import axios from "axios";
import "./style.scss";
import { User } from "context/user";
const Account = () => {
  const { user } = useContext(User);
  const [errors, setError] = useState(null);

  const [password] = Form.useForm();

  const [disabled, disable] = useState("");
  return (
    <div className="account">
      <Row justify="center">
        <Col xs={24} sm={20} md={18} lg={16} xl={14} xxl={10}>
          <Card title="Миний хаяг">
            <h3>Бүртгэл</h3>
            {user ? (
              <div>Имэйл хаяг: {user.email}</div>
            ) : (
              <div className="loading">
                <Spin />
              </div>
            )}
            <Divider />
            <h3>Нууц үг солих</h3>
            <Form
              form={password}
              hideRequiredMark={true}
              layout="vertical"
              className="custom-form"
              onFinish={(values) => {
                const { new_password, confirm_password } = values;
                setError(null);
                if (new_password !== confirm_password) {
                  setError([
                    {
                      param: "confirm_password",
                      msg: "Нууц үг таарахгүй байна.",
                    },
                  ]);
                } else {
                  disable("password");
                  axios
                    .post("/api/account/password", { ...values })
                    .then((response) => {
                      if (response.data.status) {
                        message.success(
                          `Tаны нууц үг амжилттай шинэчлэгдлээ. ${
                            response.data.duplicate ? "🤔" : ""
                          }`
                        );
                        disable("");
                      }
                    })
                    .catch((err) => {
                      setError(err.response.data.errors);
                      disable("");
                    });
                  password.resetFields();
                }
              }}
            >
              <Form.Item
                name="current_password"
                label="Нууц үг"
                rules={[
                  {
                    required: true,
                    message: "Нууц үгээ оруулна уу!",
                  },
                  { min: 6, message: "Нууц үг доод тал нь 6 оронтой байна." },
                  { max: 32, message: "Нууц үг дээд тал нь 32 оронтой байна." },
                ]}
                {...(errors &&
                errors.find((error) => error.param === "current_password")
                  ? {
                      help: errors.find(
                        (error) => error.param === "current_password"
                      ).msg,
                      validateStatus: "error",
                    }
                  : null)}
              >
                <Input.Password
                  placeholder="Одоо ашиглаж буй нууц үг"
                  size="large"
                />
              </Form.Item>
              <Form.Item
                name="new_password"
                label="Шинэ нууц үг"
                rules={[
                  {
                    required: true,
                    message: "Нууц үгээ оруулна уу!",
                  },
                  { min: 6, message: "Нууц үг доод тал нь 6 оронтой байна." },
                  { max: 32, message: "Нууц үг дээд тал нь 32 оронтой байна." },
                ]}
                {...(errors &&
                errors.find((error) => error.param === "new_password")
                  ? {
                      help: errors.find(
                        (error) => error.param === "new_password"
                      ).msg,
                      validateStatus: "error",
                    }
                  : null)}
              >
                <Input.Password placeholder="Шинэ нууц үг" size="large" />
              </Form.Item>
              <Form.Item
                name="confirm_password"
                label="Нууц үг давтах"
                rules={[
                  {
                    required: true,
                    message: "Нууц үгээ оруулна уу!",
                  },
                  { min: 6, message: "Нууц үг доод тал нь 6 оронтой байна." },
                  { max: 32, message: "Нууц үг дээд тал нь 32 оронтой байна." },
                ]}
                {...(errors &&
                errors.find((error) => error.param === "confirm_password")
                  ? {
                      help: errors.find(
                        (error) => error.param === "confirm_password"
                      ).msg,
                      validateStatus: "error",
                    }
                  : null)}
              >
                <Input.Password
                  placeholder="Шинэ нууц үгээ давтан оруулна уу"
                  size="large"
                />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  size="large"
                  htmlType="submit"
                  disabled={disabled === "password" && true}
                >
                  Хадгалах
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
export default Account;
