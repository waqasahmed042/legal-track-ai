/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
export interface ToastProps {
    error?: string;
    success?: string;
    info?: string;
}

export interface SelectedCardData {
    status: string;
    color: string;
    title: string;
    description: string;
}

export interface Dialog {
    addEventHandler: (eventType: Office.EventType, handler: (arg: any) => void) => void;
    close: () => void;
}

export interface DisplayDialogAsyncResult {
    status: Office.AsyncResultStatus;
    value: Dialog;
    error?: any;
}

export interface AllClausesProps {
    allClauses: string[];
}

export interface CategoryDataProps {
    data: {
        all_contracts: string[];
        all_categories: Array<Record<string, string[]>>;
    };
}