import React, { useState } from 'react';
import { Layout, Menu, BackTop } from 'antd';
import {
	ArrowUpOutlined,
	InsertRowAboveOutlined,
	PullRequestOutlined,
	UsergroupAddOutlined,
} from '@ant-design/icons';
import {
	ProfileOutlined,
	UserOutlined,
	FolderViewOutlined,
	UnorderedListOutlined,
	CalendarOutlined,
} from '@ant-design/icons';
import { NavLink, Outlet } from 'react-router-dom';
import GlobalHeader from '../components/GlobalHeader.js';
import { Content } from 'antd/lib/layout/layout';
import { useDispatch, useSelector } from 'react-redux';
import './layout.css';
import SubMenu from 'antd/lib/menu/SubMenu';
import Media from 'react-media';
import { connect } from 'react-redux';
import { updateIsMobile } from '../features/global.js';
import { path } from '../config/path.jsx';
import { roles } from '../ultis.js';
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
			<Layout style={{ minHeight: '100vh' }}>
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
											? { width: '35%', height: '35%', marginTop: '40px' }
											: { width: '100%', height: '100%' }
									}
									src="https://upload.wikimedia.org/wikipedia/commons/2/20/FPT_Polytechnic.png"
									alt=""
								/>
							</div>
						</div>

						<Menu theme="light" defaultSelectedKeys={['1']} mode="inline">
							{infoUser?.isAdmin ? (
								<>
									{infoUser?.manager?.role === roles.MANAGER ? (
										<>
											<Menu.Item
												key="4"
												icon={<ProfileOutlined className="icon-link" />}
											>
												<NavLink to={path.STATUS}>
													Danh sách đăng ký
												</NavLink>
											</Menu.Item>
											<Menu.Item key="111">
												<NavLink to={path.COMPANY}>
													Danh sách công ty
												</NavLink>
											</Menu.Item>
											<SubMenu
												key="sub1"
												icon={<UnorderedListOutlined />}
												title="Reviews"
											>
												<Menu.Item key="9">
													<NavLink to={path.REVIEW_CV}> CV</NavLink>
												</Menu.Item>
												<Menu.Item key="10">
													<NavLink to={path.REVIEW_FORM}>
														Biên bản
													</NavLink>
												</Menu.Item>
												<Menu.Item key="12">
													<NavLink to={path.REPORT_FORM}>Báo cáo</NavLink>
												</Menu.Item>
											</SubMenu>
											<Menu.Item
												key="125"
												icon={<CalendarOutlined className="icon-link" />}
											>
												<NavLink to={path.SEMESTERS}>Tạo kỳ học</NavLink>
											</Menu.Item>
											<Menu.Item
												key="11"
												icon={<FolderViewOutlined className="icon-link" />}
											>
												<NavLink to={path.FORM_REGISTER}>
													Thời gian đăng ký
												</NavLink>
											</Menu.Item>
											<Menu.Item key="12" icon={<PullRequestOutlined />}>
												<NavLink to={path.REQUEST_FORM_STUDENT}>
													Yêu cầu từ sinh viên
												</NavLink>
											</Menu.Item>
										</>
									) : (
										<>
											<Menu.Item key="124" icon={<UsergroupAddOutlined />}>
												<NavLink to={path.EMPLOYEE_MANAGER}>
													Danh sách nhân viên
												</NavLink>
											</Menu.Item>
											<Menu.Item key="125s" icon={<InsertRowAboveOutlined />}>
												<NavLink to={path.CAMPUS_MANAGER}>
													Danh sách cơ sở
												</NavLink>
											</Menu.Item>
											<SubMenu
												key="sub2"
												icon={<UnorderedListOutlined />}
												title="Ngành học"
											>
												<Menu.Item key="123">
													<NavLink to={path.MAJOR}>
														Danh sách ngành học
													</NavLink>
												</Menu.Item>
												<Menu.Item key="109">
													<NavLink to={path.NARROWS}>Ngành hẹp</NavLink>
												</Menu.Item>
											</SubMenu>
										</>
									)}
								</>
							) : (
								<>
									<Menu.Item
										key="1"
										icon={<UserOutlined className="icon-link" />}
									>
										<NavLink to={path.INFO_STUDENT}>
											Thông tin sinh viên
										</NavLink>
									</Menu.Item>
									<Menu.Item key="3">
										<NavLink to={path.SUPPORT_SUTDENT}>
											Đăng ký thực tập
										</NavLink>
									</Menu.Item>
									<Menu.Item key="5">
										<NavLink to={path.REPORT}>Biên bản</NavLink>
									</Menu.Item>
									<Menu.Item key="4">
										<NavLink to={path.REPORT_FORM}>Báo cáo</NavLink>
									</Menu.Item>
								</>
							)}
						</Menu>
					</Sider>
				) : (
					''
				)}

				<Layout className="site-layout">
					<GlobalHeader onCollapse={onCollapse} state={state} />
					<Content style={{ margin: '10px 10px', background: 'white' }}>
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
						lineHeight: '50px',
						borderRadius: '50%',
						backgroundColor: 'rgb(238, 77, 45)',
						textAlign: 'center',
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
