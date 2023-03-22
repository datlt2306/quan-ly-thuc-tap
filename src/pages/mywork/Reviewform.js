import React, { useState, useEffect, useRef } from 'react';
import { EyeOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import styles from './mywork.module.css';
import { Select, Input, Table, Button, message, Row, Col } from 'antd';
import { useDispatch, connect } from 'react-redux';
import {
	exportFormData,
	listStudentForm,
	updateReviewerListStudent,
	updateStatusListStudent,
} from '../../features/reviewerStudent/reviewerSlice';
import { filterStatusForm } from '../../utils/selectOption';
import { omit } from 'lodash';
import { statusConfigForm } from '../../utils/constConfig';
import TextArea from 'antd/lib/input/TextArea';
import { bool, object } from 'prop-types';
import StudentDetail from '../../components/studentDetail/StudentDetail';
import { getListMajor } from '../../features/majorSlice/majorSlice';
import { defaultTime } from '../../features/semesters/semestersSlice';
import { timestamps } from '../../utils/timestamps';
import moment from 'moment';
const { Column } = Table;
const { Option } = Select;
const Reviewform = ({
	infoUser,
	listStudentAssReviewer: { total, list },
	loading,
	isMobile,
	listMajors,
	defaultSemester,
}) => {
	const dispatch = useDispatch();
	const [status, setStatus] = useState({});
	const [note, setNote] = useState();
	const typePingTimeoutRef = useRef(null);
	const [textNote, setTextNote] = useState('');
	const [chooseIdStudent, setChooseIdStudent] = useState([]);
	const [listIdStudent, setListIdStudent] = useState([]);
	const [listEmailStudent, setListEmailStudent] = useState([]);
	const [page, setPage] = useState({
		page: 1,
		limit: 20,
		campus_id: infoUser.manager.campus_id,
	});
	const [studentdetail, setStudentDetail] = useState('');
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [filter, setFiler] = useState({});

	const fileType =
		'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
	const fileExtension = '.xlsx';

	const onShowModal = () => {
		setIsModalVisible(true);
	};

	const onCloseModal = () => {
		setIsModalVisible(false);
		getDataReview();
	};

	const getDataReview = () => {
		dispatch(
			defaultTime({
				filter: { campus_id: infoUser.manager.campus_id },
				callback: (res) => {
					if (res.status === 'ok') {
						const data = {
							...page,
							...filter,
							smester_id: res.result._id,
							reviewer: infoUser?.manager?.email,
						};
						setChooseIdStudent([]);
						dispatch(listStudentForm(data));
					}
				},
			})
		);
	};

	useEffect(() => {
		getDataReview();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [page]);

	const onShowDetail = (mssv, key) => {
		onShowModal();
		setStudentDetail(key._id);
	};

	useEffect(() => {
		dispatch(getListMajor());
	}, [dispatch]);

	const columns = [
		{
			title: 'MSSV',
			dataIndex: 'mssv',
			width: 100,
			fixed: 'left',
			render: (val, key) => {
				return (
					<p
						style={{ margin: 0, cursor: 'pointer', color: 'blue' }}
						onClick={() => onShowDetail(val, key)}
					>
						{val}
					</p>
				);
			},
		},
		{
			title: 'Họ và Tên',
			dataIndex: 'name',
			width: 150,
			fixed: 'left',
		},
		{
			title: 'Email',
			dataIndex: 'email',
			width: 200,
		},
		{
			title: 'Điện thoại',
			dataIndex: 'phoneNumber',
			render: (text) => (text === null ? null : `0${text}`),
			width: 160,
		},
		{
			title: 'Ngành',
			dataIndex: 'majors',
			width: 100,
			render: (val) => {
				return val.name;
			},
		},
		{
			title: 'Tên công ty',
			width: 180,
			render: (val, record) => {
				if (record.support === 1) {
					return record.business?.name;
				} else {
					return record.nameCompany;
				}
			},
		},
		{
			title: 'Mã tuyển dụng',
			render: (val, record) => {
				if (record.support === 1) {
					return record.business?.code_request;
				} else {
					return record.taxCode;
				}
			},
			width: 100,
		},
		{
			title: 'Vị trí thực tập',
			render: (val, record) => {
				if (record.support === 1) {
					return record.business?.internshipPosition;
				} else {
					return record.dream;
				}
			},
			width: 100,
		},
		{
			title: 'Địa chỉ công ty',
			render: (val, record) => {
				if (record.support === 1) {
					return record.business?.address;
				} else {
					return record.addressCompany;
				}
			},
			width: 100,
		},
		{
			title: 'Biên bản',
			dataIndex: 'form',
			width: 100,
			render: (val) =>
				val ? (
					<Button
						type="text"
						icon={<EyeOutlined className="icon-cv" />}
						onClick={() => window.open(val)}
					/>
				) : (
					''
				),
		},
		{
			title: 'Người review',
			dataIndex: 'reviewer',
			render: (val) => val && val.slice(0, -11),
			width: 200,
		},
		{
			title: 'Ghi chú',
			dataIndex: 'note',
			width: 200,
		},
		{
			title: 'Ngày bắt đầu',
			dataIndex: 'internshipTime',
			width: 230,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'statusCheck',
			width: 150,
			render: (status, student) => {
				if (status === 0) {
					return (
						<span className="status-fail" style={{ color: 'orange' }}>
							Chờ kiểm tra
						</span>
					);
				} else if (status === 1) {
					return (
						<span className="status-up" style={{ color: 'grey' }}>
							Sửa lại CV
						</span>
					);
				} else if (status === 2) {
					return (
						<span className="status-fail" style={{ color: 'red' }}>
							Chờ nộp biên bản
						</span>
					);
				} else if (status === 3) {
					return (
						<span className="status-fail" style={{ color: 'red' }}>
							Trượt
						</span>
					);
				} else if (status === 4) {
					return (
						<span className="status-fail" style={{ color: 'red' }}>
							{student.form ? 'Đã nộp biên bản' : 'Chờ nộp biên bản'} <br />
						</span>
					);
				} else if (status === 5) {
					return (
						<span className="status-fail" style={{ color: 'red' }}>
							Sửa biên bản <br />
						</span>
					);
				} else if (status === 6) {
					return (
						<span className="status-fail" style={{ color: 'red' }}>
							Đang thực tập <br />
						</span>
					);
				} else if (status === 7) {
					return (
						<span className="status-fail" style={{ color: 'red' }}>
							{student.report ? 'Đã nộp báo cáo' : 'Chờ nộp báo cáo'}
							<br />
						</span>
					);
				} else if (status === 8) {
					return (
						<span className="status-fail" style={{ color: 'red' }}>
							Sửa báo cáo <br />
						</span>
					);
				} else if (status === 9) {
					return (
						<span className="status-fail" style={{ color: 'red' }}>
							Hoàn thành <br />
						</span>
					);
				} else {
					return (
						<span className="status-fail" style={{ color: 'red' }}>
							Chưa đăng ký
						</span>
					);
				}
			},
		},
	];
	// xóa tìm kiếm
	const rowSelection = {
		onChange: (selectedRowKeys, selectedRows) => {
			setListIdStudent(selectedRowKeys);
			setListEmailStudent(selectedRows);
			setChooseIdStudent(selectedRows);
		},
	};

	const handleStandardTableChange = (key, value) => {
		const newValue =
			value.length > 0 || (value > 0 && value !== '')
				? {
						...filter,
						[key]: value,
				  }
				: omit(filter, [key]);
		setFiler(newValue);
	};
	const handleSearch = () => {
		dispatch(
			defaultTime({
				filter: { campus_id: infoUser.manager.campus_id },
				callback: (res) => {
					if (res.status === 'ok') {
						const data = {
							...page,
							...filter,
							smester_id: res.data._id,
						};
						setChooseIdStudent([]);
						dispatch(listStudentForm(data));
					}
				},
			})
		);
	};
	const actionOnchange = (value) => {
		switch (value) {
			case 'assgin':
				try {
					dispatch(
						updateReviewerListStudent({
							listIdStudent: listIdStudent,
							email: infoUser?.manager?.email,
						})
					);
					setNote(value);
					setStatus([]);
					message.success('Thành công');
				} catch (error) {
					message.error('Thất bại');
				}
				break;
			case 'edit':
				setStatus({
					listIdStudent: listIdStudent,
					email: infoUser?.manager?.email,
				});
				break;

			default:
				break;
		}
	};
	const selectStatus = (value) => {
		setNote(value);
		let id = [];
		chooseIdStudent.filter((item) => item.form !== null).map((item) => id.push(item._id));
		if (id.length === chooseIdStudent.length) {
			setStatus({
				listIdStudent: id,
				listEmailStudent: listEmailStudent,
				email: infoUser?.manager?.email,
				status: value,
			});
		} else {
			message.error('Chưa nộp biên bản');
			setChooseIdStudent([]);
		}
	};
	const comfirm = () => {
		dispatch(
			updateStatusListStudent({
				...status,
				textNote,
			})
		);
		setChooseIdStudent([]);
	};

	const handleNote = ({ target: { value } }) => {
		if (typePingTimeoutRef.current) {
			clearTimeout(typePingTimeoutRef.current);
		}
		typePingTimeoutRef.current = setTimeout(() => {
			setTextNote(value);
		}, 300);
	};

	const handleExport = () => {
		const data = {
			smester_id: defaultSemester._id,
			campus_id: infoUser.manager.campus_id,
		};

		dispatch(
			exportFormData({
				val: data,
				callback: (res) => {
					if (res.status === 'ok') {
						exportExcel(res.result);
					} else {
						message.error('Có lỗi sảy ra vui lòng reload lại trang và thử lại');
					}
				},
			})
		);
	};

	const exportExcel = (list) => {
		const newData = [];
		list &&
			list.map((item) => {
				let itemStatus = item['statusCheck'];
				const newObject = {};
				newObject['MSSV'] = item['mssv'];
				newObject['Họ tên'] = item['name'];
				newObject['Email'] = item['email'];
				newObject['Số điện thoại'] =
					item['phoneNumber'] === null ? null : '0' + item['phoneNumber'];
				newObject['Chuyên ngành'] = item['majors']?.name;
				newObject['Tên công ty'] = item?.nameCompany
					? item['nameCompany']
					: item['business']?.name;
				newObject['Mã tuyển dụng'] = item?.taxCode
					? item['taxCode']
					: item['business']?.code_request;
				newObject['Vị trí thực tập'] = item?.dream
					? item['dream']
					: item['business']?.internshipPosition;
				newObject['Địa chỉ công ty'] = item?.addressCompany
					? item['addressCompany']
					: item['business']?.address;
				newObject['Biên bản'] = item['form'];
				newObject['Người review'] = item['reviewer'];
				newObject['Ghi chú'] = item['note'];
				newObject['Ngày bắt đầu'] = timestamps(item['internshipTime']);
				newObject['Thời gian nộp báo cáo'] = moment(item['createdAt']).format(
					'D/MM/YYYY h:mm:ss'
				);
				newObject['Trạng thái'] =
					itemStatus === 1
						? 'Chờ kiểm tra'
						: itemStatus === 2
						? ' Nhận CV'
						: itemStatus === 3
						? ' Trượt'
						: itemStatus === 4
						? ' Đã nộp biên bản'
						: itemStatus === 5
						? 'Sửa biên bản'
						: itemStatus === 6
						? 'Đang thực tập '
						: itemStatus === 7
						? ' Đã nộp báo cáo '
						: itemStatus === 8
						? ' Sửa báo cáo'
						: itemStatus === 9
						? 'Hoàn thành'
						: 'Chưa đăng ký';
				return newData.push(newObject);
			});
		const ws = XLSX.utils.json_to_sheet(newData);
		const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
		const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
		const data = new Blob([excelBuffer], { type: fileType });
		FileSaver.saveAs(data, fileExtension);
	};
	return (
		<div className={styles.status}>
			<div className={styles.header_flex}>
				<h1>Review biên bản</h1>
				{!isMobile && (
					<Button onClick={handleExport} type="primary">
						Export
					</Button>
				)}
			</div>

			{isMobile ? (
				<>
					<Row>
						<Col span={12}>
							<div className="search">
								<Select
									style={{ width: '95%' }}
									onChange={(val) => handleStandardTableChange('majors', val)}
									placeholder="Lọc theo ngành"
									defaultValue=""
								>
									<Option value="">Tất cả</Option>
									{listMajors &&
										listMajors.map((item, index) => (
											<>
												<Option value={item._id} key={index}>
													{item.name}
												</Option>
											</>
										))}
								</Select>
							</div>
						</Col>
						<Col span={12}>
							<div className="search">
								<Select
									className="filter-status"
									style={{ width: '100%' }}
									onChange={(val) =>
										handleStandardTableChange('statusCheck', val)
									}
									defaultValue={11}
									placeholder="Lọc theo trạng thái"
								>
									{filterStatusForm.map((item, index) => (
										<Option value={item.id} key={index}>
											{item.title}
										</Option>
									))}
								</Select>
							</div>
						</Col>
					</Row>

					<Row
						style={{
							marginTop: 20,
						}}
					>
						<Col span={12}>
							<div className="search">
								<Input
									style={{ width: '95%' }}
									placeholder="Tìm kiếm theo mã sinh viên"
									onChange={(val) =>
										handleStandardTableChange('mssv', val.target.value)
									}
								/>
							</div>
						</Col>
						<Col span={12}>
							<Button
								type="primary"
								onClick={handleSearch}
								style={{
									width: '100%',
								}}
							>
								Tìm kiếm
							</Button>
						</Col>
					</Row>
				</>
			) : (
				<>
					<div className="filter" style={{ marginTop: '20px' }}>
						<Row>
							<Col xs={24} sm={4} md={12} lg={8} xl={8}>
								<div
									style={{
										display: 'flex',
									}}
									className="search"
								>
									<span style={{ width: '35%', marginRight: '35px' }}>
										Ngành:{' '}
									</span>
									<Select
										style={{
											width: '100%',
											position: 'relative',
											right: '70px',
										}}
										defaultValue=""
										onChange={(val) => handleStandardTableChange('majors', val)}
										placeholder="Lọc theo ngành"
									>
										<Option value="">Tất cả</Option>
										{listMajors &&
											listMajors.map((item, index) => (
												<>
													<Option value={item._id} key={index}>
														{item.name}
													</Option>
												</>
											))}
									</Select>
								</div>
							</Col>
							<br />
							<br />
							<Col xs={24} sm={4} md={12} lg={8} xl={8}>
								<div
									style={{
										display: 'flex',
									}}
									className="search"
								>
									<span style={{ width: '65%' }}>Trạng thái:</span>
									<Select
										className="filter-status"
										style={{
											width: '100%',
											position: 'relative',
											right: '44px',
										}}
										defaultValue={11}
										onChange={(val) =>
											handleStandardTableChange('statusCheck', val)
										}
										placeholder="Lọc theo trạng thái"
									>
										{filterStatusForm.map((item, index) => (
											<Option value={item.id} key={index}>
												{item.title}
											</Option>
										))}
									</Select>
								</div>
							</Col>
							<br />
							<br />
							<Col xs={24} sm={4} md={12} lg={8} xl={8}>
								<div
									style={{
										display: 'flex',
									}}
									className="search"
								>
									<span style={{ width: '45%' }}>Tìm Kiếm: </span>
									<Input
										style={{
											width: '100%',
											position: 'relative',
											right: '40px',
										}}
										placeholder="Tìm kiếm theo mã sinh viên"
										onChange={(val) =>
											handleStandardTableChange('mssv', val.target.value)
										}
									/>
								</div>
							</Col>
							<br />
							<br />
							<Col xs={24} sm={4} md={24} lg={24} xl={16}>
								<div>
									<Button
										style={{
											marginTop: '10px',
											color: '#fff',
											background: '#ee4d2d',
										}}
										onClick={handleSearch}
									>
										Tìm kiếm
									</Button>
									{chooseIdStudent.length > 0 && (
										<Col
											style={{
												marginTop: 20,
											}}
											xs={24}
											sm={24}
											md={24}
											lg={12}
											xl={12}
										>
											<Row gutter={[10, 10]}>
												<Col xs={24} sm={24} md={24} lg={4} xl={4}>
													<span style={{ whiteSpace: 'nowrap' }}>
														Lựa chọn:
													</span>
												</Col>
												{/* <span style={{ whiteSpace: "nowrap" }}>Lựa chọn:</span> */}
												<Col xs={24} sm={12} md={12} lg={10} xl={10}>
													<Select
														className="comfirm-click"
														style={{ width: '100%' }}
														onChange={actionOnchange}
														placeholder="Chọn"
													>
														<Option value="assgin" key="1">
															Kéo việc
														</Option>
														<Option value="edit" key="2">
															Cập nhật trạng thái
														</Option>
													</Select>
												</Col>
												{Object.keys(status).length >= 1 && (
													<Col xs={24} sm={12} md={12} lg={10} xl={10}>
														<Select
															// className="upload-status"
															className="upload-status"
															style={{ width: '100%' }}
															onChange={(e) => selectStatus(e)}
															placeholder="Chọn trạng thái"
														>
															{statusConfigForm.map((item, index) => (
																<Option
																	value={item.value}
																	key={index}
																>
																	{item.title}
																</Option>
															))}
														</Select>
													</Col>
												)}
												{note === 3 || note === 5 || note === 8 ? (
													<TextArea
														// value={value}
														onChange={handleNote}
														placeholder="Ghi chú..."
														autoSize={{ minRows: 3, maxRows: 5 }}
													/>
												) : null}
												{Object.keys(status).length > 0 && (
													<Button onClick={() => comfirm()}>
														Xác nhận
													</Button>
												)}
											</Row>
										</Col>
									)}
								</div>
							</Col>
						</Row>
					</div>
				</>
			)}

			{window.innerWidth > 1024 ? (
				<Table
					rowSelection={{
						type: 'checkbox',
						...rowSelection,
					}}
					pagination={{
						pageSize: page.limit,
						total: total,
						onChange: (page, pageSize) => {
							setPage({
								page: page,
								limit: pageSize,
								campus_id: infoUser.manager.cumpus,
								...filter,
							});
						},
					}}
					rowKey="_id"
					loading={loading}
					columns={columns}
					dataSource={list}
					scroll={{ x: 'calc(700px + 50%)' }}
				/>
			) : (
				<Table
					rowSelection={{
						type: 'checkbox',
						...rowSelection,
					}}
					loading={loading}
					pagination={{
						pageSize: page.limit,
						total: total,
						onChange: (page, pageSize) => {
							setPage({
								page: page,
								limit: pageSize,
								campus_id: infoUser.manager.cumpus,
								...filter,
							});
						},
					}}
					rowKey="_id"
					dataSource={list}
				>
					<Column title="Mssv" dataIndex="mssv" key="_id" />
					<Column title="Họ và Tên" dataIndex="name" key="_id" />
					{window.innerWidth > 739 && window.innerWidth < 1023 && (
						<Column title="Email" dataIndex="email" key="_id" />
					)}
					<Column
						title="Trạng thái"
						dataIndex="statusCheck"
						key="_id"
						render={(status) => {
							if (status === 0) {
								return (
									<span className="status-fail" style={{ color: 'orange' }}>
										Chờ kiểm tra
									</span>
								);
							} else if (status === 1) {
								return (
									<span className="status-up" style={{ color: 'grey' }}>
										Sửa lại CV
									</span>
								);
							} else if (status === 2) {
								return (
									<span className="status-fail" style={{ color: 'red' }}>
										Nhận CV
									</span>
								);
							} else if (status === 3) {
								return (
									<span className="status-fail" style={{ color: 'red' }}>
										Trượt
									</span>
								);
							} else if (status === 4) {
								return (
									<span className="status-fail" style={{ color: 'red' }}>
										Đã nộp biên bản <br />
									</span>
								);
							} else if (status === 5) {
								return (
									<span className="status-fail" style={{ color: 'red' }}>
										Sửa biên bản <br />
									</span>
								);
							} else if (status === 6) {
								return (
									<span className="status-fail" style={{ color: 'red' }}>
										Đang thực tập <br />
									</span>
								);
							} else if (status === 7) {
								return (
									<span className="status-fail" style={{ color: 'red' }}>
										Đã nộp báo cáo <br />
									</span>
								);
							} else if (status === 8) {
								return (
									<span className="status-fail" style={{ color: 'red' }}>
										Sửa báo cáo <br />
									</span>
								);
							} else if (status === 9) {
								return (
									<span className="status-fail" style={{ color: 'red' }}>
										Hoàn thành <br />
									</span>
								);
							} else {
								return (
									<span className="status-fail" style={{ color: 'red' }}>
										Chưa đăng ký
									</span>
								);
							}
						}}
					/>
				</Table>
			)}
			{isModalVisible && (
				<StudentDetail
					closeModal={onCloseModal}
					studentId={studentdetail}
					onShowModal={onShowModal}
					infoUser={infoUser}
				/>
			)}
		</div>
	);
};

Reviewform.propTypes = {
	infoUser: object,
	loading: bool,
	listStudentAssReviewer: object,
};

export default connect(
	({
		auth: { infoUser },
		reviewer: { listStudentAssReviewer, loading },
		global,
		major,
		semester,
	}) => ({
		listStudentAssReviewer,
		infoUser,
		loading,
		isMobile: global.isMobile,
		listMajors: major.listMajor,
		defaultSemester: semester.defaultSemester,
	})
)(Reviewform);
