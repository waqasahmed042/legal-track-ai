/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
import React from 'react'
import { Box, CircularProgress, circularProgressClasses } from '@mui/material';

const Loader = ({ loaderOverlay, loader }) => {
    return (
        <>
            <div style={loaderOverlay}>
                <Box sx={{ position: "relative" }}>
                    <CircularProgress
                        variant="determinate"
                        sx={{
                            color: '#e0e0e0',
                        }}
                        size={loader.size}
                        thickness={4}
                        value={100}
                    />
                    <CircularProgress
                        variant="indeterminate"
                        disableShrink
                        sx={{
                            color: loader.color || '#1a90ff',
                            animationDuration: '550ms',
                            position: 'absolute',
                            left: 0,
                            [`& .${circularProgressClasses.circle}`]: {
                                strokeLinecap: 'round',
                            },
                        }}
                        size={loader.size}
                        thickness={4}
                    />
                </Box>
            </div>
        </>
    )
}

export default Loader;