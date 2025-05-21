/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
export const getAlternativeNames = (accessToken: string, callback: (error: Error | null, data: any | null) => void) => {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${accessToken}`);

    const requestOptions = {
        method: "GET",
        headers: myHeaders
    };

    fetch("https://www.legaltrack-ai.com/api/v1/test/file/fields/", requestOptions)
        .then((response) => response.json())
        .then((result) => {
            console.log(result);
            if (result.data.all_contracts) {
                callback(null, result);
            } else {
                callback(result.detail, null);
            }
        })
        .catch((error) => {
            console.error(error);
            callback(error, null);
        });
}