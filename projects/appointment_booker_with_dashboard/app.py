from flask import Flask, render_template, request, redirect, url_for, jsonify
from datetime import datetime
import os
import json

# Create Flask app
app = Flask(__name__, template_folder='templates', static_folder='static')

# Setup JSON data storage
JSON_FILE = 'appointments.json'
def load_appointments():
    if not os.path.exists(JSON_FILE):
        return []
    with open(JSON_FILE, 'r') as f:
        return json.load(f)

def save_appointments(appointments):
    with open(JSON_FILE, 'w') as f:
        json.dump(appointments, f, indent=4, default=str)

def new_id(appointments):
    return max((appointment['id'] for appointment in appointments), default=0) + 1

# Flask route for the main page with the booking form
@app.route('/', methods=['GET', 'POST'])
def book_appointment():
    if request.method == 'POST':
        appointments = load_appointments()
        appointment = {
            'id': new_id(appointments),
            'timestamp': datetime.now().strftime('[%A %B %d, %Y][%I:%M %p]'),
            'appointment_timeslot': request.form['selected_timeslot'],
            'name': request.form['name'],
            'payment_method': request.form['payment_method'],
            'email': request.form['email'],
            'phone': request.form['phone'],  # Add this line
            'confirmed': False
        }
        appointments.append(appointment)
        save_appointments(appointments)
        # return redirect(url_for('dashboard', restored='true'))  # Add query parameter
    return render_template("index.html")

@app.route('/dashboard', methods=['GET'])
def dashboard():
    appointments = load_appointments()

    # Sort appointments by timestamp (you can use any sorting criteria you prefer)
    appointments = sorted(appointments, key=lambda x: x['timestamp'])

    active_appointments = [appt for appt in appointments if not appt.get('deleted', False)]
    deleted_appointments = [appt for appt in appointments if appt.get('deleted', False)]

    return render_template("dashboard.html", 
                           appointments=active_appointments, 
                           deleted_appointments=deleted_appointments)

# Flask route to retrieve all appointments as JSON
@app.route('/api/appointments', methods=['GET'])
def api_appointments():
    appointments = load_appointments()
    active_appointments = [appt for appt in appointments if not appt.get('deleted', False)]
    deleted_appointments = [appt for appt in appointments if appt.get('deleted', False)]
    return jsonify({'active_appointments': active_appointments, 'deleted_appointments': deleted_appointments})

@app.route('/confirm_appointment/<appointment_id>', methods=['POST'])
def confirm_appointment(appointment_id):
    data = request.get_json()
    should_confirm = data.get('confirm', False)
    
    appointments = load_appointments()
    for appointment in appointments:
        if str(appointment['id']) == appointment_id:
            appointment['confirmed'] = should_confirm
            break
    save_appointments(appointments)
    return jsonify({'confirmed': should_confirm})

@app.route('/delete_appointment/<appointment_id>', methods=['POST'])
def delete_appointment(appointment_id):
    appointments = load_appointments()
    for appointment in appointments:
        if str(appointment['id']) == appointment_id:
            appointment['deleted'] = True
            break
    save_appointments(appointments)
    return jsonify({'deleted': True})

@app.route('/delete_permanently_appointment/<appointment_id>', methods=['POST'])
def delete_permanently_appointment(appointment_id):
    appointments = load_appointments()
    appointments = [appointment for appointment in appointments if str(appointment['id']) != appointment_id]
    save_appointments(appointments)
    return jsonify({'deleted_permanently': True})

@app.route('/restore_appointment/<appointment_id>', methods=['POST'])
def restore_appointment(appointment_id):
    appointments = load_appointments()
    for appointment in appointments:
        if str(appointment['id']) == appointment_id:
            appointment.pop('deleted', None)  # Remove the 'deleted' flag if it exists
            break
    save_appointments(appointments)
    return jsonify({'restored': True})

# Correctly placing app.run
if __name__ == "__main__":
    app.run(debug=True)

@app.route('/delete_appointment/<int:appointment_id>', methods=['POST'])
def delete_appointment(appointment_id):
    appointments = load_appointments()
    appointments = [appointment for appointment in appointments if appointment['id'] != appointment_id]
    save_appointments(appointments)
    return jsonify({'status': 'success'})
