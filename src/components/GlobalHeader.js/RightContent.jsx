import {
  LogoutOutlined,
  SettingOutlined,
  MenuOutlined,
  ProfileOutlined,
  UserOutlined,
  FolderViewOutlined,
  UnorderedListOutlined,
  CalendarOutlined,
  UsergroupAddOutlined,
  InsertRowAboveOutlined,
} from "@ant-design/icons";
import { Menu, Dropdown, Button, Avatar, Drawer } from "antd";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import "./index.css";
import { Link, NavLink } from "react-router-dom";
import { logout } from "../../features/authSlice";
import SubMenu from "antd/lib/menu/SubMenu";

const Rightcontent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    infoUser: { isAdmin },
  } = useSelector((state) => state.auth);
  const { infoUser } = useSelector((state) => state.auth);
  
  const handleLogout = () => {
    dispatch(logout(() =>  navigate("/login")));
  };

  const [visible, setVisible] = useState(false);

  const showMenuMobile = () => {
    setVisible(true);
  };

  const onCloseMenuMobile = () => {
    setVisible(false);
  };

  const offMenuMoble = () => {
    setVisible(false);
  };

  const menu = (
    <Menu>
      <Menu.Item key="userInfo">
        <Button type="text" icon={<SettingOutlined />}>
          <Link to={'/profile'} style={{textDecoration:'none',color:'black',paddingLeft:7}}>Tài khoản</Link>
        </Button>
      </Menu.Item>
      <Menu.Item>
        <Button icon={<LogoutOutlined />} type="text" onClick={handleLogout}>
          Đăng xuất
        </Button>
      </Menu.Item>
    </Menu>
  );
  return (
    <>
      {window.innerWidth > 1024 && (
        <div
          className="view-account"
          style={{
            marginLeft: "auto",
            paddingRight: "25px",
            marginTop: "20px",
          }}
        >
          <Dropdown overlay={menu} placement="bottomLeft" arrow>
            <div style={{ cursor: "pointer" }}>
              <Avatar size={35} src={infoUser?.picture} />
              <span style={{ paddingLeft: 10 }}>
                {infoUser?.name?.length > 20
                  ? infoUser?.name?.slice(0, 20) + "..."
                  : infoUser?.name}
              </span>
            </div>
          </Dropdown>
        </div>
      )}

      {window.innerWidth <= 1024 ? (
        <div className="mobile">
          <MenuOutlined className="icon-menu-mb" onClick={showMenuMobile} />
          <Drawer
            width={250}
            placement="right"
            onClose={onCloseMenuMobile}
            visible={visible}
          >
            <div className="info-user">
              <Avatar size={35} src={infoUser.picture} />{" "}
              <span>{infoUser.name}</span>
            </div>

            <Menu theme="light" defaultSelectedKeys={["1"]} mode="inline">
              {isAdmin ? (
                <>
                  {infoUser?.manager?.role === 1 ? (
                    <>
                    <Menu.Item
                      key="4"
                      icon={<ProfileOutlined className="icon-link" />}
                    >
                      <NavLink onClick={offMenuMoble} to="">
                        Danh sách đăng ký
                      </NavLink>
                    </Menu.Item>
                    <Menu.Item
                      key="4"
                      icon={<ProfileOutlined className="icon-link" />}
                    >
                      <NavLink onClick={offMenuMoble} to="company">
                        Danh sách công ty
                      </NavLink>
                    </Menu.Item>
                    <SubMenu
                      key="sub1"
                      icon={<UnorderedListOutlined />}
                      title="Reviews"
                    >
                      <Menu.Item key="9">
                        <NavLink onClick={offMenuMoble} to="review-cv">
                          CV
                        </NavLink>
                      </Menu.Item>
                      <Menu.Item key="10">
                        <NavLink onClick={offMenuMoble} to="review-form">
                          Biên bản
                        </NavLink>
                      </Menu.Item>
                      <Menu.Item key="12">
                        <NavLink onClick={offMenuMoble} to="review-report">
                          Báo cáo
                        </NavLink>
                      </Menu.Item>
                    </SubMenu>
                    <SubMenu
                      key="sub2"
                      icon={<UnorderedListOutlined />}
                      title="Ngành học"
                    >
                      <Menu.Item key="123">
                        <NavLink to="major">Danh sách ngành học</NavLink>
                      </Menu.Item>
                      <Menu.Item key="109">
                        <NavLink to="narrows">Ngành hẹp</NavLink>
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
                      <NavLink onClick={offMenuMoble} to="form-register">
                        Thời gian đăng ký
                      </NavLink>
                    </Menu.Item>
                  </>
                  ) : (
                    <>
                    <Menu.Item key="124" icon={<UsergroupAddOutlined />}>
                        <NavLink to="/employee-manager">Danh sách nhân viên</NavLink>
                      </Menu.Item>
                      <Menu.Item key="125s" icon={<InsertRowAboveOutlined />}>
                        <NavLink to="/campus-manager">Danh sách cơ sở</NavLink>
                      </Menu.Item>
                      <SubMenu key="sub2" icon={<UnorderedListOutlined />} title="Ngành học">
                        <Menu.Item key="123">
                          <NavLink to="major">Danh sách ngành học</NavLink>
                        </Menu.Item>
                        <Menu.Item key="109">
                          <NavLink to="narrows">Ngành hẹp</NavLink>
                        </Menu.Item>
                      </SubMenu>
                    
                    </>
                  )
    }
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
              <Menu.Item
                key="7"
                icon={<LogoutOutlined className="icon-link" />}
              >
                <Button
                  style={{ padding: 0 }}
                  type="text"
                  onClick={handleLogout}
                >
                  Đăng xuất
                </Button>
              </Menu.Item>
            </Menu>
          </Drawer>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default Rightcontent;
