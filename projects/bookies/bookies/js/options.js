// Function to update the options/settings page with customLinks data
function updateOptionsPage() {
    // Retrieve customLinks from storage.sync
    chrome.storage.sync.get(["customLinks"], function (data) {
        const customLinks = data.customLinks || {};

        // Populate the list of existing links dynamically
        const linkList = document.getElementById("linkList");
        linkList.innerHTML = ""; // Clear existing items

        for (const linkName in customLinks) {
            const listItem = document.createElement("li");
            listItem.textContent = linkName;
            linkList.appendChild(listItem);
        }
    });
}

// Call updateOptionsPage when the options page is loaded
document.addEventListener("DOMContentLoaded", function () {
    updateOptionsPage();
});

// Listen for changes in the customLinks data
chrome.storage.onChanged.addListener(function (changes, namespace) {
    if (namespace === "sync" && "customLinks" in changes) {
        updateOptionsPage();
    }
});

// Listen for messages from the background script
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.customLinks) {
        updateOptionsPage(message); // Update the options/settings page with customLinks data
    } else {
        console.log("Received message:", message); // Add this line for debugging
    }
});

// Helper function to validate and fix URLs
function fixUrl(url) {
    // Check if the URL starts with "http://" or "https://"
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
        // If not, assume it's an HTTP URL by default
        url = "http://" + url;
    }
    return url;
}

// Example code to add a new link:
const addLinkButton = document.getElementById("addLink");
addLinkButton.addEventListener("click", function () {
    const linkNameInput = document.getElementById("linkName");
    const linkUrlInput = document.getElementById("linkUrl");

    const newLinkName = linkNameInput.value;
    let newLinkUrl = linkUrlInput.value;

    // Add validation and error handling here
    // Ensure that newLinkName is unique

    // Fix the URL if it's missing "http://" or "https://"
    newLinkUrl = fixUrl(newLinkUrl);

    // Send a message to the background script to add the new link
    chrome.runtime.sendMessage({ addLink: { name: newLinkName, url: newLinkUrl } });

    // Clear input fields
    linkNameInput.value = "";
    linkUrlInput.value = "";

    // Update the options page immediately
    updateOptionsPage();
});

// Example code to update an existing link:
const updateLinkButton = document.getElementById("updateLink");
updateLinkButton.addEventListener("click", function () {
    const linkNameInput = document.getElementById("linkName");
    const linkUrlInput = document.getElementById("linkUrl");

    const linkNameToUpdate = linkNameInput.value;
    let newLinkUrl = linkUrlInput.value;

    // Fix the URL if it's missing "http://" or "https://"
    newLinkUrl = fixUrl(newLinkUrl);

    // Send a message to the background script to update the existing link
    chrome.runtime.sendMessage({ updateLink: { name: linkNameToUpdate, url: newLinkUrl } });

    // Clear input fields
    linkNameInput.value = "";
    linkUrlInput.value = "";

    // Update the options page immediately
    updateOptionsPage();
});

// Example code to delete an existing link:
const deleteLinkButton = document.getElementById("deleteLink");
deleteLinkButton.addEventListener("click", function () {
    const linkNameInput = document.getElementById("linkName");

    const linkNameToDelete = linkNameInput.value;

    // Send a message to the background script to delete the existing link
    chrome.runtime.sendMessage({ deleteLink: { name: linkNameToDelete } });

    // Clear input fields
    linkNameInput.value = "";

    // Update the options page immediately
    updateOptionsPage();
});