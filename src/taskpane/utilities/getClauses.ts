/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
export const getClauses = async () => {
    return await Word.run(async (context) => {
        const body = context.document.body;
        body.load("text");

        await context.sync();

        const fullText = body.text;
        console.log("Full Document Text:", fullText);

        // Process the text to extract clauses
        const clauses = extractClauses(fullText);
        return clauses;
    });
};

// Helper function to extract clauses from text
const extractClauses = (text: string) => {
    // Split the text into sections based on numbered headings (e.g., "1.", "2.", etc.)
    const sections = text.split(/(?=\d+\.\s+[A-Z])/);

    // Process each section to extract heading and content
    const processedClauses = sections.map(section => {
        // Skip empty sections
        if (!section.trim()) return null;

        // Extract heading (matches pattern like "1. Services of Consultant.")
        const headingMatch = section.match(/^\d+\.\s+([A-Z][^.\n]+)/);

        // Skip sections without a heading
        if (!headingMatch) return null;

        const heading = headingMatch[1].trim();

        // Skip headings with more than five words
        const wordCount = heading.split(/\s+/).length;
        if (wordCount > 5) return null;

        // Extract the content (everything after the heading)
        const content = section.replace(/^\d+\.\s+[A-Z][^.\n]+\.?\s*/, '').trim();

        // Return null if no content
        if (!content) return null;

        // Create a unique identifier based on heading and content
        const clauseId = `clause_${heading.toLowerCase().replace(/\s+/g, '_')}_${content.length}`;

        return {
            heading: heading,
            clause_text: content,
            clauseId: clauseId
        };
    }).filter(Boolean); // Remove null entries

    return processedClauses;
}