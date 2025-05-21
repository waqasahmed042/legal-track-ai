/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const Token = () => {
    const navigate = useNavigate();
    const accessToken = localStorage.getItem("access_token");

    useEffect(() => {
        if (!accessToken) {
            navigate("/");
        }
    }, [accessToken, navigate]);

    return accessToken;
};