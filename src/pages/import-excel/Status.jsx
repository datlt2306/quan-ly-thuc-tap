import { EyeOutlined } from '@ant-design/icons';
import { Button, Col, Drawer, Input, message, Row, Select, Table } from 'antd';
import Column from 'antd/lib/table/Column';
import * as FileSaver from 'file-saver';
import { array, object } from 'prop-types';
import { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import * as XLSX from 'xlsx';
import style from '../../common/styles/status.module.css';
import text from '../../common/styles/downFile.module.css';
import DownloadFile from '../../components/ExcelDocument/DownloadFile';
import UpFile from '../../components/ExcelDocument/UpFile';
import StudentDetail from '../../components/studentDetail/StudentDetail';
import { getListMajor } from '../../features/majorSlice/majorSlice';
import { fetchManager } from '../../features/managerSlice/managerSlice';
import { updateReviewerListStudent } from '../../features/reviewerStudent/reviewerSlice';
import { defaultTime, getSemesters } from '../../features/semesters/semestersSlice';
import { getAllStudent, getDataExport } from '../../features/StudentSlice/StudentSlice';
import { filterStatuss } from '../../ultis/selectOption';
import { getLocal } from '../../ultis/storage';
import confirm from 'antd/lib/modal/confirm';
const { Option } = Select;
const Status = ({
	listAllStudent: { list, total },
	loading,
	listSemesters,
	defaultSemester,
	listMajors,
	isMobile,
}) => {
	const infoUser = getLocal();
	const [studentdetail, setStudentDetail] = useState('');
	const [modal, setModal] = useState(false);
	const [visible, setVisible] = useState(false);
	const dispatch = useDispatch();
	const [chooseIdStudent, setChooseIdStudent] = useState([]);
	const [listIdStudent, setListIdStudent] = useState([]);
	const [page, setPage] = useState({
		page: 1,
		limit: 20,
		campus_id:
			infoUser && infoUser.manager && infoUser.manager.campus_id
				? infoUser.manager.campus_id
				: '',
		smester_id: defaultSemester?._id ? defaultSemester?._id : '',
	});
	const [filter, setFiler] = useState();

	useEffect(() => {
		setChooseIdStudent([]);
		dispatch(getAllStudent(page));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [page]);

	useEffect(() => {
		dispatch(getSemesters({ campus_id: infoUser?.manager?.campus_id }));
		dispatch(getListMajor());
		dispatch(fetchManager());
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	const onShowDetail = (mssv, key) => {
		setStudentDetail(key);
		setModal(true);
	};

	const onCloseModal = () => {
		setModal(false);
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
			render: (val, key) => {
				return <p style={{ textAlign: 'left', margin: 0 }}>{val}</p>;
			},
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
			render: (val) => val?.name,
		},
		{
			title: 'Phân loại',
			dataIndex: 'support',
			width: 90,
			render: (val) => {
				if (val === 1) {
					return 'Hỗ trợ';
				} else if (val === 0) {
					return 'Tự tìm';
				} else {
					return '';
				}
			},
		},
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
			render: (val) => {
				if (val) {
					const name = val.split('@');
					return name[0];
				} else {
					return val;
				}
			},
		},
		{
			title: 'Trạng thái',
			dataIndex: 'statusCheck',
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
							{student.support === 0 ? ' Chờ nộp biên bản' : ' Nhận CV'}
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
							{student?.form ? 'Đã nộp biên bản' : 'Chờ nộp biên bản'} <br />
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
							{student?.report ? 'Đã nộp báo cáo' : 'Chờ nộp báo cáo'}
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
	const rowSelection = {
		onChange: (selectedRowKeys, selectedRows) => {
			setListIdStudent(selectedRowKeys);
			setChooseIdStudent(selectedRows);
		},
	};
	const handleStandardTableChange = (key, value) => {
		const newValue = {
			...filter,
			[key]: value,
		};

		if (value === '' || value === 11) {
			delete newValue[key];
		}

		setFiler(newValue);
	};
	const handleSearch = () => {
		setChooseIdStudent([]);
		dispatch(getAllStudent({ ...page, ...filter }));
	};

	const comfirms = () => {
		confirm({
			title: 'Bạn có muốn nhận danh sách sinh viên?',
			okText: 'Xác nhận',
			cancelText: 'Huỷ',
			onOk() {
				dispatch(
					updateReviewerListStudent({
						listIdStudent: listIdStudent,
						email: infoUser?.manager?.email,
						callback: (status) => {
							if (status) {
								dispatch(getAllStudent({ ...page, ...filter }));
								setChooseIdStudent([]);
								setListIdStudent([]);
								message.success('Thành công');
							} else {
								message.error('Thất bại');
							}
						},
					})
				);
			},
			onCancel() {},
		});
	};

	const handleExport = () => {
		const dataFilter = {
			...filter,
			smester_id: page.smester_id,
			campus_id: page.campus_id,
		};


		dispatch(
			getDataExport({
				filter: dataFilter,
				callback: (res) => exportToCSV(res),
			})
		);
	};

	const exportToCSV = (list) => {
		const fileType =
			'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
		const fileExtension = '.xlsx';
		const newData = [];
		list &&
			list.map((item) => {
				const newObject = {};
				newObject['Kỳ học'] = item['smester_id']?.name;
				newObject['Cơ sở'] = item['campus_id']?.name;
				newObject['MSSV'] = item['mssv'];
				newObject['Họ tên'] = item['name'];
				newObject['Email'] = item['email'];
				newObject['Ngành'] = item['majors']?.name;
				newObject['Mã ngành'] = item['majors']?.majorCode;
				newObject['CV'] = item['CV'];
				newObject['Biên bản'] = item['form'];
				newObject['Báo cáo'] = item['report'];
				newObject['Người review'] = item['reviewer'];
				newObject['Số điện thoại'] =
					item['phoneNumber'] === null ? null : '0' + item['phoneNumber'];
				newObject['Tên công ty'] = item?.nameCompany
					? item['nameCompany']
					: item['business']?.name;
				newObject['Địa chỉ công ty'] = item?.addressCompany
					? item['addressCompany']
					: item['business']?.address;
				newObject['Vị trí thực tập'] = item?.dream
					? item['dream']
					: item['business']?.internshipPosition;
				newObject['Mã số thuế'] = item['taxCode'];
				newObject['Điểm thái độ'] = item['attitudePoint'];
				newObject['Điểm kết quả'] = item['resultScore'];
				newObject['Thời gian thực tập'] = item['internshipTime'];
				newObject['Hình thức'] = item['support'];
				newObject['Ghi chú'] = item['note'];
				return newData.push(newObject);
			});
		// eslint-disable-next-line array-callback-return
		newData.map((item) => {
			if (item['Hình thức'] === 1) {
				item['Hình thức'] = 'Hỗ trợ';
			} else if (item['Hình thức'] === 0) {
				item['Hình thức'] = 'Tự tìm';
			} else {
			}
		});

		const ws = XLSX.utils.json_to_sheet(newData);
		const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
		const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
		const data = new Blob([excelBuffer], { type: fileType });
		FileSaver.saveAs(data, fileExtension);
	};

	const openVisible = () => {
		setVisible(true);
	};

	const closeVisible = () => {
		setPage({
			...page,
		});
		setVisible(false);
	};
	let parentMethods = {
		closeVisible,
	};
	// if (page.smester_id === '') {
	// 	parentMethods = {
	// 		...page,
	// 		smester_id: defaultSemester?._id,
	// 		closeVisible,
	// 	};
	// }
	// if (page.smester_id === '') {
	// 	parentMethods = {
	// 		...page,
	// 		smester_id: defaultSemester?._id,
	// 		closeVisible,
	// 	};
	// }

	return (
		<div className={style.status}>
			<div className={style.flex_header}>
				<h4 className={style.flex_header.h4}>Sinh viên đăng ký thực tập </h4>
				<Col span={8} className="d-flex">
					{/* <Select
						style={{
							width: '100%',
						}}
						onChange={(val) => setPage({ ...filter, ...page, smester_id: val })}
						placeholder="Chọn kỳ"
						defaultValue={
							defaultSemester && defaultSemester?._id ? defaultSemester?._id : ''
						}
					>
						{!defaultSemester?._id && (
							<Option value={''} disabled>
								Chọn kỳ
							</Option>
						)}
						{listSemesters &&
							listSemesters.length > 0 &&
							listSemesters?.map((item, index) => (
								<Option value={item?._id} key={index}>
									{item?.name}
								</Option>
							))}
					</Select> */}
				</Col>
				{!isMobile && (
					<>
						<div
							style={isMobile ? { display: 'none' } : { display: 'flex' }}
							className={style.btn_export}
						>
							<Button
								variant="warning"
								style={{
									marginRight: 20,
									color: '#fff',
									background: '#ee4d2d',
									minWidth: '90px',
								}}
								className={style.button}
								// onClick={(e) => exportToCSV(getListAllStudent)}
								onClick={handleExport}
							>
								Tải file
								Tải file
							</Button>
							<Button
								type="primary"
								variant="warning"
								className={style.button}
								onClick={openVisible}
							>
								Thêm Sinh Viên
							</Button>
						</div>
					</>
				)}
			</div>
			<div>
				{isMobile ? (
					<>
						<Row
							style={{
								marginTop: 20,
							}}
						>
							<Col span={12}>
								<div className={style.div}>
									<Select
										className="select-branch"
										style={{ width: '95%', position: 'relative' }}
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
							<Col span={12}>
								<div className={style.div}>
									<Select
										className="filter-status"
										style={{ width: '100%' }}
										onChange={(val) =>
											handleStandardTableChange('statusCheck', val)
										}
										defaultValue={11}
										placeholder="Lọc theo trạng thái"
									>
										{filterStatuss.map((item, index) => (
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
								<div className={style.div}>
									<Input
										style={{ width: '95%' }}
										placeholder="Tìm kiếm theo mã sinh viên"
										onChange={(val) =>
											handleStandardTableChange(
												'mssv',
												val.target.value.trim()
											)
										}
									/>
								</div>
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

							{chooseIdStudent.length > 0 && (
								<Col span={12}>
									<Button
										style={{
											width: '95%',
											marginTop: '10px',
										}}
										type="primary"
										onClick={() => comfirms()}
									>
										Xác nhận
									</Button>
								</Col>
							)}
						</Row>
						<Row
							style={{
								marginTop: 20,
							}}
						>
							<Col span={12}>
								<Button
									type="primary"
									variant="warning"
									className={style.button}
									style={{
										width: '95%',
									}}
									onClick={openVisible}
								>
									Thêm Sinh Viên
								</Button>
							</Col>
							<Col span={12}>
								<Button
									type="primary"
									variant="warning"
									className={style.button}
									style={{
										width: '100%',
									}}
									onClick={handleExport}
								>
									Export
								</Button>
							</Col>
						</Row>
						<Row
							style={{
								marginTop: 20,
							}}
						></Row>
					</>
				) : (
					<Row gutter={[16, 16]}>
						<Col xs={24} sm={12} md={12} lg={8} xl={8}>
							<div
								style={{
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center',
								}}
							>
								<span style={{ whiteSpace: 'nowrap', marginRight: '10px' }}>
									Ngành :{' '}
								</span>
								<Select
									className="select-branch"
									style={{ width: '100%' }}
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

						<Col xs={24} sm={12} md={12} lg={8} xl={8}>
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
									style={{ width: '100%' }}
									onChange={(val) =>
										handleStandardTableChange('statusCheck', val)
									}
									defaultValue={11}
									placeholder="Lọc theo trạng thái"
								>
									{filterStatuss.map((item, index) => (
										<Option value={item?.id} key={index}>
											{item?.title}
										</Option>
									))}
								</Select>
							</div>
						</Col>

						<Col xs={24} sm={12} md={12} lg={8} xl={8}>
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
									style={{ width: '100%' }}
									placeholder="Tìm kiếm theo mã sinh viên"
									onChange={(val) =>
										handleStandardTableChange('mssv', val.target.value.trim())
									}
								/>
							</div>
						</Col>

						<Col span={24}>
							<Button
								style={{
									color: '#fff',
									background: '#ee4d2d',
								}}
								onClick={handleSearch}
							>
								Tìm kiếm
							</Button>

							{chooseIdStudent.length > 0 && (
								<Button
									style={{
										color: '#fff',
										background: '#ee4d2d',
										marginLeft: '20px',
									}}
									onClick={() => comfirms()}
								>
									Xác nhận
								</Button>
							)}
						</Col>
					</Row>
				)}
			</div>

			{window.innerWidth > 1024 ? (
				<Table
					rowSelection={{
						type: 'checkbox',
						...rowSelection,
					}}
					pagination={{
						pageSize: page.limit,
						total: total,
						onChange: (pageNumber, pageSize) => {
							setPage({
								...page,
								page: pageNumber,
								limit: pageSize,
								campus_id: infoUser.manager.campus_id,
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
							dispatch(
								defaultTime({
									filter: { campus_id: infoUser.manager.campus_id },
									callback: (res) => {
										if (res.status === 'ok') {
											const data = {
												page: page,
												limit: pageSize,
												smester_id: res.result._id,
												campus_id: infoUser.manager.campus_id,
												...filter,
											};
											setChooseIdStudent([]);
											dispatch(getAllStudent(data));
										}
									},
								})
							);
						},
					}}
					rowKey="_id"
					loading={loading}
					dataSource={list}
				>
					<Column
						title="Mssv"
						dataIndex="mssv"
						key="_id"
						render={(val, key) => {
							return (
								<p
									style={{ margin: 0, cursor: 'pointer', color: 'blue' }}
									onClick={() => onShowDetail(val, key)}
								>
									{val}
								</p>
							);
						}}
					/>
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

			{modal && (
				<StudentDetail
					infoUser={infoUser}
					studentId={studentdetail._id}
					onShowModal={modal}
					closeModal={onCloseModal}
				/>
			)}
			<Drawer
				title="Thêm Sinh Viên"
				placement="left"
				onClose={closeVisible}
				visible={visible}
			>
				<div className={style.upFile}>
					<UpFile parentMethods={parentMethods} keys="status" />
					<br />
					<div>
						<b className={text.red}>Lưu ý</b>
						<p className={text.red}>
							* Giữ nguyên định dạng file mẫu xlsx không thay đổi
						</p>
						<p className={text.red}>
							* Chỉ cập thêm công tin đúng theo các cột trong file excel mẫu
						</p>
					</div>
					<DownloadFile keys="status" name="sinh viên" />
				</div>
			</Drawer>
		</div>
			<Drawer
				title="Thêm Sinh Viên"
				placement="left"
				onClose={closeVisible}
				visible={visible}
			>
				<div className={style.upFile}>
					<UpFile parentMethods={parentMethods} keys="status" />
					<br />
					<div>
						<b className={text.red}>Lưu ý</b>
						<p className={text.red}>
							* Giữ nguyên định dạng file mẫu xlsx không thay đổi
						</p>
						<p className={text.red}>
							* Chỉ cập thêm công tin đúng theo các cột trong file excel mẫu
						</p>
					</div>
					<DownloadFile keys="status" name="sinh viên" />
				</div>
			</Drawer>
		</div>
	);
};

Status.propTypes = {
	listStudent: object,
	infoUser: object,
	listManager: array,
	listBusiness: object,
	listMajors: array,
};

export default connect(({ students, semester, manager, business, major, global }) => ({
	listStudent: students.listStudent,
	listAllStudent: students.listAllStudent,
	listSemesters: semester.listSemesters,
	defaultSemester: semester.defaultSemester,
	loading: students.loading,
	listManager: manager.listManager,
	listBusiness: business.listBusiness,
	listMajors: major.listMajor,
	...global,
}))(Status);
