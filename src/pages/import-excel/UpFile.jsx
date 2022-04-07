import React, { useState } from "react";
import * as XLSX from "xlsx";
import { Table, Tag, Space,notification } from 'antd';
import { UploadOutlined } from "@ant-design/icons";
import "../../common/styles/upfile.css";
import { useDispatch, useSelector } from "react-redux";
import { insertStudent } from "../../features/StudentSlice/StudentSlice";
import { useNavigate } from "react-router-dom";
const UpFile = () => {
  const [data, setData] = useState();
  const [header, setHeader] = useState([]);
  const [dataNew, setDataNew] = useState([]);
  const [nameFile, setNameFile] = useState("");
  const dispatch = useDispatch();
  const { infoUser } = useSelector((state) => state.auth);
  const { loading } = useSelector((state) => state.students);
  const navigate = useNavigate();
  const importData = (e) => {
    const file = e.target.files[0];
    setNameFile(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const bstr = event.target.result;
      const wordBook = XLSX.read(bstr, { type: "binary" });
      const wordSheetName = wordBook.SheetNames[0];
      const wordSheet = wordBook.Sheets[wordSheetName];
      const fileData = XLSX.utils.sheet_to_json(wordSheet, { header: 1 });
      fileData.splice(0, 1);
      const headers = fileData[0];
      const heads = headers.map((head, index) => ({ title: head, key: index }));
      setHeader(heads);

      const rows = [];
      fileData.forEach((item) => {
        let rowData = {};
        item.forEach((element, index) => {
          rowData[headers[index]] = element;
        });
        rows.push(rowData);
      });
      const datas=[]
      rows.filter((item, index) => index !== 0).map((item) => {
        const newObject = {};
        if (infoUser.manager) {
          newObject["mssv"] = item["MSSV"];
          newObject["name"] = item["Họ tên"];
          newObject["course"] = item["Khóa nhập học"];
          newObject["status"] = item["Trạng thái FA21"];
          newObject["majors"] = item["Ngành FA21"];
          newObject["email"] = item["Email"];
          newObject["supplement"] = item["bổ sung"];
          newObject["campus_id"] = infoUser.manager.cumpus;
          datas.push(newObject);
        }
      });
      setDataNew(datas);
      setData(fileData);
    };
    reader.readAsBinaryString(file);
  };
  const submitSave = () => {
    dispatch(insertStudent(dataNew));
    notifications(loading);
  };
console.log(dataNew)
  const notifications = (loading) => {
    if (loading === false) {
      notification.success({
        message: "Thành công",
        style: {
          width: 250,
          height: 60,
          marginTop: 50,
          color: "#FFFFFF",
          background: "#4BB543",
        },
        duration: 1.5,
      });
      navigate("/status");
    }
  };
  const submitCole = () => {
    setData();
    setNameFile();
  };


  const columns = [

    {
      title: 'MSSV',
      dataIndex: 'mssv',
    },  {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Khóa nhập học',
      dataIndex: 'course',
    },
    {
      title: 'Trạng thái FA21',
      dataIndex: 'status',
    },
    {
      title: 'Ngành FA21',
      dataIndex: 'majors',
    },
    {
      title: 'Bổ sung',
      dataIndex: 'supplement',
    },
  ];

  return (
    <div className="up-file">
      <h3>Tải danh sách mới</h3>
      <div className="header">
        <label htmlFor="up-file">
          <div className="button-upfile">
            {" "}
            <UploadOutlined className="icon" /> Tải file excel
          </div>{" "}
          {nameFile && <span>{nameFile}</span>}
        </label>
        <input type="file" onChange={(e) => importData(e)} id="up-file" />
        {data && (
          <div className="button_save">
            <button onClick={() => submitSave()}>Lưu</button>
            <button onClick={() => submitCole()}>Hủy</button>
          </div>
        )}
      </div>
      {dataNew.length>=1 && <Table dataSource={dataNew} columns={columns} />}
      
    </div>
  );
};

export default UpFile;