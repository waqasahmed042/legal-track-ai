/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
import React from 'react';
import { Box, Card, CardContent, IconButton, Typography } from '@mui/material';
import UIText from '../../../utilities/textResource';
import { IoMdResize } from 'react-icons/io';
import { risk_analysis } from '../../../utilities/dynamicData';
import { openRiskAnalysisDialog } from '../../../utilities/riskAnalysisDialog';

const riskAnalysis: React.FC = () => {

    // Check production or development environment
    const isDevelopment = process.env.NODE_ENV === "development";
    const dialog_url = isDevelopment != false
        ? process.env.DEV_URL
        : process.env.PORD_URL;

    const handleOpenRiskANalysisDialogButton = (selectedRiskAnalysisData: any) => {

        openRiskAnalysisDialog(dialog_url, selectedRiskAnalysisData, (error, data) => {
            if (error) {
                console.error("Risk analysis dialog rrror:", error);
            } else {
                console.log("Risk analysis dialog result:", data);
            }
        });
    }

    return (
        <>
            <Box
                sx={{
                    width: "100%",
                    margin: '0 auto',
                    borderRadius: 2,
                }}
            >
                <Typography sx={{ fontSize: "12px" }}>{UIText.library.review.ai_result.review_content}</Typography>

                <Box sx={{ padding: 2, width: "100%", marginLeft: "-20px" }}>
                    <Card
                        sx={{
                            marginBottom: 2,
                            border: '1px solid #ddd',
                            boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
                            borderRadius: 2,
                            cursor: 'pointer',
                            transition: 'transform 0.3s ease-in-out',
                            '&:hover': {
                                transform: 'scale(1.05)',
                            },
                        }}
                    >
                        <Box
                            display="flex"
                            justifyContent="flex-end"
                            sx={{ padding: '8px', position: 'relative' }}
                        >
                            <IconButton onClick={() => handleOpenRiskANalysisDialogButton(risk_analysis)}>
                                <IoMdResize style={{ fontSize: '12px' }} />
                            </IconButton>
                        </Box>
                        <CardContent sx={{ marginTop: "-20px" }}>
                            {risk_analysis.map((content, index) => (
                                <Typography
                                    key={index}
                                    sx={{
                                        fontSize: '12px',
                                        color: '#333',
                                        lineHeight: 1.5,
                                        marginBottom: index !== risk_analysis.length - 1 ? 1 : 0,
                                    }}
                                >
                                    {content}
                                </Typography>
                            ))}
                        </CardContent>
                    </Card>
                </Box>
            </Box>
        </>
    );
};

export default riskAnalysis;