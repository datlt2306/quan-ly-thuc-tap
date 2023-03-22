import { Col, message, Row, Table } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { bool, object } from 'prop-types';
import { stringify } from 'qs';
import React, { useEffect, useState } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { axiosClient } from '../../API/Link';
import RequestToManager from '../../components/RequestToManager';
import { getBusinessStudent } from '../../features/businessSlice/businessSlice';
import { getStudentId } from '../../features/StudentSlice/StudentSlice';
import { setTimeForm } from '../../features/timeDateSlice/timeDateSlice';
import { optionStatus } from '../../utils/selectOption';
import { getLocal } from '../../utils/storage';
import styles from './index.module.css';
const columns = [
	{
		title: 'Mã',
		dataIndex: 'code_request',
	},
	{
		title: 'Tên doanh nghiệp',
		dataIndex: 'name',
	},
	{
		title: 'Vị trí TT',
		dataIndex: 'internshipPosition',
	},
	{
		title: 'Số lượng',
		dataIndex: 'amount',
	},
	{
		title: 'Địa chỉ',
		dataIndex: 'address',
	},
	{
		title: 'Yêu cầu',
		dataIndex: 'request',
	},
	{
		title: 'Chi tiết',
		dataIndex: 'description',
	},
];
function InfoStudent({ studentById, listBusiness: { list, total }, loading }) {
	const infoUser = getLocal();
	const navigate = useNavigate();
	const isRegister = studentById?.support;
	const statusForm = studentById?.statusCheck;
	const [page, setPage] = useState({
		page: 1,
		limit: 5,
		campus_id: infoUser?.student?.campus_id,
		smester_id: infoUser?.student?.smester_id,
		majors: infoUser?.student?.majors,
	});
	const [dateNow] = useState(Date.now());
	const { time } = useSelector((state) => state.time.formTime);
	const dispatch = useDispatch();
	useEffect(() => {
		const string = `typeNumber=${4}&semester_id=${infoUser?.student?.smester_id}&campus_id=${
			infoUser?.student?.campus_id
		}`;
		const url = `/settime/find-one?${string}`;
		axiosClient
			.get(url, {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${infoUser?.accessToken}`,
				},
			})
			.then((res) => {
				if (res.status === 200) {
					dispatch(setTimeForm(res.data.time));
				}
			})
			.catch((err) => {
				if (err.response.status === 401) {
					message.error(err.response.data.msg);
					navigate('/login');
				}
			});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		dispatch(getStudentId(infoUser));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	useEffect(() => {
		const url = `/business?${stringify(page)}`;
		axiosClient
			.get(url, {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${infoUser.accessToken}`,
				},
			})
			.then((res) => {
				if (res.status === 200) {
					dispatch(getBusinessStudent(res.data));
				}
			})
			.catch((err) => {
				if (err.response.status === 401) {
					message.error(err.response.data.msg);
					navigate('/login');
				} else {
					message.error(err.response.data.msg);
				}
			});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [page]);

	return (
		<div>
			<Row>
				<Col sm={{ span: 12 }} md={{ span: 24 }} className=" border-end p-3">
					<div className={styles.title}>
						<h4>Thông tin đăng ký</h4>
						<h4>Các form đã nộp</h4>
					</div>
					<div className={styles.top}>
						<div className="border-end mt-3 pt-2">
							<p>Họ và tên : {studentById?.name}</p>
							<p>Ngành : {studentById?.majors?.name}</p>
							<p>Khóa học : {studentById?.course}</p>
							<p>Email : {studentById?.email}</p>
							<p>
								Lựa chọn :{' '}
								{isRegister === 0
									? 'Tự tìm nơi thực tập'
									: '' || isRegister === 1
									? 'Nhận hỗ trợ từ nhà trường'
									: ''}
							</p>
							<p>
								{' '}
								Công ty đã chọn:{' '}
								{studentById.support === 1
									? studentById?.business?.name
									: studentById?.nameCompany}{' '}
							</p>
							<p>
								Trạng thái SV :{' '}
								{/* eslint-disable-next-line array-callback-return */}
								<span style={{ color: '#F99011' }}>
									{optionStatus.map((index) => {
										if (index.value === statusForm) {
											return index.title;
										}
									})}{' '}
								</span>
							</p>
						</div>
						<div className=" pt-2">
							<RequestToManager studentById={studentById} />
						</div>
					</div>
				</Col>
				<Col sm={{ span: 24 }} md={{ span: 24 }} className="p-3">
					<h4>Thông tin tuyển dụng</h4>
					{time?.startTime <= dateNow && dateNow <= time.endTime ? (
						<div>
							<Table
								loading={loading}
								rowKey="_id"
								columns={columns}
								dataSource={list}
								scroll={{ x: 'calc(1000px + 50%)' }}
								pagination={{
									pageSize: page.limit,
									total: total,
									onChange: (pages, pageSize) => {
										setPage({
											...page,
											page: pages,
											limit: pageSize,
											campus_id: infoUser.student.cumpus,
										});
									},
								}}
							/>
						</div>
					) : (
						<span>Chưa có thông tin công ty thực tập.</span>
					)}
				</Col>
			</Row>
			<Row>
				<Col span={24} className=" mt-2 border-top ms-2">
					<h4 className="mt-2">Ghi chú</h4>
					<TextArea
						disabled={true}
						rows={10}
						value={studentById.note}
						className="text-dark"
					></TextArea>
				</Col>
			</Row>
		</div>
	);
}
InfoStudent.propTypes = {
	studentById: object,
	infoUser: object,
	listBusiness: object,
	loading: bool,
};

export default connect(({ students: { studentById }, business: { listBusiness, loading } }) => ({
	studentById,
	listBusiness,
	loading,
}))(InfoStudent);
