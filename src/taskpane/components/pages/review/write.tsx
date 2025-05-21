/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
import React, { useState, useRef } from 'react';
import { Box, Button, Card, CardContent, Typography, IconButton } from '@mui/material';
import UIText from '../../../utilities/textResource';
import Loader from '../../loader/Loader';
import { IoMdResize } from 'react-icons/io';
import { insertInDoc } from '../../../utilities/insertInDoc';
import { openWriteDialog } from '../../../utilities/writeDialog';

const Write: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [promptContent, setPromptContent] = useState<string>(UIText.library.review.write_page.prompt);
    const [promptResult, setPromptResult] = useState('');
    const [submitResult, setSubmitResult] = useState('');
    const [resultError, setResultError] = useState('');
    const contentRef = useRef<HTMLDivElement | null>(null);

    // Check production or development environment
    const isDevelopment = process.env.NODE_ENV === "development";
    const dialog_url = isDevelopment != false
        ? process.env.DEV_URL
        : process.env.PORD_URL;

    // Handle Submit button click
    const handleSubmitButton = () => {
        const submitResult = 'This is submit result for the clauses.';
        setSubmitResult(submitResult);
        setResultError('');
    }

    // Handle prompt content change when the card is edited
    const handlePromptContentChange = () => {
        if (contentRef.current) {
            setPromptContent(contentRef.current.innerHTML);
        }
    };

    // Handle prompt result change when the card is edited
    const handlePromptResultChange = (event: React.ChangeEvent<HTMLDivElement>) => {
        setPromptResult(event.target.innerText);
    }

    // Insert result in word document
    const handleInsertInDocButton = async () => {
        await insertInDoc(submitResult);
    }

    const handleOpenWriteDialogButton = () => {
        setIsLoading(true);
        const submitResult = 'This is submit result for the clauses.';

        openWriteDialog(dialog_url, submitResult, (error, data) => {
            if (error) {
                console.error("Risk analysis dialog rrror:", error);
            } else {
                console.log("Risk analysis dialog result:", data);
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
            <Box
                sx={{
                    width: "100%",
                    margin: '0 auto',
                    borderRadius: 2,
                }}
            >
                <Typography sx={{ fontSize: "12px" }}>
                    {UIText.library.review.ai_result.review_content}
                </Typography>

                <Card
                    sx={{
                        marginBottom: 2,
                        border: '1px solid #ddd',
                        boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
                        borderRadius: 2,
                        cursor: 'pointer',
                        marginTop: "8px",
                        transition: 'transform 0.3s ease-in-out',
                        '&:hover': {
                            transform: 'scale(1.05)',
                        },
                    }}
                >
                    <CardContent>
                        <div
                            contentEditable
                            suppressContentEditableWarning
                            ref={contentRef}
                            style={{
                                minHeight: "50px",
                                borderRadius: '5px',
                                fontSize: '14px',
                                outline: 'none',
                            }}
                            onInput={handlePromptContentChange}
                            dangerouslySetInnerHTML={{ __html: promptContent }}
                        />
                    </CardContent>
                </Card>

                <Button
                    variant="contained"
                    color="primary"
                    sx={{
                        textTransform: "capitalize",
                        whiteSpace: "nowrap",
                        width: "50%",
                        maxWidth: "600"
                    }}
                    onClick={handleSubmitButton}
                >
                    {UIText.library.review.write_page.submit}
                </Button>

                <Card
                    sx={{
                        marginBottom: 2,
                        border: '1px solid #ddd',
                        boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
                        borderRadius: 2,
                        cursor: 'pointer',
                        marginTop: "16px",
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
                        <IconButton onClick={handleOpenWriteDialogButton}>
                            <IoMdResize style={{ fontSize: '12px' }} />
                        </IconButton>
                    </Box>

                    <Box sx={{ marginTop: "-30px" }}>
                        <CardContent>
                            <div
                                contentEditable
                                suppressContentEditableWarning
                                style={{
                                    minHeight: "100px",
                                    borderRadius: '5px',
                                    fontSize: '14px',
                                    outline: 'none',
                                }}
                                onInput={handlePromptResultChange}
                                dangerouslySetInnerHTML={{
                                    __html: promptResult ||
                                        UIText.library.review.write_page.result_for_the_clauses
                                }}
                            />
                        </CardContent>
                    </Box>
                </Card>
                <Typography sx={{ fontSize: "10px", color: "red" }}>{resultError}</Typography>


                <Button
                    variant="contained"
                    color="primary"
                    sx={{
                        textTransform: "capitalize",
                        whiteSpace: "nowrap",
                        width: "50%",
                        maxWidth: "600"
                    }}
                    onClick={handleInsertInDocButton}
                >
                    {UIText.library.review.write_page.insert_in_doc}
                </Button>
            </Box>
        </>
    );
};

export default Write;