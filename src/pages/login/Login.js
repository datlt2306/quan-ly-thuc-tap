import React, { useEffect, useState } from "react";
import GoogleLogin from "react-google-login";
import styles from "./Login.module.css";
import { useDispatch, useSelector } from "react-redux";
import { loginGoogle } from "../../features/authSlice/authSlice";
import { Select, Empty, message } from "antd";
import { useNavigate } from "react-router";
import { getListCumpus } from "../../features/cumpusSlice/cumpusSlice";
import SemestersAPI from "../../API/SemestersAPI";
import { saveLocal } from "../../ultis/storage";
import { getSemesters } from "../../features/semesters/semestersSlice";
const { Option } = Select;

const Login = () => {
  const dispatch = useDispatch();
  const [cumpus, setCumpus] = useState("");
  const navigate = useNavigate();
  const { listCumpus } = useSelector((state) => state.cumpus);
  const handleFailure = (result) => {
    message.error("error")
  };

  const handleLogin = (googleData) => {
    SemestersAPI.getDefaultSemester().then((data) => {
      const dataForm = {
        token: googleData.tokenId,
        cumpusId: cumpus,
        smester_id: data.data._id,
      };
      dispatch(loginGoogle(dataForm))
        .then((res) => {
          saveLocal(res.payload);
          return res && redirect(res);
        })
        .catch((err) => err && message.error("Đăng nhập thất bại"));
    });
  };
  const redirect = ({ payload: { isAdmin } }) => {
    message.success("Đăng nhập thành công");
    return isAdmin ? navigate("/") : navigate("/info-student");
  };
  const handleChange = (value) => {
    setCumpus(value);
  };

  useEffect(() => {
    dispatch(getListCumpus());
    dispatch(getSemesters());
  }, [dispatch]);

  return (
    <div className={styles.login_wrapper}>
      <img
        alt="diep"
        className={styles.logo}
        src="https://career.fpt.edu.vn/Content/images/logo_unit/Poly.png"
      />

      <div>
        <Select
          className={styles.campus}
          defaultValue="Lựa chọn cơ sở"
          onChange={handleChange}
        >
          {listCumpus ? (
            listCumpus.map((item, index) => (
              <Option key={index} value={item._id}>
                {item.name}
              </Option>
            ))
          ) : (
            <Empty />
          )}
        </Select>
      </div>
      <div className={styles.button_login}>
        <GoogleLogin
          disabled={cumpus === "" ? true : false}
          className={styles.button_login}
          clientId="116205081385-umqm7s5qlspf4s0tc4jke7tafpvgj2k7.apps.googleusercontent.com"
          buttonText="Login With Google"
          onSuccess={handleLogin}
          onFailure={handleFailure}
        />
      </div>
    </div>
  );
};

export default Login;
