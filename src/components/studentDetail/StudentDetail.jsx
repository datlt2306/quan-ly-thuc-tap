import { EditOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  DatePicker,
  Input,
  message,
  Modal,
  Row,
  Select,
  Spin,
  Form,
  InputNumber,
} from "antd";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import StudentAPI from "../../API/StudentAPI";
import { getListTime } from "../../features/timeDateSlice/timeDateSlice";
import moment from "moment";
import {
  statusConfigCV,
  statusConfigForm,
  statusConfigReport,
} from "../../ultis/constConfig";
import "./studentDetail.css";
import { getBusiness } from "../../features/businessSlice/businessSlice";
import { fetchManager } from "../../features/managerSlice/managerSlice";
const optionCheck = [1, 5, 8, 3];
const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;
const dateFormat = "DD/MM/YYYY hh:mm:ss";
const dateFormatInput = "YYYY/MM/DD";
const StudentDetail = (props) => {
  const { studentId, closeModal, infoUser } = props;
  const {
    formTime: { times },
  } = useSelector((state) => state.time);
  const [student, setStudent] = useState({});
  const [isShowSelectStatus, setIsShowSelectStatus] = useState(false);
  const [isEditReviewer, setIsEditReviewer] = useState(false);
  const [isEditBusiness, setIsEditBusiness] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState(0);
  const [isShowNote, setIsShowNote] = useState(false);
  const [note, setNote] = useState("");
  const [isSetNote, setIsSetNote] = useState(false);
  const [noteDetail, setNoteDetail] = useState("");
  const [listOption, setListOption] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [timeStudent, setTimeStudent] = useState({});
  const { listBusiness } = useSelector((state) => state.business);
  const { listManager } = useSelector((state) => state.manager);
  const [date, setDate] = useState(null);
  const [fieldStudent, setFieldStudent] = useState("");
  const dispatch = useDispatch();
  const onSetDatePicker = (date) => {
    setDate(date);
  };
  const getDataStudent = useCallback(async () => {
    setIsLoading(true);
    const { data } = await StudentAPI.getStudentById(studentId);
    if (data) {
      setStudent(data);
      setNoteDetail(data.note);
      dispatch(getBusiness({ majors: data.majors._id }));
      dispatch(getListTime(data.smester_id._id));
    }
    setIsLoading(false);
  }, [studentId]);

  useEffect(() => {
    dispatch(fetchManager());
  }, []);

  useEffect(() => {
    getDataStudent();
  }, [dispatch, getDataStudent, studentId]);

  const renderTime = (time) => {
    return moment(new Date(time), "MM-DD-YYYY HH:mm", true).format(
      "DD-MM-YYYY HH:mm"
    );
  };

  const onSetIsUpdateStudentTime = (time) => {
    setTimeStudent(time);
  };

  const onEditField = (field) => {
    setFieldStudent(field);
  };

  const renderStatus = (status) => {
    if (status === 0) {
      return (
        <span className="status-fail" style={{ color: "orange" }}>
          Ch??? ki???m tra
        </span>
      );
    } else if (status === 1) {
      return (
        <span className="status-up" style={{ color: "grey" }}>
          S???a l???i CV
        </span>
      );
    } else if (status === 2) {
      return (
        <span className="status-fail" style={{ color: "red" }}>
          {student.support === 0 ? " Ch??? n???p bi??n b???n" : " Nh???n CV"}
        </span>
      );
    } else if (status === 3) {
      return (
        <span className="status-fail" style={{ color: "red" }}>
          Tr?????t
        </span>
      );
    } else if (status === 4) {
      return (
        <span className="status-fail" style={{ color: "red" }}>
          ???? n???p bi??n b???n <br />
        </span>
      );
    } else if (status === 5) {
      return (
        <span className="status-fail" style={{ color: "red" }}>
          S???a bi??n b???n
          <br />
        </span>
      );
    } else if (status === 6) {
      return (
        <span className="status-fail" style={{ color: "red" }}>
          ??ang th???c t???p <br />
        </span>
      );
    } else if (status === 7) {
      return (
        <span className="status-fail" style={{ color: "red" }}>
          ???? n???p b??o c??o <br />
        </span>
      );
    } else if (status === 8) {
      return (
        <span className="status-fail" style={{ color: "red" }}>
          S???a b??o c??o <br />
        </span>
      );
    } else if (status === 9) {
      return (
        <span className="status-fail" style={{ color: "red" }}>
          Ho??n th??nh <br />
        </span>
      );
    } else {
      return (
        <span className="status-fail" style={{ color: "red" }}>
          Ch??a ????ng k??
        </span>
      );
    }
  };

  const onSaveTimeStudent = async () => {
    if (date && date.length > 0) {
      const startTime = date[0]._d.getTime();
      const endTime = date[1]._d.getTime();
      const timeObject = {
        typeNumber: Number(timeStudent.typeNumber),
        startTime: startTime,
        endTime: endTime,
        typeName: timeStudent.typeName,
      };
      if (student.listTimeForm && student.listTimeForm.length > 0) {
        const timeCheck = student.listTimeForm.find(
          (item) => item.typeNumber === timeStudent.typeNumber
        );
        if (timeCheck) {
          timeCheck.startTime = startTime;
          timeCheck.endTime = endTime;
        }
        {
          student.listTimeForm.push(timeObject);
        }
      } else {
        student.listTimeForm.push(timeObject);
      }
      setTimeStudent(null);
      setIsLoading(true);
      const { data } = await StudentAPI.updateStudent(student);
      if (data) {
        setStudent(data);
        message.success("Thay ?????i th???i gian form th??nh c??ng");
        setIsLoading(false);
      }
    }
  };

  // ch???nh s???a th??ng tin t???ng tr?????ng sinh vi??n
  const onFinish = (values) => {
    values._id = studentId;
    if (values.internshipTime) {
      values.internshipTime = values.internshipTime._d;
    } else if (values.endInternShipTime) {
      values.endInternShipTime = values.endInternShipTime._d;
    }
    StudentAPI.updateStudent(values).then((res) => {
      if (res.status === 200) {
        message.success("Th??nh c??ng");
        setStudent(res.data);
        onCloseFormField();
      } else {
        message.success("Th???t b???i");
        onCloseFormField();
      }
    });
  };

  const onCloseFormField = () => {
    setFieldStudent("");
  };

  const handelChangeText = (e) => {
    if (e.target.value !== "") {
      setNote(e.target.value);
      setSubmitStatus(true);
    } else {
      setSubmitStatus(false);
    }
  };

  const onSelectStatus = (value) => {
    if (value !== +student.statusCheck) {
      if (optionCheck.includes(value)) {
        setIsShowNote(true);
        setStatusUpdate(value);
      } else {
        setSubmitStatus(true);
        setStatusUpdate(value);
      }
    } else {
      setSubmitStatus(false);
      setIsShowNote(false);
    }
  };
  const onSetStatus = () => {
    setIsShowSelectStatus(!isShowSelectStatus);
  };

  const onShowEditReviewer = () => {
    setIsEditReviewer(!isEditReviewer);
  };

  const onShowEditBusiness = () => {
    setIsEditBusiness(!isEditBusiness);
  };

  const onSetReviewer = async (value) => {
    const { data } = await StudentAPI.updateReviewerSudent({
      listIdStudent: [student._id],
      email: value,
    });
    if (data) {
      getDataStudent();
      setIsEditReviewer(false);
      message.success("Th??nh c??ng");
    }
  };

  const onChangeTextArea = (e) => {
    if (e.target.value !== "") {
      setIsSetNote(true);
      setNoteDetail(e.target.value);
    }
  };

  const onUpdateStatus = async () => {
    if (window.confirm("B???n c?? ch???c ch???n mu???n ?????i tr???ng th??i kh??ng?")) {
      const { data } = await StudentAPI.updateStatusSudent({
        listIdStudent: [student._id],
        listEmailStudent: [{ email: student.email }],
        email: infoUser?.manager?.email,
        status: statusUpdate,
        textNote: note,
      });
      if (data.listStudentChangeStatus.length > 0) {
        getDataStudent();
        setStatusUpdate(false);
        setSubmitStatus(false);
        setIsShowSelectStatus(false);
        setIsShowNote(false);
        message.success("Th??nh c??ng");
      }
    }
  };

  const onUpdateNote = async () => {
    const { data } = await StudentAPI.updateStatusSudent({
      listIdStudent: [student._id],
      listEmailStudent: [{ email: student.email }],
      email: infoUser?.manager?.email,
      status: student.statusCheck,
      textNote: noteDetail,
    });
    if (data.listStudentChangeStatus.length > 0) {
      setIsSetNote(false);
      getDataStudent();
      message.success("C???p nh???t ghi ch?? th??nh c??ng");
    }
  };

  const onSelectBusiness = async (value) => {
    const { data } = await StudentAPI.updateBusinessStudent({
      listIdStudent: [student._id],
      business: value,
    });
    if (data) {
      getDataStudent();
      setIsEditBusiness(false);
      message.success("Th??nh c??ng");
    }
  };

  useEffect(() => {
    if (
      student.CV &&
      !student.form &&
      !student.report &&
      student.statusCheck !== 3 &&
      student.support === 1
    ) {
      setListOption(statusConfigCV);
    } else if (
      (student.CV || (!student.CV && student.support === 0)) &&
      student.form &&
      !student.report &&
      student.statusCheck !== 3 &&
      student.statusCheck !== 6
    ) {
      setListOption(statusConfigForm);
    } else if (
      student.CV &&
      student.form &&
      student.report &&
      student.statusCheck !== 6
    ) {
      setListOption(statusConfigReport);
    } else {
      setListOption([]);
    }
  }, [student.CV, student.form, student.report, student.statusCheck]);

  const checkFormTime = (time) => {
    if (student.listTimeForm && student.listTimeForm.length > 0) {
      const check = student.listTimeForm.find(
        (item) => item.typeNumber === time.typeNumber
      );
      if (check) {
        return check;
      }
    }
    return time;
  };
  return (
    <Modal
      className="showModal"
      width="90%"
      title="Chi ti???t sinh vi??n"
      onCancel={closeModal}
      visible={true}
    >
      {isLoading ? (
        <div className="d-flex m-5 p-5 justify-content-center">
          <Spin />
        </div>
      ) : (
        <div>
          <h4 className="text-center">Th??ng tin sinh vi??n</h4>
          <Row className="col-md-16 mt-3">
            <Col
              xs={{ span: 24 }}
              sm={{ span: 24 }}
              md={{ span: 14 }}
              span={14}
              className="border-right"
              style={{ paddingRight: 20 }}
            >
              <Row className="d-flex align-items-center">
                <Col
                  xs={{ span: 24 }}
                  sm={{ span: 24 }}
                  md={{ span: 12 }}
                  className="d-flex"
                >
                  <h6>H??? t??n: </h6>
                  <span className="ms-2">
                    {student.name ? student.name : "Kh??ng c??"}
                  </span>
                </Col>
                <Col xs={{ span: 24 }} md={{ span: 12 }} className="d-flex">
                  <h6>T??n c??ng ty: </h6>
                  {student.support === 1 ? (
                    <span className="ms-2">
                      {student.business?.name
                        ? student.business?.name
                        : "Kh??ng c??"}
                    </span>
                  ) : (
                    <span className="ms-2">
                      {student.nameCompany ? student.nameCompany : "Kh??ng c??"}
                    </span>
                  )}
                </Col>
                <Col xs={{ span: 24 }} md={{ span: 12 }} className="d-flex">
                  <h6>M?? sinh vi??n: </h6>
                  <span className="ms-2">
                    {student.mssv ? student.mssv : "Kh??ng c??"}
                  </span>
                </Col>
                <Col xs={{ span: 24 }} md={{ span: 12 }} className="d-flex">
                  <h6>?????a ch??? c??ng ty: </h6>
                  {student.support === 1 ? (
                    <span className="ms-2">
                      {student.business?.address
                        ? student.business?.address
                        : "Kh??ng c??"}
                    </span>
                  ) : (
                    <span className="ms-2">
                      {student.addressCompany
                        ? student.addressCompany
                        : "Kh??ng c??"}
                    </span>
                  )}
                </Col>
                <Col xs={{ span: 24 }} md={{ span: 12 }} className="d-flex">
                  <h6>Email: </h6>
                  <span className="ms-2">
                    {student.email ? student.email : "Kh??ng c??"}
                  </span>
                </Col>
                <Col xs={{ span: 24 }} md={{ span: 12 }} className="d-flex">
                  <h6>M?? s??? thu???: </h6>
                  {student.support === 1 ? (
                    <span className="ms-2">
                      {student.business?.taxCode
                        ? student.business?.taxCode
                        : "Kh??ng c??"}
                    </span>
                  ) : (
                    <span className="ms-2">
                      {student.taxCode ? student.taxCode : "Kh??ng c??"}
                    </span>
                  )}
                </Col>
                <Col xs={{ span: 24 }} md={{ span: 12 }} className="d-flex">
                  <h6>Chuy??n ng??nh: </h6>
                  <span className="ms-2">
                    {student.majors ? student.majors.name : "Kh??ng c??"}
                  </span>
                </Col>
                <Col xs={{ span: 24 }} md={{ span: 12 }} className="d-flex">
                  <h6>V??? tr?? th???c t???p: </h6>
                  {student.support === 1 ? (
                    <span className="ms-2">
                      {student.business?.internshipPosition
                        ? student.business?.internshipPosition
                        : "Kh??ng c??"}
                    </span>
                  ) : (
                    <span className="ms-2">
                      {student.position ? student.position : "Kh??ng c??"}
                    </span>
                  )}
                </Col>
                <Col xs={{ span: 24 }} md={{ span: 12 }} className="d-flex">
                  <h6>Kho?? h???c: </h6>
                  <span className="ms-2">
                    {student.course ? student.course : "Kh??ng c??"}
                  </span>
                </Col>
                <Col xs={{ span: 24 }} md={{ span: 12 }} className="d-flex">
                  <h6>S??T c??ng ty: </h6>
                  <span className="ms-2">
                    {student.phoneNumberCompany
                      ? student.phoneNumberCompany
                      : "Kh??ng c??"}
                  </span>
                </Col>
                <Col xs={{ span: 24 }} md={{ span: 12 }} className="d-flex">
                  <h6>K??? th???c t???p: </h6>
                  <span className="ms-2">
                    {student?.smester_id?.name
                      ? student.smester_id?.name
                      : "Kh??ng c??"}
                  </span>
                </Col>
                <Col xs={{ span: 24 }} md={{ span: 12 }} className="d-flex">
                  <h6>Email ng?????i x??c nh???n: </h6>
                  <span className="ms-2">
                    {student.emailEnterprise
                      ? student.emailEnterprise
                      : "Kh??ng c??"}
                  </span>
                </Col>
                <Col xs={{ span: 24 }} md={{ span: 12 }} className="d-flex">
                  <h6>S??? ??i???n tho???i: </h6>
                  <span className="ms-2">
                    {student?.phoneNumber ? student?.phoneNumber : "kh??ng c??"}
                  </span>
                </Col>
                <Col xs={{ span: 24 }} md={{ span: 12 }}>
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex">
                      <h6>Ng??y b???t ?????u th???c t???p: </h6>
                      <span className="ms-2">
                        {student.internshipTime
                          ? renderTime(student.internshipTime)
                          : "Kh??ng c??"}
                      </span>
                    </div>
                    {student.internshipTime && (
                      <EditOutlined
                        onClick={() => onEditField("internshipTime")}
                      />
                    )}
                  </div>
                  {fieldStudent === "internshipTime" && student.internshipTime && (
                    <Form
                      name="basic"
                      // labelCol={{ span: 8 }}
                      // wrapperCol={{ span: 16 }}
                      initialValues={{ remember: true }}
                      onFinish={onFinish}
                      autoComplete="off"
                    >
                      <Form.Item
                        label="Ch???n th???i gian"
                        name="internshipTime"
                        rules={[
                          {
                            required: true,
                            message: "B???n ph???i ch???n th???i gian",
                          },
                        ]}
                      >
                        <DatePicker
                          defaultValue={moment(
                            student.internshipTime,
                            dateFormatInput
                          )}
                          format={dateFormatInput}
                        />
                      </Form.Item>

                      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Button
                          onClick={onCloseFormField}
                          type="danger"
                          htmlType="button"
                          className="me-4"
                        >
                          Hu???
                        </Button>
                        <Button type="primary" htmlType="submit">
                          L??u
                        </Button>
                      </Form.Item>
                    </Form>
                  )}
                </Col>
                <Col xs={{ span: 24 }} md={{ span: 12 }} className="d-flex">
                  <h6>?????a ch???: </h6>
                  <span className="ms-2">
                    {student?.address ? student?.address : "kh??ng c??"}
                  </span>
                </Col>
                <Col xs={{ span: 24 }} md={{ span: 12 }}>
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex">
                      <h6>Ng??y k???t th??c th???c t???p: </h6>
                      <span className="ms-2">
                        {student.endInternShipTime
                          ? renderTime(student.endInternShipTime)
                          : "Kh??ng c??"}
                      </span>
                    </div>
                    {student.endInternShipTime && (
                      <EditOutlined
                        onClick={() => onEditField("endInternShipTime")}
                      />
                    )}
                  </div>
                  {fieldStudent === "endInternShipTime" &&
                    student.internshipTime && (
                      <Form
                        name="basic"
                        // labelCol={{ span: 8 }}
                        // wrapperCol={{ span: 16 }}
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        autoComplete="off"
                      >
                        <Form.Item
                          label="Ch???n th???i gian"
                          name="endInternShipTime"
                          rules={[
                            {
                              required: true,
                              message: "B???n ph???i ch???n th???i gian",
                            },
                          ]}
                        >
                          <DatePicker
                            defaultValue={moment(
                              student.endInternShipTime,
                              dateFormatInput
                            )}
                          />
                        </Form.Item>

                        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                          <Button
                            onClick={onCloseFormField}
                            type="danger"
                            htmlType="button"
                            className="me-4"
                          >
                            Hu???
                          </Button>
                          <Button type="primary" htmlType="submit">
                            L??u
                          </Button>
                        </Form.Item>
                      </Form>
                    )}
                </Col>
                <Col xs={{ span: 24 }} md={{ span: 12 }} className="d-flex">
                  <h6>Ph??n lo???i: </h6>
                  {student.support !== null ? (
                    <span className="ms-2">
                      {student.support === 1 && "Nh??? nh?? tr?????ng h??? tr???"}
                      {student.support === 0 && "T??? t??m n??i th???c t???p"}
                    </span>
                  ) : (
                    <span className="ms-2">Ch??a nh???p form</span>
                  )}
                </Col>
                <Col xs={{ span: 24 }} md={{ span: 12 }}>
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex">
                      <h6>??i???m th??i ?????: </h6>
                      <span className="ms-2">
                        {student.attitudePoint
                          ? student.attitudePoint
                          : "Kh??ng c??"}
                      </span>
                    </div>
                    {student.attitudePoint && (
                      <EditOutlined
                        onClick={() => onEditField("attitudePoint")}
                      />
                    )}
                  </div>
                  {fieldStudent === "attitudePoint" && student.attitudePoint && (
                    <Form
                      name="basic"
                      // labelCol={{ span: 8 }}
                      // wrapperCol={{ span: 16 }}
                      initialValues={{ remember: true }}
                      onFinish={onFinish}
                      autoComplete="off"
                    >
                      <Form.Item label="Nh???p ??i???m th??i ?????" name="attitudePoint">
                        <InputNumber
                          defaultValue={student.attitudePoint}
                          type="number"
                          max={10}
                          min={0}
                        />
                      </Form.Item>

                      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Button
                          onClick={onCloseFormField}
                          type="danger"
                          htmlType="button"
                          className="me-4"
                        >
                          Hu???
                        </Button>
                        <Button type="primary" htmlType="submit">
                          L??u
                        </Button>
                      </Form.Item>
                    </Form>
                  )}
                </Col>

                <Col xs={{ span: 24 }} md={{ span: 12 }} className="d-flex">
                  <h6 className="me-2">Tr???ng th??i: </h6>
                  {renderStatus(student.statusCheck)}
                </Col>
                <Col xs={{ span: 24 }} md={{ span: 12 }}>
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex">
                      <h6>??i???m k???t th??c: </h6>
                      <span className="ms-2">
                        {student.resultScore ? student.resultScore : "Kh??ng c??"}
                      </span>
                    </div>
                    {student.resultScore && (
                      <EditOutlined
                        onClick={() => onEditField("resultScore")}
                      />
                    )}
                  </div>
                  {fieldStudent === "resultScore" && student.resultScore && (
                    <Form
                      name="basic"
                      // labelCol={{ span: 8 }}
                      // wrapperCol={{ span: 16 }}
                      initialValues={{ remember: true }}
                      onFinish={onFinish}
                      autoComplete="off"
                    >
                      <Form.Item label="Nh???p ??i???m k???t th??c" name="resultScore">
                        <InputNumber
                          defaultValue={student.resultScore}
                          type="number"
                          max={10}
                          min={0}
                        />
                      </Form.Item>

                      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Button
                          onClick={onCloseFormField}
                          type="danger"
                          htmlType="button"
                          className="me-4"
                        >
                          Hu???
                        </Button>
                        <Button type="primary" htmlType="submit">
                          L??u
                        </Button>
                      </Form.Item>
                    </Form>
                  )}
                </Col>
                <Col xs={{ span: 24 }} md={{ span: 12 }} className="d-flex">
                  <h6>CV: </h6>
                  {student.CV ? (
                    // eslint-disable-next-line jsx-a11y/anchor-is-valid
                    <a
                      className="ms-2 text-one-row"
                      onClick={() => window.open(student.CV)}
                    >
                      {student.CV}
                    </a>
                  ) : (
                    <span className="ms-2">Ch??a n???p</span>
                  )}
                </Col>
                <Col xs={{ span: 24 }} md={{ span: 12 }} className="d-flex">
                  <h6>Bi??n b???n: </h6>
                  {student.form ? (
                    <a
                      className="ms-2 text-one-row"
                      onClick={() => window.open(student.form)}
                    >
                      {student.form}
                    </a>
                  ) : (
                    <span className="ms-2">Ch??a n???p</span>
                  )}
                </Col>

                <Col xs={{ span: 24 }} md={{ span: 12 }} className="d-flex">
                  <h6>SV ???? ???????c h??? tr??? TT: </h6>
                  {student.support ? (
                    // eslint-disable-next-line jsx-a11y/anchor-is-valid
                    <p className="ms-2 text-one-row">{student.support}</p>
                  ) : (
                    <span className="ms-2">Ch??a ???????c h??? tr???</span>
                  )}
                </Col>

                <Col xs={{ span: 24 }} md={{ span: 12 }} className="d-flex">
                  <h6>B??o c??o: </h6>
                  {student.report ? (
                    <a
                      className="ms-2 text-one-row"
                      onClick={() => window.open(student.report)}
                    >
                      {student.report}
                    </a>
                  ) : (
                    <span className="ms-2">Ch??a n???p</span>
                  )}
                </Col>
              </Row>
            </Col>
            <Col
              xs={{ span: 24 }}
              sm={{ span: 24 }}
              md={{ span: 10 }}
              span={10}
            >
              <div className="detal-form-status">
                <div
                  className="d-flex justify-content-between align-items-center mb-3"
                  style={{ flexWrap: "wrap" }}
                >
                  <h6 className="mb-0 me-2 text-header-abc">Tr???ng th??i: </h6>
                  {isShowSelectStatus ? (
                    <Select
                      onChange={onSelectStatus}
                      defaultValue="Tr???ng th??i"
                      style={{ width: "50%" }}
                    >
                      {listOption &&
                        listOption.length > 0 &&
                        listOption.map((item, index) => (
                          <Option value={item.value} key={index}>
                            {item.title}
                          </Option>
                        ))}
                    </Select>
                  ) : (
                    renderStatus(student.statusCheck)
                  )}

                  {isShowNote && (
                    <Input
                      style={{ width: "100%", marginTop: 10, marginBottom: 10 }}
                      onChange={handelChangeText}
                      placeholder="Nh???p text note"
                    />
                  )}
                  {listOption &&
                  listOption.length > 0 &&
                  student.statusCheck !== 5 &&
                  student.statusCheck !== 8 &&
                  student.statusCheck !== 1 ? (
                    submitStatus ? (
                      <Button type="primary" onClick={onUpdateStatus}>
                        Th???c hi???n
                      </Button>
                    ) : (
                      !isShowNote && <EditOutlined onClick={onSetStatus} />
                    )
                  ) : (
                    <span></span>
                  )}
                </div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="mb-0 me-2 text-header-abc">Ng?????i review: </h6>
                  {isEditReviewer ? (
                    <Select
                      onChange={onSetReviewer}
                      defaultValue="Ch???n ng?????i review"
                      style={{ width: "50%" }}
                    >
                      {listManager && listManager?.length > 0 &&
                        listManager.map((item, index) => (
                          <Option key={index} value={item.email}>
                            {item.name} - {item.email}
                          </Option>
                        ))}
                    </Select>
                  ) : student.reviewer ? (
                    student.reviewer
                  ) : (
                    "Ch??a c??"
                  )}

                  {listOption && listOption.length > 0 ? (
                    <EditOutlined onClick={onShowEditReviewer} />
                  ) : (
                    <span></span>
                  )}
                </div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="mb-0 me-2 text-header-abc">C??ng ty: </h6>
                  {isEditBusiness && student.support === 1 && student.CV ? (
                    <Select
                      onChange={onSelectBusiness}
                      // defaultValue="Ch???n c??ng ty"
                      style={{ width: "60%" }}
                      defaultValue={student?.business?._id}
                    >
                      {listBusiness &&
                        student.CV &&
                        listBusiness.list &&
                        listBusiness.list.length > 0 &&
                        listBusiness.list.map((item, index) => (
                          <Option key={index} value={item._id}>
                            {item.name} - {item.internshipPosition} -{" "}
                            {item.majors.name}
                          </Option>
                        ))}
                    </Select>
                  ) : (
                    <span>
                      {student.support === 1 ? (
                        <span className="ms-2">
                          {student.business?.name
                            ? student.business?.name
                            : "Kh??ng c??"}
                        </span>
                      ) : (
                        <span className="ms-2">
                          {student.nameCompany
                            ? student.nameCompany
                            : "Kh??ng c??"}
                        </span>
                      )}
                    </span>
                  )}

                  {listBusiness &&
                  listBusiness.list &&
                  student.CV &&
                  listBusiness.list.length > 0 &&
                  student.support === 1 ? (
                    <EditOutlined onClick={onShowEditBusiness} />
                  ) : (
                    <span></span>
                  )}
                </div>
                <div className=" mb-3">
                  <h6 className="m-0">Th???i gian hi???n th??? form nh???p </h6>
                </div>
                <div>
                  <ul className="m-0 p-0 ms-3">
                    {times &&
                      times.length > 0 &&
                      times.map((time) => {
                        if (time.typeNumber !== 4) {
                          const studentFormTime = checkFormTime(time);
                          return (
                            <li
                              key={time._id}
                              className="form-time-text align-items-center"
                            >
                              <span className="text-upcatch">
                                {time.typeName}
                              </span>{" "}
                              :{" "}
                              {timeStudent &&
                              timeStudent?.typeNumber ===
                                studentFormTime.typeNumber ? (
                                <div>
                                  <RangePicker
                                    onChange={onSetDatePicker}
                                    showTime
                                    format={dateFormat}
                                    defaultValue={[
                                      moment(
                                        new Date(studentFormTime.startTime),
                                        dateFormat
                                      ),
                                      moment(
                                        new Date(studentFormTime.endTime),
                                        dateFormat
                                      ),
                                    ]}
                                    disabledDate={(current) => {
                                      let startDate = new Date(
                                        student.smester_id.start_time
                                      ).getTime();
                                      let endDate = new Date(
                                        student.smester_id.end_time
                                      ).getTime();
                                      return (
                                        (current &&
                                          new Date(current).getTime() <
                                            startDate) ||
                                        (current &&
                                          new Date(current).getTime() > endDate)
                                      );
                                    }}
                                  />
                                  <div className="my-2">
                                    <Button
                                      onClick={() => setTimeStudent({})}
                                      type="default"
                                    >
                                      Hu???
                                    </Button>
                                    <Button
                                      className="ms-3"
                                      onClick={onSaveTimeStudent}
                                      type="primary"
                                    >
                                      ?????t th???i gian
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <span>
                                  <span className="mx-1">T???</span>{" "}
                                  {renderTime(studentFormTime.startTime)}
                                  <span className="mx-1">?????n</span>
                                  {renderTime(studentFormTime.endTime)}
                                  <span className="ms-2">
                                    <EditOutlined
                                      color="blue"
                                      onClick={() =>
                                        onSetIsUpdateStudentTime(
                                          studentFormTime
                                        )
                                      }
                                    />
                                  </span>
                                </span>
                              )}
                            </li>
                          );
                        }
                      })}
                  </ul>
                </div>
              </div>
            </Col>
          </Row>
          <Col style={{ marginTop: 40 }} span={24}>
            <h6>Ghi ch?? cho sinh vi??n</h6>
          </Col>
          <Col span={24}>
            <TextArea
              value={noteDetail}
              showCount
              maxLength={100}
              style={{ height: 80, marginBottom: 10 }}
              onChange={onChangeTextArea}
            />
            {isSetNote && (
              <Button type="primary" onClick={onUpdateNote}>
                C???p nh???t ghi ch??
              </Button>
            )}
          </Col>
        </div>
      )}
    </Modal>
  );
};

export default StudentDetail;
