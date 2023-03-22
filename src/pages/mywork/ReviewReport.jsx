import React, { useState, useEffect, useRef } from 'react';
import styles from './mywork.module.css';
import { Select, Input, Table, Button, message, Row, Col } from 'antd';
import { useSelector, useDispatch, connect } from 'react-redux';
import {
	listStudentReport,
	updateReviewerListStudent,
	updateStatusListStudent,
} from '../../features/reviewerStudent/reviewerSlice';
import { filterStatusReport } from '../../utils/selectOption';
import _, { omit } from 'lodash';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { statusConfigReport } from '../../utils/constConfig';
import { EyeOutlined } from '@ant-design/icons';
import TextArea from 'antd/lib/input/TextArea';
import { timestamps } from '../../utils/timestamps';
import StudentDetail from '../../components/studentDetail/StudentDetail';
import { getListMajor } from '../../features/majorSlice/majorSlice';
import moment from 'moment';
import { defaultTime } from '../../features/semesters/semestersSlice';
import { signTheContractValues } from '../../utils/constConfig';
const { Column } = Table;

const { Option } = Select;

const ReviewReport = ({ isMobile, listMajors }) => {
	const dispatch = useDispatch();
	const { infoUser } = useSelector((state) => state.auth);
	const {
		listStudentAssReviewer: { total, list },
		loading,
	} = useSelector((state) => state.reviewer);
	const [chooseIdStudent, setChooseIdStudent] = useState([]);
	const [status, setStatus] = useState({});
	const [listIdStudent, setListIdStudent] = useState([]);
	const [listEmailStudent, setListEmailStudent] = useState([]);
	const [note, setNote] = useState();
	const typePingTimeoutRef = useRef(null);
	const [textNote, setTextNote] = useState('');
	const [page, setPage] = useState({
		page: 1,
		limit: 20,
		campus_id: infoUser.manager.campus_id,
	});
	const [filter, setFiler] = useState({});
	const [studentdetail, setStudentDetail] = useState('');
	const [isModalVisible, setIsModalVisible] = useState(false);
	const onShowModal = () => {
		setIsModalVisible(true);
	};

	useEffect(() => {
		dispatch(getListMajor());
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const onCloseModal = () => {
		setIsModalVisible(false);
		getDataReview();
	};

	const getDataReview = () => {
		dispatch(
			defaultTime({
				filter: {
					campus_id: infoUser.manager.campus_id,
				},
				callback: (res) => {
					if (res.status === 'ok') {
						const data = {
							...page,
							...filter,
							smester_id: res.result._id,
							reviewer: infoUser?.manager?.email,
						};
						setChooseIdStudent([]);
						dispatch(listStudentReport(data));
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
			width: 100,
		},
		{
			title: 'Ngành',
			dataIndex: 'majors',
			width: 100,
			render: (val, record) => {
				return record.majors?.name;
			},
		},
		{
			title: 'Tên công ty',
			width: 160,
			render: (val, record) => {
				if (record.support === 1) {
					return record.business?.name;
				} else {
					return record.nameCompany;
				}
			},
		},
		{
			title: 'Thời gian bắt đầu',
			dataIndex: 'internshipTime',
			width: 160,
		},
		{
			title: 'Thời gian kết thúc',
			dataIndex: 'endInternShipTime',
			width: 160,
		},
		{
			title: 'Điểm thái độ',
			dataIndex: 'attitudePoint',
			width: 100,
		},
		{
			title: 'Điểm kết quả',
			dataIndex: 'resultScore',
			width: 100,
		},
		// {
		//   title: "Thời gian nộp báo cáo",
		//   dataIndex: "createdAt",
		//   width: 180,
		// },
		{
			title: 'Báo cáo',
			dataIndex: 'report',
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
			title: 'HĐLĐ',
			dataIndex: 'signTheContract',
			width: 100,
			render: (val) => _.get(_.find(signTheContractValues, ['type', val], {}), 'value', ''),
		},
		{
			title: 'Ghi chú',
			dataIndex: 'note',
			width: 200,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'statusCheck',
			width: 100,
			render: (status) => {
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
			(value.length > 0 || value > 0) && value !== ''
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
				filter: {
					campus_id: infoUser.manager.campus_id,
				},
				callback: (res) => {
					if (res.status === 'ok') {
						const data = {
							...page,
							...filter,
							smester_id: res.data._id,
						};
						setChooseIdStudent([]);
						dispatch(listStudentReport(data));
					}
				},
			})
		);
	};

	const fileType =
		'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
	const fileExtension = '.xlsx';

	const exportToCSV = (list) => {
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
				newObject['Địa chỉ công ty'] = item?.addressCompany
					? item['addressCompany']
					: item['business']?.address;
				newObject['Vị trí thực tập'] = item?.dream
					? item['dream']
					: item['business']?.internshipPosition;
				newObject['Điểm thái độ'] = item['attitudePoint'];
				newObject['Điểm kết quả'] = item['resultScore'];
				newObject['Thời gian bắt đầu'] = timestamps(item['internshipTime']);
				newObject['Thời gian kết thúc'] = timestamps(item['endInternShipTime']);
				newObject['Thời gian nộp báo cáo'] = moment(item['createdAt']).format(
					'D/MM/YYYY h:mm:ss'
				);
				newObject['Trạng thái'] =
					itemStatus.statusCheck === 1
						? 'Chờ kiểm tra'
						: itemStatus.statusCheck === 2
						? ' Nhận CV'
						: itemStatus.statusCheck === 3
						? ' Trượt'
						: itemStatus.statusCheck === 4
						? ' Đã nộp biên bản'
						: itemStatus.statusCheck === 5
						? 'Sửa biên bản'
						: itemStatus.statusCheck === 6
						? 'Đang thực tập '
						: itemStatus.statusCheck === 7
						? ' Đã nộp báo cáo '
						: itemStatus.statusCheck === 8
						? ' Sửa báo cáo'
						: itemStatus.statusCheck === 9
						? 'Hoàn thành'
						: 'Chưa đăng ký';
				newObject['Báo cáo'] = item['report'];
				return newData.push(newObject);
			});
		const ws = XLSX.utils.json_to_sheet(newData);
		const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
		const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
		const data = new Blob([excelBuffer], { type: fileType });
		FileSaver.saveAs(data, fileExtension);
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
		if (value !== 5) {
			chooseIdStudent.filter((item) => item.report !== null).map((item) => id.push(item._id));
			if (id.length === chooseIdStudent.length) {
				setStatus({
					listIdStudent: listIdStudent,
					listEmailStudent: listEmailStudent,
					email: infoUser?.manager?.email,
					status: value,
				});
			} else {
				message.error('Chưa nộp báo cáo');
				setChooseIdStudent([]);
			}
		} else {
			setStatus({
				listIdStudent: listIdStudent,
				listEmailStudent: listEmailStudent,
				email: infoUser?.manager?.email,
				status: value,
			});
		}
	};

	const comfirm = () => {
		try {
			dispatch(
				updateStatusListStudent({
					...status,
					textNote,
				})
			);
			setChooseIdStudent([]);
			message.success('Thành công');
		} catch (error) {
			message.error('Thất bại');
		}
	};
	const handleNote = ({ target: { value } }) => {
		if (typePingTimeoutRef.current) {
			clearTimeout(typePingTimeoutRef.current);
		}
		typePingTimeoutRef.current = setTimeout(() => {
			setTextNote(value);
		}, 300);
	};
	return (
		<div className={styles.status}>
			<div className={styles.header_flex}>
				<h1>Review báo cáo</h1>
			</div>

			{isMobile ? (
				<>
					<div className={styles.status}>
						<Row>
							<Col span={12}>
								<div className="search">
									<Select
										style={{ width: '100%' }}
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
										{filterStatusReport.map((item, index) => (
											<Option value={item?.id} key={index}>
												{item?.title}
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
								<Button
									variant="warning"
									type="primary"
									style={{
										width: '100%',
									}}
									onClick={(e) => exportToCSV(list)}
								>
									Export
								</Button>
							</Col>
							<Col span={12}>
								<Button
									style={{
										width: '100%',
									}}
									type="primary"
									onClick={handleSearch}
								>
									Tìm kiếm
								</Button>
							</Col>
						</Row>
					</div>
					{chooseIdStudent.length > 0 && (
						<div
							style={{
								marginTop: 20,
							}}
							className="comfirm"
						>
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

							{Object.keys(status).length >= 1 && (
								<Select
									className="upload-status"
									style={
										window.innerWidth > 1024
											? { width: '100%', margin: '10px' }
											: { width: '100%', margin: '10px 0' }
									}
									onChange={(e) => selectStatus(e)}
									placeholder="Chọn trạng thái"
								>
									{statusConfigReport.map((item, index) => (
										<Option value={item.value} key={index}>
											{item.title}
										</Option>
									))}
								</Select>
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
								<Button onClick={() => comfirm()}>Xác nhận</Button>
							)}
						</div>
					)}
				</>
			) : (
				<>
					<div className="filter" style={{ marginTop: '20px' }}>
						<Row gutter={[16, 16]}>
							<Col xs={24} sm={12} md={12} lg={6} xl={6}>
								<div
									style={{
										display: 'flex',
										justifyContent: 'center',
										alignItems: 'center',
									}}
								>
									<span style={{ whiteSpace: 'nowrap', marginRight: '10px' }}>
										Ngành:{' '}
									</span>
									<Select
										style={{
											width: '100%',
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
							<Col xs={24} sm={12} md={12} lg={6} xl={6}>
								<div
									style={{
										display: 'flex',
										justifyContent: 'center',
										alignItems: 'center',
									}}
								>
									<span style={{ whiteSpace: 'nowrap', marginRight: '10px' }}>
										Trạng thái:
									</span>
									<Select
										className="filter-status"
										style={{
											width: '100%',
										}}
										defaultValue={11}
										onChange={(val) =>
											handleStandardTableChange('statusCheck', val)
										}
										placeholder="Lọc theo trạng thái"
									>
										{filterStatusReport.map((item, index) => (
											<Option value={item?.id} key={index}>
												{item?.title}
											</Option>
										))}
									</Select>
								</div>
							</Col>
							<Col xs={24} sm={12} md={12} lg={6} xl={6}>
								<div
									style={{
										display: 'flex',
										justifyContent: 'center',
										alignItems: 'center',
									}}
								>
									<span style={{ whiteSpace: 'nowrap', marginRight: '10px' }}>
										Tìm Kiếm:{' '}
									</span>
									<Input
										style={{
											width: '100%',
										}}
										placeholder="Tìm kiếm theo mã sinh viên"
										onChange={(val) =>
											handleStandardTableChange('mssv', val.target.value)
										}
									/>
								</div>
							</Col>
							<Col xs={24} sm={12} md={12} lg={6} xl={6}>
								<div
									style={{
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
									}}
								>
									<Button
										style={{
											marginRight: 20,
											color: '#fff',
											background: '#ee4d2d',
											minWidth: '90px',
										}}
										variant="warning"
										onClick={(e) => exportToCSV(list)}
									>
										Export
									</Button>
									<Button
										style={{
											color: '#fff',
											background: '#ee4d2d',
											minWidth: '90px',
										}}
										onClick={handleSearch}
									>
										Tìm kiếm
									</Button>
								</div>
							</Col>
							{chooseIdStudent.length > 0 && (
								<Col xs={24} sm={24} md={24} lg={12} xl={12}>
									<Row gutter={[10, 10]}>
										<Col xs={24} sm={24} md={24} lg={4} xl={4}>
											<span style={{ whiteSpace: 'nowrap', width: '100%' }}>
												Lựa chọn:
											</span>
										</Col>
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
													className="upload-status"
													style={
														window.innerWidth > 1024
															? { width: '100%' }
															: { width: '100%' }
													}
													onChange={(e) => selectStatus(e)}
													placeholder="Chọn trạng thái"
												>
													{statusConfigReport.map((item, index) => (
														<Option value={item.value} key={index}>
															{item.title}
														</Option>
													))}
												</Select>
											</Col>
										)}
										{note === 3 || note === 5 || note === 8 ? (
											<Col span={24}>
												<TextArea
													// value={value}
													onChange={handleNote}
													placeholder="Ghi chú..."
													autoSize={{ minRows: 3, maxRows: 5 }}
												/>
											</Col>
										) : null}
										{Object.keys(status).length > 0 && (
											<Col xs={24} sm={12} md={12} lg={4} xl={4}>
												<Button
													style={{
														color: '#fff',
														background: '#ee4d2d',
														minWidth: '90px',
													}}
													onClick={() => comfirm()}
												>
													Xác nhận
												</Button>
											</Col>
										)}
									</Row>
								</Col>
							)}
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
					dataSource={
						list &&
						list?.map(({ internshipTime, endInternShipTime, ...list }) => {
							return {
								internshipTime: timestamps(internshipTime),
								endInternShipTime: timestamps(endInternShipTime),
								...list,
							};
						})
					}
					scroll={{ x: 'calc(700px + 50%)' }}
				/>
			) : (
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
					dataSource={list}
					// expandable={{
					//   expandedRowRender: (record) => (
					//     <div style={{ marginTop: "10px" }}>
					//       {window.innerWidth < 1023 && window.innerWidth > 739 ? (
					//         ""
					//       ) : (
					//         <>
					//           <p className="list-detail">Email: {record.email}</p>
					//           <br />
					//         </>
					//       )}
					//       <p className="list-detail">Điện thoại: {record.phoneNumber}</p>
					//       <br />
					//       <p className="list-detail">Ngành: {record.majors}</p>
					//       <br />
					//       <p className="list-detail">
					//         Phân loại:
					//         {record.support === 1 && "Hỗ trợ"}
					//         {record.support === 0 && "Tự tìm"}
					//         {record.support !== 1 && record.support !== 0 && ""}
					//       </p>
					//       <br />
					//       <p className="list-detail">
					//         CV:{" "}
					//         {record.CV ? (
					//           <EyeOutlined
					//             style={{ fontSize: ".9rem" }}
					//             onClick={() => window.open(record.CV)}
					//           />
					//         ) : (
					//           ""
					//         )}
					//       </p>
					//       <br />
					//       <p className="list-detail">Người review: {record.reviewer}</p>
					//       <br />
					//     </div>
					//   ),
					// }}
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

export default connect(({ global, major }) => ({
	isMobile: global.isMobile,
	listMajors: major.listMajor,
}))(ReviewReport);
