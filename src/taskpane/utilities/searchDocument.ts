/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
/* eslint-disable office-addins/no-context-sync-in-loop */
export const searchDocument = async (search_text: string): Promise<boolean> => {
    try {
        await Word.run(async (context) => {
            const MAX_SEARCH_LENGTH = 255;
            const SearchOptions = {
                ignoreSpace: false,
                matchCase: false,
            };

            // Split long text into searchable chunks
            const searchChunks: string[] = [];
            for (let i = 0; i < search_text.length; i += MAX_SEARCH_LENGTH) {
                const chunk = search_text.substring(i, i + MAX_SEARCH_LENGTH);
                // Ensure we don't split words
                const lastSpaceIndex = chunk.lastIndexOf(' ');
                const searchableChunk = i + MAX_SEARCH_LENGTH >= search_text.length
                    ? chunk
                    : chunk.substring(0, lastSpaceIndex);

                if (searchableChunk.trim().length > 0) {
                    searchChunks.push(searchableChunk.trim());
                }

                // Adjust i to account for the word boundary
                if (i + MAX_SEARCH_LENGTH < search_text.length) {
                    i -= (chunk.length - lastSpaceIndex);
                }
            }

            // Search for each chunk and remove if found
            for (const chunk of searchChunks) {
                const results = context.document.body.search(chunk, SearchOptions);
                results.load("text");
                await context.sync();

                if (results.items.length > 0) {
                    console.log(`Found text chunk to remove: ${chunk.substring(0, 50)}...`);
                    results.items[0].clear();
                    await context.sync();
                }
            }
        });
        return true;
    } catch (error) {
        console.error("Error searching document:", error);
        return false;
    }
};