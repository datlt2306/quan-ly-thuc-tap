import { EyeOutlined } from '@ant-design/icons';
import { Button, Col, Input, message, Row, Select, Table } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import * as FileSaver from 'file-saver';
import { omit } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import * as XLSX from 'xlsx';
import SemestersAPI from '../../API/SemestersAPI';
import StudentDetail from '../../components/studentDetail/StudentDetail';
import { getListMajor } from '../../features/majorSlice/majorSlice';
import {
	getListStudentAssReviewer,
	updateReviewerListStudent,
	updateStatusListStudent,
	getListStudentAssReviewerExportExcel,
} from '../../features/reviewerStudent/reviewerSlice';
import { statusConfigCV } from '../../utils/constConfig';
import { filterStatusCV } from '../../utils/selectOption';
import { getLocal } from '../../utils/storage';
import styles from './review.module.css';
const { Column } = Table;

const { Option } = Select;

const ReviewCV = ({ listBusiness, listMajors, isMobile }) => {
	const dispatch = useDispatch();
	const [studentdetail, setStudentDetail] = useState('');
	const infoUser = getLocal();
	const {
		listStudentAssReviewer: { total, list },
		listStudentAssReviewerExportExcel,
		loading,
	} = useSelector((state) => state.reviewer);
	const [chooseIdStudent, setChooseIdStudent] = useState([]);
	const [listIdStudent, setListIdStudent] = useState([]);
	const [listEmailStudent, setListEmailStudent] = useState([]);
	const [status, setStatus] = useState({});
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [textNote, setTextNote] = useState('');
	const [page, setPage] = useState({
		page: 1,
		limit: 20,
		campus_id: infoUser.manager.campus_id,
	});
	const [filter, setFiler] = useState({});
	const onShowModal = () => {
		setIsModalVisible(true);
	};

	useEffect(() => {
		dispatch(getListMajor());
	}, [dispatch]);

	const onCloseModal = () => {
		setIsModalVisible(false);
		getDataReviewCV();
	};

	const getDataReviewCV = () => {
		SemestersAPI.getDefaultSemester()
			.then((res) => {
				if (res.status === 200) {
					const data = {
						...page,
						...filter,
						smester_id: res.data._id,
						reviewer: infoUser?.manager?.email,
					};
					setChooseIdStudent([]);
					dispatch(getListStudentAssReviewer(data));
				}
			})
			.catch(() => {});
	};
	const getListStudentAssReviewerExport = () => {
		SemestersAPI.getDefaultSemester()
			.then((res) => {
				if (res.status === 200) {
					const data = {
						...filter,
						smester_id: res.data._id,
					};
					setChooseIdStudent([]);
					dispatch(getListStudentAssReviewerExportExcel(data));
				}
			})
			.catch(() => {});
	};
	useEffect(() => {
		getDataReviewCV();
		getListStudentAssReviewerExport();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [page]);

	const onShowDetail = (mssv, key) => {
		setStudentDetail(key._id);
		onShowModal();
	};

	const columns = [
		{
			title: 'MSSV',
			dataIndex: 'mssv',
			width: 100,
			fixed: 'left',
			color: 'blue',
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
			width: 130,
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
			title: 'Số lần hỗ trợ',
			dataIndex: 'numberOfTime',
			width: 120,
		},
		// {
		//   title: "Phân loại",
		//   dataIndex: "support",
		//   width: 90,
		//   render: (val) => {
		//     if (val === 1) {
		//       return "Hỗ trợ";
		//     } else if (val === 0) {
		//       return "Tự tìm";
		//     } else {
		//       return "";
		//     }
		//   },
		// },
		{
			title: 'CV',
			dataIndex: 'CV',
			width: 50,
			render: (val) =>
				val ? <EyeOutlined className="icon-cv" onClick={() => window.open(val)} /> : '',
		},
		{
			title: 'Người review',
			dataIndex: 'reviewer',
			width: 230,
		},
		{
			title: 'Ghi chú',
			dataIndex: 'note',
			width: 150,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'statusCheck',
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
			value.length > 0 || (value < 11 && value !== '')
				? {
						...filter,
						[key]: value,
				  }
				: omit(filter, [key]);
		setFiler(newValue);
	};
	const handleSearch = () => {
		getDataReviewCV();
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
	const [note, setNote] = useState();
	const selectStatus = (value) => {
		setNote(value);
		setStatus({
			listIdStudent: listIdStudent,
			listEmailStudent: listEmailStudent,
			email: infoUser?.manager?.email,
			status: value,
		});
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
	const typePingTimeoutRef = useRef(null);
	const handleNote = ({ target }) => {
		if (typePingTimeoutRef.current) {
			clearTimeout(typePingTimeoutRef.current);
			// }else if (typePingTimeoutRef.current){
			//   clearTimeout(typePingTimeoutRef.current);
			// }
		}
		typePingTimeoutRef.current = setTimeout(() => {
			setTextNote(target.value);
		}, 300);
	};

	const fileType =
		'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
	const fileExtension = '.xlsx';

	const exportToCSV = (list) => {
		const newData = [];

		list.filter((item) => {
			const newObject = {};
			newObject['Kỳ học'] = item['smester_id']?.name;
			newObject['Cơ sở'] = item['campus_id']?.name;
			newObject['MSSV'] = item['mssv'];
			newObject['Họ tên'] = item['name'];
			newObject['Email'] = item['email'];
			newObject['Số điện thoại'] =
				item['phoneNumber'] === null ? null : '0' + item['phoneNumber'];
			newObject['Ngành'] = item['majors']?.name;
			newObject['Mã ngành'] = item['majors']?.majorCode;
			newObject['Tên công ty'] = item['business']?.name;
			newObject['Mã tuyển dụng'] = item?.taxCode
				? item['taxCode']
				: item['business']?.code_request;
			newObject['Vị trí thực tập'] = item['business']?.internshipPosition;
			newObject['Địa chỉ công ty'] = item['business']?.address;
			newObject['Số lần hỗ trợ'] = item['numberOfTime'];
			newObject['CV'] = item['CV'];
			newObject['Người review'] = item['reviewer'];
			// newObject["Hình thức"] = item["support"];
			newObject['Ghi chú'] = item['note'];
			return newData.push(newObject);
		});
		// eslint-disable-next-line array-callback-return
		newData.filter((item) => {
			if (item['Trạng thái'] === 0) {
				item['Trạng thái'] = 0;
				item['Trạng thái'] = 'Chờ kiểm tra';
			} else if (item['Trạng thái'] === 1) {
				item['Trạng thái'] = 1;
				item['Trạng thái'] = 'Sửa lại CV';
			} else if (item['Trạng thái'] === 2) {
				item['Trạng thái'] = 2;
				item['Trạng thái'] = 'Đã nhận CV';
			} else {
			}
		});
		const ws = XLSX.utils.json_to_sheet(newData);
		const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
		const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
		const data = new Blob([excelBuffer], { type: fileType });
		FileSaver.saveAs(data, fileExtension);
	};

	const dataExportExcel = listStudentAssReviewerExportExcel?.list;
	return (
		<div className={styles.status}>
			<div className={styles.header_flex}>
				<h1>Review CV</h1>
			</div>

			{isMobile ? (
				<>
					<div className={styles.status}>
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
													<Option value={item?._id} key={item?._id}>
														{item?.name}
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
										placeholder="Lọc theo trạng thái"
										defaultValue={11}
									>
										{filterStatusCV.map((item, index) => (
											<Option value={item?.id} key={index}>
												{item?.title}
											</Option>
										))}
									</Select>
								</div>
							</Col>
						</Row>
						<div className="search">
							<Input
								style={{ width: '100%', marginTop: 20 }}
								placeholder="Tìm kiếm theo mã sinh viên"
								onChange={(val) =>
									handleStandardTableChange('mssv', val.target.value)
								}
							/>
						</div>
						<Row
							style={{
								marginTop: 20,
							}}
						>
							<Col span={12}>
								<Button
									type="primary"
									variant="warning"
									style={{ width: '95%' }}
									onClick={(e) => exportToCSV(dataExportExcel)}
								>
									Export
								</Button>
							</Col>
							<Col span={12}>
								<div>
									<Button
										type="primary"
										style={{ width: '100%' }}
										onClick={handleSearch}
									>
										Tìm kiếm
									</Button>
								</div>
							</Col>
						</Row>
						{chooseIdStudent.length > 0 && (
							<div className="comfirm">
								<Select
									className="comfirm-click"
									style={{ width: '100%', marginTop: '10px' }}
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
										style={{ width: '100%', margin: '10px 0' }}
										onChange={(e) => selectStatus(e)}
										placeholder="Chọn trạng thái"
									>
										{statusConfigCV.map((item, index) => (
											<Option value={item.value} key={index}>
												{item.title}
											</Option>
										))}
									</Select>
								)}
								{note === 1 || note === 5 ? (
									<TextArea
										// value={value}
										onChange={handleNote}
										placeholder="Ghi chú..."
										style={{ marginRight: 10 }}
										autoSize={{ minRows: 3, maxRows: 5 }}
									/>
								) : null}
								{Object.keys(status).length > 0 && (
									<Button style={{ marginRight: 10 }} onClick={() => comfirm()}>
										Xác nhận
									</Button>
								)}
							</div>
						)}
					</div>
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
										Ngành:
									</span>
									<Select
										style={{
											width: '100%',
										}}
										onChange={(val) => handleStandardTableChange('majors', val)}
										placeholder="Lọc theo ngành"
										defaultValue=""
									>
										<Option value="">Tất cả</Option>
										{listMajors &&
											listMajors.map((item, index) => (
												<>
													<Option value={item?._id} key={index}>
														{item?.name}
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
										onChange={(val) =>
											handleStandardTableChange('statusCheck', val)
										}
										placeholder="Lọc theo trạng thái"
										defaultValue={11}
									>
										{filterStatusCV.map((item, index) => (
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
										Tìm Kiếm:
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
										justifyContent: 'center',
										alignItems: 'center',
									}}
								>
									<Button
										variant="warning"
										style={{
											marginRight: 10,
											color: '#fff',
											background: '#ee4d2d',
											minWidth: '90px',
										}}
										onClick={(e) => exportToCSV(dataExportExcel)}
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
											<span style={{ whiteSpace: 'nowrap' }}>Lựa chọn:</span>
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
													style={{ width: '100%' }}
													onChange={(e) => selectStatus(e)}
													placeholder="Chọn trạng thái"
												>
													{statusConfigCV.map((item, index) => (
														<Option value={item.value} key={index}>
															{item.title}
														</Option>
													))}
												</Select>
											</Col>
										)}
										{note === 1 && (
											<Col span={24}>
												<TextArea
													// value={value}
													onChange={handleNote}
													placeholder="Ghi chú..."
													style={{ marginRight: 10 }}
													autoSize={{ minRows: 3, maxRows: 5 }}
												/>
											</Col>
										)}
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
					dataSource={list}
					scroll={{ x: 'calc(1000px + 50%)' }}
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
					//     <div style={{ marginTop: '10px' }}>
					//       {window.innerWidth < 1023 && window.innerWidth > 739 ? (
					//         ''
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
					//         {record.support === 1 && 'Hỗ trợ'}
					//         {record.support === 0 && 'Tự tìm'}
					//         {record.support !== 1 && record.support !== 0 && ''}
					//       </p>
					//       <br />
					//       <p className="list-detail">
					//         CV:{' '}
					//         {record.CV ? (
					//           <EyeOutlined
					//             style={{ fontSize: '.9rem' }}
					//             onClick={() => window.open(record.CV)}
					//           />
					//         ) : (
					//           ''
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
					infoUser={infoUser}
					studentId={studentdetail}
					onShowModal={onShowModal}
					closeModal={onCloseModal}
				/>
			)}
		</div>
	);
};
export default connect(({ students, semester, major, global }) => ({
	defaultSemester: semester.defaultSemester,
	loading: students.loading,
	listMajors: major.listMajor,
	...global,
}))(ReviewCV);
