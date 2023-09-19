// Define your customLinks with default values
const customLinks = {
    "Google": "https://www.google.com",
    "OpenAI": "https://www.openai.com",
    // Add more options here as needed
};

// Use the onInstalled event to initialize storage.sync in your background script
chrome.runtime.onInstalled.addListener(function () {
    // Set the initial customLinks data in storage.sync
    chrome.storage.sync.set({ customLinks }, function () {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
        }
    });
});

// Function to create context menu items
function createContextMenuItems() {
    for (const linkName in customLinks) {
        chrome.contextMenus.create({
            id: linkName,
            title: linkName,
            contexts: ["all"],
        });
    }

    // Create the main link in the context menu to open the options/settings page
    chrome.contextMenus.create({
        id: "customizeLinks",
        title: "✨ Customization",
        contexts: ["all"],
    });
}

// Function to open the options/settings page
function openOptionsPage() {
    chrome.runtime.openOptionsPage();
}

// Function to update context menu items based on customLinks
function updateContextMenuItems() {
    chrome.contextMenus.removeAll();
    createContextMenuItems();
}

// Call createContextMenuItems() when the extension is installed or updated
chrome.runtime.onInstalled.addListener(function () {
    createContextMenuItems();
});

// Handle the context menu click event using chrome.contextMenus.onClicked
chrome.contextMenus.onClicked.addListener(function (info, tab) {
    if (info.menuItemId) {
        // Check if the clicked menu item is the "customizeLinks" menu item
        if (info.menuItemId === "customizeLinks") {
            // Open the options/settings page when "Customize Links" is clicked
            openOptionsPage();
        } else {
            // Retrieve the custom link from storage.sync
            chrome.storage.sync.get(["customLinks"], function (data) {
                const storedCustomLinks = data.customLinks || {};

                // Check if the clicked menu item exists in customLinks
                if (info.menuItemId in storedCustomLinks) {
                    // Open the custom link in a new tab
                    const linkUrl = storedCustomLinks[info.menuItemId];
                    chrome.tabs.create({ url: linkUrl });
                } else {
                    console.error("Link URL not found for the selected menu item.");
                }
            });
        }
    } else {
        // Display a message to the user
        alert("The context menu item was not created by this extension.");
    }
});

// Listen for messages from the options page
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.addLink) {
        // Add a new link
        customLinks[message.addLink.name] = message.addLink.url;
        updateContextMenuItems();
        sendResponse({ success: true });

        // Additionally, update the storage.sync with the updated customLinks
        chrome.storage.sync.set({ customLinks }, function () {
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError);
            }
        });
    } else if (message.updateLink) {
        // Update an existing link
        const linkName = message.updateLink.name;
        customLinks[linkName] = message.updateLink.url;
        updateContextMenuItems();
        sendResponse({ success: true });

        // Additionally, update the storage.sync with the updated customLinks
        chrome.storage.sync.set({ customLinks }, function () {
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError);
            }
        });
    } else if (message.deleteLink) {
        // Delete an existing link
        const linkName = message.deleteLink.name;
        delete customLinks[linkName];
        updateContextMenuItems();
        sendResponse({ success: true });

        // Additionally, update the storage.sync with the updated customLinks
        chrome.storage.sync.set({ customLinks }, function () {
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError);
            }
        });
    }
});