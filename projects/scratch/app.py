import json, os
from flask import Flask, render_template, request, redirect, url_for, session, flash
from werkzeug.security import generate_password_hash, check_password_hash   

app = Flask(__name__)
app.secret_key = os.environ.get('FLASK_SECRET_KEY', 'default_secret_key')

JSON_FILE_PATH = 'users.json'

def save_users_to_file(users):
    try:
        with open(JSON_FILE_PATH, 'w') as file:
            json.dump(users, file)
    except Exception as e:
        print(f"Error saving users to file: {e}")

def load_users_from_file():
    try:
        with open(JSON_FILE_PATH, 'r') as file:
            return json.load(file)
    except FileNotFoundError:
        return {}
    except Exception as e:
        print(f"Error loading users from file: {e}")
        return {}

@app.route('/')
def index():
    if not session.get('logged_in'):
        return redirect(url_for('login'))
    else:
        users = load_users_from_file()
        usernames = list(users.keys())  # Extract only usernames
        usernames_json = json.dumps(usernames)
        return render_template('index.html', username=session.get('username'), usernames_json=usernames_json)

@app.route('/login', methods=['GET', 'POST'])
def login():
    users = load_users_from_file()
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        user_hashed_password = users.get(username)
        if user_hashed_password and check_password_hash(user_hashed_password, password):
            session['logged_in'] = True
            session['username'] = username
            return redirect(url_for('index'))
        else:
            flash('Invalid Credentials. Please try again.')
    return render_template('login.html')

@app.route('/logout')
def logout():
    session['logged_in'] = False
    session.pop('username', None)
    return redirect(url_for('login'))

@app.route('/register', methods=['GET', 'POST'])
def register():
    users = load_users_from_file()
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        if username in users:
            flash('Username already exists.')
        else:
            hashed_password = generate_password_hash(password)
            users[username] = hashed_password
            save_users_to_file(users)
            flash('Registration successful! Please login.')
            return redirect(url_for('login'))
    return render_template('register.html')

if __name__ == '__main__':
    app.run(debug=True)
