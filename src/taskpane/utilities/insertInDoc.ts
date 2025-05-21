/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
import { searchDocument } from "./searchDocument";
import { addTrackingModeForEveryOne } from "./trackChanges";

export const insertInDoc = async (text: string) => {
    try {
        await Word.run(async (context) => {
            const selection = context.document.getSelection();
            selection.insertText(text, Word.InsertLocation.after);
            await context.sync();
        });
    } catch (error) {
        console.error("Error inserting text in Word document:", error);
    }
};

export const replaceTextInDocument = async (heading: string, newText: string, clauseText: string) => {
    try {
        await Word.run(async (context) => {
            const MAX_SEARCH_LENGTH = 255;
            const SearchOptions = {
                ignoreSpace: false,
                matchCase: false,
            };

            // Remove the clause text first
            try {
                await searchDocument(clauseText);
                await context.sync();
            } catch (searchError) {
                console.error("Error searching clause text:", searchError);
            }

            // Ensure heading search string isn't too long
            const searchHeading = heading.length > MAX_SEARCH_LENGTH
                ? heading.substring(0, MAX_SEARCH_LENGTH)
                : heading;

            // Search for the heading in the document
            const headingResults = context.document.body.search(searchHeading, SearchOptions);
            headingResults.load(["text", "paragraphs"]);
            await context.sync();

            if (headingResults.items.length > 0) {
                const headingRange = headingResults.items[0];

                // Remove the markdown symbols from new text
                const redlineText = newText
                    .replace(/\*\*(.*?)\*\*/g, '$1')
                    .replace(/~~(.*?)~~/g, '$1');

                // Insert a line break and the clean text after the heading
                await addTrackingModeForEveryOne();
                headingRange.insertText("\n" + redlineText, "After");
                await context.sync();

                // For searching the newly inserted text, use the first 255 characters
                // The following code related to applying formatting is removed as requested.

                // const searchText = cleanText.length > MAX_SEARCH_LENGTH
                //     ? cleanText.substring(0, MAX_SEARCH_LENGTH)
                //     : cleanText;

                // const insertedTextRange = context.document.body.search(searchText, SearchOptions);
                // insertedTextRange.load(["text"]);
                // await context.sync();

                // if (insertedTextRange.items.length > 0) {
                //     const insertedRange = insertedTextRange.items[0];

                //     // Apply formatting
                //     const boldMatches = newText.match(/\*\*(.*?)\*\*/g) || [];
                //     const strikeMatches = newText.match(/~~(.*?)~~/g) || [];

                //     const boldRanges = [];
                //     const strikeRanges = [];

                //     // Collect all ranges that need formatting
                //     for (const match of boldMatches) {
                //         const text = match.replace(/\*\*/g, '');
                //         // Ensure search text isn't too long
                //         const searchBoldText = text.length > MAX_SEARCH_LENGTH
                //             ? text.substring(0, MAX_SEARCH_LENGTH)
                //             : text;
                //         const boldRange = insertedRange.search(searchBoldText, { ignoreSpace: false, matchCase: false });
                //         boldRanges.push(boldRange);
                //     }

                //     for (const match of strikeMatches) {
                //         const text = match.replace(/~~/g, '');
                //         // Ensure search text isn't too long
                //         const searchStrikeText = text.length > MAX_SEARCH_LENGTH
                //             ? text.substring(0, MAX_SEARCH_LENGTH)
                //             : text;
                //         const strikeRange = insertedRange.search(searchStrikeText, { ignoreSpace: false, matchCase: false });
                //         strikeRanges.push(strikeRange);
                //     }

                //     if (boldRanges.length > 0) {
                //         boldRanges.forEach(r => r.load("font"));
                //     }
                //     if (strikeRanges.length > 0) {
                //         strikeRanges.forEach(r => r.load("font"));
                //     }

                //     await context.sync();

                //     boldRanges.forEach(r => {
                //         r.items.forEach((item: { font: { bold: boolean; }; }) => {
                //             item.font.bold = true;
                //         });
                //     });

                //     strikeRanges.forEach(r => {
                //         r.items.forEach((item: { font: { strikeThrough: boolean; }; }) => {
                //             item.font.strikeThrough = true;
                //         });
                //     });

                //     await context.sync();
                // }
            } else {
                console.log("No heading found in document");
            }
        });
    } catch (error) {
        console.error("Error inserting text in document:", error);
    }
};