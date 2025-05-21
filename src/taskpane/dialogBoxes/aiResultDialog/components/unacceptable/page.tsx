/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
import React from 'react';
import { Box, List, ListItem, ListItemText, Typography } from '@mui/material';
import UIText from '../../utilities/textResource';
import { unacceptableProps } from '../../utilities/type';

const Page: React.FC<unacceptableProps> = ({ selectedCardData }) => {
    const unacceptable_reasons = selectedCardData.data.unacceptable_reasons;

    return (
        <>
            <Box sx={{ width: "92%", margin: '20px 40px', borderRadius: 2 }}>
                <Box
                    sx={{
                        border: '2px solid #1976D2',
                        borderRadius: '16px',
                        padding: '8px'
                    }}
                >
                    <Typography variant="h4" fontWeight="bold">{UIText.unacceptable.analysis}</Typography>
                    <Typography variant="body1" fontWeight={400}>{UIText.unacceptable.description}</Typography>

                    <List sx={{ listStyleType: 'disc', paddingLeft: "30px" }}>
                        {Array.isArray(unacceptable_reasons) && unacceptable_reasons.length > 0 ? (
                            unacceptable_reasons.map((reason: string, idx: number) => (
                                <ListItem key={idx} sx={{ display: 'list-item' }}>
                                    <ListItemText primary={reason} />
                                </ListItem>
                            ))
                        ) : (
                            <Typography variant="body2" color="text.secondary">{UIText.unacceptable.not_found}</Typography>
                        )}
                    </List>
                </Box>
            </Box>
        </>
    );
};

export default Page;