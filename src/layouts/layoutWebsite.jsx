import React, { useState } from "react";
import { Layout, Menu, BackTop } from "antd";
import { ArrowUpOutlined } from "@ant-design/icons"
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
import { useDispatch, useSelector } from "react-redux";
import "./layout.css";
import SubMenu from "antd/lib/menu/SubMenu";
import Media from "react-media";
import { connect } from "react-redux";
import { updateIsMobile } from "../features/global.js";
const { Sider } = Layout;
function LayoutWebsite({ isMobile }) {
  const [state, setState] = useState(false);
  const { infoUser } = useSelector((state) => state.auth);
  const onCollapse = () => {
    setState(!state);
  };
  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(updateIsMobile({ isMobile }));
  }, [dispatch, isMobile]);

  return (
    <div>
      <Layout style={{ minHeight: "100vh" }}>
        {window.innerWidth > 1024 ? (
          <Sider
            collapsible
            collapsed={state}
            className="layout-sider"
            onCollapse={() => onCollapse()}
          >
            <div className="logo-school">
              <div className="logo">
                <img
                  style={
                    state
                      ? { width: "35%", height: "35%", marginTop: "40px" }
                      : { width: "100%", height: "100%" }
                  }
                  src="https://upload.wikimedia.org/wikipedia/commons/2/20/FPT_Polytechnic.png"
                  alt=""
                />
              </div>
            </div>

            <Menu theme="light" defaultSelectedKeys={["1"]} mode="inline">
              {infoUser?.isAdmin ? (
                <>
                  {infoUser?.manager?.role === 1 ? (
                    <>
                      <Menu.Item
                        key="4"
                        icon={<ProfileOutlined className="icon-link" />}
                      >
                        <NavLink to="/status">Danh s??ch ????ng k??</NavLink>
                      </Menu.Item>
                      <Menu.Item key="111" icon={<BankOutlined />}>
                        <NavLink to="company">Danh s??ch C??ng Ty</NavLink>
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
                          <NavLink to="review-form">Bi??n b???n</NavLink>
                        </Menu.Item>
                        <Menu.Item key="12">
                          <NavLink to="review-report">B??o c??o</NavLink>
                        </Menu.Item>
                      </SubMenu>
                      <SubMenu
                        key="sub2"
                        icon={<UnorderedListOutlined />}
                        title="Ng??nh h???c"
                      >
                        <Menu.Item key="123">
                          <NavLink to="major">Danh s??ch ng??nh h???c</NavLink>
                        </Menu.Item>
                        <Menu.Item key="109">
                          <NavLink to="narrows">Ng??nh h???p</NavLink>
                        </Menu.Item>
                      </SubMenu>
                      <Menu.Item
                        key="125"
                        icon={<CalendarOutlined className="icon-link" />}
                      >
                        <NavLink to="semesters">T???o k??? h???c</NavLink>
                      </Menu.Item>
                      <Menu.Item
                        key="11"
                        icon={<FolderViewOutlined className="icon-link" />}
                      >
                        <NavLink to="form-register">Th???i gian ????ng k??</NavLink>
                      </Menu.Item>
                    </>
                  ) : (
                    <>
                      <Menu.Item
                        key="124"
                        icon={<ProfileOutlined className="icon-link" />}
                      >
                        <NavLink to="/employee-manager">
                          Danh s??ch nh??n vi??n
                        </NavLink>
                      </Menu.Item>
                      <Menu.Item
                        key="125s"
                        icon={<ProfileOutlined className="icon-link" />}
                      >
                        <NavLink to="/campus-manager">Danh s??ch c?? s???</NavLink>
                      </Menu.Item>
                    </>
                  )}
                </>
              ) : (
                <>
                  <Menu.Item
                    key="1"
                    icon={<UserOutlined className="icon-link" />}
                  >
                    <NavLink to="info-student">Th??ng tin sinh vi??n</NavLink>
                  </Menu.Item>

                  <Menu.Item key="3">
                    <NavLink to="/support-student">????ng k?? th???c t???p</NavLink>
                  </Menu.Item>
                  <Menu.Item key="5">
                    <NavLink to="report">Bi??n b???n</NavLink>
                  </Menu.Item>
                  <Menu.Item key="4">
                    <NavLink to="/report-form">B??o c??o</NavLink>
                  </Menu.Item>
                </>
              )}
            </Menu>
          </Sider>
        ) : (
          ""
        )}

        <Layout className="site-layout">
          <GlobalHeader onCollapse={onCollapse} state={state} />
          <Content style={{ margin: "10px 10px", background: "white" }}>
            <div style={{ padding: 15, minHeight: 360 }}>
              <Outlet />
            </div>
          </Content>
        </Layout>
      </Layout>
      <BackTop>
        <div
          style={{
            height: 50,
            width: 50,
            lineHeight: "50px",
            borderRadius: '50%',
            backgroundColor: "rgb(238, 77, 45)",
            textAlign: "center",
            fontSize: 14,
          }}
        >
         <ArrowUpOutlined className="backTop" />
        </div>
      </BackTop>
    </div>
  );
}

LayoutWebsite.propTypes = {};
export default connect(({ global }) => ({
  global,
}))((props) => (
  <Media query="(max-width: 768px)">
    {(isMobile) => <LayoutWebsite {...props} isMobile={isMobile} />}
  </Media>
));
