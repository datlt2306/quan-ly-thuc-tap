import React, { useState, useEffect, useRef } from "react";
import { EyeOutlined } from "@ant-design/icons";
import styles from "./mywork.module.css";
import { Select, Input, Table, Button, message, Row, Col } from "antd";
import { useDispatch, connect } from "react-redux";
import {
  listStudentForm,
  updateReviewerListStudent,
  updateStatusListStudent,
} from "../../features/reviewerStudent/reviewerSlice";
import {  filterStatusForm } from "../../ultis/selectOption";
import { omit } from "lodash";
import { statusConfigForm } from "../../ultis/constConfig";
import TextArea from "antd/lib/input/TextArea";
import { bool, object } from "prop-types";
import StudentDetail from "../../components/studentDetail/StudentDetail";
import SemestersAPI from "../../API/SemestersAPI";
import { getListMajor } from "../../features/majorSlice/majorSlice";
const { Column } = Table;
const { Option } = Select;
const Reviewform = ({
  infoUser,
  listStudentAssReviewer: { total, list },
  loading,
  isMobile,
  listMajors,
}) => {
  const dispatch = useDispatch();
  const [status, setStatus] = useState({});
  const [note, setNote] = useState();
  const typePingTimeoutRef = useRef(null);
  const [textNote, setTextNote] = useState("");
  const [chooseIdStudent, setChooseIdStudent] = useState([]);
  const [listIdStudent, setListIdStudent] = useState([]);
  const [listEmailStudent, setListEmailStudent] = useState([]);
  const [page, setPage] = useState({
    page: 1,
    limit: 20,
    campus_id: infoUser.manager.campus_id,
  });
  const [studentdetail, setStudentDetail] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [filter, setFiler] = useState({});

  const onShowModal = () => {
    setIsModalVisible(true);
  };

  const onCloseModal = () => {
    setIsModalVisible(false);
    getDataReviewForm();
  };

  const getDataReviewForm = () => {
    SemestersAPI.getDefaultSemester()
      .then((res) => {
        if (res.status === 200) {
          const data = {
            ...page,
            ...filter,
            smester_id: res.data._id,
          };
          setChooseIdStudent([]);
          dispatch(listStudentForm(data));
        }
      })
      .catch(() => {});
  };
  useEffect(() => {
    getDataReviewForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const onShowDetail = (mssv, key) => {
    onShowModal();
    setStudentDetail(key._id);
  };

  useEffect(() => {
    dispatch(getListMajor());
  }, [dispatch]);

  const columns = [
    {
      title: "MSSV",
      dataIndex: "mssv",
      width: 100,
      fixed: "left",
      render: (val, key) => {
        return (
          <p
            style={{ margin: 0, cursor: "pointer", color: "blue" }}
            onClick={() => onShowDetail(val, key)}
          >
            {val}
          </p>
        );
      },
    },
    {
      title: "H??? v?? T??n",
      dataIndex: "name",
      width: 150,
      fixed: "left",
    },
    {
      title: "Email",
      dataIndex: "email",
      width: 200,
    },
    {
      title: "??i???n tho???i",
      dataIndex: "phoneNumber",
      width: 160,
    },
    {
      title: "T??n c??ng ty",
      width: 180,
      render: (val, record) => {
        if (record.support === 1) {
          return record.business?.name;
        } else {
          return record.nameCompany;
        }
      },
    },
    {
      title: "M?? s??? thu???",
      dataIndex: "taxCode",
      width: 100,
    },
    {
      title: "Bi??n b???n",
      dataIndex: "form",
      width: 100,
      render: (val) =>
        val ? (
          <Button
            type="text"
            icon={<EyeOutlined className="icon-cv" />}
            onClick={() => window.open(val)}
          />
        ) : (
          ""
        ),
    },
    {
      title: "Ng?????i review",
      dataIndex: "reviewer",
      render: (val) => val && val.slice(0, -11),
      width: 200,
    },
    {
      title: "Ghi ch??",
      dataIndex: "note",
      width: 200,
    },
    {
      title: "Ng??y b???t ?????u",
      dataIndex: "internshipTime",
      width: 230,
    },
    {
      title: "Tr???ng th??i",
      dataIndex: "statusCheck",
      width: 150,
      render: (status) => {
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
              Ch??? n???p bi??n b???n
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
              S???a bi??n b???n <br />
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
      },
    },
  ];
  // x??a t??m ki???m
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setListIdStudent(selectedRowKeys);
      setListEmailStudent(selectedRows);
      setChooseIdStudent(selectedRows);
    },
  };

  const handleStandardTableChange = (key, value) => {
    const newValue =
      value.length > 0 || (value > 0 && value !== "")
        ? {
            ...filter,
            [key]: value,
          }
        : omit(filter, [key]);
    setFiler(newValue);
  };
  const handleSearch = () => {
    getDataReviewForm();
  };
  const actionOnchange = (value) => {
    switch (value) {
      case "assgin":
        try {
          dispatch(
            updateReviewerListStudent({
              listIdStudent: listIdStudent,
              email: infoUser?.manager?.email,
            })
          );
          setNote(value);
          setStatus([]);
          message.success("Th??nh c??ng");
        } catch (error) {
          message.error("Th???t b???i");
        }
        break;
      case "edit":
        setStatus({
          listIdStudent: listIdStudent,
          email: infoUser?.manager?.email,
        });
        break;

      default:
        break;
    }
  };
  const selectStatus = (value) => {
    setNote(value);
    let id = [];
    chooseIdStudent
      .filter((item) => item.form !== null)
      .map((item) => id.push(item._id));
    if (id.length === chooseIdStudent.length) {
      setStatus({
        listIdStudent: id,
        listEmailStudent: listEmailStudent,
        email: infoUser?.manager?.email,
        status: value,
      });
    } else {
      message.error("Ch??a n???p bi??n b???n");
      setChooseIdStudent([]);
    }
  };
  const comfirm = () => {
    dispatch(
      updateStatusListStudent({
        ...status,
        textNote,
      })
    );
    setChooseIdStudent([]);
  };

  const handleNote = ({ target: { value } }) => {
    if (typePingTimeoutRef.current) {
      clearTimeout(typePingTimeoutRef.current);
    }
    typePingTimeoutRef.current = setTimeout(() => {
      setTextNote(value);
    }, 300);
  };
  return (
    <div className={styles.status}>
      <div className={styles.header_flex}>
        <h1>Review bi??n B???n</h1>
      </div>

      {isMobile ? (
        <>
          <Row>
            <Col span={12}>
              <div className="search">
                <Select
                  style={{ width: "95%" }}
                  onChange={(val) => handleStandardTableChange("majors", val)}
                  placeholder="L???c theo ng??nh"
                  defaultValue=""
                >
                  <Option value="">T???t c???</Option>
                  {listMajors &&
                    listMajors.map((item, index) => (
                      <>
                        <Option value={item._id} key={index}>
                          {item.name}
                        </Option>
                      </>
                    ))}
                </Select>
              </div>
            </Col>
            <Col span={12}>
              <div className="search">
                <Select
                  className="filter-status"
                  style={{ width: "100%" }}
                  onChange={(val) =>
                    handleStandardTableChange("statusCheck", val)
                  }
                  defaultValue={11}
                  placeholder="L???c theo tr???ng th??i"
                >
                  {filterStatusForm.map((item, index) => (
                    <Option value={item.id} key={index}>
                      {item.title}
                    </Option>
                  ))}
                </Select>
              </div>
            </Col>
          </Row>

          <Row
            style={{
              marginTop: 20,
            }}
          >
            <Col span={12}>
              <div className="search">
                <Input
                  style={{ width: "95%" }}
                  placeholder="T??m ki???m theo m?? sinh vi??n"
                  onChange={(val) =>
                    handleStandardTableChange("mssv", val.target.value)
                  }
                />
              </div>
            </Col>
            <Col span={12}>
              <Button
                type="primary"
                onClick={handleSearch}
                style={{
                  width: "100%",
                }}
              >
                T??m ki???m
              </Button>
            </Col>
          </Row>
        </>
      ) : (
        <>
          <div className="filter" style={{ marginTop: "20px" }}>
            <Row>
              <Col xs={24} sm={4} md={12} lg={8} xl={8}>
                <div
                  style={{
                    display: "flex",
                  }}
                  className="search"
                >
                  <span style={{ width: "70%", marginRight: "35px" }}>
                    Ng??nh:{" "}
                  </span>
                  <Select
                    style={{
                      width: "100%",
                      position: "relative",
                      right: "70px",
                    }}
                    defaultValue=""
                    onChange={(val) => handleStandardTableChange("majors", val)}
                    placeholder="L???c theo ng??nh"
                  >
                    <Option value="">T???t c???</Option>
                    {listMajors &&
                      listMajors.map((item, index) => (
                        <>
                          <Option value={item._id} key={index}>
                            {item.name}
                          </Option>
                        </>
                      ))}
                  </Select>
                </div>
              </Col>
              <br />
              <br />
              <Col xs={24} sm={4} md={12} lg={8} xl={8}>
                <div
                  style={{
                    display: "flex",
                  }}
                  className="search"
                >
                  <span style={{ width: "65%" }}>Tr???ng th??i:</span>
                  <Select
                    className="filter-status"
                    style={{
                      width: "100%",
                      position: "relative",
                      right: "44px",
                    }}
                    defaultValue={11}
                    onChange={(val) =>
                      handleStandardTableChange("statusCheck", val)
                    }
                    placeholder="L???c theo tr???ng th??i"
                  >
                    {filterStatusForm.map((item, index) => (
                      <Option value={item.id} key={index}>
                        {item.title}
                      </Option>
                    ))}
                  </Select>
                </div>
              </Col>
              <br />
              <br />
              <Col xs={24} sm={4} md={12} lg={8} xl={8}>
                <div
                  style={{
                    display: "flex",
                  }}
                  className="search"
                >
                  <span style={{ width: "65%" }}>T??m Ki???m: </span>
                  <Input
                    style={{
                      width: "100%",
                      position: "relative",
                      right: "40px",
                    }}
                    placeholder="T??m ki???m theo m?? sinh vi??n"
                    onChange={(val) =>
                      handleStandardTableChange("mssv", val.target.value)
                    }
                  />
                </div>
              </Col>
              <br />
              <br />
              <Col xs={24} sm={4} md={24} lg={24} xl={16}>
                <div>
                  <Button
                    style={{
                      marginTop: "10px",
                      color: "#fff",
                      background: "#ee4d2d",
                    }}
                    onClick={handleSearch}
                  >
                    T??m ki???m
                  </Button>
                  {chooseIdStudent.length > 0 && (
                    <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                      <Row gutter={[10, 10]}>
                      <Col xs={24} sm={24} md={24} lg={4} xl={4}>
                      <span style={{ whiteSpace: "nowrap" }}>L???a ch???n:</span>
                    </Col>
                      {/* <span style={{ whiteSpace: "nowrap" }}>L???a ch???n:</span> */}
                      <Col xs={24} sm={12} md={12} lg={10} xl={10}>
                      <Select
                        className="comfirm-click"
                        style={{ width: "100%",  }}
                        onChange={actionOnchange}
                        placeholder="Ch???n"
                      >
                        <Option value="assgin" key="1">
                          K??o vi???c
                        </Option>
                        <Option value="edit" key="2">
                          C???p nh???t tr???ng th??i
                        </Option>
                      </Select>
                      </Col>
                      {Object.keys(status).length >= 1 && (
                        <Col xs={24} sm={12} md={12} lg={10} xl={10}>
                        <Select
                          // className="upload-status"
                          className="upload-status"
                          style={{ width: "100%" }}
                          onChange={(e) => selectStatus(e)}
                          placeholder="Ch???n tr???ng th??i"
                        >
                          {statusConfigForm.map((item, index) => (
                            <Option value={item.value} key={index}>
                              {item.title}
                            </Option>
                          ))}
                        </Select>
                        </Col>
                      )}
                      {note === 3 || note === 5 || note === 8 ? (
                        <TextArea
                          // value={value}
                          onChange={handleNote}
                          placeholder="Ghi ch??..."
                          autoSize={{ minRows: 3, maxRows: 5 }}
                        />
                      ) : null}
                      {Object.keys(status).length > 0 && (
                        <Button onClick={() => comfirm()}>X??c nh???n</Button>
                      )}
                    </Row>
                    </Col>
                  )}
                </div>
              </Col>
            </Row>
          </div>
        </>
      )}

      {window.innerWidth > 1024 ? (
        <Table
          rowSelection={{
            type: "checkbox",
            ...rowSelection,
          }}
          pagination={{
            pageSize: page.limit,
            total: total,
            onChange: (page, pageSize) => {
              setPage({
                page: page,
                limit: pageSize,
                campus_id: infoUser.manager.cumpus,
                ...filter,
              });
            },
          }}
          rowKey="_id"
          loading={loading}
          columns={columns}
          dataSource={list}
          scroll={{ x: "calc(700px + 50%)" }}
        />
      ) : (
        <Table
          rowSelection={{
            type: "checkbox",
            ...rowSelection,
          }}
          pagination={{
            pageSize: page.limit,
            total: total,
            onChange: (page, pageSize) => {
              setPage({
                page: page,
                limit: pageSize,
                campus_id: infoUser.manager.cumpus,
                ...filter,
              });
            },
          }}
          rowKey="_id"
          loading={loading}
          dataSource={list}
        >
          <Column title="Mssv" dataIndex="mssv" key="_id" />
          <Column title="H??? v?? T??n" dataIndex="name" key="_id" />
          {window.innerWidth > 739 && window.innerWidth < 1023 && (
            <Column title="Email" dataIndex="email" key="_id" />
          )}
          <Column
            title="Tr???ng th??i"
            dataIndex="statusCheck"
            key="_id"
            render={(status) => {
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
                    Nh???n CV
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
                    S???a bi??n b???n <br />
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
            }}
          />
        </Table>
      )}
      {isModalVisible && (
        <StudentDetail
          closeModal={onCloseModal}
          studentId={studentdetail}
          onShowModal={onShowModal}
        />
      )}
    </div>
  );
};

Reviewform.propTypes = {
  infoUser: object,
  loading: bool,
  listStudentAssReviewer: object,
};

export default connect(
  ({
    auth: { infoUser },
    reviewer: { listStudentAssReviewer, loading },
    global,
    major,
  }) => ({
    listStudentAssReviewer,
    infoUser,
    loading,
    isMobile: global.isMobile,
    listMajors: major.listMajor,
  })
)(Reviewform);
