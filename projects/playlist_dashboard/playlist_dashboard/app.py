from flask import Flask
from views import views_blueprint  # Import views from the current directory

app = Flask(__name__)

# Register the views blueprint
app.register_blueprint(views_blueprint)

if __name__ == '__main__':
    app.run(debug=True)