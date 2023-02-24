import instaloader
import sys

# Create an instance of Instaloader class
arguments = sys.argv[1:]

def post_info(url):
    try:
        L = instaloader.Instaloader()

        # Get post information by post URL
        link = url
        shortcode = link[0].split("/")[-2]

        post = instaloader.Post.from_shortcode(L.context, shortcode)

        L.download_post(post, target=f"tmp")
        # Print post information
        post_obj = {
            "caption": post.caption,
            "profilePicture": post.owner_profile.get_profile_pic_url(),
            "username": post.owner_username,
            "likeCount": post.likes,
        }
        return post_obj
    except Exception as e:
        print(e)





