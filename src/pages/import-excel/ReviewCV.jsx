import React, { useState, useEffect } from 'react'
import StudentAPI from '../../API/StudentAPI';
import { EyeOutlined, FilePdfOutlined } from '@ant-design/icons'
import '../../common/styles/status.css'
import { notification, Select, Input, Checkbox, Table } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { getStudent } from '../../features/StudentSlice/StudentSlice';
import { filterBranch, filterStatuss } from '../../ultis/selectOption';
const { Option } = Select;
const ReviewCV = () => {
  const user = JSON.parse(localStorage.getItem('user'))
  const dispatch = useDispatch()
  const students = useSelector(data => data.students.value);
  

  const [chooseIdStudent, setChooseIdStudent] = useState([])


  useEffect(() => {
    dispatch(getStudent())
  }, [])

  // ấn chi tiết để xem được chi tiết trạng thái
  const openDetail = async (student, status) => {
    notification[status == 'warning' ? 'warning' : 'error']({
      message: 'Chi tiết',
      description:
        `${student.status_detail}`,
    })

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
        < Select defaultValue={ji()} className='filter-status' style={{ width: 200 }} onChange={handleFilter} >
          {status == 0 && <span className='status-fail' style={{ color: 'red' }}>Đã tạch <br /><button onClick={() => openDetail(student, 'error')}>Đã tạch</button></span>}

        </Select >
      }




      // {
      //     if (status == 0) {
      //         return <span className='status-fail' style={{ color: 'red' }}>Đã tạch <br /><button onClick={() => openDetail(student, 'error')}>Đã tạch</button></span>
      //     } else if (status == 1) {
      //         return <span className='status-up' style={{ color: 'red' }}>Sửa lại<br /><button>Sửa</button></span>
      //     }else if(status==2){
      //         return <span className='status-check' style={{ color: 'rgb(255, 106, 0)' }}>Chờ kiểm tra</span>
      //     }else if(status==3){
      //         return <span className='status-true' style={{ color: 'rgb(44, 194, 21)' }}>Đã kiểm tra</span>
      //     }
      // }
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
        StudentAPI.upload(item.id, { ...item, "user_id": '' })
    })
    alert("Xóa thành công")

  }
  const data = [];
  const handleFilter = (key, value) => {
    console.log(key, value);
    
  }

  return (
    <div className='status'>
      <h4>Sinh viên bạn chọn review CV</h4>

      <div className="filter">
        <Select style={{ width: 200 }} onChange={val => handleFilter('majors', val)} placeholder="Lọc theo ngành">
         {
           filterBranch.map((item, index)=> (
             <Option value={item.value} key={index} >{item.title}</Option>
           ) )
         }
        </Select>
        <Select className='filter-status' style={{ width: 200 }} onChange={val=> handleFilter('statusCheck', val)} placeholder="Lọc theo trạng thái">
          {filterStatuss.map((item, index)=>(
            <Option value={index} key={index} >{item.title}</Option>
          ))}
        </Select>
        {/* <Select className='filter-status' style={{ width: 200 }} onChange={filterClassify} placeholder="Lọc theo phân loại">
          <Option value="0">Tự tìm</Option>
          <Option value="1">Nhờ nhà trường</Option>
        </Select> */}
        <Input style={{ width: 200 }} placeholder="Tìm kiếm theo tên" onChange={val => handleFilter('name',val.target.value)} />
      
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