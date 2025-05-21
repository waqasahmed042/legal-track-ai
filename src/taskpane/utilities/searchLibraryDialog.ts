/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
export const openSearchLibraryDialog = (dialog_url: string, resultValue: string, callback: (error: any, data: any) => void): Promise<boolean> => {
    const searchLibraryDialogURL: string = `${dialog_url}searchLibraryIndex.html`;

    // convert result value into base64 and add in dialog url
    const base64String = btoa(unescape(encodeURIComponent(resultValue)));
    const searchLibraryDialogURLWithBase64: string = `${searchLibraryDialogURL}?selectedResultValue=${base64String}`;


    return new Promise<boolean>((resolve, reject) => {
        // Ensure the URL is valid
        if (!searchLibraryDialogURLWithBase64) {
            reject(new Error("Write dialog URL is not available"));
            return;
        }

        Office.context.ui.displayDialogAsync(
            searchLibraryDialogURLWithBase64,
            { height: 75, width: 80 },
            (result) => {
                if (result.status === Office.AsyncResultStatus.Failed) {
                    reject(result.error);
                    return;
                }


                // Add an event handler to process messages from the dialog.
                const dialog = result.value;
                dialog.addEventHandler(Office.EventType.DialogMessageReceived, (arg: any) => {
                    try {
                        const message = arg.message;
                        if (message === "Close search library dialog") {
                            dialog.close();
                            resolve(true);
                            callback(message, null);
                        } else {
                            console.log("Message received from search library dialog:", message);
                            dialog.close();
                            callback(null, message);
                        }
                    } catch (err) {
                        reject(err);
                    }
                });

                // Handle dialog closed event.
                dialog.addEventHandler(Office.EventType.DialogEventReceived, () => {
                    reject(new Error("Search library dialog was closed by the user or the system."));
                });
            }
        );
    });
}