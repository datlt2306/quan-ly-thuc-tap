import React, { useState, useEffect } from 'react'
import StudentAPI from '../../../API/StudentAPI'
import { EyeOutlined ,EditOutlined} from '@ant-design/icons'
import '../../../common/styles/ReviewCV.css'
import { Select, Input, Table } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { getStudent, updateStudent } from '../../../features/StudentSlice/StudentSlice';
import { Link } from 'react-router-dom';
const { Option } = Select;
const ReviewReport = () => {
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


  // lọc theo ngành
  const filterMajors = async (value) => {

    setStudentSearch(students.filter(item => item.majors.toLowerCase().includes(value.toLowerCase())))
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
      title: 'Báo cáo',
      dataIndex: 'link_cv',
      render: (link_cv, student) => student.classify == 1 ? <EyeOutlined className='icon-cv' onClick={() => window.open(link_cv)} /> : '',
    }
    ,
    {
      title: 'Hành động',
      dataIndex: 'id',
      render: (key) =><Link to={`/thay-doi-trang-thai/id=${key}`}><EditOutlined /></Link> ,
    }
  ];
  // chọn sinh viên
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
    dispatch(updateStudent(newStudents))
    // newStudents.map(item => {
    //   StudentAPI.upload(item.id, { ...item, "user_id": '' })
    // })
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
      <h4>Sinh viên bạn chọn xem báo cáo</h4>

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

export default ReviewReport