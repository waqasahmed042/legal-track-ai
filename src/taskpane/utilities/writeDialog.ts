/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
import { Dialog, DisplayDialogAsyncResult } from "./types";

export const openWriteDialog = (dialog_url: string, submitResult: any, callback: (error: any, data: any) => void): Promise<boolean> => {
    const writeDialogURL: string = `${dialog_url}writeIndex.html`;

    // convert selected card data into base64 and add in dialog url
    const base64String = btoa(unescape(encodeURIComponent(submitResult)));
    const writeDialogURLWithBase64: string = `${writeDialogURL}?selectedResultData=${base64String}`;

    return new Promise<boolean>((resolve, reject) => {
        // Ensure the URL is valid
        if (!writeDialogURLWithBase64) {
            reject(new Error("Write dialog URL is not available"));
            return;
        }

        Office.context.ui.displayDialogAsync(writeDialogURLWithBase64, { height: 70, width: 50 },
            (result: DisplayDialogAsyncResult) => {
                if (result.status === Office.AsyncResultStatus.Failed) {
                    reject(result.error);
                    return;
                }

                // Add an event handler to process messages from the dialog.
                const dialog: Dialog = result.value;
                dialog.addEventHandler(Office.EventType.DialogMessageReceived, (arg: any) => {
                    try {
                        // Close the dialog if "close" message is received
                        const message = arg.message;
                        if (message === "Close write dialog") {
                            dialog.close();
                            resolve(true);
                            callback(message, null);
                        } else {
                            console.log("Message received from write dialog:", message);
                            dialog.close();
                            callback(null, message);
                        }
                    } catch (err) {
                        reject(err);
                    }
                });

                // Handle dialog closed event.
                dialog.addEventHandler(Office.EventType.DialogEventReceived, () => {
                    reject(new Error("Write dialog was closed by the user or the system."));
                });
            }
        );
    });
}