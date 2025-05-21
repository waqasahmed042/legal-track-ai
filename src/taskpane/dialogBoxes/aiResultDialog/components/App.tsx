/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { Typography } from '@mui/material';
import UIText from '../../../utilities/textResource';
import Tabs from './tabs/page';

const App: React.FC = () => {
    const [selectedCardData, setSelectedCardData] = useState<any>(null);

    // Get selected card base64 from dialog url
    useEffect(() => {
        const urlParams: URLSearchParams = new URLSearchParams(window.location.search);
        const getSelectedCardData = urlParams.get("selectedCardData");

        // Convert base64 to original data
        if (getSelectedCardData) {
            try {
                // const decodedString = decodeURIComponent(atob(getSelectedCardData));
                const cardData = JSON.parse(getSelectedCardData);
                setSelectedCardData(cardData);
                console.log("Decoded original ai result data:", cardData);
            } catch (error) {
                console.error("Failed to decode ai result data:", error);
            }
        }
    }, []);

    // Ensure the selected card data is loaded before rendering
    if (!selectedCardData) {
        return <Typography sx={{ padding: "10px" }}>{UIText.loading}</Typography>;
    }

    return (
        <>
            <Tabs selectedCardData={selectedCardData} />
        </>
    );
};

export default App;