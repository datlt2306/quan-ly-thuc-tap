import { Col, Form, Input, Row, Button } from "antd";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getListCumpus } from "../../features/cumpusSlice/cumpusSlice";

const FormCampus = ({ onFinish, editStatusButton, text, forms }) => {
  const dispatch = useDispatch();
  const onFinishForm = (values) => {
    if (text === 2) {
      onFinish({ ...values, status: 1 });
    } else {
      onFinish(values);
    }
  };

  useEffect(() => {
    dispatch(getListCumpus());
  }, [dispatch]);

  const sethButton = (values) => {
    editStatusButton(values);
  };
  return (
    <>
      <Form form={forms} onFinish={onFinishForm}>
        <Row>
          <Col
            xs={24}
            sm={4}
            md={12}
            lg={8}
            xl={8}
            style={{ padding: "0 10px" }}
          >
            <Form.Item
              name="name"
              label="Tên cơ sở"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập tên cơ sở!",
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item style={{ marginLeft: "20px" }}>
              <Button type="primary" htmlType="submit">
                {text === 2 ? "Sửa thông tin sơ sở" : "Tạo mới cơ sở"}
              </Button>
              <Button
                style={{ marginLeft: "10px" }}
                type="danger"
                onClick={() => sethButton(false)}
              >
                Huỷ
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default FormCampus;
