import React, { useState, useEffect, useRef } from "react";
import styles from "./mywork.module.css";
import { Select, Input, Table, Button, message, Row, Col } from "antd";
import { useSelector, useDispatch, connect } from "react-redux";
import {
  listStudentReport,
  updateReviewerListStudent,
  updateStatusListStudent,
} from "../../features/reviewerStudent/reviewerSlice";
import { filterStatusReport } from "../../ultis/selectOption";
import { omit } from "lodash";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import { statusConfigReport } from "../../ultis/constConfig";
import { EyeOutlined } from "@ant-design/icons";
import TextArea from "antd/lib/input/TextArea";
import { timestamps } from "../../ultis/timestamps";
import StudentDetail from "../../components/studentDetail/StudentDetail";
import SemestersAPI from "../../API/SemestersAPI";
import { getListMajor } from "../../features/majorSlice/majorSlice";
import moment from "moment";
const { Column } = Table;

const { Option } = Select;

const ReviewReport = ({ isMobile, listMajors }) => {
  const dispatch = useDispatch();
  const { infoUser } = useSelector((state) => state.auth);
  const {
    listStudentAssReviewer: { total, list },
    loading,
  } = useSelector((state) => state.reviewer);
  const [chooseIdStudent, setChooseIdStudent] = useState([]);
  const [status, setStatus] = useState({});
  const [listIdStudent, setListIdStudent] = useState([]);
  const [listEmailStudent, setListEmailStudent] = useState([]);
  const [note, setNote] = useState();
  const typePingTimeoutRef = useRef(null);
  const [textNote, setTextNote] = useState("");
  const [page, setPage] = useState({
    page: 1,
    limit: 20,
    campus_id: infoUser.manager.campus_id,
  });
  const [studentdetail, setStudentDetail] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const onShowModal = () => {
    setIsModalVisible(true);
  };

  useEffect(() => {
    dispatch(getListMajor());
  }, [dispatch]);

  const onCloseModal = () => {
    setIsModalVisible(false);
    getDataReviewReport();
  };

  const [filter, setFiler] = useState({});
  const getDataReviewReport = () => {
    SemestersAPI.getDefaultSemester()
      .then((res) => {
        if (res.status === 200) {
          const data = {
            ...page,
            ...filter,
            smester_id: res.data._id,
          };
          setChooseIdStudent([]);
          dispatch(listStudentReport(data));
        }
      })
      .catch(() => {});
  };
  useEffect(() => {
    getDataReviewReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);
  const onShowDetail = (mssv, key) => {
    onShowModal();
    setStudentDetail(key._id);
  };
  const columns = [
    {
      title: "MSSV",
      dataIndex: "mssv",
      width: 100,
      fixed: "left",
      render: (val, key) => {
        console.log(val);
        console.log(key);
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
      width: 100,
    },
    {
      title: "Chuy??n ng??nh",
      dataIndex: "majors",
      width: 100,
      render: (val, record) => {
        return record.majors?.name;
      },
    },
    {
      title: "T??n c??ng ty",
      width: 160,
      render: (val, record) => {
        if (record.support === 1) {
          return record.business?.name;
        } else {
          return record.nameCompany;
        }
      },
    },
    {
      title: "Th???i gian b???t ?????u",
      dataIndex: "internshipTime",
      width: 160,
    },
    {
      title: "Th???i gian k???t th??c",
      dataIndex: "endInternShipTime",
      width: 160,
    },
    {
      title: "??i???m th??i ?????",
      dataIndex: "attitudePoint",
      width: 100,
    },
    {
      title: "??i???m k???t qu???",
      dataIndex: "resultScore",
      width: 100,
    },
    // {
    //   title: "Th???i gian n???p b??o c??o",
    //   dataIndex: "createdAt",
    //   width: 180,
    // },
    {
      title: "B??o c??o",
      dataIndex: "report",
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
      title: "Ghi ch??",
      dataIndex: "note",
      width: 200,
    },
    {
      title: "Tr???ng th??i",
      dataIndex: "statusCheck",
      width: 100,
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
      (value.length > 0 || value > 0) && value !== ""
        ? {
            ...filter,
            [key]: value,
          }
        : omit(filter, [key]);
    setFiler(newValue);
  };
  const handleSearch = () => {
    getDataReviewReport();
  };

  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";

  const exportToCSV = (list) => {
    const newData = [];
    list &&
      list.map((item) => {
        console.log('itemDataCsv', item);
        let itemStatus = item["statusCheck"];
        const newObject = {};
        newObject["MSSV"] = item["mssv"];
        newObject["H??? t??n"] = item["name"];
        newObject["Email"] = item["email"];
        newObject["S??? ??i???n tho???i"] = item["phoneNumber"];
        newObject["Chuy??n ng??nh"] = item["majors"]?.name;
        newObject["T??n c??ng ty"] = item["business"]?.name;
        newObject["?????a ch??? c??ng ty"] = item["business"]?.address;
        newObject["V??? tr?? th???c t???p"] = item["business"]?.internshipPosition;
        newObject["??i???m th??i ?????"] = item["attitudePoint"];
        newObject["??i???m k???t qu???"] = item["resultScore"];
        newObject["Ng??y b???t ?????u"] = timestamps(item["internshipTime"]);
        // newObject["Ng??y k???t th??c"] = timestamps(item["endInternShipTime"]);
        newObject["Th???i gian n???p b??o c??o"] = moment(item["createdAt"]).format("D/MM/YYYY h:mm:ss");
        newObject["Tr???ng th??i"] =
          itemStatus === 1
            ? "Ch??? ki???m tra"
            : itemStatus === 2
            ? " Nh???n CV"
            : itemStatus === 3
            ? " Tr?????t"
            : itemStatus === 4
            ? " ???? n???p bi??n b???n"
            : itemStatus === 5
            ? "S???a bi??n b???n"
            : itemStatus === 6
            ? "??ang th???c t???p "
            : itemStatus === 7
            ? " ???? n???p b??o c??o "
            : itemStatus === 8
            ? " S???a b??o c??o"
            : itemStatus === 9
            ? "Ho??n th??nh"
            : "Ch??a ????ng k??";
        newObject["B??o c??o"] = item["report"];
        return newData.push(newObject);
      });
      console.log('newDataCsv', newData)
    const ws = XLSX.utils.json_to_sheet(newData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileExtension);
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
    if (value !== 5) {
      chooseIdStudent
        .filter((item) => item.report !== null)
        .map((item) => id.push(item._id));
      if (id.length === chooseIdStudent.length) {
        setStatus({
          listIdStudent: listIdStudent,
          listEmailStudent: listEmailStudent,
          email: infoUser?.manager?.email,
          status: value,
        });
      } else {
        message.error("Ch??a n???p b??o c??o");
        setChooseIdStudent([]);
      }
    } else {
      setStatus({
        listIdStudent: listIdStudent,
        listEmailStudent: listEmailStudent,
        email: infoUser?.manager?.email,
        status: value,
      });
    }
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
        <h1>Review b??o c??o</h1>
      </div>

      {isMobile ? (
        <>
          <div className={styles.status}>
            <Row>
              <Col span={12}>
                <div className="search">
                  <Select
                    style={{ width: "100%" }}
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
                    {filterStatusReport.map((item, index) => (
                      <Option value={item?.id} key={index}>
                        {item?.title}
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
                <Button
                  variant="warning"
                  type="primary"
                  style={{
                    width: "100%",
                  }}
                  onClick={(e) => exportToCSV(list)}
                >
                  Export
                </Button>
              </Col>
              <Col span={12}>
                <Button
                  style={{
                    width: "100%",
                  }}
                  type="primary"
                  onClick={handleSearch}
                >
                  T??m ki???m
                </Button>
              </Col>
            </Row>
          </div>
          {chooseIdStudent.length > 0 && (
            <div
              style={{
                marginTop: 20,
              }}
              className="comfirm"
            >
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

              {Object.keys(status).length >= 1 && (
                <Select
                  className="upload-status"
                  style={
                    window.innerWidth > 1024
                      ? { width: "100%", margin: "10px",}
                      : { width: "100%", margin: "10px 0",}
                  }
                  onChange={(e) => selectStatus(e)}
                  placeholder="Ch???n tr???ng th??i"
                >
                  {statusConfigReport.map((item, index) => (
                    <Option value={item.value} key={index}>
                      {item.title}
                    </Option>
                  ))}
                </Select>
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
            </div>
          )}
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
                    Ng??nh:{" "}
                  </span>
                  <Select
                    style={{
                      width: "100%",
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
                    defaultValue={11}
                    onChange={(val) =>
                      handleStandardTableChange("statusCheck", val)
                    }
                    placeholder="L???c theo tr???ng th??i"
                  >
                    {filterStatusReport.map((item, index) => (
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
                    T??m Ki???m:{" "}
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
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Button
                    style={{
                      marginRight: 20,
                      color: "#fff",
                      background: "#ee4d2d",
                      minWidth: "90px",
                    }}
                    variant="warning"
                    onClick={(e) => exportToCSV(list)}
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
                          <span style={{ whiteSpace: "nowrap",width: "100%"}}>
                            L???a ch???n:
                          </span>
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
                              style={
                                window.innerWidth > 1024
                                  ? { width: "100%" }
                                  : { width: "100%" }
                              }
                              onChange={(e) => selectStatus(e)}
                              placeholder="Ch???n tr???ng th??i"
                            >
                              {statusConfigReport.map((item, index) => (
                                <Option value={item.value} key={index}>
                                  {item.title}
                                </Option>
                              ))}
                            </Select>
                          </Col>
                        )}
                        {note === 3 || note === 5 || note === 8 ? (
                          <Col span={24}>
                            <TextArea
                              // value={value}
                              onChange={handleNote}
                              placeholder="Ghi ch??..."
                              autoSize={{ minRows: 3, maxRows: 5 }}
                            />
                          </Col>
                        ) : null}
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
          dataSource={
            list &&
            list?.map(({ internshipTime, endInternShipTime, ...list }) => {
              return {
                internshipTime: timestamps(internshipTime),
                endInternShipTime: timestamps(endInternShipTime),
                ...list,
              };
            })
          }
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
          // expandable={{
          //   expandedRowRender: (record) => (
          //     <div style={{ marginTop: "10px" }}>
          //       {window.innerWidth < 1023 && window.innerWidth > 739 ? (
          //         ""
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
          //         {record.support === 1 && "H??? tr???"}
          //         {record.support === 0 && "T??? t??m"}
          //         {record.support !== 1 && record.support !== 0 && ""}
          //       </p>
          //       <br />
          //       <p className="list-detail">
          //         CV:{" "}
          //         {record.CV ? (
          //           <EyeOutlined
          //             style={{ fontSize: ".9rem" }}
          //             onClick={() => window.open(record.CV)}
          //           />
          //         ) : (
          //           ""
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
          closeModal={onCloseModal}
          studentId={studentdetail}
          onShowModal={onShowModal}
        />
      )}
    </div>
  );
};

export default connect(({ global, major }) => ({
  isMobile: global.isMobile,
  listMajors: major.listMajor,
}))(ReviewReport);
