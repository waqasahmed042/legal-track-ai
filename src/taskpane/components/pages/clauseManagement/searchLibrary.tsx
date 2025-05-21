/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { TextField, IconButton, Button, Typography, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import UIText from '../../../utilities/textResource';
import Loader from '../../loader/Loader';
import { IoMdResize } from 'react-icons/io';
import { insertInDoc } from '../../../utilities/insertInDoc';
import { openSearchLibraryDialog } from '../../../utilities/searchLibraryDialog';
import { categoryTypeOptions, contractTypeOptions } from '../../../utilities/aiResultDialog';

const searchLibrary: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [resultValue, setResultValue] = useState('');
    const [resultError, setResultError] = useState('');
    const [contractType, setContractType] = useState('');
    const [categoryType, setCategoryType] = useState('');

    // Check production or development environment
    const isDevelopment = process.env.NODE_ENV === "development";
    const dialog_url = isDevelopment != false
        ? process.env.DEV_URL
        : process.env.PORD_URL;

    const handleContractTypeChange = (event: SelectChangeEvent) => {
        console.log("contractType", event.target.value);
        setContractType(event.target.value);
    };

    // Handle category type change
    const handleCategoryTypeChange = (event: SelectChangeEvent) => {
        console.log("categoryType", event.target.value);
        setCategoryType(event.target.value);
    };

    // Get value from result input on every change
    const handleResultInputChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setResultValue(event.target.value);
    };


    // Insert result clauses in word document
    const handleInsertInDocButton = async () => {
        setResultError('');
        console.log("Text to Insert:", resultValue);

        if (resultValue.trim()) {
            await insertInDoc(resultValue);

            // clear inputs after text insertion
            setResultValue('');
        } else {
            setResultError("Result input is empty. Please enter text before inserting.");
        }
    };

    // open write dialog on resize icon click
    const handleOpenWriteDialog = async () => {
        setIsLoading(true);
        openSearchLibraryDialog(dialog_url, resultValue, async (error, data) => {
            if (error) {
                console.log("Write dialog error:", error);
            } else {
                console.log("Write dialog result:", data);
                await insertInDoc(resultValue);

                // clear inputs after text insertion
                setResultValue('');
            }
            setIsLoading(false);
        });
    }

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
            <FormControl sx={{ width: "100%", maxWidth: "600px", marginTop: "12px" }} size="small">
                <InputLabel id="demo-select-small-label">{UIText.library.review.ai_result.dropdowns.select_contract_type}</InputLabel>
                <Select
                    labelId="demo-select-small-label"
                    id="demo-select-small"
                    value={contractType}
                    label="Select Contract Type"
                    onChange={handleContractTypeChange}
                >
                    {contractTypeOptions.map((type) => (
                        <MenuItem key={type} value={type}>
                            {type}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <FormControl sx={{ width: '100%', maxWidth: '600px', marginTop: "12px" }} size="small">
                <InputLabel id="demo-select-small-label">
                    {UIText.library.review.ai_result.dropdowns.select_clause_name}
                </InputLabel>
                <Select
                    labelId="demo-select-small-label"
                    id="demo-select-small"
                    value={categoryType}
                    label="Select Category Type"
                    onChange={handleCategoryTypeChange}
                >
                    {categoryTypeOptions.map((type) => (
                        <MenuItem key={type} value={type}>
                            {type}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <TextField
                label={UIText.library.clause_management.search_library.results}
                placeholder={UIText.library.clause_management.search_library.enter_clause_text_here}
                multiline
                rows={4}
                variant="outlined"
                value={resultValue}
                onChange={handleResultInputChange}
                sx={{ marginTop: "12px", width: "100%", maxWidth: "600px" }}
                InputProps={{
                    endAdornment: (
                        <>
                            <IconButton
                                onClick={handleOpenWriteDialog}
                                sx={{
                                    position: 'absolute',
                                    top: '4px',
                                    right: '4px',
                                    zIndex: 1,
                                    fontSize: '16px',
                                }}
                            >
                                <IoMdResize />
                            </IconButton>
                        </>
                    ),
                }}
            />
            <Typography sx={{ fontSize: "10px", color: "red" }}>{resultError}</Typography>

            <Button
                variant="contained"
                color="primary"
                sx={{
                    textTransform: "capitalize",
                    marginTop: "12px",
                    padding: "6px 96px",
                    whiteSpace: "nowrap",
                    width: "100%",
                }}
                onClick={handleInsertInDocButton}
            >
                {UIText.library.clause_management.search_library.insert_in_doc}
            </Button>
        </>
    );
};

export default searchLibrary;