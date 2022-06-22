import { EyeOutlined } from "@ant-design/icons";
import { Button, Col, Input, Row, Select, Table } from "antd";
import Column from "antd/lib/table/Column";
import * as FileSaver from "file-saver";
import { omit } from "lodash";
import { array, object } from "prop-types";
import React, { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import "../../common/styles/status.css";
import UpFile from "../../components/ExcelDocument/UpFile";
import StudentDetail from "../../components/studentDetail/StudentDetail";
import { getListMajor } from "../../features/majorSlice/majorSlice";
import { fetchManager } from "../../features/managerSlice/managerSlice";
import { updateReviewerListStudent } from "../../features/reviewerStudent/reviewerSlice";
import { getSemesters } from "../../features/semesters/semestersSlice";
import { getStudent } from "../../features/StudentSlice/StudentSlice";
import { filterStatuss } from "../../ultis/selectOption";
import { getLocal } from "../../ultis/storage";
const { Option } = Select;

const Status = ({
  listStudent: { list, total },
  loading,
  listSemesters,
  defaultSemester,
  listManager,
  listBusiness,
  listMajors,
}) => {
  const infoUser = getLocal();
  const [studentdetail, setStudentDetail] = useState("");
  const [modal, setModal] = useState(false);
  const dispatch = useDispatch();
  let navigate = useNavigate();
  const [chooseIdStudent, setChooseIdStudent] = useState([]);
  const [listIdStudent, setListIdStudent] = useState([]);
  const [page, setPage] = useState({
    page: 1,
    limit: 20,
    campus_id: infoUser.manager.campus_id,
    smester_id: defaultSemester._id,
  });
  const [major, setMajor] = useState("");
  const [filter, setFiler] = useState();
  const onShowDetail = (mssv, key) => {
    setStudentDetail(key);
    setModal(true);
  };
  useEffect(() => {
    dispatch(getSemesters());
    dispatch(getListMajor());
    dispatch(fetchManager());
    dispatch(
      getStudent({
        ...page,
        ...filter,
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);
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
      title: "Họ và Tên",
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
      title: "Điện thoại",
      dataIndex: "phoneNumber",
      width: 160,
    },
    {
      title: "Ngành",
      dataIndex: "majors",
      width: 100,
      render: (val) => val.name,
    },
    {
      title: "Phân loại",
      dataIndex: "support",
      width: 90,
      render: (val) => {
        if (val === 1) {
          return "Hỗ trợ";
        } else if (val === 0) {
          return "Tự tìm";
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
      title: "Người review",
      dataIndex: "reviewer",
      width: 230,
    },
    {
      title: "Trạng thái",
      dataIndex: "statusCheck",
      render: (status) => {
        if (status === 0) {
          return (
            <span className="status-fail" style={{ color: "orange" }}>
              Chờ kiểm tra
            </span>
          );
        } else if (status === 1) {
          return (
            <span className="status-up" style={{ color: "grey" }}>
              Sửa lại CV
            </span>
          );
        } else if (status === 2) {
          return (
            <span className="status-fail" style={{ color: "red" }}>
              Nhận CV
            </span>
          );
        } else if (status === 3) {
          return (
            <span className="status-fail" style={{ color: "red" }}>
              Trượt
            </span>
          );
        } else if (status === 4) {
          return (
            <span className="status-fail" style={{ color: "red" }}>
              Đã nộp biên bản <br />
            </span>
          );
        } else if (status === 5) {
          return (
            <span className="status-fail" style={{ color: "red" }}>
              Sửa biên bản
              <br />
            </span>
          );
        } else if (status === 6) {
          return (
            <span className="status-fail" style={{ color: "red" }}>
              Đang thực tập <br />
            </span>
          );
        } else if (status === 7) {
          return (
            <span className="status-fail" style={{ color: "red" }}>
              Đã nộp báo cáo <br />
            </span>
          );
        } else if (status === 8) {
          return (
            <span className="status-fail" style={{ color: "red" }}>
              Sửa báo cáo <br />
            </span>
          );
        } else if (status === 9) {
          return (
            <span className="status-fail" style={{ color: "red" }}>
              Hoàn thành <br />
            </span>
          );
        } else {
          return (
            <span className="status-fail" style={{ color: "red" }}>
              Chưa đăng ký
            </span>
          );
        }
      },
    },
  ];
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setListIdStudent(selectedRowKeys);
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
    const data = {
      ...page,
      ...filter,
    };
    dispatch(getStudent(data));
  };

  const comfirm = () => {
    dispatch(
      updateReviewerListStudent({
        listIdStudent: listIdStudent,
        email: infoUser?.manager?.email,
      })
    );
    alert("Thêm thành công ");
    navigate("/review-cv");
  };

  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";

  const exportToCSV = (list) => {
    const newData = [];
    list.filter((item) => {
      const newObject = {};
      newObject["MSSV"] = item["mssv"];
      newObject["Họ tên"] = item["name"];
      newObject["Email"] = item["email"];
      newObject["Ngành"] = item["majors"];
      newObject["Số điện thoại"] = item["phoneNumber"];
      newObject["Tên công ty"] = item["nameCompany"];
      newObject["Địa chỉ công ty"] = item["addressCompany"];
      newObject["Mã số thuế"] = item["taxCode"];
      newObject["Vị trí thực tập"] = item["position"];
      newObject["Điểm thái độ"] = item["attitudePoint"];
      newObject["Điểm kết quả"] = item["resultScore"];
      newObject["Thời gian thực tập"] = item["internshipTime"];
      newObject["Hình thức"] = item["support"];
      return newData.push(newObject);
    });
    // eslint-disable-next-line array-callback-return
    newData.filter((item) => {
      if (item["Hình thức"] === 1) {
        item["Hình thức"] = 1;
        item["Hình thức"] = "Hỗ trợ";
      } else if (item["Hình thức"] === 0) {
        item["Hình thức"] = 0;
        item["Hình thức"] = "Tự tìm";
      } else {
      }
    });
    const ws = XLSX.utils.json_to_sheet(newData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileExtension);
  };
  const parentMethods = {
    major,
    ...page,
  };
  return (
    <div className="status">
      <div className="flex-header">
        {window.innerWidth < 739 ? (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              alignItems: "center",
            }}
          >
            <h4 style={{ fontSize: ".9rem", margin: "0 -15px" }}>
              Sinh viên đăng ký thực tập
            </h4>
            <Col
              xs={{ span: 12 }}
              md={{ span: 8 }}
              style={{ padding: "0 15px" }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span
                  style={{
                    width: "45%",
                    display: "flex",
                    flexWrap: "wrap",
                    margin: "0 -10px",
                  }}
                >
                  Học Kỳ :{" "}
                </span>
                <Select
                  className="filter-status"
                  style={{ width: "100%", margin: "0 20px" }}
                  onChange={(val) => setPage({ ...page, smester_id: val })}
                  defaultValue={defaultSemester?._id}
                  placeholder={defaultSemester?.name}
                >
                  {listSemesters?.map((item, index) => (
                    <Option value={item._id} key={index}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              </div>
            </Col>
            <Button
              variant="warning"
              style={{ marginRight: 15, height: 33 }}
              onClick={(e) => exportToCSV(list)}
            >
              Export
            </Button>
          </div>
        ) : (
          <>
            <h4>Sinh viên đăng ký thực tập</h4>
            <Col
              xs={{ span: 12 }}
              md={{ span: 8 }}
              style={{ padding: "0 3px" }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span
                  style={{ width: "45%", display: "flex", flexWrap: "wrap" }}
                >
                  Học Kỳ :{" "}
                </span>
                <Select
                  className="filter-status"
                  style={{ width: "100%", position: "relative", right: "18%" }}
                  onChange={(val) => setPage({ ...page, smester_id: val })}
                  placeholder={defaultSemester.name}
                  defaultValue={defaultSemester._id}
                >
                  {listSemesters?.map((item, index) => (
                    <Option value={item._id} key={index}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              </div>
            </Col>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span style={{ width: "45%" }}>Ngành: </span>
              <Select
                className="filter-status"
                style={{ width: "100%", padding: "0 5px" }}
                onChange={(val) => setMajor(val)}
                placeholder="Chọn ngành"
              >
                {listMajors &&
                  listMajors?.map((item, index) => (
                    <Option value={item._id} key={index}>
                      {item.name}
                    </Option>
                  ))}
              </Select>
            </div>
            <div style={{ display: "flex" }} className="bnt-export">
              <Button
                variant="warning"
                style={{ marginRight: 5, height: 36 }}
                onClick={(e) => exportToCSV(list)}
              >
                Export
              </Button>
              <UpFile parentMethods={parentMethods} keys="status" />
            </div>
          </>
        )}
      </div>
      <div className="filter" style={{ marginTop: "20px" }}>
        {window.innerWidth < 739 && (
          <UpFile
            parentMethods={parentMethods}
            keys="status"
            style={{ fontSize: ".9rem" }}
          />
        )}
        <br />
        <Row>
          <Col xs={{ span: 24 }} md={{ span: 8 }} style={{ padding: "0 10px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span className="select-status" style={{ width: "30%" }}>
                Ngành :{" "}
              </span>
              <Select
                className="select-branch"
                style={{ width: "100%", position: "relative", right: "9%" }}
                onChange={(val) => handleStandardTableChange("majors", val)}
                placeholder="Lọc theo ngành"
              >
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
          <Col xs={{ span: 24 }} md={{ span: 8 }} style={{ padding: "0 10px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span style={{ width: "45%" }}>Trạng thái :</span>
              <Select
                className="filter-status"
                style={{ width: "100%", position: "relative", right: "12%" }}
                onChange={(val) =>
                  handleStandardTableChange("statusCheck", val)
                }
                placeholder="Lọc theo trạng thái"
              >
                {filterStatuss.map((item, index) => (
                  <Option value={item.id} key={index}>
                    {item.title}
                  </Option>
                ))}
              </Select>
            </div>
          </Col>
          <br />
          <br />

          <br />
          <br />
          <Col xs={{ span: 24 }} md={{ span: 8 }} style={{ padding: "0 10px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span className="select-status" style={{ width: "40%" }}>
                Tìm Kiếm:{" "}
              </span>
              <Input
                style={{ width: "100%", position: "relative", right: "11%" }}
                placeholder="Tìm kiếm theo mã sinh viên"
                onChange={(val) =>
                  handleStandardTableChange("mssv", val.target.value.trim())
                }
              />
            </div>
          </Col>
          <br />
          <br />
          <Col
            xs={24}
            sm={4}
            md={24}
            lg={24}
            xl={4}
            style={{ padding: "0 10px" }}
          >
            <Button
              style={{
                color: "#fff",
                background: "#ee4d2d",
                display: "flex",
              }}
              onClick={handleSearch}
            >
              Tìm kiếm
            </Button>

            {chooseIdStudent.length > 0 && (
              <Button
                style={{
                  marginTop: "10px",
                  color: "#fff",
                  background: "#ee4d2d",
                }}
                onClick={() => comfirm()}
              >
                Xác nhận
              </Button>
            )}
          </Col>
        </Row>
      </div>

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
          //       <p className="list-detail">Điện thoại: {record.phoneNumber}</p>
          //       <br />
          //       <p className="list-detail">Ngành: {record.majors}</p>
          //       <br />
          //       <p className="list-detail">
          //         Phân loại:
          //         {record.support === 1 && 'Hỗ trợ'}
          //         {record.support === 0 && 'Tự tìm'}
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
          //       <p className="list-detail">Người review: {record.reviewer}</p>
          //       <br />
          //     </div>
          //   ),
          // }}
        >
          <Column title="Mssv" dataIndex="mssv" key="_id" />
          <Column title="Họ và Tên" dataIndex="name" key="_id" />
          {window.innerWidth > 739 && window.innerWidth < 1023 && (
            <Column title="Email" dataIndex="email" key="_id" />
          )}
          <Column
            title="Trạng thái"
            dataIndex="statusCheck"
            key="_id"
            render={(status) => {
              if (status === 0) {
                return (
                  <span className="status-fail" style={{ color: "orange" }}>
                    Chờ kiểm tra
                  </span>
                );
              } else if (status === 1) {
                return (
                  <span className="status-up" style={{ color: "grey" }}>
                    Sửa lại CV
                  </span>
                );
              } else if (status === 2) {
                return (
                  <span className="status-fail" style={{ color: "red" }}>
                    Nhận CV
                  </span>
                );
              } else if (status === 3) {
                return (
                  <span className="status-fail" style={{ color: "red" }}>
                    Trượt
                  </span>
                );
              } else if (status === 4) {
                return (
                  <span className="status-fail" style={{ color: "red" }}>
                    Đã nộp biên bản <br />
                  </span>
                );
              } else if (status === 5) {
                return (
                  <span className="status-fail" style={{ color: "red" }}>
                    Sửa biên bản <br />
                  </span>
                );
              } else if (status === 6) {
                return (
                  <span className="status-fail" style={{ color: "red" }}>
                    Đang thực tập <br />
                  </span>
                );
              } else if (status === 7) {
                return (
                  <span className="status-fail" style={{ color: "red" }}>
                    Đã nộp báo cáo <br />
                  </span>
                );
              } else if (status === 8) {
                return (
                  <span className="status-fail" style={{ color: "red" }}>
                    Sửa báo cáo <br />
                  </span>
                );
              } else if (status === 9) {
                return (
                  <span className="status-fail" style={{ color: "red" }}>
                    Hoàn thành <br />
                  </span>
                );
              } else {
                return (
                  <span className="status-fail" style={{ color: "red" }}>
                    Chưa đăng ký
                  </span>
                );
              }
            }}
          />
        </Table>
      )}

      {modal && (
        <StudentDetail
          infoUser={infoUser}
          studentId={studentdetail._id}
          onShowModal={modal}
          closeModal={() => setModal(false)}
          listBusiness={listBusiness}
          listManager={listManager}
        />
      )}
    </div>
  );
};

Status.propTypes = {
  listStudent: object,
  infoUser: object,
  listManager: object,
  listBusiness: object,
  listMajors: array,
};

export default connect(({ students, semester, manager, business, major }) => ({
  listStudent: students.listStudent,
  listSemesters: semester.listSemesters,
  defaultSemester: semester.defaultSemester,
  loading: students.loading,
  listManager: manager.listManager,
  listBusiness: business.listBusiness,
  listMajors: major.listMajor,
}))(Status);
