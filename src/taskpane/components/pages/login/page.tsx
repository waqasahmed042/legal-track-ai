/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import UIText from '../../../utilities/textResource';
import { useNavigate } from 'react-router-dom';
import Loader from '../../loader/Loader';
import Toast from '../../toast/Toast';
import { auth } from '../../../auth/Auth';

const page: React.FC = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [errors, setErrors] = useState({ userName: '', email: '' });
    const access_token = localStorage.getItem("access_token");

    // check if user already loggedin then move to the home page if not then got to login page
    useEffect(() => {
        if (access_token) {
            navigate("/tabs");
        } else {
            navigate("/");
        }
    }, [])

    const handleLoginButton = () => {
        // Check for input validation
        const newErrors = {
            userName: userName.trim() === '' ? 'Username is required' : '',
            email: email.trim() === '' ? 'Email is required' : '',
        };
        setErrors(newErrors);

        if (userName && email) {
            const loginData = {
                userName: userName,
                password: email
            }

            if (loginData) {
                setIsLoading(true);

                // Call the API to authenticate the user   
                auth(userName, email, async (error, data) => {
                    if (error) {
                        console.log("Authentication failed", error);
                        setError(`Authentication failed: ${error}`);
                        setIsLoading(false);
                    } else if (data) {
                        console.log("Authentication success", data);
                        navigate('/tabs');
                        setIsLoading(false);
                    }
                });
            }
        }
    };

    const handleInputChange = (field: string, value: string) => {
        if (field === 'userName') {
            setUserName(value);
            if (errors.userName) setErrors((prev) => ({ ...prev, userName: '' }));
        } else if (field === 'email') {
            setEmail(value);
            if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
        }
    };

    return (
        <>
            {isLoading && (
                <Loader
                    loaderOverlay={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 9999,
                    }}
                    loader={{ size: "40px", color: "#2B579A" }}
                />
            )}
            <Typography
                sx={{
                    fontWeight: "bold",
                    fontSize: "26px",
                    textAlign: "center",
                    paddingTop: "40px"
                }}
            >
                {UIText.login.title}
            </Typography>
            <Typography
                sx={{
                    fontSize: "16px",
                    paddingTop: "4px",
                    color: "#5f5f5f",
                    textAlign: "center",
                }}
            >
                {UIText.login.description}
            </Typography>

            <Box sx={{ margin: "30px 12px 20px 12px" }}>
                <TextField
                    label={UIText.login.user_name}
                    variant="outlined"
                    size="small"
                    value={userName}
                    onChange={(e) => handleInputChange('userName', e.target.value)}
                    error={!!errors.userName}
                    helperText={errors.userName}
                    sx={{ width: "100%", maxWidth: "600px", marginBottom: "16px" }}
                />

                <TextField
                    label={UIText.login.email}
                    variant="outlined"
                    size="small"
                    type="email"
                    value={email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    error={!!errors.email}
                    helperText={errors.email}
                    sx={{ width: "100%", maxWidth: "600px" }}
                />
            </Box>

            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Button
                    variant="contained"
                    color="primary"
                    sx={{
                        textTransform: "capitalize",
                        padding: "6px 100px",
                        whiteSpace: "nowrap",
                        width: "93%",
                        maxWidth: "600"
                    }}
                    onClick={handleLoginButton}
                >
                    {UIText.login.login}
                </Button>
            </Box>

            {error && (<Toast error={error} />)}
        </>
    );
};

export default page;