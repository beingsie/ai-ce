document.addEventListener('DOMContentLoaded', function () {
    // Event delegation for confirm and restore buttons
    document.body.addEventListener('click', function (e) {
        if (e.target.classList.contains('confirm-btn')) {
            const appointmentId = e.target.dataset.appointmentId;
            const shouldConfirm = !e.target.classList.contains('confirmed');
            confirmAppointment(appointmentId, shouldConfirm, e.target);
        } else if (e.target.classList.contains('restore-btn')) {
            const appointmentId = e.target.dataset.appointmentId;
            restoreAppointment(appointmentId, e.target);
        }
    });

    // Event delegation for delete buttons
    document.body.addEventListener('click', function (e) {
        if (e.target.classList.contains('delete-btn')) {
            const appointmentId = e.target.dataset.appointmentId;
            showDeleteConfirmation(appointmentId);
        }
    });

    // Event handler for confirm delete button in the modal
    document.getElementById('confirmDelete').onclick = function () {
        const appointmentId = document.getElementById('deleteConfirmationModal').getAttribute('data-appointment-id');
        performDeleteAppointment(appointmentId);
    };

    // Event handler for cancel delete button in the modal
    document.getElementById('cancelDelete').onclick = function () {
        hideModal('deleteConfirmationModal');
    };

    // Sort the appointments initially by most recent
    sortAppointments('appointmentsContainer');
    sortAppointments('deletedAppointmentsContainer');

    // Call the function after DOM is ready
    checkAndShowRestoreConfirmationModal();
});

function confirmAppointment(appointmentId, shouldConfirm, button) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    fetch('/confirm_appointment/' + appointmentId, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ 'confirm': shouldConfirm }),
    })
        .then(response => {
            if (response.ok) {
                response.json().then(data => {
                    updateButtonAndStatus(appointmentId, data.confirmed, button);
                    updateConfirmationStatus(appointmentId, data.confirmed);
                });
            } else {
                showModal('Error toggling confirmation status.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showModal('An error occurred: ' + error.message);
        });
}

function updateButtonAndStatus(appointmentId, confirmed, button) {
    if (confirmed) {
        button.classList.add('confirmed');
        button.textContent = 'Unconfirm';
    } else {
        button.classList.remove('confirmed');
        button.textContent = 'Confirm';
    }
}

function updateConfirmationStatus(appointmentId, confirmed) {
    const statusDiv = document.getElementById('status-' + appointmentId); // Ensure you have an element with this id
    if (statusDiv) {
        statusDiv.textContent = confirmed ? 'Yes' : 'No';
    }
}

function showModal(message) {
    const modal = document.getElementById('modalText');
    modal.textContent = message;
    const modalContainer = document.getElementById('confirmationModal');
    modalContainer.style.display = 'block';
    modalContainer.querySelector('.close-btn').onclick = function () {
        modalContainer.style.display = 'none';
    };
    setTimeout(function () {
        modalContainer.style.display = 'none';
    }, 5000);
}

function showDeleteConfirmation(appointmentId) {
    const modal = document.getElementById('deleteConfirmationModal');
    modal.setAttribute('data-appointment-id', appointmentId);
    modal.style.display = 'block';
}

function performDeleteAppointment(appointmentId) {
    fetch('/delete_appointment/' + appointmentId, { method: 'POST' })
        .then(response => {
            if (response.ok) {
                const appointmentDiv = document.getElementById('appointment-' + appointmentId);
                if (appointmentDiv) {
                    appointmentDiv.classList.add('deleted');
                    // Move the appointment div to the deleted list
                    const deletedAppointmentsContainer = document.getElementById('deletedAppointmentsContainer');
                    deletedAppointmentsContainer.appendChild(appointmentDiv);

                    // Update the button text to "Restore" and change its class
                    const deleteButton = document.querySelector(`.delete-btn[data-appointment-id="${appointmentId}"]`);
                    if (deleteButton) {
                        deleteButton.textContent = 'Restore';
                        deleteButton.classList.remove('delete-btn');
                        deleteButton.classList.add('restore-btn');
                    }

                    // Manually sort the deleted appointments list
                    sortAppointments('deletedAppointmentsContainer');
                } else {
                    showModal('Error updating appointment status.');
                }
            } else {
                showModal('Error deleting appointment.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showModal('An error occurred: ' + error.message);
        });

    hideModal('deleteConfirmationModal');
}

function restoreAppointment(appointmentId, button) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    fetch('/restore_appointment/' + appointmentId, {
        method: 'POST',
        headers: headers,
    })
    .then(response => {
        if (response.ok) {
            // Set a flag in sessionStorage to indicate restoration
            sessionStorage.setItem('restoredFlag', 'true');
            
            // Redirect to the same page without the query parameter
            const url = new URL(window.location.href);
            url.searchParams.delete('restored');
            window.location.replace(url.toString());
        } else {
            showModal('Error restoring appointment.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showModal('An error occurred: ' + error.message);
    });
}

// Check for the sessionStorage flag when the page loads
document.addEventListener('DOMContentLoaded', function () {
    checkAndShowRestoreConfirmationModal();
});

function checkAndShowRestoreConfirmationModal() {
    const isSessionRestored = sessionStorage.getItem('restoredFlag');

    if (isSessionRestored === 'true') {
        // Display the success modal
        showRestoreConfirmationModal();

        // Clear the sessionStorage flag
        sessionStorage.removeItem('restoredFlag');
    }
}

function showRestoreConfirmationModal() {
    const modal = document.getElementById('restoreConfirmationModal');
    modal.style.display = 'block';
    const modalText = document.getElementById('restoreModalText');
    modalText.textContent = 'Appointment restored successfully!';

    setTimeout(function () {
        modal.style.display = 'none';
    }, 5000);
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'none';
}

function sortAppointments(containerId) {
    const container = document.getElementById(containerId);
    const appointments = Array.from(container.querySelectorAll('.appointment'));
    appointments.sort((a, b) => {
        const aId = parseInt(a.dataset.appointmentId);
        const bId = parseInt(b.dataset.appointmentId);
        return bId - aId; // Sort in descending order by most recent
    });
    appointments.forEach(appointment => {
        container.appendChild(appointment);
    });
}

function confirmDeletion(appointmentId) {
    if (confirm('Are you sure you want to delete this appointment?')) {
        fetch('/delete_appointment/' + appointmentId, { method: 'POST' })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                document.getElementById('appointment-' + appointmentId).remove();
            }
        });
    }
}
