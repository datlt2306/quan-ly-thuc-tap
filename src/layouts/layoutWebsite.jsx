import React, { useState } from "react";
import { Layout, Menu, Breadcrumb, Row, Col, Button } from "antd";
import {
  ProfileOutlined,
  UserOutlined,
  PieChartOutlined,
  UploadOutlined,
  TeamOutlined,
  LoginOutlined,
  FolderViewOutlined,
  ReadOutlined,
} from "@ant-design/icons";
import { NavLink, Outlet } from "react-router-dom";
import { $ } from "../ultis";
import GlobalHeader from "../components/GlobalHeader.js";
import styles from "./layout.css";
import { Content } from "antd/lib/layout/layout";
import SubMenu from "antd/lib/menu/SubMenu";
const { Sider } = Layout;
function LayoutWebsite() {
  const [state, setState] = useState(false);

  const onCollapse = () => {
    setState(!state);
  };

  return (
    <div>
      <Layout style={{ minHeight: "100vh" }}>
        <Sider collapsible collapsed={state} onCollapse={() => onCollapse()}>
          <div className="logo-school">
            <div className="logo">
              <img
                style={
                  state
                    ? { width: "35%", height: "35%", margin:"40px 0 0 0" }
                    : { width: "100%", height: "100%" }
                }
                src="https://upload.wikimedia.org/wikipedia/commons/2/20/FPT_Polytechnic.png"
                alt=""
              />
            </div>
          </div>

          <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline">
            <Menu.Item key="1" icon={<UserOutlined className="icon-link" />}>
              <NavLink to="info-student">Trạng thái đăng ký</NavLink>
            </Menu.Item>
            <SubMenu
              title="Đăng ký thực tập"
              key="0"
              icon={<PieChartOutlined className="icon-link" />}
              style={{ color: "black" }}
            >
              <Menu.Item key="2">
                <NavLink to="/proactive-student">Tự đăng ký</NavLink>
              </Menu.Item>
              <Menu.Item key="3">
                <NavLink to="/support-student">Nhà trường hỗ trợ</NavLink>
              </Menu.Item>
            </SubMenu>
            <Menu.Item key="4" icon={<ProfileOutlined className="icon-link" />}>
              <NavLink to="sinh-vien/danh-sach-dang-ky">Danh sách sinh viên</NavLink>
            </Menu.Item>
            <Menu.Item
              key="5"
              icon={<FolderViewOutlined className="icon-link" />}
            >
              <NavLink to="review-cv">Review CV</NavLink>
            </Menu.Item>
            <Menu.Item key="6" icon={<UploadOutlined className="icon-link" />}>
              <NavLink to="up-file">Up File</NavLink>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <GlobalHeader onCollapse={onCollapse} state={state} />
          <Content style={{ margin: "15px 15px", background: "white" }}>
            {/* <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>User</Breadcrumb.Item>
              <Breadcrumb.Item>Bill</Breadcrumb.Item>
            </Breadcrumb> */}
            <div style={{ padding: 24, minHeight: 360 }}>
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
