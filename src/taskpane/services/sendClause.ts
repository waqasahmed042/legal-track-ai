/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
export const sendClause = (accessToken: string, contractType: string, categoryType: string, clauseText: string, callback: (error: Error | null, data: any | null) => void) => {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${accessToken}`);

    const formdata = new FormData();
    formdata.append("selected_contract", contractType);
    formdata.append("selected_category", categoryType);
    formdata.append("input_clause", clauseText);

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: formdata
    };

    fetch("https://www.legaltrack-ai.com/api/v1/test/final/text-clause/", requestOptions)
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