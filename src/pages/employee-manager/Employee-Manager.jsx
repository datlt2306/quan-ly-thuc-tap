/* eslint-disable jsx-a11y/anchor-is-valid */
import { Button, Table, message, Space, Form, Drawer } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import {
	createManager,
	fetchManager,
	removeManager,
	updateManager,
} from '../../features/managerSlice/managerSlice';
import { getListCumpus } from '../../features/cumpusSlice/cumpusSlice';
import FormManager from './formManager';
import _ from 'lodash';
import { getLocal } from '../../utils/storage';
const EmployeeManager = ({ listManager = [], listCumpus, loading }) => {
	const dispatch = useDispatch();
	const [visible, setVisible] = useState(false);
	const [title, setTitle] = useState('');
	const [current, setCurrent] = useState({});
	const [form] = Form.useForm();

	const columns = [
		{
			title: 'Tên nhân viên',
			dataIndex: 'name',
			width: 100,
		},
		{
			title: 'Email nhân viên',
			dataIndex: 'email',
			width: 100,
		},
		{
			title: 'Cơ sở đang làm việc',
			dataIndex: ['campus_id', 'name'],
			width: 100,
		},
		{
			title: 'Quyền hạn quản lý',
			dataIndex: 'role',
			width: 100,
			render: (val) => (val === 1 ? 'Cán Bộ' : 'Quản Lí'),
		},
		{
			title: 'Action',
			key: 'action',
			width: 100,
			render: (text, record) => (
				<Space size="middle">
					<Button
						type="primary"
						onClick={() => handleModal('edit', record)}
						disabled={isDisbledAction(record)}
					>
						Sửa
					</Button>

					<Button
						disabled={isDisbledAction(record)}
						type="primary"
						danger
						onClick={() =>
							dispatch(
								removeManager({
									id: record._id,
									callback: cbMessage,
								})
							)
						}
					>
						{' '}
						Xoá{' '}
					</Button>
				</Space>
			),
		},
	];
	useEffect(() => {
		dispatch(fetchManager());
		dispatch(getListCumpus());
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	const handleModal = (val, record) => {
		switch (val) {
			case 'add':
				setTitle('Thêm');
				setVisible(true);
				break;
			case 'edit':
				setTitle('Sửa');
				setCurrent(record);
				form.setFieldsValue({
					...record,
					campus_id: record.campus_id._id,
				});
				setVisible(true);
				break;
			default:
				break;
		}
	};

	const handleAdd = (val) => {
		dispatch(
			createManager({
				dataForm: val,
				callback: cbMessage,
			})
		);
		form.resetFields();
		setVisible(false);
	};

	const handleUpdate = (val) => {
		dispatch(
			updateManager({
				dataForm: val,
				callback: cbMessage,
			})
		);
		setCurrent({});
		form.resetFields();
		setVisible(false);
	};

	const cbMessage = (val) => {
		dispatch(fetchManager());
		if (val.success) {
			message.success(val.message);
			return;
		} else {
			message.error(val.message);
			return;
		}
	};

	const parentMethods = {
		onFinish: _.size(current) ? handleUpdate : handleAdd,
		forms: form,
		listCumpus: listCumpus,
		current: current,
	};

	const isDisbledAction = (record) => {
		const { campus_id, role, _id } = getLocal().manager;
		if (campus_id === record?.campus_id?._id && role >= record?.role && _id !== record?._id) {
			return false;
		}
		return true;
	};
	return (
		<>
			<div className="status">
				<div className="flex-header">
					<h4>Quản lý nhân viên</h4>
					<div style={{ display: 'flex' }}>
						<Button
							onClick={() => handleModal('add')}
							variant="warning"
							style={{ marginRight: 10, height: 36 }}
						>
							Thêm
						</Button>
					</div>
				</div>
				<Table loading={loading} dataSource={listManager} columns={columns} />

				<Drawer
					placement="left"
					visible={visible}
					onClose={() => {
						form.resetFields();
						setCurrent({});
						setVisible(false);
					}}
					destroyOnClose
					title={title}
				>
					<FormManager {...parentMethods} />
				</Drawer>
			</div>
		</>
	);
};

export default connect(({ manager, cumpus }) => ({
	listManager: manager.listManager,
	listCumpus: cumpus.listCumpus,
	loading: manager.loading,
}))(EmployeeManager);
