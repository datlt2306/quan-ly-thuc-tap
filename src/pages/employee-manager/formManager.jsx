import { Col, Form, Input, Row, Button, Select } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchManager } from "../../features/managerSlice/managerSlice";
const { Option } = Select;

const FormManager = ({
  onFinish,
  editStatusButton,
  text,
  forms,
  listCumpus,
}) => {
  const dispatch = useDispatch();

  const onFinishForm = (values) => {
    if (text === 2) {
      onFinish({ ...values, status: 1 });
    } else {
      onFinish(...values);
    }
  };

  useEffect(() => {
    dispatch(fetchManager());
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
            sm={24}
            md={24}
            lg={24}
            xl={24}
            style={{ padding: "0 50% 0 10px" }}
          >
            <Form.Item
              name="name"
              label="Tên nhân viên quản lý"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập tên nhân viên!",
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col
            xs={24}
            sm={24}
            md={24}
            lg={24}
            xl={24}
            style={{ padding: "0 50% 0 10px" }}
          >
            <Form.Item
              name="email"
              label="Email nhân viên quản lý"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập Email nhân viên!",
                },
              ]}
            >
              <Input type='email' />
            </Form.Item>
          </Col>
          <Col
            xs={24}
            sm={24}
            md={24}
            lg={24}
            xl={24}
            style={{ padding: "0 50% 0 10px" }}
          >
            <Form.Item
              name="campus"
              label="Cơ sở nhân viên quản lý"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập cơ sở nhân viên!",
                },
              ]}
            >
              <Select
                defaultValue=""
                style={{ width: "50%" }}
              >
                {listCumpus.map((item,index) => {
                  return <Option key={index} value={item._id}>{item.name}</Option>;
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col
            xs={24}
            sm={24}
            md={24}
            lg={24}
            xl={24}
            style={{ padding: "0 50% 0 10px" }}
          >
            <Form.Item
              name="role"
              label="Quyền hạn quản lý"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập quyền hạn quản lý!",
                },
              ]}
            >
               <Select
                defaultValue=""
                style={{ width: "50%" }}
              >
                
                <Option value={1}>Nhân viên quản lý</Option>
                <Option value={2}>Quản lý cấp cao</Option>

              </Select>
            </Form.Item>
          </Col>
          <Col>
            <Form.Item style={{ marginLeft: "20px" }}>
              <Button type="primary" htmlType="submit">
                {text === 2 ? "Sửa thông tin nhân viên" : "Tạo mới nhân viên"}
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

export default FormManager;
