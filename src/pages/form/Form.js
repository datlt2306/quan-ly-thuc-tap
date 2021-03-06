import { UploadOutlined } from "@ant-design/icons";
import { Input, Button, message, Spin, Form, Upload, DatePicker } from "antd";
import { object } from "prop-types";
import React, { useEffect, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import ReportFormAPI from "../../API/ReportFormAPI";
import CountDownCustorm from "../../components/CountDownCustorm";
import { getStudentId } from "../../features/StudentSlice/StudentSlice";
import { getTimeForm } from "../../features/timeDateSlice/timeDateSlice";
import { getLocal } from "../../ultis/storage";

import styles from "./Form.module.css";

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};
const Formrp = ({ studentById }) => {
  const infoUser = getLocal();
  const { time } = useSelector((state) => state.time.formTime);
  const [spin, setSpin] = useState(false);
  const [startDate, setStartDate] = useState();
  const [file, setFile] = useState();
  const [form] = Form.useForm();

  const mssv = infoUser.student?.mssv;
  const email = infoUser?.student?.email;
  const dispatch = useDispatch();
  const datePicker = (date, dateString) => {
    setStartDate(date._d);
  };

  useEffect(() => {
    dispatch(
      getTimeForm({
        typeNumber: 2,
        semester_id: infoUser.student?.smester_id,
      })
    );
    dispatch(getStudentId(infoUser));
  }, [dispatch, infoUser.student?.smester_id]);

  function guardarArchivo(files, data) {
    const file = files; //the file
    const urlGGDriveCV = `https://script.google.com/macros/s/AKfycbzu7yBh9NkX-lnct-mKixNyqtC1c8Las9tGixv42i9o_sMYfCvbTqGhC5Ps8NowC12N/exec
     `;

    var reader = new FileReader(); //this for convert to Base64
    reader.readAsDataURL(file); //start conversion...
    reader.onload = function (e) {
      //.. once finished..
      var rawLog = reader.result.split(",")[1]; //extract only thee file data part
      var dataSend = {
        dataReq: { data: rawLog, name: file.name, type: file.type },
        fname: "uploadFilesToGoogleDrive",
      }; //preapre info to send to API
      fetch(
        urlGGDriveCV, //your AppsScript URL
        { method: "POST", body: JSON.stringify(dataSend) }
      ) //send to Api
        .then((res) => res.json())
        .then((a) => {
          const newData = { ...data, form: a.url };
          console.log("start")
          ReportFormAPI.uploadForm(newData)
            .then((res) => {
              console.log("resThanh", res)
              message.success(res.data.message);
              setFile("");
              form.resetFields();
            })
            .catch((err) => {
              console.log("errThanh", err)
              const dataErr = err.response.data;
              if (!dataErr.status) {
                message.error(`${dataErr.message}`);
                form.resetFields();
              } else {
                message.error(`${dataErr.message}`);
              }
            });
          console.log("end")
          setSpin(false);
        })
        .catch((e) => {
          message.success("C?? l???i x???y ra! Vui l??ng ????ng k?? l???i");
          form.resetFields();
          setSpin(false);
        }); // Or Error in console
    };
  }

  const props = {
    beforeUpload: (file) => {
      const isFile =
        file.type === "application/pdf" ||
        file.type === "image/jpeg" ||
        file.type === "image/jpg";
      if (!isFile) {
        message.error(`${file.name} kh??ng ph???i l?? file PDF ho???c ???nh`);
      }

      return isFile || Upload.LIST_IGNORE;
    },
    onChange: (info) => {
      setFile(info.file.originFileObj);
    },
  };

  let timeCheck = time;
  if (studentById.listTimeForm && studentById.listTimeForm.length > 0) {
    const checkTimeStudent = studentById.listTimeForm.find(
      (item) => item.typeNumber === 2
    );
    if (checkTimeStudent) {
      timeCheck = checkTimeStudent;
    }
  }
  const [isCheck, setIsCheck] = useState(true)
  useEffect(() => {
    // eslint-disable-next-line no-unused-expressions
    (studentById && studentById?.statusCheck === 2) ||
    studentById?.statusCheck === 5
  })
  console.log("isCheck", isCheck)
  const check =
    timeCheck &&
    timeCheck.endTime > new Date().getTime() &&
    timeCheck.startTime < new Date().getTime();
  // const isCheck =
  //   (studentById && studentById?.statusCheck === 2) ||
  //   studentById?.statusCheck === 5;
  const nameCompany =
    studentById.support === 0 ? studentById.nameCompany : studentById.business;
  const onFinish = async (values) => {
    setSpin(true);
    try {
      const newData = {
        ...values,
        mssv: mssv,
        email: email,
        typeNumber: time.typeNumber,
        internshipTime: startDate,
        semester_id: infoUser.student.smester_id,
        checkTime: check,
        _id: infoUser.student._id
      };

      if (values.upload === undefined || values.upload === null) {
        message.error(
          "Vui l??ng t???i file Bi??n b???n ?????nh d???ng PDF c???a b???n l??n FORM bi??n b???n"
        );
        setSpin(false);
        return;
      }
      const data = await guardarArchivo(file, newData);
      console.log("dataavv", data)
      // setIsCheck(false)
    } catch (error) {
      const dataErr = await error.response.data;
      message.error(dataErr.message);
    }
  };
  const config = {
    rules: [
      {
        type: "object",
        required: true,
        message: "Vui l??ng nh???p ng??y b???t ?????u th???c t???p!",
      },
    ],
  };

  const configNameCompany = {
    rules: [
      {
        required: true,
        message: "Vui l??ng nh???p t??n doanh nghi???p",
      },
    ],
  };
  return (
    <>
      {check ? (
        isCheck ? (
          <>
            {" "}
            {check && <CountDownCustorm time={timeCheck} />}
            <Spin spinning={spin}>
              <Form
                {...formItemLayout}
                className={styles.form}
                name="register"
                onFinish={onFinish}
              >
                {nameCompany ? null : (
                  <Form.Item
                    name="nameCompany"
                    label="T??n doanh nghi???p"
                    {...(nameCompany ? null : configNameCompany)}
                  >
                    <Input placeholder="T??n doanh nghi???p" />
                  </Form.Item>
                )}
                <Form.Item label="M?? sinh vi??n">
                  <p className={styles.text_form_label}>
                    {studentById.mssv}
                  </p>
                </Form.Item>
                <Form.Item label="H??? v?? T??n">
                  <p className={styles.text_form_label}>{studentById.name}</p>
                </Form.Item>
                <Form.Item
                  name="internshipTime"
                  label="Th???i gian b???t ?????u th???c t???p"
                  {...config}
                >
                  <DatePicker onChange={datePicker} placeholder="B???t ?????u" />
                </Form.Item>
                <Form.Item
                  name="upload"
                  label="Upload bi??n b???n (Image or PDF)"
                  valuePropName="upload"
                >
                  <Upload {...props} maxCount={1}>
                    <Button icon={<UploadOutlined />}>Click to upload</Button>
                  </Upload>
                </Form.Item>
                <Form.Item
                  wrapperCol={{
                    xs: {
                      span: 24,
                      offset: 0,
                    },
                    sm: {
                      span: 16,
                      offset: 8,
                    },
                  }}
                >
                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button>
                </Form.Item>
              </Form>
            </Spin>
          </>
        ) : studentById && !studentById.form ? (
          "B???n ph???i n???p th??nh c??ng CV tr?????c"
        ) : (
          "B???n ???? n???p bi??n b???n th??nh c??ng."
        )
      ) : (
        <p>Ch??a ?????n th???i gian n???p bi??n b???n</p>
      )}
    </>
  );
};
Formrp.propTypes = {
  infoUser: object,
  studentById: object,
};

export default connect(({ students: { studentById } }) => ({
  studentById,
}))(Formrp);
