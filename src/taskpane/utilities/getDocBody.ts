/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
export const getDocumentText = async (): Promise<string> => {
    return await Word.run(async (context) => {
        const doc = context.document;
        const body = doc.body;

        // Load the content of the document
        body.load("text");

        await context.sync();

        // Get the entire text content of the body
        const documentText = body.text;

        return documentText;
    });
};