import fs from "fs";
import path from "path";

export const getComponentSource = (relativePath: string) => {
  const fullPath = path.join(process.cwd(), "src", "lib", relativePath);
  let code: { title: string; code: string }[] = [];

  // if directory, get all files
  if (fs.existsSync(fullPath) && fs.lstatSync(fullPath).isDirectory()) {
    const files = fs.readdirSync(fullPath);
    code = files
      .map((file) => {
        const filePath = path.join(fullPath, file);
        const fileContent = fs.readFileSync(filePath, "utf-8");
        return {
          title: file === "index.jsx" ? `${path.basename(fullPath)}.jsx` : file,
          code: fileContent,
        };
      })
      .sort((a) => (a.title === `${path.basename(fullPath)}.jsx` ? -1 : 1));
  } else {
    // if file, get file content and name
    if (!fs.existsSync(`${fullPath}.jsx`) && !fs.existsSync(`${fullPath}.js`)) {
      console.log(`${fullPath}.js(x) does not exist`);
      return [];
    }
    // get file extension
    const fileExt = fs.existsSync(`${fullPath}.js`) ? "js" : "jsx";
    const fileContent = fs.readFileSync(`${fullPath}.${fileExt}`, "utf-8");
    const fileName = path.basename(fullPath);
    code = [{ title: `${fileName}.${fileExt}`, code: fileContent }];
  }
  return code;
};
