import { Menu, Layout, Button } from "antd";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Slidebar.module.css";

const { Sider } = Layout;

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate()

  const onCollapse = (value) => {
    setCollapsed(value);
  };

  const handleLogout = () =>{
    if(localStorage.getItem('token')){
      localStorage.removeItem('token')
      navigate('/')
    }
  }
  
  return (
    <>
      <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
        <div>
          <img
            className={styles.logo}
            src="https://career.fpt.edu.vn/Content/images/logo_unit/Poly.png"
          />
        </div>
        <Menu theme="dark">
          <Menu.Item>
            <Link className={styles.linkNavbar} to={"/home"}>
              Trang chủ
            </Link>
          </Menu.Item>
          <Menu.Item>
            <Link className={styles.linkNavbar} to={"/support-student"}>
              Sinh viên nhờ hỗ trợ thực tập
            </Link>
          </Menu.Item>
          <Menu.Item>
            <Link className={styles.linkNavbar} to={"/proactive-student"}>
              Sinh viên tự tìm nơi thực tập
            </Link>
          </Menu.Item>
          <Menu.Item>
            <Link className={styles.linkNavbar} to={"/dashboard"}>
              Quản lý sinh viên thực tập
            </Link>
          </Menu.Item>
          <Menu.Item>
              <Button onClick={handleLogout}>Đăng xuất</Button>
          </Menu.Item>
        </Menu>
      </Sider>
    </>
  );
};

export default Sidebar;
