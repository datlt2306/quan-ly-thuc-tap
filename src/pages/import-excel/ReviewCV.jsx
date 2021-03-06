import { EyeOutlined } from "@ant-design/icons";
import { Button, Col, Input, message, Row, Select, Table } from "antd";
import TextArea from "antd/lib/input/TextArea";
import * as FileSaver from "file-saver";
import { omit } from "lodash";
import { useEffect, useRef, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import * as XLSX from "xlsx";
import SemestersAPI from "../../API/SemestersAPI";
import StudentDetail from "../../components/studentDetail/StudentDetail";
import { getListMajor } from "../../features/majorSlice/majorSlice";
import {
  getListStudentAssReviewer,
  updateReviewerListStudent,
  updateStatusListStudent,
  getListStudentAssReviewerExportExcel,
} from "../../features/reviewerStudent/reviewerSlice";
import { statusConfigCV } from "../../ultis/constConfig";
import { filterStatusCV } from "../../ultis/selectOption";
import { getLocal } from "../../ultis/storage";
import styles from "./review.module.css";
const { Column } = Table;

const { Option } = Select;

const ReviewCV = ({ listBusiness, listMajors, isMobile }) => {
  const dispatch = useDispatch();
  const [studentdetail, setStudentDetail] = useState("");
  const infoUser = getLocal();
  const {
    listStudentAssReviewer: { total, list },
    listStudentAssReviewerExportExcel,
    loading,
  } = useSelector((state) => state.reviewer);
  const [chooseIdStudent, setChooseIdStudent] = useState([]);
  const [listIdStudent, setListIdStudent] = useState([]);
  const [listEmailStudent, setListEmailStudent] = useState([]);
  const [status, setStatus] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [page, setPage] = useState({
    page: 1,
    limit: 20,
    campus_id: infoUser.manager.campus_id,
  });
  const [filter, setFiler] = useState({});
  const onShowModal = () => {
    setIsModalVisible(true);
  };

  useEffect(() => {
    dispatch(getListMajor());
  }, [dispatch]);

  const onCloseModal = () => {
    setIsModalVisible(false);
    getDataReviewCV();
  };

  const getDataReviewCV = () => {
    SemestersAPI.getDefaultSemester()
      .then((res) => {
        if (res.status === 200) {
          const data = {
            ...page,
            ...filter,
            smester_id: res.data._id,
          };
          setChooseIdStudent([]);
          dispatch(getListStudentAssReviewer(data));
        }
      })
      .catch(() => {});
  };
  const getListStudentAssReviewerExport = () => {
    SemestersAPI.getDefaultSemester()
      .then((res) => {
        if (res.status === 200) {
          const data = {
            ...filter,
            smester_id: res.data._id,
          };
          setChooseIdStudent([]);
          dispatch(getListStudentAssReviewerExportExcel(data));
        }
      })
      .catch(() => {});
  };
  useEffect(() => {
    getDataReviewCV();
    getListStudentAssReviewerExport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const onShowDetail = (mssv, key) => {
    setStudentDetail(key._id);
    onShowModal();
  };

  const columns = [
    {
      title: "MSSV",
      dataIndex: "mssv",
      width: 100,
      fixed: "left",
      color: "blue",
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
      width: 300,
    },
    {
      title: "??i???n tho???i",
      dataIndex: "phoneNumber",
      width: 160,
    },
    {
      title: "Ng??nh",
      dataIndex: "majors",
      width: 100,
      render: (val) => {
        return val.name;
      },
    },
    {
      title: "S??? l???n h??? tr???",
      dataIndex: "numberOfTime",
      width: 120,
    },
    {
      title: "Ph??n lo???i",
      dataIndex: "support",
      width: 90,
      render: (val) => {
        if (val === 1) {
          return "H??? tr???";
        } else if (val === 0) {
          return "T??? t??m";
        } else {
          return "";
        }
      },
    },
    {
      title: "CV",
      dataIndex: "CV",
      width: 50,
      render: (val) =>
        val ? (
          <EyeOutlined className="icon-cv" onClick={() => window.open(val)} />
        ) : (
          ""
        ),
    },
    {
      title: "Ng?????i review",
      dataIndex: "reviewer",
      width: 230,
    },
    {
      title: "Ghi ch??",
      dataIndex: "note",
      width: 150,
    },
    {
      title: "Tr???ng th??i",
      dataIndex: "statusCheck",
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
              Nh???n CV
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
      value.length > 0 || (value < 11 && value !== "")
        ? {
            ...filter,
            [key]: value,
          }
        : omit(filter, [key]);
    setFiler(newValue);
  };
  const handleSearch = () => {
    getDataReviewCV();
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
  const [note, setNote] = useState();
  const selectStatus = (value) => {
    setNote(value);
    setStatus({
      listIdStudent: listIdStudent,
      listEmailStudent: listEmailStudent,
      email: infoUser?.manager?.email,
      status: value,
    });
  };

  const comfirm = () => {
    try {
      dispatch(
        updateStatusListStudent({
          ...status,
          textNote,
        })
      );

      setChooseIdStudent([]);
      message.success("Th??nh c??ng");
    } catch (error) {
      message.error("Th???t b???i");
    }
  };
  const typePingTimeoutRef = useRef(null);
  const [textNote, setTextNote] = useState("");
  const handleNote = ({ target: { value } }) => {
    if (typePingTimeoutRef.current) {
      clearTimeout(typePingTimeoutRef.current);
    // }else if (typePingTimeoutRef.current){
    //   clearTimeout(typePingTimeoutRef.current);
    // }
    }
    typePingTimeoutRef.current = setTimeout(() => {
      setTextNote(value);
    }, 300);

  };

  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";

  const exportToCSV = (list) => {
    const newData = [];

    list.filter((item) => {
      const newObject = {};
      newObject["K??? h???c"] = item["smester_id"]?.name;
      newObject["C?? s???"] = item["campus_id"]?.name;
      newObject["MSSV"] = item["mssv"];
      newObject["H??? t??n"] = item["name"];
      newObject["Email"] = item["email"];
      newObject["Ng??nh"] = item["majors"]?.name;
      newObject["M?? ng??nh"] = item["majors"]?.majorCode;
      newObject["CV"] = item["CV"];
      newObject["Ng?????i review"] = item["reviewer"];
      newObject["S??? ??i???n tho???i"] = item["phoneNumber"];
      newObject["T??n c??ng ty"] = item["business"]?.name;
      newObject["?????a ch??? c??ng ty"] = item["business"]?.address;
      newObject["V??? tr?? th???c t???p"] = item["business"]?.internshipPosition;
      newObject["H??nh th???c"] = item["support"];
      newObject["Ghi ch??"] = item["note"];
      return newData.push(newObject);
    });
    // eslint-disable-next-line array-callback-return
    newData.filter((item) => {
      if (item["Tr???ng th??i"] === 0) {
        item["Tr???ng th??i"] = 0;
        item["Tr???ng th??i"] = "Ch??? ki???m tra";
      } else if (item["Tr???ng th??i"] === 1) {
        item["Tr???ng th??i"] = 1;
        item["Tr???ng th??i"] = "S???a l???i CV";
      } else if (item["Tr???ng th??i"] === 2) {
        item["Tr???ng th??i"] = 2;
        item["Tr???ng th??i"] = "???? nh???n CV";
      } else {
      }
    });
    const ws = XLSX.utils.json_to_sheet(newData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileExtension);
  };

  const dataExportExcel = listStudentAssReviewerExportExcel?.list;
  return (
    <div className={styles.status}>
      <div className={styles.header_flex}>
        <h1>Review CV</h1>
      </div>

      {isMobile ? (
        <>
          <div className={styles.status}>
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
                          <Option value={item?._id} key={item?._id}>
                            {item?.name}
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
                    placeholder="L???c theo tr???ng th??i"
                    defaultValue={11}
                  >
                    {filterStatusCV.map((item, index) => (
                      <Option value={item?.id} key={index}>
                        {item?.title}
                      </Option>
                    ))}
                  </Select>
                </div>
              </Col>
            </Row>
            <div className="search">
              <Input
                style={{ width: "100%", marginTop: 20 }}
                placeholder="T??m ki???m theo m?? sinh vi??n"
                onChange={(val) =>
                  handleStandardTableChange("mssv", val.target.value)
                }
              />
            </div>
            <Row
              style={{
                marginTop: 20,
              }}
            >
              <Col span={12}>
                <Button
                  type="primary"
                  variant="warning"
                  style={{ width: "95%" }}
                  onClick={(e) => exportToCSV(dataExportExcel)}
                >
                  Export
                </Button>
              </Col>
              <Col span={12}>
                <div>
                  <Button
                    type="primary"
                    style={{ width: "100%" }}
                    onClick={handleSearch}
                  >
                    T??m ki???m
                  </Button>
                </div>
              </Col>
            </Row>
            {chooseIdStudent.length > 0 && (
              <div className="comfirm">
                <Select
                  className="comfirm-click"
                  style={{ width: "100%", marginTop: "10px" }}
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

                {Object.keys(status).length >= 1 && (
                  <Select
                    className="upload-status"
                    style={{ width: "100%", margin: "10px 0" }}
                    onChange={(e) => selectStatus(e)}
                    placeholder="Ch???n tr???ng th??i"
                  >
                    {statusConfigCV.map((item, index) => (
                      <Option value={item.value} key={index}>
                        {item.title}
                      </Option>
                    ))}
                  </Select>
                )}
                {note === 1 || note === 5 ? (
                  <TextArea
                    // value={value}
                    onChange={handleNote}
                    placeholder="Ghi ch??..."
                    style={{ marginRight: 10 }}
                    autoSize={{ minRows: 3, maxRows: 5 }}
                  />
                ): null}
                {Object.keys(status).length > 0 && (
                  <Button style={{ marginRight: 10 }} onClick={() => comfirm()}>
                    X??c nh???n
                  </Button>
                )}
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="filter" style={{ marginTop: "20px" }}>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={12} lg={6} xl={6}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <span style={{ whiteSpace: "nowrap", marginRight: "10px" }}>
                    Ng??nh:
                  </span>
                  <Select
                    style={{
                      width: "100%",
                    }}
                    onChange={(val) => handleStandardTableChange("majors", val)}
                    placeholder="L???c theo ng??nh"
                    defaultValue=""
                  >
                    <Option value="">T???t c???</Option>
                    {listMajors &&
                      listMajors.map((item, index) => (
                        <>
                          <Option value={item?._id} key={index}>
                            {item?.name}
                          </Option>
                        </>
                      ))}
                  </Select>
                </div>
              </Col>
              <Col xs={24} sm={12} md={12} lg={6} xl={6}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <span style={{ whiteSpace: "nowrap", marginRight: "10px" }}>
                    Tr???ng th??i:
                  </span>
                  <Select
                    className="filter-status"
                    style={{
                      width: "100%",
                    }}
                    onChange={(val) =>
                      handleStandardTableChange("statusCheck", val)
                    }
                    placeholder="L???c theo tr???ng th??i"
                    defaultValue={11}
                  >
                    {filterStatusCV.map((item, index) => (
                      <Option value={item?.id} key={index}>
                        {item?.title}
                      </Option>
                    ))}
                  </Select>
                </div>
              </Col>
              <Col xs={24} sm={12} md={12} lg={6} xl={6}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <span style={{ whiteSpace: "nowrap", marginRight: "10px" }}>
                    T??m Ki???m:
                  </span>
                  <Input
                    style={{
                      width: "100%",
                    }}
                    placeholder="T??m ki???m theo m?? sinh vi??n"
                    onChange={(val) =>
                      handleStandardTableChange("mssv", val.target.value)
                    }
                  />
                </div>
              </Col>
              <Col xs={24} sm={12} md={12} lg={6} xl={6}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Button
                    variant="warning"
                    style={{
                      marginRight: 10,
                      color: "#fff",
                      background: "#ee4d2d",
                      minWidth: "90px",
                    }}
                    onClick={(e) => exportToCSV(dataExportExcel)}
                  >
                    Export
                  </Button>
                  <Button
                    style={{
                      color: "#fff",
                      background: "#ee4d2d",
                      minWidth: "90px",
                    }}
                    onClick={handleSearch}
                  >
                    T??m ki???m
                  </Button>
                </div>
              </Col>
              {chooseIdStudent.length > 0 && (
                <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                  <Row gutter={[10, 10]}>
                    <Col xs={24} sm={24} md={24} lg={4} xl={4}>
                      <span style={{ whiteSpace: "nowrap" }}>L???a ch???n:</span>
                    </Col>
                    <Col xs={24} sm={12} md={12} lg={10} xl={10}>
                      <Select
                        className="comfirm-click"
                        style={{ width: "100%" }}
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
                          className="upload-status"
                          style={{ width: "100%" }}
                          onChange={(e) => selectStatus(e)}
                          placeholder="Ch???n tr???ng th??i"
                        >
                          {statusConfigCV.map((item, index) => (
                            <Option value={item.value} key={index}>
                              {item.title}
                            </Option>
                          ))}
                        </Select>
                      </Col>
                    )}
                    {note === 1 && (
                      <Col span={24}>
                        <TextArea
                          // value={value}
                          onChange={handleNote}
                          placeholder="Ghi ch??..."
                          style={{ marginRight: 10 }}
                          autoSize={{ minRows: 3, maxRows: 5 }}
                        />
                      </Col>
                    )}
                    {Object.keys(status).length > 0 && (
                      <Col xs={24} sm={12} md={12} lg={4} xl={4}>
                        <Button
                          style={{
                            color: "#fff",
                            background: "#ee4d2d",
                            minWidth: "90px",
                          }}
                          onClick={() => comfirm()}
                        >
                          X??c nh???n
                        </Button>
                      </Col>
                    )}
                  </Row>
                </Col>
              )}
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
          scroll={{ x: "calc(1000px + 50%)" }}
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
          // expandable={{
          //   expandedRowRender: (record) => (
          //     <div style={{ marginTop: '10px' }}>
          //       {window.innerWidth < 1023 && window.innerWidth > 739 ? (
          //         ''
          //       ) : (
          //         <>
          //           <p className="list-detail">Email: {record.email}</p>
          //           <br />
          //         </>
          //       )}
          //       <p className="list-detail">??i???n tho???i: {record.phoneNumber}</p>
          //       <br />
          //       <p className="list-detail">Ng??nh: {record.majors}</p>
          //       <br />
          //       <p className="list-detail">
          //         Ph??n lo???i:
          //         {record.support === 1 && 'H??? tr???'}
          //         {record.support === 0 && 'T??? t??m'}
          //         {record.support !== 1 && record.support !== 0 && ''}
          //       </p>
          //       <br />
          //       <p className="list-detail">
          //         CV:{' '}
          //         {record.CV ? (
          //           <EyeOutlined
          //             style={{ fontSize: '.9rem' }}
          //             onClick={() => window.open(record.CV)}
          //           />
          //         ) : (
          //           ''
          //         )}
          //       </p>
          //       <br />
          //       <p className="list-detail">Ng?????i review: {record.reviewer}</p>
          //       <br />
          //     </div>
          //   ),
          // }}
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
          infoUser={infoUser}
          studentId={studentdetail}
          onShowModal={onShowModal}
          closeModal={onCloseModal}
        />
      )}
    </div>
  );
};
export default connect(({ students, semester, major, global }) => ({
  defaultSemester: semester.defaultSemester,
  loading: students.loading,
  listMajors: major.listMajor,
  ...global,
}))(ReviewCV);
