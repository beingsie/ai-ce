from flask import Blueprint, render_template
from videos import video_urls  # Import video_urls from the current directory

views_blueprint = Blueprint('views', __name__)

@views_blueprint.route('/')
def index():
    return render_template('index.html', title='Index')

@views_blueprint.route('/feed')
def feed():
    video_embeds = []
    for url in video_urls:
        if "youtu.be" in url:
            # Extract the video_id from the URL
            video_id = url.split("youtu.be/")[1].split("?")[0]
        else:
            # Extract the video_id from the regular YouTube URL
            video_id = url.split("v=")[1].split("?")[0]

        embed_code = f'<iframe width="560" height="315" src="https://www.youtube.com/embed/{video_id}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>'
        video_embeds.append(embed_code)

    return render_template('feed.html', video_embeds=video_embeds, title='Feed')