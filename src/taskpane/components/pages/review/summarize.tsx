/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, IconButton, Typography } from '@mui/material';
import UIText from '../../../utilities/textResource';
import { IoMdResize } from 'react-icons/io';
import { summary } from '../../../utilities/dynamicData';
import { openSummaryDialog } from '../../../utilities/summaryDialog';

const Summarize: React.FC = () => {
    const [wordLimit, setWordLimit] = useState<number>(8);
    const [expandedCardIndex, setExpandedCardIndex] = useState<number | null>(null);

    // Check production or development environment
    const isDevelopment = process.env.NODE_ENV === "development";
    const dialog_url = isDevelopment != false
        ? process.env.DEV_URL
        : process.env.PORD_URL;

    const handleToggleExpandButton = (index: number) => {
        setExpandedCardIndex(expandedCardIndex === index ? null : index);
    };

    const updateWordLimit = () => {
        const screenWidth = window.innerWidth;
        if (screenWidth < 400) {
            setWordLimit(12);
        } else if (screenWidth < 600) {
            setWordLimit(26);
        } else {
            setWordLimit(30);
        }
    };

    // Attach event listener to window resize to update word limit dynamically
    useEffect(() => {
        updateWordLimit();
        window.addEventListener('resize', updateWordLimit);
        return () => window.removeEventListener('resize', updateWordLimit);
    }, []);

    const truncateText = (text: string, wordLimit: number) => {
        const words = text.split(" ");
        return words.length > wordLimit
            ? words.slice(0, wordLimit).join(" ") + ".."
            : text;
    };

    const handleOpenSummaryDialogButton = (summary: any) => {
        openSummaryDialog(dialog_url, summary, (error, data) => {
            if (error) {
                console.error("AI result dialog rrror:", error);
            } else {
                console.log("AI result dialog result:", data);
            }
        });
    }

    return (
        <>
            <Box
                sx={{
                    width: '100%',
                    margin: '0 auto',
                    borderRadius: 2,
                }}
            >
                <Typography sx={{ fontSize: '12px', paddingBottom: '12px' }}>
                    {UIText.library.review.ai_result.review_content}
                </Typography>

                {summary.map((item, index) => (
                    <Card
                        key={index}
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
                            <IconButton onClick={() => handleOpenSummaryDialogButton(item)}>
                                <IoMdResize style={{ fontSize: '12px' }} />
                            </IconButton>
                        </Box>

                        <CardContent sx={{ marginTop: '-20px' }}>
                            {Object.keys(item).map((key) => {
                                if (key.startsWith('title_')) {
                                    const contentKey = key.replace('title_', 'content_');
                                    return (
                                        <Box key={key} sx={{ marginBottom: 2 }}>
                                            <Box
                                                display="flex"
                                                justifyContent="space-between"
                                                alignItems="center"
                                                onClick={() => handleToggleExpandButton(index)}
                                            >
                                                <Typography
                                                    variant="h6"
                                                    sx={{ fontSize: '16px', fontWeight: 'bold' }}
                                                >
                                                    {item[key]}
                                                </Typography>
                                            </Box>
                                            <Typography sx={{ fontSize: '12px', marginTop: "4px" }}>
                                                {expandedCardIndex === index
                                                    ? item[contentKey]
                                                    : truncateText(item[contentKey], wordLimit)}
                                            </Typography>
                                        </Box>
                                    );
                                }
                                return null;
                            })}
                        </CardContent>
                    </Card>
                ))}
            </Box>
        </>
    );
};

export default Summarize;