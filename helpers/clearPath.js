import fs from 'fs'
import path from 'path'

const clearPath = (dirPath) => {
  fs.readdirSync(dirPath).forEach((file) => {
    const filePath = path.join(dirPath, file);
    if (file !== '.tmp' && fs.statSync(filePath).isFile()) {
      fs.unlinkSync(filePath);
    } else if (fs.statSync(filePath).isDirectory()) {
      clearPath(filePath);
      fs.rmdirSync(filePath);
    }
  });
};

export default clearPath