/* eslint-disable jsx-a11y/anchor-is-valid */
import { Button, Table, message, Space, Form } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CumpusApi from "../../API/Cumpus";
import { getListCumpus } from "../../features/cumpusSlice/cumpusSlice";
import FormCampus from "./FormCampus";

const CampusManager = () => {
  const dispatch = useDispatch();
  const [hideForm, setHideForm] = useState(false);
  const [hideButton, setHideButton] = useState(false);
  const [text, setText] = useState();
  const [dataEdit, setDataEdit] = useState({});
  const [form] = Form.useForm();
  const { listCumpus } = useSelector((state) => state.cumpus);

  const capitalizeFirstLetter = (value) => {
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  const result = listCumpus.map((item) => ({
    id: item._id,
    name: capitalizeFirstLetter(item.name),
  }));

  const onFinish = async (values) => {
    const data = {
      id: values.id,
      name: values.name,
    };
    try {
      if (values.status === 1) {
        const res = await CumpusApi.update(data);
        if (res) {
          message.success("Sửa thông tin cơ sở thành công");
          dispatch(getListCumpus());
        }
      } else {
        const res = await CumpusApi.create(data);
        if (res) {
          message.success("Thêm cơ sở thành công");
          dispatch(getListCumpus());
        }
      }
    } catch (error) {
      const dataErr = error.response.data.message;
      message.error(dataErr);
    }
    setHideForm(false);
  };

  // sửa kỳ
  const getDataEdit = (value) => {
    setHideForm(true);
    form.setFieldsValue({
      id: value.id,
      name: value.name,
    });
    setHideButton(true);
    setText(2);
  };

  // Huỷ form
  const editStatusButton = (value) => {
    setHideButton(value);
    setHideForm(false);
  };

  // Bật tắt button tạo kỳ
  const isHideForm = () => {
    form.resetFields();
    setHideForm(!hideForm);
    setText(1);
    setDataEdit();
  };

  useEffect(() => {
    dispatch(getListCumpus());
  }, [dispatch, hideForm]);

  const columns = [
    {
      dataIndex: "id",
      width: 20,
    },
    {
      title: "Tên cơ sở",
      dataIndex: "name",
      width: 100,
    },
    {
      title: "Action",
      key: "action",
      width: 100,
      render: (text, record) => (
        <Space size="middle">
          <a style={{ color: "blue" }} onClick={() => getDataEdit(record)}>
            Sửa
          </a>
        </Space>
      ),
    },
  ].filter((item) => item.dataIndex !== "id");

  return (
    <>
      <div className="status">
        <div className="flex-header">
          <h4>Quản lý cơ sở</h4>
          <div style={{ display: "flex" }}>
            {hideButton ? null : (
              <Button
                onClick={() => isHideForm()}
                variant="warning"
                style={{ marginRight: 10, height: 36 }}
              >
                Tạo mới cơ sở
              </Button>
            )}
          </div>
        </div>
        {hideForm ? (
          <div className="filter" style={{ marginTop: "20px" }}>
            <FormCampus
              onFinish={onFinish}
              dataEdit={dataEdit}
              editStatusButton={editStatusButton}
              text={text}
              forms={form}
            />
          </div>
        ) : null}
        <Table dataSource={result} columns={columns} />
      </div>
    </>
  );
};

export default CampusManager;
