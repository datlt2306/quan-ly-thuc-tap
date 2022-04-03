import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import {
  Form,
  Input,
  Select,
  Button,
  Upload,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getListSpecialization } from '../../features/specializationSlice/specializationSlice';
import styles from './SupportStudent.module.css'
const { Option } = Select;
const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};
const SupportStudent = () => {
  const dispatch = useDispatch()
  const [linkCV, setLinkCV] = useState()
  const [form] = Form.useForm();
  const {listSpecialization} = useSelector( state => state.specialization)

  const normFile = (e) => {
    //xử lí ảnh firebase or google drive
  };
  const onFinish = (values) => {
    console.log('Received values of form: ', values);
    const data = {
      ...values,
      cv: linkCV
      ///dispatch Redux
    }
  };

  useEffect(()=>{
    dispatch(getListSpecialization())
  },[])

  return (
    <>
      <Form
        {...formItemLayout}
        form={form}
        name="register"
        className={styles.form}
        onFinish={onFinish}
        initialValues={{
          residence: ['zhejiang', 'hangzhou', 'xihu'],
          prefix: '86',
        }}
        scrollToFirstError
      >
        <Form.Item
          name="email"
          label="Email FPT Polytechnic"
          rules={[
            {
              type: 'email',
              message: 'Email không đúng định dạng'
            },
            {
              required: true,
              message: 'Vui lòng nhập Email',
            },
          ]}
        >
          <Input
            placeholder='Email'
           
          />
        </Form.Item>
        <Form.Item
          name="user_code"
          label="Mã sinh viên"
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập mã sinh viên',
            },
          ]}
        >
          <Input
            placeholder='Mã sinh viên'

          />
        </Form.Item>

        <Form.Item
          name="name"
          label="Họ và Tên"
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập tên',
              whitespace: true,
            },
          ]}
        >
          <Input
            placeholder='Họ và tên'

          />
        </Form.Item>
        <Form.Item
          name="phone"
          label="Số điện thoại"
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập số điện thoại',
            },
          ]}
        >
          <Input
            placeholder='Số điện thoại'
          />
        </Form.Item>

        <Form.Item
          name="address"
          label="Địa chỉ"
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập địa chỉ',
            },
          ]}
        >
          <Input
            placeholder='Địa chỉ'
            
          />
        </Form.Item>
        <Form.Item
          name="majors"
          label="Ngành học"
          rules={[
            {
              required: true,
              message: 'Vui lòng chọn ngành học',
            },
          ]
        }
        >
          <Select style={{
             width: '50%',
             marginLeft: '20px'
          }} placeholder="Chọn ngành học">
            {
              listSpecialization.map((item, index) => (
                <Option value={item._id} key={index} >{item.name}</Option>
              ))
            }
          </Select>
        </Form.Item>

        <Form.Item
          name="unit"
          label="Đơn vị thực tập"
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập đơn vị thực tập',
            },
          ]}
        >
          <Input
            placeholder='Đơn vị thực tập/Tên doanh nghiệp'
            
          />
        </Form.Item>
        <Form.Item
          name="unitAddress"
          label="Địa chỉ thực tập"
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập địa chỉ thực tập',
            },
          ]}
        >
          <Input
            placeholder='Đơn vị thực tập/Tên doanh nghiệp'
            
          />
        </Form.Item>
        <Form.Item
          name="taxCode"
          label="Mã số thuế"
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập Mã số thuế',
            },
          ]}
        >
          <Input
            placeholder='Mã số thuế'
            
          />
        </Form.Item>
            
        <Form.Item
          name="position"
          label="Chức vụ người tiếp nhận"
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập chức vụ người tiếp nhận sinh viên',
            },
          ]}
        >
          <Input
            placeholder='Chức vụ người tiếp nhận'
            
          />
        </Form.Item>
            
     
        <Form.Item
          name="numberEnterprise"
          label="Số điện thoại doanh nghiệp"
          rules={[
            {required: true,
              message: 'Vui lòng nhập Số điện thoại doanh nghiệp',
            },
          ]}
        >
          <Input
            placeholder='Số điện thoại doanh nghiệp(VD:Giám đốc, Leader, Hr)'
            
          />
        </Form.Item>
            
          
        <Form.Item
          name="emailEnterprise"
          label="Email người tiếp nhận"
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập Email người tiếp nhận',
            },
          ]}
        >
          <Input
            placeholder='Email người tiếp nhận'
            
          />
        </Form.Item>
            

        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
            Đăng ký
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}

export default SupportStudent
