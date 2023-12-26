from flask import Flask, render_template, request, redirect, url_for, flash
from flask_wtf.csrf import CSRFProtect
from forms import PostForm
from datetime import datetime
import uuid

app = Flask(__name__, static_folder='static')
app.config['SECRET_KEY'] = 'your_secret_key'  # Change this to a secure key
csrf = CSRFProtect(app)

# Initialize an empty list to store blog posts
sample_posts = []

def sort_posts_by_timestamp():
    if not sample_posts:
        return []

    # Ensure that 'timestamp' is a key in each post dictionary
    if all('timestamp' in post for post in sample_posts):
        return sorted(sample_posts, key=lambda post: post['timestamp'], reverse=True)
    else:
        # Handle the case where 'timestamp' might not be present in all posts
        return []

def get_paginated_posts(page, posts_per_page, posts):
    total_posts = len(posts)
    start = (page - 1) * posts_per_page
    end = start + posts_per_page
    paginated_posts = posts[start:end]
    return paginated_posts, total_posts

@app.route('/')
def index():
    sort_order = request.args.get('sort', 'newest')  # Default to newest
    page = request.args.get('page', 1, type=int)
    posts_per_page = 3

    if sort_order == 'newest':
        sorted_posts = sorted(sample_posts, key=lambda post: post['timestamp'], reverse=True)
    else:  # sort_order == 'oldest'
        sorted_posts = sorted(sample_posts, key=lambda post: post['timestamp'])

    posts, total_posts = get_paginated_posts(page, posts_per_page, sorted_posts)
    total_pages = (total_posts + posts_per_page - 1) // posts_per_page
    return render_template('index.html', posts=posts, page=page, total_pages=total_pages, sort_order=sort_order)

@app.route('/create_post', methods=['GET', 'POST'])
def create_post():
    form = PostForm()
    if form.validate_on_submit():
        title = form.title.data
        content = request.form.get('content')
        timestamp = datetime.now()
        post_id = str(uuid.uuid4())  # Generate a unique UUID

        # Add the new post with the UUID
        sample_posts.append({
            'id': post_id,
            'title': title,
            'content': content,
            'timestamp': timestamp
        })

        # After creating a post, redirect to the home page or a specific post page
        return redirect(url_for('index'))  # Replace 'index' with the appropriate view function if necessary

    # Render the post creation form
    return render_template('create_post.html', form=form)

@app.route('/edit_post/<string:post_id>', methods=['GET', 'POST'])
def edit_post(post_id):
    # Find the post with the matching UUID
    post = next((post for post in sample_posts if post['id'] == post_id), None)

    if post:
        form = PostForm()
        if form.validate_on_submit():
            post['title'] = form.title.data
            post['content'] = request.form.get('content')  # Get the content with styles
            post['last_edit'] = datetime.now()
            flash('Post edited successfully', 'success')
            return redirect(url_for('index'))
        else:
            form.title.data = post['title']
            form.content.data = post['content']

        return render_template('edit_post.html', form=form, post=post)
    else:
        return "Post not found."
    
@app.route('/post/<string:post_id>')
def view_post(post_id):
    # Find the post with the matching UUID
    post = next((post for post in sample_posts if post['id'] == post_id), None)

    if post:
        return render_template('post.html', post=post)
    else:
        return "Post not found."

@app.route('/delete_post/<string:post_id>', methods=['GET', 'POST'])
def delete_post(post_id):
    # Find the post with the matching UUID
    post = next((post for post in sample_posts if post['id'] == post_id), None)

    if post:
        sample_posts.remove(post)  # Remove the post from the list
        flash('Post deleted successfully', 'success')
        return redirect(url_for('index'))
    else:
        return "Post not found."

if __name__ == '__main__':
    app.run(debug=True)
