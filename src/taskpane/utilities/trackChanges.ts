/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
export const addTrackingModeForEveryOne = async () => {
    await Word.run(async (context) => {
        const document: Word.Document = context.document;
        document.changeTrackingMode = Word.ChangeTrackingMode.trackAll;
        await context.sync();
    });
}