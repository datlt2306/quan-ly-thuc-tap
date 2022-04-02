import React, { useEffect, useState } from "react";
import GoogleLogin from "react-google-login";
import styles from "./Login.module.css";
import { useDispatch, useSelector } from "react-redux";
import { loginGoogle } from "../../../features/slice/authSlice";
import { Select, Empty } from "antd";
import { useNavigate } from "react-router";

const { Option } = Select;
const dataCumpus = [
  "FPT Polytechnic Hà Nội",
  "FPT Polytechnic Đà Nẵng",
  "FPT Polytechnic Hồ Chí Minh",
  "FPT Polytechnic Tây Nguyên",
  "FPT Polytechnic Cần Thơ",
  "FPT Polytechnic HiTech",
  "FPT PTCD Hà Nội",
  "FPT PTCD Hồ Chí Minh",
  "FPT PTCD Đà Nẵng",
  "FPT PTCD Cần Thơ",
  "FPT PTCD Tây Nguyên",
  "FPT PTCD Hải Phòng",
  "FPT PTCD Huế",
  "FPT PTCD Đồng Nai",
  "FPT PTCD Bắc Giang",
]

const Login = () => {
  const dispatch = useDispatch();
  const [cumpus,setCumpus] = useState("")
  const navigate = useNavigate()
  const data = useSelector((state) => state.auth)
  console.log(data)

  const handleFailure = (result) => {
    alert(result);
  };

  const handleLogin = (googleData) => {
    dispatch(loginGoogle({ token: googleData.tokenId,cumpus:cumpus }));
  };

  const handleChange = (value) => {
    setCumpus(value)
  };

  useEffect(()=>{
    if(localStorage.getItem('token')){
      navigate('/home')
    }
  },[])
  
  return (
    <div className={styles.login_wrapper}>
      <img
        className={styles.logo}
        src="https://career.fpt.edu.vn/Content/images/logo_unit/Poly.png"
      />
      <div>
        <Select
          className={styles.campus}
          defaultValue="Lựa chọn cơ sở"
          onChange={handleChange}
        >
          {dataCumpus ? dataCumpus.map( (item,index) => (
            <Option key={index} value={item}>{item}</Option>
          )) : <Empty />}
        </Select>
      </div>
      <div className={styles.button_login}>
        <GoogleLogin
          className={styles.button_login}
          clientId="116205081385-umqm7s5qlspf4s0tc4jke7tafpvgj2k7.apps.googleusercontent.com"
          buttonText="Login With Google"
          onSuccess={handleLogin}
          onFailure={handleFailure}
        ></GoogleLogin>
      </div>
    </div>
  );
};

export default Login;
