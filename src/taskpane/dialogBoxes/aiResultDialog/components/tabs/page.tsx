/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import UIText from '../../utilities/textResource';
import { Token } from '../../utilities/accessToken';
import Acceptable from '../acceptable/page';
import Preferred from '../preffered/page';
import Unacceptable from '../unacceptable/page';
import { getStrikeData } from '../../services/getStrikeData';

const Page: React.FC<{ selectedCardData: any }> = ({ selectedCardData }) => {
    const accessToken = Token();
    const [selectedTab, setSelectedTab] = useState(0);
    const [preferredStrikedClause, setPreferredStrikedClause] = useState("");
    const [acceptableStrikedClause, setAcceptableStrikedClause] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
        setSelectedTab(newValue);
    };

    // Move pollStrikeData outside of useEffect
    const pollStrikeData = (error: Error | null, data: any) => {
        if (error) {
            console.log("Get Strike Data failed", error);
            setIsLoading(false);
        } else {
            console.log("Get Strike Data success", data);
            if (data?.status === 'pending') {
                // If still pending, wait 5 seconds and call again
                setTimeout(() => {
                    const task_id = selectedCardData?.data.task_id;
                    if (task_id) {
                        getStrikeData(accessToken, task_id, pollStrikeData);
                    }
                }, 5000);
                return;
            }

            if (data?.data) {
                setPreferredStrikedClause(data.data.preferred_striked_clause || "");
                setAcceptableStrikedClause(data.data.acceptable_striked_clause || "");
                setIsLoading(false);
            }
        }
    };

    useEffect(() => {
        const task_id = selectedCardData?.data.task_id;
        console.log("selectedCardData:", selectedCardData);
        console.log("task_id:", task_id);

        if (!task_id) {
            console.log("Task ID not available, retrying in 5 seconds...");
            setTimeout(() => {
                const newTaskId = selectedCardData?.task_id;
                if (newTaskId) {
                    getStrikeData(accessToken, newTaskId, pollStrikeData);
                }
            }, 5000);
            return;
        }

        getStrikeData(accessToken, task_id, pollStrikeData);
    }, [selectedCardData?.task_id, accessToken]);

    return (
        <Box>
            <Tabs
                value={selectedTab}
                onChange={handleTabChange}
                indicatorColor="primary"
                variant="fullWidth"
                color="black"
            >
                <Tab label={UIText.tabs.preffered} sx={{ textTransform: "capitalize", fontSize: "12px" }} />
                <Tab label={UIText.tabs.acceptable} sx={{ textTransform: "capitalize", fontSize: "12px" }} />
                <Tab label={UIText.tabs.unacceptable} sx={{ textTransform: "capitalize", fontSize: "12px" }} />
            </Tabs>

            <Box sx={{ padding: 2 }}>
                {selectedTab === 0 && <Preferred preferredStrikedClause={preferredStrikedClause} selectedCardData={selectedCardData} isLoading={isLoading} />}
                {selectedTab === 1 && <Acceptable acceptableStrikedClause={acceptableStrikedClause} selectedCardData={selectedCardData} isLoading={isLoading} />}
                {selectedTab === 2 && <Unacceptable selectedCardData={selectedCardData} unacceptableStrikedClause={''} />}
            </Box>
        </Box>
    );
};

export default Page;
