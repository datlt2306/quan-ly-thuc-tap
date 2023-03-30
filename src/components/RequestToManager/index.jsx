import { EyeOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, Input, message, Modal, Row } from 'antd';
import React from 'react';
import { useDispatch } from 'react-redux';
import { sendRequest } from '../../features/requestStudentSlice/requestStudentSlice';
import styles from './index.module.css';

const type = ['narrow', 'form', 'report'];
const RequestToManager = (props) => {
	const [form] = Form.useForm();
	const { studentById } = props;
	const [visible, setVisible] = React.useState(false);
	const [data, setData] = React.useState({});
	const [text, setText] = React.useState(false);
	const dispatch = useDispatch();
	const getListForm = () => {
		const {
			_id,
			address,
			dream,
			email,
			majors,
			name,
			phoneNumber,
			statusCheck,
			support,
			nameCompany,
			addressCompany,
			taxCode,
			position,
			phoneNumberCompany,
			emailEnterprise,
			business,
			narrow,
			mssv,
			internshipTime,
			endInternShipTime,
			resultScore,
			attitudePoint,
		} = studentById;
		let valueForm = [];
		type.forEach((res) => {
			if (studentById[res]) {
				return valueForm.push({
					type: res,
					link: res === 'narrow' ? studentById['CV'] : studentById[res],
					address,
					business,
					dream,
					email,
					majors,
					name,
					_id,
					phoneNumber,
					statusCheck,
					support,
					nameCompany,
					addressCompany,
					taxCode,
					position,
					phoneNumberCompany,
					emailEnterprise,
					narrow,
					mssv,
					internshipTime,
					resultScore,
					endInternShipTime,
					attitudePoint,
				});
			}
		}, []);
		return valueForm;
	};
	const getTitle = (type) => {
		if (type === 'narrow') {
			return 'Form Đăng ký thực tập';
		}
		if (type === 'form') {
			return 'Form Biên Bản';
		}
		if (type === 'report') {
			return 'Form Báo Cáo';
		}
		return '';
	};
	const viewCv = () => {
		return (
			<>
				<Row>
					<Col span={12}>
						<p>Kiểu đăng ký :</p>
						<p>Mã sinh viên :</p>
						<p>Họ tên :</p>
						<p>Email:</p>
						<p>Số diện thoại:</p>
						<p>Địa chỉ:</p>
						<p>Chuyên ngành:</p>
						<p>Vị trí thực tập:</p>
						{data?.support === 1 && (
							<>
								<p>Đơn vị thực tập:</p>
								<p>CV</p>
							</>
						)}
						{data?.support === 0 && (
							<>
								<p>Đơn vị thực tập:</p>
								<p>Địa chỉ thực tập:</p>
								<p>Mã số thuế: </p>
								<p>Chức vụ người tiếp nhận</p>
								<p>SĐT doanh nghiệp</p>
								<p>Email người tiếpn nhận</p>
							</>
						)}
					</Col>
					<Col span={12}>
						<p>{data?.support === 1 ? 'Hỗ trợ' : 'Tự tìm'}</p>
						<p>{data?.mssv}</p>
						<p>{data?.name}</p>
						<p>{data?.email}</p>
						<p>{data?.phoneNumber}</p>
						<p>{data?.address}</p>
						<p>{data?.narrow?.name}</p>
						<p>{data?.dream}</p>
						{data?.support === 1 && (
							<>
								<p>{data?.business?.name}</p>
								{Object.keys(data).length !== 0 && (
									<p>
										<Button
											icon={<EyeOutlined />}
											type="link"
											onClick={() => window.open(data.link)}
										/>
									</p>
								)}
							</>
						)}
						{data.support === 0 && (
							<>
								<p>{data?.nameCompany}</p>
								<p>{data?.addressCompany}</p>
								<p>{data?.taxCode}</p>
								<p>{data?.position}</p>
								<p>{data?.phoneNumberCompany}</p>
								<p>{data?.emailEnterprise}</p>
							</>
						)}
					</Col>
				</Row>
				<div style={{}} className={styles.button}>
					{text && (
						<Form
							name="basic"
							initialValues={{ remember: true }}
							onFinish={(val) =>
								onFinish({
									...val,
									type: data?.type,
									userId: data?._id,
								})
							}
							form={form}
							// onFinishFailed={onFinishFailed}
							autoComplete="off"
							style={{
								width: '100%',
							}}
						>
							<Form.Item
								name="description"
								rules={[{ required: true, message: 'Please input your username!' }]}
							>
								<Input.TextArea />
							</Form.Item>

							<Form.Item>
								<div
									style={{
										width: '50%',
										justifyContent: 'space-between',
										display: 'flex',
										margin: 'auto',
									}}
								>
									<Button
										type="primary"
										danger
										onClick={() => {
											form.resetFields();
											setText(false);
										}}
									>
										Huỷ
									</Button>
									<Button type="primary" htmlType="submit">
										Gửi
									</Button>
								</div>
							</Form.Item>
						</Form>
					)}
				</div>
				{!text && (
					<Button type="primary" danger onClick={() => setText(true)}>
						Gửi yêu cầu hỗ trợ
					</Button>
				)}
			</>
		);
	};
	const viewForm = () => {
		return (
			<Row>
				<Col span={12}>
					<p>Kiểu đăng ký :</p>
					<p>Mã sinh viên :</p>
					<p>Họ tên :</p>
					<p>Email:</p>
					<p>Số diện thoại:</p>
					<p>Địa chỉ:</p>
					<p>Chuyên ngành:</p>
					<p>Vị trí thực tập:</p>
					<p>Ngày bắt đầu: </p>
					<p>Biên bản thực tập</p>
				</Col>
				<Col span={12}>
					<p>{data?.support === 1 ? 'Hỗ trợ' : 'Tự tìm'}</p>
					<p>{data?.mssv}</p>
					<p>{data?.name}</p>
					<p>{data?.email}</p>
					<p>{data?.phoneNumber}</p>
					<p>{data?.address}</p>
					<p>{data?.narrow?.name}</p>
					<p>{data?.dream}</p>
					<p>{data?.internshipTime}</p>
					{Object.keys(data).length !== 0 && (
						<p>
							<Button
								icon={<EyeOutlined />}
								type="link"
								onClick={() => window.open(data.link)}
							/>
						</p>
					)}
				</Col>
			</Row>
		);
	};
	const viewReport = () => {
		return (
			<Row>
				<Col span={12}>
					<p>Họ tên :</p>
					<p>Tên công ty:</p>
					<p>Điểm kết quả:</p>
					<p>Điểm thái độ:</p>
					<p>Thời gian bắt đầu:</p>
					<p>Thời gian kết thúc:</p>
					<p>Báo Cáo:</p>
				</Col>
				<Col span={12}>
					<p>{data?.name}</p>
					<p>{data?.support === 1 ? data?.business?.name : data?.nameCompany}</p>
					<p>{data?.resultScore}</p>
					<p>{data?.attitudePoint}</p>
					<p>{data?.internshipTime}</p>
					<p>{data?.endInternShipTime}</p>

					{Object.keys(data).length !== 0 && (
						<Button
							icon={<EyeOutlined />}
							type="link"
							onClick={() => window.open(data.link)}
						/>
					)}
				</Col>
			</Row>
		);
	};
	const onFinish = (val) => {
		dispatch(
			sendRequest({
				val: val,
				callback,
			})
		);
	};
	const callback = (val) => {
		if (val.success) {
			message.success(val.message);
		} else {
			message.error(val.message);
		}
		form.resetFields();
		setVisible(false);
	};
	return (
		<div>
			<Row
				style={{
					margin: '0 20px',
				}}
				gutter={16}
			>
				{getListForm().length !== 0 &&
					getListForm().map((res, index) => {
						return (
							<Col key={index} span={8}>
								<Card
									hoverable
									style={{
										height: '100px',
										border: '1px solid',
									}}
									title={false}
									bordered={false}
									onClick={() => {
										setData(res);
										setVisible(true);
									}}
								>
									{getTitle(res.type)}
								</Card>
							</Col>
						);
					})}
			</Row>
			<Modal
				title={getTitle(data?.type)}
				footer={false}
				onOk={false}
				visible={visible}
				onCancel={() => {
					form.resetFields();
					setVisible(false);
				}}
			>
				{data.type === 'narrow' && viewCv()}
				{data.type === 'form' && viewForm()}
				{data.type === 'report' && viewReport()}
			</Modal>
		</div>
	);
};

export default RequestToManager;
