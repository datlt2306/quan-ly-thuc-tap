import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import LayoutWebsite from "../layouts/layoutWebsite";
import LayoutAdmin from "../layouts/layoutAdmin";
import Login from "../pages/login/Login";
import SupportStudent from "../pages/supportStudent/SupportStudent"
import ProactiveStudent from "../pages/proactiveStudent/ProactiveStudent";
import Privateroute from "./private/privateRoute";
import Status from "../pages/import-excel/Status";
import ReviewCV from "../pages/import-excel/ReviewCV"
import UpFile from "../pages/import-excel/UpFile";
import EmployeeManager from "../pages/employee-manager/Employee-Manager";
import InfoStudent from "../pages/InfoStudent/infoStudent";
const Router = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Privateroute><LayoutWebsite /></Privateroute>}>
        <Route path="/support-student" element={<ProactiveStudent />} />
        <Route path="/proactive-student" element={<SupportStudent />} />  
        <Route path="/employee-manager" element={<EmployeeManager/>} />
        <Route path="sinh-vien/danh-sach-dang-ky" element={<Status />} />
        <Route path="info-student" element={<InfoStudent/>} />
        <Route path="review-cv" element={<ReviewCV />} />
        <Route path="up-file" element={<UpFile />} />
      </Route>

      <Route path="/admin/" element={<LayoutWebsite />}>
 
      </Route>
    </Routes>
  );
};
export default Router;
