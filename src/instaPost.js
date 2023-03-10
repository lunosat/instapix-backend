import { spawn } from "child_process";
import fs from "fs";
import imageUploader from "../helpers/imageUploader.js";
import axios from 'axios'

const scrap = async (url) => {
  let fc;
  let obj;
  const promise = new Promise((resolve) => {
    const pythonScript = spawn("python", ["helpers/insta_post.py", url]);

    pythonScript.stdout.on("data", (data) => {
      console.log(`stdout: ${data}`);
      obj = `${data}`;
    });

    pythonScript.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`);
    });

    pythonScript.on("close", (code) => {
      fc = code;
      resolve();
    });
  });
  await promise;
  obj = JSON.parse(obj.replace(/'/g, '"'));
  obj.code = fc;
  return obj;
};

const createPost = async (url) => {
  try {
    const info = await scrap(url);
    let postInfo;
    if (info.code === 0) {
      const files = fs.readdirSync("tmp");
      const images = files.filter((v) => v.endsWith(".jpg"));
      const image = await fs.promises.readFile(`./tmp/${images[0]}`);
      const buffer = Buffer.from(image);
      const imageLink = await imageUploader(buffer);
      const profilePictureBuffer= await axios.get(info.profilePicture, {responseType: 'arraybuffer'})
      const profilePictureLink = await imageUploader(profilePictureBuffer.data)

      postInfo = {
        username: info.username,
        profilePicture: profilePictureLink,
        image: imageLink,
        likeCount: info.likeCount,
        description: info.caption,
        timeAgo: {
          type: "minutes",
          time: `${Math.floor(Math.random() * 60)}`,
        },
      };
    }
    return postInfo;
  } catch (e) {
    return { error: e.message };
  }
};

export default createPost;
