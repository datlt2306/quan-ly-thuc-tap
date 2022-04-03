import React, { useState } from 'react';
import { Layout, Menu} from 'antd';
import {
  ProfileOutlined,
  UploadOutlined,
  TeamOutlined,
  LoginOutlined,
  FolderViewOutlined,
  ReadOutlined,
} from '@ant-design/icons';
import { Link, Outlet } from 'react-router-dom';
import GlobalHeader from '../components/GlobalHeader.js/index.js';
import './layoutAdmin.css';
import { Content } from 'antd/lib/layout/layout';
import SubMenu from 'antd/lib/menu/SubMenu';
const { Sider } = Layout;
function LayoutAdmin() {
  const [state, setState] = useState(false);

  const onCollapse = () => {
    setState(!state);
  };
console.log("admin")
  return (
    <div>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={state} onCollapse={() => onCollapse()}>
          <div className="logo-school">
            <div className="logo">
              <img
                style={state ? { width: '35%', height: '35%',margin:'40px 0 0 0' } : { width: '100%', height: '100%' }}
                src="https://upload.wikimedia.org/wikipedia/commons/2/20/FPT_Polytechnic.png"
                alt=""
              />
            </div>
          </div>

          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
            <SubMenu
              title="Đăng ký thực tập"
              key="0"
              icon={<PieChartOutlined className="icon-link" />}
              style={{color:'black'}}
            >
              <Menu.Item key="7">
                <Link to="/self-registration">Tự đăng ký</Link>
              </Menu.Item>
              <Menu.Item key="1">
                <Link to="/support-school">Nhà trường hỗ trợ</Link>
              </Menu.Item>
            </SubMenu>
            <Menu.Item key="2" icon={<ProfileOutlined className="icon-link" />}>
              <Link to="sinh-vien/danh-sach-dang-ky">Danh sách sinh viên</Link>
            </Menu.Item>
            <Menu.Item key="3" icon={<TeamOutlined className="icon-link" />}>
              <Link to="up-file">Nhân viên</Link>
            </Menu.Item>
            <Menu.Item key="4" icon={<FolderViewOutlined className="icon-link" />}>
              <Link to="xem-cv">Review CV</Link>
            </Menu.Item>
            <Menu.Item key="6" icon={<UploadOutlined className="icon-link" />}>
              <Link to="up-file">Up File</Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <GlobalHeader onCollapse={onCollapse} state={state} />
          <Content style={{ margin: '15px 15px', background: 'white' }}>
            <div style={{ padding: 24, minHeight: 360 }}>
              <Outlet />
            </div>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
}

LayoutAdmin.propTypes = {};

export default LayoutAdmin;
