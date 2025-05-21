/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { Typography, Box, TextField, Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import UIText from '../../../utilities/textResource';
import Loader from '../../loader/Loader';
import { Token } from '../../../utilities/accessToken';
import { getSelectedText } from '../../../utilities/getSelectedText';
import { sendClause } from '../../../services/sendClause';
import { contractTypeOptions } from '../../../utilities/aiResultDialog';

const AddClause: React.FC = () => {
    const accessToken = Token();
    const [isLoading, setIsLoading] = useState(false);
    const [contractType, setContractType] = useState('');
    const [categoryType, setCategoryType] = useState('');
    const [clauseText, setClauseText] = useState('');
    const [clauseHeading, setClauseHeading] = useState('');

    // Handle contract type change
    const handleContractTypeChange = (event: SelectChangeEvent) => {
        console.log("contractType", event.target.value);
        setContractType(event.target.value);
    };

    const handleClauseHeadingInputChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setClauseHeading(event.target.value);
    };

    getSelectedText(async (error, data) => {
        if (error) {
            console.log("Send Clause failed", error);
        } else if (data) {
            console.log("Send Clause success", data);
            setClauseText(data);
        }
    });

    const handleAddClauseButton = () => {
        console.log("Submit & Trade Button Clicked!");

        const addClauseData = {
            contractType: contractType,
            categoryType: categoryType,
            clauseText: clauseText,
        };

        if (accessToken && addClauseData) {
            setIsLoading(true);
            console.log("Add clause data:", addClauseData);

            sendClause(accessToken, contractType, categoryType, clauseText, async (error, data) => {
                if (error) {
                    console.log("Send Clause failed", error);
                    setIsLoading(false);
                } else if (data) {
                    console.log("Send Clause success", data);

                    // Clear inputs after text insertion
                    setContractType('');
                    setCategoryType('');
                    setClauseText('');
                    setIsLoading(false);
                }
            });
        } else {
            console.error("Access token missing in cookies.");
            setIsLoading(false);
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
            <Box sx={{ width: "100%", maxWidth: "600px" }}>
                <Typography sx={{ fontSize: "12px" }}>
                    {UIText.library.clause_management.add_clause.clause_management_content}
                </Typography>

                <Box
                    sx={{
                        width: "100%",
                        margin: '0 auto',
                        borderRadius: 2,
                    }}
                >
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

                    <TextField
                        label={UIText.library.clause_management.add_clause.clause_name}
                        placeholder={UIText.library.clause_management.add_clause.enter_clause_name}
                        variant="outlined"
                        size="small"
                        value={clauseHeading}
                        onChange={handleClauseHeadingInputChange}
                        sx={{ width: "100%", maxWidth: "600px", marginTop: "14px" }}
                    />

                    <Box>
                        <TextField
                            label={UIText.library.clause_management.add_clause.clause_text}
                            placeholder={UIText.library.clause_management.add_clause.enter_any_text_here}
                            multiline
                            rows={4}
                            variant="outlined"
                            value={clauseText}
                            sx={{ marginTop: "14px", width: "100%" }}
                            onChange={(e) => setClauseText(e.target.value)}
                        />
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                fontSize: "0.75rem",
                                color: "gray",
                                marginTop: "-22px",
                                marginRight: "6px"
                            }}
                        >
                            <span></span>
                            <span>{`${clauseText.length}/100`}</span>
                        </Box>
                        {clauseText.length === 100 && (
                            <Typography
                                sx={{
                                    fontSize: "0.75rem",
                                    color: "red",
                                    marginTop: "8px",
                                }}
                            >
                                {UIText.library.clause_management.add_clause.max_character_limit_reached}
                            </Typography>
                        )}
                    </Box>

                    <Button
                        variant="contained"
                        color="primary"
                        sx={{
                            textTransform: "capitalize",
                            marginTop: "12px",
                            padding: "6px 100px",
                            whiteSpace: "nowrap",
                            width: "100%",
                            maxWidth: "300px",
                        }}
                        onClick={handleAddClauseButton}
                    >
                        {UIText.library.clause_management.add_clause.submit_and_trade}
                    </Button>
                </Box>
            </Box>
        </>
    );
};

export default AddClause;
