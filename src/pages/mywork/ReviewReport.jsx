import React, { useState, useEffect, useCallback } from 'react';
import '../../common/styles/status.css';
import { Select, Input, Table, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { getStudent } from '../../features/StudentSlice/StudentSlice';
import {
    listStudentReport,
    updateReviewerListStudent,
    updateStatusListStudent
} from '../../features/reviewerStudent/reviewerSlice';
import { filterBranch, filterStatuss } from '../../ultis/selectOption';
import { omit } from 'lodash';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { statusConfigReport } from '../../ultis/constConfig';
const { Option } = Select;

const ReviewReport = () => {
    const dispatch = useDispatch();
    const { infoUser } = useSelector((state) => state.auth);
    const {
        listStudentAssReviewer: { total, list },
        loading,
    } = useSelector((state) => state.reviewer);
    const [chooseIdStudent, setChooseIdStudent] = useState([]);
    const [status, setStatus] = useState({});
    const [listIdStudent, setListIdStudent] = useState([]);
    const [page, setPage] = useState({
        page: 1,
        limit: 20,
        campus_id: infoUser.manager.cumpus,
        reviewer: infoUser.manager.email,
    });
    const [filter, setFiler] = useState({});
    useEffect(() => {
        const data = {
            ...page,
            ...filter,
        };
        dispatch(listStudentReport(data));
    }, [page]);

    const columns = [
        {
            title: 'MSSV',
            dataIndex: 'mssv',
            width: 100,
            fixed: 'left',
        },
        {
            title: 'Họ và Tên',
            dataIndex: 'name',
            width: 150,
            fixed: 'left',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            width: 200,
        },
        {
            title: 'Điện thoại',
            dataIndex: 'phoneNumber',
            width: 160,
        },
        {
            title: 'Điểm thái độ',
            dataIndex: 'attitudePoint',
            width: 180,
        },
        {
            title: 'Điểm kết quả',
            dataIndex: 'resultScore',
            width: 100,
        },
        {
            title: 'Báo cáo',
            dataIndex: 'report',
            width: 100,
        },

        {
            title: 'Trạng thái',
            dataIndex: 'statusCheck',
            render: (status) => {
              if (status === 0) {
                return (
                  <span className="status-fail" style={{ color: 'orange' }}>
                    Chờ kiểm tra
                  </span>
                );
              } else if (status === 1) {
                return (
                  <span className="status-up" style={{ color: 'grey' }}>
                    Sửa lại CV
                  </span>
                );
              } else if (status === 2) {
                return (
                  <span className="status-fail" style={{ color: 'red' }}>
                    Nhận CV
                  </span>
                );
              }
              else if (status === 3) {
                return (
                  <span className="status-fail" style={{ color: 'red' }}>
                    Trượt
                  </span>
                );
              }  else if (status === 4) {
                return (
                  <span className="status-fail" style={{ color: 'red' }}>
                    Đã nộp biên bản <br />
                  </span>
                );
              } else if (status === 5) {
                return (
                  <span className="status-fail" style={{ color: 'red' }}>
                    Sửa biên bản <br />
                  </span>
                );
              } else if (status === 6) {
                return (
                  <span className="status-fail" style={{ color: 'red' }}>
                   Đang thực tập <br />
                  </span>
                );
              } else if (status === 7) {
                return (
                  <span className="status-fail" style={{ color: 'red' }}>
                    Đã nộp báo cáo <br />
                  </span>
                );
              } else if (status === 8) {
                return (
                  <span className="status-fail" style={{ color: 'red' }}>
                    Sửa báo cáo <br />
                  </span>
                );
              } else if (status === 9) {
                return (
                  <span className="status-fail" style={{ color: 'red' }}>
                    Hoàn thành <br />
                  </span>
                );
              } else {
                return (
                  <span className="status-fail" style={{ color: 'red' }}>
                    Chưa đăng ký
                  </span>
                );
              }
            },
          },
    ];
    // xóa tìm kiếm
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setListIdStudent(selectedRowKeys);
            setChooseIdStudent(selectedRows);
        },
    };
    const chooseStudent = useCallback(() => {
        dispatch(
            updateReviewerListStudent({
                listIdStudent: listIdStudent,
                email: infoUser?.manager?.email,
            }),
        );
        alert('Thêm thành công ');
    }, [listIdStudent]);

    const handleStandardTableChange = (key, value) => {
        const newValue =
            value.length > 0 || value > 0
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


    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';

    const exportToCSV = (list) => {
        const newData = []

        list.filter(item => {
            const newObject = {};
            newObject["MSSV"] = item["mssv"];
            newObject["Họ tên"] = item["name"];
            newObject["Email"] = item["email"];
            newObject["Số điện thoại"] = item["phone"];
            newObject["Điểm thái độ"] = item["attitudePoint"];
            newObject["Điểm kết quả"] = item["resultScore"];
            newObject["Báo cáo"] = item["report"];
            newData.push(newObject);
        });

        const ws = XLSX.utils.json_to_sheet(newData);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, fileExtension);
    }



    const actionOnchange = (value) => {
        switch (value) {
            case 'assgin':
                dispatch(
                    updateReviewerListStudent({
                        listIdStudent: listIdStudent,
                        email: infoUser?.manager?.email,
                    }),
                );
                setStatus([]);
                alert('Thêm thành công ');
                break;
            case 'edit':
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
        setStatus({
            listIdStudent: listIdStudent,
            email: infoUser?.manager?.email,
            status: value,
        });
    };

    const comfirm = () => {
        dispatch(updateStatusListStudent(status));
        setChooseIdStudent([]);
    };

    return (
        <div className="status">
            <h4>Review biểu mẫu</h4>
            <Button variant="warning" onClick={(e) => exportToCSV(list)}>Export</Button>
            <br />
            <br />
            <div className="filter">

                <span>Ngành: </span>

                <Select
                    style={{ width: 200 }}
                    onChange={(val) => handleStandardTableChange('majors', val)}
                    placeholder="Lọc theo ngành"
                >
                    {filterBranch.map((item, index) => (
                        <Option value={item.value} key={index}>
                            {item.title}
                        </Option>
                    ))}
                </Select>
                <span
                    style={{
                        marginLeft: '30px',
                    }}
                >
                    Trạng thái:
                </span>
                <Select
                    className="filter-status"
                    style={{ width: 200 }}
                    onChange={(val) => handleStandardTableChange('statusCheck', val)}
                    placeholder="Lọc theo trạng thái"
                >
                    {filterStatuss.map((item, index) => (
                        <Option value={index} key={index}>
                            {item.title}
                        </Option>
                    ))}
                </Select>
                <span
                    style={{
                        marginLeft: '30px',
                    }}
                >
                    Tìm Kiếm:{' '}
                </span>
                <Input
                    style={{ width: 200 }}
                    placeholder="Tìm kiếm theo tên"
                    onChange={(val) => handleStandardTableChange('name', val.target.value)}
                />
                <Button onClick={handleSearch}>Tìm kiếm</Button>
                {chooseIdStudent.length > 0 && (

                    <div className="comfirm">
                        <span>Lựa chọn:</span>
                        <Select
                            className="comfirm-click"
                            style={{ width: 170 }}
                            onChange={actionOnchange}
                            placeholder="Chọn"
                        >
                            <Option value="assgin" key="1">
                                Kéo việc
                            </Option>
                            <Option value="edit" key="2">
                                Cập nhật trạng thái
                            </Option>
                        </Select>

                        {Object.keys(status).length >= 1 && (
                            <Select
                                className="upload-status"
                                style={{ width: 150 }}
                                onChange={(e) => selectStatus(e)}
                                placeholder="Chọn trạng thái"
                            >
                                {statusConfigReport.map((item,index)=> (
                                      <Option value={item.value} key={index}>
                                          {item.title}
                                  </Option>
                                ))}
                            </Select>
                        )}

                        <Button onClick={() => comfirm()}>Xác nhận</Button>
                    </div>
                )}
            </div>

            <Table
                rowSelection={{
                    type: 'checkbox',
                    ...rowSelection,
                }}
                pagination={{
                    pageSize: page.limit,
                    total: total,
                    onChange: (pages, pageSize) => {
                        setPage({
                            ...page,
                            page: pages,
                            limit: pageSize,
                            ...filter,
                        });
                    },
                }}
                rowKey="_id"
                loading={loading}
                columns={columns}
                dataSource={list}
                scroll={{ x: 'calc(700px + 50%)' }}
            />
        </div>
    );
};

export default ReviewReport;
