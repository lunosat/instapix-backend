import instaloader
import json
import sys

# The first argument is the name of the script, so we skip it
arguments = sys.argv[1:]

def scrape_instagram_posts(users_list):
    try:
        # Create an instance of Instaloader class
        L = instaloader.Instaloader()

        # Create empty list to store post data
        posts_data = []

        # Loop through users and get first post of each user
        for user in users_list:
            profile = instaloader.Profile.from_username(L.context, user)
            posts = profile.get_posts()

            for post in posts:
                # Download image and get image path
                L.download_post(post, target=f"{user}_post")
                image_path = f"{user}_post/{post.date_utc.strftime('%Y-%m-%d_%H-%M-%S')}_UTC.jpg"

                # Get post description and author
                post_description = post.caption
                post_author = post.owner_profile.username

                # Create dictionary with post data and append to posts_data list
                post_data = {
                    "id": len(posts_data) + 1,
                    "image_path": image_path,
                    "description": post_description,
                    "author": post_author
                }
                posts_data.append(post_data)
                break

        # Write post data to JSON file
        with open("posts.json", "w") as f:
            json.dump(posts_data, f, indent=4)
    except:
        print('error')

scrape_instagram_posts(arguments)
