/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { Snackbar, Alert, Slide, SlideProps } from '@mui/material';
import { ToastProps } from '../../utilities/types';

const SlideTransition = (props: SlideProps) => {
    return <Slide {...props} direction="up" />;
}

const Toast: React.FC<ToastProps> = ({ error, success, info }) => {
    const [showError, setShowError] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showInfo, setShowInfo] = useState(false);

    useEffect(() => {
        setShowError(!!error);
        setShowSuccess(!!success);
        setShowInfo(!!info);
    }, [error, success, info]);

    const handleCloseToast = (type: 'error' | 'success' | 'info') => (_event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') return;

        if (type === 'error') {
            setShowError(false);
        } else if (type === 'success') {
            setShowSuccess(false);
        } else if (type === 'info') {
            setShowInfo(false);
        }
    };

    return (
        <>
            {/* Display error message */}
            {showError && (
                <Snackbar
                    open={showError}
                    autoHideDuration={5000}
                    onClose={handleCloseToast('error')}
                    TransitionComponent={SlideTransition}
                    sx={{ marginBottom: success || info ? '80px' : '0' }}
                >
                    <Alert onClose={handleCloseToast('error')} severity="error" variant="filled" sx={{ width: '100%' }}>
                        {error}
                    </Alert>
                </Snackbar>
            )}

            {/* Display success message */}
            {showSuccess && (
                <Snackbar
                    open={showSuccess}
                    autoHideDuration={5000}
                    onClose={handleCloseToast('success')}
                    TransitionComponent={SlideTransition}
                    sx={{ marginBottom: info ? '80px' : '0' }}
                >
                    <Alert onClose={handleCloseToast('success')} severity="success" variant="filled" sx={{ width: '100%' }}>
                        {success}
                    </Alert>
                </Snackbar>
            )}

            {/* Display info message */}
            {showInfo && (
                <Snackbar
                    open={showInfo}
                    autoHideDuration={5000}
                    onClose={handleCloseToast('info')}
                    TransitionComponent={SlideTransition}
                >
                    <Alert onClose={handleCloseToast('info')} severity="info" variant="filled" sx={{ width: '100%' }}>
                        {info}
                    </Alert>
                </Snackbar>
            )}
        </>
    );
};

export default Toast;
