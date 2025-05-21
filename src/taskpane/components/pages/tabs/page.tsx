/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { Box, Typography, Tabs, Tab, IconButton, Tooltip } from '@mui/material';
import UIText from '../../../utilities/textResource';
import { RiLogoutCircleRLine } from "react-icons/ri";
import { useNavigate } from 'react-router-dom';
import Review from '../review/page';
import ClauseLibrary from '../clauseManagement/page';

const Page: React.FC = () => {
    const navigate = useNavigate();
    const [selectedTab, setSelectedTab] = useState(0);

    const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
        setSelectedTab(newValue);
    };

    const handleLogout = () => {
        navigate("/");
        localStorage.removeItem("access_token");
    };

    return (
        <Box
            sx={{
                width: '99%',
                maxWidth: 620,
                margin: '0 auto',
            }}
        >
            <Box
                sx={{
                    backgroundColor: '#2B579A',
                    color: '#fff',
                    padding: 2,
                    display: "flex",
                    textAlign: 'center',
                    justifyContent: "space-between",
                    flexDirection: "row"
                }}
            >
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{UIText.login.title}</Typography>
                <Tooltip title="Logout" placement="left-start">
                    <IconButton onClick={handleLogout} sx={{ color: '#fff' }}>
                        <RiLogoutCircleRLine style={{ color: "#fff", fontSize: "20px" }} />
                    </IconButton>
                </Tooltip>
            </Box>

            <Tabs
                value={selectedTab}
                onChange={handleTabChange}
                indicatorColor="primary"
                variant="fullWidth"
                color="black"
            >
                <Tab label={UIText.library.review.title} sx={{ textTransform: "capitalize", fontSize: "12px" }} />
                <Tab label={UIText.library.clause_management.title} sx={{ textTransform: "capitalize", fontSize: "12px" }} />
            </Tabs>

            <Box sx={{ padding: 2 }}>
                {selectedTab === 0 && (
                    <Review />
                )}
                {selectedTab === 1 && (
                    <ClauseLibrary />
                )}
            </Box>
        </Box>
    );
};

export default Page;