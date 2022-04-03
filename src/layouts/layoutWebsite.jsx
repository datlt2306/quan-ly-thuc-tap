import React, { useState } from 'react';
import { Layout, Menu} from 'antd';
import {
  UploadOutlined,
  PieChartOutlined
} from '@ant-design/icons';
import { Link, Outlet } from 'react-router-dom';
import GlobalHeader from '../components/GlobalHeader.js/index.js';
import './layoutAdmin.css';
import { Content } from 'antd/lib/layout/layout';
import SubMenu from 'antd/lib/menu/SubMenu';
const { Sider } = Layout;
function LayoutWebsite() {
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
         
            <Menu.Item key="6" icon={<UploadOutlined className="icon-link" />}>
              <Link to="up-file">Trạng thái đăng ký</Link>
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

LayoutWebsite.propTypes = {};

export default LayoutWebsite;
