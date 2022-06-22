import { UploadOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as XLSX from 'xlsx';
import { insertBusiness } from '../../features/businessSlice/businessSlice';
import { insertStudent } from '../../features/StudentSlice/StudentSlice';
const UpFile = ({  keys, parentMethods}) => {
  const {major, smester_id, campus_id} = parentMethods
  const [dataNew, setDataNew] = useState([]);
  const [nameFile, setNameFile] = useState('');
  const dispatch = useDispatch();
  const {
    infoUser: { manager },
  } = useSelector((state) => state.auth);
  const { loading } = useSelector((state) => state.students);
  const importData = (e) => {
    if (major.length > 0) {
      const file = e.target.files[0];
      setNameFile(file.name);
      const reader = new FileReader();
      const rABS = !!reader.readAsBinaryString;
      reader.onload = (event) => {
        const bstr = event.target.result;
        const wb = XLSX.read(bstr, { type: rABS ? 'binary' : 'array' });
        /* Get first worksheet */
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        /* Convert array of arrays */
        const fileData = XLSX.utils.sheet_to_json(ws, { header: 1 });
        let headers = fileData[0];
        fileData.splice(0, 1);
        if (headers.length === 0) {
          headers = fileData[0];
        }
        const rows = [];

        fileData.forEach((item) => {
          let rowData = {};
          item.forEach((element, index) => {
            rowData[headers[index]] = element;
          });
          rows.push(rowData);
        });
        let datas = [];
        rows
          .filter((item, index) => Object.keys(item).length > 0 && index > 0 )
          // eslint-disable-next-line array-callback-return
          .map((item) => {
            const newObject = {};
            if (manager) {
              switch (keys) {

                case 'status':
                  if (item['MSSV'] !== undefined) {
                    newObject['mssv'] = item['MSSV'];
                    newObject['name'] = item['Họ tên'];
                    newObject['course'] = item['Khóa nhập học'];
                    newObject['status'] = item['Trạng thái'];
                    newObject['majors'] = major
                    newObject['email'] = item['Email'];
                    newObject['supplement'] = item['bổ sung'];
                    newObject['campus_id'] = manager.campus_id;
                    newObject['smester_id'] = smester_id;
                    return datas.push(newObject);
                  }
                  break;
                case 'business':
                  if (item['Tên Doanh nghiệp'] !== undefined) {
                    newObject['name'] = item['Tên Doanh nghiệp'];
                    newObject['internshipPosition'] = item['Vị trí tuyển dụng'];
                    newObject['amount'] = item['Số lượng'];
                    newObject['address'] = item['Địa chỉ doanh nghiệp'];
                    newObject['majors'] = major
                    newObject["description"] = item['Mô tả']
                    newObject["request"] = item['Yêu cầu ứng viên']
                    newObject["code_request"] = item["Mã ứng tuyển"]
                    newObject['campus_id'] = manager.campus_id;
                    newObject['smester_id'] = smester_id;
                    return datas.push(newObject);
                  }
                  break;
                default:
                  break;
              }
            }
          });
        setDataNew(datas);
        refInput.current.value = '';
      };
  
      reader.readAsBinaryString(file);
    }else{
      message.warning("Vui lòng chọn ngành")
    }

  };
  const submitSave = () => {
    const dataUpload = { data: dataNew, smester_id, majors: major, campus_id };
    switch (keys) {
      case 'status':
        if (major.length > 0) {
          dispatch(insertStudent(dataUpload)).then((res) => {
            notifications(res.payload);
            setDataNew([]);
            setNameFile();
          });
        }
       
        break;
      case 'business':
        dispatch(insertBusiness(dataNew)).then((res) => {
          notifications(res.payload);
          setDataNew([]);
          setNameFile();
        });
        break;
      default:
        break;
    }
  };
  const notifications = (payload) => {
  
    if (loading === false && payload !== undefined) {
      message.success('Thành công');
    }
  };
  const submitCole = () => {
    setDataNew([]);
    setNameFile();
    refInput.current.value = '';
  };

  const refInput = useRef();

  return (
    <div className="header">
      <label htmlFor="up-file">
        <div className="button-upfile">
          <UploadOutlined className="icon" /> Tải file excel
        </div>
        {nameFile && dataNew.length > 0 && <span className="span-upload-name">{nameFile}</span>}
      </label>
      <input type="file" ref={refInput} onChange={(e) => importData(e)} id="up-file" />
      {dataNew.length > 0 && (
        <div className="button">
          <Button style={{ marginRight: 10 }} onClick={() => submitSave()} type="primary">
            Lưu
          </Button>
          <Button onClick={() => submitCole()} type="danger">
            Huỷ
          </Button>
        </div>
      )}
    </div>
  );
};

export default UpFile;
