import React, { Children, useEffect, useState } from 'react';
import { Layout, Menu, Breadcrumb, Row,Col, Button } from 'antd';
import "../common/styles/layout.css"
import {
  ProfileOutlined,
  PieChartOutlined,
  UploadOutlined,
  TeamOutlined,
  LoginOutlined,
  FolderViewOutlined,
  ReadOutlined
} from '@ant-design/icons';
import 'antd/dist/antd.css'
import { NavLink, Outlet } from 'react-router-dom';
import { $ } from '../ultis';

const { Sider } = Layout;
function LayoutWebsite() {
  const [state, setState] = useState(false);
  // const [userLocatlStorage, setUserLocatlStorage] = useState({});

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify({ id: 1, name: "Trần Văn Đoàn", email: "doantvph11605@fpt.edu.vn", avatar: "https://media.tadicdn.com/media/image/s/tdtp/id/610cee400df9386a46462317.jpeg_640x", role: 0 }))
    // setUserLocatlStorage(JSON.parse(localStorage.getItem('user')))
  }, [])

  const onCollapse = () => {
    if (state == false) {
      $(".logo").style.display = "none"
      setState(true)
    } else {
      $(".logo").style.display = "block"
      setState(false)
    }
  };

  return (
    <div>

      <Layout style={{ minHeight: '100vh' }} >
        <Sider collapsible collapsed={state} onCollapse={() => onCollapse()} className="menu">
          <div className="logo-school">
            <div className="logo">
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/20/FPT_Polytechnic.png" alt="" style={{maxWidth: '100%'}}/>
            </div>
          </div>

          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
            <Menu.Item key="1" icon={<PieChartOutlined className='icon-link'/>}>
              <NavLink to=''>Đăng ký thực tập</NavLink>
            </Menu.Item>
            <Menu.Item key="2" icon={<ProfileOutlined className='icon-link'/>}>
              <NavLink to='sinh-vien/danh-sach-dang-ky'>Danh sách đăng ký</NavLink>
            </Menu.Item>
            <Menu.Item key="3" icon={<TeamOutlined className='icon-link'/>}>
              <NavLink to='up-file'>Nhân viên</NavLink>
            </Menu.Item>
            <Menu.Item key="4" icon={<FolderViewOutlined className='icon-link'/>}>
              <NavLink to='review-cv'>Review CV</NavLink>
            </Menu.Item>
            <Menu.Item key="5" icon={<ReadOutlined className='icon-link'/>}>
              <NavLink to='review-cv'>Review báo cáo</NavLink>
            </Menu.Item>
            <Menu.Item key="6" icon={<UploadOutlined className='icon-link'/>}>
              <NavLink to='up-file'>Up File</NavLink>
            </Menu.Item>
            <Menu.Item key="8" icon={<LoginOutlined className='icon-link'/>}>
              <a >Đăng xuất</a>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <div className="header-layout">
              <div className="name">Xin chào : tranvandoan</div>
          </div>
          <div className="site-layout-background" >
            <Outlet />
          </div>
        </Layout>
      </Layout>
    </div>
  );
}

LayoutWebsite.propTypes = {};

export default LayoutWebsite;
