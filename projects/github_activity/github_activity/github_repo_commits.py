import requests

# Replace with your GitHub username and Personal Access Token
username = "REPLACE_WITH_YOUR_USERNAME"
token = "REPLACE_WITH_YOUR_TOKEN"

# Create a session with the Authorization header set to your PAT
session = requests.Session()
session.headers.update({'Authorization': f'token {token}'})

# Retrieve the latest repository
repo_url = f'https://api.github.com/users/{username}/repos'
response = session.get(repo_url)
repos = response.json()

# Find the most recently updated repository
latest_repo = max(repos, key=lambda repo: repo['updated_at'])

print("Latest Repository:")
print("Name:", latest_repo['name'])
print("Description:", latest_repo['description'])
print("URL:", latest_repo['html_url'])

# Retrieve the latest commits for the repository
commits_url = latest_repo['commits_url'].replace('{/sha}', '')
response = session.get(commits_url)
commits = response.json()

print("\nLatest Commits:")
for commit in commits[:5]:  # Print the latest 5 commits
    print("SHA:", commit['sha'])
    print("Message:", commit['commit']['message'])
    print("Author:", commit['commit']['author']['name'])
    print("Date:", commit['commit']['author']['date'])
    print()
