import React, { useState, useEffect } from 'react'
import StudentAPI from '../../API/StudentAPI'
import { EyeOutlined, EditOutlined } from '@ant-design/icons'
import '../../common/styles/status.css'
import { Select, Input, Table } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { getStudent, updateStudent } from '../../features/StudentSlice/StudentSlice';
import { Link } from 'react-router-dom';
import { getUser } from '../../features/UserSlice/UserSilce';
import { getData, upData } from '../../features/DataSlice/DataSlice';
import DataAPI from '../../API/Data';
const { Option } = Select;
const ReviewCV = () => {
  const user = JSON.parse(localStorage.getItem('user'))
  const dispatch = useDispatch()
  var dataExcel = useSelector(data => data.data.listData);
  const users = useSelector(data => data.users.value);

  const [idUser, setIdUser] = useState('')
  const [studentSearch, setStudentSearch] = useState([])
  const [chooseIdStudent, setChooseIdStudent] = useState([])

  // hiện sinh viên chỉ nhờ nhà trường
  const studentSupport = dataExcel.length >= 1 && dataExcel.filter(item => item.classify == 1)


  useEffect(() => {
    dispatch(getStudent())
    dispatch(getUser())
    dispatch(getData())
    setStudentSearch([])
  }, [])

  // lọc theo ngành
  const filterMajors = async (value) => {

    setStudentSearch(dataExcel.filter(item => item.majors.toLowerCase().includes(value.toLowerCase())))
  }
  // lọc theo trạng thái
  const filterStatus = async (value) => {
    setStudentSearch(dataExcel.filter(item => item.status.toLowerCase().includes(value.toLowerCase())))
  }

  // xóa tìm kiếm
  const deleteFilter = () => {
    setStudentSearch([])
  }
  // tìm kiếm theo tên
  const filterInput = async (e) => {
    setStudentSearch(dataExcel.filter(item => item.name.toLowerCase().includes(e.toLowerCase())))
  }

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
    }
    ,
    {
      title: 'Điện thoại',
      dataIndex: 'phone',
    }
    ,
    {
      title: 'Ngành',
      dataIndex: 'internship_industry',
    }
    ,
    {
      title: 'CV',
      dataIndex: 'link_cv',
      render: (link_cv, student) => student.classify == 1 ? <EyeOutlined className='icon-cv' onClick={() => window.open(link_cv)} /> : '',
    }
    ,
    {
      title: 'Người review',
      dataIndex: 'user_id',
      render: (user_id) => users.map(item => user_id == item.id && item.email.slice(0, -11))
    }
    ,
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (statuscheck) => {
        if (statuscheck == 0) {
          return <span className='status-fail' style={{ color: 'red' }}>Trượt thực tập</span>
        } else if (statuscheck == 1) {
          return <span className='status-up' style={{ color: 'red' }}>Sửa lại</span>
        } else if (statuscheck == 2) {
          return <span className='status-check' style={{ color: 'rgb(255, 106, 0)' }}>Chờ kiểm tra </span>
        } else if (statuscheck == 3) {
          return <span className='status-true' style={{ color: 'rgb(44, 194, 21)' }}>Đã kiểm tra </span>
        }
      }

    }
    ,
    {
      title: 'Hành động',
      dataIndex: 'id',
      render: (key) => <Link to={`/thay-doi-trang-thai/id=${key}`}><EditOutlined /></Link>,
    }
  ];
  // chọn sinh viên
  const rowSelection = {
    onChange: (selectedRows) => {
      setChooseIdStudent(selectedRows)
    },
  };
  // chọn  id user
  const chooseStudent = (value) => {
    setIdUser(value)
  }
  // xác nhận chuyển
  const confirm = () => {

    var newStudents = []
    chooseIdStudent.map(id => {
      dataExcel.filter(item => {
        if (item.id == id) {
          DataAPI.upload(item.id, { ...item, "user_id": idUser })
          newStudents.push({ ...item, "user_id": idUser })
        }
      })
    })

    // up lại data khi assign sinh viên cho người khác review
    dataExcel = dataExcel.map(el => {
      var found = newStudents.find(s => s.id === el.id);
      if (found) {
        el = Object.assign({}, el, found);
      }
      return el
    });
    dispatch(upData(dataExcel))
    setChooseIdStudent([])
  }

  const data = [];
  for (let i = 0; i < studentSupport.length; i++) {
    data.push({
      "key": studentSupport[i].id,
      "mssv": studentSupport[i].mssv,
      "name": studentSupport[i].name,
      "email": studentSupport[i].email,
      "phone": studentSupport[i].phone,
      "address": studentSupport[i].address,
      "internship_industry": studentSupport[i].internship_industry,
      "majors": studentSupport[i].majors,
      "link_cv": studentSupport[i].link_cv,
      "statuscheck": studentSupport[i].statuscheck,
      "status_detail": studentSupport[i].status_detail,
      "user_id": studentSupport[i].user_id,
      "classify": studentSupport[i].classify
    });
  }


  return (
    <div className='status'>
      <h4>Sinh viên bạn chọn review CV</h4>

      <div className="filter">
        <Select style={{ width: 200 }} onChange={filterMajors} placeholder="Lọc theo ngành">
          <Option value="QTDN">Quản trị doanh nghiệp</Option>
          <Option value="TKĐH">Thiết kế đồ họa</Option>
          <Option value="UDPM">Ứng dụng phần mềm</Option>
          <Option value="TMĐT">Maketing</Option>
          <Option value="LTMT">Lập trình máy trính</Option>
          <Option value="TKTW">Thiết kế Website</Option>
          <Option value="QHCC">Quan hệ công chúng</Option>
        </Select>
        <Select className='filter-status' style={{ width: 200 }} onChange={filterStatus} placeholder="Lọc theo trạng thái">
          <Option value="0">Trượt thực tập</Option>
          <Option value="1">Sửa lại</Option>
          <Option value="2">Chờ kiểm tra</Option>
          <Option value="3">Đã kiểm tra</Option>
        </Select>

        <Input style={{ width: 200 }} placeholder="Tìm kiếm theo tên" onChange={(e) => filterInput(e.target.value)} />
        {studentSearch.length > 0 && <button onClick={() => deleteFilter()}>Xóa lọc</button>}

        {chooseIdStudent.length > 0 &&
          <>
            <Select className='filter-status' style={{ width: 200 }} onChange={chooseStudent} placeholder="Chuyển cho người khác">
              {users.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)}
            </Select>
            <button onClick={() => confirm()}>Xác nhận</button>
          </>

        }
      </div>

      <Table
        rowSelection={{
          type: 'checkbox',
          ...rowSelection,
        }}
        columns={columns}
        dataSource={data}
      />

    </div>
  )
}

export default ReviewCV
