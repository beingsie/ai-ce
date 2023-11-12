from flask import Blueprint, render_template
import requests
import os 

views_blueprint = Blueprint('views', __name__)

@views_blueprint.route('/')
def display_github_data():
    # Read GitHub credentials from environment variables
    username = os.environ.get('GITHUB_USERNAME')
    token = os.environ.get('GITHUB_TOKEN')

    # Create a session with the Authorization header set to your PAT
    session = requests.Session()
    session.headers.update({'Authorization': f'token {token}'})

    # Retrieve all repositories for the user
    repo_url = f'https://api.github.com/users/{username}/repos'
    response = session.get(repo_url)

    if response.status_code == 200:
        # If the response status code is 200 (OK), parse the JSON data
        repos = response.json()

        # Sort the repositories by their last update date in descending order
        repos = sorted(repos, key=lambda repo: repo.get('updated_at', ''), reverse=True)

        # Create a list to store data for multiple recent repositories and their commits
        recent_repos_data = []

        # Limit the number of repositories to fetch (e.g., fetch data for the last 3 recent repositories)
        num_recent_repos = 5

        for repo in repos[:num_recent_repos]:
            # Retrieve the latest commits for each repository
            commits_url = repo['commits_url'].replace('{/sha}', '')
            response = session.get(commits_url)
            commits = response.json()

            # Create a dictionary with data for each repository, including the username
            repo_data = {
                "username": username,
                "repo_name": repo['name'],
                "repo_description": repo['description'],
                "repo_url": repo['html_url'],
                "repo_commits": commits[:5]  # Latest 4 commits for each repository
            }

            recent_repos_data.append(repo_data)

        # Render the template with the data for recent repositories
        return render_template('index.html', title='Home', recent_repos_data=recent_repos_data)

    else:
        # If the response status code is not 200, handle the error accordingly
        return f"Error: {response.status_code}"