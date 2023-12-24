// Function to toggle text styling
function toggleTextStyle(style) {
    console.log(`Applying style: ${style}`);

    // Toggle class for selected text to reflect the style change
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const span = document.createElement('span');
        span.className = `text-${style}`;
        range.surroundContents(span);
    }
}
