import React, { useState, useEffect, useCallback } from 'react';
import StudentAPI from '../../API/StudentAPI';
import { EyeOutlined } from '@ant-design/icons';
import '../../common/styles/status.css';
import { Select, Input, Table, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { getStudent } from '../../features/StudentSlice/StudentSlice';
import {
  getListStudentAssReviewer,
  updateReviewerListStudent,
} from '../../features/reviewerStudent/reviewerSlice';
import { Link, useNavigate } from 'react-router-dom';
import { filterBranch, filterStatuss } from '../../ultis/selectOption';
import { omit } from 'lodash';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
const { Option } = Select;

const Reviewform = () => {
  const dispatch = useDispatch();
  let navigate = useNavigate();
  const { infoUser } = useSelector((state) => state.auth);
  const {
    listStudentAssReviewer: { total, list },
    loading,
  } = useSelector((state) => state.reviewer);

  

  const [chooseIdStudent, setChooseIdStudent] = useState([]);
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
    dispatch(getListStudentAssReviewer(data));
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
      title: 'Ngành',
      dataIndex: 'majors',
      width: 100,
    },
    {
      title: 'Phân loại',
      dataIndex: 'support',
      width: 90,
      render: (val) => {
        if (val === 1) {
          return 'Hỗ trợ';
        } else if (val === 0) {
          return 'Tự tìm';
        } else {
          return '';
        }
      },
    },
    {
      title: 'CV',
      dataIndex: 'CV',
      width: 50,
      render: (val) =>
        val ? <EyeOutlined className="icon-cv" onClick={() => window.open(val)} /> : '',
    },
    {
      title: 'Người review',
      dataIndex: 'reviewer',
      width: 230,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'statusCheck',
      render: (status) => {
        if (status === 0) {
          return (
            <span className="status-check" style={{ color: 'orange' }}>
              Chờ kiểm tra <br />
              <Button>Sửa</Button>
            </span>
          );
        } else if (status === 1) {
          return (
            <span className="status-up" style={{ color: 'grey' }}>
              Đang kiểm tra
              <br />
              <Button>Sửa</Button>
            </span>
          );
        } else if (status === 2) {
          return (
            <span className="status-fail" style={{ color: 'green' }}>
              Nhận Cv <br />
              <Button>Sửa</Button>
            </span>
          );
        } else if (status === 3) {
          return (
            <span className="status-true" style={{ color: 'red' }}>
              Không đủ Đk <br />
              <Button>Sửa</Button>
            </span>
          );
        } else if (status === 4) {
          <span className="status-true" style={{ color: 'red' }}>
            Trượt <br />
            <Button>Sửa</Button>
          </span>;
        } else {
          return (
            <span className="status-true" style={{ color: 'red' }}>
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
    navigate('/review-cv');
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
      const ws = XLSX.utils.json_to_sheet(list);
      const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const data = new Blob([excelBuffer], {type: fileType});
      FileSaver.saveAs(data, fileExtension);
  }
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
            <>
              <Option value={item.value} key={index}>
                {item.title}
              </Option>
            </>
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
        <Select
          className="filter-status"
          style={{ width: 200 }}
          onChange={(val) => handleStandardTableChange('classify', val)}
          placeholder="Lọc theo phân loại"
        >
          <Option value="0">Tự tìm</Option>
          <Option value="1">Nhờ nhà trường</Option>
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
        {chooseIdStudent.length > 0 && <Button onClick={() => chooseStudent()}>Xác nhận</Button>}
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

export default Reviewform;
