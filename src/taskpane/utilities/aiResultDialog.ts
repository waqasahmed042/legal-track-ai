/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
import { SelectedCardData } from "./types";
import { Dialog, DisplayDialogAsyncResult } from "./types"

export const contractTypeOptions = [
    'Commercial'
];

export const categoryTypeOptions = [
    'Indemnity',
    'Intellectual Property Rights',
    'Representations and Warranties',
    'Dispute Resolutions',
    'Term and Termination'
];

export const openAIResultDialog = (dialog_url: string, selectedCardData: SelectedCardData, callback: (error: any, data: any) => void): Promise<boolean> => {
    const aiResultDialogURL: string = `${dialog_url}aiResultIndex.html`;

    // convert selected card data into base64 and add in dialog url
    const jsonString = JSON.stringify(selectedCardData);
    // const base64String = btoa(encodeURIComponent(jsonString));
    const aiResultDialogURLWithBase64: string = `${aiResultDialogURL}?selectedCardData=${jsonString}`;

    return new Promise<boolean>((resolve, reject) => {
        // Ensure the URL is valid
        if (!aiResultDialogURLWithBase64) {
            reject(new Error("AI Result dialog URL is not available"));
            return;
        }

        Office.context.ui.displayDialogAsync(aiResultDialogURLWithBase64, { height: 75, width: 80 },
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
                        console.log("Message received from ai result dialog:", message);
                        if (message === "Close ai result dialog") {
                            dialog.close();
                            resolve(true);
                            callback(message, null);
                        } else {
                            console.log("Message received from ai result dialog:", message);
                            dialog.close();
                            callback(null, message);
                        }
                    } catch (err) {
                        reject(err);
                    }
                });

                // Handle dialog closed event.
                dialog.addEventHandler(Office.EventType.DialogEventReceived, () => {
                    reject(new Error("AI result dialog was closed by the user or the system."));
                });
            }
        );
    });
}