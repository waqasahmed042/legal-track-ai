/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';
import UIText from '../../../utilities/textResource';

const App: React.FC = () => {
    const [selectedRiskAnalysis, setSelectedRiskAnalysis] = useState<any>(null);

    // Get selected card base64 from dialog url
    useEffect(() => {
        const urlParams: URLSearchParams = new URLSearchParams(window.location.search);
        const getSelectedCardData = urlParams.get("selectedRiskAnalysis");

        // Convert base64 to original data
        if (getSelectedCardData) {
            try {
                const decodedString = decodeURIComponent(escape(atob(getSelectedCardData)));
                const cardData = JSON.parse(decodedString);
                setSelectedRiskAnalysis(cardData);
                console.log("Decoded original risk analysis data:", cardData);
            } catch (error) {
                console.error("Failed to decode risk analysis data:", error);
            }
        }
    }, []);

    // Ensure the selected card data is loaded before rendering
    if (!selectedRiskAnalysis) {
        return <Typography sx={{ padding: "10px" }}>{UIText.loading}</Typography>;
    }

    // Send close message to the dialog.
    const handleRiskAnalysisCloseDialogButton = () => {
        Office.context.ui.messageParent("Close risk analysis dialog");
    }

    return (
        <>
            <Box
                sx={{
                    backgroundColor: '#2B579A',
                    color: '#fff',
                    padding: 2,
                    textAlign: 'center',
                }}
            >
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{UIText.library.review.risk_analysis}</Typography>
            </Box>

            <Box
                sx={{
                    width: "94%",
                    margin: '20px 40px',
                    borderRadius: 2,
                }}
            >
                {selectedRiskAnalysis.map((content: string, index: number) => (
                    <Typography
                        key={index}
                        sx={{
                            fontSize: '12px',
                            color: '#333',
                            lineHeight: 1.5,
                            marginBottom: index !== selectedRiskAnalysis.length - 1 ? 1 : 0,
                        }}
                    >
                        {content}
                    </Typography>
                ))}

                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <Button
                        variant="contained"
                        size="small"
                        sx={{ textTransform: "capitalize" }}
                        onClick={handleRiskAnalysisCloseDialogButton}
                    >
                        {UIText.library.clause_management.search_library.insert_in_doc}
                    </Button>
                </Box>
            </Box>
        </>
    );
};

export default App;