/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { Box, Button } from '@mui/material';
import { FaPlus } from "react-icons/fa6";
import { IoSearch } from "react-icons/io5";
import UIText from '../../../utilities/textResource';
import AddClause from './addClause';
import SearchLibrary from './searchLibrary';
import { IoMdArrowRoundBack } from "react-icons/io";

const Page: React.FC = () => {
    const [activeButton, setActiveButton] = useState<string>("");

    const handleAddClauseButton = () => {
        setActiveButton((prev) => (prev === "addClause" ? null : "addClause"));
        console.log("Add Clause Button Clicked!");
    };

    const handleSearchLibraryButton = () => {
        setActiveButton((prev) => (prev === "searchLibrary" ? null : "searchLibrary"));
        console.log("Search Library Button Clicked!");
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
                {/* Conditionally Render AddClause Button or Component */}
                {activeButton !== "searchLibrary" && (
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
                            activeButton === "addClause" ? (
                                <IoMdArrowRoundBack
                                    style={{
                                        fontSize: "14px",
                                        color: "inherit",
                                    }}
                                />
                            ) : (
                                <FaPlus
                                    style={{
                                        fontSize: "14px",
                                        color: "#5f5f5f",
                                    }}
                                />
                            )
                        }
                        onClick={handleAddClauseButton}
                    >
                        {UIText.library.clause_management.add_clause.title}
                    </Button>
                )}
                {activeButton === "addClause" && <AddClause />}

                {/* Conditionally Render SearchLibrary Button or Component */}
                {activeButton !== "addClause" && (
                    <Button
                        variant="text"
                        color="primary"
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
                            activeButton === "searchLibrary" ? (
                                <IoMdArrowRoundBack
                                    style={{
                                        fontSize: "14px",
                                        color: "inherit",
                                    }}
                                />
                            ) : (
                                <IoSearch
                                    style={{
                                        fontSize: "14px",
                                        color: "#5f5f5f",
                                    }}
                                />
                            )
                        }
                        onClick={handleSearchLibraryButton}
                    >
                        {UIText.library.clause_management.search_library.title}
                    </Button>
                )}
                {activeButton === "searchLibrary" && <SearchLibrary />}
            </Box>
        </>
    );
};

export default Page;