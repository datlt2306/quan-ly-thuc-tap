import { UploadOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as XLSX from 'xlsx';
import { insertBusiness } from '../../features/businessSlice/businessSlice';
import { insertStudent } from '../../features/StudentSlice/StudentSlice';
import styles from '../../common/styles/upfile.css';
import { businessValidationSchema, statusValidationSchema } from './Validate';
import _ from 'lodash';

const UpFile = ({ keys, parentMethods }) => {
	const { majorImport, smester_id, campus_id, closeVisible } = parentMethods;
	const [dataNew, setDataNew] = useState([]);
	const [nameFile, setNameFile] = useState('');
	const dispatch = useDispatch();

	const {
		infoUser: { manager },
	} = useSelector((state) => state.auth);

	const { loading } = useSelector((state) => state.students);

	const importData = (e) => {
		if (!smester_id.length) {
			refInput.current.value = '';
			message.warning('Vui lòng chọn kỳ');
		} else if (majorImport.length > 0) {
			const file = e.target.files[0];

			if (file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
				message.error('Vui lòng chọn đúng định dạng file xlsx');
				return;
			}

			setNameFile(file.name);
			const reader = new FileReader();
			const rABS = !!reader.readAsBinaryString;

			reader.onload = (event) => {
				const bstr = event.target.result;
				const wb = XLSX.read(bstr, { type: rABS ? 'binary' : 'array' });
				/* Get first worksheet */
				const wsname = wb.SheetNames[0];
				const ws = wb.Sheets[wsname];
				/* Convert array of arrays */
				const fileData = XLSX.utils.sheet_to_json(ws, { header: 1 });

				// Convert array -> object, lấy headers làm key.
				const headers = fileData[0].length ? fileData[0] : fileData[1];
				const mappedFileData = _.tail(fileData).map((nestedArray) =>
					_.zipObject(headers, nestedArray)
				);

				let categorizedFileData = [];

				mappedFileData
					.filter((item) => Object.keys(item).length > 0 && item.STT !== 'STT')
					.forEach((item) => {
						if (!manager) return;

						switch (keys) {
							case 'status':
								if (item['MSSV'] !== undefined) {
									const {
										MSSV: mssv,
										'Họ tên': name,
										'Khóa nhập học': course,
										'Trạng thái': status,
										Email: email,
										'bổ sung': supplement,
									} = item;
									const newObject = {
										mssv,
										name,
										course,
										status,
										majors: majorImport,
										email,
										supplement,
									};
									categorizedFileData.push(newObject);
								}
								break;
							case 'business':
								if (item['Tên Doanh nghiệp'] !== undefined) {
									const {
										'Tên Doanh nghiệp': name,
										'Vị trí tuyển dụng': internshipPosition,
										'Số lượng': amount,
										'Địa chỉ doanh nghiệp': address,
										'Mô tả': description,
										'Yêu cầu ứng viên': request,
										'Mã tuyển dụng': code_request,
										'Quyền lợi': benefish,
									} = item;
									const newObject = {
										name,
										internshipPosition,
										amount,
										address,
										majors: majorImport,
										description,
										request,
										code_request,
										benefish,
									};
									categorizedFileData.push(newObject);
								}
								break;
							default:
								break;
						}
					});

				//validate
				Promise.all(
					categorizedFileData.map((data) => {
						if (keys === 'status') {
							return statusValidationSchema.validate(data);
						} else if (keys === 'business') {
							return businessValidationSchema.validate(data);
						}
					})
				)
					.then((validatedObjects) => {
						categorizedFileData = validatedObjects;
					})
					.catch((err) => {
						message.error(err.message);
						return;
					});

				setDataNew(categorizedFileData);
				refInput.current.value = '';
			};
			reader.readAsBinaryString(file);
		} else {
			refInput.current.value = '';
			message.warning('Vui lòng chọn ngành');
		}
	};

	const submitSave = () => {
		const dataUpload = {
			data: dataNew,
			majors: majorImport,
		};
		switch (keys) {
			case 'status':
				if (majorImport.length > 0) {
					dispatch(insertStudent(dataUpload)).then((res) => {
						notifications(res.payload);
						setDataNew([]);
						setNameFile('');
						closeVisible();
					});
				}

				break;
			case 'business':
				dispatch(insertBusiness(dataNew)).then((res) => {
					notifications(res.payload);
					setDataNew([]);
					setNameFile('');
					closeVisible();
				});
				break;
			default:
				break;
		}
	};
	const notifications = (payload) => {
		if (loading === false && payload !== undefined) {
			message.success('Thành công');
		}
	};
	const submitCole = () => {
		setDataNew([]);
		setNameFile();
		refInput.current.value = '';
	};

	const refInput = useRef();

	return (
		<div className={styles.header}>
			<Button style={{ width: '95%' }}>
				<label htmlFor="up-file">
					{!nameFile && dataNew.length === 0 && (
						<div className={styles.buttonUpfile}>
							<UploadOutlined className={styles.icon} /> Tải file excel
						</div>
					)}

					{nameFile && dataNew.length > 0 && (
						<span className={styles.spanUploadName}>{nameFile}</span>
					)}
				</label>
			</Button>
			<input type="file" ref={refInput} onChange={(e) => importData(e)} id="up-file" />
			{dataNew.length > 0 && (
				<div
					className="mt-2 d-flex align-items-center justify-content-between"
					style={{ width: '95%' }}
				>
					<Button style={{ width: '45%' }} onClick={() => submitSave()} type="primary">
						Lưu
					</Button>
					<Button style={{ width: '45%' }} onClick={() => submitCole()} type="danger">
						Huỷ
					</Button>
				</div>
			)}
		</div>
	);
};

export default UpFile;
