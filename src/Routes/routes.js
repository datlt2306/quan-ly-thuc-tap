import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import LayoutWebsite from "../layouts/layoutWebsite";
import LayoutAdmin from "../layouts/layoutAdmin";
import Login from "../containers/website/login/Login";
import Home from "../containers/website/home/Home";
import Status from "../components/website/import-excel/Status";
import ReviewCV from "../components/website/import-excel/ReviewCV";
import UpFile from "../components/website/import-excel/UpFile";
import SupportStudent from "../containers/website/supportStudent/SupportStudent";
import ProactiveStudent from "../containers/website/proactiveStudent/ProactiveStudent";
import Privateroute from "./private/privateRoute";

const Router = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Privateroute><LayoutWebsite /></Privateroute>}>
        {/* <Route index element={<Home/>} /> */}
        <Route path="/support-student" element={<SupportStudent />} />
        <Route path="/proactive-student" element={<ProactiveStudent />} />
      </Route>

      <Route path="admin/" element={<LayoutWebsite />}>
        <Route path="sinh-vien/danh-sach-dang-ky" element={<Status />} />
        <Route path="review-cv" element={<ReviewCV />} />
        <Route path="up-file" element={<UpFile />} />
      </Route>
    </Routes>
  );
};
export default Router;
