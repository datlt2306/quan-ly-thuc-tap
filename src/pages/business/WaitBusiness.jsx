import { Button, Col, Drawer, Row, Select, Table, message } from 'antd';
import { array, bool, object } from 'prop-types';
import React, { useEffect, useState } from 'react';
// import "antd/dist/antd.css";
import { connect, useDispatch } from 'react-redux';
import UpFile from '../../components/ExcelDocument/UpFile';
import text from '../../common/styles/downFile.module.css';
import { getBusiness, updateWaitBusiness } from '../../features/businessSlice/businessSlice';
import { getListMajor } from '../../features/majorSlice/majorSlice';
import { defaultTime, getSemesters } from '../../features/semesters/semestersSlice';
import styles from './bussiness.module.css';
import FormBusiness from './FormBusiness';
import DownloadFile from '../../components/ExcelDocument/DownloadFile';

const { Option } = Select;
const { Column } = Table;
const WaitBusiness = ({
	infoUser,
	listSemesters,
	defaultSemester,
	listMajors,
	listBusiness,
	isMobile,
}) => {
	const dispatch = useDispatch();
	const [selectedRowKeys, setSelectedRowKeys] = useState([]);
	const [majorImport, setMajorImport] = React.useState('');
	const [idSemester, setIdSemester] = useState('');
	const [paramsUpdate, setParamUpdate] = useState({});
	const [loading, setLoading] = useState(false);
	const [visibleImport, setVisibleImport] = useState(false);
	const [visible, setVisible] = useState(false);

	const [page, setPage] = useState({
		page: 1,
		limit: 20,
		campus_id: infoUser.manager.campus_id,
		status: 0,
	});
	useEffect(() => {
		dispatch(getSemesters({ campus_id: infoUser.manager?.campus_id }));
		dispatch(getListMajor());
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [page]);
	useEffect(() => {
		dispatch(
			defaultTime({
				filter: { campus_id: infoUser.manager.campus_id },
				callback: (res) => {
					if (res.status === 'ok') {
						const data = {
							...page,
							campus_id: infoUser.manager.campus_id,
						};
						dispatch(getBusiness(data));
					}
				},
			})
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [page, selectedRowKeys]);

	const columns = [
		{
			title: 'Mã',
			dataIndex: 'code_request',
			width: 100,
			fixed: 'left',
		},
		{
			title: 'Tên doanh nghiệp',
			dataIndex: 'name',
			width: 150,
			fixed: 'left',
		},
		{
			title: 'Vị trí thực tập',
			dataIndex: 'internshipPosition',
			width: 200,
		},
		{
			title: 'Số lượng',
			dataIndex: 'amount',
			width: 160,
		},
		{
			title: 'Địa chỉ thực tập',
			dataIndex: 'address',
			width: 100,
		},
		{
			title: 'Ngành',
			dataIndex: 'majors',
			width: 180,
			render: (val) => val?.name,
		},
		{
			title: 'Yêu cầu',
			dataIndex: 'request',
			width: 400,
		},
		{
			title: 'Chi tiết',
			dataIndex: 'description',
			width: 400,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'status',
			width: 100,
			render: (val) => (val === 0 ? 'Chờ xác nhận' : ''),
		},
	];

	const closeVisibleImport = () => {
		setPage({
			...page,
		});
		setVisibleImport(false);
	};

	const closeVisible = () => {
		setPage({
			...page,
		});
		setVisible(false);
	};

	const start = () => {
		if (idSemester.length === 0) {
			message.error('Vui lòng chọn kỳ học');
		} else {
			setLoading(true); // ajax request after empty completing
			dispatch(
				updateWaitBusiness({
					listIdBusiness: selectedRowKeys,
					smester_id: idSemester,
				})
			);
			setTimeout(() => {
				setSelectedRowKeys([]);
				setLoading(false);
			}, 1000);
			message.success('Thành công');
		}
	};

	const end = () => {
		setTimeout(() => {
			setSelectedRowKeys([]);
			setLoading(false);
		});
	};
	const onSelectChange = (newSelectedRowKeys) => {
		setSelectedRowKeys(newSelectedRowKeys);
	};

	const rowSelection = {
		selectedRowKeys,
		onChange: onSelectChange,
	};
	const hasSelected = selectedRowKeys.length > 0;
	return (
		<div className={styles.status}>
			<Row style={isMobile ? {} : { alignItems: 'center', justifyContent: 'space-between' }}>
				<div className={styles.header_flex}>
					<Col xs={24} sm={24} md={24} lg={8} span={8}>
						<h2
							style={{
								color: 'black',
							}}
							className="mb-2"
						>
							Doanh nghiệp đăng ký
						</h2>
					</Col>
				</div>
				<Col
					style={{ display: 'flex', alignItems: 'center' }}
					xs={24}
					sm={24}
					md={24}
					lg={8}
					span={8}
				>
					<p style={{ whiteSpace: 'nowrap', paddingRight: 20, margin: 0 }}>Học kỳ:</p>
					<Select
						className="filter-status"
						placeholder="Chọn kỳ"
						onChange={(val) => {
							setIdSemester({ smester_id: val });
						}}
						style={{ width: '30%' }}
						defaultValue=""
					>
						<Option value="">Chọn kỳ</Option>
						{listSemesters &&
							listSemesters?.map((item, index) => (
								<Option value={item._id} key={index}>
									{item.name}
								</Option>
							))}
					</Select>
				</Col>
				<Col xs={24} sm={24} md={24} lg={8} span={8}>
					<>
						{hasSelected ? (
							<div style={{ display: 'flex', alignItems: 'center' }}>
								<Button
									type="primary"
									style={{
										marginRight: 8,
									}}
									onClick={start}
									disabled={!hasSelected}
									loading={loading}
								>
									Xác nhận
								</Button>
								<Button
									type="danger"
									onClick={end}
									disabled={!hasSelected}
									loading={loading}
								>
									Huỷ
								</Button>
								<span
									style={{
										marginLeft: 8,
									}}
								>
									{hasSelected
										? `Đã chọn ${selectedRowKeys.length} doanh nghiệp`
										: ''}
								</span>
							</div>
						) : (
							''
						)}
					</>
				</Col>
			</Row>
			{!isMobile ? (
				<>
					<Table
						pagination={{
							pageSize: page.limit,
							total: listBusiness?.total,
							onChange: (pages, pageSize) => {
								setPage({
									...page,
									page: pages,
									limit: pageSize,
								});
							},
						}}
						rowSelection={rowSelection}
						scroll={{ x: 'calc(900px + 50%)' }}
						rowKey="_id"
						loading={loading}
						columns={columns}
						dataSource={listBusiness?.list}
					/>
				</>
			) : (
				<Table
					pagination={{
						pageSize: page.limit,
						total: listBusiness?.total,
						onChange: (pages, pageSize) => {
							setPage({
								...page,
								page: pages,
								limit: pageSize,
							});
						},
					}}
					rowSelection={rowSelection}
					rowKey="_id"
					loading={loading}
					dataSource={listBusiness?.list}
					expandable={{
						expandedRowRender: (record) => (
							<div style={{ marginTop: '10px' }}>
								{window.innerWidth < 1023 && window.innerWidth > 739 ? (
									''
								) : (
									<>
										<p className="list-detail">Email: {record.email}</p>
										<br />
									</>
								)}
								<p className="list-detail">Điện thoại: {record.phoneNumber}</p>
								<br />
								<p className="list-detail">Ngành: {record.majors}</p>
								<br />
							</div>
						),
					}}
				>
					<Column title="Mssv" dataIndex="mssv" key="_id" />
					<Column title="Họ và Tên" dataIndex="name" key="_id" />
					{window.innerWidth > 739 && window.innerWidth < 1023 && (
						<Column title="Email" dataIndex="email" key="_id" />
					)}
				</Table>
			)}

			<div>
				<Drawer
					title="Import Danh Sách Doanh Nghiệp"
					placement="left"
					onClose={closeVisibleImport}
					visible={visibleImport}
				>
					<Row>
						<Col span={6}>
							<p>Kỳ:</p>
						</Col>
						<Col span={18}>
							<Select
								className="filter-status"
								placeholder="Chọn kỳ"
								onChange={(val) =>
									setPage({
										...page,
										smester_id: val,
									})
								}
								defaultValue={
									defaultSemester && defaultSemester?._id
										? defaultSemester?._id
										: ''
								}
								style={{
									width: '100%',
								}}
							>
								{!defaultSemester?._id && (
									<Option value={''} disabled>
										Chọn kỳ
									</Option>
								)}
								{listSemesters &&
									listSemesters?.map((item, index) => (
										<Option value={item._id} key={index}>
											{item.name}
										</Option>
									))}
							</Select>
						</Col>
					</Row>

					<Row style={{ alignItems: 'center', marginTop: 20 }}>
						<Col span={6}>
							<p>Ngành:</p>
						</Col>
						<Col span={18}>
							<Select
								className="filter-status"
								onChange={(val) => setMajorImport(val)}
								style={{
									width: '100%',
								}}
								placeholder="Chọn ngành"
							>
								{listMajors &&
									listMajors?.map((item, index) => (
										<Option value={item._id} key={index}>
											{item.name}
										</Option>
									))}
							</Select>
						</Col>
					</Row>
					<div className={styles.boxTitle}>
						<UpFile
							keys="business"
							parentMethods={{
								...page,
								majorImport,
								closeVisible,
							}}
						/>
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
						<DownloadFile keys="business" name="doanh nghiệp" />
					</div>
				</Drawer>
			</div>
		</div>
	);
};

WaitBusiness.propTypes = {
	infoUser: object,
	listSmester: array,
	loading: bool,
	listMajors: array,
};

export default connect(({ auth: { infoUser }, semester, major, business, global }) => ({
	infoUser,
	listSemesters: semester.listSemesters,
	semester,
	defaultSemester: semester.defaultSemester,
	listMajors: major.listMajor,
	listBusiness: business.listBusiness,
	loading: business.loading,
	isMobile: global.isMobile,
}))(WaitBusiness);
