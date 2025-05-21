/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { Box, Button } from '@mui/material';
import UIText from '../../../utilities/textResource';
import { FiMessageSquare } from 'react-icons/fi';
import { SiOpenai } from 'react-icons/si';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { IoAnalyticsSharp } from 'react-icons/io5';
import AIResults from './aiResult';
import Summarize from './summarize';
import RiskAnalysis from './riskAnalysis';

const page: React.FC = () => {
    const [activeButton, setActiveButton] = useState<string>("");

    const handleRunAIButton = async () => {
        setActiveButton((prev) => (prev === "aiResult" ? null : "aiResult"));
        console.log("Run AI Button Clicked!");
    };

    const handleSummarizeButton = () => {
        setActiveButton((prev) => (prev === "summarize" ? null : "summarize"));
        console.log("Summarize Button Clicked!");
    };

    const handleRiskAnalysisButton = () => {
        setActiveButton((prev) => (prev === "riskAnalysis" ? null : "riskAnalysis"));
        console.log("Risk Analysis Button Clicked!");
    };

    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: "4px",
                    marginTop: 2,
                }}
            >
                {activeButton !== "summarize" &&
                    activeButton !== "riskAnalysis" && (
                        <Button
                            variant="text"
                            sx={{
                                textTransform: "capitalize",
                                color: activeButton ? "primary.main" : "#5f5f5f",
                                gap: "8px",
                                width: "100%",
                                display: "flex",
                                justifyContent: "flex-start",
                                alignItems: "center",
                            }}
                            startIcon={
                                activeButton === "aiResult" ? (
                                    <IoMdArrowRoundBack
                                        style={{
                                            fontSize: "14px",
                                            color: "inherit",
                                        }}
                                    />
                                ) : (
                                    <SiOpenai
                                        style={{
                                            fontSize: "14px",
                                            color: "#5f5f5f",
                                        }}
                                    />
                                )
                            }
                            onClick={handleRunAIButton}
                        >
                            {activeButton === "aiResult"
                                ? UIText.library.review.ai_result.title
                                : UIText.library.review.run_ai}
                        </Button>
                    )}
                {activeButton === "aiResult" && <AIResults />}

                {activeButton !== "aiResult" &&
                    activeButton !== "riskAnalysis" && (
                        <Button
                            variant="text"
                            sx={{
                                textTransform: "capitalize",
                                color: activeButton ? "primary.main" : "#5f5f5f",
                                gap: "8px",
                                width: "100%",
                                display: "flex",
                                justifyContent: "flex-start",
                                alignItems: "center",
                            }}
                            startIcon={
                                activeButton === "summarize" ? (
                                    <IoMdArrowRoundBack
                                        style={{
                                            fontSize: "14px",
                                            color: "inherit",
                                        }}
                                    />
                                ) : (
                                    <FiMessageSquare
                                        style={{
                                            fontSize: "14px",
                                            color: "#5f5f5f",
                                        }}
                                    />
                                )
                            }
                            onClick={handleSummarizeButton}
                        >
                            {activeButton === "summarize"
                                ? UIText.library.review.summary
                                : UIText.library.review.summarize}
                        </Button>
                    )}
                {activeButton === "summarize" && <Summarize />}

                {activeButton !== "aiResult" &&
                    activeButton !== "summarize" && (
                        <Button
                            variant="text"
                            sx={{
                                textTransform: "capitalize",
                                color: activeButton ? "primary.main" : "#5f5f5f",
                                gap: "8px",
                                width: "100%",
                                display: "flex",
                                justifyContent: "flex-start",
                                alignItems: "center",
                            }}
                            startIcon={
                                activeButton === "riskAnalysis" ? (
                                    <IoMdArrowRoundBack
                                        style={{
                                            fontSize: "14px",
                                            color: "inherit",
                                        }}
                                    />
                                ) : (
                                    <IoAnalyticsSharp
                                        style={{
                                            fontSize: "14px",
                                            color: "#5f5f5f",
                                        }}
                                    />
                                )
                            }
                            onClick={handleRiskAnalysisButton}
                        >
                            {UIText.library.review.risk_analysis}
                        </Button>
                    )}
                {activeButton === "riskAnalysis" && <RiskAnalysis />}
            </Box>
        </>
    );
};

export default page;