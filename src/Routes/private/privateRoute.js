import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const Privateroute = ({ children }) => {
  const { infoUser } = useSelector((state) => state.auth);
  return infoUser !== undefined ? children : <Navigate to="/login" />;
};

export default Privateroute;
