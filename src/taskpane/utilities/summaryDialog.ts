/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
export const openSummaryDialog = (dialog_url: any, summary: string, callback: (error: any, data: any) => void): Promise<boolean> => {
    const summarizeDialogURL: string = `${dialog_url}summaryIndex.html`;

    // convert summary into base64 and add in dialog url
    const jsonString = JSON.stringify(summary);
    const base64String = btoa(unescape(encodeURIComponent(jsonString)));
    const summarizeDialogURLWithBase64: string = `${summarizeDialogURL}?selectedSummary=${base64String}`;

    return new Promise<boolean>((resolve, reject) => {
        // Ensure the URL is valid
        if (!summarizeDialogURLWithBase64) {
            reject(new Error("Summary Dialog URL is not available"));
            return;
        }

        Office.context.ui.displayDialogAsync(
            summarizeDialogURLWithBase64,
            { height: 75, width: 80 },
            (result) => {
                if (result.status === Office.AsyncResultStatus.Failed) {
                    reject(result.error);
                    return;
                }

                // Add an event handler to process messages from the dialog.
                const dialog = result.value;
                dialog.addEventHandler(Office.EventType.DialogMessageReceived, (arg) => {
                    try {
                        // Close the dialog if "close" message is received
                        const message = arg;
                        // "Close summary dialog"
                        if (message) {
                            dialog.close();
                            resolve(true);
                            callback(message, null);
                        } else {
                            console.log("Message received from summary dialog:", message);
                            dialog.close();
                            callback(null, message);
                        }
                    } catch (err) {
                        reject(err);
                    }
                });

                // Handle dialog closed event.
                dialog.addEventHandler(Office.EventType.DialogEventReceived, () => {
                    reject(new Error("Summary dialog was closed by the user or the system."));
                });
            }
        );
    });
}