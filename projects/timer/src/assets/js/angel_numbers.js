// Function for handling Search by clicking the button
function findMeaning() {
    const number = document.getElementById("numberInput").value;
    fetch('angel_numbers.json')
        .then(response => response.json())
        .then(data => {
            const meaning = data[number];
            const meaningDisplay = document.getElementById("meaning");
            meaningDisplay.innerText = "Angel number unavailable";
            if (meaning) {
                meaningDisplay.innerHTML = createLinksInText(meaning);
                meaningDisplay.querySelectorAll('a').forEach(link => {
                    link.addEventListener('click', (event) => {
                        event.preventDefault();
                        const selectedNumber = link.textContent;
                        document.getElementById("numberInput").value = selectedNumber;
                        findMeaning();
                    });
                });
                meaningDisplay.style.color = 'black';
            } else {
                meaningDisplay.innerText = "Angel number unavailable";
                meaningDisplay.style.color = 'red';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById("meaning").innerText = "There was an error fetching the angel numbers.";
            document.getElementById("meaning").style.color = 'red';
        });
}

function createLinksInText(text) {
    return text.replace(/\b(\d+)\b/g, '<a href="#" class="angel-number-link">$1</a>');
}

// Fetch and handle data
const fetchData = async (url) => {
    try {
        const response = await fetch(url);
        return response.json();
    } catch (error) {
        console.error('Error:', error);
        document.getElementById("meaning").innerText = "Error fetching angel numbers.";
        document.getElementById("meaning").style.color = 'red';
    }
};

// Handle number selection
async function selectNumber(number) {
    const data = await fetchData('angel_numbers.json');
    const meaningDisplay = document.getElementById("meaning");
    const matchDisplay = document.getElementById("closestMatch");

    if (data && data[number]) {
        document.getElementById("numberInput").value = number;
        findMeaning();
        matchDisplay.innerHTML = `Search ${number}`;
    } else {
        meaningDisplay.innerText = "Angel number unavailable";
        meaningDisplay.style.color = 'red';
        matchDisplay.innerHTML = "No close match found.";
    }
}

// Handle Search and dynamic match display
async function SearchAsYouType() {
    const inputText = this.value;
    const matchDisplay = document.getElementById("closestMatch");
    matchDisplay.innerHTML = inputText === "" ? "Search for an angel number" : await findClosestMatch(inputText);
}

// Find closest match
async function findClosestMatch(inputText) {
    const data = await fetchData('angel_numbers.json');
    if (data[inputText]) return `Search <a href="#" onclick="selectNumber('${inputText}'); return false;">${inputText}</a>`;

    let closestMatch = "";
    let shortestDistance = Infinity;

    for (const number in data) {
        if (number.startsWith(inputText)) {
            const currentDistance = Math.abs(number.length - inputText.length);
            if (currentDistance < shortestDistance) {
                closestMatch = number;
                shortestDistance = currentDistance;
            }
        }
    }

    return closestMatch ? `Search <a href="#" onclick="selectNumber('${closestMatch}'); return false;">${closestMatch}</a>` : "No close match found.";
}

// Event listeners
document.getElementById("findMeaning").addEventListener("click", findMeaning);
document.getElementById("numberInput").addEventListener("input", SearchAsYouType);