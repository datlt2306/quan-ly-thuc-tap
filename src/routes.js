import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import LayoutWebsite from "./layouts/layoutWebsite";
import LayoutAdmin from "./layouts/layoutAdmin";
import Login from "./containers/website/login/Login";
import Home from "./containers/website/home/Home";
import Status from "./components/website/import-excel/Status";
import ReviewCV from "./components/website/import-excel/ReviewCV";
import UpFile from "./components/website/import-excel/UpFile";
import SupportStudent from "./containers/website/supportStudent/SupportStudent";
import ProactiveStudent from "./containers/website/proactiveStudent/ProactiveStudent";

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<LayoutWebsite />}>
        <Route index element={<Login/>} />
        <Route path="/home" element={<Home/>} />
      </Route>

      <Route path="quan-ly/" element={<LayoutWebsite />}>
        <Route path="sinh-vien/danh-sach-dang-ky" element={<Status />} />
        <Route path="review-cv" element={<ReviewCV />} />
        <Route path="up-file" element={<UpFile />} />
      </Route>
    </Routes>
  );
};
export default Router;
