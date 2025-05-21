/* eslint-disable prettier/prettier */
import React from "react";
import { MemoryRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../components/pages/login/page";
import Tabs from "../components/pages/tabs/page";

const RouterApp: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/tabs" element={<Tabs />} />
            </Routes>
        </Router>
    )
}

export default RouterApp;
