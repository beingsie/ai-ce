document.addEventListener("DOMContentLoaded", function () {
    async function fetchData() {
        try {
            // Make an AJAX request to the Flask route
            const response = await fetch('/'); // Change the route if needed
            const data = await response.text();

            // Display the data in the <pre> element
            const preElement = document.getElementById('github-data');
            preElement.textContent = data;
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    // Call the fetchData function when the page loads
    fetchData();
});