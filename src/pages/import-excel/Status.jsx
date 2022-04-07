import React, { useState, useEffect } from 'react';
import StudentAPI from '../../API/StudentAPI';
import { EyeOutlined } from '@ant-design/icons';
import '../../common/styles/status.css';
import { Select, Input, Table, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { getStudent } from '../../features/StudentSlice/StudentSlice';
import { updateReviewerListStudent } from '../../features/reviewerStudent/reviewerSlice';
import { Link, useNavigate } from 'react-router-dom';
import { filterBranch, filterStatuss } from '../../ultis/selectOption';
import { omit } from 'lodash';
const { Option } = Select;

const Status = () => {
  const dispatch = useDispatch();
  let navigate = useNavigate();
  const { infoUser } = useSelector((state) => state.auth);
  const {
    listStudent: { list, total },
    loading,
  } = useSelector((state) => state.students);
  const users = useSelector((data) => data.users.value);
  const [studentSearch, setStudentSearch] = useState([]);
  const [chooseIdStudent, setChooseIdStudent] = useState([]);
  const [listIdStudent,setListIdStudent] = useState([])
  const [page, setPage] = useState({
    page: 1,
    limit: 20,
    campus_id: infoUser.manager.cumpus,
  });
  const [filter, setFiler] = useState({});
  useEffect(() => {
      const data = {
          ...page,
          ...filter
      }
    dispatch(getStudent(data));
    setStudentSearch([]);
  }, [page, filter]);

  const columns = [
    {
      title: 'MSSV',
      dataIndex: 'mssv',
    },
    {
      title: 'Họ và Tên',
      dataIndex: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Điện thoại',
      dataIndex: 'phone',
    },
    {
      title: 'Ngành',
      dataIndex: 'majors',
    },
    // {
    //   title: 'Phân loại',
    //   dataIndex: 'classify',
    //   render: (classify) => (classify == 0 ? 'Tự đăng ký' : 'Hỗ trợ'),
    // },
    {
      title: 'CV',
      dataIndex: 'CV',
      render: (link_cv) =>
        list.CV ? <EyeOutlined className="icon-cv" onClick={() => window.open(link_cv)} /> : '',
    },
    {
      title: 'Người review',
      dataIndex: 'user_id',
      render: (user_id) => users.map((item) => user_id == item.id && item.email.slice(0, -11)),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (status, student) => {
        if (status == 0) {
          return (
            <span className="status-fail" style={{ color: 'red' }}>
              Đã tạch <br />
              <Link to={`/edit-cv/id=${student.key}`}>Sửa</Link>
            </span>
          );
        } else if (status == 1) {
          return (
            <span className="status-up" style={{ color: 'red' }}>
              Sửa lại
              <br />
              <Link to={`/ed/id=${student.key}`}>Sửa</Link>
            </span>
          );
        } else if (status == 2) {
          return (
            <span className="status-check" style={{ color: 'rgb(255, 106, 0)' }}>
              Chờ kiểm tra <br />
              <Link to={`/ed/id=${student.key}`}>Sửa</Link>
            </span>
          );
        } else if (status == 3) {
          return (
            <span className="status-true" style={{ color: 'rgb(44, 194, 21)' }}>
              Đã kiểm tra <br />
              <Link to={`/ed/id=${student.key}`}>Sửa</Link>
            </span>
          );
        } else {
          return (
            <span className="status-true" style={{ color: 'rgb(44, 194, 21)' }}>
              Chưa đăng ký
            </span>
          );
        }
      },
    },
  ];
  // xóa tìm kiếm
  const deleteFilter = () => {
    setStudentSearch([]);
  };
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
        setListIdStudent(selectedRowKeys)
        setChooseIdStudent(selectedRows)
    },
  };
  const chooseStudent = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const newStudents = [];
    list.filter((item) => {
      chooseIdStudent.map((id) => {
        id == item.id && newStudents.push(item);
      });
    });
    newStudents.map((item) => {
      StudentAPI.upload(item.id, { ...item, user_id: `${user.id}` });
    });
    dispatch(updateReviewerListStudent({listIdStudent:listIdStudent, email:infoUser?.manager?.email}))
    alert('Thêm thành công ');
    navigate('/review-cv');
  };
  
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
  const handleSearch = ()=> {
      const data ={
          ...page,
          ...filter
      }
      dispatch(getStudent(data))
  }
  return (
    <div className="status">
      <h4>Sinh viên đăng ký thực tập</h4>

      <div className="filter">
        <span>Ngành:  </span>

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
        <span style={{
            marginLeft: '30px'
        }} >Trạng thái:</span>
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
        {/* <Select
          className="filter-status"
          style={{ width: 200 }}
          onChange={val =>handleStandardTableChange('classify', val)}
          placeholder="Lọc theo phân loại"
        >
          <Option value="0">Tự tìm</Option>
          <Option value="1">Nhờ nhà trường</Option>
        </Select> */}
        <span style={{
            marginLeft: '30px'
        }}>Tìm Kiếm: </span>
        <Input
          style={{ width: 200 }}
          placeholder="Tìm kiếm theo tên"
          onChange={(val) => handleStandardTableChange('name', val.target.value)
          }
        />
        <Button onClick={handleSearch}  >Tìm kiếm</Button>
        {studentSearch.length > 0 && <button onClick={() => deleteFilter()}>Xóa lọc</button>}
        {chooseIdStudent.length > 0 && <button onClick={() => chooseStudent()}>Xác nhận</button>}
      </div>

      <Table
        rowSelection={{
            type: 'checkbox',
            ...rowSelection
        }}
        pagination={{
          pageSize: page.limit,
          total: total,
          onChange: (page, pageSize) => {
            setPage({
              page: page,
              limit: pageSize,
              campus_id: infoUser.manager.cumpus,
            });
          },
        }}
        rowKey='_id'
        loading={loading}
        columns={columns}
        dataSource={list}
      />
    </div>
  );
};

export default Status;