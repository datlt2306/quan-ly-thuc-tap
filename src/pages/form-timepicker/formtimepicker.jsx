import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  DatePicker,
  message,
  Row,
  Select,
  Spin,
  Typography,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  getListTime,
  upTimeDate,
} from "../../features/timeDateSlice/timeDateSlice";
import moment from "moment";
import styles from "./formTimePicker.module.css";
import { getSemesters } from "../../features/semesters/semestersSlice";
import SemestersAPI from "../../API/SemestersAPI";
import { getLocal } from "../../ultis/storage";
const dataRender = [
  {
    typeNumber: 1,
    name: "Form đăng ký nhờ nhà trường hỗ trợ",
  },
  {
    typeNumber: 0,
    name: "Form đăng ký sinh viên tự tìm",
  },
  {
    typeNumber: 2,
    name: "Form nộp biên bản",
  },
  {
    typeNumber: 3,
    name: "Form nộp báo cáo",
  },
  {
    typeNumber: 4,
    name: "Form hiển thị thông tin doanh nghiệp",
  },
];
const dateFormat = "DD/MM/YYYY";
const { Option } = Select;
const Formtimepicker = () => {
  const infoUser = getLocal();
  const { RangePicker } = DatePicker;
  const { listSemesters, defaultSemester } = useSelector(
    (state) => state.semester
  );

  const {
    formTime: { times },
    loading,
  } = useSelector((state) => state.time);
  const [date, setDate] = useState(new Date().getTime());
  const dispatch = useDispatch();
  const [semester, setSemester] = useState({});
  const onSetDatePicker = (date) => {
    setDate(date);
  };

  const setDataSemester = (id) => {
    const semes = listSemesters.find((item) => item._id === id);
    setSemester(semes);
  };

  useEffect(() => {
    SemestersAPI.getDefaultSemester({
      campus_id: infoUser?.manager?.campus_id,
    }).then((res) => {
      if (res.status === 200) {
        setSemester(res.data.result);
      }
    });
  }, []);
  useEffect(() => {
    dispatch(getSemesters({ campus_id: infoUser?.manager?.campus_id }));
  }, []);

  useEffect(() => {
    dispatch(
      getListTime({
        campus_id: infoUser?.manager?.campus_id,
        semester_id: semester?._id,
      })
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [semester?._id]);

  const onSaveTime = async (value) => {
    const startTime = date[0]._d.getTime();
    const endTime = date[1]._d.getTime();
    if (
      new Date(semester?.start_time).getTime() < startTime &&
      startTime < new Date(semester?.end_time).getTime() &&
      new Date(semester?.start_time).getTime() < endTime &&
      endTime < new Date(semester?.end_time).getTime()
    ) {
      const timeObject = {
        typeNumber: Number(value.typeNumber),
        typeName: value.name,
        startTime: startTime,
        endTime: endTime,
        semester_id: semester?._id,
        campus_id: infoUser?.manager?.campus_id,
      };
      try {
        await dispatch(upTimeDate(timeObject));
        message.success("Thành công");
        dispatch(
          getListTime({
            campus_id: infoUser?.manager?.campus_id,
            semester_id: semester?._id,
          })
        );
      } catch (error) {
        message.error("Thất bại");
      }
    } else {
      message.error(
        "Bạn phải đặt thời gian trong khoảng thời gian của kỳ thực tập"
      );
    }
  };

  return (
    <div>
      <h3 style={{ marginBottom: 40, color: "#3c3c3c", textAlign: "center" }}>
        Quản lý thời gian các tính năng cho sinh viên
      </h3>
      <Spin spinning={loading} />
      <Row>
        {listSemesters && listSemesters.length > 0 && (
          <Col style={{ marginBottom: 20 }} span={24}>
            <Row>
              <Col span={6}>
                <p className="m-0">Lựa chọn kỳ muốn xét thời gian: </p>
              </Col>
              <Col span={8}>
                <Select
                  style={{
                    width: "80%",
                  }}
                  onChange={(value) => setDataSemester(value)}
                  placeholder="Kỳ hiện tại"
                  defaultValue={
                    defaultSemester && defaultSemester?._id
                      ? defaultSemester?._id
                      : ""
                  }
                >
                  {!defaultSemester?._id && (
                    <Option value={""} disabled>
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
                </Select>
              </Col>
              {semester && semester.start_time && (
                <Col span={10}>
                  <span>
                    Thời gian kỳ:{" "}
                    {moment(semester?.start_time).format(dateFormat)} -{" "}
                    {moment(semester?.end_time).format(dateFormat)}
                  </span>
                </Col>
              )}
            </Row>
          </Col>
        )}
        {listSemesters && listSemesters.length > 0 ? (
          <Row>
            <Col span={12} lg={12} sm={24} xs={24}>
              <Row>
                {dataRender.map((item) => (
                  <Col key={item.typeNumber} sm={24}>
                    <Col lg={24} sm={24} xs={24}>
                      <span className={styles.typeName}>{item.name}</span>
                    </Col>
                    <Row
                      style={{
                        marginBottom: 10,
                      }}
                    >
                      <Col lg={16} sm={16} xs={16}>
                        <RangePicker
                          className={styles.RangePicker}
                          onChange={onSetDatePicker}
                          disabledDate={(current) => {
                            let startDate = new Date(
                              semester?.start_time
                            ).getTime();
                            let endDate = new Date(
                              semester?.end_time
                            ).getTime();
                            return (
                              (current &&
                                new Date(current).getTime() < startDate) ||
                              (current && new Date(current).getTime() > endDate)
                            );
                          }}
                        />
                      </Col>
                      <Col lg={8} sm={8} xs={8}>
                        <Button
                          className={styles.button}
                          onClick={() => onSaveTime(item)}
                          type="primary"
                        >
                          Đặt thời gian
                        </Button>
                      </Col>
                    </Row>
                  </Col>
                ))}
              </Row>
            </Col>
            <Col span={12} lg={12} sm={24} xs={24}>
              <span className={styles.typeName}>Thông tin thời gian</span>
              <table style={{ marginTop: 0 }}>
                <thead>
                  <tr>
                    <th>Loại hình đặt thời gian</th>
                    <th>Thời gian bắt đầu</th>
                    <th>Thời gian gian kết thúc</th>
                  </tr>
                </thead>
                <tbody>
                  {times?.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td className={styles.textTable}>{item?.typeName}</td>
                        <td>
                          {moment(item?.startTime).format(
                            "hh:mm:ss | DD-MM-YYYY"
                          )}
                        </td>
                        <td>
                          {moment(item?.endTime).format(
                            "hh:mm:ss | DD-MM-YYYY"
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Col>
          </Row>
        ) : (
          <Typography.Title level={4} className="text-center">
            Đang không có kỳ nào. Vui lòng tạo kỳ trước!
          </Typography.Title>
        )}
      </Row>
    </div>
  );
};

Formtimepicker.propTypes = {};

export default Formtimepicker;
