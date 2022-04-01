import React, { useState, useEffect } from 'react'
import StudentAPI from '../../../API/StudentAPI'
import { EyeOutlined, FilePdfOutlined } from '@ant-design/icons'
import '../../../common/styles/status.css'
import { notification, Select, Input, Checkbox, Table } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { $ } from '../../../ultis';
import { getStudent } from '../../../features/StudentSlice/StudentSlice';
import { editStudent } from '../../../features/UserSlice/UserSilce';
const { Option } = Select;
const ReviewCV = () => {
  const user = JSON.parse(localStorage.getItem('user'))
  const dispatch = useDispatch()
  const students = useSelector(data => data.students.value);
  
  // lọc ra được sinh viên mà user đã chọn để review cv
  const selectedStudent = students.filter(item => item.user_id == user.id)

  const [studentSearch, setStudentSearch] = useState([])
  const [chooseIdStudent, setChooseIdStudent] = useState([])

  const newStudents = (studentSearch.length == 0 ? selectedStudent : studentSearch)

  useEffect(() => {
    dispatch(getStudent())
    setStudentSearch([])
  }, [])

  // ấn chi tiết để xem được chi tiết trạng thái
  const openDetail = async (student, status) => {
    notification[status == 'warning' ? 'warning' : 'error']({
      message: 'Chi tiết',
      description:
        `${student.status_detail}`,
    })

  }

  // lọc theo ngành
  const filterMajors = async (value) => {

    setStudentSearch(students.filter(item => item.majors.toLowerCase().includes(value.toLowerCase())))
  }
  // lọc theo trạng thái
  const filterStatus = async (value) => {
    setStudentSearch(students.filter(item => item.status.toLowerCase().includes(value.toLowerCase())))
  }
  // lọc theo phân loại
  const filterClassify = async (value) => {
    setStudentSearch(students.filter(item => item.classify.toLowerCase().includes(value.toLowerCase())))
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
      title: 'Phân loại',
      dataIndex: 'classify',
      render: (classify) => classify == 0 ? 'Tự đăng ký' : 'Hỗ trợ',

    }
    ,
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (status, student) => {
        function ji() {
          if (status == 0) {
            return <span className='status-fail' style={{ color: 'red' }}>Đã tạch <br /><button onClick={() => openDetail(student, 'error')}>Đã tạch</button></span>
          } else if (status == 1) {
            return <span className='status-up' style={{ color: 'red' }}>Sửa lại<br /><button>Sửa</button></span>
          } else if (status == 2) {
            return <span className='status-check' style={{ color: 'rgb(255, 106, 0)' }}>Chờ kiểm tra</span>
          } else if (status == 3) {
            return <span className='status-true' style={{ color: 'rgb(44, 194, 21)' }}>Đã kiểm tra</span>
          }
        }
        < Select defaultValue={ji()} className='filter-status' style={{ width: 200 }} onChange={filterStatus} >
          {status == 0 && <span className='status-fail' style={{ color: 'red' }}>Đã tạch <br /><button onClick={() => openDetail(student, 'error')}>Đã tạch</button></span>}

        </Select >
      }
    }
  ];
  const rowSelection = {
    onChange: (selectedRows) => {
      setChooseIdStudent(selectedRows)
    },
  };
  const chooseStudent = () => {
    const newStudents = []
    students.filter(item => {
      chooseIdStudent.map(id => {
        id == item.id && newStudents.push(item)
      })
    })
    newStudents.map(item => {
        dispatch(editStudent(item.id, { ...item, "user_id": '' }))
    })
    // alert("Xóa thành công")

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
          <Option value="0">Chưa đạt</Option>
          <Option value="1">Đã tạch</Option>
          <Option value="2">Sửa CV</Option>
          <Option value="3">Đang kiểm tra</Option>
          <Option value="4">CV đã ổn</Option>
          <Option value="5">Đi phỏng vấn</Option>
          <Option value="6">Trượt phỏng ấn đang đợi nhà trường chọn doanh nghiệp</Option>
          <Option value="7">Đang thực tập</Option>
        </Select>
        <Select className='filter-status' style={{ width: 200 }} onChange={filterClassify} placeholder="Lọc theo phân loại">
          <Option value="0">Tự tìm</Option>
          <Option value="1">Nhờ nhà trường</Option>
        </Select>
        <Input style={{ width: 200 }} placeholder="Tìm kiếm theo tên" onChange={(e) => filterInput(e.target.value)} />
        {studentSearch.length > 0 && <button onClick={() => deleteFilter()}>Xóa lọc</button>}
        {chooseIdStudent.length > 0 && <button onClick={() => chooseStudent()}>Xóa</button>}
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