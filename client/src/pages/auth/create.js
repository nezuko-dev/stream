import React, { useState } from "react";
import axios from "axios";
import { Form, Input, Button, Divider, Card, Row, Col, message } from "antd";
import { Link, Redirect } from "react-router-dom";
import Cookie from "js-cookie";
import "./style.scss";
const Register = () => {
  const [form] = Form.useForm();
  const [disabled, disable] = useState(false);
  const [errors, setError] = useState(null);
  return Cookie.get("stream-token") ? (
    <Redirect to="/" />
  ) : (
    <div className="auth">
      <Row justify="center">
        <Col xs={24} sm={16} md={12} lg={10} xl={8} xxl={6}>
          <Card>
            <h5>Бүртгүүлэх</h5>
            <Form
              form={form}
              layout="vertical"
              className="custom-form"
              onFinish={(values) => {
                setError(null);
                if (values.password_confirm !== values.password)
                  setError([
                    {
                      param: "password_confirm",
                      msg: "Нууц үг тохирохгүй байна.",
                    },
                  ]);
                else {
                  disable(true);
                  axios
                    .post("/api/account/create", { ...values })
                    .then((response) => {
                      if (response.data.status) {
                        document.location.href = "/";
                      }
                    })
                    .catch((err) => {
                      if (err.response.data.message)
                        message.error(err.response.data.message);
                      else {
                        setError(err.response.data.errors);
                        disable(false);
                      }
                    });
                }
              }}
            >
              <Form.Item
                name="email"
                rules={[
                  {
                    required: true,
                    type: "email",
                    message: "Email хаяг аа зөв оруулна уу!",
                  },
                ]}
                {...(errors?.find((error) => error.param === "email")
                  ? {
                      help: errors.find((error) => error.param === "email").msg,
                      validateStatus: "error",
                    }
                  : null)}
              >
                <Input
                  placeholder="Имэйл хаяг"
                  size="large"
                  type="email"
                  disabled={disabled}
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[{ required: true, message: "Нууц үгээ оруулна уу!" }]}
                {...(errors?.find((error) => error.param === "password")
                  ? {
                      help: errors.find((error) => error.param === "password")
                        .msg,
                      validateStatus: "error",
                    }
                  : null)}
              >
                <Input
                  placeholder="Нууц үг"
                  type="password"
                  size="large"
                  disabled={disabled}
                />
              </Form.Item>

              <Form.Item
                name="password_confirm"
                rules={[{ required: true, message: "Нууц үгээ оруулна уу!" }]}
                {...(errors?.find((error) => error.param === "password_confirm")
                  ? {
                      help: errors.find(
                        (error) => error.param === "password_confirm"
                      ).msg,
                      validateStatus: "error",
                    }
                  : null)}
              >
                <Input
                  placeholder="Нууц үг давтах"
                  type="password"
                  size="large"
                  disabled={disabled}
                />
              </Form.Item>

              <div className="form-action">
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    block
                    size="large"
                    disabled={disabled}
                  >
                    Бүртгүүлэх
                  </Button>
                </Form.Item>
                <Divider />
                <Row justify="center">
                  <Link to="/auth">Нэвтрэх</Link>
                </Row>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
export default Register;
