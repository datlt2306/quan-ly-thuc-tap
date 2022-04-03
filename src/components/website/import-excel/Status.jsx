import React, { useState, useEffect } from 'react'
import StudentAPI from '../../../API/StudentAPI'
import { EyeOutlined,EditOutlined } from '@ant-design/icons'
import '../../../common/styles/status.css'
import { Select, Input, Table } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { getStudent } from '../../../features/StudentSlice/StudentSlice';
import { getUser } from '../../../features/UserSlice/UserSilce';
import { Link, useNavigate } from 'react-router-dom';
const { Option } = Select;
const Status = () => {
    const dispatch = useDispatch()
    let navigate = useNavigate();
    const { infoUser } = useSelector(state => state.auth)
    const students = useSelector(data => data.students.value);
    const users = useSelector(data => data.users);
    const [studentSearch, setStudentSearch] = useState([])
    const [chooseIdStudent, setChooseIdStudent] = useState([])

    const newStudents = (studentSearch.length == 0 ? students : studentSearch)

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
    // lọc theo phân loại
    const filterClassify = async (value) => {
        setStudentSearch(students.filter(item => item.classify.toLowerCase().includes(value.toLowerCase())))
    }
    // tìm kiếm theo tên
    const filterInput = async (e) => {
        setStudentSearch(students.filter(item => item.name.toLowerCase().includes(e.toLowerCase())))
    }
    // xóa tìm kiếm
    const deleteFilter = () => {
        setStudentSearch([])
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
            title: 'Phân loại',
            dataIndex: 'classify',
            render: (classify) => classify == 0 ? 'Tự đăng ký' : 'Hỗ trợ',

        },
        {
            title: 'CV',
            dataIndex: 'link_cv',
            render: (link_cv, student) => student.classify == 1 ? <EyeOutlined className='icon-cv' onClick={() => window.open(link_cv)} /> : '',
        }

        ,
        {
            title: 'Người review',
            dataIndex: 'user_id',
            render: (user_id) =>users.map(item => user_id == item.id && item.email.slice(0, -11))
        }
        ,
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            render: (status, student) => {
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
          dataIndex: 'key',
          render: (key) =><Link to={`/thay-doi-trang-thai/id=${key}`}><EditOutlined /></Link> ,
        }
    ];

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



    const rowSelection = {
        onChange: (selectedRows) => {
            setChooseIdStudent(selectedRows)
        },
    };
    const chooseStudent = () => {
        const user = JSON.parse(localStorage.getItem('user'))
        const newStudents = []
        students.filter(item => {
            chooseIdStudent.map(id => {
                id == item.id && newStudents.push(item)
            })
        })
        newStudents.map(item => {
            StudentAPI.upload(item.id, { ...item, "user_id": `${user.id}` })
        })
        alert("Thêm thành công ")
        navigate("/quan-ly/review-cv");
    }


    return (
        <div className='status'>
            <h4>Sinh viên đăng ký thực tập</h4>

            <div className="filter">
                <Select style={{ width: 200 }} onChange={filterMajors} placeholder="Lọc theo ngành">
                    <Option value="QTDN">Quản trị doanh nghiệp</Option>
                    <Option value="TKĐH">Thiết kế đồ họa</Option>
                    <Option value="UDPM">Ứng dụng phần mềm</Option>
                    <Option value="TMĐT">Thương mại điện tử</Option>
                    <Option value="LTMT">Lập trình máy trính</Option>
                    <Option value="TKTW">Thiết kế Website</Option>
                    <Option value="QHCC">Quan hệ công chúng</Option>
                </Select>
                <Select className='filter-status' style={{ width: 200 }} onChange={filterStatus} placeholder="Lọc theo trạng thái">
                    <Option value="0">Đã tạch</Option>
                    <Option value="1">Sửa lại</Option>
                    <Option value="2">Chờ kiểm tra</Option>
                    <Option value="3">Đã kiểm tra</Option>
                </Select>
                <Select className='filter-status' style={{ width: 200 }} onChange={filterClassify} placeholder="Lọc theo phân loại">
                    <Option value="0">Tự tìm</Option>
                    <Option value="1">Nhờ nhà trường</Option>
                </Select>
                <Input style={{ width: 200 }} placeholder="Tìm kiếm theo tên" onChange={(e) => filterInput(e.target.value)} />
                {studentSearch.length > 0 && <button onClick={() => deleteFilter()}>Xóa lọc</button>}
                {chooseIdStudent.length > 0 && <button onClick={() => chooseStudent()}>Xác nhận</button>}
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

export default Status