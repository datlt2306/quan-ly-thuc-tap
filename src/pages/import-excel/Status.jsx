import { EyeOutlined } from '@ant-design/icons';
import { Button, Col, Drawer, Input, message, Row, Select, Table } from 'antd';
import Column from 'antd/lib/table/Column';
import * as FileSaver from 'file-saver';
import { omit } from 'lodash';
import { array, object } from 'prop-types';
import { stringify } from 'qs';
import { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { axiosClient } from '../../API/Link';
import SemestersAPI from '../../API/SemestersAPI';
import style from '../../common/styles/status.module.css';
import UpFile from '../../components/ExcelDocument/UpFile';
import StudentDetail from '../../components/studentDetail/StudentDetail';
import { getListMajor } from '../../features/majorSlice/majorSlice';
import { fetchManager } from '../../features/managerSlice/managerSlice';
import { updateReviewerListStudent } from '../../features/reviewerStudent/reviewerSlice';
import { getSemesters } from '../../features/semesters/semestersSlice';
import {
  getAllStudent,
  getListStudentReducer,
  resetStudentAction,
} from '../../features/StudentSlice/StudentSlice';
import { filterStatuss } from '../../ultis/selectOption';
import { getLocal } from '../../ultis/storage';
const { Option } = Select;
const Status = ({
  listStudent: { list, total },
  listAllStudent,
  loading,
  listSemesters,
  defaultSemester,
  listManager,
  listBusiness,
  listMajors,
  isMobile,
}) => {
  const infoUser = getLocal();

  const [studentdetail, setStudentDetail] = useState('');
  const [modal, setModal] = useState(false);
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();
  let navigate = useNavigate();
  const [chooseIdStudent, setChooseIdStudent] = useState([]);
  const [listIdStudent, setListIdStudent] = useState([]);
  const [page, setPage] = useState({
    page: 1,
    limit: 20,
    campus_id:
      infoUser && infoUser.manager && infoUser.manager.campus_id ? infoUser.manager.campus_id : '',
    smester_id: defaultSemester?._id ? defaultSemester?._id : '',
  });
  const [majorImport, setMajorImport] = useState('');
  const [filter, setFiler] = useState();
  const onShowDetail = (mssv, key) => {
    setStudentDetail(key);
    setModal(true);
  };

  const onCloseModal = () => {
    setModal(false);
    getListStudent();
  };

  const resetStudent = async (val, key) => {
    if (window.confirm('B???n c?? ch???c ch???n mu???n reset tr???ng th??i sinh vi??n ?')) {
      try {
        await dispatch(resetStudentAction(val?._id));
        getListStudent();
        message.success('Th??nh c??ng');
      } catch (error) {
        console.log(error);
      }
    }
  };

  const getListStudent = async () => {
    if (page?.smester_id && page?.smester_id.length > 0) {
      const url = `/student?${stringify({
        ...page,
        ...filter,
        campus_id:
          infoUser && infoUser.manager && infoUser.manager.campus_id
            ? infoUser.manager.campus_id
            : '',
      })}`;
      axiosClient
        .get(url, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${infoUser.accessToken}`,
          },
        })
        .then((res) => {
          if (res.status === 200) {
            dispatch(getListStudentReducer(res.data));
          }
        })
        .catch((err) => {
          navigate('/login');
        });
    } else {
      SemestersAPI.getDefaultSemester()
        .then((res) => {
          if (res.status === 200) {
            const url = `/student?${stringify({
              ...page,
              ...filter,
              smester_id: res.data._id,
              campus_id:
                infoUser && infoUser.manager && infoUser.manager.campus_id
                  ? infoUser.manager.campus_id
                  : '',
            })}`;
            axiosClient
              .get(url, {
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${infoUser.accessToken}`,
                },
              })
              .then((res) => {
                if (res.status === 200) {
                  dispatch(getListStudentReducer(res.data));
                }
              })
              .catch((err) => {
                navigate('/login');
              });
          }
        })
        .catch(() => {});
    }
  };

  const getStudentExportExcel = async () => {
    if (page?.smester_id && page?.smester_id.length > 0) {
      dispatch(
        getAllStudent({
          ...filter,
        }),
      );
    } else {
      SemestersAPI.getDefaultSemester()
        .then((res) => {
          if (res.status === 200) {
            dispatch(
              getAllStudent({
                smester_id: res.data._id,
              }),
            );
          }
        })
        .catch(() => {});
    }
  };
  const getListAllStudent = listAllStudent?.list;
  useEffect(() => {
    getStudentExportExcel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    getListStudent();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);
  useEffect(() => {
    dispatch(getSemesters());
    dispatch(getListMajor());
    dispatch(fetchManager());
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
      title: 'H??? v?? T??n',
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
      title: '??i???n tho???i',
      dataIndex: 'phoneNumber',
      width: 160,
    },
    {
      title: 'Ng??nh',
      dataIndex: 'majors',
      width: 100,
      render: (val) => val.name,
    },
    {
      title: 'Ph??n lo???i',
      dataIndex: 'support',
      width: 90,
      render: (val) => {
        if (val === 1) {
          return 'H??? tr???';
        } else if (val === 0) {
          return 'T??? t??m';
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
      title: 'Ng?????i review',
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
      title: 'Tr???ng th??i',
      dataIndex: 'statusCheck',
      render: (status) => {
        if (status === 0) {
          return (
            <span className="status-fail" style={{ color: 'orange' }}>
              Ch??? ki???m tra
            </span>
          );
        } else if (status === 1) {
          return (
            <span className="status-up" style={{ color: 'grey' }}>
              S???a l???i CV
            </span>
          );
        } else if (status === 2) {
          return (
            <span className="status-fail" style={{ color: 'red' }}>
              Nh???n CV
            </span>
          );
        } else if (status === 3) {
          return (
            <span className="status-fail" style={{ color: 'red' }}>
              Tr?????t
            </span>
          );
        } else if (status === 4) {
          return (
            <span className="status-fail" style={{ color: 'red' }}>
              ???? n???p bi??n b???n <br />
            </span>
          );
        } else if (status === 5) {
          return (
            <span className="status-fail" style={{ color: 'red' }}>
              S???a bi??n b???n
              <br />
            </span>
          );
        } else if (status === 6) {
          return (
            <span className="status-fail" style={{ color: 'red' }}>
              ??ang th???c t???p <br />
            </span>
          );
        } else if (status === 7) {
          return (
            <span className="status-fail" style={{ color: 'red' }}>
              ???? n???p b??o c??o <br />
            </span>
          );
        } else if (status === 8) {
          return (
            <span className="status-fail" style={{ color: 'red' }}>
              S???a b??o c??o <br />
            </span>
          );
        } else if (status === 9) {
          return (
            <span className="status-fail" style={{ color: 'red' }}>
              Ho??n th??nh <br />
            </span>
          );
        } else {
          return (
            <span className="status-fail" style={{ color: 'red' }}>
              Ch??a ????ng k??
            </span>
          );
        }
      },
    },
    {
      title: 'Reset tr???ng th??i',
      render: (val, key) => {
        return (
          <Button
            style={{
              color: '#fff',
              background: '#ee4d2d',
            }}
            onClick={() => resetStudent(val, key)}
          >
            Reset
          </Button>
        );
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
    getListStudent();
  };

  const comfirm = () => {
    dispatch(
      updateReviewerListStudent({
        listIdStudent: listIdStudent,
        email: infoUser?.manager?.email,
      }),
    );
    alert('Th??m th??nh c??ng ');
    navigate('/review-cv');
  };

  const fileType =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const fileExtension = '.xlsx';

  const exportToCSV = (list) => {
    const newData = [];
    list &&
      list.map((item) => {
        const newObject = {};
        newObject['K??? h???c'] = item['smester_id']?.name;
        newObject['C?? s???'] = item['campus_id']?.name;
        newObject['MSSV'] = item['mssv'];
        newObject['H??? t??n'] = item['name'];
        newObject['Email'] = item['email'];
        newObject['Ng??nh'] = item['majors']?.name;
        newObject['M?? ng??nh'] = item['majors']?.majorCode;
        newObject['CV'] = item['CV'];
        newObject['Bi??n b???n'] = item['form'];
        newObject['B??o c??o'] = item['report'];
        newObject['Ng?????i review'] = item['reviewer'];
        newObject['S??? ??i???n tho???i'] = item['phoneNumber'];
        newObject['T??n c??ng ty'] = item['business']?.name;
        newObject['?????a ch??? c??ng ty'] = item['business']?.address;
        newObject['V??? tr?? th???c t???p'] = item['business']?.internshipPosition;
        newObject['M?? s??? thu???'] = item['taxCode'];
        newObject['??i???m th??i ?????'] = item['attitudePoint'];
        newObject['??i???m k???t qu???'] = item['resultScore'];
        newObject['Th???i gian th???c t???p'] = item['internshipTime'];
        newObject['H??nh th???c'] = item['support'];
        newObject['Ghi ch??'] = item['note'];
        return newData.push(newObject);
      });
    // eslint-disable-next-line array-callback-return
    newData.map((item) => {
      if (item['H??nh th???c'] === 1) {
        item['H??nh th???c'] = 'H??? tr???';
      } else if (item['H??nh th???c'] === 0) {
        item['H??nh th???c'] = 'T??? t??m';
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
  const parentMethods = {
    majorImport,
    ...page,
    closeVisible,
  };
  return (
    <div className={style.status}>
      <div className={style.flex_header}>
        <h4 className={style.flex_header.h4}>Sinh vi??n ????ng k?? th???c t???p</h4>
        <Col span={8} className="d-flex">
          <Select
            style={{
              width: '100%',
            }}
            onChange={(val) => setPage({ ...page, smester_id: val })}
            placeholder="Ch???n k???`"
            defaultValue={defaultSemester && defaultSemester?._id ? defaultSemester?._id : ''}
          >
            {!defaultSemester?._id && (
              <Option value={''} disabled>
                Ch???n k???
              </Option>
            )}
            {listSemesters &&
              listSemesters.length > 0 &&
              listSemesters?.map((item, index) => (
                <Option value={item?._id} key={index}>
                  {item?.name}
                </Option>
              ))}
          </Select>
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
                onClick={(e) => exportToCSV(getListAllStudent)}
              >
                Export
              </Button>
              <Button
                type="primary"
                variant="warning"
                className={style.button}
                onClick={openVisible}
              >
                Th??m Sinh Vi??n
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
                    placeholder="L???c theo ng??nh"
                    defaultValue=""
                  >
                    <Option value="">T???t c???</Option>
                    <Option value="">T???t c???</Option>
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
                    onChange={(val) => handleStandardTableChange('statusCheck', val)}
                    defaultValue={11}
                    placeholder="L???c theo tr???ng th??i"
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
                    placeholder="T??m ki???m theo m?? sinh vi??n"
                    onChange={(val) => handleStandardTableChange('mssv', val.target.value.trim())}
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
                  T??m ki???m
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
                    onClick={() => comfirm()}
                  >
                    X??c nh???n
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
                  Th??m Sinh Vi??n
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
                  onClick={(e) => exportToCSV(getListAllStudent)}
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
                <span style={{ whiteSpace: 'nowrap', marginRight: '10px' }}>Ng??nh : </span>
                <Select
                  className="select-branch"
                  style={{ width: '100%' }}
                  onChange={(val) => handleStandardTableChange('majors', val)}
                  placeholder="L???c theo ng??nh"
                  defaultValue=""
                >
                  <Option value="">T???t c???</Option>
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
                <span style={{ whiteSpace: 'nowrap', marginRight: '10px' }}>Tr???ng th??i:</span>
                <Select
                  className="filter-status"
                  style={{ width: '100%' }}
                  onChange={(val) => handleStandardTableChange('statusCheck', val)}
                  defaultValue={11}
                  placeholder="L???c theo tr???ng th??i"
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
                <span style={{ whiteSpace: 'nowrap', marginRight: '10px' }}>T??m Ki???m:</span>
                <Input
                  style={{ width: '100%' }}
                  placeholder="T??m ki???m theo m?? sinh vi??n"
                  onChange={(val) => handleStandardTableChange('mssv', val.target.value.trim())}
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
                T??m ki???m
              </Button>

              {chooseIdStudent.length > 0 && (
                <Button
                  style={{
                    color: '#fff',
                    background: '#ee4d2d',
                    marginLeft: '20px',
                  }}
                  onClick={() => comfirm()}
                >
                  X??c nh???n
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
          <Column title="H??? v?? T??n" dataIndex="name" key="_id" />
          {window.innerWidth > 739 && window.innerWidth < 1023 && (
            <Column title="Email" dataIndex="email" key="_id" />
          )}
          <Column
            title="Tr???ng th??i"
            dataIndex="statusCheck"
            key="_id"
            render={(status) => {
              if (status === 0) {
                return (
                  <span className="status-fail" style={{ color: 'orange' }}>
                    Ch??? ki???m tra
                  </span>
                );
              } else if (status === 1) {
                return (
                  <span className="status-up" style={{ color: 'grey' }}>
                    S???a l???i CV
                  </span>
                );
              } else if (status === 2) {
                return (
                  <span className="status-fail" style={{ color: 'red' }}>
                    Nh???n CV
                  </span>
                );
              } else if (status === 3) {
                return (
                  <span className="status-fail" style={{ color: 'red' }}>
                    Tr?????t
                  </span>
                );
              } else if (status === 4) {
                return (
                  <span className="status-fail" style={{ color: 'red' }}>
                    ???? n???p bi??n b???n <br />
                  </span>
                );
              } else if (status === 5) {
                return (
                  <span className="status-fail" style={{ color: 'red' }}>
                    S???a bi??n b???n <br />
                  </span>
                );
              } else if (status === 6) {
                return (
                  <span className="status-fail" style={{ color: 'red' }}>
                    ??ang th???c t???p <br />
                  </span>
                );
              } else if (status === 7) {
                return (
                  <span className="status-fail" style={{ color: 'red' }}>
                    ???? n???p b??o c??o <br />
                  </span>
                );
              } else if (status === 8) {
                return (
                  <span className="status-fail" style={{ color: 'red' }}>
                    S???a b??o c??o <br />
                  </span>
                );
              } else if (status === 9) {
                return (
                  <span className="status-fail" style={{ color: 'red' }}>
                    Ho??n th??nh <br />
                  </span>
                );
              } else {
                return (
                  <span className="status-fail" style={{ color: 'red' }}>
                    Ch??a ????ng k??
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

      <div>
        <Drawer title="Th??m Sinh Vi??n" placement="left" onClose={closeVisible} visible={visible}>
          <Row>
            <Col span={6}>
              <p className={style.pDrawer}>H???c K??? : </p>
            </Col>
            <Col span={18}>
              <Select
                style={{
                  width: '100%',
                }}
                onChange={(val) => setPage({ ...page, smester_id: val })}
                placeholder="Ch???n k???"
                defaultValue={defaultSemester && defaultSemester?._id ? defaultSemester?._id : ''}
              >
                {!defaultSemester?._id && (
                  <Option value={''} disabled>
                    Ch???n k???
                  </Option>
                )}
                {listSemesters &&
                  listSemesters.length > 0 &&
                  listSemesters?.map((item, index) => (
                    <Option value={item?._id} key={index}>
                      {item?.name}
                    </Option>
                  ))}
              </Select>
            </Col>
          </Row>

          <Row
            style={{
              marginTop: 20,
            }}
          >
            <Col span={6}>
              <p className={style.pDrawer}>Ng??nh:</p>
            </Col>
            <Col span={18}>
              <Select
                style={{
                  width: '100%',
                }}
                onChange={(val) => setMajorImport(val)}
                placeholder="Ch???n ng??nh"
                defaultValue={majorImport}
              >
                {listMajors &&
                  listMajors?.map((item, index) => (
                    <Option value={item?._id} key={index}>
                      {item?.name}
                    </Option>
                  ))}
              </Select>
            </Col>
          </Row>
          <div className={style.upFile}>
            <UpFile parentMethods={parentMethods} keys="status" />
          </div>
        </Drawer>
      </div>
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
