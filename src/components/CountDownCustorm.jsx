import React from "react";
import  { shape } from "prop-types";
import Countdown from "react-countdown";

function CountDownCustorm(props) {
  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    // Render a countdown
    return (
      <span>
        {days} ngày {hours} giờ : {minutes} phút : {seconds} giây
      </span>
    );
  };
  const { time } = props;
  return (
    <p>
      Thời gian đăng ký còn lại:{" "}
      <Countdown date={time.endTime} renderer={renderer} />
    </p>
  );
}

CountDownCustorm.propTypes = {
  props: shape()
};

export default CountDownCustorm;
