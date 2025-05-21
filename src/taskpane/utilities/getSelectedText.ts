/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
export const getSelectedText = async (callback: (error: Error | null, data: any | null) => void) => {
    Office.context.document.addHandlerAsync(Office.EventType.DocumentSelectionChanged, function () {
        Word.run(async function (context) {
            var selection = context.document.getSelection();
            context.load(selection, 'text');

            await context.sync();
            console.log('Selected Text:', selection.text);
            callback(null, selection.text);
        }).catch(function (error) {
            console.error('Error: ' + JSON.stringify(error));
            callback(error, null);
        });
    });
};