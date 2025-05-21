/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Button, FormControl, InputLabel, MenuItem, Select, Tooltip } from '@mui/material';
import UIText from '../../../utilities/textResource';
import Loader from '../../loader/Loader';
import { Token } from '../../../utilities/accessToken';
import { MdFlag } from "react-icons/md";
import { getDocumentText } from '../../../utilities/getDocBody';
import Toast from '../../toast/Toast';
import { openAIResultDialog } from '../../../utilities/aiResultDialog';
import { getClauses } from '../../../utilities/getClauses';
import { sendClause } from '../../../services/sendClause';
import { findCategoryForHeading } from '../../../utilities/alternateNames';
import { replaceTextInDocument } from '../../../utilities/insertInDoc';
import { getAlternativeNames } from '../../../services/getAlternativeNames';
import { CategoryDataProps } from '../../../utilities/types';
import { addTrackingModeForEveryOne } from '../../../utilities/trackChanges';

const AIResults: React.FC = () => {
    const accessToken = Token();
    const [info, setInfo] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [contractType, setContractType] = useState('');
    const [aiResponse, setAiResponse] = useState([]);
    const [contractTypeError, setContractTypeError] = useState(false);
    const [aiResultCards, setAiResultCards] = useState(false);
    const [contractTypes, setContractTypes] = useState<string[]>([]);

    // Check if the environment is development or production
    const isDevelopment = process.env.NODE_ENV === "development";
    const dialog_url = isDevelopment != false
        ? process.env.DEV_URL
        : process.env.PORD_URL;

    useEffect(() => {
        getAlternativeNames(accessToken, (error, data) => {
            if (error) {
                console.log("Alternative names API failed", error);
                setIsInitialLoading(false);
            } else if (data) {
                console.log("Alternative names API success", data);
                const typedData = data as CategoryDataProps;
                if (typedData.data && typedData.data.all_contracts && Array.isArray(typedData.data.all_contracts)) {
                    setContractTypes(typedData.data.all_contracts);
                    setIsInitialLoading(false);
                }
            }
        });
    }, [accessToken]);

    // handle contract type change
    const handleContractTypeChange = (event: { target: { value: any; }; }) => {
        const value = event.target.value;
        setContractType(value);
        if (value !== '') {
            setContractTypeError(false);
        }
    };

    // Handles the "Run AI" button click and makes API calls to process text and extract clauses
    const handleRunAiButton = async () => {
        setInfo('');
        const isContractEmpty = contractType === '';

        setContractTypeError(isContractEmpty);
        if (isContractEmpty) return;

        try {
            const documentBody = await getDocumentText();
            if (!documentBody) {
                setInfo("No text found in document. Please add content to proceed.");
                return;
            }

            setIsLoading(true);
            setIsInitialLoading(true);
            setAiResultCards(true);
            setAiResponse([]);

            const clauses = await getClauses();
            console.log("Extracted Clauses:", clauses);

            if (!clauses || clauses.length === 0) {
                setInfo("No clauses found in the document. Please check your document and try again.");
                return;
            }

            let isFirstResponse = true;

            // Process all clauses in parallel
            const processClause = async (clauseData: any) => {
                const categoryType = findCategoryForHeading(clauseData.heading);
                if (!categoryType) {
                    setAiResponse(prev => {
                        const newResponses = [...prev, { originalClause: clauseData }];
                        if (isFirstResponse) {
                            isFirstResponse = false;
                            setIsInitialLoading(false);
                        }
                        return newResponses;
                    });
                    return;
                }

                return new Promise<void>((resolve) => {
                    sendClause(accessToken, contractType, categoryType, clauseData.clause_text, async (error, data) => {
                        if (error) {
                            console.log("Text Clause failed", error);
                        } else if (data) {
                            console.log("Text Clause success", data);

                            const hasValidContent = data.data?.preferred_final_clause?.final_clause ||
                                data.data?.acceptable_final_clause?.final_clause;

                            if (hasValidContent) {
                                const responseWithClause = {
                                    ...data,
                                    originalClause: clauseData
                                };
                                setAiResponse(prevResponses => {
                                    const newResponses = [...prevResponses, responseWithClause];
                                    if (isFirstResponse) {
                                        isFirstResponse = false;
                                        setIsInitialLoading(false);
                                    }
                                    return newResponses;
                                });
                            } else {
                                console.log("Skipping empty response");
                            }
                        }
                        resolve();
                    });
                });
            };

            // Process all clauses and stop loading when complete
            await Promise.all(clauses.map(clause => processClause(clause)));
            setIsLoading(false);
        } catch (error) {
            console.error("Failed to extract clauses:", error);
            setInfo("An error occurred while processing the document. Please try again.");
            setIsLoading(false);
            setIsInitialLoading(false);
        }
    };

    // Open ai result dialog when card is clicked
    const handleCardClick = async (index: number) => {
        setIsLoading(true);
        const selectedCardData = aiResponse[index];
        console.log("Selected Card Data:", selectedCardData);

        // Get the heading and check if it's "Services of Consultant"
        const heading = selectedCardData?.originalClause?.heading || '';
        const isServicesOfConsultant = heading.includes('Services of Consultant');

        // Check if the response is empty or has an error message
        if (selectedCardData?.data?.detail?.message) {
            setInfo(`Missing: ${selectedCardData.data.detail.message}`);
            setIsLoading(false);
            return;
        }

        // Check if the card has a category (green flag) or is missing a category (red flag)
        const categoryType = findCategoryForHeading(heading);
        const hasCategory = Boolean(categoryType);

        // If it's a red flag (no category found) and it's "Services of Consultant", show a specific message
        if (!hasCategory && isServicesOfConsultant) {
            setInfo("No matching category found for heading: Services of Consultant. Please check the contract type and try again.");
            return;
        }

        // If it's a red flag (no category found), show a generic message
        if (!hasCategory) {
            setInfo(`No matching category found for heading: ${heading}. Please check the contract type and try again.`);
            return;
        }

        // For green flags, proceed with opening the dialog
        openAIResultDialog(dialog_url, selectedCardData, async (error, data) => {
            if (error) {
                console.error("AI result dialog error:", error);
            } else {
                console.log("AI result dialog result:", data);
                try {
                    const responseData = JSON.parse(data);
                    const originalClause = selectedCardData.originalClause;

                    if (responseData.type === 'redline') {
                        // Update the response in the correct position using heading
                        setAiResponse(prevResponses => {
                            const newResponses = [...prevResponses];
                            const targetIndex = newResponses.findIndex(response =>
                                response.originalClause.heading === selectedCardData.originalClause.heading
                            );
                            if (targetIndex !== -1) {
                                newResponses[targetIndex] = {
                                    ...selectedCardData,
                                    data: {
                                        ...selectedCardData.data,
                                        preferred_final_clause: {
                                            ...selectedCardData.data.preferred_final_clause,
                                            final_clause: responseData.text
                                        }
                                    }
                                };
                            }
                            return newResponses;
                        });

                        await addTrackingModeForEveryOne();

                        // Then replace the text in document using heading
                        await replaceTextInDocument(originalClause.heading, responseData.text, originalClause.clause_text);
                    }
                } catch (error) {
                    console.error("Error processing dialog response:", error);
                }
            }
            setIsLoading(false);
        });
    };
    return (
        <>
            {isInitialLoading && (
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

            {!aiResultCards ? (
                <Box sx={{ width: "100%", margin: '0 auto', borderRadius: 2 }}>
                    <FormControl sx={{ width: "100%", maxWidth: "600px", mt: "12px" }} size="small">
                        <InputLabel>{UIText.library.review.ai_result.dropdowns.select_contract_type}</InputLabel>
                        <Select
                            value={contractType}
                            label="Select Contract Type"
                            onChange={handleContractTypeChange}
                            error={contractTypeError}
                        >
                            {contractTypes.map((type) => (
                                <MenuItem key={type} value={type}>{type}</MenuItem>
                            ))}
                        </Select>
                        {contractTypeError && <Typography variant="caption" color="error">
                            {UIText.library.review.ai_result.dropdowns.contract_type_required}
                        </Typography>}
                    </FormControl>

                    <Button variant="contained" color="primary" onClick={handleRunAiButton}
                        sx={{ mt: "12px", p: "6px 100px", width: "100%", maxWidth: "300px", textTransform: "none" }}>
                        {UIText.library.review.run_ai}
                    </Button>
                </Box>
            ) : (
                <Box sx={{ width: "100%", margin: '0 auto', borderRadius: 2 }}>
                    {/* <Typography variant="body2" sx={{ fontSize: "12px" }}>
                        {UIText.library.review.ai_result.review_content}
                    </Typography> */}
                    {aiResponse.map((item, index) => {
                        const heading = item.originalClause?.heading || '';
                        const categoryType = findCategoryForHeading(heading);
                        const hasCategory = !!categoryType;
                        const hasError = !!item?.data?.detail?.message;

                        return (
                            <Card key={index} elevation={0} onClick={() => handleCardClick(index)}
                                sx={{
                                    my: 1, mt: "8px", borderRadius: 1, display: 'flex', bgcolor: '#F5F5F5', alignItems: 'center',
                                    cursor: 'pointer', height: '35px', '&:hover': { backgroundColor: '#edebeb' }
                                }}>
                                <Box sx={{ minWidth: 48, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <Tooltip title={hasCategory ? `Category: ${categoryType}` :
                                        `Missing category: ${heading}`} placement="left">
                                        <span style={{ display: 'flex' }}>
                                            <MdFlag style={{
                                                color: hasError ? '#F44336' : hasCategory ? '#4CAF50' : '#F44336',
                                                fontSize: 20,
                                                padding: "4px",
                                                borderRadius: "50%",
                                                backgroundColor: "white",
                                            }} />
                                        </span>
                                    </Tooltip>
                                </Box>
                                <CardContent
                                    sx={{
                                        flex: 1,
                                        padding: 0,
                                        height: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        paddingBottom: '0px !important',
                                    }}
                                >
                                    <Typography variant="body2" sx={{ fontSize: '12px', fontWeight: 400, display: 'flex' }}>
                                        {heading}
                                    </Typography>
                                </CardContent>
                            </Card>
                        );
                    })}

                    {isLoading && !isInitialLoading && (
                        <Box sx={{ display: 'flex', flexDirection: "row", margin: "8px" }}>
                            <Loader
                                loaderOverlay={{
                                    position: 'relative',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'flex-start',
                                }}
                                loader={{ size: "18px", color: "#1976D2" }}
                            />
                            <Typography sx={{ padding: "2px", paddingLeft: "8px", color: "#959595", fontSize: "12px", fontWeight: 400 }}>
                                {UIText.library.review.ai_result.processing_more_clauses}
                            </Typography>
                        </Box>
                    )}
                </Box>
            )}

            {info && <Toast info={info} />}
        </>
    );
};

export default AIResults;