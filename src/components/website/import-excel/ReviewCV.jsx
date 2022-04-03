import React, { useState, useEffect } from 'react'
import StudentAPI from '../../../API/StudentAPI'
import { EyeOutlined, EditOutlined } from '@ant-design/icons'
import '../../../common/styles/ReviewCV.css'
import { Select, Input, Table } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { getStudent, updateStudent } from '../../../features/StudentSlice/StudentSlice';
import { Link } from 'react-router-dom';
import { getUser } from '../../../features/UserSlice/UserSilce';
const { Option } = Select;
const ReviewCV = () => {
  const user = JSON.parse(localStorage.getItem('user'))
  const dispatch = useDispatch()
  var students = useSelector(data => data.students.value);
  const users = useSelector(data => data.users.value);

  // lọc ra được sinh viên mà user đã chọn để review cv
  const selectedStudent = students.filter(item => item.user_id == user.id)

  const [idUser, setIdUser] = useState('')
  const [studentSearch, setStudentSearch] = useState([])
  const [chooseIdStudent, setChooseIdStudent] = useState([])

  const newStudents = (studentSearch.length == 0 ? selectedStudent : studentSearch)

  useEffect(() => {
    dispatch(getStudent())
    dispatch(getUser())
    setStudentSearch([])
  }, [])


  // lọc theo ngành
  const filterMajors = async (value) => {

    setStudentSearch(students.filter(item => item.majors.toLowerCase().includes(value.toLowerCase())))
  }
  // lọc theo trạng thái
  const filterStatus = async (value) => {
    setStudentSearch(students.filter(item => item.status.toLowerCase().includes(value.toLowerCase())))
  }

  // xóa tìm kiếm
  const deleteFilter = () => {
    setStudentSearch([])
  }
  // tìm kiếm theo tên
  const filterInput = async (e) => {
    setStudentSearch(students.filter(item => item.name.toLowerCase().includes(e.toLowerCase())))
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
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (status) => {
        if (status == 0) {
          return <span className='status-fail' style={{ color: 'red' }}>Trượt thực tập</span>
        } else if (status == 1) {
          return <span className='status-up' style={{ color: 'red' }}>Sửa lại</span>
        } else if (status == 2) {
          return <span className='status-check' style={{ color: 'rgb(255, 106, 0)' }}>Chờ kiểm tra </span>
        } else if (status == 3) {
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
        students.filter(item => {
        if (item.id == id) {
          newStudents.push({ ...item, "user_id": idUser })
        }
      })
    })

    // up lại user_id của sinh viên khi được assign cho người khác
    newStudents.map(item => {
      StudentAPI.upload(item.id, { ...item, "user_id": idUser})
    })

    // up lại data khi assign sinh viên cho người khác review
    students = students.map(el => {
      var found = newStudents.find(s => s.id === el.id);
      if (found) {
       el = Object.assign({},el, found);
      }
      return el
    });
    dispatch(updateStudent(students))
    setChooseIdStudent([])
    alert("Bạn đã chuyển thành công ")
  }

  const data = [];
  for (let i = 0; i < newStudents.length; i++) {
    data.push({
      "key": newStudents[i].id,
      "mssv": newStudents[i].mssv,
      "name": newStudents[i].name,
      "email": newStudents[i].email,
      "phone": newStudents[i].phone,
      "address": newStudents[i].address,
      "internship_industry": newStudents[i].internship_industry,
      "majors": newStudents[i].majors,
      "link_cv": newStudents[i].link_cv,
      "status": students[i].status,
      "status_detail": newStudents[i].status_detail,
      "user_id": newStudents[i].user_id,
      "classify": newStudents[i].classify
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