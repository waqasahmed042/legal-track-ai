/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import UIText from '../../../utilities/textResource';

const App: React.FC = () => {
    const [resultValue, setResultValue] = useState('');
    const [resultError, setResultError] = useState('');

    // Get selected result value base64 from dialog url
    useEffect(() => {
        const urlParams: URLSearchParams = new URLSearchParams(window.location.search);
        const getSelectedResultValue = urlParams.get("selectedResultValue");

        // Convert base64 to original data
        if (getSelectedResultValue) {
            try {
                const decodedString = decodeURIComponent(escape(atob(getSelectedResultValue)));
                setResultValue(decodedString);
                console.log("Decoded original write data:", decodedString);
            } catch (error) {
                console.error("Failed to decode Write data:", error);
            }
        }
    }, []);

    // Ensure the selected search result is loaded before rendering
    if (!resultValue) {
        return <Typography sx={{ padding: "10px" }}>{UIText.loading}</Typography>;
    }

    // Get value from result input on every change
    const handleResultInputChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setResultValue(event.target.value);
    };

    // Insert result clauses in word document
    const handleInsertInDocButton = async () => {
        setResultError('');
        console.log("Text to Insert:", resultValue);

        if (resultValue.trim()) {
            // clear inputs after text insertion
            setResultValue('');
            if (resultValue) {
                Office.context.ui.messageParent(resultValue);
            } else {
                Office.context.ui.messageParent("Close write dialog");
            }
        } else {
            setResultError("Result input is empty. Please enter text before inserting.");
        }
    };

    return (
        <>
            <Box
                sx={{
                    width: "90%",
                    margin: '20px 40px',
                    borderRadius: 2,
                }}
            >
                <TextField
                    label={UIText.library.clause_management.search_library.results}
                    placeholder={UIText.library.clause_management.search_library.enter_clause_text_here}
                    multiline
                    rows={6}
                    variant="outlined"
                    value={resultValue}
                    onChange={handleResultInputChange}
                    sx={{ marginTop: "12px", width: "100%", maxWidth: "670px" }}
                />
                <Typography sx={{ fontSize: "10px", color: "red" }}>{resultError}</Typography>

                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{
                            textTransform: "capitalize",
                            marginTop: "12px",
                            padding: "6px 96px",
                            whiteSpace: "nowrap",
                            width: "100%",
                            maxWidth: "200px"
                        }}
                        onClick={handleInsertInDocButton}
                    >
                        {UIText.library.clause_management.search_library.insert_in_doc}
                    </Button>
                </Box>
            </Box>
        </>
    );
};

export default App;