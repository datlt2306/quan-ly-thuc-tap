import React, { useState } from "react";
import { Layout, Menu } from "antd";
import {
  ProfileOutlined,
  UserOutlined,
  FolderViewOutlined,
  UnorderedListOutlined,
  BankOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { NavLink, Outlet } from "react-router-dom";
import GlobalHeader from "../components/GlobalHeader.js";
import { Content } from "antd/lib/layout/layout";
import { useSelector } from "react-redux";
import "./layout.css";
import SubMenu from "antd/lib/menu/SubMenu";
const { Sider } = Layout;
function LayoutWebsite() {
  const [state, setState] = useState(false);
  const {
    infoUser: { isAdmin },
  } = useSelector((state) => state.auth);
  const onCollapse = () => {
    setState(!state);
  };

  return (
    <div>
      <Layout style={{ minHeight: "100vh" }}>
        {
          window.innerWidth >1024 ?
          <Sider collapsible collapsed={state} className="layout-sider" onCollapse={() => onCollapse()}>
          <div className="logo-school">
            <div className="logo">
              <img
                style={
                  state
                    ? { width: "35%", height: "35%" , marginTop:"40px" }
                    : { width: "100%", height: "100%" }
                }
                src="https://upload.wikimedia.org/wikipedia/commons/2/20/FPT_Polytechnic.png"
                alt=""
              />
            </div>
          </div>

          <Menu theme="light" defaultSelectedKeys={["1"]} mode="inline">
            {isAdmin ? (
              <>
                <Menu.Item
                  key="4"
                  icon={<ProfileOutlined className="icon-link" />}
                >
                  <NavLink to="/">Danh sách đăng ký</NavLink>
                </Menu.Item>
                <Menu.Item
                  key="111"
                  icon={<BankOutlined />}
                >
                  <NavLink to="company"
                
                  >Danh sách Công Ty</NavLink>
                </Menu.Item>
                <SubMenu
                  key="sub1"
                  icon={<UnorderedListOutlined />}
                  title="Reviews"
                >
                  <Menu.Item key="9">
                    <NavLink to="review-cv"> CV</NavLink>
                  </Menu.Item>
                  <Menu.Item key="10">
                    <NavLink to="review-form">Biên bản</NavLink>
                  </Menu.Item>
                  <Menu.Item key="12">
                    <NavLink to="review-report">Báo cáo</NavLink>
                  </Menu.Item>
                </SubMenu>
                <Menu.Item
                  key="125"
                  icon={<CalendarOutlined className="icon-link" />}
                >
                  <NavLink to="semesters">Tạo kỳ học</NavLink>
                </Menu.Item>
                <Menu.Item
                  key="11"
                  icon={<FolderViewOutlined className="icon-link" />}
                >
                  <NavLink to="form-register">Thời gian đăng ký</NavLink>
                </Menu.Item>
                <Menu.Item
                  key="123"
                  icon={<ProfileOutlined className="icon-link" />}
                >
                  <NavLink to="major">Danh sách ngành học</NavLink>
                </Menu.Item>
                <Menu.Item
                  key="124"
                  icon={<ProfileOutlined className="icon-link" />}
                >
                  <NavLink to="/employee-manager">Danh sách nhân viên</NavLink>
                </Menu.Item>
                <Menu.Item
                  key="125s"
                  icon={<ProfileOutlined className="icon-link" />}
                >
                  <NavLink to="/campus-manager">Danh sách cơ sở</NavLink>
                </Menu.Item>
              </>
            ) : (
              <>
                <Menu.Item
                  key="1"
                  icon={<UserOutlined className="icon-link" />}
                >
                  <NavLink to="info-student">Thông tin sinh viên</NavLink>
                </Menu.Item>

                <Menu.Item key="3">
                  <NavLink to="/support-student">Đăng ký thực tập</NavLink>
                </Menu.Item>
                <Menu.Item key="5">
                  <NavLink to="report">Biên bản</NavLink>
                </Menu.Item>
                <Menu.Item key="4">
                  <NavLink to="/report-form">Báo cáo</NavLink>
                </Menu.Item>
              </>
            )}
          </Menu>
        </Sider>
        :""
        }
       
        <Layout className="site-layout">
          <GlobalHeader onCollapse={onCollapse} state={state} />
          <Content style={{ margin: "10px 10px", background: "white" }}>
            <div style={{ padding: 15, minHeight: 360 }}>
              <Outlet />
            </div>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
}

LayoutWebsite.propTypes = {};

export default LayoutWebsite;
