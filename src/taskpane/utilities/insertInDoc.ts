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
                addTrackingModeForEveryOne();
                headingRange.insertText("\n" + redlineText, "After");
                await context.sync();

                // Find the newly inserted paragraph and remove default styling
                const insertedParagraphs = context.document.body.search(redlineText, { ignoreSpace: false, matchCase: false });
                insertedParagraphs.load(["paragraphs"]);
                await context.sync();

                if (insertedParagraphs.items.length > 0) {
                    // Assuming the first result is the newly inserted text's paragraph
                    const paragraph = insertedParagraphs.items[0].paragraphs.items[0];
                    paragraph.load("format");
                    await context.sync();

                    // Remove indentation and spacing
                    paragraph.format.leftIndent = 0;
                    paragraph.format.rightIndent = 0;
                    paragraph.format.firstLineIndent = 0;
                    paragraph.format.spaceBefore = 0;
                    paragraph.format.spaceAfter = 0;
                    // You might also consider other properties like lineSpacing, horizontalAlignment etc.

                    await context.sync();
                }
            } else {
                console.log("No heading found in document");
            }
        });
    } catch (error) {
        console.error("Error inserting text in document:", error);
    }
};