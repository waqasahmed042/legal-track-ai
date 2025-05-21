/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Button, Stack, TextField } from '@mui/material';
import UIText from '../../utilities/textResource';
import { prefferedProps } from '../../utilities/type';
import Loader from '../../../../components/loader/Loader';

const Page: React.FC<prefferedProps> = ({ preferredStrikedClause, selectedCardData, isLoading }) => {
    const [editingSection, setEditingSection] = useState<'clean' | 'redline' | null>(null);
    const [editedRedlineText, setEditedRedlineText] = useState(preferredStrikedClause || '');
    const [displayText, setDisplayText] = useState(selectedCardData?.data?.preferred_final_clause?.final_clause || '');
    const [displayRedlineText, setDisplayRedlineText] = useState(preferredStrikedClause || '');

    useEffect(() => {
        setEditedRedlineText(preferredStrikedClause || '');
        setDisplayRedlineText(preferredStrikedClause || '');
    }, [preferredStrikedClause]);

    useEffect(() => {
        setDisplayText(selectedCardData?.data?.preferred_final_clause?.final_clause || '');
    }, [selectedCardData]);

    console.log("preferredStrikedClause", preferredStrikedClause);

    const handleReplaceText = (section: 'redline') => {
        if (section === 'redline') {
            console.log("Replacing redline text:", displayRedlineText);
            Office.context.ui.messageParent(JSON.stringify({
                type: 'redline',
                text: displayRedlineText
            }));
        }
    };

    const handleEditText = (section: 'redline') => {
        setEditingSection(section);
    };

    const handleSave = (section: 'redline') => {
        if (section === 'redline') {
            setDisplayRedlineText(editedRedlineText);
        }
        setEditingSection(null);
    };

    return (
        <>
            <Box sx={{ width: "92%", margin: '20px 40px', borderRadius: 2 }}>
                {/* Analysis Section */}
                <Box
                    sx={{
                        border: '2px solid #1976D2',
                        borderRadius: '16px',
                        padding: '8px',
                        marginBottom: '16px'
                    }}
                >
                    <Typography variant="h4" fontWeight="bold">{UIText.preffered.analysis}</Typography>
                    <Typography variant="body1">{UIText.preffered.description}</Typography>

                    <TableContainer component={Paper} sx={{ marginTop: "12px" }}>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: '#2c2c2c' }}>
                                    <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>{UIText.table.issue}</TableCell>
                                    <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>{UIText.table.analysis}</TableCell>
                                    <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>{UIText.table.recommendation}</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {selectedCardData?.data?.preferred_analysis?.map((item: any, index: any) => (
                                    <TableRow key={index}>
                                        <TableCell>{item.issue}</TableCell>
                                        <TableCell>{item.analysis}</TableCell>
                                        <TableCell>{item.recommendation}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>

                {/* Clean Version Section */}
                <Box
                    sx={{
                        border: '2px solid #1976D2',
                        borderRadius: '16px',
                        padding: '8px',
                        marginBottom: '16px'
                    }}
                >
                    <Typography variant="h4" sx={{ fontWeight: "bold" }}>{UIText.preffered.ai_redraft_clean_ersion}</Typography>
                    <Typography variant="body1" sx={{ padding: "12px 0" }}>{UIText.preffered.description_1}</Typography>
                    <Typography variant="body1">{displayText}</Typography>
                </Box>

                {/* Redline Version Section */}
                <Box
                    sx={{
                        border: '2px solid #1976D2',
                        borderRadius: '16px',
                        padding: '8px'
                    }}
                >
                    <Typography variant="h4" sx={{ fontWeight: "bold" }}>{UIText.preffered.ai_redraft_redline_version}</Typography>
                    <Typography variant="body1" sx={{ padding: "12px 0" }}>{UIText.preffered.description_3}</Typography>
                    {editingSection === 'redline' ? (
                        <TextField
                            fullWidth
                            multiline
                            value={editedRedlineText}
                            onChange={(e) => setEditedRedlineText(e.target.value)}
                            variant="outlined"
                            sx={{ marginBottom: 2 }}
                        />
                    ) : (
                        <>
                            {isLoading ? (
                                <Box sx={{ display: 'flex', flexDirection: "row", margin: "8px" }}>
                                    <Loader
                                        loaderOverlay={{
                                            position: 'relative',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'flex-start',
                                        }}
                                        loader={{ size: "20px", color: "#1976D2" }}
                                    />
                                    <Typography sx={{ padding: "2px", paddingLeft: "8px", color: "#959595" }}>
                                        Processing strike data...
                                    </Typography>
                                </Box>
                            ) : (
                                <Typography
                                    variant="body1"
                                    dangerouslySetInnerHTML={{
                                        __html: displayRedlineText
                                            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                            .replace(/~~(.*?)~~/g, '<del>$1</del>')
                                            .replace(/\*\*/g, '')
                                            .replace(/~~/g, ''),
                                    }}
                                />
                            )}
                        </>
                    )}

                    <Stack
                        sx={{
                            marginTop: "8px",
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "end",
                            gap: "12px"
                        }}
                    >
                        {editingSection === 'redline' ? (
                            <Button
                                variant="outlined"
                                size="small"
                                sx={{ textTransform: "capitalize" }}
                                onClick={() => handleSave('redline')}
                            >
                                {UIText.buttons.save}
                            </Button>
                        ) : (
                            <Button
                                variant="outlined"
                                size="small"
                                sx={{ textTransform: "capitalize" }}
                                onClick={() => handleEditText('redline')}
                                disabled={isLoading || !preferredStrikedClause}
                            >
                                {UIText.buttons.edit}
                            </Button>
                        )}
                        <Button
                            variant="contained"
                            size="small"
                            sx={{ textTransform: "capitalize" }}
                            onClick={() => handleReplaceText('redline')}
                        >
                            {UIText.buttons.replace}
                        </Button>
                    </Stack>
                </Box>
            </Box>
        </>
    );
};

export default Page;