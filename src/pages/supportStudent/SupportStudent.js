import { UploadOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, Radio, Select, Spin, Upload } from 'antd';
import { array, object } from 'prop-types';
import React, { useEffect, useState } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import RegisterInternAPI from '../../API/RegisterInternAPI';
import CountDownCustorm from '../../components/CountDownCustorm';
import { getBusiness } from '../../features/businessSlice/businessSlice';
import { getListMajor } from '../../features/majorSlice/majorSlice';
import { getNarow } from '../../features/narrow';
import { getStudentId } from '../../features/StudentSlice/StudentSlice';
import { getTimeForm } from '../../features/timeDateSlice/timeDateSlice';
import { getLocal } from '../../ultis/storage';
import styles from './SupportStudent.module.css';

const { Option } = Select;
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
const SupportStudent = ({ studentById, listBusiness: { list }, narrow: { listNarrow } }) => {
  const infoUser = getLocal();
  const dispatch = useDispatch();
  const [file, setFile] = useState();
  const [value, setValue] = useState(1);
  const [spin, setSpin] = useState(false);
  const { time } = useSelector((state) => state.time.formTime);
  const [form] = Form.useForm();
  useEffect(() => {
    dispatch(getStudentId(infoUser));
    dispatch(
      getTimeForm({
        typeNumber: value,
        semester_id: infoUser.student.smester_id,
      }),
    );
    dispatch(
      getBusiness({
        campus_id: infoUser.student?.campus_id,
        smester_id: infoUser.student?.smester_id,
        majors: infoUser.student?.majors,
      }),
    );
    dispatch(getListMajor());
    dispatch(getNarow());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    dispatch,
    infoUser.student?.smester_id,
    spin,
    studentById.student?.campus_id,
    studentById.student?.majors,
    studentById.student?.smester_id,
    value,
  ]);
  function guardarArchivo(files, data) {
    const file = files; //the file

    var reader = new FileReader(); //this for convert to Base64
    reader.readAsDataURL(file); //start conversion...
    reader.onload = function (e) {
      //.. once finished..
      var rawLog = reader.result.split(',')[1]; //extract only thee file data part
      var dataSend = {
        dataReq: { data: rawLog, name: file.name, type: file.type },
        fname: 'uploadFilesToGoogleDrive',
      }; //preapre info to send to API
      fetch(
        `https://script.google.com/macros/s/AKfycbzu7yBh9NkX-lnct-mKixNyqtC1c8Las9tGixv42i9o_sMYfCvbTqGhC5Ps8NowC12N/exec
    `, //your AppsScript URL
        { method: 'POST', body: JSON.stringify(dataSend) },
      ) //send to Api
        .then((res) => res.json())
        .then((a) => {
          let newData = { ...data, CV: a.url };
          RegisterInternAPI.upload(newData)
            .then((res) => {
              setSpin(true);
              message.success(res.data.message).then(() => {
                setValue(2);
                setSpin(false);
              });
            })
            .catch(async (err) => {
              const dataErr = await err.response.data;
              if (!dataErr.status) {
                message.error(`${dataErr.message}`);
              } else {
                message.error(`${dataErr.message}`);
              }
            });
          setSpin(false);
        })
        .catch((e) => {
          message.success('C?? l???i x???y ra! Vui l??ng ????ng k?? l???i');
          form.resetFields();
          setSpin(false);
        }); // Or Error in console
    };
  }

  const props = {
    beforeUpload: (file) => {
      const isPDF = file.type === 'application/pdf';
      if (!isPDF) {
        message.error(`${file.name} kh??ng ph???i l?? file PDF`);
      }

      return isPDF || Upload.LIST_IGNORE;
    },
    onChange: (info) => {
      setFile(info.file.originFileObj);
    },
  };

  const onChange = (e) => {
    setValue(e.target.value);
  };

  let timeCheck = time;
  if (studentById.listTimeForm && studentById.listTimeForm.length > 0) {
    const checkTimeStudent = studentById.listTimeForm.find((item) => item.typeNumber === value);
    if (checkTimeStudent) {
      timeCheck = checkTimeStudent;
    }
  }

  const check =
    timeCheck &&
    timeCheck.endTime > new Date().getTime() &&
    timeCheck.startTime < new Date().getTime();
  const isCheck = studentById?.statusCheck === 10 || studentById?.statusCheck === 1;
  const dataNarrow =
    studentById && studentById?.majors && studentById?.majors?._id && listNarrow.length > 0
      ? listNarrow.filter((item) => item?.id_majors?._id === studentById?.majors?._id)
      : [];
  const onFinish = async (values) => {
    setSpin(true);
    try {
      if ((value === 1 && values.upload === undefined) || values.upload === null) {
        message.error('Vui l??ng t???i CV ?????nh d???ng PDF c???a b???n l??n FORM ????ng k??');
        setSpin(false);
        return;
      }
      const data = {
        ...values,
        support: value,
        majors: studentById?.majors,
        name: studentById?.name,
        user_code: infoUser?.student?.mssv,
        email: infoUser?.student?.email,
        typeNumber: value,
        semester_id: infoUser.student.smester_id,
        checkTime: check,
        _id: infoUser.student._id,
      };

      if (value === 0) {
        setSpin(true);
        const resData = await RegisterInternAPI.upload({ ...data, CV: null });
        message.success(resData.data.message);
        setSpin(false);
      } else if (value === 1) {
        await guardarArchivo(file, data);
      }
    } catch (error) {
      const dataErr = await error.response.data.message;
      message.error(dataErr);
      setSpin(false);
    }
  };

  return (
    <>
      <Spin spinning={spin}>
        <Form
          {...formItemLayout}
          form={form}
          className={styles.form}
          name="register"
          onFinish={onFinish}
          initialValues={{
            residence: ['zhejiang', 'hangzhou', 'xihu'],
            prefix: '86',
          }}
          fields={[
            {
              name: ['support'],
              value: value,
            },
          ]}
          scrollToFirstError
        >
          {isCheck ? (
            <>
              {check ? (
                <>{isCheck ? <CountDownCustorm time={timeCheck} /> : ''}</>
              ) : value === 1 ? (
                <p style={{ marginBottom: '16px' }}>
                  Th???i gian ????ng k?? form h??? tr??? ch??a m???, sinh vi??n vui l??ng ch??? th??ng b??o t??? ph??ng
                  QHDN
                </p>
              ) : (
                <p style={{ marginBottom: '16px' }}>
                  Th???i gian ????ng k?? form t??? t??m n??i th???c t???p ch??a m???, sinh vi??n vui l??ng ch??? th??ng
                  b??o t??? ph??ng QHDN
                </p>
              )}
              <>
                <Form.Item name="support" label="Ki???u ????ng k??">
                  <Radio.Group onChange={onChange}>
                    <Radio value={1}>Nh?? tr?????ng h??? tr???</Radio>
                    <Radio value={0}>T??? t??m n??i th???c t???p</Radio>
                  </Radio.Group>
                </Form.Item>

                {check ? (
                  <>
                    <Form.Item
                      // name="user_code"
                      label="M?? sinh vi??n"
                    >
                      <p className={styles.text_form_label}>{studentById.mssv.toUpperCase()}</p>
                    </Form.Item>

                    <Form.Item label="H??? v?? T??n">
                      <p className={styles.text_form_label}>{studentById.name}</p>
                    </Form.Item>
                    <Form.Item
                      name="phone"
                      label="S??? ??i???n tho???i"
                      rules={[
                        {
                          required: true,
                          min: 10,
                          max: 13,
                          pattern: new RegExp(
                            '^(0|84)(2(0[3-9]|1[0-6|8|9]|2[0-2|5-9]|3[2-9]|4[0-9]|5[1|2|4-9]|6[0-3|9]|7[0-7]|8[0-9]|9[0-4|6|7|9])|3[2-9]|5[5|6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])([0-9]{7})$',
                          ),
                          message: 'Vui l??ng nh???p ????ng s??? ??i???n tho???i',
                        },
                      ]}
                    >
                      <Input placeholder="S??? ??i???n tho???i" />
                    </Form.Item>

                    <Form.Item
                      name="address"
                      label="?????a ch???"
                      rules={[
                        {
                          required: true,
                          message: 'Vui l??ng nh???p ?????a ch???',
                        },
                      ]}
                    >
                      <Input placeholder="?????a ch???" />
                    </Form.Item>

                    <Form.Item
                      name="narrow"
                      label="Chuy??n ng??nh"
                      rules={[
                        {
                          required: true,
                          message: 'Vui l??ng ch???n chuy??n ng??nh',
                        },
                      ]}
                    >
                      <Select
                        placeholder="Ch???n chuy??n ng??nh"
                        style={{
                          width: '50%',
                          marginLeft: '20px',
                        }}
                      >
                        {dataNarrow
                          // .filter((i) => i.id_majors === studentById.majors._id)
                          .map((i, k) => (
                            <Option key={k} value={i._id}>
                              {i.name}
                            </Option>
                          ))}
                      </Select>
                    </Form.Item>

                    {value === 1 && (
                      <Form.Item
                        name="business"
                        label="????n v??? th???c t???p"
                        rules={[
                          {
                            required: true,

                            message: 'Vui l??ng ch???n doanh nghi???p',
                          },
                        ]}
                      >
                        <Select
                          style={{
                            width: '50%',
                            marginLeft: '20px',
                          }}
                          placeholder="Ch???n doanh nghi???p"
                        >
                          {list?.map((item) => (
                            <Option key={item._id} value={item._id}>
                              {item.name + '-' + item.internshipPosition}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    )}
                    <Form.Item
                      name="dream"
                      label="V??? tr?? th???c t???p"
                      rules={[
                        {
                          required: true,
                          message: 'Vui l??ng nh???p ?????a ch???',
                        },
                      ]}
                    >
                      <Input placeholder="VD: Web Back-end, D???ng phim, Thi???t k??? n???i th???t" />
                    </Form.Item>
                    {value === 1 ? (
                      <Form.Item valuePropName="upload" name="upload" label="Upload CV (PDF)">
                        <Upload {...props} maxCount={1}>
                          <Button
                            style={{
                              marginLeft: '20px',
                            }}
                            icon={<UploadOutlined />}
                          >
                            Click to upload
                          </Button>
                        </Upload>
                      </Form.Item>
                    ) : (
                      <>
                        <Form.Item
                          name="unit"
                          className={styles.form.input}
                          label="????n v??? th???c t???p"
                          rules={[
                            {
                              required: true,
                              message: 'Vui l??ng nh???p ????n v??? th???c t???p',
                            },
                          ]}
                        >
                          <Input placeholder="????n v??? th???c t???p/T??n doanh nghi???p" />
                        </Form.Item>
                        <Form.Item
                          name="unitAddress"
                          label="?????a ch??? th???c t???p"
                          rules={[
                            {
                              required: true,
                              message: 'Vui l??ng nh???p ?????a ch??? th???c t???p',
                            },
                          ]}
                        >
                          <Input placeholder="?????a ch??? ????n v??? th???c t???p" />
                        </Form.Item>
                        <Form.Item
                          name="taxCode"
                          label="M?? s??? thu???"
                          rules={[
                            {
                              required: true,
                              pattern: new RegExp('^[0-9]*$'),
                              message: 'Vui l??ng nh???p M?? s??? thu???',
                            },
                          ]}
                        >
                          <Input placeholder="M?? s??? thu???" />
                        </Form.Item>

                        <Form.Item
                          name="position"
                          label="Ch???c v??? ng?????i ti???p nh???n"
                          rules={[
                            {
                              required: true,
                              message: 'Vui l??ng nh???p ch???c v??? ng?????i ti???p nh???n sinh vi??n',
                            },
                          ]}
                        >
                          <Input placeholder="Ch???c v??? ng?????i ti???p nh???n" />
                        </Form.Item>

                        <Form.Item
                          name="numberEnterprise"
                          label="S??? ??i???n tho???i doanh nghi???p"
                          rules={[
                            {
                              required: true,
                              pattern: new RegExp(
                                '^(0|84)(2(0[3-9]|1[0-6|8|9]|2[0-2|5-9]|3[2-9]|4[0-9]|5[1|2|4-9]|6[0-3|9]|7[0-7]|8[0-9]|9[0-4|6|7|9])|3[2-9]|5[5|6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])([0-9]{7})$',
                              ),
                              message: 'Vui l??ng nh???p S??? ??i???n tho???i doanh nghi???p',
                            },
                          ]}
                        >
                          <Input placeholder="S??? ??i???n tho???i doanh nghi???p(VD:Gi??m ?????c, Leader, Hr)" />
                        </Form.Item>

                        <Form.Item
                          name="emailEnterprise"
                          label="Email ng?????i ti???p nh???n"
                          rules={[
                            {
                              required: true,
                              pattern: new RegExp('[a-z0-9]+@[a-z]+.[a-z]{2,3}'),
                              message: 'Vui l??ng nh???p Email ng?????i ti???p nh???n',
                            },
                          ]}
                        >
                          <Input placeholder="Email ng?????i ti???p nh???n" />
                        </Form.Item>
                      </>
                    )}
                    <Form.Item {...tailFormItemLayout}>
                      <Button className={styles.button2} type="primary" htmlType="submit">
                        {studentById?.statusCheck === 1 ? 'S???a th??ng tin' : '????ng k??'}
                      </Button>
                    </Form.Item>
                  </>
                ) : (
                  ''
                )}
              </>
            </>
          ) : (
            // studentById.statusCheck === 3 ? (
            //   "Sinh vi??n ???? tr?????t k??? th???c t???p. Ch??c em s??? c??? g???ng h??n v??o k??? th???c t???p sau"
            // ) : studentById.statusCheck === 9 ? (
            //   "Ch??c m???ng sinh vi??n ???? ho??n th??nh k??? th???c t???p"
            // ) :
            '????ng k?? th??ng tin th??nh c??ng'
          )}
        </Form>
      </Spin>
    </>
  );
};
SupportStudent.propTypes = {
  studentById: object,
  infoUser: object,
  business: object,
  narrow: array,
};
export default connect(
  ({
    auth: { infoUser },
    students: { studentById },
    business: { listBusiness },
    narrow,
    global,
  }) => ({
    studentById,
    infoUser,
    listBusiness,
    narrow,
    isMobile: global.isMobile,
  }),
)(SupportStudent);
