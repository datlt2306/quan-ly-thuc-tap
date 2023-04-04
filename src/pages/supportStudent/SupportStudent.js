import { UploadOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, Radio, Select, Spin, Upload, Space } from 'antd';
import { array, object } from 'prop-types';
import React, { useEffect, useState } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import RegisterInternAPI from '../../API/RegisterInternAPI';
import CountDownCustorm from '../../components/CountDownCustorm';
import { sendMessageDevice } from '../../ultis/PushNotifi';
import { getBusiness } from '../../features/businessSlice/businessSlice';
import { getListMajor } from '../../features/majorSlice/majorSlice';
import { getNarow } from '../../features/narrow';
import { getStudentId } from '../../features/StudentSlice/StudentSlice';
import { getTimeForm } from '../../features/timeDateSlice/timeDateSlice';
import { getLocal } from '../../ultis/storage';
import styles from './SupportStudent.module.css';

const { Option } = Select;
const formItemLayout = {
	labelCol: {
		xs: {
			span: 24,
		},
		sm: {
			span: 8,
		},
	},
	wrapperCol: {
		xs: {
			span: 24,
		},
		sm: {
			span: 16,
		},
	},
};
const tailFormItemLayout = {
	wrapperCol: {
		xs: {
			span: 24,
			offset: 0,
		},
		sm: {
			span: 16,
			offset: 8,
		},
	},
};

const SupportStudent = ({ studentById, listBusiness: { list }, narrow: { listNarrow } }) => {
	const [file, setFile] = useState();
	const [formSupportType, setValue] = useState(1);
	const [spin, setSpin] = useState(true);

	const infoUser = getLocal();
	const dispatch = useDispatch();
	const { time } = useSelector((state) => state.time.formTime);
	const [form] = Form.useForm();

	useEffect(() => {
		dispatch(
			getTimeForm({
				typeNumber: formSupportType,
				semester_id: infoUser?.student?.smester_id,
				campus_id: infoUser?.student?.campus_id,
			})
		).then(() => {
			setSpin(false);
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [formSupportType]);

	//call once to avoid unnessary re-dispatch
	useEffect(() => {
		dispatch(
			getBusiness({
				campus_id: infoUser?.student?.campus_id,
				smester_id: infoUser?.student?.smester_id,
				majors: infoUser?.student?.majors,
				status: 1,
			})
		);
		dispatch(getStudentId(infoUser)).then(() => setSpin(false));
		dispatch(getListMajor());
		dispatch(getNarow());
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dispatch]);

	// Upload Form to google drive
	function saveForm(files, data) {
		const file = files; //the file

		var reader = new FileReader(); //this for convert to Base64
		reader.readAsDataURL(file); //start conversion...
		reader.onload = function (e) {
			//.. once finished..
			var rawLog = reader.result.split(',')[1]; //extract only thee file data part
			var dataSend = {
				dataReq: { data: rawLog, name: file.name, type: file.type },
				fname: 'uploadFilesToGoogleDrive',
			}; //preapre info to send to API
			fetch(
				`https://script.google.com/macros/s/AKfycbzu7yBh9NkX-lnct-mKixNyqtC1c8Las9tGixv42i9o_sMYfCvbTqGhC5Ps8NowC12N/exec
    `, //your AppsScript URL
				{ method: 'POST', body: JSON.stringify(dataSend) }
			) //send to Api
				.then((res) => res.json())
				.then((a) => {
					let newData = { ...data, CV: a.url };
					RegisterInternAPI.upload(newData)
						.then((res) => {
							setSpin(true);
							message.success(res.data.message).then(() => {
								setValue(2);
								setSpin(false);
							});
							sendMessageDevice(
								infoUser,
								'đăng ký form nhờ nhà trường hỗ trợ thành công'
							);
						})
						.catch(async (err) => {
							const dataErr = await err.response.data;
							if (!dataErr.status) {
								message.error(`${dataErr.message}`);
							} else {
								message.error(`${dataErr.message}`);
							}
						});
					setSpin(false);
				})
				.catch((e) => {
					message.success('Có lỗi xảy ra! Vui lòng đăng ký lại');
					form.resetFields();
					setSpin(false);
				}); // Or Error in console
		};
	}

	const props = {
		beforeUpload: (file) => {
			const isPDF = file.type === 'application/pdf';
			if (!isPDF) {
				message.error(`${file.name} không phải là file PDF`);
			}

			return isPDF || Upload.LIST_IGNORE;
		},
		onChange: (info) => {
			setFile(info.file.originFileObj);
		},
	};

	// Change type of support form
	const onSupportTypeChange = (e) => {
		setSpin(true);
		setValue(e.target.value);
	};

	let deadline = time;
	if (studentById?.listTimeForm && studentById?.listTimeForm.length > 0) {
		const checkTimeStudent = studentById?.listTimeForm.find(
			(item) => item.typeNumber === formSupportType
		);
		if (checkTimeStudent) {
			deadline = checkTimeStudent;
		}
	}

	// Nếu trong thời gian đăng ký sẽ hiển thị countdown
	const deadlineCheck =
		deadline &&
		deadline.endTime > new Date().getTime() &&
		deadline.startTime < new Date().getTime();

	// lọc & tìm truyên ngành của sinh viên
	const dataNarrow =
		studentById && studentById?.majors && studentById?.majors?._id && listNarrow.length > 0
			? listNarrow.filter((item) => item?.id_majors?._id === studentById?.majors?._id)
			: [];

	const onFinish = async (values) => {
		setSpin(true);
		try {
			if ((formSupportType === 1 && values.upload === undefined) || values.upload === null) {
				message.error('Vui lòng tải CV định dạng PDF của bạn lên FORM đăng ký');
				setSpin(false);
				return;
			}

			const data = {
				...values,
				support: formSupportType,
				majors: studentById?.majors,
				name: studentById?.name,
				user_code: infoUser?.student?.mssv,
				email: infoUser?.student?.email,
				typeNumber: formSupportType,
				semester_id: infoUser?.student.smester_id,
				checkTime: deadlineCheck,
				campus_id: infoUser?.student?.campus_id,
				_id: infoUser?.student._id,
			};

			if (formSupportType === 0) {
				setSpin(true);
				const resData = await RegisterInternAPI.upload({ ...data, CV: null });
				message.success(resData.data.message);
				sendMessageDevice(infoUser, 'đăng ký form tự tìm nơi thực tập thành công');
				setSpin(false);
			} else if (formSupportType === 1) {
				await saveForm(file, data);
			}
		} catch (error) {
			const dataErr = await error.response.data.message;
			message.error(dataErr);
			setSpin(false);
		}
	};

	const hasNotSubmittedForm = studentById?.statusCheck === 10 || studentById?.statusCheck === 1;

	return (
		<>
			<Spin spinning={spin} size="large">
				<Form
					{...formItemLayout}
					form={form}
					className={styles.form}
					name="register"
					onFinish={onFinish}
					initialValues={{
						residence: ['zhejiang', 'hangzhou', 'xihu'],
						prefix: '86',
					}}
					fields={[
						{
							name: ['support'],
							value: formSupportType,
						},
					]}
					scrollToFirstError
				>
					{hasNotSubmittedForm ? (
						<>
							{deadlineCheck ? (
								<CountDownCustorm time={deadline} />
							) : formSupportType === 1 ? (
								<p style={{ marginBottom: '16px' }}>
									Thời gian đăng ký form hỗ trợ chưa mở, sinh viên vui lòng chờ
									thông báo từ phòng QHDN
								</p>
							) : (
								<p style={{ marginBottom: '16px' }}>
									Thời gian đăng ký form tự tìm nơi thực tập chưa mở, sinh viên
									vui lòng chờ thông báo từ phòng QHDN
								</p>
							)}
							<Form.Item name="support" label="Kiểu đăng ký">
								<Radio.Group onChange={onSupportTypeChange}>
									<Radio value={1}>Nhà trường hỗ trợ</Radio>
									<Radio value={0}>Tự tìm nơi thực tập</Radio>
								</Radio.Group>
							</Form.Item>

							{deadlineCheck && (
								<>
									<Form.Item label="Mã sinh viên">
										<p className={styles.text_form_label}>
											{studentById.mssv.toUpperCase()}
										</p>
									</Form.Item>

									<Form.Item label="Họ và Tên">
										<p className={styles.text_form_label}>{studentById.name}</p>
									</Form.Item>

									<Form.Item
										name="phone"
										label="Số điện thoại"
										rules={[
											{
												required: true,
												min: 10,
												max: 13,
												pattern: new RegExp(
													'(((\\+|)84)|0)(3|5|7|8|9)+([0-9]{8})\\b'
												),
												message: 'Vui lòng nhập đúng số điện thoại',
											},
										]}
									>
										<Input placeholder="Số điện thoại" />
									</Form.Item>

									<Form.Item
										name="address"
										label="Địa chỉ"
										rules={[
											{
												required: true,
												pattern: new RegExp('.*\\S+.*'),
												message: 'Vui lòng nhập địa chỉ',
											},
										]}
									>
										<Input placeholder="Địa chỉ" />
									</Form.Item>

									<Form.Item
										name="narrow"
										label="Chuyên ngành"
										rules={[
											{
												required: true,
												message: 'Vui lòng chọn chuyên ngành',
											},
										]}
									>
										<Select
											placeholder="Chọn chuyên ngành"
											style={{
												width: '50%',
												marginLeft: '20px',
											}}
										>
											{dataNarrow.map((v, i) => (
												<Option key={i} value={v._id}>
													{v.name}
												</Option>
											))}
										</Select>
									</Form.Item>

									{formSupportType === 1 && (
										<Form.Item
											name="business"
											label="Đơn vị thực tập"
											rules={[
												{
													required: true,
													message: 'Vui lòng chọn doanh nghiệp',
												},
											]}
										>
											<Select
												style={{
													width: '50%',
													marginLeft: '20px',
												}}
												placeholder="Chọn doanh nghiệp"
												// onChange={getIdbusiness}
											>
												{list?.map((item) => (
													<Option key={item._id} value={item._id}>
														{item.name + '-' + item.internshipPosition}
													</Option>
												))}
											</Select>
										</Form.Item>
									)}
									<Form.Item
										name="dream"
										label="Vị trí thực tập"
										rules={[
											{
												required: true,
												pattern: new RegExp('.*\\S+.*'),
												message: 'Vui lòng nhập vị trí thực tập',
											},
										]}
									>
										<Input placeholder="VD: Web Back-end, Dựng phim, Thiết kế nội thất" />
									</Form.Item>
									{formSupportType === 1 ? (
										<Form.Item
											valuePropName="upload"
											name="upload"
											label="Upload CV (PDF)"
										>
											<Upload {...props} maxCount={1}>
												<Button
													style={{
														marginLeft: '20px',
													}}
													icon={<UploadOutlined />}
												>
													Click to upload
												</Button>
											</Upload>
										</Form.Item>
									) : (
										<>
											<Form.Item
												name="unit"
												className={styles.form.input}
												label="Đơn vị thực tập"
												rules={[
													{
														required: true,
														message: 'Vui lòng nhập đơn vị thực tập',
													},
												]}
											>
												<Input placeholder="Đơn vị thực tập/Tên doanh nghiệp" />
											</Form.Item>

											<Form.Item
												name="unitAddress"
												label="Địa chỉ thực tập"
												rules={[
													{
														required: true,
														message: 'Vui lòng nhập địa chỉ thực tập',
													},
												]}
											>
												<Input placeholder="Địa chỉ đơn vị thực tập" />
											</Form.Item>
											<Form.Item
												name="taxCode"
												label="Mã số thuế"
												rules={[
													{
														required: true,
														pattern: new RegExp('^[0-9]*$'),
														message: 'Vui lòng nhập Mã số thuế',
													},
												]}
											>
												<Input placeholder="Mã số thuế" />
											</Form.Item>

											<Form.Item
												name="position"
												label="Chức vụ người tiếp nhận"
												rules={[
													{
														required: true,
														message:
															'Vui lòng nhập chức vụ người tiếp nhận sinh viên',
													},
												]}
											>
												<Input placeholder="Chức vụ người tiếp nhận" />
											</Form.Item>

											<Form.Item
												name="numberEnterprise"
												label="Số điện thoại doanh nghiệp"
												rules={[
													{
														required: true,
														min: 10,
														max: 13,
														pattern: new RegExp(
															'^(0|84)(2(0[3-9]|1[0-6|8|9]|2[0-2|5-9]|3[2-9]|4[0-9]|5[1|2|4-9]|6[0-3|9]|7[0-7]|8[0-9]|9[0-4|6|7|9])|3[2-9]|5[5|6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])([0-9]{7})$'
														),
														message:
															'Vui lòng nhập Số điện thoại doanh nghiệp',
													},
												]}
											>
												<Input placeholder="Số điện thoại doanh nghiệp(VD:Giám đốc, Leader, Hr)" />
											</Form.Item>

											<Form.Item
												name="emailEnterprise"
												label="Email người tiếp nhận"
												rules={[
													{
														required: true,
														pattern: new RegExp(
															'[a-z0-9]+@[a-z]+.[a-z]{2,3}'
														),
														message:
															'Vui lòng nhập Email người tiếp nhận',
													},
												]}
											>
												<Input placeholder="Email người tiếp nhận" />
											</Form.Item>
										</>
									)}
									<Form.Item {...tailFormItemLayout}>
										<Button
											className={styles.button2}
											type="primary"
											htmlType="submit"
										>
											{studentById?.statusCheck === 1
												? 'Sửa thông tin'
												: 'Đăng ký'}
										</Button>
									</Form.Item>
								</>
							)}
						</>
					) : studentById.statusCheck === 3 ? (
						'Sinh viên đã trượt kỳ thực tập. Chúc em sẽ cố gắng hơn vào kỳ thực tập sau'
					) : studentById.statusCheck === 9 ? (
						'Chúc mừng sinh viên đã hoàn thành kỳ thực tập'
					) : (
						'Đăng ký thông tin thành công'
					)}
				</Form>
			</Spin>
		</>
	);
};

SupportStudent.propTypes = {
	studentById: object,
	infoUser: object,
	business: object,
	narrow: object || array,
};
export default connect(
	({
		auth: { infoUser },
		students: { studentById },
		business: { listBusiness },
		narrow,
		global,
	}) => ({
		studentById,
		infoUser,
		listBusiness,
		narrow,
		isMobile: global.isMobile,
	})
)(SupportStudent);
