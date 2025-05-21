/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
import { Dialog, DisplayDialogAsyncResult } from "./types";

export const openRiskAnalysisDialog = (dialog_url: string, selectedRiskAnalysisData: any, callback: (error: any, data: any) => void): Promise<boolean> => {
    const riskAnalysisDialogURL: string = `${dialog_url}riskAnalysisIndex.html`;

    // convert selected card data into base64 and add in dialog url
    const jsonString = JSON.stringify(selectedRiskAnalysisData);
    const base64String = btoa(unescape(encodeURIComponent(jsonString)));
    const riskAnalysisDialogURLWithBase64: string = `${riskAnalysisDialogURL}?selectedRiskAnalysis=${base64String}`;

    return new Promise<boolean>((resolve, reject) => {
        // Ensure the URL is valid
        if (!riskAnalysisDialogURLWithBase64) {
            reject(new Error("Risk analysis dialog URL is not available"));
            return;
        }

        Office.context.ui.displayDialogAsync(riskAnalysisDialogURLWithBase64, { height: 75, width: 80 },
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
                        if (message === "Close risk analysis dialog") {
                            dialog.close();
                            resolve(true);
                            callback(message, null);
                        } else {
                            console.log("Message received from risk analysis dialog:", message);
                            dialog.close();
                            callback(null, message);
                        }
                    } catch (err) {
                        reject(err);
                    }
                });

                // Handle dialog closed event.
                dialog.addEventHandler(Office.EventType.DialogEventReceived, () => {
                    reject(new Error("Risk analysis dialog was closed by the user or the system."));
                });
            }
        );
    });
}