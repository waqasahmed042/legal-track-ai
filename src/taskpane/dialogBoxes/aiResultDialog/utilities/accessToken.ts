/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
export const Token = () => {
    const accessToken = localStorage.getItem("access_token");

    return accessToken;
};