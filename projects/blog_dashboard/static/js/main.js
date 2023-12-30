// JavaScript for Delete Post Modal
document.addEventListener('DOMContentLoaded', function() {
    let deleteLinks = document.querySelectorAll('a.delete-post');
    let modal = document.getElementById('deleteModal');
    let closeBtn = document.querySelector('.modal .close');
    let cancelBtn = document.getElementById('cancelDelete');
    let confirmDeleteBtn = document.getElementById('confirmDelete');

    deleteLinks.forEach(function(link) {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            let postUrl = this.href;
            modal.style.display = 'block';

            confirmDeleteBtn.onclick = function() {
                window.location.href = postUrl;
            };
        });
    });

    closeBtn.onclick = function() {
        modal.style.display = 'none';
    };

    cancelBtn.onclick = function() {
        modal.style.display = 'none';
    };

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };
});

// Function to format a date object as "Day Month @ Hour:Minute AM/PM" format
function formatDateTime(date) {
    const options = { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true };
    return date.toLocaleDateString('en-US', options);
}

// Function to update the content of the 'datetime' div
function updateDateTime() {
    const datetimeDiv = document.getElementById('datetime');
    const currentDate = new Date();
    datetimeDiv.textContent = 'Current Date and Time: ' + formatDateTime(currentDate);
}

// Update the date and time initially
updateDateTime();

// Update the date and time every second (1000 milliseconds)
setInterval(updateDateTime, 1000);
