from flask import Flask, render_template, request, redirect, url_for, flash
from flask_wtf.csrf import CSRFProtect
from forms import PostForm
from datetime import datetime

app = Flask(__name__, static_folder='static')
app.config['SECRET_KEY'] = 'your_secret_key'  # Change this to a secure key
csrf = CSRFProtect(app)

# Initialize an empty list to store blog posts
sample_posts = []

def get_paginated_posts(page, posts_per_page):
    total_posts = len(sample_posts)
    start = (page - 1) * posts_per_page
    end = start + posts_per_page
    paginated_posts = sample_posts[start:end]
    return paginated_posts, total_posts

@app.route('/')
def index():
    page = request.args.get('page', 1, type=int)
    posts_per_page = 3
    posts, total_posts = get_paginated_posts(page, posts_per_page)
    total_pages = (total_posts + posts_per_page - 1) // posts_per_page
    return render_template('index.html', posts=posts, page=page, total_pages=total_pages)

@app.route('/post/<int:post_id>')
def view_post(post_id):
    if post_id < len(sample_posts):
        return render_template('post.html', post=sample_posts[post_id])
    else:
        return "Post not found."

@app.route('/create_post', methods=['GET', 'POST'])
def create_post():
    form = PostForm()
    if form.validate_on_submit():
        title = form.title.data
        content = request.form.get('content')  # Get the content with styles
        timestamp = datetime.now()
        last_edit = None

        # Add the new post to the list of sample_posts
        sample_posts.append({'title': title, 'content': content, 'timestamp': timestamp, 'last_edit': last_edit})

        # Sort the posts after adding the new post
        sample_posts.sort(key=lambda post: post['timestamp'], reverse=True)

        flash('Post created successfully', 'success')
        return redirect(url_for('index'))
    return render_template('create_post.html', form=form)

@app.route('/edit_post/<int:post_id>', methods=['GET', 'POST'])
def edit_post(post_id):
    if post_id < len(sample_posts):
        post = sample_posts[post_id]
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

@app.route('/delete_post/<int:post_id>', methods=['GET', 'POST'])
def delete_post(post_id):
    if post_id < len(sample_posts):
        sample_posts.pop(post_id)  # Remove the post from the list
        flash('Post deleted successfully', 'success')
        return redirect(url_for('index'))
    else:
        return "Post not found."

if __name__ == '__main__':
    app.run(debug=True)
