/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
export const getStrikeData = (accessToken: string, task_id: string, callback: (error: Error | null, data: any | null) => void) => {
    console.log("task_id", task_id);

    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${accessToken}`);

    const requestOptions = {
        method: "GET"
    };

    fetch(`https://www.legaltrack-ai.com/api/v1/test/check-strike/${task_id}`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
            console.log(result);
            callback(null, result);
        })
        .catch((error) => {
            console.error(error);
            callback(error, null);
        });
}
