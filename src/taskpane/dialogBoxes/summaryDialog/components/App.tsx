/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';
import UIText from '../../../utilities/textResource';

const App: React.FC = () => {
    const [summary, setSummary] = useState<any[]>([]);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const encodedSummary = urlParams.get("selectedSummary");

        if (encodedSummary) {
            try {
                const decodedString = decodeURIComponent(escape(atob(encodedSummary)));
                const parsedSummary = JSON.parse(decodedString);

                // Transform object to array
                if (parsedSummary && typeof parsedSummary === "object" && !Array.isArray(parsedSummary)) {
                    const transformedSummary = Object.keys(parsedSummary)
                        .filter((key) => key.startsWith("title_"))
                        .map((key, index) => ({
                            title: parsedSummary[key],
                            content: parsedSummary[`content_${index + 1}`]
                        }));
                    setSummary(transformedSummary);
                } else if (Array.isArray(parsedSummary)) {
                    setSummary(parsedSummary);
                } else {
                    console.error("Unsupported summary format:", parsedSummary);
                }
            } catch (error) {
                console.error("Failed to decode summary data:", error);
            }
        }
    }, []);

    const handleSummaryButton = () => {
        Office.context.ui.messageParent("Close Summary dialog");
    };

    if (!summary.length) {
        return <Typography sx={{ padding: "10px" }}>{UIText.loading}</Typography>;
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
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{UIText.library.review.summary}</Typography>
            </Box>
            <Box
                sx={{
                    width: "90%",
                    margin: '20px auto',
                    borderRadius: 2,
                }}
            >
                {summary.map((item, index) => (
                    <Box key={index} sx={{ marginBottom: "16px" }}>
                        <Typography variant="h6" sx={{ fontSize: "16px", fontWeight: "bold" }}>
                            {item.title}
                        </Typography>
                        <Typography sx={{ fontSize: "14px", marginTop: "4px" }}>
                            {item.content}
                        </Typography>
                    </Box>
                ))}

                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <Button
                        variant="contained"
                        size="small"
                        sx={{ textTransform: "capitalize" }}
                        onClick={handleSummaryButton}
                    >
                        {UIText.library.clause_management.search_library.insert_in_doc}
                    </Button>
                </Box>
            </Box>
        </>
    );
};

export default App;