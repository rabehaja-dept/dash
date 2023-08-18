const fs = require("fs");
const path = require("path");
const globby = require("globby");

const removeClassNames = (filePath) => {
  const content = fs.readFileSync(filePath, "utf8");
  const regex = / className="[^"]*"/g;
  const updatedContent = content.replace(regex, "");
  fs.writeFileSync(filePath, updatedContent);
};

const removeClassNamesFromAllFiles = async (directoryPath) => {
  const files = await globby(`${directoryPath}/**/*.tsx`);
  console.log(files);
  files.forEach((filePath) => {
    removeClassNames(filePath);
  });
};

// Get the absolute path to the 'app' folder based on the script location
const appFolderPath = path.join(__dirname, "..", "app");

// Call the function with the correct path
removeClassNamesFromAllFiles(appFolderPath);
