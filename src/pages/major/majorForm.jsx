import { Col, Form, Input, Row, Button, Select} from 'antd';
import { Option } from 'antd/lib/mentions';
import React from 'react';

const FormMajor = ({ 
  onFinish, 
  editStatusButton, 
  text, 
  forms, 
  type, 
  listMajors,
  dataEdit,
  setChange
}) => {
  const [data, setData] = React.useState({});

  const onFinishForm = (values) => {
    switch (type) {
      case 'majors':
        if (text.toLowerCase() === 'sửa ngành') {
          onFinish({
            ...values,
          });
        } else {
          onFinish(values);
        }
        break;
      case 'specializing':
        onFinish({
          ...values,
          id_majors: data,
        });
        setData({})
        break;
      default:
        break;
    }
  };

  const sethButton = (values) => {
    editStatusButton(values);
  };

  return (
    <>
      <Form form={forms} onFinish={onFinishForm}>
        <Row>
          <Col xs={24} sm={4} md={12} lg={8} xl={8} style={{ padding: '0 10px' }}>
            {type === 'majors' ? (
              <Form.Item
                name="name"
                label="Tên ngành học"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập tên ngành học!',
                  },
                ]}
                initialValue={Object.keys(dataEdit).length > 0 ? dataEdit.name : null}
              >
                <Input />
              </Form.Item>
            ) : (
              <div
                style={{
                  display: 'flex',
                }}
              >
                <span
                  style={{
                    marginTop: '5px',
                  }}
                >
                  Chọn ngành:
                </span>
                <Select
                  onChange={(val) => setData(val)}
                  style={{
                    width: '60%',
                    marginLeft: '10px',
                  }}
                  placeholder="Chọn ngành học"
                >
                  {listMajors.map((item, key) => (
                    <Option key={key} value={item._id}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              </div>
            )}
          </Col>
          <Col xs={24} sm={4} md={12} lg={8} xl={8} style={{ padding: '0 10px' }}>
            <Form.Item
              name={type === 'majors' ? 'majorCode' : 'name'}
              label={type === 'majors' ? 'Mã ngành học' : 'Tên ngành hẹp'}
              rules={[
                {
                  required: true,
                  message:
                    type === 'majors'
                      ? 'Vui lòng nhập mã ngành học!'
                      : 'Vui lòng nhập tên ngành hẹp',
                },
              ]}
              initialValue={Object.keys(dataEdit).length > 0 ? dataEdit.majorCode : null}
              >
              <Input />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item style={{ marginLeft: '20px' }}>
              <Button type="primary" htmlType="submit">
                {text}
              </Button>
              <Button
                style={{ marginLeft: '10px' }}
                type="danger"
                onClick={() => {
                  sethButton(false)
                  setChange()
                }}
              >
                Huỷ
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default FormMajor;
