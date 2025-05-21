/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
export const auth = async (username: string, email: string, callback: (error: Error | null, data: any | null) => void): Promise<void> => {
    const formdata = new FormData();
    formdata.append("username", username);
    formdata.append("email", email);

    const requestOptions = {
        method: "POST",
        body: formdata
    };

    fetch("https://www.legaltrack-ai.com/api/v1/user/login/", requestOptions)
        .then((response) => response.json())
        .then((result) => {
            console.log(result);

            if (result && result.access_token) {
                localStorage.setItem("access_token", result.access_token);
                callback(null, result);
            } else {
                console.error("Authentication failed: ", result.detail);
                callback(result.detail, null);
            }
        })
        .catch((error) => {
            console.error(error);
            callback(error, null);
        });
};