import { spawn } from "child_process";
import fs from "fs";
import { resolve } from "path";
import imageUploader from "../helpers/imageUploader.js";

const scrap = async () => {
  let fc;
  const promise = new Promise((resolve) => {
    const pythonScript = spawn("python", [
      "src/insta.py",
      "neymarjr",
      "gabcodes",
      "onebitcode"
    ]);

    pythonScript.stdout.on("data", (data) => {
      console.log(`stdout: ${data}`);
    });

    pythonScript.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`);
    });

    pythonScript.on("close", (code) => {
      console.log(`child process exited with code ${code}`);
      fc = code;
      resolve();
    });
  });
  await promise;
  return fc;
};

(async () => {
  const code = await scrap();
  //console.log(code);
  if (code === 0) {
    const jfile = fs.readFileSync("./posts.json");
    const data = JSON.parse(jfile);
    for (let post of data) {
      try {
        const data = await fs.promises.readFile(`./${post.image_path}`);
        let buffer = Buffer.from(data);
        let imageLink = await imageUploader(buffer);
        console.log(imageLink);
      } catch (err) {
        console.error(`Error while reading file ${post.image_path}: ${err}`);
        continue; // Continue to the next iteration
      }

      /* fs.readFile('./' + post.image_path, async (err, data) => {
        if(err) 
        imageLink = await imageUploader(data);
        console.log(imageLink)
      }); */
      //console.log(imageLink);
    }
  }
})();

//console.log(fs.readFileSync('./onebitcode_post/2023-02-16_CouYFFJtCzh.jpg'))
